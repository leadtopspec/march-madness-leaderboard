'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, LogIn, X } from 'lucide-react'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (agentId: string) => void
  agents: Array<{ id: string; name: string; team: string }>
}

// Truly random access codes - in production, this would be in a secure database
const AGENT_CODES: { [key: string]: string } = {
  "MAX KONOPKA": "HJ39Q8",
  "ROBERT BRADY": "XL74K2", 
  "ZION RUSSELL": "MP82V5",
  "BYRON ACHA": "TG15N9",
  "JOSE VALDEZ": "QR47B3",
  "JADEN POPE": "ZW61F8",
  "WESTON CHRISTOPHER": "LD93X4",
  "NOLAN SCHOENBACHLER": "YH25P7",
  "THOMAS FOX": "BK78Q1",
  "JEREMI KISINSKI": "VN42M6",
  "JAKE DOLL": "RZ85L3",
  "DANIEL SUAREZ": "CT69W9",
  "RYAN BOVE": "FX17H4",
  "RYAN COOPER": "JP54T8",
  "LUCAS KONSTATOS": "SG92K5",
  "ANTHONY MAYROSE": "DN31Y7",
  "ANDREW FLASKAMP": "WQ76B2",
  "FABIAN ESCATEL": "ML48R9",
  "KAMREN HERALD": "PV83F6",
  "JAYLEN BISCHOFF": "TH29X1",
  "BRENNAN SKODA": "ZR65L4",
  "AALYIAH WASHBURN": "QK18C7",
  "KADEN CAMENZIND": "BJ94M3",
  "HANNAH FRENCH": "GX52N8",
  "MICHAEL CARNEY": "LV37Q6",
  "TAJ DHILLON": "RY71K9",
  "JACOB LEE": "FW84H2",
  "ADRIEN RAMÍREZ-RAYO": "TP59V5",
  "DENNIS CHORNIY": "ZC13B8",
  "CHARLIE SIMMS": "MQ76X4",
  "BRENON REED": "JL41R7",
  "KIRILL PAVLYCHEV": "WG95F1",
  "LAINEY DROWN": "DN68P3",
  "VALERIA ALVAL": "HS27T9"
}

export default function LoginModal({ isOpen, onClose, onLogin, agents }: LoginModalProps) {
  const [accessCode, setAccessCode] = useState('')
  const [error, setError] = useState('')

  const handleLogin = () => {
    if (!accessCode) {
      setError('Please enter your access code')
      return
    }

    // Find agent by access code
    const agentName = Object.keys(AGENT_CODES).find(name => 
      AGENT_CODES[name] === accessCode.toUpperCase()
    )

    if (!agentName) {
      setError('Invalid access code')
      setAccessCode('')
      return
    }

    // Find agent ID by name
    const agent = agents.find(agent => agent.name === agentName)
    if (!agent) {
      setError('Agent not found')
      return
    }

    // Successful login
    onLogin(agent.id)
    onClose()
    setAccessCode('')
    setError('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-black text-slate-800">🏖️ Agent Login</h2>
          <p className="text-slate-600 font-semibold">Enter your personal dashboard</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Enter Your Access Code</label>
            <div className="relative">
              <input
                type="password"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="Enter your 6-character code"
                className="w-full px-4 py-4 pl-12 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all font-semibold text-lg tracking-widest"
                maxLength={6}
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleLogin()
                  }
                }}
              />
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Your unique 6-character code will automatically log you into your dashboard
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-semibold"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            onClick={handleLogin}
            disabled={!accessCode || accessCode.length !== 6}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 px-6 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg"
            whileHover={{ scale: (accessCode && accessCode.length === 6) ? 1.02 : 1 }}
            whileTap={{ scale: (accessCode && accessCode.length === 6) ? 0.98 : 1 }}
          >
            {(accessCode && accessCode.length === 6) ? '🏄‍♂️ Enter Dashboard' : 
             accessCode ? `🔐 ${accessCode.length}/6 characters` : 
             '🏝️ Enter Your Code'}
          </motion.button>
        </div>

        <div className="mt-6 p-4 bg-cyan-50 rounded-xl">
          <div className="text-sm font-bold text-cyan-800 mb-1">🏀 Secure Tournament Access:</div>
          <ul className="text-xs text-cyan-700 space-y-1">
            <li>• Enter your unique 6-character access code to log in</li>
            <li>• Your code automatically identifies you (e.g. HJ39Q8, MP82V5)</li>
            <li>• Direct access to your personal dashboard and competition tracking</li>
            <li>• Record sales and track your path to championship</li>
          </ul>
        </div>
      </motion.div>
    </div>
  )
}