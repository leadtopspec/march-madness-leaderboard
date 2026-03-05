'use client'

import { motion } from 'framer-motion'

export default function BracketView() {
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
    <div 
      className="relative w-full min-h-screen bg-gradient-to-b from-sky-300 via-blue-400 to-yellow-200 overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(to bottom, 
          rgba(135, 206, 250, 0.9) 0%, 
          rgba(100, 149, 237, 0.8) 40%,
          rgba(240, 230, 140, 0.9) 80%, 
          rgba(238, 203, 173, 0.95) 100%)`
      }}
    >
      {/* Beach Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 text-8xl text-green-600/60 transform -rotate-12">🌴</div>
        <div className="absolute top-0 right-0 text-8xl text-green-600/60 transform rotate-12">🌴</div>
        <div className="absolute bottom-20 right-24 text-4xl transform rotate-12">⭐</div>
        <div className="absolute bottom-24 right-40 text-3xl">🐚</div>
        <div className="absolute bottom-16 left-1/4 text-3xl transform -rotate-12">🕶️</div>
        <div className="absolute bottom-12 right-1/3 text-4xl">🦀</div>
        <div className="absolute bottom-20 right-1/4 text-3xl">🌺</div>
      </div>

      {/* March Madness Sign */}
      <div className="absolute bottom-12 right-16 transform rotate-6 z-20">
        <div className="bg-gradient-to-br from-amber-600 to-orange-700 text-white px-4 py-3 rounded-xl shadow-2xl border-4 border-amber-800">
          <div className="text-lg font-black text-center">MARCH</div>
          <div className="text-lg font-black text-center">MADNESS</div>
          <div className="text-xs text-center mt-1 opacity-90">🏀 2025 🏀</div>
        </div>
        <div className="w-2 h-6 bg-amber-800 mx-auto"></div>
        <div className="w-5 h-5 bg-amber-900 mx-auto rounded-full"></div>
      </div>

      {/* Tournament Title */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30">
        <div className="bg-orange-600/95 backdrop-blur text-white px-6 py-3 rounded-2xl shadow-xl border-2 border-orange-700">
          <div className="text-xl font-black text-center">🏀 ALL IN AGENCIES TOURNAMENT 🏀</div>
          <div className="text-sm text-center opacity-90 mt-1">MARCH MADNESS • 34 COMPETITORS</div>
        </div>
      </div>

      {/* Main Bracket Container */}
      <div className="relative z-10 pt-20 pb-8 px-4">
        <div className="max-w-[1400px] mx-auto h-[900px] relative">
          
          {/* SVG Bracket Structure */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1400 900">
            
            {/* Left Side Bracket Lines */}
            <g stroke="#333" strokeWidth="2" fill="none">
              {/* Round 1 to Round 2 connections */}
              <path d="M 176 45 L 200 45 L 200 75 L 176 75" />
              <path d="M 200 60 L 200 60" />
              
              <path d="M 176 100 L 200 100 L 200 130 L 176 130" />
              <path d="M 200 115 L 200 115" />
              
              <path d="M 176 155 L 200 155 L 200 185 L 176 185" />
              <path d="M 200 170 L 200 170" />
              
              <path d="M 176 210 L 200 210 L 200 240 L 176 240" />
              <path d="M 200 225 L 200 225" />

              {/* Round 2 to Round 3 connections */}
              <path d="M 236 70 L 280 70 L 280 140 L 236 140" />
              <path d="M 280 105 L 280 105" />
              
              <path d="M 236 210 L 280 210 L 280 280 L 236 280" />
              <path d="M 280 245 L 280 245" />

              {/* Round 3 to Final Four */}
              <path d="M 312 140 L 380 140 L 380 280 L 312 280" />
              <path d="M 380 210 L 380 210" />

              {/* Bottom half connections */}
              <path d="M 176 340 L 200 340 L 200 370 L 176 370" />
              <path d="M 176 395 L 200 395 L 200 425 L 176 425" />
              <path d="M 176 450 L 200 450 L 200 480 L 176 480" />
              <path d="M 176 505 L 200 505 L 200 535 L 176 535" />

              <path d="M 236 365 L 280 365 L 280 435 L 236 435" />
              <path d="M 236 505 L 280 505 L 280 575 L 236 575" />

              <path d="M 312 400 L 380 400 L 380 540 L 312 540" />
            </g>

            {/* Right Side Bracket Lines (Mirror) */}
            <g stroke="#333" strokeWidth="2" fill="none">
              {/* Round 1 to Round 2 connections */}
              <path d="M 1224 45 L 1200 45 L 1200 75 L 1224 75" />
              <path d="M 1224 100 L 1200 100 L 1200 130 L 1224 130" />
              <path d="M 1224 155 L 1200 155 L 1200 185 L 1224 185" />
              <path d="M 1224 210 L 1200 210 L 1200 240 L 1224 240" />

              {/* Round 2 to Round 3 connections */}
              <path d="M 1164 70 L 1120 70 L 1120 140 L 1164 140" />
              <path d="M 1164 210 L 1120 210 L 1120 280 L 1164 280" />

              {/* Round 3 to Final Four */}
              <path d="M 1088 140 L 1020 140 L 1020 280 L 1088 280" />

              {/* Bottom half connections */}
              <path d="M 1224 340 L 1200 340 L 1200 370 L 1224 370" />
              <path d="M 1224 395 L 1200 395 L 1200 425 L 1224 425" />
              <path d="M 1224 450 L 1200 450 L 1200 480 L 1224 480" />
              <path d="M 1224 505 L 1200 505 L 1200 535 L 1224 535" />

              <path d="M 1164 365 L 1120 365 L 1120 435 L 1164 435" />
              <path d="M 1164 505 L 1120 505 L 1120 575 L 1164 575" />

              <path d="M 1088 400 L 1020 400 L 1020 540 L 1088 540" />
            </g>

            {/* Championship Connection */}
            <g stroke="#333" strokeWidth="3" fill="none">
              <path d="M 412 210 L 500 210 L 500 470 L 412 470" />
              <path d="M 500 340 L 612 340" />
              <path d="M 988 210 L 900 210 L 900 470 L 988 470" />
              <path d="M 900 340 L 788 340" />
            </g>
          </svg>

          {/* Left Side Teams - Round 1 */}
          <div className="absolute left-0" style={{top: '20px'}}>
            <div className="space-y-1">
              {leftTeams.map((team, index) => (
                <motion.div
                  key={`left-${index}`}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/90 rounded border border-gray-400 p-2 w-48 h-12 text-xs font-semibold flex items-center"
                  style={{marginBottom: '8px'}}
                >
                  {team}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Side Teams - Round 1 */}
          <div className="absolute right-0" style={{top: '20px'}}>
            <div className="space-y-1">
              {rightTeams.map((team, index) => (
                <motion.div
                  key={`right-${index}`}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/90 rounded border border-gray-400 p-2 w-48 h-12 text-xs font-semibold flex items-center justify-end"
                  style={{marginBottom: '8px'}}
                >
                  {team}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Round 2 - Left Side */}
          <div className="absolute" style={{left: '220px', top: '50px'}}>
            <div className="space-y-4">
              {[...Array(9)].map((_, index) => (
                <motion.div
                  key={`left-r2-${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="bg-white/90 rounded border border-gray-400 p-2 w-40 h-12 text-xs flex items-center justify-center font-semibold"
                  style={{marginBottom: '20px'}}
                >
                  TBD
                </motion.div>
              ))}
            </div>
          </div>

          {/* Round 2 - Right Side */}
          <div className="absolute" style={{right: '220px', top: '50px'}}>
            <div className="space-y-4">
              {[...Array(9)].map((_, index) => (
                <motion.div
                  key={`right-r2-${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="bg-white/90 rounded border border-gray-400 p-2 w-40 h-12 text-xs flex items-center justify-center font-semibold"
                  style={{marginBottom: '20px'}}
                >
                  TBD
                </motion.div>
              ))}
            </div>
          </div>

          {/* Round 3 - Left Side */}
          <div className="absolute" style={{left: '320px', top: '120px'}}>
            <div className="space-y-8">
              {[...Array(5)].map((_, index) => (
                <motion.div
                  key={`left-r3-${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 + index * 0.1 }}
                  className="bg-white/90 rounded border border-gray-400 p-2 w-36 h-12 text-xs flex items-center justify-center font-semibold"
                  style={{marginBottom: '40px'}}
                >
                  TBD
                </motion.div>
              ))}
            </div>
          </div>

          {/* Round 3 - Right Side */}
          <div className="absolute" style={{right: '320px', top: '120px'}}>
            <div className="space-y-8">
              {[...Array(5)].map((_, index) => (
                <motion.div
                  key={`right-r3-${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 + index * 0.1 }}
                  className="bg-white/90 rounded border border-gray-400 p-2 w-36 h-12 text-xs flex items-center justify-center font-semibold"
                  style={{marginBottom: '40px'}}
                >
                  TBD
                </motion.div>
              ))}
            </div>
          </div>

          {/* Final Four */}
          <div className="absolute" style={{left: '420px', top: '220px'}}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="bg-white/90 rounded border border-gray-400 p-2 w-36 h-12 text-xs flex items-center justify-center font-semibold"
              style={{marginBottom: '120px'}}
            >
              REGION #1 TBD
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="bg-white/90 rounded border border-gray-400 p-2 w-36 h-12 text-xs flex items-center justify-center font-semibold"
            >
              REGION #2 TBD
            </motion.div>
          </div>

          <div className="absolute" style={{right: '420px', top: '220px'}}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="bg-white/90 rounded border border-gray-400 p-2 w-36 h-12 text-xs flex items-center justify-center font-semibold"
              style={{marginBottom: '120px'}}
            >
              REGION #3 TBD
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="bg-white/90 rounded border border-gray-400 p-2 w-36 h-12 text-xs flex items-center justify-center font-semibold"
            >
              REGION #4 TBD
            </motion.div>
          </div>

          {/* Championship */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.5 }}
              className="text-center"
            >
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg border-2 border-yellow-600 p-4 w-44 h-16 text-sm font-black flex items-center justify-center mb-3 shadow-2xl">
                <div className="text-center">
                  <div className="text-white">🏆 CHAMPION 🏆</div>
                  <div className="text-xs text-yellow-100">MARCH MADNESS 2025</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Live Tournament Status */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30">
        <div className="bg-orange-500/90 backdrop-blur text-white px-6 py-2 rounded-xl shadow-lg border-2 border-orange-600">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            <span className="font-bold text-sm">LIVE • ROUND 1 IN PROGRESS</span>
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}