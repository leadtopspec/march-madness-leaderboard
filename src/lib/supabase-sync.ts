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

class SupabaseSync {
  private static listeners: ((data: TournamentData) => void)[] = []
  private static isInitialized = false
  private static currentData: TournamentData | null = null

  static async initialize(): Promise<TournamentData> {
    if (this.isInitialized && this.currentData) {
      return this.currentData
    }

    // Check if Supabase is available
    if (!supabase) {
      console.warn('⚠️ Supabase client not available, falling back to EmergencyFallback')
      throw new Error('Supabase not configured')
    }

    console.log('🚀 Initializing SupabaseSync with real-time subscriptions...')

    // Load initial data
    const data = await this.loadData()
    this.currentData = data

    // Set up real-time subscriptions
    this.setupRealtimeSubscriptions()

    this.isInitialized = true
    return data
  }

  private static async loadData(): Promise<TournamentData> {
    try {
      console.log('📊 Loading data from Supabase...')
      
      if (!supabase) {
        throw new Error('Supabase client not available')
      }
      
      // Load sales reps
      const { data: repsData, error: repsError } = await supabase
        .from('sales_reps')
        .select('*')
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
      const salesReps: SalesRep[] = (repsData || []).map((rep: any) => ({
        id: rep.id,
        name: rep.name,
        totalSales: rep.total_sales || 0,
        totalPremium: rep.total_premium || 0,
        rank: rep.rank || 1,
        lastSale: new Date(rep.last_sale),
        team: rep.team || 'All In Agencies',
        bracketPosition: rep.bracket_position || 1
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
    console.log('📡 Setting up real-time subscriptions...')

    if (!supabase) {
      console.warn('⚠️ Cannot set up real-time subscriptions: Supabase client not available')
      return
    }

    // Subscribe to sales_reps changes
    supabase
      .channel('sales_reps_realtime')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'sales_reps' }, 
        (payload) => {
          console.log('📊 Sales reps table changed:', payload)
          this.refreshData()
        }
      )
      .subscribe((status) => {
        console.log('📡 Sales reps subscription status:', status)
      })

    // Subscribe to sales changes
    supabase
      .channel('sales_realtime')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'sales' }, 
        (payload) => {
          console.log('💰 Sales table changed:', payload)
          this.refreshData()
        }
      )
      .subscribe((status) => {
        console.log('📡 Sales subscription status:', status)
      })
  }

  private static async refreshData(): Promise<void> {
    try {
      const freshData = await this.loadData()
      this.currentData = freshData
      this.notifyListeners(freshData)
    } catch (error) {
      console.error('❌ Failed to refresh data:', error)
    }
  }

  static async addSale(saleData: Omit<Sale, 'id' | 'timestamp'>): Promise<void> {
    console.log('💰 Adding sale via Supabase:', saleData)

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

      // Update the sales rep's totals using a more flexible name matching approach
      const { data: existingRep, error: repError } = await supabase
        .from('sales_reps')
        .select('*')
        .or(`name.ilike.%${saleData.repName}%,name.ilike.%${saleData.repName.split(' ')[0]}%`)
        .limit(1)
        .single()

      if (repError && repError.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('❌ Error finding sales rep:', repError)
        throw repError
      }

      if (existingRep) {
        const { error: updateError } = await supabase
          .from('sales_reps')
          .update({
            total_sales: (existingRep.total_sales || 0) + 1,
            total_premium: (existingRep.total_premium || 0) + saleData.premium,
            last_sale: new Date().toISOString()
          })
          .eq('id', existingRep.id)

        if (updateError) {
          console.error('❌ Error updating sales rep:', updateError)
          throw updateError
        }

        console.log(`✅ Updated ${existingRep.name}: ${existingRep.total_sales} → ${(existingRep.total_sales || 0) + 1} sales`)
      } else {
        console.warn(`⚠️ No matching sales rep found for: ${saleData.repName}`)
      }

      // Recalculate ranks
      await this.recalculateRanks()
      
    } catch (error) {
      console.error('❌ Failed to add sale:', error)
      throw error
    }
  }

  static async deleteSale(saleId: string): Promise<void> {
    console.log('🗑️ Deleting sale via Supabase:', saleId)

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

      // Update the sales rep's totals
      const { data: existingRep, error: repError } = await supabase
        .from('sales_reps')
        .select('*')
        .or(`name.ilike.%${sale.rep_name}%,name.ilike.%${sale.rep_name.split(' ')[0]}%`)
        .limit(1)
        .single()

      if (repError && repError.code !== 'PGRST116') {
        console.error('❌ Error finding sales rep for deletion update:', repError)
        throw repError
      }

      if (existingRep) {
        const { error: updateError } = await supabase
          .from('sales_reps')
          .update({
            total_sales: Math.max(0, (existingRep.total_sales || 0) - 1),
            total_premium: Math.max(0, (existingRep.total_premium || 0) - sale.premium)
          })
          .eq('id', existingRep.id)

        if (updateError) {
          console.error('❌ Error updating sales rep after deletion:', updateError)
          throw updateError
        }

        console.log(`✅ Updated ${existingRep.name} after deletion: ${existingRep.total_sales} → ${Math.max(0, (existingRep.total_sales || 0) - 1)} sales`)
      }

      // Recalculate ranks
      await this.recalculateRanks()
      
    } catch (error) {
      console.error('❌ Failed to delete sale:', error)
      throw error
    }
  }

  private static async recalculateRanks(): Promise<void> {
    console.log('📊 Recalculating ranks...')
    
    try {
      // Get all reps ordered by performance
      const { data: reps, error } = await supabase
        .from('sales_reps')
        .select('id, total_sales, total_premium')
        .order('total_sales', { ascending: false })
        .order('total_premium', { ascending: false })

      if (error) {
        console.error('❌ Error fetching reps for ranking:', error)
        return
      }

      // Update ranks
      const updates = (reps || []).map((rep, index) => ({
        id: rep.id,
        rank: index + 1
      }))

      for (const update of updates) {
        await supabase
          .from('sales_reps')
          .update({ rank: update.rank })
          .eq('id', update.id)
      }

      console.log('✅ Ranks recalculated')
    } catch (error) {
      console.error('❌ Failed to recalculate ranks:', error)
    }
  }

  static subscribe(callback: (data: TournamentData) => void): () => void {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback)
    }
  }

  private static notifyListeners(data: TournamentData): void {
    console.log('📢 Notifying', this.listeners.length, 'listeners of data update')
    this.listeners.forEach(callback => {
      try {
        callback(data)
      } catch (e) {
        console.error('❌ Listener error:', e)
      }
    })
  }

  static cleanup(): void {
    console.log('🧹 Cleaning up SupabaseSync subscriptions')
    supabase.removeAllChannels()
    this.listeners = []
    this.isInitialized = false
    this.currentData = null
  }

  static async hardReset(): Promise<void> {
    console.log('🔄 HARD RESET: Resetting all tournament data in Supabase')
    
    try {
      // Delete all sales
      await supabase.from('sales').delete().neq('id', '00000000-0000-0000-0000-000000000000') // Delete all
      
      // Reset all sales rep totals
      await supabase
        .from('sales_reps')
        .update({
          total_sales: 0,
          total_premium: 0,
          rank: 1,
          last_sale: '2024-03-01T00:00:00.000Z'
        })
        .neq('id', '0') // Update all

      console.log('✅ Hard reset complete')
    } catch (error) {
      console.error('❌ Hard reset failed:', error)
      throw error
    }
  }
}

export default SupabaseSync