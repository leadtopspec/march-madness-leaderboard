'use client'

import { motion } from 'framer-motion'

export default function BracketView() {
  // First Round Matchups - 34 competitors with 1 bye
  const firstRoundMatchups = [
    // Left Bracket - 16 competitors (8 matchups + 1 bye)
    { team1: "MAX KONOPKA", team2: "ANDREW FLASKAMP", winner: null },
    { team1: "ROBERT BRADY", team2: "ANTHONY MAYROSE", winner: null },
    { team1: "ZION RUSSELL", team2: "LUCAS KONSTATOS", winner: null },
    { team1: "BYRON ACHA", team2: "RYAN COOPER", winner: null },
    { team1: "JOSE VALDEZ", team2: "RYAN BOVE", winner: null },
    { team1: "JADEN POPE", team2: "DANIEL SUAREZ", winner: null },
    { team1: "WESTON CHRISTOPHER", team2: "JAKE DOLL", winner: null },
    { team1: "NOLAN SCHOENBACHLER", team2: "JEREMI KISINSKI", winner: null },
    // Thomas Fox gets a bye to Round 2
    
    // Right Bracket - 17 competitors (8 matchups + 1 advance)
    { team1: "FABIAN ESCATEL", team2: "VALERIA ALVAL", winner: null },
    { team1: "KAMREN HERALD", team2: "LAINEY DROWN", winner: null },
    { team1: "JAYLEN BISCHOFF", team2: "KIRILL PAVLYCHEV", winner: null },
    { team1: "BRENNAN SKODA", team2: "BRENON REED", winner: null },
    { team1: "AALYIAH WASHBURN", team2: "CHARLIE SIMMS", winner: null },
    { team1: "KADEN CAMENZIND", team2: "DENNIS CHORNIY", winner: null },
    { team1: "HANNAH FRENCH", team2: "ADRIEN RAMÍREZ-RAYO", winner: null },
    { team1: "MICHAEL CARNEY", team2: "JACOB LEE", winner: null },
    // Taj Dhillon advances automatically
  ]

  const byes = ["THOMAS FOX", "TAJ DHILLON"]

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900 p-4 lg:p-8">
      {/* Tournament Header */}
      <div className="text-center mb-6 lg:mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-red-600 to-red-800 text-white px-4 lg:px-8 py-3 lg:py-4 rounded-2xl shadow-xl inline-block border-2 border-red-400"
        >
          <h2 className="text-xl lg:text-3xl font-black">🏀 MARCH MADNESS BRACKET 🏀</h2>
          <p className="text-sm lg:text-lg opacity-90">34 COMPETITORS • ROUND 1 MATCHUPS</p>
        </motion.div>
      </div>

      {/* First Round Matchups */}
      <div className="mb-8">
        <h3 className="text-center text-red-300 font-bold text-lg mb-6">🥊 FIRST ROUND MATCHUPS 🥊</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
          {firstRoundMatchups.map((matchup, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl border-2 border-red-500 p-4 shadow-xl"
            >
              <div className="text-center text-red-300 font-bold text-sm mb-3">
                MATCHUP #{index + 1}
              </div>
              <div className="space-y-3">
                <div className="bg-red-600/20 rounded-lg border border-red-400 p-3">
                  <div className="text-white font-bold text-sm truncate text-center">
                    {matchup.team1}
                  </div>
                </div>
                <div className="text-center text-red-400 font-black text-lg">VS</div>
                <div className="bg-red-600/20 rounded-lg border border-red-400 p-3">
                  <div className="text-white font-bold text-sm truncate text-center">
                    {matchup.team2}
                  </div>
                </div>
              </div>
              <div className="text-center mt-3">
                <div className="bg-black/50 rounded px-3 py-1 text-red-300 text-xs font-bold">
                  WINNER: TBD
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Byes */}
        <div className="mt-6 text-center">
          <h4 className="text-red-300 font-bold mb-3">🎯 AUTOMATIC ADVANCE TO ROUND 2</h4>
          <div className="flex justify-center gap-4">
            {byes.map((player, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 + index * 0.1 }}
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl border-2 border-green-400 shadow-lg"
              >
                <div className="font-bold text-sm">{player}</div>
                <div className="text-xs text-green-200">BYE</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Traditional Bracket View */}
      <div className="w-full mx-auto overflow-x-auto">
        <div className="flex items-center justify-between min-w-[800px] gap-2 lg:gap-4 px-2">
          
          {/* Left Side - Round 1 */}
          <div className="flex flex-col min-w-[110px] lg:min-w-[140px]">
            <div className="text-center text-white font-bold text-xs lg:text-sm mb-3 bg-red-600/80 rounded-lg py-2 border border-red-400">
              ROUND 1 LEFT
            </div>
            <div className="space-y-2">
              {firstRoundMatchups.slice(0, 8).map((matchup, index) => (
                <motion.div
                  key={`left-${index}`}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="bg-gray-900/95 rounded-lg border-2 border-red-600 p-2 lg:p-3 text-[9px] lg:text-[10px] font-bold shadow-lg hover:shadow-xl transition-shadow backdrop-blur-sm"
                >
                  <div className="text-white truncate">{matchup.team1}</div>
                  <div className="text-red-300 text-[8px] text-center">VS</div>
                  <div className="text-white truncate">{matchup.team2}</div>
                </motion.div>
              ))}
              {/* Thomas Fox Bye */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-green-600/95 rounded-lg border-2 border-green-400 p-2 lg:p-3 text-[9px] lg:text-[10px] font-bold shadow-lg"
              >
                <div className="text-white truncate text-center">THOMAS FOX</div>
                <div className="text-green-200 text-[8px] text-center">BYE</div>
              </motion.div>
            </div>
          </div>

          {/* Left Side - Round 2 */}
          <div className="flex flex-col min-w-[90px] lg:min-w-[120px]">
            <div className="text-center text-white font-bold text-xs lg:text-sm mb-3 bg-red-700/80 rounded-lg py-2 border border-red-500">
              ROUND 2
            </div>
            <div className="flex flex-col justify-center h-full space-y-3 lg:space-y-4">
              {[...Array(9)].map((_, index) => (
                <motion.div
                  key={`left-r2-${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 + index * 0.05 }}
                  className="bg-black/80 rounded-lg border-2 border-red-500 p-2 lg:p-3 text-[10px] lg:text-xs font-bold text-center shadow-lg backdrop-blur-sm"
                >
                  <div className="text-red-300">TBD</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Left Side - Round 3 */}
          <div className="flex flex-col min-w-[90px] lg:min-w-[120px]">
            <div className="text-center text-white font-bold text-xs lg:text-sm mb-3 bg-red-800/80 rounded-lg py-2 border border-red-600">
              ROUND 3
            </div>
            <div className="flex flex-col justify-center h-full space-y-8 lg:space-y-12">
              {[...Array(5)].map((_, index) => (
                <motion.div
                  key={`left-r3-${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 + index * 0.05 }}
                  className="bg-gray-800/80 rounded-lg border-2 border-red-400 p-2 lg:p-3 text-[10px] lg:text-xs font-bold text-center shadow-lg backdrop-blur-sm"
                >
                  <div className="text-red-300">TBD</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Championship Center Column */}
          <div className="flex flex-col items-center justify-center min-w-[120px] lg:min-w-[160px] space-y-4 lg:space-y-8">
            {/* Final Four - Left */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2 }}
              className="bg-gradient-to-r from-red-600 to-red-800 rounded-xl border-2 border-red-400 p-3 lg:p-4 text-xs lg:text-sm font-black text-center shadow-2xl w-full"
            >
              <div className="text-white">FINAL FOUR</div>
              <div className="text-[10px] lg:text-xs text-red-200 mt-1">LEFT REGION</div>
            </motion.div>

            {/* Championship */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.5 }}
              className="bg-gradient-to-r from-red-700 to-black rounded-2xl border-4 border-red-500 p-4 lg:p-6 text-center shadow-2xl w-full"
            >
              <div className="text-xl lg:text-2xl mb-2">🏆</div>
              <div className="text-white font-black text-sm lg:text-lg">CHAMPION</div>
              <div className="text-red-200 text-[10px] lg:text-sm mt-1">MARCH MADNESS 2025</div>
            </motion.div>

            {/* Final Four - Right */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2 }}
              className="bg-gradient-to-r from-red-600 to-red-800 rounded-xl border-2 border-red-400 p-3 lg:p-4 text-xs lg:text-sm font-black text-center shadow-2xl w-full"
            >
              <div className="text-white">FINAL FOUR</div>
              <div className="text-[10px] lg:text-xs text-red-200 mt-1">RIGHT REGION</div>
            </motion.div>
          </div>

          {/* Right Side - Round 3 */}
          <div className="flex flex-col min-w-[90px] lg:min-w-[120px]">
            <div className="text-center text-white font-bold text-xs lg:text-sm mb-3 bg-red-800/80 rounded-lg py-2 border border-red-600">
              ROUND 3
            </div>
            <div className="flex flex-col justify-center h-full space-y-8 lg:space-y-12">
              {[...Array(5)].map((_, index) => (
                <motion.div
                  key={`right-r3-${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 + index * 0.05 }}
                  className="bg-gray-800/80 rounded-lg border-2 border-red-400 p-2 lg:p-3 text-[10px] lg:text-xs font-bold text-center shadow-lg backdrop-blur-sm"
                >
                  <div className="text-red-300">TBD</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Side - Round 2 */}
          <div className="flex flex-col min-w-[90px] lg:min-w-[120px]">
            <div className="text-center text-white font-bold text-xs lg:text-sm mb-3 bg-red-700/80 rounded-lg py-2 border border-red-500">
              ROUND 2
            </div>
            <div className="flex flex-col justify-center h-full space-y-3 lg:space-y-4">
              {[...Array(9)].map((_, index) => (
                <motion.div
                  key={`right-r2-${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 + index * 0.05 }}
                  className="bg-black/80 rounded-lg border-2 border-red-500 p-2 lg:p-3 text-[10px] lg:text-xs font-bold text-center shadow-lg backdrop-blur-sm"
                >
                  <div className="text-red-300">TBD</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Side - Round 1 */}
          <div className="flex flex-col min-w-[110px] lg:min-w-[140px]">
            <div className="text-center text-white font-bold text-xs lg:text-sm mb-3 bg-red-600/80 rounded-lg py-2 border border-red-400">
              ROUND 1 RIGHT
            </div>
            <div className="space-y-2">
              {firstRoundMatchups.slice(8, 16).map((matchup, index) => (
                <motion.div
                  key={`right-${index}`}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="bg-gray-900/95 rounded-lg border-2 border-red-600 p-2 lg:p-3 text-[9px] lg:text-[10px] font-bold shadow-lg hover:shadow-xl transition-shadow backdrop-blur-sm"
                >
                  <div className="text-white text-right truncate">{matchup.team1}</div>
                  <div className="text-red-300 text-[8px] text-center">VS</div>
                  <div className="text-white text-right truncate">{matchup.team2}</div>
                </motion.div>
              ))}
              {/* Taj Dhillon Auto-Advance */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-green-600/95 rounded-lg border-2 border-green-400 p-2 lg:p-3 text-[9px] lg:text-[10px] font-bold shadow-lg"
              >
                <div className="text-white truncate text-center">TAJ DHILLON</div>
                <div className="text-green-200 text-[8px] text-center">AUTO</div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Tournament Status */}
      <div className="text-center mt-6 lg:mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3 }}
          className="bg-green-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-xl shadow-lg inline-flex items-center gap-2 border border-green-400"
        >
          <div className="w-2 h-2 lg:w-3 lg:h-3 bg-green-300 rounded-full animate-pulse"></div>
          <span className="font-bold text-sm lg:text-base">🔴 LIVE • MATCHUPS REVEALED • COMPETE NOW!</span>
          <div className="w-2 h-2 lg:w-3 lg:h-3 bg-green-300 rounded-full animate-pulse"></div>
        </motion.div>
        <p className="text-red-300 text-sm mt-2">
          Record sales to advance in your matchup • Winners determined by performance
        </p>
      </div>
    </div>
  )
}