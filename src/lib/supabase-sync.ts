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
      console.log('🔄 Falling back to Round 2 mock data...')
      
      // Round 2 mock data with active matchups and sales
      const mockSalesReps: SalesRep[] = [
        { id: '1', name: 'BYRON ACHA', totalSales: 8, totalPremium: 12500, rank: 1, lastSale: new Date('2026-03-20T15:30:00Z'), team: 'All In Agencies', bracketPosition: 1 },
        { id: '2', name: 'TIVON BURNS', totalSales: 7, totalPremium: 11200, rank: 2, lastSale: new Date('2026-03-20T14:45:00Z'), team: 'All In Agencies', bracketPosition: 2 },
        { id: '3', name: 'HANNAH FRENCH', totalSales: 6, totalPremium: 9800, rank: 3, lastSale: new Date('2026-03-20T16:20:00Z'), team: 'All In Agencies', bracketPosition: 3 },
        { id: '4', name: 'TAJ DHILLON', totalSales: 5, totalPremium: 8300, rank: 4, lastSale: new Date('2026-03-20T13:10:00Z'), team: 'All In Agencies', bracketPosition: 4 },
        { id: '13', name: 'THOMAS FOX', totalSales: 3, totalPremium: 4250, rank: 13, lastSale: new Date('2026-03-19T10:30:00Z'), team: 'All In Agencies', bracketPosition: 13 },
        { id: '5', name: 'KADEN BAKER', totalSales: 4, totalPremium: 6100, rank: 5, lastSale: new Date('2026-03-20T11:15:00Z'), team: 'All In Agencies', bracketPosition: 5 },
        { id: '6', name: 'LINDSEY NOONAN', totalSales: 4, totalPremium: 5900, rank: 6, lastSale: new Date('2026-03-20T12:30:00Z'), team: 'All In Agencies', bracketPosition: 6 },
        { id: '7', name: 'MAX KONOPKA', totalSales: 3, totalPremium: 5200, rank: 7, lastSale: new Date('2026-03-20T09:45:00Z'), team: 'All In Agencies', bracketPosition: 7 },
        { id: '8', name: 'MICHAEL CARNEY', totalSales: 3, totalPremium: 4800, rank: 8, lastSale: new Date('2026-03-20T14:15:00Z'), team: 'All In Agencies', bracketPosition: 8 },
        { id: '9', name: 'AALYIAH WASHBURN', totalSales: 2, totalPremium: 3900, rank: 9, lastSale: new Date('2026-03-19T16:20:00Z'), team: 'All In Agencies', bracketPosition: 9 },
        { id: '10', name: 'JAKE DOLL', totalSales: 2, totalPremium: 3600, rank: 10, lastSale: new Date('2026-03-19T14:30:00Z'), team: 'All In Agencies', bracketPosition: 10 },
        { id: '11', name: 'BRENNAN SKODA', totalSales: 2, totalPremium: 3200, rank: 11, lastSale: new Date('2026-03-19T11:45:00Z'), team: 'All In Agencies', bracketPosition: 11 },
        { id: '12', name: 'RYAN BOVE', totalSales: 1, totalPremium: 2100, rank: 12, lastSale: new Date('2026-03-18T15:20:00Z'), team: 'All In Agencies', bracketPosition: 12 },
        { id: '14', name: 'NOLAN SCHOENBACHLER', totalSales: 1, totalPremium: 1800, rank: 14, lastSale: new Date('2026-03-18T10:15:00Z'), team: 'All In Agencies', bracketPosition: 14 },
        { id: '15', name: 'JADEN POPE', totalSales: 1, totalPremium: 1500, rank: 15, lastSale: new Date('2026-03-17T14:30:00Z'), team: 'All In Agencies', bracketPosition: 15 },
        // Round 2 participants
        { id: '31', name: 'VALERIA ALVAL', totalSales: 2, totalPremium: 3100, rank: 31, lastSale: new Date('2026-03-19T13:20:00Z'), team: 'All In Agencies', bracketPosition: 31 },
        { id: '28', name: 'LUCAS KONSTATOS', totalSales: 2, totalPremium: 2800, rank: 28, lastSale: new Date('2026-03-19T11:45:00Z'), team: 'All In Agencies', bracketPosition: 28 },
        { id: '25', name: 'KAMREN HERALD', totalSales: 1, totalPremium: 1900, rank: 25, lastSale: new Date('2026-03-18T16:30:00Z'), team: 'All In Agencies', bracketPosition: 25 },
        { id: '34', name: 'FABIAN ESCATEL', totalSales: 1, totalPremium: 1700, rank: 34, lastSale: new Date('2026-03-18T09:15:00Z'), team: 'All In Agencies', bracketPosition: 34 },
        { id: '33', name: 'JOSE VALDEZ', totalSales: 2, totalPremium: 2400, rank: 33, lastSale: new Date('2026-03-19T15:45:00Z'), team: 'All In Agencies', bracketPosition: 33 },
        { id: '16', name: 'RYAN COOPER', totalSales: 1, totalPremium: 1600, rank: 16, lastSale: new Date('2026-03-17T12:20:00Z'), team: 'All In Agencies', bracketPosition: 16 },
        { id: '21', name: 'DENNIS CHORNIY', totalSales: 1, totalPremium: 1400, rank: 21, lastSale: new Date('2026-03-17T10:30:00Z'), team: 'All In Agencies', bracketPosition: 21 },
        { id: '30', name: 'JACOB LEE', totalSales: 1, totalPremium: 1300, rank: 30, lastSale: new Date('2026-03-17T08:45:00Z'), team: 'All In Agencies', bracketPosition: 30 },
        { id: '36', name: 'KIRILL PAVLYCHEV', totalSales: 1, totalPremium: 1200, rank: 36, lastSale: new Date('2026-03-16T16:15:00Z'), team: 'All In Agencies', bracketPosition: 36 }
      ]

      const mockSales: Sale[] = [
        { id: '1', repName: 'THOMAS FOX', clientName: 'John Smith', policyType: 'IUL', premium: 1500, timestamp: new Date('2026-03-19T10:30:00Z') },
        { id: '2', repName: 'THOMAS FOX', clientName: 'Mary Johnson', policyType: 'Term Life', premium: 1250, timestamp: new Date('2026-03-18T14:15:00Z') },
        { id: '3', repName: 'THOMAS FOX', clientName: 'Robert Davis', policyType: 'Whole Life', premium: 1500, timestamp: new Date('2026-03-17T09:45:00Z') },
        { id: '4', repName: 'BYRON ACHA', clientName: 'Sarah Wilson', policyType: 'IUL', premium: 2200, timestamp: new Date('2026-03-20T15:30:00Z') },
        { id: '5', repName: 'TIVON BURNS', clientName: 'Mike Brown', policyType: 'Term Life', premium: 1800, timestamp: new Date('2026-03-20T14:45:00Z') },
        { id: '6', repName: 'HANNAH FRENCH', clientName: 'Lisa Garcia', policyType: 'Whole Life', premium: 1900, timestamp: new Date('2026-03-20T16:20:00Z') }
      ]

      console.log('✅ Using Round 2 mock data with', mockSalesReps.length, 'reps and', mockSales.length, 'sales')

      return {
        salesReps: mockSalesReps,
        sales: mockSales,
        lastUpdated: new Date().toISOString(),
        version: Date.now()
      }
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

      // Update the sales rep's totals using EXACT name matching
      const { data: existingRep, error: repError } = await supabase
        .from('sales_reps')
        .select('*')
        .eq('name', saleData.repName)
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