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
    <div className="w-full h-full bg-transparent overflow-hidden">
      {/* TV-Optimized Bracket Layout */}
      <div className="flex items-start justify-between h-full gap-1 text-xs">
        
        {/* Left Side - Round 1 */}
        <div className="flex flex-col min-w-[140px] h-full">
          <div className="text-center text-white font-bold text-sm mb-1 bg-green-500/80 rounded py-1">
            ROUND 1
          </div>
          <div className="flex-1 flex flex-col justify-start space-y-1 overflow-y-auto max-h-[580px]">
            {leftTeams.map((team, index) => (
              <motion.div
                key={`left-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.01 }}
                className="bg-white/95 rounded border border-gray-300 p-1.5 shadow-sm"
              >
                <div className="text-gray-800 font-semibold text-xs truncate">{team}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Left Side - Round 2 */}
        <div className="flex flex-col min-w-[120px] h-full">
          <div className="text-center text-white font-bold text-sm mb-1 bg-blue-500/80 rounded py-1">
            ROUND 2
          </div>
          <div className="flex-1 flex flex-col justify-center space-y-3">
            {[...Array(9)].map((_, index) => (
              <motion.div
                key={`left-r2-${index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.03 }}
                className="bg-white/90 rounded border border-blue-300 p-1.5 text-center shadow-sm"
              >
                <div className="text-gray-600 font-semibold text-xs">TBD</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Left Side - Round 3 */}
        <div className="flex flex-col min-w-[120px] h-full">
          <div className="text-center text-white font-bold text-sm mb-1 bg-purple-500/80 rounded py-1">
            ROUND 3
          </div>
          <div className="flex-1 flex flex-col justify-center space-y-8">
            {[...Array(5)].map((_, index) => (
              <motion.div
                key={`left-r3-${index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 + index * 0.05 }}
                className="bg-white/90 rounded border border-purple-300 p-1.5 text-center shadow-sm"
              >
                <div className="text-gray-600 font-semibold text-xs">TBD</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Championship Center Column */}
        <div className="flex flex-col items-center justify-center min-w-[180px] space-y-4">
          {/* Final Four - Left */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5 }}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg border border-yellow-600 p-3 text-center shadow-lg w-full"
          >
            <div className="text-white font-black text-sm">FINAL FOUR</div>
            <div className="text-yellow-100 text-xs mt-1">LEFT REGION</div>
          </motion.div>

          {/* Championship */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2 }}
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl border-2 border-yellow-700 p-4 text-center shadow-xl w-full"
            style={{ background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' }}
          >
            <div className="text-2xl mb-1">🏆</div>
            <div className="text-white font-black text-lg">CHAMPION</div>
            <div className="text-yellow-100 text-xs mt-1">MARCH MADNESS 2025</div>
          </motion.div>

          {/* Final Four - Right */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5 }}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg border border-yellow-600 p-3 text-center shadow-lg w-full"
          >
            <div className="text-white font-black text-sm">FINAL FOUR</div>
            <div className="text-yellow-100 text-xs mt-1">RIGHT REGION</div>
          </motion.div>
        </div>

        {/* Right Side - Round 3 */}
        <div className="flex flex-col min-w-[120px] h-full">
          <div className="text-center text-white font-bold text-sm mb-1 bg-purple-500/80 rounded py-1">
            ROUND 3
          </div>
          <div className="flex-1 flex flex-col justify-center space-y-8">
            {[...Array(5)].map((_, index) => (
              <motion.div
                key={`right-r3-${index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 + index * 0.05 }}
                className="bg-white/90 rounded border border-purple-300 p-1.5 text-center shadow-sm"
              >
                <div className="text-gray-600 font-semibold text-xs">TBD</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Side - Round 2 */}
        <div className="flex flex-col min-w-[120px] h-full">
          <div className="text-center text-white font-bold text-sm mb-1 bg-blue-500/80 rounded py-1">
            ROUND 2
          </div>
          <div className="flex-1 flex flex-col justify-center space-y-3">
            {[...Array(9)].map((_, index) => (
              <motion.div
                key={`right-r2-${index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.03 }}
                className="bg-white/90 rounded border border-blue-300 p-1.5 text-center shadow-sm"
              >
                <div className="text-gray-600 font-semibold text-xs">TBD</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Side - Round 1 */}
        <div className="flex flex-col min-w-[140px] h-full">
          <div className="text-center text-white font-bold text-sm mb-1 bg-green-500/80 rounded py-1">
            ROUND 1
          </div>
          <div className="flex-1 flex flex-col justify-start space-y-1 overflow-y-auto max-h-[580px]">
            {rightTeams.map((team, index) => (
              <motion.div
                key={`right-${index}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.01 }}
                className="bg-white/95 rounded border border-gray-300 p-1.5 shadow-sm"
              >
                <div className="text-gray-800 text-right font-semibold text-xs truncate">{team}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Tournament Status */}
      <div className="text-center mt-2">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5 }}
          className="bg-green-600 text-white px-4 py-1.5 rounded-lg shadow-md inline-flex items-center gap-2"
        >
          <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
          <span className="font-bold text-sm">LIVE • ROUND 1 IN PROGRESS</span>
          <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
        </motion.div>
      </div>
    </div>
  )
}