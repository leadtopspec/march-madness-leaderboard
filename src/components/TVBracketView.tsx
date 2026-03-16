'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function TVBracketView() {
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
      const round3Start = new Date('2026-03-21T06:00:00.000Z')  // March 21, 12:00 AM CST
      
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
    { game: 1, team1: "MAX KONOPKA", team2: "BYRON ACHA" },
    { game: 2, team1: "JOSE VALDEZ", team2: "NOLAN SCHOENBACHLER" },
    { game: 3, team1: "THOMAS FOX", team2: "VALERIA ALVAL" },
    { game: 4, team1: "RYAN COOPER", team2: "LUCAS KONSTATOS" },
    { game: 5, team1: "FABIAN ESCATEL", team2: "KAMREN HERALD" },
    { game: 6, team1: "AALYIAH WASHBURN", team2: "HANNAH FRENCH" },
    { game: 7, team1: "TAJ DHILLON", team2: "DENNIS CHORNIY" },
    { game: 8, team1: "JACOB LEE", team2: "KIRILL PAVLYCHEV" },
  ]

  return (
    <div className="w-full h-full bg-transparent overflow-auto">
      {/* TV Optimized Bracket Display */}
      <div className="flex items-start justify-center min-w-[900px] max-w-[1200px] gap-2 mx-auto p-2">
        
        {/* Round 1 - Completed */}
        <div className="flex flex-col min-w-[130px]">
          <div className="text-center text-white font-bold text-[10px] mb-2 bg-gray-600/80 rounded py-1 border border-gray-400">
            ROUND 1 - COMPLETE
          </div>
          <div className="space-y-1">
            {playInRoundMatchups.slice(0, 9).map((matchup, index) => (
              <motion.div
                key={`r1-left-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.01 }}
                className="bg-gray-800/60 rounded border border-gray-600 p-1 text-[7px] font-semibold"
              >
                <div className="text-white truncate">{matchup.team1.split(' ')[0]}</div>
                <div className="text-gray-400 text-[6px] text-center">vs</div>
                <div className="text-white truncate">{matchup.team2.split(' ')[0]}</div>
                <div className={`text-[6px] text-center mt-0.5 ${matchup.winner && matchup.winner !== 'DNQ' ? 'text-green-400' : ((matchup.game === 18 || matchup.game === 6) ? 'text-red-400' : 'text-gray-400')}`}>
                  {matchup.winner && matchup.winner !== 'DNQ' ? `✓ ${matchup.winner.split(' ')[0]}` : ((matchup.game === 18 || matchup.game === 6) ? "DNQ" : "TBD")}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Round 2 - Live (Left Side - Games 1-4) */}
        <div className="flex flex-col min-w-[110px]">
          <div className="text-center text-white font-bold text-[10px] mb-2 bg-red-600/80 rounded py-1 border border-red-400">
            🔴 ROUND 2 LIVE
          </div>
          <div className="space-y-1.5">
            {round2Matchups.slice(0, 4).map((matchup, index) => (
              <motion.div
                key={`r2-left-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.03 }}
                className="bg-red-600/30 rounded border-2 border-red-500 p-1 text-[7px] font-bold shadow-md"
              >
                <div className="text-white truncate">G{matchup.game}: {matchup.team1.split(' ')[0]}</div>
                <div className="text-red-300 text-[6px] text-center font-bold">VS</div>
                <div className="text-white truncate">{matchup.team2.split(' ')[0]}</div>
                <div className="text-yellow-400 text-[6px] text-center mt-0.5">LIVE</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Round 3 - Elite 8 */}
        <div className="flex flex-col min-w-[90px]">
          <div className="text-center text-white font-bold text-[10px] mb-2 bg-red-800/80 rounded py-1 border border-red-600">
            ELITE 8
          </div>
          <div className="flex flex-col justify-center space-y-3 mt-4">
            {[...Array(4)].map((_, index) => (
              <motion.div
                key={`r3-${index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.05 }}
                className="bg-gray-800/60 rounded border border-red-400 p-1.5 text-[7px] font-bold text-center"
              >
                <div className="text-red-300">G{index + 1}</div>
                <div className="text-gray-500 text-[6px] mt-0.5">TBD</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Final Four & Championship */}
        <div className="flex flex-col items-center justify-center min-w-[120px] space-y-3">
          {/* Semi 1 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 }}
            className="bg-gradient-to-r from-red-600 to-red-700 rounded border-2 border-red-400 p-2 text-center w-full"
          >
            <div className="text-white font-black text-[8px]">SEMI 1</div>
            <div className="text-red-200 text-[6px] mt-0.5">TBD vs TBD</div>
          </motion.div>

          {/* Championship */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5 }}
            className="bg-gradient-to-r from-red-700 to-black rounded-xl border-4 border-red-500 p-3 text-center shadow-xl w-full"
          >
            <div className="text-lg mb-1">🏆</div>
            <div className="text-white font-black text-[9px]">CHAMPION</div>
            <div className="text-red-200 text-[6px] mt-0.5">2026</div>
          </motion.div>

          {/* Semi 2 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 }}
            className="bg-gradient-to-r from-red-600 to-red-700 rounded border-2 border-red-400 p-2 text-center w-full"
          >
            <div className="text-white font-black text-[8px]">SEMI 2</div>
            <div className="text-red-200 text-[6px] mt-0.5">TBD vs TBD</div>
          </motion.div>
        </div>

        {/* Round 3 - Elite 8 (Right) */}
        <div className="flex flex-col min-w-[90px]">
          <div className="text-center text-white font-bold text-[10px] mb-2 bg-red-800/80 rounded py-1 border border-red-600">
            ELITE 8
          </div>
          <div className="flex flex-col justify-center space-y-3 mt-4">
            {[...Array(4)].map((_, index) => (
              <motion.div
                key={`r3-right-${index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.05 }}
                className="bg-gray-800/60 rounded border border-red-400 p-1.5 text-[7px] font-bold text-center"
              >
                <div className="text-red-300">G{index + 5}</div>
                <div className="text-gray-500 text-[6px] mt-0.5">TBD</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Round 2 - Live (Right Side - Games 5-8) */}
        <div className="flex flex-col min-w-[110px]">
          <div className="text-center text-white font-bold text-[10px] mb-2 bg-red-600/80 rounded py-1 border border-red-400">
            🔴 ROUND 2 LIVE
          </div>
          <div className="space-y-1.5">
            {round2Matchups.slice(4, 8).map((matchup, index) => (
              <motion.div
                key={`r2-right-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.03 }}
                className="bg-red-600/30 rounded border-2 border-red-500 p-1 text-[7px] font-bold shadow-md"
              >
                <div className="text-white truncate text-right">G{matchup.game}: {matchup.team1.split(' ')[0]}</div>
                <div className="text-red-300 text-[6px] text-center font-bold">VS</div>
                <div className="text-white truncate text-right">{matchup.team2.split(' ')[0]}</div>
                <div className="text-yellow-400 text-[6px] text-center mt-0.5">LIVE</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Round 1 - Completed (Right) */}
        <div className="flex flex-col min-w-[130px]">
          <div className="text-center text-white font-bold text-[10px] mb-2 bg-gray-600/80 rounded py-1 border border-gray-400">
            ROUND 1 - COMPLETE
          </div>
          <div className="space-y-1">
            {playInRoundMatchups.slice(9, 18).map((matchup, index) => (
              <motion.div
                key={`r1-right-${index}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.01 }}
                className="bg-gray-800/60 rounded border border-gray-600 p-1 text-[7px] font-semibold"
              >
                <div className="text-white text-right truncate">{matchup.team1.split(' ')[0]}</div>
                <div className="text-gray-400 text-[6px] text-center">vs</div>
                <div className="text-white text-right truncate">{matchup.team2.split(' ')[0]}</div>
                <div className={`text-[6px] text-center mt-0.5 ${matchup.winner && matchup.winner !== 'DNQ' ? 'text-green-400' : ((matchup.game === 18 || matchup.game === 6) ? 'text-red-400' : 'text-gray-400')}`}>
                  {matchup.winner && matchup.winner !== 'DNQ' ? `✓ ${matchup.winner.split(' ')[0]}` : ((matchup.game === 18 || matchup.game === 6) ? "DNQ" : "TBD")}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Tournament Status for TV */}
      <div className="text-center mt-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md inline-flex items-center gap-2 border border-red-400"
        >
          <div className="w-2 h-2 bg-red-300 rounded-full animate-pulse"></div>
          <span className="font-bold text-[10px]">🔴 LIVE • {currentRound.description} • COMPETE NOW!</span>
          <div className="w-2 h-2 bg-red-300 rounded-full animate-pulse"></div>
        </motion.div>
      </div>
    </div>
  )
}