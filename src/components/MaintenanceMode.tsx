'use client'

import { motion } from 'framer-motion'
import { Wrench, Clock, AlertTriangle } from 'lucide-react'

export default function MaintenanceMode() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-black to-red-950 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-2xl mx-auto"
      >
        {/* Maintenance Icon */}
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <Wrench className="w-24 h-24 text-red-500" />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute -top-2 -right-2"
            >
              <AlertTriangle className="w-8 h-8 text-yellow-400" />
            </motion.div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-6xl font-bold text-white mb-6"
        >
          Under Maintenance
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-2xl text-red-300 mb-8"
        >
          March Madness Tournament
        </motion.p>

        {/* Description */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-lg text-gray-300 mb-12 space-y-4"
        >
          <p>
            We're upgrading our system to provide you with better real-time updates 
            and improved performance.
          </p>
          <p className="flex items-center justify-center gap-2">
            <Clock className="w-5 h-5 text-red-400" />
            Expected downtime: <span className="text-white font-semibold">5-10 minutes</span>
          </p>
        </motion.div>

        {/* Loading Animation */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex justify-center space-x-2 mb-8"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.2, 1],
                backgroundColor: ['#dc2626', '#ef4444', '#dc2626']
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
              className="w-3 h-3 rounded-full bg-red-600"
            />
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="text-sm text-gray-400"
        >
          <p>
            Thank you for your patience. The tournament will resume shortly.
          </p>
          <p className="mt-2">
            — All In Agencies Team
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}