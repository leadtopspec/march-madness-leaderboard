// Ultra-simple sync using a direct API endpoint
// This ensures all devices see the same data instantly

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

class SimpleSync {
  // Use a simple JSON file hosting service for shared state
  private static readonly API_URL = 'https://api.jsonbin.io/v3/b/6754465aad19ca34f8cec3a7'
  private static readonly API_KEY = '$2a$10$n8r4VBF7v2MgUgzHLRRpW.pRaHQ4SLo9uMlOCb0e/YyE.NBK0lBNu'
  
  private static readonly AGENTS = [
    'MAX KONOPKA', 'ROBERT BRADY', 'ZION RUSSELL', 'BYRON ACHA', 'JOSE VALDEZ',
    'JADEN POPE', 'WESTON CHRISTOPHER', 'NOLAN SCHOENBACHLER', 'THOMAS FOX', 'JEREMI KISINSKI',
    'JAKE DOLL', 'DANIEL SUAREZ', 'RYAN BOVE', 'RYAN COOPER', 'LUCAS KONSTATOS',
    'ANTHONY MAYROSE', 'ANDREW FLASKAMP', 'FABIAN ESCATEL', 'KAMREN HERALD', 'JAYLEN BISCHOFF',
    'BRENNAN SKODA', 'AALYIAH WASHBURN', 'KADEN CAMENZIND', 'HANNAH FRENCH', 'MICHAEL CARNEY',
    'TAJ DHILLON', 'JACOB LEE', 'ADRIEN RAMÍREZ-RAYO', 'DENNIS CHORNIY', 'CHARLIE SIMMS',
    'BRENON REED', 'KIRILL PAVLYCHEV', 'LAINEY DROWN', 'VALERIA ALVAL'
  ]

  private static getInitialState() {
    const salesReps = this.AGENTS.map((name, index) => ({
      id: (index + 1).toString(),
      name,
      totalSales: 0,
      totalPremium: 0,
      rank: index + 1,
      lastSale: '2024-03-01T00:00:00.000Z',
      team: 'All In Agencies',
      bracketPosition: index + 1
    }))

    return {
      salesReps,
      sales: [],
      lastUpdated: new Date().toISOString()
    }
  }

  // Load current state from cloud
  static async loadState(): Promise<{ salesReps: SalesRep[], sales: Sale[] }> {
    try {
      const response = await fetch(`${this.API_URL}/latest`, {
        headers: {
          'X-Master-Key': this.API_KEY
        }
      })

      if (response.ok) {
        const data = await response.json()
        const record = data.record

        const salesReps = record.salesReps.map((rep: any) => ({
          ...rep,
          lastSale: new Date(rep.lastSale)
        }))

        const sales = record.sales.map((sale: any) => ({
          ...sale,
          timestamp: new Date(sale.timestamp)
        }))

        return { salesReps, sales }
      }
    } catch (error) {
      console.error('Error loading state:', error)
    }

    // Return initial state if loading fails
    const initial = this.getInitialState()
    return {
      salesReps: initial.salesReps.map(rep => ({
        ...rep,
        lastSale: new Date(rep.lastSale)
      })),
      sales: []
    }
  }

  // Save state to cloud
  static async saveState(salesReps: SalesRep[], sales: Sale[]): Promise<boolean> {
    try {
      const data = {
        salesReps: salesReps.map(rep => ({
          ...rep,
          lastSale: rep.lastSale.toISOString()
        })),
        sales: sales.map(sale => ({
          ...sale,
          timestamp: sale.timestamp.toISOString()
        })),
        lastUpdated: new Date().toISOString()
      }

      const response = await fetch(this.API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': this.API_KEY
        },
        body: JSON.stringify(data)
      })

