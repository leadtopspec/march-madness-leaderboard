'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function BracketView() {
  const [currentRound, setCurrentRound] = useState<{name: string, description: string, matchups: any[]}>({
    name: "Round 2", 
    description: "WEEK 2 ROUND 2",
    matchups: []
  })

  useEffect(() => {
    // Determine current tournament round based on date
    const updateCurrentRound = () => {
      const now = new Date()
      const playInStart = new Date('2026-03-07T06:00:00.000Z') // March 7, 12:00 AM CST
      const round2Start = new Date('2026-03-15T06:00:00.000Z')  // March 15, 12:00 AM CST
      const round3Start = new Date('2026-03-23T05:59:00.000Z')  // March 22, 11:59 PM CST
      
      if (now < playInStart) {
        setCurrentRound({
          name: "Pre-Tournament", 
          description: "TOURNAMENT STARTS SOON",
          matchups: playInRoundMatchups
        })
      } else if (now < round2Start) {
        setCurrentRound({
          name: "Play-In", 
          description: "WEEK 1 PLAY-IN ROUND",
          matchups: playInRoundMatchups
        })
      } else if (now < round3Start) {
        setCurrentRound({
          name: "Round 2", 
          description: "WEEK 2 ROUND 2",
          matchups: round2Matchups
        })
      } else {
        setCurrentRound({
          name: "Round 3", 
          description: "WEEK 3 ELITE 8",
          matchups: []
        })
      }
    }
    
    updateCurrentRound()
    const timer = setInterval(updateCurrentRound, 60000) // Check every minute
    
    return () => clearInterval(timer)
  }, [])

  // Week 1 - Play-In Round Matchups (18 games total)
  const playInRoundMatchups = [
    { game: 1, team1: "MAX KONOPKA", team2: "ROBERT BRADY", winner: "MAX KONOPKA" },
    { game: 2, team1: "ZION RUSSELL", team2: "BYRON ACHA", winner: "BYRON ACHA" },
    { game: 3, team1: "JOSE VALDEZ", team2: "JADEN POPE", winner: "JOSE VALDEZ" },
    { game: 4, team1: "WESTON CHRISTOPHER", team2: "NOLAN SCHOENBACHLER", winner: "NOLAN SCHOENBACHLER" },
    { game: 5, team1: "THOMAS FOX", team2: "JEREMI KISINSKI", winner: "THOMAS FOX" },
    { game: 6, team1: "JAKE DOLL", team2: "DANIEL SUAREZ", winner: "DNQ" },
    { game: 7, team1: "RYAN BOVE", team2: "RYAN COOPER", winner: "RYAN COOPER" },
    { game: 8, team1: "LUCAS KONSTATOS", team2: "ANTHONY MAYROSE", winner: "LUCAS KONSTATOS" },
    { game: 9, team1: "ANDREW FLASKAMP", team2: "FABIAN ESCATEL", winner: "FABIAN ESCATEL" },
    { game: 10, team1: "KAMREN HERALD", team2: "TIVON BURNS", winner: "KAMREN HERALD" },
    { game: 11, team1: "BRENNAN SKODA", team2: "AALYIAH WASHBURN", winner: "AALYIAH WASHBURN" },
    { game: 12, team1: "KADEN CAMENZIND", team2: "HANNAH FRENCH", winner: "HANNAH FRENCH" },
    { game: 13, team1: "MICHAEL CARNEY", team2: "TAJ DHILLON", winner: "TAJ DHILLON" },
    { game: 14, team1: "JACOB LEE", team2: "ADRIEN RAMÍREZ-RAYO", winner: "JACOB LEE" },
    { game: 15, team1: "DENNIS CHORNIY", team2: "CHARLIE SIMMS", winner: "DENNIS CHORNIY" },
    { game: 16, team1: "BRENON REED", team2: "KIRILL PAVLYCHEV", winner: "KIRILL PAVLYCHEV" },
    { game: 17, team1: "LAINEY DROWN", team2: "VALERIA ALVAL", winner: "VALERIA ALVAL" },
    { game: 18, team1: "KADEN BAKER", team2: "LINDSEY NOONAN", winner: null },
  ]

  // Week 2 - Round 2 Matchups (8 games total)
  const round2Matchups = [
    { game: 1, team1: "MAX KONOPKA", team2: "BYRON ACHA", winner: null },
    { game: 2, team1: "JOSE VALDEZ", team2: "NOLAN SCHOENBACHLER", winner: null },
    { game: 3, team1: "THOMAS FOX", team2: "VALERIA ALVAL", winner: null },
    { game: 4, team1: "RYAN COOPER", team2: "LUCAS KONSTATOS", winner: null },
    { game: 5, team1: "FABIAN ESCATEL", team2: "KAMREN HERALD", winner: null },
    { game: 6, team1: "AALYIAH WASHBURN", team2: "HANNAH FRENCH", winner: null },
    { game: 7, team1: "TAJ DHILLON", team2: "DENNIS CHORNIY", winner: null },
    { game: 8, team1: "JACOB LEE", team2: "KIRILL PAVLYCHEV", winner: null },
  ]

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
          <div className="text-sm lg:text-lg opacity-90 space-y-1">
            <p>16 COMPETITORS REMAINING • $XXXXX SALES PREMIUM • $XXXXX TOP PERFORMER</p>
            <p className="text-red-300 text-xs lg:text-sm">⏰ ROUND 2 ENDS: MARCH 22ND AT 11:59 PM ⏰</p>
          </div>
        </motion.div>
      </div>

      {/* Current Round Matchups */}
      <div className="mb-8">
        <h3 className="text-center text-red-300 font-bold text-lg mb-6">🥊 {currentRound.description} MATCHUPS 🥊</h3>
        <div className={`grid gap-4 max-w-7xl mx-auto ${
          currentRound.matchups.length <= 8 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {currentRound.matchups.map((matchup, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl border-2 border-red-500 p-4 shadow-xl"
            >
              <div className="text-center text-red-300 font-bold text-sm mb-3">
                GAME #{matchup.game}
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
                <div className={`bg-black/50 rounded px-3 py-1 text-xs font-bold ${matchup.winner === 'DNQ' ? 'text-red-400' : 'text-red-300'}`}>
                  {matchup.winner === 'DNQ' ? "STATUS: DNQ" : (matchup.winner ? `WINNER: ${matchup.winner}` : "WINNER: TBD")}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Full Tournament Bracket */}
      <div className="w-full mx-auto overflow-x-auto pb-4">
        <div className="flex items-start justify-center min-w-[1000px] gap-3 px-2">
          
          {/* Round 1 (Play-In) - Left Side */}
          <div className="flex flex-col min-w-[140px]">
            <div className="text-center text-white font-bold text-xs mb-3 bg-red-600/80 rounded-lg py-2 border border-red-400">
              ROUND 1 - COMPLETED
            </div>
            <div className="space-y-1">
              {playInRoundMatchups.slice(0, 9).map((matchup, index) => (
                <motion.div
                  key={`r1-left-${index}`}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="bg-gray-700/50 rounded border border-gray-500 p-1.5 text-[8px] font-bold shadow-sm"
                >
                  <div className="text-white truncate">G{matchup.game}: {matchup.team1}</div>
                  <div className="text-gray-300 text-[7px] text-center">vs</div>
                  <div className="text-white truncate">{matchup.team2}</div>
                  <div className={`text-[7px] text-center mt-0.5 ${matchup.winner && matchup.winner !== 'DNQ' ? 'text-green-400' : ((matchup.game === 18 || matchup.game === 6) ? 'text-red-400' : 'text-gray-400')}`}>
                    {matchup.winner && matchup.winner !== 'DNQ' ? `✓ ${matchup.winner.split(' ')[0]}` : ((matchup.game === 18 || matchup.game === 6) ? "DNQ" : "TBD")}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Round 2 - Left Side (Games 1-4) */}
          <div className="flex flex-col min-w-[120px]">
            <div className="text-center text-white font-bold text-xs mb-3 bg-green-600/80 rounded-lg py-2 border border-green-400">
              🔴 ROUND 2 - LIVE
            </div>
            <div className="space-y-2">
              {round2Matchups.slice(0, 4).map((matchup, index) => (
                <motion.div
                  key={`r2-left-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className="bg-green-600/20 rounded border-2 border-green-500 p-1.5 text-[8px] font-bold shadow-md"
                >
                  <div className="text-white truncate">G{matchup.game}: {matchup.team1.split(' ')[0]}</div>
                  <div className="text-green-300 text-[7px] text-center font-bold">VS</div>
                  <div className="text-white truncate">{matchup.team2.split(' ')[0]}</div>
                  <div className="text-yellow-400 text-[7px] text-center mt-0.5">ACTIVE</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Round 3 (Elite 8) */}
          <div className="flex flex-col min-w-[100px]">
            <div className="text-center text-white font-bold text-xs mb-3 bg-red-800/80 rounded-lg py-2 border border-red-600">
              ROUND 3 - ELITE 8
            </div>
            <div className="flex flex-col justify-center space-y-4">
              {[...Array(4)].map((_, index) => (
                <motion.div
                  key={`r3-${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="bg-gray-800/80 rounded border border-red-400 p-2 text-[8px] font-bold text-center shadow-sm"
                >
                  <div className="text-red-300">Game {index + 1}</div>
                  <div className="text-gray-400 text-[7px] mt-0.5">TBD vs TBD</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Final Four & Championship */}
          <div className="flex flex-col items-center justify-center min-w-[140px] space-y-4">
            {/* Semi 1 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5 }}
              className="bg-gradient-to-r from-red-600 to-red-800 rounded-lg border-2 border-red-400 p-2 text-center shadow-lg w-full"
            >
              <div className="text-white font-black text-[8px]">SEMIFINAL 1</div>
              <div className="text-red-200 text-[7px] mt-0.5">TBD vs TBD</div>
            </motion.div>

            {/* Championship */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2 }}
              className="bg-gradient-to-r from-red-700 to-black rounded-xl border-4 border-red-500 p-3 text-center shadow-2xl w-full"
            >
              <div className="text-xl mb-1">🏆</div>
              <div className="text-white font-black text-[10px]">CHAMPION</div>
              <div className="text-red-200 text-[7px] mt-0.5">MARCH MADNESS</div>
              <div className="text-red-200 text-[7px]">2026</div>
            </motion.div>

            {/* Semi 2 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5 }}
              className="bg-gradient-to-r from-red-600 to-red-800 rounded-lg border-2 border-red-400 p-2 text-center shadow-lg w-full"
            >
              <div className="text-white font-black text-[8px]">SEMIFINAL 2</div>
              <div className="text-red-200 text-[7px] mt-0.5">TBD vs TBD</div>
            </motion.div>
          </div>

          {/* Round 3 (Elite 8) - Right Side */}
          <div className="flex flex-col min-w-[100px]">
            <div className="text-center text-white font-bold text-xs mb-3 bg-red-800/80 rounded-lg py-2 border border-red-600">
              ROUND 3 - ELITE 8
            </div>
            <div className="flex flex-col justify-center space-y-4">
              {[...Array(4)].map((_, index) => (
                <motion.div
                  key={`r3-right-${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="bg-gray-800/80 rounded border border-red-400 p-2 text-[8px] font-bold text-center shadow-sm"
                >
                  <div className="text-red-300">Game {index + 5}</div>
                  <div className="text-gray-400 text-[7px] mt-0.5">TBD vs TBD</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Round 2 - Right Side (Games 5-8) */}
          <div className="flex flex-col min-w-[120px]">
            <div className="text-center text-white font-bold text-xs mb-3 bg-green-600/80 rounded-lg py-2 border border-green-400">
              🔴 ROUND 2 - LIVE
            </div>
            <div className="space-y-2">
              {round2Matchups.slice(4, 8).map((matchup, index) => (
                <motion.div
                  key={`r2-right-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  className="bg-green-600/20 rounded border-2 border-green-500 p-1.5 text-[8px] font-bold shadow-md"
                >
                  <div className="text-white truncate text-right">G{matchup.game}: {matchup.team1.split(' ')[0]}</div>
                  <div className="text-green-300 text-[7px] text-center font-bold">VS</div>
                  <div className="text-white truncate text-right">{matchup.team2.split(' ')[0]}</div>
                  <div className="text-yellow-400 text-[7px] text-center mt-0.5">ACTIVE</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Round 1 (Play-In) - Right Side */}
          <div className="flex flex-col min-w-[140px]">
            <div className="text-center text-white font-bold text-xs mb-3 bg-red-600/80 rounded-lg py-2 border border-red-400">
              ROUND 1 - COMPLETED
            </div>
            <div className="space-y-1">
              {playInRoundMatchups.slice(9, 18).map((matchup, index) => (
                <motion.div
                  key={`r1-right-${index}`}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="bg-gray-700/50 rounded border border-gray-500 p-1.5 text-[8px] font-bold shadow-sm"
                >
                  <div className="text-white text-right truncate">G{matchup.game}: {matchup.team1}</div>
                  <div className="text-gray-300 text-[7px] text-center">vs</div>
                  <div className="text-white text-right truncate">{matchup.team2}</div>
                  <div className={`text-[7px] text-center mt-0.5 ${matchup.winner && matchup.winner !== 'DNQ' ? 'text-green-400' : ((matchup.game === 18 || matchup.game === 6) ? 'text-red-400' : 'text-gray-400')}`}>
                    {matchup.winner && matchup.winner !== 'DNQ' ? `✓ ${matchup.winner.split(' ')[0]}` : ((matchup.game === 18 || matchup.game === 6) ? "DNQ" : "TBD")}
                  </div>
                </motion.div>
              ))}
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
          <span className="font-bold text-sm lg:text-base">🔴 LIVE • {currentRound.description} • {currentRound.matchups.length} GAMES • COMPETE NOW!</span>
          <div className="w-2 h-2 lg:w-3 lg:h-3 bg-green-300 rounded-full animate-pulse"></div>
        </motion.div>
        <p className="text-red-300 text-sm mt-2">
          Record sales to advance in your matchup • Winners determined by performance
        </p>
      </div>
    </div>
  )
}