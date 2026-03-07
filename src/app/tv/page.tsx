'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Crown, Award, Star, Target } from 'lucide-react'
import TVBracketView from '@/components/TVBracketView'
import RealTimeSync, { type SalesRep, type Sale } from '@/lib/real-time-sync'

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

// Fixed date to prevent hydration errors
const FIXED_DATE = new Date('2024-03-01T00:00:00.000Z')

// All 36 participants for March Madness tournament
const bracketParticipants: SalesRep[] = [
  { id: '1', name: 'MAX KONOPKA', totalSales: 0, totalPremium: 0, rank: 1, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 1 },
  { id: '2', name: 'ROBERT BRADY', totalSales: 0, totalPremium: 0, rank: 2, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 2 },
  { id: '3', name: 'ZION RUSSELL', totalSales: 0, totalPremium: 0, rank: 3, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 3 },
  { id: '4', name: 'BYRON ACHA', totalSales: 0, totalPremium: 0, rank: 4, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 4 },
  { id: '5', name: 'JOSE VALDEZ', totalSales: 0, totalPremium: 0, rank: 5, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 5 },
  { id: '6', name: 'JADEN POPE', totalSales: 0, totalPremium: 0, rank: 6, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 6 },
  { id: '7', name: 'WESTON CHRISTOPHER', totalSales: 0, totalPremium: 0, rank: 7, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 7 },
  { id: '8', name: 'NOLAN SCHOENBACHLER', totalSales: 0, totalPremium: 0, rank: 8, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 8 },
  { id: '9', name: 'THOMAS FOX', totalSales: 0, totalPremium: 0, rank: 9, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 9 },
  { id: '10', name: 'JEREMI KISINSKI', totalSales: 0, totalPremium: 0, rank: 10, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 10 },
  { id: '11', name: 'JAKE DOLL', totalSales: 0, totalPremium: 0, rank: 11, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 11 },
  { id: '12', name: 'DANIEL SUAREZ', totalSales: 0, totalPremium: 0, rank: 12, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 12 },
  { id: '13', name: 'RYAN BOVE', totalSales: 0, totalPremium: 0, rank: 13, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 13 },
  { id: '14', name: 'RYAN COOPER', totalSales: 0, totalPremium: 0, rank: 14, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 14 },
  { id: '15', name: 'LUCAS KONSTATOS', totalSales: 0, totalPremium: 0, rank: 15, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 15 },
  { id: '16', name: 'ANTHONY MAYROSE', totalSales: 0, totalPremium: 0, rank: 16, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 16 },
  { id: '17', name: 'ANDREW FLASKAMP', totalSales: 0, totalPremium: 0, rank: 17, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 17 },
  { id: '18', name: 'FABIAN ESCATEL', totalSales: 0, totalPremium: 0, rank: 18, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 18 },
  { id: '19', name: 'KAMREN HERALD', totalSales: 0, totalPremium: 0, rank: 19, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 19 },
  { id: '20', name: 'TIVON BURNS', totalSales: 0, totalPremium: 0, rank: 20, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 20 },
  { id: '21', name: 'BRENNAN SKODA', totalSales: 0, totalPremium: 0, rank: 21, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 21 },
  { id: '22', name: 'AALYIAH WASHBURN', totalSales: 0, totalPremium: 0, rank: 22, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 22 },
  { id: '23', name: 'KADEN CAMENZIND', totalSales: 0, totalPremium: 0, rank: 23, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 23 },
  { id: '24', name: 'HANNAH FRENCH', totalSales: 0, totalPremium: 0, rank: 24, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 24 },
  { id: '25', name: 'MICHAEL CARNEY', totalSales: 0, totalPremium: 0, rank: 25, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 25 },
  { id: '26', name: 'TAJ DHILLON', totalSales: 0, totalPremium: 0, rank: 26, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 26 },
  { id: '27', name: 'JACOB LEE', totalSales: 0, totalPremium: 0, rank: 27, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 27 },
  { id: '28', name: 'ADRIEN RAMÍREZ-RAYO', totalSales: 0, totalPremium: 0, rank: 28, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 28 },
  { id: '29', name: 'DENNIS CHORNIY', totalSales: 0, totalPremium: 0, rank: 29, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 29 },
  { id: '30', name: 'CHARLIE SIMMS', totalSales: 0, totalPremium: 0, rank: 30, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 30 },
  { id: '31', name: 'BRENON REED', totalSales: 0, totalPremium: 0, rank: 31, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 31 },
  { id: '32', name: 'KIRILL PAVLYCHEV', totalSales: 0, totalPremium: 0, rank: 32, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 32 },
  { id: '33', name: 'LAINEY DROWN', totalSales: 0, totalPremium: 0, rank: 33, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 33 },
  { id: '34', name: 'VALERIA ALVAL', totalSales: 0, totalPremium: 0, rank: 34, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 34 },
  { id: '35', name: 'MASON GARCIA', totalSales: 0, totalPremium: 0, rank: 35, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 35 },
  { id: '36', name: 'SOPHIA MARTINEZ', totalSales: 0, totalPremium: 0, rank: 36, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 36 },
]

