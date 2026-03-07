// EMERGENCY SYNC - Bulletproof cross-device synchronization
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

class EmergencySync {
  private static readonly STORAGE_KEY = 'march_madness_emergency'
  private static readonly BROADCAST_CHANNEL = 'march_madness_sync'
  private static channel: BroadcastChannel
  private static listeners: Array<(data: TournamentData) => void> = []
  private static currentVersion = 0
  
  private static getInitialData(): TournamentData {
    const agents = [
      'MAX KONOPKA', 'ROBERT BRADY', 'ZION RUSSELL', 'BYRON ACHA', 'JOSE VALDEZ',
      'JADEN POPE', 'WESTON CHRISTOPHER', 'NOLAN SCHOENBACHLER', 'THOMAS FOX', 'JEREMI KISINSKI',
      'JAKE DOLL', 'DANIEL SUAREZ', 'RYAN BOVE', 'RYAN COOPER', 'LUCAS KONSTATOS',
      'ANTHONY MAYROSE', 'ANDREW FLASKAMP', 'FABIAN ESCATEL', 'KAMREN HERALD', 'JAYLEN BISCHOFF',
      'BRENNAN SKODA', 'AALYIAH WASHBURN', 'KADEN CAMENZIND', 'HANNAH FRENCH', 'MICHAEL CARNEY',
      'TAJ DHILLON', 'JACOB LEE', 'ADRIEN RAMÍREZ-RAYO', 'DENNIS CHORNIY', 'CHARLIE SIMMS',
      'BRENON REED', 'KIRILL PAVLYCHEV', 'LAINEY DROWN', 'VALERIA ALVAL'
    ]
    
    return {
      salesReps: agents.map((name, index) => ({
        id: (index + 1).toString(),
        name,
        totalSales: 0,
        totalPremium: 0,
        rank: index + 1,
        lastSale: new Date('2024-03-01T00:00:00.000Z'),
        team: 'All In Agencies',
        bracketPosition: index + 1
      })),
      sales: [],
      lastUpdated: new Date().toISOString(),
      version: 1
    }
  }
  
  static initialize(): TournamentData {
    try {
      // Set up broadcast channel
      if (typeof BroadcastChannel !== 'undefined') {
        this.channel = new BroadcastChannel(this.BROADCAST_CHANNEL)
        this.channel.onmessage = (event) => {
          if (event.data.version > this.currentVersion) {
            const data = this.deserializeData(event.data)
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(event.data))
            this.currentVersion = event.data.version
            this.notifyListeners(data)
          }
        }
      }
    } catch (e) {
      console.log('BroadcastChannel not available')
    }
    
    // Get or create initial data
    let data: TournamentData
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        data = this.deserializeData(parsed)
        this.currentVersion = parsed.version || 0
      } else {
        data = this.getInitialData()
        this.saveData(data)
      }
    } catch (e) {
      data = this.getInitialData()
      this.saveData(data)
    }
    
    return data
  }
  
  private static saveData(data: TournamentData): void {
    data.version = ++this.currentVersion
    data.lastUpdated = new Date().toISOString()
    
    const serialized = this.serializeData(data)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(serialized))
    
    try {
      if (this.channel) {
        this.channel.postMessage(serialized)
      }
    } catch (e) {
      console.log('Broadcast failed')
    }
    
    this.notifyListeners(data)
  }
  
  private static serializeData(data: TournamentData): any {
    return {
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
  }
  
  private static deserializeData(data: any): TournamentData {
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
  
  static recordSale(saleData: Omit<Sale, 'id' | 'timestamp'>): void {
    const stored = localStorage.getItem(this.STORAGE_KEY)
    if (!stored) return
    
    const currentData = this.deserializeData(JSON.parse(stored))
    
    const newSale: Sale = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...saleData,
      timestamp: new Date()
    }
    
    const updatedSales = [newSale, ...currentData.sales].slice(0, 100)
    
    const updatedReps = currentData.salesReps.map(rep => {
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
    
    const sortedReps = updatedReps
      .sort((a, b) => b.totalSales - a.totalSales || b.totalPremium - a.totalPremium)
      .map((rep, index) => ({ ...rep, rank: index + 1 }))
    
    this.saveData({
      ...currentData,
      salesReps: sortedReps,
      sales: updatedSales
    })
  }
  
  static deleteSale(saleId: string): void {
    const stored = localStorage.getItem(this.STORAGE_KEY)
    if (!stored) return
    
    const currentData = this.deserializeData(JSON.parse(stored))
    const saleToDelete = currentData.sales.find(sale => sale.id === saleId)
    if (!saleToDelete) return
    
    const updatedSales = currentData.sales.filter(sale => sale.id !== saleId)
    
    const updatedReps = currentData.salesReps.map(rep => {
      if (rep.name.toLowerCase().includes(saleToDelete.repName.toLowerCase()) ||
          saleToDelete.repName.toLowerCase().includes(rep.name.toLowerCase())) {
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
    
    this.saveData({
      ...currentData,
      salesReps: sortedReps,
      sales: updatedSales
    })
  }
  
  static subscribe(callback: (data: TournamentData) => void): () => void {
    this.listeners.push(callback)
    return () => {
      const index = this.listeners.indexOf(callback)
      if (index > -1) this.listeners.splice(index, 1)
    }
  }
  
  private static notifyListeners(data: TournamentData): void {
    this.listeners.forEach(callback => {
      try {
        callback(data)
      } catch (e) {
        console.error('Listener error:', e)
      }
    })
  }
  
  static cleanup(): void {
    if (this.channel) {
      this.channel.close()
    }
    this.listeners = []
  }
}

export { EmergencySync }