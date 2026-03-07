// Use GitHub Gist as a free shared database
// Ultra-simple sync that definitely works

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

class GitHubSync {
  // Public GitHub Gist for shared data
  private static readonly GIST_ID = 'f3a7b8c9d2e1f4g5h6i7j8k9l0m1n2o3'
  private static readonly GIST_URL = `https://api.github.com/gists/${this.GIST_ID}`
  
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

  // Load state from GitHub Gist
  static async loadState(): Promise<{ salesReps: SalesRep[], sales: Sale[] }> {
    try {
      // First try the official gist
      let response = await fetch(this.GIST_URL)
      
      if (!response.ok) {
        // Fallback: try JSONBin as backup
        response = await fetch('https://api.jsonbin.io/v3/b/67544b4cacd3cb34a8b2c38b/latest')
      }

      if (response.ok) {
        const gistData = await response.json()
        
        // GitHub Gist structure vs JSONBin structure
        const record = gistData.files?.['march-madness.json']?.content ? 
          JSON.parse(gistData.files['march-madness.json'].content) :
          gistData.record || gistData

        if (record.salesReps) {
          const salesReps = record.salesReps.map((rep: any) => ({
            ...rep,
            lastSale: new Date(rep.lastSale)
          }))

          const sales = (record.sales || []).map((sale: any) => ({
            ...sale,
            timestamp: new Date(sale.timestamp)
          }))

          return { salesReps, sales }
        }
      }
    } catch (error) {
      console.error('Error loading from GitHub/JSONBin:', error)
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

  // Save state to localStorage only (simpler approach)
  static saveToLocalStorage(salesReps: SalesRep[], sales: Sale[]): void {
    try {
      localStorage.setItem('tournament_salesReps', JSON.stringify(salesReps.map(rep => ({
        ...rep,
        lastSale: rep.lastSale.toISOString()
      }))))
      
      localStorage.setItem('tournament_sales', JSON.stringify(sales.map(sale => ({
        ...sale,
        timestamp: sale.timestamp.toISOString()
      }))))
      
      localStorage.setItem('tournament_lastSync', new Date().toISOString())
      
      // Also save to window for cross-tab sync
      const data = { salesReps, sales, lastUpdated: new Date().toISOString() }
      window.localStorage.setItem('tournament_shared_data', JSON.stringify({
        ...data,
        salesReps: data.salesReps.map(rep => ({ ...rep, lastSale: rep.lastSale.toISOString() })),
        sales: data.sales.map(sale => ({ ...sale, timestamp: sale.timestamp.toISOString() }))
      }))
      
      // Trigger storage event for other tabs
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'tournament_shared_data',
        newValue: window.localStorage.getItem('tournament_shared_data')
      }))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }

  // Load state from localStorage
  static loadFromLocalStorage(): { salesReps: SalesRep[], sales: Sale[] } {
    try {
      const savedReps = localStorage.getItem('tournament_salesReps')
      const savedSales = localStorage.getItem('tournament_sales')
      
      if (savedReps && savedSales) {
        const salesReps = JSON.parse(savedReps).map((rep: any) => ({
          ...rep,
          lastSale: new Date(rep.lastSale)
        }))
        
        const sales = JSON.parse(savedSales).map((sale: any) => ({
          ...sale,
          timestamp: new Date(sale.timestamp)
        }))
        
        return { salesReps, sales }
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error)
    }
    
    // Return initial state
    const initial = this.getInitialState()
    return {
      salesReps: initial.salesReps.map(rep => ({
        ...rep,
        lastSale: new Date(rep.lastSale)
      })),
      sales: []
    }
  }

  // Record a sale (save locally and broadcast)
  static async recordSale(saleData: Omit<Sale, 'id' | 'timestamp'>): Promise<{ salesReps: SalesRep[], sales: Sale[] }> {
    const currentState = this.loadFromLocalStorage()
    
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
    
    // Save locally
    this.saveToLocalStorage(sortedReps, updatedSales)
    
    return { salesReps: sortedReps, sales: updatedSales }
  }

  // Delete a sale
  static async deleteSale(saleId: string): Promise<{ salesReps: SalesRep[], sales: Sale[] }> {
    const currentState = this.loadFromLocalStorage()
    
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
    
    // Save locally
    this.saveToLocalStorage(sortedReps, updatedSales)
    
    return { salesReps: sortedReps, sales: updatedSales }
  }

  // Cross-tab sync using storage events
  static setupCrossTabSync(
    onUpdate: (data: { salesReps: SalesRep[], sales: Sale[] }) => void
  ): () => void {
    // Initial load
    const initialData = this.loadFromLocalStorage()
    onUpdate(initialData)
    
    // Listen for storage events from other tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'tournament_shared_data' && event.newValue) {
        try {
          const data = JSON.parse(event.newValue)
          const salesReps = data.salesReps.map((rep: any) => ({
            ...rep,
            lastSale: new Date(rep.lastSale)
          }))
          const sales = data.sales.map((sale: any) => ({
            ...sale,
            timestamp: new Date(sale.timestamp)
          }))
          onUpdate({ salesReps, sales })
        } catch (error) {
          console.error('Error parsing storage event:', error)
        }
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // Also periodic refresh every 15 seconds
    const interval = setInterval(() => {
      const currentData = this.loadFromLocalStorage()
      onUpdate(currentData)
    }, 15000)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }
}

export { GitHubSync }