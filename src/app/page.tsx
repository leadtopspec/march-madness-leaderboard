'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Tv, Award, Target, Star, Crown, Users, LogIn } from 'lucide-react'
import LoginModal from '@/components/LoginModal'
import AgentDashboard from '@/components/AgentDashboard'
import BracketView from '@/components/BracketView'
import SimpleSync, { type SalesRep as SyncSalesRep, type Sale as SyncSale } from '@/lib/simple-sync'
import { resetAllTournamentData } from '@/lib/reset-data'

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

// Fixed date to prevent hydration errors
const FIXED_DATE = new Date('2024-03-01T00:00:00.000Z')

const bracketParticipants: SalesRep[] = [
  { id: '1', name: 'BYRON ACHA', totalSales: 0, totalPremium: 0, rank: 1, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 1 },
  { id: '2', name: 'TIVON BURNS', totalSales: 0, totalPremium: 0, rank: 2, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 2 },
  { id: '3', name: 'HANNAH FRENCH', totalSales: 0, totalPremium: 0, rank: 3, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 3 },
  { id: '4', name: 'TAJ DHILLON', totalSales: 0, totalPremium: 0, rank: 4, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 4 },
  { id: '5', name: 'KADEN BAKER', totalSales: 0, totalPremium: 0, rank: 5, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 5 },
  { id: '6', name: 'LYNDSEY NOOMAN', totalSales: 0, totalPremium: 0, rank: 6, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 6 },
  { id: '7', name: 'MAX KONOPKA', totalSales: 0, totalPremium: 0, rank: 7, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 7 },
  { id: '8', name: 'MICHAEL CARNEY', totalSales: 0, totalPremium: 0, rank: 8, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 8 },
  { id: '9', name: 'AALYIAH WASHBURN', totalSales: 0, totalPremium: 0, rank: 9, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 9 },
  { id: '10', name: 'JAKE DOLL', totalSales: 0, totalPremium: 0, rank: 10, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 10 },
  { id: '11', name: 'BRENNAN SKODA', totalSales: 0, totalPremium: 0, rank: 11, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 11 },
  { id: '12', name: 'RYAN BOVE', totalSales: 0, totalPremium: 0, rank: 12, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 12 },
  { id: '13', name: 'THOMAS FOX', totalSales: 0, totalPremium: 0, rank: 13, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 13 },
  { id: '14', name: 'NOLAN SCHOENBACHLER', totalSales: 0, totalPremium: 0, rank: 14, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 14 },
  { id: '15', name: 'JADEN POPE', totalSales: 0, totalPremium: 0, rank: 15, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 15 },
  { id: '16', name: 'RYAN COOPER', totalSales: 0, totalPremium: 0, rank: 16, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 16 },
  { id: '17', name: 'ROBERT BRADY', totalSales: 0, totalPremium: 0, rank: 17, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 17 },
  { id: '18', name: 'JEREMI KISINSKI', totalSales: 0, totalPremium: 0, rank: 18, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 18 },
  { id: '19', name: 'WESTON CHRISTOPHER', totalSales: 0, totalPremium: 0, rank: 19, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 19 },
  { id: '20', name: 'ANDREW FLASKAMP', totalSales: 0, totalPremium: 0, rank: 20, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 20 },
  { id: '21', name: 'DENNIS CHORNIY', totalSales: 0, totalPremium: 0, rank: 21, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 21 },
  { id: '22', name: 'CHARLIE SIMMS', totalSales: 0, totalPremium: 0, rank: 22, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 22 },
  { id: '23', name: 'ZION RUSSELL', totalSales: 0, totalPremium: 0, rank: 23, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 23 },
  { id: '24', name: 'ANTHONY MAYROSE', totalSales: 0, totalPremium: 0, rank: 24, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 24 },
  { id: '25', name: 'KAMREN HERALD', totalSales: 0, totalPremium: 0, rank: 25, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 25 },
  { id: '26', name: 'ADRIEN RAMÍREZ-RAYO', totalSales: 0, totalPremium: 0, rank: 26, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 26 },
  { id: '27', name: 'LAINEY DROWN', totalSales: 0, totalPremium: 0, rank: 27, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 27 },
  { id: '28', name: 'LUCAS KONSTATOS', totalSales: 0, totalPremium: 0, rank: 28, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 28 },
  { id: '29', name: 'KADEN CAMENZIND', totalSales: 0, totalPremium: 0, rank: 29, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 29 },
  { id: '30', name: 'JACOB LEE', totalSales: 0, totalPremium: 0, rank: 30, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 30 },
  { id: '31', name: 'VALERIA ALVAL', totalSales: 0, totalPremium: 0, rank: 31, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 31 },
  { id: '32', name: 'BRENON REED', totalSales: 0, totalPremium: 0, rank: 32, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 32 },
  { id: '33', name: 'JOSE VALDEZ', totalSales: 0, totalPremium: 0, rank: 33, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 33 },
  { id: '34', name: 'FABIAN ESCATEL', totalSales: 0, totalPremium: 0, rank: 34, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 34 },
  { id: '35', name: 'DANIEL SUAREZ', totalSales: 0, totalPremium: 0, rank: 35, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 35 },
  { id: '36', name: 'KIRILL PAVLYCHEV', totalSales: 0, totalPremium: 0, rank: 36, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 36 },
  { id: '37', name: 'KADEN BAKER', totalSales: 0, totalPremium: 0, rank: 37, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 37 },
  { id: '38', name: 'LYNDSEY NOOMAN', totalSales: 0, totalPremium: 0, rank: 38, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 38 },
]

