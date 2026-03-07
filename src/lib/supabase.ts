import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface SalesRep {
  id: string
  name: string
  total_sales: number
  total_premium: number
  rank: number
  last_sale: string
  team: string
  bracket_position: number
}

export interface Sale {
  id?: string
  rep_name: string
  client_name: string
  policy_type: string
  premium: number
  timestamp?: string
}

export class SupabaseSync {
  private static instance: SupabaseSync
  private listeners: Array<() => void> = []

  static getInstance(): SupabaseSync {
    if (!SupabaseSync.instance) {
      SupabaseSync.instance = new SupabaseSync()
    }
    return SupabaseSync.instance
  }

  // Subscribe to real-time changes
  subscribeToChanges(callback: () => void) {
    this.listeners.push(callback)
    
    // Subscribe to sales_reps changes
    supabase
      .channel('sales_reps_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'sales_reps' }, 
        () => {
          this.notifyListeners()
        }
      )
      .subscribe()

    // Subscribe to sales changes
    supabase
      .channel('sales_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'sales' }, 
        () => {
          this.notifyListeners()
        }
      )
      .subscribe()
  }

  private notifyListeners() {
    this.listeners.forEach(callback => callback())
  }

  // Get all sales reps, sorted by total_premium descending
  async getSalesReps(): Promise<SalesRep[]> {
    const { data, error } = await supabase
      .from('sales_reps')
      .select('*')
      .order('total_premium', { ascending: false })

    if (error) {
      console.error('Error fetching sales reps:', error)
      return []
    }

    return data || []
  }

  // Get all sales
  async getSales(): Promise<Sale[]> {
    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .order('timestamp', { ascending: false })

    if (error) {
      console.error('Error fetching sales:', error)
      return []
    }

    return data || []
  }

  // Add a new sale
  async addSale(sale: Omit<Sale, 'id' | 'timestamp'>): Promise<boolean> {
    const { error: saleError } = await supabase
      .from('sales')
      .insert([{
        rep_name: sale.rep_name,
        client_name: sale.client_name,
        policy_type: sale.policy_type,
        premium: sale.premium,
        timestamp: new Date().toISOString()
      }])

    if (saleError) {
      console.error('Error adding sale:', saleError)
      return false
    }

    // Update the sales rep's totals
    const { data: currentRep } = await supabase
      .from('sales_reps')
      .select('total_sales, total_premium')
      .eq('name', sale.rep_name)
      .single()

    if (currentRep) {
      const { error: updateError } = await supabase
        .from('sales_reps')
        .update({
          total_sales: currentRep.total_sales + 1,
          total_premium: currentRep.total_premium + sale.premium,
          last_sale: new Date().toISOString()
        })
        .eq('name', sale.rep_name)

      if (updateError) {
        console.error('Error updating sales rep:', updateError)
        return false
      }
    }

    return true
  }

  // Delete a sale
  async deleteSale(saleId: string): Promise<boolean> {
    // First get the sale details
    const { data: sale } = await supabase
      .from('sales')
      .select('*')
      .eq('id', saleId)
      .single()

    if (!sale) {
      console.error('Sale not found')
      return false
    }

    // Delete the sale
    const { error: deleteError } = await supabase
      .from('sales')
      .delete()
      .eq('id', saleId)

    if (deleteError) {
      console.error('Error deleting sale:', deleteError)
      return false
    }

    // Update the sales rep's totals
    const { data: currentRep } = await supabase
      .from('sales_reps')
      .select('total_sales, total_premium')
      .eq('name', sale.rep_name)
      .single()

    if (currentRep) {
      const { error: updateError } = await supabase
        .from('sales_reps')
        .update({
          total_sales: Math.max(0, currentRep.total_sales - 1),
          total_premium: Math.max(0, currentRep.total_premium - sale.premium)
        })
        .eq('name', sale.rep_name)

      if (updateError) {
        console.error('Error updating sales rep after deletion:', updateError)
        return false
      }
    }

    return true
  }

  // Recalculate all totals (useful for data integrity)
  async recalculateTotals(): Promise<void> {
    const { data: sales } = await supabase
      .from('sales')
      .select('rep_name, premium')

    if (!sales) return

    // Group sales by rep
    const repTotals: { [key: string]: { count: number, total: number } } = {}
    sales.forEach(sale => {
      if (!repTotals[sale.rep_name]) {
        repTotals[sale.rep_name] = { count: 0, total: 0 }
      }
      repTotals[sale.rep_name].count++
      repTotals[sale.rep_name].total += sale.premium
    })

    // Update each rep
    for (const [repName, totals] of Object.entries(repTotals)) {
      await supabase
        .from('sales_reps')
        .update({
          total_sales: totals.count,
          total_premium: totals.total
        })
        .eq('name', repName)
    }
  }
}