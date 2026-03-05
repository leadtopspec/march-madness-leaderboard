'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, TrendingUp, Users, Clock, Plus, LogOut, Crown, Award, Star, Zap } from 'lucide-react'

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
  onLogout: () => void
  recentSales: Sale[]
}

export default function AgentDashboard({ agent, allAgents: _allAgents, onRecordSale, onLogout, recentSales }: AgentDashboardProps) {
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
    if (rank === 1) return { icon: Crown, color: 'from-yellow-400 to-yellow-600', bg: 'bg-gradient-to-br from-yellow-400/30 to-amber-500/30 border-yellow-300', glow: 'shadow-yellow-500/50' }
    if (rank === 2) return { icon: Award, color: 'from-gray-400 to-gray-600', bg: 'bg-gradient-to-br from-gray-400/30 to-slate-500/30 border-gray-300', glow: 'shadow-gray-500/50' }
    if (rank === 3) return { icon: Star, color: 'from-orange-400 to-orange-600', bg: 'bg-gradient-to-br from-orange-400/30 to-red-500/30 border-orange-300', glow: 'shadow-orange-500/50' }
    return { icon: Target, color: 'from-blue-400 to-blue-600', bg: 'bg-white/90 backdrop-blur-sm border-slate-200', glow: 'shadow-slate-500/20' }
  }

  // Find current opponent based on bracket matchup - currently showing TBD
  // const getCurrentOpponent = () => {
  //   // Bracket matchups are TBD - will be populated once tournament starts
  //   // For now, return null until matchups are set
  //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   const _allAgents = allAgents // Keeping for future use when matchups are set
  //   return null
  // }

  // const opponent = getCurrentOpponent() // Temporarily disabled - all matchups TBD
  const agentBadge = getRankBadge(agent.rank)
  const AgentIcon = agentBadge.icon
  const mySales = recentSales.filter(sale => sale.repName === agent.name).slice(0, 5)

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50">
      {/* Personal Header */}
      <nav className="bg-white/90 backdrop-blur-xl shadow-2xl border-b-2 border-cyan-200 sticky top-0 z-50">
        <div className="max-w-8xl mx-auto px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${agentBadge.color} flex items-center justify-center shadow-lg`}>
                <AgentIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-800">👋 Welcome, {agent.name.split(' ')[0]}</h1>
                <p className="text-lg text-slate-600 font-semibold">🏀 Your March Madness Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="text-sm text-slate-500 font-medium">🏀 Live Updates</div>
                <div className="text-xl font-bold text-slate-700">
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
                    <h2 className="text-3xl font-black text-slate-800">Your Performance</h2>
                    <p className="text-lg text-slate-600 font-semibold">{agent.team}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg text-slate-600">Tournament Rank</div>
                  <div className="text-4xl font-black text-slate-800">#{agent.rank}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="text-center bg-white/80 rounded-2xl p-6 shadow-lg">
                  <div className="text-4xl font-black text-blue-600 mb-2">{agent.totalSales}</div>
                  <div className="text-lg font-bold text-slate-700">Total Sales</div>
                  <div className="text-sm text-slate-500">Policies Sold</div>
                </div>
                <div className="text-center bg-white/80 rounded-2xl p-6 shadow-lg">
                  <div className="text-4xl font-black text-green-600 mb-2">{formatCurrency(agent.totalPremium).replace('$', '').replace(',000', 'K')}</div>
                  <div className="text-lg font-bold text-slate-700">Total Premium</div>
                  <div className="text-sm text-slate-500">Volume Generated</div>
                </div>
                <div className="text-center bg-white/80 rounded-2xl p-6 shadow-lg">
                  <div className="text-4xl font-black text-purple-600 mb-2">{formatCurrency(agent.totalPremium).replace('$', '').replace(',000', 'K')}</div>
                  <div className="text-lg font-bold text-slate-700">Annual Premium</div>
                  <div className="text-sm text-slate-500">AP Volume</div>
                </div>
              </div>
            </motion.div>

            {/* Current Matchup - Enhanced */}
            <motion.div 
              className="bg-gradient-to-br from-orange-100 via-red-50 to-pink-100 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-orange-300 p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-center space-x-3 mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl flex items-center justify-center shadow-xl">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-4xl font-black text-slate-800">🆚 YOUR MATCHUP</h3>
              </div>

              <div className="text-center py-16">
                <div className="text-8xl mb-6">🏖️</div>
                <div className="text-3xl font-black text-slate-600 mb-4">Tournament Brackets TBD</div>
                <div className="text-xl text-slate-500 mb-6">Matchups will be announced soon!</div>
                <div className="bg-cyan-50 border-2 border-cyan-200 rounded-2xl p-6 max-w-md mx-auto">
                  <div className="text-lg font-bold text-cyan-800 mb-2">🌊 Get Ready to Compete!</div>
                  <div className="text-sm text-cyan-700">Record your sales to secure your position. Tournament brackets and matchups will be revealed when competition begins!</div>
                </div>
              </div>

            </motion.div>

            {/* My Recent Sales */}
            <motion.div 
              className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-green-200 p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-3xl font-black text-slate-800">🌊 My Recent Sales</h3>
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {mySales.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🏄‍♂️</div>
                      <div className="text-2xl font-bold text-slate-600 mb-2">No sales recorded yet</div>
                      <div className="text-lg text-slate-500">Start riding the wave!</div>
                    </div>
                  ) : (
                    mySales.map((sale, index) => (
                      <motion.div
                        key={sale.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 hover:shadow-lg transition-all"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-black text-slate-800 text-lg">{sale.clientName}</div>
                            <div className="text-sm text-slate-600 font-semibold">{sale.policyType}</div>
                            <div className="text-xs text-green-600 font-medium">AP: {formatCurrency(sale.premium)}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-black text-green-600 text-xl">{formatCurrency(sale.premium)}</div>
                            <div className="text-xs text-slate-500">{sale.timestamp.toLocaleString()}</div>
                          </div>
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
              className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-blue-200 p-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                  <Plus className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-black text-slate-800">🎯 Record New Sale</h3>
              </div>
              
              <form onSubmit={handleSubmitSale} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Carrier</label>
                  <input
                    type="text"
                    value={newSale.carrier}
                    onChange={(e) => setNewSale(prev => ({ ...prev, carrier: e.target.value }))}
                    className="w-full px-4 py-3 bg-blue-50/80 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all font-semibold"
                    placeholder="Insurance carrier name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">EFT Date</label>
                  <input
                    type="date"
                    value={newSale.eftDate}
                    onChange={(e) => setNewSale(prev => ({ ...prev, eftDate: e.target.value }))}
                    className="w-full px-4 py-3 bg-blue-50/80 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Lead Source</label>
                  <input
                    type="text"
                    value={newSale.lead}
                    onChange={(e) => setNewSale(prev => ({ ...prev, lead: e.target.value }))}
                    className="w-full px-4 py-3 bg-blue-50/80 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all font-semibold"
                    placeholder="Lead source/type"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Policy Type</label>
                  <select
                    value={newSale.policyType}
                    onChange={(e) => setNewSale(prev => ({ ...prev, policyType: e.target.value }))}
                    className="w-full px-4 py-3 bg-blue-50/80 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all font-semibold"
                  >
                    <option value="Term Life">Term Life</option>
                    <option value="Whole Life">Whole Life</option>
                    <option value="IUL">IUL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Annual Premium ($)</label>
                  <input
                    type="number"
                    value={newSale.premium}
                    onChange={(e) => setNewSale(prev => ({ ...prev, premium: e.target.value }))}
                    className="w-full px-4 py-3 bg-blue-50/80 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all font-semibold text-lg"
                    placeholder="Enter any amount (e.g. 1500, 5000, 12000)"
                    min="1"
                    step="1"
                    required
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl font-bold text-lg disabled:opacity-50"
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                >
                  {isSubmitting ? '🏄‍♂️ Recording...' : '🎯 Record Sale!'}
                </motion.button>
              </form>
            </motion.div>

            {/* Tournament Position */}
            <motion.div 
              className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl shadow-2xl border-2 border-purple-200 p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-black text-slate-800">🏖️ Your Position</h3>
              </div>
              
              <div className="space-y-3">
                <div className="text-center bg-white/80 rounded-xl p-4">
                  <div className="text-3xl font-black text-purple-600">#{agent.rank}</div>
                  <div className="text-sm font-bold text-slate-600">Current Rank</div>
                </div>
                
                {agent.rank <= 8 && (
                  <div className="text-center bg-green-100 rounded-xl p-4 border border-green-200">
                    <div className="text-lg font-black text-green-700">🏝️ IN THE BRACKET!</div>
                    <div className="text-xs text-green-600">You&apos;re competing for the championship</div>
                  </div>
                )}
                
                {agent.rank > 8 && (
                  <div className="text-center bg-orange-100 rounded-xl p-4 border border-orange-200">
                    <div className="text-lg font-black text-orange-700">⚡ PUSH TO TOP 8!</div>
                    <div className="text-xs text-orange-600">Make more sales to enter bracket</div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div 
              className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-slate-200 p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-slate-500 to-slate-600 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-black text-slate-800">⚡ Quick Facts</h3>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Last Sale:</span>
                  <span className="font-bold">{agent.totalSales > 0 ? agent.lastSale.toLocaleDateString() : 'None'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Avg Premium:</span>
                  <span className="font-bold">{agent.totalSales > 0 ? formatCurrency(agent.totalPremium / agent.totalSales) : '$0'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Team:</span>
                  <span className="font-bold">{agent.team}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}