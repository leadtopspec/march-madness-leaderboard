// SIMPLE SYNC - Direct Supabase calls without complex subscriptions
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

class SimpleSync {
  private static listeners: ((data: TournamentData) => void)[] = []
  private static pollInterval: NodeJS.Timeout | null = null
  private static currentData: TournamentData | null = null

  static async initialize(): Promise<TournamentData> {
    console.log('🔥 SimpleSync: Starting initialization...')

    try {
      // Load data immediately
      const data = await this.loadData()
      this.currentData = data
      
      // Start aggressive polling every 2 seconds
      this.pollInterval = setInterval(async () => {
        try {
          const freshData = await this.loadData()
          
          // Compare data to see if anything changed
          const oldTotalSales = this.currentData?.salesReps.reduce((sum, rep) => sum + rep.totalSales, 0) || 0
          const newTotalSales = freshData.salesReps.reduce((sum, rep) => sum + rep.totalSales, 0)
          
          if (oldTotalSales !== newTotalSales) {
            console.log(`🔄 SimpleSync: Data changed! ${oldTotalSales} → ${newTotalSales} total sales`)
            this.currentData = freshData
            this.notifyListeners(freshData)
          }
        } catch (error) {
          console.log('🔄 SimpleSync: Polling error (non-critical):', error)
        }
      }, 2000) // Every 2 seconds
      
      console.log('✅ SimpleSync: Initialized successfully')
      return data
    } catch (error) {
      console.error('❌ SimpleSync: Initialization failed:', error)
      throw error
    }
  }

  private static async loadData(): Promise<TournamentData> {
    console.log('📊 SimpleSync: Loading data from Supabase...')
    
    try {
      // Load sales reps
      const { data: repsData, error: repsError } = await supabase
        .from('sales_reps')
        .select('*')
        .order('total_sales', { ascending: false })
        .order('total_premium', { ascending: false })

      if (repsError) throw repsError

      // Load recent sales
      const { data: salesData, error: salesError } = await supabase
        .from('sales')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(50)

      if (salesError) throw salesError

      // Transform data
      const salesReps: SalesRep[] = (repsData || []).map((rep: any, index: number) => ({
        id: rep.id,
        name: rep.name,
        totalSales: rep.total_sales || 0,
        totalPremium: rep.total_premium || 0,
        rank: index + 1,
        lastSale: new Date(rep.last_sale || '2024-03-01T00:00:00.000Z'),
        team: 'All In Agencies',
        bracketPosition: parseInt(rep.id) || index + 1
      }))

      const sales: Sale[] = (salesData || []).map((sale: any) => ({
        id: sale.id,
        repName: sale.rep_name,
        clientName: sale.client_name,
        policyType: sale.policy_type,
        premium: sale.premium,
        timestamp: new Date(sale.timestamp)
      }))

      const totalSales = salesReps.reduce((sum, rep) => sum + rep.totalSales, 0)
      console.log(`📊 SimpleSync: Loaded ${salesReps.length} reps, ${sales.length} sales, ${totalSales} total sales`)

      return {
        salesReps,
        sales,
        lastUpdated: new Date().toISOString(),
        version: Date.now()
      }
    } catch (error) {
      console.error('❌ SimpleSync: Failed to load data:', error)
      throw error
    }
  }

  static async addSale(saleData: Omit<Sale, 'id' | 'timestamp'>): Promise<void> {
    console.log('💰 SimpleSync: Adding sale:', saleData)

    try {
      // Insert sale
      const { error: saleError } = await supabase
        .from('sales')
        .insert({
          rep_name: saleData.repName,
          client_name: saleData.clientName,
          policy_type: saleData.policyType,
          premium: saleData.premium
        })

      if (saleError) throw saleError

      // Find and update the rep
      const { data: allReps } = await supabase.from('sales_reps').select('*')
      const matchingRep = allReps?.find(rep => 
        rep.name.toLowerCase().includes(saleData.repName.toLowerCase()) ||
        saleData.repName.toLowerCase().includes(rep.name.toLowerCase())
      )

      if (matchingRep) {
        await supabase
          .from('sales_reps')
          .update({
            total_sales: (matchingRep.total_sales || 0) + 1,
            total_premium: (matchingRep.total_premium || 0) + saleData.premium,
            last_sale: new Date().toISOString()
          })
          .eq('id', matchingRep.id)

        console.log(`✅ SimpleSync: Updated ${matchingRep.name}`)
      }

      // Force immediate refresh
      setTimeout(async () => {
        const freshData = await this.loadData()
        this.currentData = freshData
        this.notifyListeners(freshData)
      }, 500)

    } catch (error) {
      console.error('❌ SimpleSync: Failed to add sale:', error)
      throw error
    }
  }

  static async deleteSale(saleId: string): Promise<void> {
    console.log('🗑️ SimpleSync: Deleting sale:', saleId)

    try {
      // Get sale details
      const { data: sale } = await supabase
        .from('sales')
        .select('*')
        .eq('id', saleId)
        .single()

      if (!sale) return

      // Delete sale
      await supabase.from('sales').delete().eq('id', saleId)

      // Update rep
      const { data: allReps } = await supabase.from('sales_reps').select('*')
      const matchingRep = allReps?.find(rep => 
        rep.name.toLowerCase().includes(sale.rep_name.toLowerCase())
      )

      if (matchingRep) {
        await supabase
          .from('sales_reps')
          .update({
            total_sales: Math.max(0, (matchingRep.total_sales || 0) - 1),
            total_premium: Math.max(0, (matchingRep.total_premium || 0) - sale.premium)
          })
          .eq('id', matchingRep.id)
      }

      // Force immediate refresh
      setTimeout(async () => {
        const freshData = await this.loadData()
        this.currentData = freshData
        this.notifyListeners(freshData)
      }, 500)

    } catch (error) {
      console.error('❌ SimpleSync: Failed to delete sale:', error)
      throw error
    }
  }

  static subscribe(callback: (data: TournamentData) => void): () => void {
    this.listeners.push(callback)
    console.log(`📢 SimpleSync: Added listener, total: ${this.listeners.length}`)
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback)
    }
  }

  private static notifyListeners(data: TournamentData): void {
    console.log('📢 SimpleSync: Notifying listeners')
    this.listeners.forEach(callback => {
      try {
        callback(data)
      } catch (e) {
        console.error('❌ SimpleSync: Listener error:', e)
      }
    })
  }

  static cleanup(): void {
    console.log('🧹 SimpleSync: Cleaning up')
    if (this.pollInterval) {
      clearInterval(this.pollInterval)
      this.pollInterval = null
    }
    this.listeners = []
  }
}

export default SimpleSync