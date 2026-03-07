// REAL-TIME CROSS-DEVICE SYNC - JSONBin + BroadcastChannel
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

class RealTimeSync {
  private static readonly STORAGE_KEY = 'march_madness_data'
  private static readonly JSONBIN_ID = '67543c1eacd3cb34a8b2bbdf'
  private static readonly JSONBIN_KEY = '$2a$10$DVaj3B8eMT1ggwsB6HCEa.8Y3Rh7QLnOLCnpTcuI7kT9qNADiGY4a'
  
  private static listeners: ((data: TournamentData) => void)[] = []
  private static channel: BroadcastChannel | null = null
  private static currentVersion = 0
  private static isOnline = navigator.onLine
  private static syncInterval: NodeJS.Timeout | null = null
  
  static initialize(): Promise<TournamentData> {
    // Setup online/offline detection
    window.addEventListener('online', () => {
      this.isOnline = true
      this.syncWithCloud()
    })
    
    window.addEventListener('offline', () => {
      this.isOnline = false
    })
    
    // Setup BroadcastChannel for same-device sync
    try {
      this.channel = new BroadcastChannel('tournament_sync')
      this.channel.onmessage = (event) => {
        if (event.data.type === 'data_update' && event.data.version > this.currentVersion) {
          this.currentVersion = event.data.version
          const data = this.deserializeData(event.data.data)
          this.updateLocalStorage(event.data.data)
          this.notifyListeners(data)
        }
      }
    } catch (e) {
      console.log('BroadcastChannel not available')
    }
    
    // Start periodic cloud sync (every 10 seconds)
    this.syncInterval = setInterval(() => {
      if (this.isOnline) {
        this.syncWithCloud()
      }
    }, 10000)
    
    return this.loadInitialData()
  }
  
  private static async loadInitialData(): Promise<TournamentData> {
    // Try cloud first, then local storage, then defaults
    try {
      if (this.isOnline) {
        const cloudData = await this.fetchFromCloud()
        if (cloudData) {
          this.updateLocalStorage(cloudData)
          return this.deserializeData(cloudData)
        }
      }
    } catch (e) {
      console.log('Cloud sync failed, using local data')
    }
    
    // Fallback to local storage
    const stored = localStorage.getItem(this.STORAGE_KEY)
    if (stored) {
      return this.deserializeData(JSON.parse(stored))
    }
    
    // Fallback to initial data
    const initial = this.getInitialData()
    this.updateLocalStorage(this.serializeData(initial))
    return initial
  }
  
  private static async fetchFromCloud(): Promise<any> {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${this.JSONBIN_ID}/latest`, {
      headers: {
        'X-Master-Key': this.JSONBIN_KEY,
        'X-Bin-Meta': 'false'
      }
    })
    
    if (!response.ok) throw new Error('Cloud fetch failed')
    return response.json()
  }
  
  private static async saveToCloud(data: any): Promise<void> {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${this.JSONBIN_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': this.JSONBIN_KEY,
        'X-Bin-Meta': 'false'
      },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) throw new Error('Cloud save failed')
  }
  
  private static async syncWithCloud(): Promise<void> {
    try {
      const cloudData = await this.fetchFromCloud()
      const localStored = localStorage.getItem(this.STORAGE_KEY)
      
      if (!localStored) {
        this.updateLocalStorage(cloudData)
        this.notifyListeners(this.deserializeData(cloudData))
        return
      }
      
      const localData = JSON.parse(localStored)
      
      // If cloud is newer, update local
      if (cloudData.version > localData.version) {
        this.currentVersion = cloudData.version
        this.updateLocalStorage(cloudData)
        this.notifyListeners(this.deserializeData(cloudData))
        
        // Broadcast to other tabs
        this.channel?.postMessage({
          type: 'data_update',
          version: cloudData.version,
          data: cloudData
        })
      }
      // If local is newer, update cloud
      else if (localData.version > cloudData.version) {
        await this.saveToCloud(localData)
      }
    } catch (e) {
      console.log('Cloud sync error:', e)
    }
  }
  
  static async addSale(saleData: Omit<Sale, 'id' | 'timestamp'>): Promise<void> {
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
    
    const newData = {
      ...currentData,
      salesReps: sortedReps,
      sales: updatedSales
    }
    
    await this.saveData(newData)
  }
  
  static async deleteSale(saleId: string): Promise<void> {
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
          totalPremium: Math.max(0, rep.totalPremium - saleToDelete.premium),
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
      sales: updatedSales
    }
    
    await this.saveData(newData)
  }
  
  private static async saveData(data: TournamentData): Promise<void> {
    const serialized = this.serializeData(data)
    this.updateLocalStorage(serialized)
    this.notifyListeners(data)
    
    // Broadcast to other tabs immediately
    this.channel?.postMessage({
      type: 'data_update',
      version: serialized.version,
      data: serialized
    })
    
    // Save to cloud for cross-device sync
    if (this.isOnline) {
      try {
        await this.saveToCloud(serialized)
      } catch (e) {
        console.log('Cloud save failed, will retry on next sync')
      }
    }
  }
  
  private static updateLocalStorage(data: any): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data))
    this.currentVersion = data.version
  }
  
  static subscribe(callback: (data: TournamentData) => void): () => void {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback)
    }
  }
  
  private static notifyListeners(data: TournamentData): void {
    this.listeners.forEach(callback => callback(data))
  }
  
  private static serializeData(data: TournamentData): any {
    return {
      ...data,
      version: Date.now(),
      lastUpdated: new Date().toISOString(),
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
  
  private static getInitialData(): TournamentData {
    const initialReps: SalesRep[] = [
      "MAX KONOPKA", "ROBERT BRADY", "ZION RUSSELL", "BYRON ACHA", "JOSE VALDEZ",
      "JADEN PERALTA", "WESTON CALHOUN", "NOLAN SCHAEFER", "THOMAS FIORILLO", "JEREMI KISINSKI",
      "MASON SCOTT", "CHARLIE LINN", "MICHAEL RUARK", "LUKE MARTIN", "GAVIN CASSEL",
      "COLIN CONWAY", "ETHAN BRADLEY", "NOLAN PORTER", "CARTER WALKER", "CAMERON BRADY",
      "BRYAN MARTINEZ", "CARSYN MCCALL", "MICAH ATCHLEY", "NICK THOMAS", "BENJAMIN FREEMAN",
      "GAGE RUSSELL", "ETHAN WARKENTIN", "JAMES COLLAZO", "HENRY RAMIREZ", "DIEGO FLORES",
      "JAXON COLLAZO", "NOLAN MORRISON", "LUIS ALFARO", "VALERIA ALVAL"
    ].map((name, index) => ({
      id: `agent_${index + 1}`,
      name,
      totalSales: 0,
      totalPremium: 0,
      rank: index + 1,
      lastSale: new Date(),
      team: index < 17 ? "TEAM RED" : "TEAM BLACK",
      bracketPosition: index + 1
    }))
    
    return {
      salesReps: initialReps,
      sales: [],
      lastUpdated: new Date().toISOString(),
      version: 1
    }
  }
  
  static cleanup(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
    }
    
    if (this.channel) {
      this.channel.close()
      this.channel = null
    }
  }
}

export default RealTimeSync