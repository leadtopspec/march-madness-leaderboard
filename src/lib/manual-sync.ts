// Manual sync system - simple and reliable
// Each device maintains its own data, with manual sync buttons

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

class ManualSync {
  private static readonly STORAGE_PREFIX = 'tournament_'
  private static readonly SHARE_URL = 'https://tournamentshare.netlify.app/.netlify/functions/share'
  
  private static readonly AGENTS = [
    'MAX KONOPKA', 'ROBERT BRADY', 'ZION RUSSELL', 'BYRON ACHA', 'JOSE VALDEZ',
    'JADEN POPE', 'WESTON CHRISTOPHER', 'NOLAN SCHOENBACHLER', 'THOMAS FOX', 'JEREMI KISINSKI',
    'JAKE DOLL', 'DANIEL SUAREZ', 'RYAN BOVE', 'RYAN COOPER', 'LUCAS KONSTATOS',
    'ANTHONY MAYROSE', 'ANDREW FLASKAMP', 'FABIAN ESCATEL', 'KAMREN HERALD', 'JAYLEN BISCHOFF',
    'BRENNAN SKODA', 'AALYIAH WASHBURN', 'KADEN CAMENZIND', 'HANNAH FRENCH', 'MICHAEL CARNEY',
    'TAJ DHILLON', 'JACOB LEE', 'ADRIEN RAMÍREZ-RAYO', 'DENNIS CHORNIY', 'CHARLIE SIMMS',
    'BRENON REED', 'KIRILL PAVLYCHEV', 'LAINEY DROWN', 'VALERIA ALVAL'
  ]

  static getInitialAgents(): SalesRep[] {
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

  // Load data from localStorage
  static loadData(): { salesReps: SalesRep[], sales: Sale[] } {
    try {
      const salesRepsData = localStorage.getItem(this.STORAGE_PREFIX + 'salesReps')
      const salesData = localStorage.getItem(this.STORAGE_PREFIX + 'sales')
      
      const salesReps = salesRepsData ? 
        JSON.parse(salesRepsData).map((rep: any) => ({
          ...rep,
          lastSale: new Date(rep.lastSale)
        })) : this.getInitialAgents()
      
      const sales = salesData ? 
        JSON.parse(salesData).map((sale: any) => ({
          ...sale,
          timestamp: new Date(sale.timestamp)
        })) : []
      
      return { salesReps, sales }
    } catch (error) {
      console.error('Error loading data:', error)
      return { salesReps: this.getInitialAgents(), sales: [] }
    }
  }

  // Save data to localStorage
  static saveData(salesReps: SalesRep[], sales: Sale[]): void {
    try {
      localStorage.setItem(this.STORAGE_PREFIX + 'salesReps', JSON.stringify(salesReps))
      localStorage.setItem(this.STORAGE_PREFIX + 'sales', JSON.stringify(sales))
      localStorage.setItem(this.STORAGE_PREFIX + 'lastUpdate', new Date().toISOString())
    } catch (error) {
      console.error('Error saving data:', error)
    }
  }

  // Record a sale
  static recordSale(saleData: Omit<Sale, 'id' | 'timestamp'>): { salesReps: SalesRep[], sales: Sale[] } {
    const { salesReps, sales } = this.loadData()
    
    // Create new sale
    const newSale: Sale = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...saleData,
      timestamp: new Date()
    }
    
    // Add to sales list
    const updatedSales = [newSale, ...sales].slice(0, 50) // Keep last 50
    
    // Update agent stats
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
    
    // Save
    this.saveData(updatedReps, updatedSales)
    
    return { salesReps: updatedReps, sales: updatedSales }
  }

  // Delete a sale
  static deleteSale(saleId: string): { salesReps: SalesRep[], sales: Sale[] } {
    const { salesReps, sales } = this.loadData()
    
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
    
    // Save
    this.saveData(updatedReps, updatedSales)
    
    return { salesReps: updatedReps, sales: updatedSales }
  }

  // Generate share code for manual sync
  static generateShareCode(): string {
    const data = this.loadData()
    const compressed = JSON.stringify({
      r: data.salesReps.map(rep => [
        rep.id, rep.name, rep.totalSales, rep.totalPremium, rep.rank, rep.lastSale.toISOString()
      ]),
      s: data.sales.map(sale => [
        sale.id, sale.repName, sale.clientName, sale.policyType, sale.premium, sale.timestamp.toISOString()
      ]),
      t: new Date().toISOString()
    })
    
    return btoa(compressed).substr(0, 12)
  }

  // Import data from share code
  static importFromShareCode(shareCode: string): boolean {
    try {
      // For now, just return the current data
      // In a real implementation, this would decode the share code
      return false
    } catch (error) {
      console.error('Error importing share code:', error)
      return false
    }
  }

  // Export all data for sharing
  static exportData(): string {
    const data = this.loadData()
    return JSON.stringify({
      salesReps: data.salesReps,
      sales: data.sales,
      exported: new Date().toISOString()
    }, null, 2)
  }

  // Import data from JSON
  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData)
      if (data.salesReps && Array.isArray(data.salesReps)) {
        const salesReps = data.salesReps.map((rep: any) => ({
          ...rep,
          lastSale: new Date(rep.lastSale)
        }))
        const sales = (data.sales || []).map((sale: any) => ({
          ...sale,
          timestamp: new Date(sale.timestamp)
        }))
        
        this.saveData(salesReps, sales)
        return true
      }
    } catch (error) {
      console.error('Error importing data:', error)
    }
    return false
  }

  // Reset all data
  static resetAllData(): void {
    const freshReps = this.getInitialAgents()
    this.saveData(freshReps, [])
  }

  // Get sync info
  static getSyncInfo(): { lastUpdate: string | null, totalSales: number, totalPremium: number } {
    const lastUpdate = localStorage.getItem(this.STORAGE_PREFIX + 'lastUpdate')
    const { salesReps } = this.loadData()
    
    return {
      lastUpdate,
      totalSales: salesReps.reduce((sum, rep) => sum + rep.totalSales, 0),
      totalPremium: salesReps.reduce((sum, rep) => sum + rep.totalPremium, 0)
    }
  }
}

export { ManualSync }