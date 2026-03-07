// BULLETPROOF CROSS-DEVICE SYNC SYSTEM
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

class BulletproofSync {
  private static readonly STORAGE_KEY = 'bulletproof_tournament_data'
  private static readonly JSONBIN_ID = '67543c1eacd3cb34a8b2bbdf'
  private static readonly JSONBIN_KEY = '$2a$10$DVaj3B8eMT1ggwsB6HCEa.8Y3Rh7QLnOLCnpTcuI7kT9qNADiGY4a'
  
  private static listeners: ((data: TournamentData) => void)[] = []
  private static channel: BroadcastChannel | null = null
  private static currentVersion = 0
  private static syncInterval: NodeJS.Timeout | null = null
  private static lastSyncTime = 0
  private static isInitialized = false
  
  static async initialize(): Promise<TournamentData> {
    if (this.isInitialized) {
      return this.getCurrentData()
    }

    console.log('🚀 Initializing BulletproofSync...')
    
    // Setup BroadcastChannel for same-device cross-tab sync
    try {
      this.channel = new BroadcastChannel('bulletproof_tournament')
      this.channel.onmessage = (event) => {
        if (event.data.type === 'sync_update' && event.data.version !== this.currentVersion) {
          console.log('📡 Received cross-tab update, version:', event.data.version)
          this.currentVersion = event.data.version
          const data = this.deserializeData(event.data.data)
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(event.data.data))
          this.notifyListeners(data)
        }
      }
    } catch (e) {
      console.log('⚠️ BroadcastChannel not available')
    }
    
    // Aggressive sync: every 5 seconds
    this.syncInterval = setInterval(() => {
      this.forceSyncFromCloud()
    }, 5000)
    
