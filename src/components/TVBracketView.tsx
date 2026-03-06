'use client'

import { motion } from 'framer-motion'

export default function TVBracketView() {
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

  return (
    <div className="w-full h-full bg-transparent overflow-hidden">
      {/* TV-Optimized Traditional Bracket Layout */}
      <div className="flex items-start justify-between h-full gap-1 text-xs">
        
        {/* Left Side - Round 1 */}
        <div className="flex flex-col min-w-[120px] h-full">
          <div className="text-center text-white font-bold text-sm mb-1 bg-red-600/80 rounded py-1 border border-red-400">
            PLAY-IN LEFT
          </div>
          <div className="flex-1 flex flex-col justify-start space-y-1 overflow-y-auto max-h-[580px]">
            {playInRoundMatchups.slice(0, 9).map((matchup, index) => (
              <motion.div
                key={`left-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                className="bg-gray-900/95 rounded border-2 border-red-600 p-1.5 shadow-sm"
              >
                <div className="text-white font-semibold text-[10px] truncate">G{matchup.game}: {matchup.team1}</div>
                <div className="text-red-300 text-[8px] text-center font-bold">VS</div>
                <div className="text-white font-semibold text-[10px] truncate">{matchup.team2}</div>
              </motion.div>
            ))}
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
            PLAY-IN RIGHT
          </div>
          <div className="flex-1 flex flex-col justify-start space-y-1 overflow-y-auto max-h-[580px]">
            {playInRoundMatchups.slice(9, 17).map((matchup, index) => (
              <motion.div
                key={`right-${index}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                className="bg-gray-900/95 rounded border-2 border-red-600 p-1.5 shadow-sm"
              >
                <div className="text-white text-right font-semibold text-[10px] truncate">G{matchup.game}: {matchup.team1}</div>
                <div className="text-red-300 text-[8px] text-center font-bold">VS</div>
                <div className="text-white text-right font-semibold text-[10px] truncate">{matchup.team2}</div>
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
          className="bg-green-600 text-white px-4 py-1.5 rounded-lg shadow-md inline-flex items-center gap-2 border border-green-400"
        >
          <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
          <span className="font-bold text-sm">🔴 LIVE • PLAY-IN ROUND • 17 GAMES • COMPETE NOW!</span>
          <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
        </motion.div>
      </div>


    </div>
  )
}