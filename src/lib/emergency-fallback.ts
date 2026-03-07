// EMERGENCY FALLBACK - Works even if Supabase fails
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

const STORAGE_KEY = 'emergency_tournament_data'

class EmergencyFallback {
  private static listeners: ((data: TournamentData) => void)[] = []
  private static isInitialized = false

  static async initialize(): Promise<TournamentData> {
    if (this.isInitialized) {
      return this.getCurrentData()
    }

    console.log('🆘 EmergencyFallback: Starting emergency mode...')

    try {
      // Try to load from Supabase first
      const data = await this.loadFromSupabase()
      this.saveLocal(data)
      this.isInitialized = true
      return data
    } catch (error) {
      console.warn('⚠️ Supabase failed, using local storage:', error)
      
      // Fallback to local storage
      const localData = this.loadFromLocal()
      this.isInitialized = true
      return localData
    }
  }

  private static async loadFromSupabase(): Promise<TournamentData> {
    console.log('☁️ Attempting Supabase connection...')

    // Dynamic import to avoid build issues
    const { createClient } = await import('@supabase/supabase-js')
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Supabase environment variables missing')
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    // Quick test connection
    const { data: testData, error: testError } = await supabase
      .from('sales_reps')
      .select('count')
      .limit(1)

    if (testError) {
      throw new Error(`Supabase connection failed: ${testError.message}`)
    }

    console.log('✅ Supabase connected, loading data...')

    // Load actual data
    const { data: repsData, error: repsError } = await supabase
      .from('sales_reps')
      .select('*')
      .order('total_sales', { ascending: false })

    if (repsError) throw repsError

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
      lastSale: new Date(rep.last_sale || '2024-03-01'),
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

    console.log(`✅ Loaded ${salesReps.length} reps, ${sales.length} sales from Supabase`)

    return {
      salesReps,
      sales,
      lastUpdated: new Date().toISOString(),
      version: Date.now()
    }
  }

