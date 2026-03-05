'use client'

import { motion } from 'framer-motion'

export default function TVBracketView() {
  // 34-team bracket structure with actual competitor names
  const leftTeams = [
    "MAX KONOPKA", "ROBERT BRADY", "ZION RUSSELL", "BYRON ACHA",
    "JOSE VALDEZ", "JADEN POPE", "WESTON CHRISTOPHER", "NOLAN SCHOENBACHLER",
    "THOMAS FOX", "JEREMI KISINSKI", "JAKE DOLL", "DANIEL SUAREZ",
    "RYAN BOVE", "RYAN COOPER", "LUCAS KONSTATOS", "ANTHONY MAYROSE",
    "ANDREW FLASKAMP"
  ]

  const rightTeams = [
    "FABIAN ESCATEL", "KAMREN HERALD", "JAYLEN BISCHOFF", "BRENNAN SKODA",
    "AALYIAH WASHBURN", "KADEN CAMENZIND", "HANNAH FRENCH", "MICHAEL CARNEY",
    "TAJ DHILLON", "JACOB LEE", "ADRIEN RAMÍREZ-RAYO", "DENNIS CHORNIY",
    "CHARLIE SIMMS", "BRENON REED", "KIRILL PAVLYCHEV", "LAINEY DROWN",
    "VALERIA ALVAL"
  ]

  return (
    <div className="w-full h-full bg-transparent">
      {/* TV-Optimized Bracket Layout */}
      <div className="flex items-center justify-between h-full gap-4">
        
        {/* Left Side - Round 1 */}
        <div className="flex flex-col min-w-[200px] h-full">
          <div className="text-center text-white font-bold text-lg mb-4 bg-blue-600/80 rounded-lg py-2">
            ROUND 1
          </div>
          <div className="flex-1 flex flex-col justify-center space-y-2">
            {leftTeams.map((team, index) => (
              <motion.div
                key={`left-${index}`}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                className="bg-white/95 rounded-lg border-2 border-gray-300 p-3 shadow-lg"
              >
                <div className="text-gray-800 font-bold text-sm truncate">{team}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Left Side - Round 2 */}
        <div className="flex flex-col min-w-[180px] h-full">
          <div className="text-center text-white font-bold text-lg mb-4 bg-blue-600/80 rounded-lg py-2">
            ROUND 2
          </div>
          <div className="flex-1 flex flex-col justify-center space-y-6">
            {[...Array(9)].map((_, index) => (
              <motion.div
                key={`left-r2-${index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 + index * 0.05 }}
                className="bg-white/90 rounded-lg border-2 border-blue-300 p-3 text-center shadow-lg"
              >
                <div className="text-gray-600 font-bold text-sm">TBD</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Left Side - Round 3 */}
        <div className="flex flex-col min-w-[180px] h-full">
          <div className="text-center text-white font-bold text-lg mb-4 bg-purple-600/80 rounded-lg py-2">
            ROUND 3
          </div>
          <div className="flex-1 flex flex-col justify-center space-y-12">
            {[...Array(5)].map((_, index) => (
              <motion.div
                key={`left-r3-${index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 + index * 0.05 }}
                className="bg-white/90 rounded-lg border-2 border-purple-300 p-3 text-center shadow-lg"
              >
                <div className="text-gray-600 font-bold text-sm">TBD</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Championship Center Column */}
        <div className="flex flex-col items-center justify-center min-w-[220px] space-y-6">
          {/* Final Four - Left */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2 }}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl border-2 border-yellow-600 p-4 text-center shadow-2xl w-full"
          >
            <div className="text-white font-black text-lg">FINAL FOUR</div>
            <div className="text-yellow-100 text-sm mt-1">LEFT REGION</div>
          </motion.div>

          {/* Championship */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.5 }}
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl border-4 border-yellow-700 p-6 text-center shadow-2xl w-full"
            style={{ background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' }}
          >
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-white font-black text-xl">CHAMPION</div>
            <div className="text-yellow-100 text-sm mt-1">MARCH MADNESS 2025</div>
          </motion.div>

          {/* Final Four - Right */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2 }}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl border-2 border-yellow-600 p-4 text-center shadow-2xl w-full"
          >
            <div className="text-white font-black text-lg">FINAL FOUR</div>
            <div className="text-yellow-100 text-sm mt-1">RIGHT REGION</div>
          </motion.div>
        </div>

        {/* Right Side - Round 3 */}
        <div className="flex flex-col min-w-[180px] h-full">
          <div className="text-center text-white font-bold text-lg mb-4 bg-purple-600/80 rounded-lg py-2">
            ROUND 3
          </div>
          <div className="flex-1 flex flex-col justify-center space-y-12">
            {[...Array(5)].map((_, index) => (
              <motion.div
                key={`right-r3-${index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 + index * 0.05 }}
                className="bg-white/90 rounded-lg border-2 border-purple-300 p-3 text-center shadow-lg"
              >
                <div className="text-gray-600 font-bold text-sm">TBD</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Side - Round 2 */}
        <div className="flex flex-col min-w-[180px] h-full">
          <div className="text-center text-white font-bold text-lg mb-4 bg-blue-600/80 rounded-lg py-2">
            ROUND 2
          </div>
          <div className="flex-1 flex flex-col justify-center space-y-6">
            {[...Array(9)].map((_, index) => (
              <motion.div
                key={`right-r2-${index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 + index * 0.05 }}
                className="bg-white/90 rounded-lg border-2 border-blue-300 p-3 text-center shadow-lg"
              >
                <div className="text-gray-600 font-bold text-sm">TBD</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Side - Round 1 */}
        <div className="flex flex-col min-w-[200px] h-full">
          <div className="text-center text-white font-bold text-lg mb-4 bg-blue-600/80 rounded-lg py-2">
            ROUND 1
          </div>
          <div className="flex-1 flex flex-col justify-center space-y-2">
            {rightTeams.map((team, index) => (
              <motion.div
                key={`right-${index}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                className="bg-white/95 rounded-lg border-2 border-gray-300 p-3 shadow-lg"
              >
                <div className="text-gray-800 text-right font-bold text-sm truncate">{team}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Tournament Status */}
      <div className="text-center mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3 }}
          className="bg-green-600 text-white px-6 py-2 rounded-xl shadow-lg inline-flex items-center gap-2"
        >
          <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
          <span className="font-bold text-lg">LIVE • ROUND 1 IN PROGRESS</span>
          <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
        </motion.div>
      </div>
    </div>
  )
}