export default function MarchMadnessLeaderboard() {
  const [salesReps, setSalesReps] = useState<SalesRep[]>(bracketParticipants)
  const [recentSalesList, setRecentSales] = useState<Sale[]>([])
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [loggedInAgent, setLoggedInAgent] = useState<SalesRep | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeUntilStart, setTimeUntilStart] = useState<{days: number, hours: number, minutes: number, seconds: number} | null>(null)
  const [timeUntilEnd, setTimeUntilEnd] = useState<{days: number, hours: number, minutes: number, seconds: number} | null>(null)
  const [showRules, setShowRules] = useState(false)

  useEffect(() => {
    // Set client-side flag and initial time
    setIsClient(true)
    setCurrentTime(new Date())
    
    // Initialize SimpleSync (Direct Supabase + 2s polling)
    const initializeData = async () => {
      try {
        setIsLoading(true)
        console.log('🔥 Initializing SimpleSync...')
        
        const data = await SimpleSync.initialize()
        setSalesReps(data.salesReps)
        setRecentSales(data.sales)
        setIsLoading(false)
        
        console.log('✅ SimpleSync initialized with', data.salesReps.length, 'reps and', data.sales.length, 'sales')
        
        // Check for logged in agent
        const savedLoggedInAgent = localStorage.getItem('loggedInAgent')
        if (savedLoggedInAgent) {
          try {
            const parsedAgent = JSON.parse(savedLoggedInAgent)
            const currentAgent = data.salesReps.find((rep: SalesRep) => rep.id === parsedAgent.id)
            if (currentAgent) {
              setLoggedInAgent(currentAgent)
            }
          } catch (e) {
            console.error('Error parsing saved logged in agent:', e)
          }
        }
      } catch (error) {
        console.error('❌ Failed to initialize SimpleSync:', error)
        setIsLoading(false)
      }
    }
    
    initializeData()
    
    // Subscribe to simple sync updates (2s polling)
    const unsubscribe = SimpleSync.subscribe((updatedData) => {
      console.log('📊 Received SimpleSync update:', updatedData.salesReps.reduce((sum, rep) => sum + rep.totalSales, 0), 'total sales')
      setSalesReps(updatedData.salesReps)
      setRecentSales(updatedData.sales)
      
      // Update logged in agent if their data changed
      const currentLoggedInAgent = localStorage.getItem('loggedInAgent')
      if (currentLoggedInAgent) {
        const parsedAgent = JSON.parse(currentLoggedInAgent)
        const updatedAgent = updatedData.salesReps.find((rep: SalesRep) => rep.id === parsedAgent.id)
        if (updatedAgent) {
          setLoggedInAgent(updatedAgent)
        }
      }
    })
    
    // Listen for storage changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'salesReps' && e.newValue) {
        try {
          const parsedReps = JSON.parse(e.newValue).map((rep: SalesRep & {lastSale: string}) => ({
            ...rep,
            lastSale: new Date(rep.lastSale)
          }))
          setSalesReps(parsedReps)
          
          // Update logged in agent if their data changed
          const currentLoggedInAgent = localStorage.getItem('loggedInAgent')
          if (currentLoggedInAgent) {
            const parsedLoggedInAgent = JSON.parse(currentLoggedInAgent)
            const updatedAgent = parsedReps.find((rep: SalesRep) => rep.id === parsedLoggedInAgent.id)
            if (updatedAgent) {
              setLoggedInAgent(updatedAgent)
            }
          }
        } catch (error) {
          console.error('Error syncing sales reps:', error)
        }
      }
      if (e.key === 'recentSales' && e.newValue) {
        try {
          const parsedSales = JSON.parse(e.newValue).map((sale: Sale & {timestamp: string}) => ({
            ...sale,
            timestamp: new Date(sale.timestamp)
          }))
          setRecentSales(parsedSales)
        } catch (error) {
          console.error('Error syncing recent sales:', error)
        }
      }
      if (e.key === 'loggedInAgent') {
        if (e.newValue) {
          try {
            const parsedAgent = JSON.parse(e.newValue)
            setLoggedInAgent({
              ...parsedAgent,
              lastSale: new Date(parsedAgent.lastSale)
            })
          } catch (error) {
            console.error('Error syncing logged in agent:', error)
          }
        } else {
          // Agent logged out in another tab
          setLoggedInAgent(null)
        }
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // Mark loading as complete after localStorage is checked
    setIsLoading(false)
    
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    
    // Countdown to Round 1 start (March 7, 2026 at 12:00 AM CST)
    const updateCountdown = () => {
      const startTime = new Date('2026-03-07T06:00:00.000Z') // 12:00 AM CST = 06:00 UTC
      const now = new Date()
      const diff = startTime.getTime() - now.getTime()
      
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)
        
        setTimeUntilStart({ days, hours, minutes, seconds })
      } else {
        setTimeUntilStart(null) // Tournament has started
      }
    }

    // Countdown to Tournament end (March 14, 2026 at 11:59 PM CST)
    const updateEndCountdown = () => {
      const endTime = new Date('2026-03-15T05:59:00.000Z') // 11:59 PM CST = 05:59 UTC next day
      const now = new Date()
      const diff = endTime.getTime() - now.getTime()
      
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)
        
        setTimeUntilEnd({ days, hours, minutes, seconds })
      } else {
        setTimeUntilEnd(null) // Tournament has ended
      }
    }
    
    updateCountdown() // Initial call
    updateEndCountdown() // Initial call for end countdown
    const countdownTimer = setInterval(updateCountdown, 1000)
    const endCountdownTimer = setInterval(updateEndCountdown, 1000)
    
    return () => {
      clearInterval(timer)
      clearInterval(countdownTimer)
      clearInterval(endCountdownTimer)
      unsubscribe()
      SimpleSync.cleanup()
    }
  }, [])

  const handleLogin = (agent: SalesRep) => {
    setLoggedInAgent(agent)
    localStorage.setItem('loggedInAgent', JSON.stringify(agent))
    setShowLoginModal(false)
  }

  const handleLogout = () => {
    setLoggedInAgent(null)
    localStorage.removeItem('loggedInAgent')
  }



  const handleRecordSale = async (saleData: Omit<Sale, 'id' | 'timestamp'>) => {
    try {
      console.log('🔥 Recording sale via SimpleSync:', saleData)
      await SimpleSync.addSale(saleData)
      console.log('✅ Sale recorded with SimpleSync')
    } catch (error) {
      console.error('❌ Error recording sale:', error)
    }
  }

  const handleDeleteSale = async (saleId: string) => {
    try {
      console.log('🗑️ Deleting sale via SimpleSync:', saleId)
      await SimpleSync.deleteSale(saleId)
      console.log('✅ Sale deleted with SimpleSync')
    } catch (error) {
      console.error('❌ Error deleting sale:', error)
    }
  }



  const getRankBadge = (rank: number) => {
    if (rank === 1) return { icon: Crown, color: 'from-yellow-400 to-yellow-600', bg: 'bg-gradient-to-br from-yellow-400/30 to-amber-500/30' }
    if (rank === 2) return { icon: Award, color: 'from-gray-400 to-gray-600', bg: 'bg-gradient-to-br from-gray-400/30 to-slate-500/30' }
    if (rank === 3) return { icon: Star, color: 'from-orange-400 to-orange-600', bg: 'bg-gradient-to-br from-orange-400/30 to-red-500/30' }
    return { icon: Target, color: 'from-blue-400 to-blue-600', bg: 'bg-white/90' }
  }


  
  // Calculate totals for display
  const totalSales = salesReps.reduce((sum, rep) => sum + rep.totalSales, 0)
  const totalPremium = salesReps.reduce((sum, rep) => sum + rep.totalPremium, 0)

  // Show loading screen while checking localStorage
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏀</div>
          <div className="text-white text-2xl font-bold">Loading Tournament...</div>
        </div>
      </div>
    )
  }

  // If agent is logged in, show their personal dashboard
  if (loggedInAgent) {
    const currentAgentData = salesReps.find(rep => rep.id === loggedInAgent.id)
    const updatedAgent = currentAgentData || loggedInAgent

    return (
      <AgentDashboard
        agent={updatedAgent}
        allAgents={salesReps}
        onRecordSale={handleRecordSale}
        onDeleteSale={handleDeleteSale}
        onLogout={handleLogout}
        recentSales={recentSalesList}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900">
      {/* Header - Mobile Optimized */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-4 md:py-6 shadow-2xl border-b-4 border-red-400">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2 md:gap-4">
              <div className="text-2xl md:text-4xl">🏀</div>
              <div>
                <h1 className="text-xl md:text-4xl font-black">MARCH MADNESS</h1>
                <p className="text-xs md:text-lg font-bold opacity-90">
                  <span className="md:hidden">ALL IN • TOURNAMENT</span>
                  <span className="hidden md:inline">ALL IN AGENCIES • SALES TOURNAMENT • MARCH 7-14</span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs md:text-sm opacity-75">LIVE</div>
              <div className="text-sm md:text-xl font-bold">
                {isClient && currentTime ? (
                  <span>
                    <span className="md:hidden">{currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    <span className="hidden md:inline">{currentTime.toLocaleTimeString()}</span>
                  </span>
                ) : '--:--'}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Action Buttons - Mobile Optimized */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center mb-6 md:mb-8 px-4">
          <motion.button
            onClick={() => setShowLoginModal(true)}
            className="bg-gradient-to-r from-red-500 to-red-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-base md:text-lg shadow-xl hover:from-red-600 hover:to-red-800 transition-all flex items-center justify-center gap-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogIn className="w-5 h-5 md:w-6 md:h-6" />
            🏄‍♂️ AGENT LOGIN
          </motion.button>
          
          <motion.a
            href="/tv"
            target="_blank"
            className="bg-gradient-to-r from-gray-700 to-black text-white px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-base md:text-lg shadow-xl hover:from-gray-800 hover:to-gray-900 transition-all flex items-center justify-center gap-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Tv className="w-5 h-5 md:w-6 md:h-6" />
            📺 TV DISPLAY
          </motion.a>
        </div>

        {/* Live Stats Banner - Mobile Optimized */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8 px-4">
          <motion.div 
            className="bg-gradient-to-r from-red-500 to-red-700 text-white rounded-lg md:rounded-xl p-3 md:p-4 text-center shadow-xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-2xl md:text-3xl font-black">{salesReps.length}</div>
            <div className="text-xs md:text-sm font-bold opacity-90">COMPETITORS</div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-lg md:rounded-xl p-3 md:p-4 text-center shadow-xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-2xl md:text-3xl font-black">{totalSales}</div>
            <div className="text-xs md:text-sm font-bold opacity-90">TOTAL SALES</div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg md:rounded-xl p-3 md:p-4 text-center shadow-xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-lg md:text-2xl font-black">${totalPremium.toLocaleString()}</div>
            <div className="text-xs md:text-sm font-bold opacity-90">TOTAL PREMIUM</div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-r from-black to-gray-800 text-white rounded-lg md:rounded-xl p-3 md:p-4 text-center shadow-xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            {timeUntilEnd ? (
              <>
                <div className="text-sm md:text-lg font-black">{timeUntilEnd.days}D {timeUntilEnd.hours}H</div>
                <div className="text-xs md:text-sm font-bold opacity-90">REMAINING</div>
              </>
            ) : (
              <>
                <div className="text-lg md:text-2xl font-black">ENDED</div>
                <div className="text-xs md:text-sm font-bold opacity-90">TOURNAMENT</div>
              </>
            )}
          </motion.div>
        </div>

        {/* Countdown to Round 1 */}
        {timeUntilStart && (
          <motion.div 
            className="bg-gradient-to-r from-green-600 to-green-800 text-white rounded-xl p-6 text-center shadow-xl mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-2xl font-black mb-2">⏰ ROUND 1 STARTS IN:</div>
            <div className="flex justify-center gap-4 text-3xl font-black">
              {timeUntilStart.days > 0 && (
                <div className="text-center">
                  <div>{timeUntilStart.days}</div>
                  <div className="text-sm opacity-90">DAYS</div>
                </div>
              )}
              <div className="text-center">
                <div>{timeUntilStart.hours.toString().padStart(2, '0')}</div>
                <div className="text-sm opacity-90">HOURS</div>
              </div>
              <div className="text-center">
                <div>{timeUntilStart.minutes.toString().padStart(2, '0')}</div>
                <div className="text-sm opacity-90">MINUTES</div>
              </div>
              <div className="text-center">
                <div>{timeUntilStart.seconds.toString().padStart(2, '0')}</div>
                <div className="text-sm opacity-90">SECONDS</div>
              </div>
            </div>
            <div className="text-lg font-bold mt-2 opacity-90">March 7, 2026 • 12:00 AM CST</div>
          </motion.div>
        )}

        {/* Compact Rules Section - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/40 backdrop-blur-sm rounded-2xl p-4 md:p-8 border-2 border-red-500/30 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl md:text-3xl">📋</div>
              <h2 className="text-xl md:text-3xl font-black text-white">TOURNAMENT RULES</h2>
            </div>
            <button
              onClick={() => setShowRules(!showRules)}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm font-bold transition-all"
            >
              {showRules ? 'HIDE' : 'SHOW'}
            </button>
          </div>

          {/* Always visible quick summary */}
          <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-3 md:p-4 mb-4">
            <div className="text-lg md:text-xl font-bold text-red-200 mb-2">🎯 Quick Summary</div>
            <div className="text-red-100 text-sm md:text-base">
              Head-to-head matchups • Highest submitted premium wins • Must be in Zoom room • Final round based on issued business • Winner gets Cancun trip 🏆
            </div>
          </div>

          {/* Detailed rules - collapsible on mobile */}
          {showRules && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-white space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Key Rules - Left Column */}
                <div className="space-y-4">
                  <div className="bg-black/20 border border-gray-600/30 rounded-xl p-4">
                    <div className="text-base font-bold text-gray-200 mb-2 flex items-center gap-2">
                      🥊 Head-to-Head Matchups
                    </div>
                    <ul className="text-white/90 space-y-1 text-sm">
                      <li>• Paired against one opponent each round</li>
                      <li>• Most issued premium advances</li>
                    </ul>
                  </div>

                  <div className="bg-red-600/20 border border-red-500/30 rounded-xl p-4">
                    <div className="text-base font-bold text-red-200 mb-2 flex items-center gap-2">
                      📹 Zoom Room Required
                    </div>
                    <ul className="text-white/90 space-y-1 text-sm">
                      <li>• Both competitors in same Zoom room</li>
                      <li>• Cameras on, actively working</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 border border-white/20 rounded-xl p-4">
                    <div className="text-base font-bold text-green-200 mb-2 flex items-center gap-2">
                      ⚖️ What Counts
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="text-green-300 font-semibold">✅ Submitted premium only</div>
                      <div className="text-red-300 font-semibold">❌ Rewrites don't count</div>
                    </div>
                  </div>
                </div>

                {/* Additional Rules - Right Column */}
                <div className="space-y-4">
                  <div className="bg-white/5 border border-white/20 rounded-xl p-4">
                    <div className="text-base font-bold text-yellow-200 mb-2 flex items-center gap-2">
                      🏁 Rounds 1–3
                    </div>
                    <div className="text-white/90 text-sm">
                      Winner by total submitted premium
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/20 rounded-xl p-4">
                    <div className="text-base font-bold text-red-200 mb-2 flex items-center gap-2">
                      🏆 Final Round
                    </div>
                    <div className="text-white/90 text-sm">
                      Based on issued premium for entire month
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/20 rounded-xl p-4">
                    <div className="text-base font-bold text-orange-200 mb-2 flex items-center gap-2">
                      🚫 Integrity Rules
                    </div>
                    <div className="text-white/90 text-sm">
                      No splitting, transferring, or sharing business
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-500/20 to-red-700/20 border border-red-400/30 rounded-xl p-4 text-center">
                <div className="text-lg font-bold text-yellow-200 mb-2">🏆 PRIZE</div>
                <div className="text-yellow-100 text-sm">
                  Highest issued premium wins Cancun trip!
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Live Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Performers - Show more on mobile */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/20"
          >
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <Crown className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />
              <h2 className="text-xl md:text-2xl font-black text-white">TOP PERFORMERS</h2>
            </div>
            
            <div className="space-y-2 md:space-y-4">
              {salesReps.slice(0, 15).map((rep, index) => (
                <motion.div
                  key={rep.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center justify-between p-3 md:p-4 rounded-xl border ${
                    index < 3 
                      ? 'bg-gradient-to-r from-red-500/20 to-red-700/20 border-red-400/30' 
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-black text-sm md:text-lg ${
                      index === 0 ? 'bg-yellow-400 text-yellow-900' :
                      index === 1 ? 'bg-gray-300 text-gray-800' :
                      index === 2 ? 'bg-orange-400 text-orange-900' :
                      'bg-white/10 text-white'
                    }`}>
                      #{index + 1}
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm md:text-lg">
                        <span className="md:hidden">{rep.name.split(' ')[0]}</span>
                        <span className="hidden md:inline">{rep.name}</span>
                      </div>
                      <div className="text-xs md:text-sm text-white/70 hidden md:block">All In Agencies</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg md:text-2xl font-black text-white">{rep.totalSales}</div>
                    <div className="text-xs md:text-sm text-white/70">${rep.totalPremium.toLocaleString()}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Tournament Status - Mobile Optimized */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/20"
          >
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <Target className="w-6 h-6 md:w-8 md:h-8 text-orange-400" />
              <h2 className="text-xl md:text-2xl font-black text-white">TOURNAMENT STATUS</h2>
            </div>
            
            {/* Tournament Progress */}
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-500/20 to-green-700/20 border border-green-400/30 rounded-xl p-4 text-center">
                <div className="text-xl md:text-2xl font-black text-white mb-1">🔴 LIVE</div>
                <div className="text-lg font-bold text-white">WEEK 1 PLAY-IN ROUND</div>
                <div className="text-sm text-white/70">18 Active Matchups</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                  <div className="text-sm text-yellow-400 font-bold mb-1">CURRENT ROUND</div>
                  <div className="text-white font-bold">Play-In</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                  <div className="text-sm text-orange-400 font-bold mb-1">NEXT ROUND</div>
                  <div className="text-white font-bold">Elite 8</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-600/20 to-black/20 border border-red-400/30 rounded-xl p-4 text-center">
                <div className="text-xl font-black text-white mb-1">🏆</div>
                <div className="text-lg font-bold text-white">CHAMPIONSHIP PRIZE</div>
                <div className="text-sm text-yellow-200">Cancun Trip</div>
              </div>

              <div className="text-center">
                <a 
                  href="/tv" 
                  target="_blank"
                  className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-2 rounded-xl font-bold text-sm hover:from-blue-700 hover:to-blue-900 transition-all inline-flex items-center gap-2"
                >
                  <Tv className="w-4 h-4" />
                  VIEW FULL BRACKET
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* All Competitors Grid - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/20 mb-8"
        >
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 md:w-8 md:h-8 text-cyan-400" />
              <h2 className="text-xl md:text-2xl font-black text-white">ALL COMPETITORS</h2>
            </div>
            <div className="text-sm text-white/70 font-bold">36 Total</div>
          </div>
          
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-3">
            {salesReps.map((rep, index) => {
              const badge = getRankBadge(rep.rank)
              const IconComponent = badge.icon
              return (
                <motion.div
                  key={rep.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.01 }}
                  className="bg-white/5 border border-white/10 rounded-lg p-2 md:p-3 text-center hover:bg-white/10 transition-all"
                >
                  <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full mx-auto mb-1 md:mb-2 bg-gradient-to-r ${badge.color} flex items-center justify-center`}>
                    <IconComponent className="w-3 h-3 md:w-4 md:h-4 text-white" />
                  </div>
                  <div className="text-white text-xs font-bold truncate">{rep.name.split(' ')[0]}</div>
                  <div className="text-white/50 text-xs">#{rep.rank}</div>
                  <div className="text-white text-xs md:text-sm font-bold">{rep.totalSales}</div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Tournament Bracket - Hidden on mobile, visible on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden lg:block bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🏀</div>
              <h2 className="text-2xl font-black text-white">LIVE TOURNAMENT BRACKET</h2>
            </div>
            <div className="text-sm text-white/70 font-bold">March 7-14, 2026</div>
          </div>
          <BracketView />
        </motion.div>

        {/* Call to Action - Mobile Optimized */}
        <div className="text-center mt-8 md:mt-12">
          <motion.button
            onClick={() => setShowLoginModal(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 md:px-12 py-4 md:py-6 rounded-2xl md:rounded-3xl font-black text-lg md:text-2xl shadow-2xl hover:from-green-600 hover:to-emerald-700 transition-all w-full max-w-md mx-auto block"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            🏄‍♂️ JOIN THE COMPETITION
          </motion.button>
          <p className="text-white/70 mt-4 text-base md:text-lg font-bold">
            Enter your access code to start competing!
          </p>
        </div>
      </div>

      {showLoginModal && (
        <LoginModal
          salesReps={salesReps}
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
        />
      )}
    </div>
  )
}
