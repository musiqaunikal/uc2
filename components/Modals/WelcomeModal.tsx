"use client"

import { useState } from "react"

export const WelcomeModal = ({ isOpen, onClose, onClaimBonus, onSkip }) => {
  // Changed to named export
  const [claiming, setClaiming] = useState(false)

  const handleClaimBonus = async () => {
    setClaiming(true)
    try {
      await onClaimBonus()
      onClose()
    } finally {
      setClaiming(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      {/* Background Video */}
      <div className="absolute inset-0 overflow-hidden">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-30">
          <source src="/welcome.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-md mx-4 text-center bg-gray-900/90 backdrop-blur-md border-2 border-green-500/30 rounded-2xl shadow-xl shadow-green-500/20 p-8">
        {/* Logo */}
        <div className="w-28 h-28 mx-auto mb-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-5xl animate-bounce shadow-lg shadow-green-500/50">
          🎮
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-white mb-3 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent font-display">
          Welcome to UC Coin!
        </h1>

        {/* Description */}
        <p className="text-sm text-gray-200 mb-6 leading-relaxed">
          Tap to earn UC coins and complete missions!
        </p>

        {/* Welcome Bonus */}
        <div className="bg-black/40 backdrop-blur-md border-2 border-green-500/50 rounded-xl p-4 mb-6 shadow-lg shadow-green-500/20 animate-background-pulse">
          <div className="text-3xl font-bold text-orange-400 mb-1 animate-pulse font-display">100</div>
          <div className="text-lg text-green-400 font-bold mb-1">UC</div>
          <div className="text-xs text-gray-300">Welcome Bonus</div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleClaimBonus}
            disabled={claiming}
            className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 disabled:from-gray-700 disabled:to-gray-800 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <span className="text-xl">🎁</span>
            {claiming ? "Claiming..." : "Claim Welcome Bonus"}
          </button>

          <button
            onClick={onSkip}
            className="w-full bg-gray-700/20 hover:bg-gray-700/40 text-gray-300 hover:text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 border border-gray-700/30 hover:border-gray-600/50"
          >
            Skip for Now
          </button>
        </div>
      </div>
    </div>
  )
}