      return response.ok
    } catch (error) {
      console.error('Error saving state:', error)
      return false
    }
  }

  // Record a sale
  static async recordSale(saleData: Omit<Sale, 'id' | 'timestamp'>): Promise<{ salesReps: SalesRep[], sales: Sale[] }> {
    const currentState = await this.loadState()
    
    // Create new sale
    const newSale: Sale = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...saleData,
      timestamp: new Date()
    }
    
    // Add to sales list (keep most recent 50)
    const updatedSales = [newSale, ...currentState.sales].slice(0, 50)
    
    // Update agent stats
    const updatedReps = currentState.salesReps.map(rep => {
      if (rep.name.toLowerCase().includes(saleData.repName.toLowerCase()) ||
          saleData.repName.toLowerCase().includes(rep.name.toLowerCase())) {
        return {
          ...rep,
          totalSales: rep.totalSales + 1,
          totalPremium: rep.totalPremium + saleData.premium,
          lastSale: new Date()
        }
      }
      return rep
    })
    
    // Recalculate rankings
    const sortedReps = updatedReps
      .sort((a, b) => b.totalSales - a.totalSales || b.totalPremium - a.totalPremium)
      .map((rep, index) => ({ ...rep, rank: index + 1 }))
    
    // Save to cloud
    await this.saveState(sortedReps, updatedSales)
    
    return { salesReps: sortedReps, sales: updatedSales }
  }

  // Delete a sale
  static async deleteSale(saleId: string): Promise<{ salesReps: SalesRep[], sales: Sale[] }> {
    const currentState = await this.loadState()
    
    const saleToDelete = currentState.sales.find(sale => sale.id === saleId)
    if (!saleToDelete) {
      return currentState
    }
    
    // Remove sale
    const updatedSales = currentState.sales.filter(sale => sale.id !== saleId)
    
    // Update agent stats
    const updatedReps = currentState.salesReps.map(rep => {
      if (rep.name.toLowerCase().includes(saleToDelete.repName.toLowerCase()) ||
          saleToDelete.repName.toLowerCase().includes(rep.name.toLowerCase())) {
        return {
          ...rep,
          totalSales: Math.max(0, rep.totalSales - 1),
          totalPremium: Math.max(0, rep.totalPremium - saleToDelete.premium),
          lastSale: rep.totalSales > 1 ? rep.lastSale : new Date('2024-03-01T00:00:00.000Z')
        }
      }
      return rep
    })
    
    // Recalculate rankings
    const sortedReps = updatedReps
      .sort((a, b) => b.totalSales - a.totalSales || b.totalPremium - a.totalPremium)
      .map((rep, index) => ({ ...rep, rank: index + 1 }))
    
    // Save to cloud
    await this.saveState(sortedReps, updatedSales)
    
    return { salesReps: sortedReps, sales: updatedSales }
  }

  // Initialize with fresh data
  static async initialize(): Promise<{ salesReps: SalesRep[], sales: Sale[] }> {
    try {
      // Try to load existing state
      const state = await this.loadState()
      
      // If no sales exist and all agents have 0 sales, initialize fresh
      if (state.sales.length === 0 && state.salesReps.every(rep => rep.totalSales === 0)) {
        const fresh = this.getInitialState()
        await this.saveState(fresh.salesReps.map(rep => ({
          ...rep,
          lastSale: new Date(rep.lastSale)
        })), [])
        
        return {
          salesReps: fresh.salesReps.map(rep => ({
            ...rep,
            lastSale: new Date(rep.lastSale)
          })),
          sales: []
        }
      }
      
      return state
    } catch (error) {
      console.error('Error initializing:', error)
      const initial = this.getInitialState()
      return {
        salesReps: initial.salesReps.map(rep => ({
          ...rep,
          lastSale: new Date(rep.lastSale)
        })),
        sales: []
      }
    }
  }

  // Periodic sync
  static startPeriodicSync(
    onUpdate: (data: { salesReps: SalesRep[], sales: Sale[] }) => void,
    intervalMs: number = 10000 // 10 seconds
  ): () => void {
    // Initial load
    this.initialize().then(onUpdate)
    
    // Set up interval
    const interval = setInterval(async () => {
      try {
        const state = await this.loadState()
        onUpdate(state)
      } catch (error) {
        console.error('Error in periodic sync:', error)
      }
    }, intervalMs)
    
    return () => clearInterval(interval)
  }
}

export { SimpleSync }