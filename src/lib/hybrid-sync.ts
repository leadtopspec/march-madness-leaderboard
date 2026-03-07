import { supabase } from './supabase'

export interface SalesRep {
  id: string
  name: string
  totalSales: number
  totalPremium: number
  rank: number
  lastSale: Date
  team: string
  bracketPosition: number
}

export interface Sale {
  id: string
  repName: string
  clientName: string
  policyType: string
  premium: number
  timestamp: Date
}

interface TournamentData {
  salesReps: SalesRep[]
  sales: Sale[]
  lastUpdated: string
  version: number
}

class HybridSync {
  private static listeners: ((data: TournamentData) => void)[] = []
  private static isInitialized = false
  private static currentData: TournamentData | null = null
  private static pollInterval: NodeJS.Timeout | null = null
  private static lastPollTime = 0

  static async initialize(): Promise<TournamentData> {
    if (this.isInitialized && this.currentData) {
      return this.currentData
    }

    console.log('🚀 Initializing HybridSync (Supabase + Polling)...')

    // Load initial data
    const data = await this.loadData()
    this.currentData = data

    // Set up real-time subscriptions (primary)
    this.setupRealtimeSubscriptions()

    // Set up polling fallback (secondary, every 3 seconds)
    this.pollInterval = setInterval(() => {
      this.pollForUpdates()
    }, 3000)

    this.isInitialized = true
    return data
  }

