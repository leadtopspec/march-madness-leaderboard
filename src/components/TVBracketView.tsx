'use client'

import { motion } from 'framer-motion'

export default function TVBracketView() {
  // First Round Matchups - 34 competitors with 2 byes/auto-advances
  const firstRoundMatchups = [
    // Left Bracket - 17 competitors (8 matchups + 1 bye)
    { team1: "MAX KONOPKA", team2: "ANDREW FLASKAMP", winner: null },
    { team1: "ROBERT BRADY", team2: "ANTHONY MAYROSE", winner: null },
    { team1: "ZION RUSSELL", team2: "LUCAS KONSTATOS", winner: null },
    { team1: "BYRON ACHA", team2: "RYAN COOPER", winner: null },
    { team1: "JOSE VALDEZ", team2: "RYAN BOVE", winner: null },
    { team1: "JADEN POPE", team2: "DANIEL SUAREZ", winner: null },
    { team1: "WESTON CHRISTOPHER", team2: "JAKE DOLL", winner: null },
    { team1: "NOLAN SCHOENBACHLER", team2: "JEREMI KISINSKI", winner: null },
    
    // Right Bracket - 17 competitors (8 matchups + 1 advance)
    { team1: "FABIAN ESCATEL", team2: "VALERIA ALVAL", winner: null },
    { team1: "KAMREN HERALD", team2: "LAINEY DROWN", winner: null },
    { team1: "JAYLEN BISCHOFF", team2: "KIRILL PAVLYCHEV", winner: null },
    { team1: "BRENNAN SKODA", team2: "BRENON REED", winner: null },
    { team1: "AALYIAH WASHBURN", team2: "CHARLIE SIMMS", winner: null },
    { team1: "KADEN CAMENZIND", team2: "DENNIS CHORNIY", winner: null },
    { team1: "HANNAH FRENCH", team2: "ADRIEN RAMÍREZ-RAYO", winner: null },
    { team1: "MICHAEL CARNEY", team2: "JACOB LEE", winner: null },
  ]

  const specialAdvances = [
    { name: "THOMAS FOX", status: "BYE" },
    { name: "TAJ DHILLON", status: "AUTO" }
  ]

  return (
    <div className="w-full h-full bg-transparent overflow-hidden">
      {/* TV-Optimized Traditional Bracket Layout */}
      <div className="flex items-start justify-between h-full gap-1 text-xs">
        
        {/* Left Side - Round 1 */}
        <div className="flex flex-col min-w-[120px] h-full">
          <div className="text-center text-white font-bold text-sm mb-1 bg-red-600/80 rounded py-1 border border-red-400">
            ROUND 1 LEFT
          </div>
          <div className="flex-1 flex flex-col justify-start space-y-1 overflow-y-auto max-h-[580px]">
            {firstRoundMatchups.slice(0, 8).map((matchup, index) => (
              <motion.div
                key={`left-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                className="bg-gray-900/95 rounded border-2 border-red-600 p-1.5 shadow-sm"
              >
                <div className="text-white font-semibold text-[10px] truncate">{matchup.team1}</div>
                <div className="text-red-300 text-[8px] text-center font-bold">VS</div>
                <div className="text-white font-semibold text-[10px] truncate">{matchup.team2}</div>
              </motion.div>
            ))}
            {/* Thomas Fox Bye */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-green-600/95 rounded border-2 border-green-400 p-1.5 shadow-sm"
            >
              <div className="text-white font-semibold text-[10px] text-center">{specialAdvances[0].name}</div>
              <div className="text-green-200 text-[8px] text-center">{specialAdvances[0].status}</div>
            </motion.div>
          </div>
        </div>

        {/* Left Side - Round 2 */}
        <div className="flex flex-col min-w-[100px] h-full">
          <div className="text-center text-white font-bold text-sm mb-1 bg-red-700/80 rounded py-1 border border-red-500">
            ROUND 2
          </div>
          <div className="flex-1 flex flex-col justify-center space-y-3">
            {[...Array(9)].map((_, index) => (
              <motion.div
                key={`left-r2-${index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.03 }}
                className="bg-black/80 rounded border-2 border-red-500 p-1.5 text-center shadow-sm"
              >
                <div className="text-red-300 font-semibold text-[10px]">TBD</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Left Side - Round 3 */}
        <div className="flex flex-col min-w-[100px] h-full">
          <div className="text-center text-white font-bold text-sm mb-1 bg-red-800/80 rounded py-1 border border-red-600">
            ROUND 3
          </div>
          <div className="flex-1 flex flex-col justify-center space-y-8">
            {[...Array(5)].map((_, index) => (
              <motion.div
                key={`left-r3-${index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 + index * 0.05 }}
                className="bg-gray-800/80 rounded border-2 border-red-400 p-1.5 text-center shadow-sm"
              >
                <div className="text-red-300 font-semibold text-[10px]">TBD</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Championship Center Column */}
        <div className="flex flex-col items-center justify-center min-w-[140px] space-y-4">
          {/* Final Four - Left */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5 }}
            className="bg-gradient-to-r from-red-600 to-red-800 rounded-lg border border-red-400 p-3 text-center shadow-lg w-full"
          >
            <div className="text-white font-black text-sm">FINAL FOUR</div>
            <div className="text-red-200 text-xs mt-1">LEFT REGION</div>
          </motion.div>

          {/* Championship */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2 }}
            className="bg-gradient-to-r from-red-700 to-black rounded-xl border-2 border-red-500 p-4 text-center shadow-xl w-full"
          >
            <div className="text-2xl mb-1">🏆</div>
            <div className="text-white font-black text-lg">CHAMPION</div>
            <div className="text-red-200 text-xs mt-1">MARCH MADNESS 2025</div>
          </motion.div>

          {/* Final Four - Right */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5 }}
            className="bg-gradient-to-r from-red-600 to-red-800 rounded-lg border border-red-400 p-3 text-center shadow-lg w-full"
          >
            <div className="text-white font-black text-sm">FINAL FOUR</div>
            <div className="text-red-200 text-xs mt-1">RIGHT REGION</div>
          </motion.div>
        </div>

        {/* Right Side - Round 3 */}
        <div className="flex flex-col min-w-[100px] h-full">
          <div className="text-center text-white font-bold text-sm mb-1 bg-red-800/80 rounded py-1 border border-red-600">
            ROUND 3
          </div>
          <div className="flex-1 flex flex-col justify-center space-y-8">
            {[...Array(5)].map((_, index) => (
              <motion.div
                key={`right-r3-${index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 + index * 0.05 }}
                className="bg-gray-800/80 rounded border-2 border-red-400 p-1.5 text-center shadow-sm"
              >
                <div className="text-red-300 font-semibold text-[10px]">TBD</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Side - Round 2 */}
        <div className="flex flex-col min-w-[100px] h-full">
          <div className="text-center text-white font-bold text-sm mb-1 bg-red-700/80 rounded py-1 border border-red-500">
            ROUND 2
          </div>
          <div className="flex-1 flex flex-col justify-center space-y-3">
            {[...Array(9)].map((_, index) => (
              <motion.div
                key={`right-r2-${index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.03 }}
                className="bg-black/80 rounded border-2 border-red-500 p-1.5 text-center shadow-sm"
              >
                <div className="text-red-300 font-semibold text-[10px]">TBD</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Side - Round 1 */}
        <div className="flex flex-col min-w-[120px] h-full">
          <div className="text-center text-white font-bold text-sm mb-1 bg-red-600/80 rounded py-1 border border-red-400">
            ROUND 1 RIGHT
          </div>
          <div className="flex-1 flex flex-col justify-start space-y-1 overflow-y-auto max-h-[580px]">
            {firstRoundMatchups.slice(8, 16).map((matchup, index) => (
              <motion.div
                key={`right-${index}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                className="bg-gray-900/95 rounded border-2 border-red-600 p-1.5 shadow-sm"
              >
                <div className="text-white text-right font-semibold text-[10px] truncate">{matchup.team1}</div>
                <div className="text-red-300 text-[8px] text-center font-bold">VS</div>
                <div className="text-white text-right font-semibold text-[10px] truncate">{matchup.team2}</div>
              </motion.div>
            ))}
            {/* Taj Dhillon Auto-Advance */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-green-600/95 rounded border-2 border-green-400 p-1.5 shadow-sm"
            >
              <div className="text-white font-semibold text-[10px] text-center">{specialAdvances[1].name}</div>
              <div className="text-green-200 text-[8px] text-center">{specialAdvances[1].status}</div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Tournament Status */}
      <div className="text-center mt-2">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5 }}
          className="bg-green-600 text-white px-4 py-1.5 rounded-lg shadow-md inline-flex items-center gap-2 border border-green-400"
        >
          <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
          <span className="font-bold text-sm">🔴 LIVE • ROUND 1 MATCHUPS • COMPETE NOW!</span>
          <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
        </motion.div>
      </div>


    </div>
  )
}