    this.isInitialized = true
    return this.loadData()
  }
  
  private static async loadData(): Promise<TournamentData> {
    console.log('🔄 Loading tournament data...')
    
    // Force cloud sync first
    try {
      const cloudData = await this.fetchFromCloud()
      if (cloudData && cloudData.version) {
        console.log('☁️ Loaded from cloud, version:', cloudData.version)
        this.currentVersion = cloudData.version
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cloudData))
        return this.deserializeData(cloudData)
      }
    } catch (e) {
      console.error('❌ Cloud load failed:', e)
    }
    
    // Fallback to local storage
    const stored = localStorage.getItem(this.STORAGE_KEY)
    if (stored) {
      console.log('💾 Loaded from local storage')
      const data = JSON.parse(stored)
      this.currentVersion = data.version || 0
      return this.deserializeData(data)
    }
    
    // Create initial data
    console.log('🆕 Creating initial data')
    const initial = this.getInitialData()
    await this.saveData(initial)
    return initial
  }
  
  private static async fetchFromCloud(): Promise<any> {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${this.JSONBIN_ID}/latest`, {
      method: 'GET',
      headers: {
        'X-Master-Key': this.JSONBIN_KEY,
        'X-Bin-Meta': 'false'
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
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
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
  }
  
  private static async forceSyncFromCloud(): Promise<void> {
    const now = Date.now()
    if (now - this.lastSyncTime < 4000) return // Avoid too frequent calls
    
    this.lastSyncTime = now
    
    try {
      const cloudData = await this.fetchFromCloud()
      if (cloudData && cloudData.version > this.currentVersion) {
        console.log(`📥 Cloud sync: updating from version ${this.currentVersion} to ${cloudData.version}`)
        this.currentVersion = cloudData.version
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cloudData))
        
        // Broadcast to other tabs
        this.channel?.postMessage({
          type: 'sync_update',
          version: cloudData.version,
          data: cloudData
        })
        
        this.notifyListeners(this.deserializeData(cloudData))
      }
    } catch (e) {
      console.log('🔄 Background sync error:', e)
    }
  }
  
  static async addSale(saleData: Omit<Sale, 'id' | 'timestamp'>): Promise<void> {
    console.log('💰 Adding sale for:', saleData.repName, saleData.premium)
    
    const currentData = this.getCurrentData()
    
    const newSale: Sale = {
      id: `sale_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...saleData,
      timestamp: new Date()
    }
    
    const updatedSales = [newSale, ...currentData.sales].slice(0, 100)
    
    // Find and update the sales rep
    const updatedReps = currentData.salesReps.map(rep => {
      if (this.isNameMatch(rep.name, saleData.repName)) {
        console.log(`📈 Updating ${rep.name}: ${rep.totalSales} → ${rep.totalSales + 1} sales`)
        return {
          ...rep,
          totalSales: rep.totalSales + 1,
          totalPremium: rep.totalPremium + saleData.premium,
          lastSale: new Date()
        }
      }
      return rep
    })
    
    // Re-rank everyone
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
    console.log('🗑️ Deleting sale:', saleId)
    
    const currentData = this.getCurrentData()
    const saleToDelete = currentData.sales.find(sale => sale.id === saleId)
    if (!saleToDelete) {
      console.log('❌ Sale not found')
      return
    }
    
    const updatedSales = currentData.sales.filter(sale => sale.id !== saleId)
    
    const updatedReps = currentData.salesReps.map(rep => {
      if (this.isNameMatch(rep.name, saleToDelete.repName)) {
        console.log(`📉 Reverting ${rep.name}: ${rep.totalSales} → ${rep.totalSales - 1} sales`)
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
      sales: updatedSales
    }
    
    await this.saveData(newData)
  }
  
  private static async saveData(data: TournamentData): Promise<void> {
    const serialized = this.serializeData(data)
    this.currentVersion = serialized.version
    
    console.log('💾 Saving data version:', serialized.version)
    
    // Save locally first
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(serialized))
    
    // Notify local listeners
    this.notifyListeners(data)
    
    // Broadcast to other tabs immediately
    this.channel?.postMessage({
      type: 'sync_update',
      version: serialized.version,
      data: serialized
    })
    
    // Save to cloud with retry
    let retries = 3
    while (retries > 0) {
      try {
        await this.saveToCloud(serialized)
        console.log('☁️ Cloud save successful')
        break
      } catch (e) {
        retries--
        console.log(`❌ Cloud save failed, retries left: ${retries}`, e)
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1s before retry
        }
      }
    }
  }
  
  private static getCurrentData(): TournamentData {
    const stored = localStorage.getItem(this.STORAGE_KEY)
    if (stored) {
      return this.deserializeData(JSON.parse(stored))
    }
    return this.getInitialData()
  }
  
  private static isNameMatch(fullName: string, inputName: string): boolean {
    const full = fullName.toLowerCase().trim()
    const input = inputName.toLowerCase().trim()
    
    // Exact match
    if (full === input) return true
    
    // Check if input is contained in full name
    if (full.includes(input) || input.includes(full)) return true
    
    // Check first name + last name combinations
    const fullParts = full.split(' ')
    const inputParts = input.split(' ')
    
    return fullParts.some(part => inputParts.some(inputPart => 
      part === inputPart || part.includes(inputPart) || inputPart.includes(part)
    ))
  }
  
  static subscribe(callback: (data: TournamentData) => void): () => void {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback)
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
  
  private static serializeData(data: TournamentData): any {
    return {
      ...data,
      version: Date.now() + Math.floor(Math.random() * 1000), // Unique version
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
      "BYRON ACHA", "TIVON BURNS", "HANNAH FRENCH", "TAJ DHILLON", "KADEN BAKER", "LYNDSEY NOOMAN",
      "MAX KONOPKA", "MICHAEL CARNEY", "AALYIAH WASHBURN", "JAKE DOLL", "BRENNAN SKODA", "RYAN BOVE",
      "THOMAS FOX", "NOLAN SCHOENBACHLER", "JADEN POPE", "RYAN COOPER", "ROBERT BRADY", "JEREMI KISINSKI",
      "WESTON CHRISTOPHER", "ANDREW FLASKAMP", "DENNIS CHORNIY", "CHARLIE SIMMS", "ZION RUSSELL", "ANTHONY MAYROSE",
      "KAMREN HERALD", "ADRIEN RAMÍREZ-RAYO", "LAINEY DROWN", "LUCAS KONSTATOS", "KADEN CAMENZIND", "JACOB LEE",
      "VALERIA ALVAL", "BRENON REED", "JOSE VALDEZ", "FABIAN ESCATEL", "DANIEL SUAREZ", "KIRILL PAVLYCHEV"
    ].map((name, index) => ({
      id: `agent_${index + 1}`,
      name,
      totalSales: 0,
      totalPremium: 0,
      rank: index + 1,
      lastSale: new Date('2024-03-01T00:00:00.000Z'),
      team: "All In Agencies",
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
    
    this.isInitialized = false
  }
  
  static async hardReset(): Promise<void> {
    console.log('🔄 HARD RESET: Clearing all data')
    localStorage.removeItem(this.STORAGE_KEY)
    localStorage.removeItem('march_madness_data')
    localStorage.removeItem('march_madness_emergency')
    
    const freshData = this.getInitialData()
    await this.saveData(freshData)
  }
}

export default BulletproofSync