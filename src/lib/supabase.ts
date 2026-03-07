import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
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
  id: string
  rep_name: string
  client_name: string
  policy_type: string
  premium: number
  timestamp: string
}

// Database operations
export class TournamentDB {
  static async getSalesReps(): Promise<SalesRep[]> {
    const { data, error } = await supabase
      .from('sales_reps')
      .select('*')
      .order('total_sales', { ascending: false })
      .order('total_premium', { ascending: false })
    
    if (error) {
      console.error('Error fetching sales reps:', error)
      return []
    }
    
    return data || []
  }

  static async getSales(): Promise<Sale[]> {
    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(20)
    
    if (error) {
      console.error('Error fetching sales:', error)
      return []
    }
    
    return data || []
  }

  static async recordSale(sale: Omit<Sale, 'id' | 'timestamp'>): Promise<Sale | null> {
    const newSale = {
      ...sale,
      timestamp: new Date().toISOString()
    }

    // Insert the sale
    const { data: saleData, error: saleError } = await supabase
      .from('sales')
      .insert(newSale)
      .select()
      .single()
    
    if (saleError) {
      console.error('Error recording sale:', saleError)
      return null
    }

    // Update the sales rep stats
    const { error: updateError } = await supabase.rpc('update_rep_stats', {
      rep_name: sale.rep_name,
      premium_amount: sale.premium
    })

    if (updateError) {
      console.error('Error updating rep stats:', updateError)
      return null
    }

    return saleData
  }

  static async deleteSale(saleId: string): Promise<boolean> {
    // First get the sale to know which rep to update
    const { data: sale, error: fetchError } = await supabase
      .from('sales')
      .select('rep_name, premium')
      .eq('id', saleId)
      .single()
    
    if (fetchError) {
      console.error('Error fetching sale for deletion:', fetchError)
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

    // Update the sales rep stats (subtract the sale)
    const { error: updateError } = await supabase.rpc('subtract_rep_stats', {
      rep_name: sale.rep_name,
      premium_amount: sale.premium
    })

    if (updateError) {
      console.error('Error updating rep stats after deletion:', updateError)
      return false
    }

    return true
  }

  static async initializeReps() {
    // Check if reps are already initialized
    const { data: existingReps } = await supabase
      .from('sales_reps')
      .select('id')
      .limit(1)
    
    if (existingReps && existingReps.length > 0) {
      console.log('Sales reps already initialized')
      return
    }

    // Initialize with all 34 agents
    const initialReps = [
      'MAX KONOPKA', 'ROBERT BRADY', 'ZION RUSSELL', 'BYRON ACHA', 'JOSE VALDEZ',
      'JADEN POPE', 'WESTON CHRISTOPHER', 'NOLAN SCHOENBACHLER', 'THOMAS FOX', 'JEREMI KISINSKI',
      'JAKE DOLL', 'DANIEL SUAREZ', 'RYAN BOVE', 'RYAN COOPER', 'LUCAS KONSTATOS',
      'ANTHONY MAYROSE', 'ANDREW FLASKAMP', 'FABIAN ESCATEL', 'KAMREN HERALD', 'JAYLEN BISCHOFF',
      'BRENNAN SKODA', 'AALYIAH WASHBURN', 'KADEN CAMENZIND', 'HANNAH FRENCH', 'MICHAEL CARNEY',
      'TAJ DHILLON', 'JACOB LEE', 'ADRIEN RAMÍREZ-RAYO', 'DENNIS CHORNIY', 'CHARLIE SIMMS',
      'BRENON REED', 'KIRILL PAVLYCHEV', 'LAINEY DROWN', 'VALERIA ALVAL'
    ]

    const repsToInsert = initialReps.map((name, index) => ({
      id: (index + 1).toString(),
      name,
      total_sales: 0,
      total_premium: 0,
      rank: index + 1,
      last_sale: '2024-03-01T00:00:00.000Z',
      team: 'All In Agencies',
      bracket_position: index + 1
    }))

    const { error } = await supabase
      .from('sales_reps')
      .insert(repsToInsert)
    
    if (error) {
      console.error('Error initializing sales reps:', error)
    } else {
      console.log('Sales reps initialized successfully')
    }
  }

  static subscribeToChanges(onSalesRepsChange: (reps: SalesRep[]) => void, onSalesChange: (sales: Sale[]) => void) {
    // Subscribe to sales_reps changes
    const repsSubscription = supabase
      .channel('sales_reps_channel')
      .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'sales_reps' }, 
          async () => {
            const reps = await this.getSalesReps()
            onSalesRepsChange(reps)
          }
      )
      .subscribe()

    // Subscribe to sales changes
    const salesSubscription = supabase
      .channel('sales_channel')
      .on('postgres_changes',
          { event: '*', schema: 'public', table: 'sales' },
          async () => {
            const sales = await this.getSales()
            onSalesChange(sales)
          }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(repsSubscription)
      supabase.removeChannel(salesSubscription)
    }
  }
}