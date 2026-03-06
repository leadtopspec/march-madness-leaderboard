'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, TrendingUp, Users, Clock, Plus, LogOut, Crown, Award, Star, Zap, X } from 'lucide-react'

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

interface AgentDashboardProps {
  agent: SalesRep
  allAgents: SalesRep[]
  onRecordSale: (sale: Omit<Sale, 'id' | 'timestamp'>) => void
  onDeleteSale: (saleId: string) => void
  onLogout: () => void
  recentSales: Sale[]
}

export default function AgentDashboard({ agent, allAgents: _allAgents, onRecordSale, onDeleteSale, onLogout, recentSales }: AgentDashboardProps) {
  // Keep allAgents for future matchup functionality
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _unused = _allAgents;
  const [newSale, setNewSale] = useState({
    carrier: '',
    eftDate: '',
    lead: '',
    policyType: 'Term Life',
    premium: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Set client-side flag and initial time
    setIsClient(true)
    setCurrentTime(new Date())
    
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleSubmitSale = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSale.carrier || !newSale.eftDate || !newSale.lead || !newSale.premium) return

    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    onRecordSale({
      repName: agent.name,
      clientName: `${newSale.carrier} | ${newSale.lead}`,
      policyType: newSale.policyType,
      premium: parseFloat(newSale.premium)
    })
    
    setNewSale({ carrier: '', eftDate: '', lead: '', policyType: 'Term Life', premium: '' })
    setIsSubmitting(false)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount)
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { icon: Crown, color: 'from-red-400 to-red-600', bg: 'bg-gradient-to-br from-red-600/30 to-red-800/30 border-red-500', glow: 'shadow-red-500/50' }
    if (rank === 2) return { icon: Award, color: 'from-gray-400 to-gray-600', bg: 'bg-gradient-to-br from-gray-700/30 to-black/30 border-gray-600', glow: 'shadow-gray-500/50' }
    if (rank === 3) return { icon: Star, color: 'from-red-300 to-red-500', bg: 'bg-gradient-to-br from-red-500/20 to-red-700/20 border-red-400', glow: 'shadow-red-500/30' }
    return { icon: Target, color: 'from-gray-400 to-gray-600', bg: 'bg-black/80 backdrop-blur-sm border-red-600', glow: 'shadow-red-500/20' }
  }

  // Week 1 - Play-In Round Matchups (17 games total)
  const playInRoundMatchups = [
    { game: 1, team1: "MAX KONOPKA", team2: "ROBERT BRADY" },
    { game: 2, team1: "ZION RUSSELL", team2: "BYRON ACHA" },
    { game: 3, team1: "JOSE VALDEZ", team2: "JADEN POPE" },
    { game: 4, team1: "WESTON CHRISTOPHER", team2: "NOLAN SCHOENBACHLER" },
    { game: 5, team1: "THOMAS FOX", team2: "JEREMI KISINSKI" },
    { game: 6, team1: "JAKE DOLL", team2: "DANIEL SUAREZ" },
    { game: 7, team1: "RYAN BOVE", team2: "RYAN COOPER" },
    { game: 8, team1: "LUCAS KONSTATOS", team2: "ANTHONY MAYROSE" },
    { game: 9, team1: "ANDREW FLASKAMP", team2: "FABIAN ESCATEL" },
    { game: 10, team1: "KAMREN HERALD", team2: "JAYLEN BISCHOFF" },
    { game: 11, team1: "BRENNAN SKODA", team2: "AALYIAH WASHBURN" },
    { game: 12, team1: "KADEN CAMENZIND", team2: "HANNAH FRENCH" },
    { game: 13, team1: "MICHAEL CARNEY", team2: "TAJ DHILLON" },
    { game: 14, team1: "JACOB LEE", team2: "ADRIEN RAMÍREZ-RAYO" },
    { game: 15, team1: "DENNIS CHORNIY", team2: "CHARLIE SIMMS" },
    { game: 16, team1: "BRENON REED", team2: "KIRILL PAVLYCHEV" },
    { game: 17, team1: "LAINEY DROWN", team2: "VALERIA ALVAL" },
  ]

  const getCurrentMatchup = () => {
    // Find the matchup this agent is in
    const matchup = playInRoundMatchups.find(m => 
      m.team1 === agent.name || m.team2 === agent.name
    )
    
    if (matchup) {
      const opponent = matchup.team1 === agent.name ? matchup.team2 : matchup.team1
      const opponentAgent = _allAgents.find(a => a.name === opponent)
      return { opponent: opponentAgent, matchup, gameNumber: matchup.game }
    }
    
    return null
  }

  const currentMatchup = getCurrentMatchup()
  const agentBadge = getRankBadge(agent.rank)
  const AgentIcon = agentBadge.icon
  const mySales = recentSales.filter(sale => sale.repName === agent.name).slice(0, 5)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900">
      {/* Personal Header */}
      <nav className="bg-black/90 backdrop-blur-xl shadow-2xl border-b-2 border-red-500 sticky top-0 z-50">
        <div className="max-w-8xl mx-auto px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${agentBadge.color} flex items-center justify-center shadow-lg`}>
                <AgentIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white">👋 Welcome, {agent.name.split(' ')[0]}</h1>
                <p className="text-lg text-red-300 font-semibold">🏀 Your March Madness Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="text-sm text-gray-400 font-medium">🏀 Live Updates</div>
                <div className="text-xl font-bold text-white">
                  {isClient && currentTime ? currentTime.toLocaleTimeString() : '--:--:--'}
                </div>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all shadow-lg"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-semibold">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-8xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* My Stats */}
          <div className="lg:col-span-2 space-y-8">
            {/* Performance Overview */}
            <motion.div 
              className={`${agentBadge.bg} border-2 rounded-3xl p-8 ${agentBadge.glow} shadow-2xl`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${agentBadge.color} flex items-center justify-center shadow-lg relative`}>
                    <AgentIcon className="w-8 h-8 text-white" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-800 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      #{agent.rank}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white">Your Performance</h2>
                    <p className="text-lg text-red-300 font-semibold">{agent.team}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg text-gray-400">Tournament Rank</div>
                  <div className="text-4xl font-black text-white">#{agent.rank}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="text-center bg-red-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-red-700">
                  <div className="text-4xl font-black text-red-300 mb-2">{agent.totalSales}</div>
                  <div className="text-lg font-bold text-white">Total Sales</div>
                  <div className="text-sm text-gray-400">Policies Sold</div>
                </div>
                <div className="text-center bg-black/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-700">
                  <div className="text-4xl font-black text-green-400 mb-2">{formatCurrency(agent.totalPremium).replace('$', '').replace(',000', 'K')}</div>
                  <div className="text-lg font-bold text-white">Total Premium</div>
                  <div className="text-sm text-gray-400">Volume Generated</div>
                </div>
                <div className="text-center bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-600">
                  <div className="text-4xl font-black text-red-400 mb-2">{formatCurrency(agent.totalPremium).replace('$', '').replace(',000', 'K')}</div>
                  <div className="text-lg font-bold text-white">Annual Premium</div>
                  <div className="text-sm text-gray-400">AP Volume</div>
                </div>
              </div>
            </motion.div>

            {/* Current Matchup - Live */}
            <motion.div 
              className="bg-gradient-to-br from-red-900/40 via-black/60 to-gray-900/40 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-red-600 p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-center space-x-3 mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl flex items-center justify-center shadow-xl">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-4xl font-black text-white">🥊 YOUR MATCHUP</h3>
              </div>

              {currentMatchup?.opponent ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-6">⚔️</div>
                  <div className="text-2xl font-black text-white mb-4">GAME #{currentMatchup.gameNumber} - HEAD TO HEAD</div>
                  
                  <div className="grid grid-cols-3 gap-4 items-center max-w-2xl mx-auto">
                    {/* You */}
                    <div className="bg-red-600/30 border-2 border-red-400 rounded-xl p-6 text-center">
                      <div className="text-4xl mb-2">💪</div>
                      <div className="text-xl font-black text-white">{agent.name.split(' ')[0]}</div>
                      <div className="text-sm text-red-300">YOU</div>
                      <div className="mt-3 space-y-1">
                        <div className="text-2xl font-black text-white">{agent.totalSales}</div>
                        <div className="text-xs text-gray-400">Sales</div>
                        <div className="text-lg font-bold text-green-400">{formatCurrency(agent.totalPremium)}</div>
                      </div>
                    </div>

                    {/* VS */}
                    <div className="text-center">
                      <div className="text-4xl font-black text-red-400 mb-2">VS</div>
                      <div className="text-sm text-gray-400">First to advance wins</div>
                    </div>

                    {/* Opponent */}
                    <div className="bg-gray-700/30 border-2 border-gray-500 rounded-xl p-6 text-center">
                      <div className="text-4xl mb-2">🎯</div>
                      <div className="text-xl font-black text-white">{currentMatchup.opponent.name.split(' ')[0]}</div>
                      <div className="text-sm text-gray-300">OPPONENT</div>
                      <div className="mt-3 space-y-1">
                        <div className="text-2xl font-black text-white">{currentMatchup.opponent.totalSales}</div>
                        <div className="text-xs text-gray-400">Sales</div>
                        <div className="text-lg font-bold text-green-400">{formatCurrency(currentMatchup.opponent.totalPremium)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 bg-black/80 border-2 border-red-600 rounded-2xl p-6 max-w-lg mx-auto backdrop-blur-sm">
                    <div className="text-lg font-bold text-red-300 mb-2">🔴 LIVE COMPETITION!</div>
                    <div className="text-sm text-white">Record sales now to outperform your opponent and advance to Round 2!</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-8xl mb-6">🏖️</div>
                  <div className="text-3xl font-black text-gray-400 mb-4">Matchup Loading...</div>
                  <div className="text-xl text-gray-500 mb-6">Checking your tournament position...</div>
                </div>
              )}

            </motion.div>

            {/* My Recent Sales */}
            <motion.div 
              className="bg-black/90 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-red-600 p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-700 rounded-2xl flex items-center justify-center">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-3xl font-black text-white">🌊 My Recent Sales</h3>
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {mySales.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🏄‍♂️</div>
                      <div className="text-2xl font-bold text-gray-400 mb-2">No sales recorded yet</div>
                      <div className="text-lg text-gray-500">Start riding the wave!</div>
                    </div>
                  ) : (
                    mySales.map((sale, index) => (
                      <motion.div
                        key={sale.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gradient-to-r from-red-900/20 to-red-800/20 border-2 border-red-600 rounded-xl p-4 hover:shadow-lg transition-all backdrop-blur-sm"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-black text-white text-lg">{sale.clientName}</div>
                            <div className="text-sm text-red-300 font-semibold">{sale.policyType}</div>
                            <div className="text-xs text-green-400 font-medium">AP: {formatCurrency(sale.premium)}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-black text-green-400 text-xl">{formatCurrency(sale.premium)}</div>
                            <div className="text-xs text-gray-400">{sale.timestamp.toLocaleString()}</div>
                          </div>
                          <button
                            onClick={() => {
                              if (confirm('Delete this sale? This cannot be undone.')) {
                                onDeleteSale(sale.id)
                              }
                            }}
                            className="ml-2 p-1 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
                            title="Delete sale"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Record Sale Sidebar */}
          <div className="space-y-8">
            {/* Quick Record Sale */}
            <motion.div 
              className="bg-black/90 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-red-600 p-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                  <Plus className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-black text-white">🎯 Record New Sale</h3>
              </div>
              
              <form onSubmit={handleSubmitSale} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-white mb-2">Carrier</label>
                  <input
                    type="text"
                    value={newSale.carrier}
                    onChange={(e) => setNewSale(prev => ({ ...prev, carrier: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-900 text-white border-2 border-red-600 rounded-xl focus:border-red-400 focus:ring-4 focus:ring-red-500/20 transition-all font-semibold placeholder-gray-400"
                    placeholder="Insurance carrier name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-white mb-2">EFT Date</label>
                  <input
                    type="date"
                    value={newSale.eftDate}
                    onChange={(e) => setNewSale(prev => ({ ...prev, eftDate: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-900 text-white border-2 border-red-600 rounded-xl focus:border-red-400 focus:ring-4 focus:ring-red-500/20 transition-all font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-white mb-2">Lead Source</label>
                  <input
                    type="text"
                    value={newSale.lead}
                    onChange={(e) => setNewSale(prev => ({ ...prev, lead: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-900 text-white border-2 border-red-600 rounded-xl focus:border-red-400 focus:ring-4 focus:ring-red-500/20 transition-all font-semibold placeholder-gray-400"
                    placeholder="Lead source/type"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-white mb-2">Policy Type</label>
                  <select
                    value={newSale.policyType}
                    onChange={(e) => setNewSale(prev => ({ ...prev, policyType: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-900 text-white border-2 border-red-600 rounded-xl focus:border-red-400 focus:ring-4 focus:ring-red-500/20 transition-all font-semibold"
                  >
                    <option value="Term Life">Term Life</option>
                    <option value="Whole Life">Whole Life</option>
                    <option value="IUL">IUL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-white mb-2">Annual Premium ($)</label>
                  <input
                    type="number"
                    value={newSale.premium}
                    onChange={(e) => setNewSale(prev => ({ ...prev, premium: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-900 text-white border-2 border-red-600 rounded-xl focus:border-red-400 focus:ring-4 focus:ring-red-500/20 transition-all font-semibold text-lg placeholder-gray-400"
                    placeholder="Enter any amount (e.g. 1500.50, 5000.99, 12000.25)"
                    min="0.01"
                    step="0.01"
                    required
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 px-6 rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl font-bold text-lg disabled:opacity-50"
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                >
                  {isSubmitting ? '🏄‍♂️ Recording...' : '🎯 Record Sale!'}
                </motion.button>
              </form>
            </motion.div>

            {/* Tournament Position */}
            <motion.div 
              className="bg-gradient-to-br from-red-900/40 to-black/60 rounded-3xl shadow-2xl border-2 border-red-600 p-6 backdrop-blur-sm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-700 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-black text-white">🏖️ Your Position</h3>
              </div>
              
              <div className="space-y-3">
                <div className="text-center bg-red-900/80 backdrop-blur-sm rounded-xl p-4 border border-red-600">
                  <div className="text-3xl font-black text-red-300">#{agent.rank}</div>
                  <div className="text-sm font-bold text-white">Current Rank</div>
                </div>
                
                {agent.rank <= 8 && (
                  <div className="text-center bg-green-900/80 backdrop-blur-sm rounded-xl p-4 border border-green-600">
                    <div className="text-lg font-black text-green-300">🏝️ IN THE BRACKET!</div>
                    <div className="text-xs text-green-400">You&apos;re competing for the championship</div>
                  </div>
                )}
                
                {agent.rank > 8 && (
                  <div className="text-center bg-orange-900/80 backdrop-blur-sm rounded-xl p-4 border border-orange-600">
                    <div className="text-lg font-black text-orange-300">⚡ PUSH TO TOP 8!</div>
                    <div className="text-xs text-orange-400">Make more sales to enter bracket</div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div 
              className="bg-black/90 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-red-600 p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-700 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-black text-white">⚡ Quick Facts</h3>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Sale:</span>
                  <span className="font-bold text-white">{agent.totalSales > 0 ? agent.lastSale.toLocaleDateString() : 'None'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Avg Premium:</span>
                  <span className="font-bold text-white">{agent.totalSales > 0 ? formatCurrency(agent.totalPremium / agent.totalSales) : '$0'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Team:</span>
                  <span className="font-bold text-white">{agent.team}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}