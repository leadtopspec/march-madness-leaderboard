import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

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

class SupabaseSync {
  private static readonly AGENTS = [
    'MAX KONOPKA', 'ROBERT BRADY', 'ZION RUSSELL', 'BYRON ACHA', 'JOSE VALDEZ',
    'JADEN POPE', 'WESTON CHRISTOPHER', 'NOLAN SCHOENBACHLER', 'THOMAS FOX', 'JEREMI KISINSKI',
    'JAKE DOLL', 'DANIEL SUAREZ', 'RYAN BOVE', 'RYAN COOPER', 'LUCAS KONSTATOS',
    'ANTHONY MAYROSE', 'ANDREW FLASKAMP', 'FABIAN ESCATEL', 'KAMREN HERALD', 'JAYLEN BISCHOFF',
    'BRENNAN SKODA', 'AALYIAH WASHBURN', 'KADEN CAMENZIND', 'HANNAH FRENCH', 'MICHAEL CARNEY',
    'TAJ DHILLON', 'JACOB LEE', 'ADRIEN RAMÍREZ-RAYO', 'DENNIS CHORNIY', 'CHARLIE SIMMS',
    'BRENON REED', 'KIRILL PAVLYCHEV', 'LAINEY DROWN', 'VALERIA ALVAL'
  ]

  // Initialize database tables and data
  static async initialize(): Promise<void> {
    try {
      // Create sales_reps table
      const { error: createRepsError } = await supabase
        .from('sales_reps')
        .select('id')
        .limit(1)

      if (createRepsError && createRepsError.code === '42P01') {
        // Table doesn't exist, create it via RPC
        console.log('Creating tables...')
        // We'll create via direct SQL since we have service key
      }

      // Check if we have data
      const { data: existingReps, error: checkError } = await supabase
        .from('sales_reps')
        .select('id')
        .limit(1)

      if (!checkError && (!existingReps || existingReps.length === 0)) {
        // Initialize with all agents
        const repsToInsert = this.AGENTS.map((name, index) => ({
          id: (index + 1).toString(),
          name,
          total_sales: 0,
          total_premium: 0,
          rank: index + 1,
          last_sale: '2024-03-01T00:00:00.000Z',
          team: 'All In Agencies',
          bracket_position: index + 1
        }))

        const { error: insertError } = await supabase
          .from('sales_reps')
          .insert(repsToInsert)

        if (insertError) {
          console.error('Error inserting reps:', insertError)
        } else {
          console.log('✅ Initialized 34 agents in Supabase')
        }
      }
    } catch (error) {
      console.error('Error initializing Supabase:', error)
    }
  }

  // Load sales reps
  static async loadSalesReps(): Promise<SalesRep[]> {
    try {
      const { data, error } = await supabase
        .from('sales_reps')
        .select('*')
        .order('rank', { ascending: true })

      if (error) {
        console.error('Error loading sales reps:', error)
        return this.getFallbackReps()
      }

      return (data || []).map(rep => ({
        id: rep.id,
        name: rep.name,
        totalSales: rep.total_sales || 0,
        totalPremium: parseFloat(rep.total_premium || '0'),
        rank: rep.rank || 1,
        lastSale: new Date(rep.last_sale || '2024-03-01T00:00:00.000Z'),
        team: rep.team || 'All In Agencies',
        bracketPosition: rep.bracket_position || parseInt(rep.id)
      }))
    } catch (error) {
      console.error('Error loading sales reps:', error)
      return this.getFallbackReps()
    }
  }

