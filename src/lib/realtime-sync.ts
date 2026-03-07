// Real-time sync using Firebase Realtime Database for instant updates
import { initializeApp } from 'firebase/app'
import { getDatabase, ref, set, onValue, push, remove, get } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyBrX8YqJP-6x9nQvN0BNsFeQj4-cqpqxRQ",
  authDomain: "march-madness-tournament.firebaseapp.com",
  databaseURL: "https://march-madness-tournament-default-rtdb.firebaseio.com",
  projectId: "march-madness-tournament",
  storageBucket: "march-madness-tournament.firebasestorage.app",
  messagingSenderId: "987654321000",
  appId: "1:987654321000:web:abcdef123456789"
}

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

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

class RealTimeSync {
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

  // Initialize tournament data
  static async initializeTournament(): Promise<void> {
    try {
      const repsRef = ref(database, 'salesReps')
      const snapshot = await get(repsRef)
      
      if (!snapshot.exists()) {
        const initialReps = this.getInitialAgents()
        const repsData: Record<string, any> = {}
        
        initialReps.forEach(rep => {
          repsData[rep.id] = {
            ...rep,
            lastSale: rep.lastSale.toISOString()
          }
        })
        
        await set(repsRef, repsData)
        console.log('Tournament initialized with 34 agents')
      }
    } catch (error) {
      console.error('Error initializing tournament:', error)
    }
  }

  // Record a sale
  static async recordSale(saleData: Omit<Sale, 'id' | 'timestamp'>): Promise<void> {
    try {
      const salesRef = ref(database, 'sales')
      const newSaleRef = push(salesRef)
      
      const sale = {
        ...saleData,
        timestamp: new Date().toISOString(),
        id: newSaleRef.key
      }
      
      await set(newSaleRef, sale)
      
      // Update agent stats
      await this.updateAgentStats(saleData.repName, saleData.premium, 'add')
    } catch (error) {
      console.error('Error recording sale:', error)
      throw error
    }
  }

  // Delete a sale
  static async deleteSale(saleId: string, repName: string, premium: number): Promise<void> {
    try {
      const saleRef = ref(database, `sales/${saleId}`)
      await remove(saleRef)
      
      // Update agent stats
      await this.updateAgentStats(repName, premium, 'subtract')
    } catch (error) {
      console.error('Error deleting sale:', error)
      throw error
    }
  }

  // Update agent statistics
  private static async updateAgentStats(repName: string, premium: number, operation: 'add' | 'subtract'): Promise<void> {
    try {
      const repsRef = ref(database, 'salesReps')
      const snapshot = await get(repsRef)
      
      if (snapshot.exists()) {
        const repsData = snapshot.val()
        let targetRep: any = null
        let targetRepId: string = ''
        
        // Find the rep by name (case insensitive)
        for (const [id, rep] of Object.entries(repsData)) {
          const repData = rep as any
          if (repData.name.toLowerCase().includes(repName.toLowerCase()) ||
              repName.toLowerCase().includes(repData.name.toLowerCase())) {
            targetRep = repData
            targetRepId = id
            break
          }
        }
        
        if (targetRep) {
          const updatedRep = {
            ...targetRep,
            totalSales: operation === 'add' 
              ? targetRep.totalSales + 1 
              : Math.max(0, targetRep.totalSales - 1),
            totalPremium: operation === 'add'
              ? targetRep.totalPremium + premium
              : Math.max(0, targetRep.totalPremium - premium),
            lastSale: operation === 'add' 
              ? new Date().toISOString() 
              : targetRep.lastSale
          }
          
          const repRef = ref(database, `salesReps/${targetRepId}`)
          await set(repRef, updatedRep)
          
          // Recalculate rankings
          await this.recalculateRankings()
        }
      }
    } catch (error) {
      console.error('Error updating agent stats:', error)
    }
  }

  // Recalculate all rankings
  private static async recalculateRankings(): Promise<void> {
    try {
      const repsRef = ref(database, 'salesReps')
      const snapshot = await get(repsRef)
      
      if (snapshot.exists()) {
        const repsData = snapshot.val()
        const repsArray = Object.entries(repsData).map(([id, rep]) => ({
          id,
          ...(rep as any)
        }))
        
        // Sort by total sales, then by total premium
        repsArray.sort((a, b) => {
          if (b.totalSales !== a.totalSales) {
            return b.totalSales - a.totalSales
          }
          return b.totalPremium - a.totalPremium
        })
        
        // Update ranks
        const updates: Record<string, any> = {}
        repsArray.forEach((rep, index) => {
          updates[`${rep.id}/rank`] = index + 1
        })
        
        await set(repsRef, { ...repsData, ...updates })
      }
    } catch (error) {
      console.error('Error recalculating rankings:', error)
    }
  }

  // Subscribe to real-time updates
  static subscribeToUpdates(
    onSalesRepsUpdate: (reps: SalesRep[]) => void,
    onSalesUpdate: (sales: Sale[]) => void
  ): () => void {
    const repsRef = ref(database, 'salesReps')
    const salesRef = ref(database, 'sales')
    
    const unsubscribeReps = onValue(repsRef, (snapshot) => {
      if (snapshot.exists()) {
        const repsData = snapshot.val()
        const repsArray = Object.entries(repsData).map(([id, rep]) => {
          const repData = rep as any
          return {
            id,
            name: repData.name,
            totalSales: repData.totalSales || 0,
            totalPremium: repData.totalPremium || 0,
            rank: repData.rank || 1,
            lastSale: new Date(repData.lastSale || '2024-03-01T00:00:00.000Z'),
            team: repData.team || 'All In Agencies',
            bracketPosition: repData.bracketPosition || parseInt(id)
          }
        })
        
        onSalesRepsUpdate(repsArray)
      }
    })
    
    const unsubscribeSales = onValue(salesRef, (snapshot) => {
      if (snapshot.exists()) {
        const salesData = snapshot.val()
        const salesArray = Object.entries(salesData).map(([id, sale]) => {
          const saleData = sale as any
          return {
            id,
            repName: saleData.repName,
            clientName: saleData.clientName,
            policyType: saleData.policyType,
            premium: saleData.premium,
            timestamp: new Date(saleData.timestamp)
          }
        }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        
        onSalesUpdate(salesArray)
      } else {
        onSalesUpdate([])
      }
    })
    
    return () => {
      unsubscribeReps()
      unsubscribeSales()
    }
  }
}

export { RealTimeSync }