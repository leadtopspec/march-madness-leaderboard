'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Tv, Award, Target, Star, Crown, Users, LogIn } from 'lucide-react'
import LoginModal from '@/components/LoginModal'
import AgentDashboard from '@/components/AgentDashboard'
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
  { id: '1', name: 'SEED #1 TBD', totalSales: 0, totalPremium: 0, rank: 1, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 1 },
  { id: '2', name: 'SEED #2 TBD', totalSales: 0, totalPremium: 0, rank: 2, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 2 },
  { id: '3', name: 'SEED #3 TBD', totalSales: 0, totalPremium: 0, rank: 3, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 3 },
  { id: '4', name: 'SEED #4 TBD', totalSales: 0, totalPremium: 0, rank: 4, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 4 },
  { id: '5', name: 'SEED #5 TBD', totalSales: 0, totalPremium: 0, rank: 5, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 5 },
  { id: '6', name: 'SEED #6 TBD', totalSales: 0, totalPremium: 0, rank: 6, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 6 },
  { id: '7', name: 'SEED #7 TBD', totalSales: 0, totalPremium: 0, rank: 7, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 7 },
  { id: '8', name: 'SEED #8 TBD', totalSales: 0, totalPremium: 0, rank: 8, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 8 },
  { id: '9', name: 'SEED #9 TBD', totalSales: 0, totalPremium: 0, rank: 9, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 9 },
  { id: '10', name: 'SEED #10 TBD', totalSales: 0, totalPremium: 0, rank: 10, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 10 },
  { id: '11', name: 'SEED #11 TBD', totalSales: 0, totalPremium: 0, rank: 11, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 11 },
  { id: '12', name: 'SEED #12 TBD', totalSales: 0, totalPremium: 0, rank: 12, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 12 },
  { id: '13', name: 'SEED #13 TBD', totalSales: 0, totalPremium: 0, rank: 13, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 13 },
  { id: '14', name: 'SEED #14 TBD', totalSales: 0, totalPremium: 0, rank: 14, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 14 },
  { id: '15', name: 'SEED #15 TBD', totalSales: 0, totalPremium: 0, rank: 15, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 15 },
  { id: '16', name: 'SEED #16 TBD', totalSales: 0, totalPremium: 0, rank: 16, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 16 },
  { id: '17', name: 'SEED #17 TBD', totalSales: 0, totalPremium: 0, rank: 17, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 17 },
  { id: '18', name: 'SEED #18 TBD', totalSales: 0, totalPremium: 0, rank: 18, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 18 },
  { id: '19', name: 'SEED #19 TBD', totalSales: 0, totalPremium: 0, rank: 19, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 19 },
  { id: '20', name: 'SEED #20 TBD', totalSales: 0, totalPremium: 0, rank: 20, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 20 },
  { id: '21', name: 'SEED #21 TBD', totalSales: 0, totalPremium: 0, rank: 21, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 21 },
  { id: '22', name: 'SEED #22 TBD', totalSales: 0, totalPremium: 0, rank: 22, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 22 },
  { id: '23', name: 'SEED #23 TBD', totalSales: 0, totalPremium: 0, rank: 23, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 23 },
  { id: '24', name: 'SEED #24 TBD', totalSales: 0, totalPremium: 0, rank: 24, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 24 },
  { id: '25', name: 'SEED #25 TBD', totalSales: 0, totalPremium: 0, rank: 25, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 25 },
  { id: '26', name: 'SEED #26 TBD', totalSales: 0, totalPremium: 0, rank: 26, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 26 },
  { id: '27', name: 'SEED #27 TBD', totalSales: 0, totalPremium: 0, rank: 27, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 27 },
  { id: '28', name: 'SEED #28 TBD', totalSales: 0, totalPremium: 0, rank: 28, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 28 },
  { id: '29', name: 'SEED #29 TBD', totalSales: 0, totalPremium: 0, rank: 29, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 29 },
  { id: '30', name: 'SEED #30 TBD', totalSales: 0, totalPremium: 0, rank: 30, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 30 },
  { id: '31', name: 'SEED #31 TBD', totalSales: 0, totalPremium: 0, rank: 31, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 31 },
  { id: '32', name: 'SEED #32 TBD', totalSales: 0, totalPremium: 0, rank: 32, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 32 },
  { id: '33', name: 'SEED #33 TBD', totalSales: 0, totalPremium: 0, rank: 33, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 33 },
  { id: '34', name: 'SEED #34 TBD', totalSales: 0, totalPremium: 0, rank: 34, lastSale: FIXED_DATE, team: 'All In Agencies', bracketPosition: 34 },
]