export default function TVMode() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [salesReps, setSalesReps] = useState<SalesRep[]>(bracketParticipants.sort((a, b) => b.totalSales - a.totalSales || b.totalPremium - a.totalPremium))
  const [timeUntilStart, setTimeUntilStart] = useState<{days: number, hours: number, minutes: number, seconds: number} | null>(null)
  const [timeUntilEnd, setTimeUntilEnd] = useState<{days: number, hours: number, minutes: number, seconds: number} | null>(null)

  useEffect(() => {
    // Set client-side flag and initial time
    setIsClient(true)
    setCurrentTime(new Date())
    
    // EMERGENCY: Reset all data to fix inconsistencies
    if (typeof window !== 'undefined') {
      localStorage.removeItem('march_madness_data')
      localStorage.removeItem('march_madness_emergency') 
      localStorage.removeItem('salesReps')
      localStorage.removeItem('recentSales')
      console.log('🔄 TV: Cleared all cached tournament data')
    }
    
    // Initialize real-time sync system
    const initializeData = async () => {
      try {
        const data = await RealTimeSync.initialize()
        setSalesReps(data.salesReps.sort((a, b) => b.totalSales - a.totalSales || b.totalPremium - a.totalPremium))
      } catch (error) {
        console.error('Failed to initialize sync:', error)
      }
    }
    
    initializeData()
    
    // Subscribe to real-time updates
    const unsubscribe = RealTimeSync.subscribe((updatedData) => {
      setSalesReps(updatedData.salesReps.sort((a, b) => b.totalSales - a.totalSales || b.totalPremium - a.totalPremium))
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
        } catch (error) {
          console.error('Error syncing sales reps:', error)
        }
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // Also poll every 2 seconds to catch same-tab updates
    const pollInterval = setInterval(() => {
      const savedSalesReps = localStorage.getItem('salesReps')
      if (savedSalesReps) {
        try {
          const parsedReps = JSON.parse(savedSalesReps).map((rep: SalesRep & {lastSale: string}) => ({
            ...rep,
            lastSale: new Date(rep.lastSale)
          }))
          setSalesReps(parsedReps)
        } catch (e) {
          console.error('Error polling sales reps:', e)
        }
      }
    }, 2000)
    
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
      RealTimeSync.cleanup()
    }
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD', 
      minimumFractionDigits: 0 
    }).format(amount)
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { 
      icon: Crown, 
      color: 'from-yellow-400 to-yellow-600', 
      bg: 'bg-gradient-to-br from-yellow-400/30 to-amber-500/30', 
      glow: 'shadow-yellow-500/50' 
    }
    if (rank === 2) return { 
      icon: Award, 
      color: 'from-gray-400 to-gray-600', 
      bg: 'bg-gradient-to-br from-gray-400/30 to-slate-500/30', 
      glow: 'shadow-gray-500/50' 
    }
    if (rank === 3) return { 
      icon: Star, 
      color: 'from-orange-400 to-orange-600', 
      bg: 'bg-gradient-to-br from-orange-400/30 to-red-500/30', 
      glow: 'shadow-orange-500/50' 
    }
    return { 
      icon: Target, 
      color: 'from-blue-400 to-blue-600', 
      bg: 'bg-white/10 backdrop-blur-sm', 
      glow: 'shadow-blue-500/20' 
    }
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900 text-white overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-red-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-32 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-700/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header - Responsive */}
      <div className="relative bg-gradient-to-r from-red-600 via-red-700 to-red-800 shadow-2xl border-b-4 md:border-b-8 border-red-400">
        {/* Mobile Header */}
        <div className="md:hidden p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <motion.div 
                className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-700 rounded-full flex items-center justify-center shadow-2xl relative"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Trophy className="w-6 h-6 text-white" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
              </motion.div>
              <div>
                <motion.h1 
                  className="text-2xl font-black text-white"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  🏀 MARCH MADNESS
                </motion.h1>
                <p className="text-sm text-red-100 font-bold">All In Agencies</p>
              </div>
            </div>
            
            {/* Mobile Clock */}
            <div className="text-right">
              <div className="text-lg font-bold text-white">
                {isClient && currentTime ? currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}
              </div>
              <div className="text-xs text-yellow-100">
                {isClient && currentTime ? currentTime.toLocaleDateString() : '--/--/----'}
              </div>
            </div>
          </div>

          {/* Mobile Stats Grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-white">36</div>
              <div className="text-xs text-yellow-100 font-semibold">COMPETITORS</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-white">
                {formatCurrency(salesReps.reduce((sum, rep) => sum + rep.totalPremium, 0)).replace('$', '').replace(',000', 'K')}
              </div>
              <div className="text-xs text-yellow-100 font-semibold">TOTAL SALES</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-white">
                {salesReps.reduce((sum, rep) => sum + rep.totalSales, 0)}
              </div>
              <div className="text-xs text-yellow-100 font-semibold">POLICIES</div>
            </div>
          </div>

          {/* Mobile Status */}
          <div className="flex justify-center space-x-4 mt-3">
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
              ● LIVE
            </div>
            <div className="text-red-100 text-sm font-bold">
              March 7-14, 2026
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <motion.div 
                className="w-24 h-24 bg-gradient-to-r from-red-500 to-red-700 rounded-full flex items-center justify-center shadow-2xl relative"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Trophy className="w-12 h-12 text-white" />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full animate-ping"></div>
              </motion.div>
              <div>
                <motion.h1 
                  className="text-6xl font-black text-white mb-2"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  🏀 MARCH MADNESS
                </motion.h1>
                <p className="text-3xl text-red-100 font-bold">All In Agencies • Sales Tournament</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="bg-green-500 text-white px-4 py-1 rounded-full text-lg font-bold animate-pulse">
                    ● LIVE
                  </div>
                  <div className="text-red-100 text-lg font-bold">
                    March 7-14, 2026
                  </div>
                </div>
              </div>
            </div>
            
            {/* Desktop Clock */}
            <div className="text-right">
              <div className="text-4xl font-bold text-white">
                {isClient && currentTime ? currentTime.toLocaleTimeString() : '--:--:--'}
              </div>
              <div className="text-xl text-yellow-100">
                {isClient && currentTime ? currentTime.toLocaleDateString() : '--/--/----'}
              </div>
            </div>
          </div>

          {/* Desktop Stats Bar */}
          <div className="flex justify-center space-x-8 mt-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 text-center">
              <div className="text-3xl font-bold text-white">36</div>
              <div className="text-lg text-yellow-100 font-semibold">COMPETITORS</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 text-center">
              <div className="text-3xl font-bold text-white">
                {formatCurrency(salesReps.reduce((sum, rep) => sum + rep.totalPremium, 0))}
              </div>
              <div className="text-lg text-yellow-100 font-semibold">TOTAL SALES</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 text-center">
              <div className="text-3xl font-bold text-white">
                {salesReps.reduce((sum, rep) => sum + rep.totalSales, 0)}
              </div>
              <div className="text-lg text-yellow-100 font-semibold">POLICIES SOLD</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Responsive Layout */}
      <div className="relative p-4">
        {/* Title - Responsive */}
        <motion.h2 
          className="text-3xl md:text-6xl font-black text-white mb-4 md:mb-8 text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          🏀 LIVE TOURNAMENT BRACKET 🏀
        </motion.h2>
        
        {/* Mobile Layout - Stacked */}
        <div className="md:hidden space-y-4">
          {/* Mobile Countdown Cards */}
          <div className="grid grid-cols-2 gap-3">
            {/* Countdown to Tournament End */}
            {timeUntilEnd && (
              <div className="bg-red-600/80 backdrop-blur-sm rounded-xl p-3 border border-red-400/20">
                <div className="text-center text-white">
                  <div className="text-sm font-bold mb-2">🏁 TOURNAMENT ENDS</div>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <div className="text-center">
                      <div className="text-lg font-bold">{timeUntilEnd.days}</div>
                      <div className="text-xs opacity-75">DAYS</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{timeUntilEnd.hours.toString().padStart(2, '0')}</div>
                      <div className="text-xs opacity-75">HRS</div>
                    </div>
                  </div>
                  <div className="text-xs opacity-75 mt-1">3/14/26 • 11:59 PM</div>
                </div>
              </div>
            )}

            {/* Live Status */}
            <div className="bg-black/80 backdrop-blur-sm rounded-xl p-3 border border-white/20">
              <div className="text-center text-white">
                <div className="text-lg font-bold text-green-400 mb-1">🔴 LIVE</div>
                <div className="text-base font-bold">ROUND 1</div>
                <div className="text-xs opacity-75">17 ACTIVE MATCHUPS</div>
              </div>
            </div>
          </div>

          {/* Mobile Top 10 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4 text-center">🏆 TOP 10</h3>
            <div className="space-y-2">
              {salesReps.slice(0, 10).map((agent, index) => {
                const badge = getRankBadge(agent.rank)
                const IconComponent = badge.icon
                return (
                  <div
                    key={agent.id}
                    className={`flex items-center justify-between p-3 rounded-lg ${badge.bg} border border-white/20`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 bg-gradient-to-r ${badge.color} rounded-full flex items-center justify-center`}>
                        <IconComponent className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">
                          #{index + 1} {agent.name.split(' ')[0]} {agent.name.split(' ')[1] ? agent.name.split(' ')[1].charAt(0) + '.' : ''}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-white">{agent.totalSales}</div>
                      <div className="text-xs text-white/70">{formatCurrency(agent.totalPremium).replace('$', '').replace(',000', 'K')}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Mobile Bracket - Full Width */}
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 shadow-xl border border-white/20">
            <TVBracketView />
          </div>
        </div>

        {/* Desktop Layout - Split Layout: Bracket + Leaderboard */}
        <div className="hidden md:grid grid-cols-5 gap-4 h-full">
          {/* Main Bracket - 4/5 of screen */}
          <div className="col-span-4 bg-white/5 backdrop-blur-xl rounded-xl p-4 shadow-xl border border-white/20 h-[650px]">
            <TVBracketView />
          </div>

          {/* Right Sidebar - Leaderboard + Stats - 1/5 of screen */}
          <div className="col-span-1 space-y-3">
            {/* Live Stats */}
            <div className="bg-black/80 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-center text-white">
                <div className="text-2xl font-bold text-green-400 mb-2">🔴 LIVE</div>
                <div className="text-xl font-bold">ROUND 1</div>
                <div className="text-sm opacity-75">17 ACTIVE MATCHUPS</div>
              </div>
            </div>

            {/* Countdown to Round 1 */}
            {timeUntilStart && (
              <div className="bg-green-600/80 backdrop-blur-sm rounded-xl p-4 border border-green-400/20">
                <div className="text-center text-white">
                  <div className="text-lg font-bold mb-2">⏰ ROUND 1 STARTS</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {timeUntilStart.days > 0 && (
                      <div className="text-center">
                        <div className="text-xl font-bold">{timeUntilStart.days}</div>
                        <div className="text-xs opacity-75">DAYS</div>
                      </div>
                    )}
                    <div className="text-center">
                      <div className="text-xl font-bold">{timeUntilStart.hours.toString().padStart(2, '0')}</div>
                      <div className="text-xs opacity-75">HRS</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold">{timeUntilStart.minutes.toString().padStart(2, '0')}</div>
                      <div className="text-xs opacity-75">MIN</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold">{timeUntilStart.seconds.toString().padStart(2, '0')}</div>
                      <div className="text-xs opacity-75">SEC</div>
                    </div>
                  </div>
                  <div className="text-xs opacity-75 mt-2">3/7/26 • 12:00 AM</div>
                </div>
              </div>
            )}

            {/* Countdown to Tournament End */}
            {timeUntilEnd && (
              <div className="bg-red-600/80 backdrop-blur-sm rounded-xl p-4 border border-red-400/20">
                <div className="text-center text-white">
                  <div className="text-lg font-bold mb-2">🏁 TOURNAMENT ENDS</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {timeUntilEnd.days > 0 && (
                      <div className="text-center">
                        <div className="text-xl font-bold">{timeUntilEnd.days}</div>
                        <div className="text-xs opacity-75">DAYS</div>
                      </div>
                    )}
                    <div className="text-center">
                      <div className="text-xl font-bold">{timeUntilEnd.hours.toString().padStart(2, '0')}</div>
                      <div className="text-xs opacity-75">HRS</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold">{timeUntilEnd.minutes.toString().padStart(2, '0')}</div>
                      <div className="text-xs opacity-75">MIN</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold">{timeUntilEnd.seconds.toString().padStart(2, '0')}</div>
                      <div className="text-xs opacity-75">SEC</div>
                    </div>
                  </div>
                  <div className="text-xs opacity-75 mt-2">3/14/26 • 11:59 PM</div>
                </div>
              </div>
            )}

            {/* Top Performers */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-4 text-center">🏆 TOP 10</h3>
              <div className="space-y-2">
                {salesReps.slice(0, 10).map((agent, index) => {
                  const badge = getRankBadge(agent.rank)
                  const IconComponent = badge.icon
                  return (
                    <div
                      key={agent.id}
                      className={`flex items-center justify-between p-3 rounded-lg ${badge.bg} border border-white/20`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 bg-gradient-to-r ${badge.color} rounded-full flex items-center justify-center`}>
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white truncate">
                            #{index + 1} {agent.name.split(' ')[0]}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">{agent.totalSales}</div>
                        <div className="text-xs text-white/70">{formatCurrency(agent.totalPremium)}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Tournament Progress */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-3 text-center">📊 PROGRESS</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-white">
                  <span>Round 1</span>
                  <span className="text-green-400 font-bold">ACTIVE</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Round 2</span>
                  <span>Pending</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Final Four</span>
                  <span>Pending</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Championship</span>
                  <span>Pending</span>
                </div>
              </div>
            </div>

            {/* Live Clock */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center">
              <div className="text-2xl font-bold text-white">
                {isClient && currentTime ? currentTime.toLocaleTimeString() : '--:--:--'}
              </div>
              <div className="text-sm text-white/70">
                {isClient && currentTime ? currentTime.toLocaleDateString() : '--/--/----'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}