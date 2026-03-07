'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Tv, Award, Target, Star, Crown, Users, LogIn } from 'lucide-react'
import LoginModal from '@/components/LoginModal'
import AgentDashboard from '@/components/AgentDashboard'
import BracketView from '@/components/BracketView'
import MaintenanceMode from '@/components/MaintenanceMode'
import { SupabaseSync, type SalesRep, type Sale } from '@/lib/supabase-sync'

// MAINTENANCE MODE - Set to true to show maintenance page
const MAINTENANCE_MODE = false

export default function MarchMadnessLeaderboard() {
  // Show maintenance mode if enabled
  if (MAINTENANCE_MODE) {
    return <MaintenanceMode />
  }
  const [salesReps, setSalesReps] = useState<SalesRep[]>([])
  const [recentSalesList, setRecentSales] = useState<Sale[]>([])
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [loggedInAgent, setLoggedInAgent] = useState<SalesRep | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeUntilStart, setTimeUntilStart] = useState<{days: number, hours: number, minutes: number, seconds: number} | null>(null)
  const [timeUntilEnd, setTimeUntilEnd] = useState<{days: number, hours: number, minutes: number, seconds: number} | null>(null)
  const [showRules, setShowRules] = useState(false)
  const [showAllCompetitors, setShowAllCompetitors] = useState(false)

  useEffect(() => {
    // Set client-side flag and initial time
    setIsClient(true)
    setCurrentTime(new Date())
    
    // Force clear any localStorage cache
    localStorage.removeItem('salesReps')
    localStorage.removeItem('recentSales')
    localStorage.removeItem('lastSync')
    
    // Initialize Supabase and load data
    const initializeData = async () => {
      try {
        await SupabaseSync.initialize()
        
        const [salesReps, sales] = await Promise.all([
          SupabaseSync.loadSalesReps(),
          SupabaseSync.loadSales()
        ])
        
        console.log('Loaded from Supabase:', { salesReps: salesReps.length, sales: sales.length })
        
        setSalesReps(salesReps)
        setRecentSales(sales)
        
        // Check for logged in agent
        const savedLoggedInAgent = localStorage.getItem('loggedInAgent')
        if (savedLoggedInAgent) {
          try {
            const parsedAgent = JSON.parse(savedLoggedInAgent)
            const currentAgent = salesReps.find(rep => rep.id === parsedAgent.id)
            if (currentAgent) {
              setLoggedInAgent(currentAgent)
            }
          } catch (e) {
            console.error('Error parsing saved logged in agent:', e)
            localStorage.removeItem('loggedInAgent')
          }
        }
        
        setIsLoading(false)
      } catch (error) {
        console.error('Error initializing data:', error)
        setIsLoading(false)
      }
    }
    
    initializeData()
    
    // Set up real-time subscriptions
    const unsubscribe = SupabaseSync.subscribeToChanges(
      (updatedReps) => {
        setSalesReps(updatedReps)
        
        // Update logged in agent if their data changed
        const savedLoggedInAgent = localStorage.getItem('loggedInAgent')
        if (savedLoggedInAgent) {
          try {
            const parsedAgent = JSON.parse(savedLoggedInAgent)
            const updatedAgent = updatedReps.find(rep => rep.id === parsedAgent.id)
            if (updatedAgent) {
              setLoggedInAgent(updatedAgent)
              localStorage.setItem('loggedInAgent', JSON.stringify(updatedAgent))
            }
          } catch (error) {
            console.error('Error updating logged in agent:', error)
          }
        }
      },
      (updatedSales) => {
        setRecentSales(updatedSales)
      }
    )
    
    // Check for logged in agent
    const savedLoggedInAgent = localStorage.getItem('loggedInAgent')
    if (savedLoggedInAgent) {
      try {
        const parsedAgent = JSON.parse(savedLoggedInAgent)
        const currentAgent = localData.salesReps.find(rep => rep.id === parsedAgent.id)
        if (currentAgent) {
          setLoggedInAgent(currentAgent)
        }
      } catch (e) {
        console.error('Error parsing saved logged in agent:', e)
        localStorage.removeItem('loggedInAgent')
      }
    }
    
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
    }
  }, [])

  const handleLogin = (agentId: string) => {
    const agent = salesReps.find(rep => rep.id === agentId)
    if (agent) {
      setLoggedInAgent(agent)
      localStorage.setItem('loggedInAgent', JSON.stringify(agent))
    }
  }

  const handleLogout = () => {
    setLoggedInAgent(null)
    localStorage.removeItem('loggedInAgent')
  }

  const handleRecordSale = async (saleData: Omit<Sale, 'id' | 'timestamp'>) => {
    try {
      const { success } = await SupabaseSync.recordSale(saleData)
      if (success) {
        console.log('Sale recorded successfully')
        // Real-time subscription will update the UI automatically
      } else {
        console.error('Failed to record sale')
      }
    } catch (error) {
      console.error('Error recording sale:', error)
    }
  }

  const handleDeleteSale = async (saleId: string) => {
    try {
      const { success } = await SupabaseSync.deleteSale(saleId)
      if (success) {
        console.log('Sale deleted successfully')
        // Real-time subscription will update the UI automatically
      } else {
        console.error('Failed to delete sale')
      }
    } catch (error) {
      console.error('Error deleting sale:', error)
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
          <div className="text-gray-400 text-lg mt-2">Syncing with live database...</div>
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
          
          <motion.button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-sm md:text-base shadow-xl hover:from-blue-600 hover:to-blue-800 transition-all flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            🔄 REFRESH DATA
          </motion.button>
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
                      <div className="text-red-300 font-semibold">❌ Rewrites don&apos;t count</div>
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