export default function MarchMadnessLeaderboard() {
  const [salesReps, setSalesReps] = useState<SalesRep[]>(bracketParticipants)
  const [recentSalesList, setRecentSales] = useState<Sale[]>([])
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [loggedInAgent, setLoggedInAgent] = useState<SalesRep | null>(null)

  useEffect(() => {
    // Set client-side flag and initial time
    setIsClient(true)
    setCurrentTime(new Date())
    
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleLogin = (agentId: string) => {
    const agent = salesReps.find(rep => rep.id === agentId)
    if (agent) {
      setLoggedInAgent(agent)
    }
  }

  const handleLogout = () => {
    setLoggedInAgent(null)
  }

  const handleRecordSale = (saleData: Omit<Sale, 'id' | 'timestamp'>) => {
    const saleEntry: Sale = {
      id: Date.now().toString(),
      ...saleData,
      timestamp: new Date()
    }
    
    setRecentSales(prev => [saleEntry, ...prev.slice(0, 19)])
    
    const existingRep = salesReps.find(rep => 
      rep.name.toLowerCase().includes(saleData.repName.toLowerCase()) ||
      saleData.repName.toLowerCase().includes(rep.name.toLowerCase())
    )
    
    if (existingRep) {
      setSalesReps(prev => prev.map(rep => 
        rep.id === existingRep.id 
          ? { 
              ...rep, 
              totalSales: rep.totalSales + 1, 
              totalPremium: rep.totalPremium + saleData.premium,
              lastSale: new Date()
            }
          : rep
      ).sort((a, b) => b.totalSales - a.totalSales || b.totalPremium - a.totalPremium)
       .map((rep, index) => ({ ...rep, rank: index + 1 })))
      
      if (loggedInAgent && loggedInAgent.id === existingRep.id) {
        setLoggedInAgent(prev => prev ? {
          ...prev,
          totalSales: prev.totalSales + 1,
          totalPremium: prev.totalPremium + saleData.premium,
          lastSale: new Date()
        } : null)
      }
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

  // If agent is logged in, show their personal dashboard
  if (loggedInAgent) {
    const currentAgentData = salesReps.find(rep => rep.id === loggedInAgent.id)
    const updatedAgent = currentAgentData || loggedInAgent

    return (
      <AgentDashboard
        agent={updatedAgent}
        allAgents={salesReps}
        onRecordSale={handleRecordSale}
        onLogout={handleLogout}
        recentSales={recentSalesList}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-6 shadow-2xl">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">🏀</div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black">MARCH MADNESS</h1>
                <p className="text-lg font-bold opacity-90">ALL IN AGENCIES • SALES TOURNAMENT • MARCH 7-14</p>
              </div>
            </div>
            <div className="text-right hidden md:block">
              <div className="text-sm opacity-75">LIVE</div>
              <div className="text-xl font-bold">
                {isClient && currentTime ? currentTime.toLocaleTimeString() : '--:--:--'}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <motion.button
            onClick={() => setShowLoginModal(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:from-green-600 hover:to-emerald-700 transition-all flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogIn className="w-6 h-6" />
            🏄‍♂️ AGENT LOGIN
          </motion.button>
          
          <motion.a
            href="/tv"
            target="_blank"
            className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:from-purple-600 hover:to-pink-700 transition-all flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Tv className="w-6 h-6" />
            📺 TV DISPLAY
          </motion.a>
        </div>

        {/* Live Stats Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div 
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-4 text-center shadow-xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-3xl font-black">{salesReps.length}</div>
            <div className="text-sm font-bold opacity-90">COMPETITORS</div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl p-4 text-center shadow-xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-3xl font-black">{totalSales}</div>
            <div className="text-sm font-bold opacity-90">TOTAL SALES</div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl p-4 text-center shadow-xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-2xl font-black">${totalPremium.toLocaleString()}</div>
            <div className="text-sm font-bold opacity-90">TOTAL PREMIUM</div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl p-4 text-center shadow-xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-2xl font-black">7 DAYS</div>
            <div className="text-sm font-bold opacity-90">REMAINING</div>
          </motion.div>
        </div>

        {/* Live Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Performers */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <Crown className="w-8 h-8 text-yellow-400" />
              <h2 className="text-2xl font-black text-white">TOP PERFORMERS</h2>
            </div>
            
            <div className="space-y-4">
              {salesReps.slice(0, 10).map((rep, index) => (
                <motion.div
                  key={rep.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center justify-between p-4 rounded-xl border ${
                    index < 3 
                      ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/30' 
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg ${
                      index === 0 ? 'bg-yellow-400 text-yellow-900' :
                      index === 1 ? 'bg-gray-300 text-gray-800' :
                      index === 2 ? 'bg-orange-400 text-orange-900' :
                      'bg-white/10 text-white'
                    }`}>
                      #{index + 1}
                    </div>
                    <div>
                      <div className="font-bold text-white text-lg">{rep.name}</div>
                      <div className="text-sm text-white/70">All In Agencies</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-white">{rep.totalSales}</div>
                    <div className="text-sm text-white/70">${rep.totalPremium.toLocaleString()}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Live Bracket Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-8 h-8 text-orange-400" />
              <h2 className="text-2xl font-black text-white">TOURNAMENT BRACKET</h2>
            </div>
            
            {/* Bracket rounds preview */}
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-sm text-orange-400 font-bold mb-2">TBD</div>
                <div className="grid grid-cols-2 gap-2">
                  {[1,2,3,4,5,6,7,8].map(i => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-2 text-center">
                      <div className="text-xs text-white/70">SEED #{i}</div>
                      <div className="text-sm font-bold text-white truncate">
                        TBD
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <div className="text-sm text-yellow-400 font-bold mb-2">FINAL FOUR</div>
                <div className="grid grid-cols-2 gap-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-400/30 rounded-lg p-3 text-center">
                      <div className="text-xs text-yellow-400">REGION #{i}</div>
                      <div className="font-bold text-white">TBD</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <div className="text-sm text-red-400 font-bold mb-2">CHAMPIONSHIP</div>
                <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-400/30 rounded-xl p-4">
                  <div className="text-2xl font-black text-white mb-1">🏆</div>
                  <div className="text-lg font-bold text-white">MARCH MADNESS</div>
                  <div className="text-sm text-white/70">CHAMPION</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* All Competitors Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-8 h-8 text-cyan-400" />
            <h2 className="text-2xl font-black text-white">ALL COMPETITORS</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {salesReps.map((rep, index) => {
              const badge = getRankBadge(rep.rank)
              const IconComponent = badge.icon
              return (
                <motion.div
                  key={rep.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-3 text-center hover:bg-white/10 transition-all"
                >
                  <div className={`w-8 h-8 rounded-full mx-auto mb-2 bg-gradient-to-r ${badge.color} flex items-center justify-center`}>
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-white text-xs font-bold truncate">TBD</div>
                  <div className="text-white/50 text-xs">#{rep.rank}</div>
                  <div className="text-white text-sm font-bold">{rep.totalSales}</div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Tournament Bracket - Full View */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🏀</div>
              <h2 className="text-2xl font-black text-white">LIVE TOURNAMENT BRACKET</h2>
            </div>
            <div className="text-sm text-white/70 font-bold">March 7-14, 2025</div>
          </div>
          <BracketView />
        </motion.div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <motion.button
            onClick={() => setShowLoginModal(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-12 py-6 rounded-3xl font-black text-2xl shadow-2xl hover:from-green-600 hover:to-emerald-700 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🏄‍♂️ JOIN THE COMPETITION
          </motion.button>
          <p className="text-white/70 mt-4 text-lg font-bold">
            Enter your access code to start competing!
          </p>
        </div>
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
        agents={salesReps}
      />
    </div>
  )
}
