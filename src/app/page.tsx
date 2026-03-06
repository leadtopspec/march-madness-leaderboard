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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-6 shadow-2xl border-b-4 border-red-400">
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
            className="bg-gradient-to-r from-red-500 to-red-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:from-red-600 hover:to-red-800 transition-all flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogIn className="w-6 h-6" />
            🏄‍♂️ AGENT LOGIN
          </motion.button>
          
          <motion.a
            href="/tv"
            target="_blank"
            className="bg-gradient-to-r from-gray-700 to-black text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:from-gray-800 hover:to-gray-900 transition-all flex items-center gap-3"
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
            className="bg-gradient-to-r from-red-500 to-red-700 text-white rounded-xl p-4 text-center shadow-xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-3xl font-black">{salesReps.length}</div>
            <div className="text-sm font-bold opacity-90">COMPETITORS</div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-xl p-4 text-center shadow-xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-3xl font-black">{totalSales}</div>
            <div className="text-sm font-bold opacity-90">TOTAL SALES</div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-xl p-4 text-center shadow-xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-2xl font-black">${totalPremium.toLocaleString()}</div>
            <div className="text-sm font-bold opacity-90">TOTAL PREMIUM</div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-r from-black to-gray-800 text-white rounded-xl p-4 text-center shadow-xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-2xl font-black">7 DAYS</div>
            <div className="text-sm font-bold opacity-90">REMAINING</div>
          </motion.div>
        </div>

        {/* Rules Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border-2 border-red-500/30 mb-8"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="text-3xl">📋</div>
            <h2 className="text-3xl font-black text-white">MARCH MADNESS SALES COMPETITION RULES</h2>
          </div>
          
          <div className="text-white space-y-6">
            <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4">
              <div className="text-xl font-bold text-red-200 mb-2">🎯 Objective</div>
              <div className="text-red-100">Outproduce your opponent in issued business and advance through the bracket.</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="bg-black/20 border border-gray-600/30 rounded-xl p-6">
                  <div className="text-lg font-bold text-gray-200 mb-3 flex items-center gap-2">
                    <span>1.</span> 🥊 Head-to-Head Matchups
                  </div>
                  <ul className="text-white/90 space-y-2 text-sm">
                    <li>• Each round you will be paired against one opponent</li>
                    <li>• Whoever writes the most issued premium for that round advances</li>
                  </ul>
                </div>

                <div className="bg-red-600/20 border border-red-500/30 rounded-xl p-6">
                  <div className="text-lg font-bold text-red-200 mb-3 flex items-center gap-2">
                    <span>2.</span> 📹 Zoom Room Requirement
                  </div>
                  <ul className="text-white/90 space-y-2 text-sm">
                    <li>• Both competitors must be in the same Zoom room while selling</li>
                    <li>• Cameras on and unmuted while working</li>
                    <li>• You must be actively dialing or presenting during the session</li>
                    <li className="text-purple-200 font-semibold">This keeps accountability high and creates real competition.</li>
                  </ul>
                </div>

                <div className="bg-white/5 border border-white/20 rounded-xl p-6">
                  <div className="text-lg font-bold text-green-200 mb-3 flex items-center gap-2">
                    <span>3.</span> ⚖️ What Counts
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="text-green-300 font-semibold">✅ Issued premium only counts</div>
                    <div className="text-red-300 font-semibold">❌ Rewrites do NOT count</div>
                    <div className="text-white/90">Only new submitted and issued business applies to the scoreboard.</div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/20 rounded-xl p-6">
                  <div className="text-lg font-bold text-yellow-200 mb-3 flex items-center gap-2">
                    <span>4.</span> 🏁 Rounds 1–3 (Submission Rounds)
                  </div>
                  <div className="text-white/90 space-y-2 text-sm">
                    <div>For the first three rounds:</div>
                    <ul className="space-y-1">
                      <li>• Winner is determined by total submitted premium</li>
                      <li>• Highest submitted production moves on to the next round</li>
                    </ul>
                    <div className="text-yellow-200 font-semibold">These rounds are meant to keep the bracket moving quickly.</div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="bg-white/5 border border-white/20 rounded-xl p-6">
                  <div className="text-lg font-bold text-red-200 mb-3 flex items-center gap-2">
                    <span>5.</span> 🏆 Final Round (Issued Business)
                  </div>
                  <div className="text-white/90 space-y-2 text-sm">
                    <div>The final round will be based on issued premium for the entire month.</div>
                    <ul className="space-y-1">
                      <li>• All production must issue during the month</li>
                      <li>• The person with the highest issued premium wins the tournament</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/20 rounded-xl p-6">
                  <div className="text-lg font-bold text-orange-200 mb-3 flex items-center gap-2">
                    <span>6.</span> 🚫 Integrity Rules
                  </div>
                  <ul className="text-white/90 space-y-2 text-sm">
                    <li>• No splitting apps</li>
                    <li>• No transferring apps</li>
                    <li>• No counting someone else&apos;s business</li>
                    <li>• Production must be written personally by you</li>
                    <li className="text-red-300 font-semibold">Violation = disqualification</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-red-500/20 to-red-700/20 border border-red-400/30 rounded-xl p-6">
                  <div className="text-lg font-bold text-yellow-200 mb-3 flex items-center gap-2">
                    <span>7.</span> 🏆 Winner
                  </div>
                  <div className="text-yellow-100 text-sm">
                    The highest issued premium in the final round wins the March Madness Championship Prize (Cancun Trip).
                  </div>
                </div>

                <div className="bg-gradient-to-r from-black/20 to-gray-800/20 border border-gray-400/30 rounded-xl p-6">
                  <div className="text-lg font-bold text-cyan-200 mb-3 flex items-center gap-2">
                    <span>8.</span> 🔥 Spirit of the Competition
                  </div>
                  <div className="text-cyan-100 space-y-2 text-sm">
                    <div>This is meant to create:</div>
                    <ul className="space-y-1">
                      <li>• accountability</li>
                      <li>• intensity</li>
                      <li>• fun competition</li>
                      <li>• massive production</li>
                    </ul>
                    <div className="text-cyan-200 font-bold text-center mt-4 text-lg">Iron sharpens iron.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

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
                      ? 'bg-gradient-to-r from-red-500/20 to-red-700/20 border-red-400/30' 
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
                <div className="text-sm text-orange-400 font-bold mb-2">ELITE 8</div>
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
                <div className="bg-gradient-to-r from-red-600/20 to-black/20 border border-red-400/30 rounded-xl p-4">
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
                  <div className="text-white text-xs font-bold truncate">{rep.name.split(' ')[0]}</div>
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