  private static loadFromLocal(): TournamentData {
    console.log('💾 Loading from local storage...')
    
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const data = JSON.parse(stored)
        return {
          ...data,
          salesReps: data.salesReps.map((rep: any) => ({
            ...rep,
            lastSale: new Date(rep.lastSale)
          })),
          sales: data.sales.map((sale: any) => ({
            ...sale,
            timestamp: new Date(sale.timestamp)
          }))
        }
      } catch (e) {
        console.warn('Local storage corrupted, creating fresh data')
      }
    }

    // Create initial data
    console.log('🆕 Creating initial tournament data...')
    return this.createInitialData()
  }

  private static createInitialData(): TournamentData {
    const participantNames = [
      "BYRON ACHA", "TIVON BURNS", "HANNAH FRENCH", "TAJ DHILLON", "KADEN BAKER", "LYNDSEY NOOMAN",
      "MAX KONOPKA", "MICHAEL CARNEY", "AALYIAH WASHBURN", "JAKE DOLL", "BRENNAN SKODA", "RYAN BOVE",
      "THOMAS FOX", "NOLAN SCHOENBACHLER", "JADEN POPE", "RYAN COOPER", "ROBERT BRADY", "JEREMI KISINSKI",
      "WESTON CHRISTOPHER", "ANDREW FLASKAMP", "DENNIS CHORNIY", "CHARLIE SIMMS", "ZION RUSSELL", "ANTHONY MAYROSE",
      "KAMREN HERALD", "ADRIEN RAMÍREZ-RAYO", "LAINEY DROWN", "LUCAS KONSTATOS", "KADEN CAMENZIND", "JACOB LEE",
      "VALERIA ALVAL", "BRENON REED", "JOSE VALDEZ", "FABIAN ESCATEL", "DANIEL SUAREZ", "KIRILL PAVLYCHEV"
    ]

    const salesReps: SalesRep[] = participantNames.map((name, index) => ({
      id: `${index + 1}`,
      name,
      totalSales: 0,
      totalPremium: 0,
      rank: index + 1,
      lastSale: new Date('2024-03-01'),
      team: 'All In Agencies',
      bracketPosition: index + 1
    }))

    return {
      salesReps,
      sales: [],
      lastUpdated: new Date().toISOString(),
      version: 1
    }
  }

  private static saveLocal(data: TournamentData): void {
    try {
      const serialized = {
        ...data,
        salesReps: data.salesReps.map(rep => ({
          ...rep,
          lastSale: rep.lastSale.toISOString()
        })),
        sales: data.sales.map(sale => ({
          ...sale,
          timestamp: sale.timestamp.toISOString()
        }))
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized))
    } catch (e) {
      console.warn('Failed to save to local storage:', e)
    }
  }

  static async addSale(saleData: Omit<Sale, 'id' | 'timestamp'>): Promise<void> {
    console.log('💰 EmergencyFallback: Adding sale:', saleData.repName)

    const currentData = this.getCurrentData()
    
    const newSale: Sale = {
      id: `sale_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...saleData,
      timestamp: new Date()
    }

    const updatedSales = [newSale, ...currentData.sales]
    
    const updatedReps = currentData.salesReps.map(rep => {
      if (this.isNameMatch(rep.name, saleData.repName)) {
        return {
          ...rep,
          totalSales: rep.totalSales + 1,
          totalPremium: rep.totalPremium + saleData.premium,
          lastSale: new Date()
        }
      }
      return rep
    })

    const sortedReps = updatedReps
      .sort((a, b) => b.totalSales - a.totalSales || b.totalPremium - a.totalPremium)
      .map((rep, index) => ({ ...rep, rank: index + 1 }))

    const newData = {
      ...currentData,
      salesReps: sortedReps,
      sales: updatedSales,
      lastUpdated: new Date().toISOString(),
      version: Date.now()
    }

    this.saveLocal(newData)
    this.notifyListeners(newData)

    // Try to save to Supabase in background
    this.saveToSupabaseBackground(newData, newSale)
  }

  static async deleteSale(saleId: string): Promise<void> {
    console.log('🗑️ EmergencyFallback: Deleting sale:', saleId)

    const currentData = this.getCurrentData()
    const saleToDelete = currentData.sales.find(sale => sale.id === saleId)
    
    if (!saleToDelete) return

    const updatedSales = currentData.sales.filter(sale => sale.id !== saleId)
    
    const updatedReps = currentData.salesReps.map(rep => {
      if (this.isNameMatch(rep.name, saleToDelete.repName)) {
        return {
          ...rep,
          totalSales: Math.max(0, rep.totalSales - 1),
          totalPremium: Math.max(0, rep.totalPremium - saleToDelete.premium)
        }
      }
      return rep
    })

    const sortedReps = updatedReps
      .sort((a, b) => b.totalSales - a.totalSales || b.totalPremium - a.totalPremium)
      .map((rep, index) => ({ ...rep, rank: index + 1 }))

    const newData = {
      ...currentData,
      salesReps: sortedReps,
      sales: updatedSales,
      lastUpdated: new Date().toISOString(),
      version: Date.now()
    }

    this.saveLocal(newData)
    this.notifyListeners(newData)
  }

  private static async saveToSupabaseBackground(data: TournamentData, sale: Sale): Promise<void> {
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      // Try to save the sale to Supabase
      await supabase.from('sales').insert({
        rep_name: sale.repName,
        client_name: sale.clientName,
        policy_type: sale.policyType,
        premium: sale.premium
      })

      console.log('✅ Background save to Supabase successful')
    } catch (e) {
      console.log('⚠️ Background save to Supabase failed (non-critical):', e)
    }
  }

  private static isNameMatch(fullName: string, inputName: string): boolean {
    const full = fullName.toLowerCase()
    const input = inputName.toLowerCase()
    return full.includes(input) || input.includes(full) ||
           full.split(' ').some(part => input.split(' ').some(inputPart => 
             part.includes(inputPart) || inputPart.includes(part)
           ))
  }

  private static getCurrentData(): TournamentData {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const data = JSON.parse(stored)
      return {
        ...data,
        salesReps: data.salesReps.map((rep: any) => ({
          ...rep,
          lastSale: new Date(rep.lastSale)
        })),
        sales: data.sales.map((sale: any) => ({
          ...sale,
          timestamp: new Date(sale.timestamp)
        }))
      }
    }
    return this.createInitialData()
  }

  static subscribe(callback: (data: TournamentData) => void): () => void {
    this.listeners.push(callback)
    console.log(`📢 EmergencyFallback: Added listener, total: ${this.listeners.length}`)
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback)
    }
  }

  private static notifyListeners(data: TournamentData): void {
    console.log('📢 EmergencyFallback: Notifying listeners')
    this.listeners.forEach(callback => {
      try {
        callback(data)
      } catch (e) {
        console.error('❌ EmergencyFallback: Listener error:', e)
      }
    })
  }

  static cleanup(): void {
    console.log('🧹 EmergencyFallback: Cleanup')
    this.listeners = []
    this.isInitialized = false
  }
}

export default EmergencyFallback