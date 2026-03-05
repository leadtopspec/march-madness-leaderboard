'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Crown, Award, Star, Target } from 'lucide-react'
import BracketView from '@/components/BracketView'

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

// All 34 participants for March Madness tournament
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
  { id: '20', name: 'JAYLEN BISCHOFF', totalSales: 0, totalPremium: 0, rank: 20, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 20 },
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
]

export default function TVMode() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [salesReps] = useState<SalesRep[]>(bracketParticipants.sort((a, b) => b.totalSales - a.totalSales || b.totalPremium - a.totalPremium))

  useEffect(() => {
    // Set client-side flag and initial time
    setIsClient(true)
    setCurrentTime(new Date())
    
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
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

  const topAgents = salesReps.slice(0, 10)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-32 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <div className="relative bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 p-8 shadow-2xl border-b-8 border-yellow-400">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <motion.div 
              className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl relative"
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
              <p className="text-3xl text-yellow-100 font-bold">All In Agencies • Sales Tournament</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="bg-green-500 text-white px-4 py-1 rounded-full text-lg font-bold animate-pulse">
                  ● LIVE
                </div>
                <div className="text-yellow-100 text-lg font-bold">
                  March 7-14, 2025
                </div>
              </div>
            </div>
          </div>
          
          {/* Live Clock */}
          <div className="text-right">
            <div className="text-4xl font-bold text-white">
              {isClient && currentTime ? currentTime.toLocaleTimeString() : '--:--:--'}
            </div>
            <div className="text-xl text-yellow-100">
              {isClient && currentTime ? currentTime.toLocaleDateString() : '--/--/----'}
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex justify-center space-x-8 mt-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 text-center">
            <div className="text-3xl font-bold text-white">34</div>
            <div className="text-lg text-yellow-100 font-semibold">COMPETITORS</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 text-center">
            <div className="text-3xl font-bold text-white">$0</div>
            <div className="text-lg text-yellow-100 font-semibold">TOTAL SALES</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 text-center">
            <div className="text-3xl font-bold text-white">0</div>
            <div className="text-lg text-yellow-100 font-semibold">POLICIES SOLD</div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Tournament Bracket - Takes up 2/3 of screen on large displays */}
        <div className="lg:col-span-2">
          <motion.h2 
            className="text-4xl font-bold text-white mb-4 text-center flex items-center justify-center gap-3"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            🌴 Tournament Bracket 🏀
          </motion.h2>
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border-2 border-white/20">
            <BracketView />
          </div>
        </div>

        {/* Leaderboard - Takes up 1/3 of screen */}
        <div>
          <motion.h2 
            className="text-3xl font-bold text-white mb-4 text-center flex items-center justify-center gap-2"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            👑 TOP PERFORMERS
          </motion.h2>

          <div className="space-y-3">
            {topAgents.map((agent, index) => {
              const badge = getRankBadge(agent.rank)
              const IconComponent = badge.icon
              
              return (
                <motion.div
                  key={agent.id}
                  className={`${badge.bg} backdrop-blur-sm rounded-2xl p-4 border border-white/20 ${badge.glow} shadow-lg`}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 bg-gradient-to-r ${badge.color} rounded-full flex items-center justify-center shadow-lg`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-white">
                          #{agent.rank} {agent.name}
                        </div>
                        <div className="text-sm text-white/70 font-semibold">
                          {agent.team}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-white">
                        {agent.totalSales}
                      </div>
                      <div className="text-sm text-white/70 font-semibold">
                        {formatCurrency(agent.totalPremium)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Tournament Progress */}
          <div className="mt-6 bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-3 text-center">🏆 Tournament Status</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-white">
                <span>Round 1 (17 matchups)</span>
                <span className="text-green-400 font-bold">ACTIVE</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Round 2 (8 matchups)</span>
                <span>Pending</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Quarterfinals (4 matchups)</span>
                <span>Pending</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Final Four (2 matchups)</span>
                <span>Pending</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Championship (1 matchup)</span>
                <span>Pending</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}