  // Load sales
  static async loadSales(): Promise<Sale[]> {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(50)

      if (error) {
        console.error('Error loading sales:', error)
        return []
      }

      return (data || []).map(sale => ({
        id: sale.id,
        repName: sale.rep_name,
        clientName: sale.client_name,
        policyType: sale.policy_type,
        premium: parseFloat(sale.premium),
        timestamp: new Date(sale.timestamp)
      }))
    } catch (error) {
      console.error('Error loading sales:', error)
      return []
    }
  }

  // Record a sale
  static async recordSale(saleData: Omit<Sale, 'id' | 'timestamp'>): Promise<{ success: boolean }> {
    try {
      // Insert sale
      const { data: saleResult, error: saleError } = await supabase
        .from('sales')
        .insert({
          rep_name: saleData.repName,
          client_name: saleData.clientName,
          policy_type: saleData.policyType,
          premium: saleData.premium,
          timestamp: new Date().toISOString()
        })
        .select()

      if (saleError) {
        console.error('Error recording sale:', saleError)
        return { success: false }
      }

      // Update rep stats
      const { error: updateError } = await supabase.rpc('update_agent_stats', {
        agent_name: saleData.repName,
        sale_amount: saleData.premium
      })

      if (updateError) {
        // Fallback: manual update
        await this.updateRepStatsManually(saleData.repName, saleData.premium, 'add')
      }

      return { success: true }
    } catch (error) {
      console.error('Error recording sale:', error)
      return { success: false }
    }
  }

  // Delete a sale
  static async deleteSale(saleId: string): Promise<{ success: boolean }> {
    try {
      // Get sale details first
      const { data: sale, error: fetchError } = await supabase
        .from('sales')
        .select('rep_name, premium')
        .eq('id', saleId)
        .single()

      if (fetchError || !sale) {
        console.error('Error fetching sale:', fetchError)
        return { success: false }
      }

      // Delete sale
      const { error: deleteError } = await supabase
        .from('sales')
        .delete()
        .eq('id', saleId)

      if (deleteError) {
        console.error('Error deleting sale:', deleteError)
        return { success: false }
      }

      // Update rep stats
      await this.updateRepStatsManually(sale.rep_name, parseFloat(sale.premium), 'subtract')

      return { success: true }
    } catch (error) {
      console.error('Error deleting sale:', error)
      return { success: false }
    }
  }

  // Manual rep stats update
  private static async updateRepStatsManually(repName: string, premium: number, operation: 'add' | 'subtract'): Promise<void> {
    try {
      // Find the rep
      const { data: reps, error: fetchError } = await supabase
        .from('sales_reps')
        .select('*')

      if (fetchError || !reps) return

      const targetRep = reps.find(rep => 
        rep.name.toLowerCase().includes(repName.toLowerCase()) ||
        repName.toLowerCase().includes(rep.name.toLowerCase())
      )

      if (!targetRep) return

      // Calculate new stats
      const newSales = operation === 'add' 
        ? targetRep.total_sales + 1 
        : Math.max(0, targetRep.total_sales - 1)
      
      const newPremium = operation === 'add'
        ? targetRep.total_premium + premium
        : Math.max(0, targetRep.total_premium - premium)

      // Update rep
      const { error: updateError } = await supabase
        .from('sales_reps')
        .update({
          total_sales: newSales,
          total_premium: newPremium,
          last_sale: operation === 'add' ? new Date().toISOString() : targetRep.last_sale
        })
        .eq('id', targetRep.id)

      if (updateError) {
        console.error('Error updating rep stats:', updateError)
        return
      }

      // Recalculate all rankings
      await this.recalculateRankings()
    } catch (error) {
      console.error('Error in manual stats update:', error)
    }
  }

  // Recalculate all rankings
  private static async recalculateRankings(): Promise<void> {
    try {
      const { data: reps, error } = await supabase
        .from('sales_reps')
        .select('*')
        .order('total_sales', { ascending: false })
        .order('total_premium', { ascending: false })

      if (error || !reps) return

      // Update ranks
      for (let i = 0; i < reps.length; i++) {
        await supabase
          .from('sales_reps')
          .update({ rank: i + 1 })
          .eq('id', reps[i].id)
      }
    } catch (error) {
      console.error('Error recalculating rankings:', error)
    }
  }

  // Subscribe to real-time changes
  static subscribeToChanges(
    onSalesRepsChange: (reps: SalesRep[]) => void,
    onSalesChange: (sales: Sale[]) => void
  ): () => void {
    // Subscribe to sales_reps changes
    const repsChannel = supabase
      .channel('sales_reps_changes')
      .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'sales_reps' }, 
          async () => {
            const reps = await this.loadSalesReps()
            onSalesRepsChange(reps)
          }
      )
      .subscribe()

    // Subscribe to sales changes
    const salesChannel = supabase
      .channel('sales_changes')
      .on('postgres_changes',
          { event: '*', schema: 'public', table: 'sales' },
          async () => {
            const sales = await this.loadSales()
            onSalesChange(sales)
          }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(repsChannel)
      supabase.removeChannel(salesChannel)
    }
  }

  // Fallback data
  private static getFallbackReps(): SalesRep[] {
    return this.AGENTS.map((name, index) => ({
      id: (index + 1).toString(),
      name,
      totalSales: 0,
      totalPremium: 0,
      rank: index + 1,
      lastSale: new Date('2024-03-01T00:00:00.000Z'),
      team: 'All In Agencies',
      bracketPosition: index + 1
    }))
  }
}

export { SupabaseSync }