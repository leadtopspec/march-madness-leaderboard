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
      {/* TV Header */}
      <div className="text-center mb-2">
        <div className="bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-2 rounded-lg shadow-lg inline-block">
          <h3 className="text-lg font-black">🥊 FIRST ROUND MATCHUPS LIVE 🥊</h3>
        </div>
      </div>

      {/* Matchups Grid for TV */}
      <div className="grid grid-cols-4 gap-2 h-full">
        {firstRoundMatchups.map((matchup, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-red-400 p-3 shadow-lg flex flex-col justify-between"
          >
            <div className="text-center text-red-300 font-bold text-xs mb-2">
              #{index + 1}
            </div>
            <div className="space-y-2 flex-1">
              <div className="bg-red-600/30 rounded border border-red-400 p-2">
                <div className="text-white font-bold text-xs text-center truncate">
                  {matchup.team1}
                </div>
              </div>
              <div className="text-center text-red-400 font-black text-sm">VS</div>
              <div className="bg-red-600/30 rounded border border-red-400 p-2">
                <div className="text-white font-bold text-xs text-center truncate">
                  {matchup.team2}
                </div>
              </div>
            </div>
            <div className="text-center mt-2">
              <div className="bg-black/50 rounded px-2 py-1 text-yellow-300 text-xs font-bold">
                LIVE
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Special Advances */}
      <div className="mt-3 flex justify-center gap-4">
        {specialAdvances.map((player, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 + index * 0.1 }}
            className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg border border-green-400 shadow-lg"
          >
            <div className="font-bold text-xs text-center">{player.name}</div>
            <div className="text-xs text-green-200 text-center">{player.status}</div>
          </motion.div>
        ))}
      </div>


    </div>
  )
}