// Simple sync mechanism using localStorage + periodic server sync
// This ensures sales are shared across all devices globally

interface SalesRep {
  id: string
  name: string
  totalSales: number
  totalPremium: number
  rank: number
  lastSale: Date
  team: string
  bracketPosition: number
}

interface Sale {
  id: string
  repName: string
  clientName: string
  policyType: string
  premium: number
  timestamp: Date
}

class TournamentSync {
  private static readonly STORAGE_KEYS = {
    SALES_REPS: 'tournament_sales_reps',
    SALES: 'tournament_sales',
    LAST_SYNC: 'tournament_last_sync'
  }
  
  private static readonly API_URL = 'https://api.jsonbin.io/v3/b/67543c1eacd3cb34a8b2bbdf'
  private static readonly API_KEY = '$2a$10$VpZLnXrZsKzFp6QHuZGKQOGLfP3FmDq5hZ8/YxYrNjGgMKF4t0KLm'

  // Initialize with default 34 agents
  static getInitialAgents(): SalesRep[] {
    return [
      'MAX KONOPKA', 'ROBERT BRADY', 'ZION RUSSELL', 'BYRON ACHA', 'JOSE VALDEZ',
      'JADEN POPE', 'WESTON CHRISTOPHER', 'NOLAN SCHOENBACHLER', 'THOMAS FOX', 'JEREMI KISINSKI',
      'JAKE DOLL', 'DANIEL SUAREZ', 'RYAN BOVE', 'RYAN COOPER', 'LUCAS KONSTATOS',
      'ANTHONY MAYROSE', 'ANDREW FLASKAMP', 'FABIAN ESCATEL', 'KAMREN HERALD', 'JAYLEN BISCHOFF',
      'BRENNAN SKODA', 'AALYIAH WASHBURN', 'KADEN CAMENZIND', 'HANNAH FRENCH', 'MICHAEL CARNEY',
      'TAJ DHILLON', 'JACOB LEE', 'ADRIEN RAMÍREZ-RAYO', 'DENNIS CHORNIY', 'CHARLIE SIMMS',
      'BRENON REED', 'KIRILL PAVLYCHEV', 'LAINEY DROWN', 'VALERIA ALVAL'
    ].map((name, index) => ({
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

  // Load data from localStorage
  static loadFromStorage(): { salesReps: SalesRep[], sales: Sale[] } {
    try {
      const savedReps = localStorage.getItem(this.STORAGE_KEYS.SALES_REPS)
      const savedSales = localStorage.getItem(this.STORAGE_KEYS.SALES)
      
      const salesReps = savedReps ? 
        JSON.parse(savedReps).map((rep: any) => ({
          ...rep,
          lastSale: new Date(rep.lastSale)
        })) : this.getInitialAgents()
      
      const sales = savedSales ? 
        JSON.parse(savedSales).map((sale: any) => ({
          ...sale,
          timestamp: new Date(sale.timestamp)
        })) : []
      
      return { salesReps, sales }
    } catch (error) {
      console.error('Error loading from storage:', error)
      return { salesReps: this.getInitialAgents(), sales: [] }
    }
  }

  // Save data to localStorage
  static saveToStorage(salesReps: SalesRep[], sales: Sale[]) {
    try {
      localStorage.setItem(this.STORAGE_KEYS.SALES_REPS, JSON.stringify(salesReps))
      localStorage.setItem(this.STORAGE_KEYS.SALES, JSON.stringify(sales))
      localStorage.setItem(this.STORAGE_KEYS.LAST_SYNC, new Date().toISOString())
    } catch (error) {
      console.error('Error saving to storage:', error)
    }
  }

  // Sync data to cloud (JSONBin.io as simple shared storage)
  static async syncToCloud(salesReps: SalesRep[], sales: Sale[]): Promise<boolean> {
    try {
      const data = {
        salesReps,
        sales,
        lastUpdated: new Date().toISOString(),
        version: Date.now()
      }

      const response = await fetch(this.API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': this.API_KEY,
          'X-Bin-Versioning': 'false'
        },
        body: JSON.stringify(data)
      })

      return response.ok
    } catch (error) {
      console.error('Error syncing to cloud:', error)
      return false
    }
  }

  // Load data from cloud
  static async loadFromCloud(): Promise<{ salesReps: SalesRep[], sales: Sale[] } | null> {
    try {
      const response = await fetch(this.API_URL + '/latest', {
        method: 'GET',
        headers: {
          'X-Master-Key': this.API_KEY
        }
      })

      if (!response.ok) {
        return null
      }

      const result = await response.json()
      const data = result.record

      if (!data || !data.salesReps) {
        return null
      }

      const salesReps = data.salesReps.map((rep: any) => ({
        ...rep,
        lastSale: new Date(rep.lastSale)
      }))

      const sales = (data.sales || []).map((sale: any) => ({
        ...sale,
        timestamp: new Date(sale.timestamp)
      }))

      return { salesReps, sales }
    } catch (error) {
      console.error('Error loading from cloud:', error)
      return null
    }
  }

  // Full sync operation
  static async performSync(): Promise<{ salesReps: SalesRep[], sales: Sale[] }> {
    // Try to load from cloud first
    const cloudData = await this.loadFromCloud()
    
    if (cloudData) {
      // Save cloud data to local storage
      this.saveToStorage(cloudData.salesReps, cloudData.sales)
      return cloudData
    } else {
      // Fallback to local storage
      const localData = this.loadFromStorage()
      // Try to sync local data to cloud
      await this.syncToCloud(localData.salesReps, localData.sales)
      return localData
    }
  }

  // Record a sale (updates both local and cloud)
  static async recordSale(saleData: Omit<Sale, 'id' | 'timestamp'>): Promise<{ salesReps: SalesRep[], sales: Sale[] }> {
    const { salesReps, sales } = this.loadFromStorage()
    
    // Create new sale
    const newSale: Sale = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      ...saleData,
      timestamp: new Date()
    }
    
    // Add to sales list
    const updatedSales = [newSale, ...sales.slice(0, 49)] // Keep last 50 sales
    
    // Update the agent's stats
    const updatedReps = salesReps.map(rep => {
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
    }).sort((a, b) => b.totalSales - a.totalSales || b.totalPremium - a.totalPremium)
      .map((rep, index) => ({ ...rep, rank: index + 1 }))
    
    // Save locally
    this.saveToStorage(updatedReps, updatedSales)
    
    // Sync to cloud
    await this.syncToCloud(updatedReps, updatedSales)
    
    return { salesReps: updatedReps, sales: updatedSales }
  }

  // Delete a sale
  static async deleteSale(saleId: string): Promise<{ salesReps: SalesRep[], sales: Sale[] }> {
    const { salesReps, sales } = this.loadFromStorage()
    
    const saleToDelete = sales.find(sale => sale.id === saleId)
    if (!saleToDelete) {
      return { salesReps, sales }
    }
    
    // Remove sale
    const updatedSales = sales.filter(sale => sale.id !== saleId)
    
    // Update agent stats
    const updatedReps = salesReps.map(rep => {
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
    }).sort((a, b) => b.totalSales - a.totalSales || b.totalPremium - a.totalPremium)
      .map((rep, index) => ({ ...rep, rank: index + 1 }))
    
    // Save locally
    this.saveToStorage(updatedReps, updatedSales)
    
    // Sync to cloud
    await this.syncToCloud(updatedReps, updatedSales)
    
    return { salesReps: updatedReps, sales: updatedSales }
  }

  // Set up periodic sync (call this when app loads)
  static setupPeriodicSync(onUpdate: (data: { salesReps: SalesRep[], sales: Sale[] }) => void) {
    // Initial sync
    this.performSync().then(onUpdate)
    
    // Sync every 30 seconds
    const interval = setInterval(async () => {
      const data = await this.performSync()
      onUpdate(data)
    }, 30000)
    
    return () => clearInterval(interval)
  }
}

export { TournamentSync, type SalesRep, type Sale }