  private static async loadData(): Promise<TournamentData> {
    try {
      console.log('📊 Loading data from Supabase...')
      
      // Load sales reps with proper ordering
      const { data: repsData, error: repsError } = await supabase
        .from('sales_reps')
        .select('*')
        .order('total_sales', { ascending: false })
        .order('total_premium', { ascending: false })

      if (repsError) {
        console.error('❌ Error loading sales reps:', repsError)
        throw repsError
      }

      // Load sales
      const { data: salesData, error: salesError } = await supabase
        .from('sales')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100)

      if (salesError) {
        console.error('❌ Error loading sales:', salesError)
        throw salesError
      }

      // Transform data to match our interface
      const salesReps: SalesRep[] = (repsData || []).map((rep: any, index: number) => ({
        id: rep.id,
        name: rep.name,
        totalSales: rep.total_sales || 0,
        totalPremium: rep.total_premium || 0,
        rank: index + 1, // Assign rank based on sorted order
        lastSale: new Date(rep.last_sale),
        team: rep.team || 'All In Agencies',
        bracketPosition: rep.bracket_position || parseInt(rep.id) || 1
      }))

      const sales: Sale[] = (salesData || []).map((sale: any) => ({
        id: sale.id,
        repName: sale.rep_name,
        clientName: sale.client_name,
        policyType: sale.policy_type,
        premium: sale.premium,
        timestamp: new Date(sale.timestamp)
      }))

      console.log(`✅ Loaded ${salesReps.length} reps and ${sales.length} sales from Supabase`)
      
      // Log current totals for debugging
      const totalSales = salesReps.reduce((sum, rep) => sum + rep.totalSales, 0)
      const totalPremium = salesReps.reduce((sum, rep) => sum + rep.totalPremium, 0)
      console.log(`📊 Current totals: ${totalSales} sales, $${totalPremium} premium`)

      return {
        salesReps,
        sales,
        lastUpdated: new Date().toISOString(),
        version: Date.now()
      }
    } catch (error) {
      console.error('❌ Failed to load data from Supabase:', error)
      throw error
    }
  }

  private static setupRealtimeSubscriptions(): void {
    console.log('📡 Setting up Supabase real-time subscriptions...')

    // Subscribe to sales_reps changes
    supabase
      .channel('hybrid_sales_reps')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'sales_reps' }, 
        (payload) => {
          console.log('📊 Real-time: Sales reps table changed:', payload.eventType, payload.new?.name)
          this.refreshData()
        }
      )
      .subscribe((status) => {
        console.log('📡 Sales reps subscription status:', status)
      })

    // Subscribe to sales changes
    supabase
      .channel('hybrid_sales')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'sales' }, 
        (payload) => {
          console.log('💰 Real-time: Sales table changed:', payload.eventType, payload.new?.rep_name)
          this.refreshData()
        }
      )
      .subscribe((status) => {
        console.log('📡 Sales subscription status:', status)
      })
  }

  private static async pollForUpdates(): Promise<void> {
    const now = Date.now()
    if (now - this.lastPollTime < 2500) return // Avoid too frequent polling
    
    this.lastPollTime = now

    try {
      // Quick check: get total sales count to see if anything changed
      const { count: salesCount } = await supabase
        .from('sales')
        .select('*', { count: 'exact', head: true })

      const { count: repsCount } = await supabase
        .from('sales_reps')
        .select('*', { count: 'exact', head: true })

      const currentSalesCount = this.currentData?.sales.length || 0
      const currentRepsCount = this.currentData?.salesReps.length || 0

      if (salesCount !== currentSalesCount || repsCount !== currentRepsCount) {
        console.log(`🔄 Polling: Detected changes (sales: ${currentSalesCount}→${salesCount}, reps: ${currentRepsCount}→${repsCount})`)
        await this.refreshData()
      }
    } catch (error) {
      console.log('🔄 Polling error (non-critical):', error)
    }
  }

  private static async refreshData(): Promise<void> {
    try {
      console.log('🔄 Refreshing data from Supabase...')
      const freshData = await this.loadData()
      this.currentData = freshData
      this.notifyListeners(freshData)
    } catch (error) {
      console.error('❌ Failed to refresh data:', error)
    }
  }

  static async addSale(saleData: Omit<Sale, 'id' | 'timestamp'>): Promise<void> {
    console.log('💰 Adding sale via HybridSync:', saleData)

    try {
      // Insert the sale
      const { data: saleResult, error: saleError } = await supabase
        .from('sales')
        .insert([{
          rep_name: saleData.repName,
          client_name: saleData.clientName,
          policy_type: saleData.policyType,
          premium: saleData.premium,
          timestamp: new Date().toISOString()
        }])
        .select()

      if (saleError) {
        console.error('❌ Error adding sale:', saleError)
        throw saleError
      }

      console.log('✅ Sale added to database')

      // Find the sales rep with flexible matching
      const { data: allReps } = await supabase
        .from('sales_reps')
        .select('*')

      const matchingRep = allReps?.find(rep => 
        this.isNameMatch(rep.name, saleData.repName)
      )

      if (matchingRep) {
        console.log(`👤 Found matching rep: ${matchingRep.name} for input: ${saleData.repName}`)
        
        const { error: updateError } = await supabase
          .from('sales_reps')
          .update({
            total_sales: (matchingRep.total_sales || 0) + 1,
            total_premium: (matchingRep.total_premium || 0) + saleData.premium,
            last_sale: new Date().toISOString()
          })
          .eq('id', matchingRep.id)

        if (updateError) {
          console.error('❌ Error updating sales rep:', updateError)
          throw updateError
        }

        console.log(`✅ Updated ${matchingRep.name}: ${matchingRep.total_sales} → ${(matchingRep.total_sales || 0) + 1} sales`)
      } else {
        console.warn(`⚠️ No matching sales rep found for: ${saleData.repName}`)
        console.log('Available reps:', allReps?.map(r => r.name))
      }

      // Force immediate refresh to update UI
      setTimeout(() => this.refreshData(), 100)
      
    } catch (error) {
      console.error('❌ Failed to add sale:', error)
      throw error
    }
  }

  static async deleteSale(saleId: string): Promise<void> {
    console.log('🗑️ Deleting sale via HybridSync:', saleId)

    try {
      // Get the sale details first
      const { data: sale, error: getSaleError } = await supabase
        .from('sales')
        .select('*')
        .eq('id', saleId)
        .single()

      if (getSaleError) {
        console.error('❌ Error finding sale to delete:', getSaleError)
        throw getSaleError
      }

      if (!sale) {
        console.warn('⚠️ Sale not found for deletion')
        return
      }

      // Delete the sale
      const { error: deleteError } = await supabase
        .from('sales')
        .delete()
        .eq('id', saleId)

      if (deleteError) {
        console.error('❌ Error deleting sale:', deleteError)
        throw deleteError
      }

      console.log('✅ Sale deleted from database')

      // Find and update the sales rep
      const { data: allReps } = await supabase
        .from('sales_reps')
        .select('*')

      const matchingRep = allReps?.find(rep => 
        this.isNameMatch(rep.name, sale.rep_name)
      )

      if (matchingRep) {
        const { error: updateError } = await supabase
          .from('sales_reps')
          .update({
            total_sales: Math.max(0, (matchingRep.total_sales || 0) - 1),
            total_premium: Math.max(0, (matchingRep.total_premium || 0) - sale.premium)
          })
          .eq('id', matchingRep.id)

        if (updateError) {
          console.error('❌ Error updating sales rep after deletion:', updateError)
          throw updateError
        }

        console.log(`✅ Updated ${matchingRep.name} after deletion: ${matchingRep.total_sales} → ${Math.max(0, (matchingRep.total_sales || 0) - 1)} sales`)
      }

      // Force immediate refresh to update UI
      setTimeout(() => this.refreshData(), 100)
      
    } catch (error) {
      console.error('❌ Failed to delete sale:', error)
      throw error
    }
  }

  private static isNameMatch(fullName: string, inputName: string): boolean {
    const full = fullName.toLowerCase().trim()
    const input = inputName.toLowerCase().trim()
    
    // Exact match
    if (full === input) return true
    
    // Check if input is contained in full name or vice versa
    if (full.includes(input) || input.includes(full)) return true
    
    // Check first name + last name combinations
    const fullParts = full.split(' ')
    const inputParts = input.split(' ')
    
    // Check if any part matches
    return fullParts.some(part => inputParts.some(inputPart => 
      part === inputPart || part.includes(inputPart) || inputPart.includes(part)
    ))
  }

  static subscribe(callback: (data: TournamentData) => void): () => void {
    this.listeners.push(callback)
    console.log(`📢 Added listener, total: ${this.listeners.length}`)
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback)
      console.log(`📢 Removed listener, total: ${this.listeners.length}`)
    }
  }

  private static notifyListeners(data: TournamentData): void {
    console.log('📢 Notifying', this.listeners.length, 'listeners of data update')
    const totalSales = data.salesReps.reduce((sum, rep) => sum + rep.totalSales, 0)
    console.log(`📊 Update: ${totalSales} total sales, ${data.sales.length} sales records`)
    
    this.listeners.forEach((callback, index) => {
      try {
        callback(data)
      } catch (e) {
        console.error(`❌ Listener ${index} error:`, e)
      }
    })
  }

  static cleanup(): void {
    console.log('🧹 Cleaning up HybridSync')
    
    if (this.pollInterval) {
      clearInterval(this.pollInterval)
      this.pollInterval = null
    }
    
    supabase.removeAllChannels()
    this.listeners = []
    this.isInitialized = false
    this.currentData = null
  }

  static async hardReset(): Promise<void> {
    console.log('🔄 HARD RESET: Resetting all tournament data')
    
    try {
      // Delete all sales
      await supabase.from('sales').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      
      // Reset all sales rep totals
      await supabase
        .from('sales_reps')
        .update({
          total_sales: 0,
          total_premium: 0,
          last_sale: '2024-03-01T00:00:00.000Z'
        })
        .neq('id', '0')

      console.log('✅ Hard reset complete')
      
      // Force refresh
      await this.refreshData()
    } catch (error) {
      console.error('❌ Hard reset failed:', error)
      throw error
    }
  }

  static getCurrentData(): TournamentData | null {
    return this.currentData
  }
}

export default HybridSync