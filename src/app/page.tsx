'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import LoginModal from '@/components/LoginModal'
import AgentDashboard from '@/components/AgentDashboard'
import RealTimeSync, { type SalesRep, type Sale } from '@/lib/real-time-sync'

export default function MarchMadnessLeaderboard() {
  const [salesReps, setSalesReps] = useState<SalesRep[]>([])
  const [recentSalesList, setRecentSales] = useState<Sale[]>([])
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [loggedInAgent, setLoggedInAgent] = useState<SalesRep | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsClient(true)
    setCurrentTime(new Date())
    
    // Initialize real-time sync system
    const initializeData = async () => {
      try {
        const data = await RealTimeSync.initialize()
        setSalesReps(data.salesReps)
        setRecentSales(data.sales)
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to initialize sync:', error)
        setIsLoading(false)
      }
    }
    
    initializeData()
    
    // Subscribe to real-time updates
    const unsubscribe = RealTimeSync.subscribe((updatedData) => {
      setSalesReps(updatedData.salesReps)
      setRecentSales(updatedData.sales)
    })
    
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    
    return () => {
      clearInterval(timer)
      unsubscribe()
      RealTimeSync.cleanup()
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
      await RealTimeSync.addSale(saleData)
      console.log('Sale recorded and synced across all devices')
    } catch (error) {
      console.error('Error recording sale:', error)
    }
  }

  const handleDeleteSale = async (saleId: string) => {
    try {
      EmergencySync.deleteSale(saleId)
      console.log('Sale deleted and synced across all devices')
    } catch (error) {
      console.error('Error deleting sale:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading tournament...</div>
      </div>
    )
  }

  const totalSales = salesReps.reduce((sum, rep) => sum + rep.totalSales, 0)
  const totalPremium = salesReps.reduce((sum, rep) => sum + rep.totalPremium, 0)
  const allSalesReps = salesReps
    .sort((a, b) => b.totalSales - a.totalSales || b.totalPremium - a.totalPremium)

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-black to-red-950">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800" />
        <div className="relative z-10 px-4 py-6">
          <motion.div 
            className="flex justify-between items-center text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <h1 className="text-3xl md:text-6xl font-black tracking-tight">
                🏆 MARCH MADNESS
              </h1>
              <p className="text-lg md:text-2xl opacity-90 font-bold">
                ALL IN AGENCIES • SALES TOURNAMENT • MARCH 7-14
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-75">LIVE</div>
              <div className="text-xl font-bold">
                {isClient && currentTime ? currentTime.toLocaleTimeString() : '--:--'}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Action Buttons */}
        <div className="flex gap-4 justify-center mb-8">
          <motion.button
            onClick={() => setShowLoginModal(true)}
            className="bg-gradient-to-r from-red-500 to-red-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:from-red-600 hover:to-red-800 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            AGENT LOGIN
          </motion.button>
          <motion.a
            href="/tv"
            className="bg-gradient-to-r from-gray-700 to-gray-900 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:from-gray-600 hover:to-gray-800 transition-all inline-flex items-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            TV DISPLAY
          </motion.a>
        </div>

        {/* Stats Banner */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <motion.div 
            className="bg-gradient-to-r from-red-500 to-red-700 text-white rounded-xl p-4 text-center shadow-xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-3xl font-black">{salesReps.length}</div>
            <div className="text-sm font-bold opacity-90">COMPETITORS</div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-xl p-4 text-center shadow-xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-3xl font-black">{totalSales}</div>
            <div className="text-sm font-bold opacity-90">TOTAL SALES</div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-xl p-4 text-center shadow-xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-2xl font-black">${totalPremium.toLocaleString()}</div>
            <div className="text-sm font-bold opacity-90">TOTAL PREMIUM</div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-r from-black to-gray-800 text-white rounded-xl p-4 text-center shadow-xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-lg font-black">7D 11H</div>
            <div className="text-sm font-bold opacity-90">REMAINING</div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tournament Rules */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                📋 TOURNAMENT RULES
              </h2>
              <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                SHOW
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-yellow-400 font-bold">⚡ Quick Summary</div>
              <p className="text-gray-300 text-sm">
                Head-to-head matchups • Highest submitted premium wins • Must be in Zoom room • Final round based on issued business • Winner gets Cancun trip 🏆
              </p>
            </div>
          </div>

          {/* Tournament Status */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              🎯 TOURNAMENT STATUS
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-400 font-bold">🔴 LIVE</span>
              </div>
              <div className="text-gray-300">
                <div className="font-bold text-green-400">WEEK 1 PLAY-IN ROUND</div>
                <div className="text-sm">17 Active Matchups</div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
              👑
            </div>
            TOP PERFORMERS
          </h2>
          
          <div className="space-y-4">
            {allSalesReps.slice(0, 10).map((rep, index) => (
              <motion.div
                key={rep.id}
                className={`flex items-center justify-between p-4 rounded-xl border ${
                  index === 0 
                    ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30' 
                    : index === 1
                    ? 'bg-gradient-to-r from-gray-500/20 to-gray-600/20 border-gray-500/30'
                    : index === 2
                    ? 'bg-gradient-to-r from-orange-600/20 to-red-600/20 border-orange-500/30'
                    : 'bg-gray-800/50 border-gray-700'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold ${
                    index === 0 ? 'bg-yellow-500 text-white' :
                    index === 1 ? 'bg-gray-500 text-white' :
                    index === 2 ? 'bg-orange-600 text-white' :
                    'bg-gray-700 text-gray-300'
                  }`}>
                    #{index + 1}
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white">{rep.name}</div>
                    <div className="text-gray-400">{rep.team}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{rep.totalSales}</div>
                  <div className="text-lg text-green-400">${rep.totalPremium.toLocaleString()}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Show All Button */}
          {allSalesReps.length > 10 && (
            <div className="mt-6 text-center">
              <button className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-xl font-bold hover:from-gray-500 hover:to-gray-600 transition-all">
                View All {allSalesReps.length} Competitors →
              </button>
            </div>
          )}
        </div>

        {/* Recent Sales */}
        {recentSalesList.length > 0 && (
          <div className="mt-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4">🔥 RECENT SALES</h2>
            <div className="space-y-3">
              {recentSalesList.slice(0, 5).map((sale, index) => (
                <div key={sale.id} className="flex justify-between items-center p-3 bg-gray-700/50 rounded-xl">
                  <div>
                    <div className="font-bold text-white">{sale.repName}</div>
                    <div className="text-gray-400 text-sm">{sale.clientName} • {sale.policyType}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-400">${sale.premium.toLocaleString()}</div>
                    <div className="text-gray-400 text-sm">{sale.timestamp.toLocaleTimeString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


      </div>

      {/* Modals */}
      {showLoginModal && (
        <LoginModal
          salesReps={salesReps}
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
        />
      )}

      {loggedInAgent && (
        <AgentDashboard
          agent={loggedInAgent}
          allAgents={salesReps}
          onRecordSale={handleRecordSale}
          onDeleteSale={handleDeleteSale}
          onLogout={handleLogout}
          recentSales={recentSalesList.filter(sale => 
            sale.repName.toLowerCase().includes(loggedInAgent.name.toLowerCase()) ||
            loggedInAgent.name.toLowerCase().includes(sale.repName.toLowerCase())
          )}
        />
      )}
    </div>
  )
}