"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import type { User } from "@/types"
import { gameLogic } from "@/lib/game-logic"
import Image from "next/image"

interface TapSectionProps {
  user: User
  onTap: (event?: React.MouseEvent | React.TouchEvent) => any
  onOpenRank: () => void
}

export const TapSection = ({ user, onTap, onOpenRank }: TapSectionProps) => {
  const [tapEffects, setTapEffects] = useState<
    Array<{ id: number; x: number; y: number; amount: number; type: string }>
  >([])
  const [isPressed, setIsPressed] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const effectIdRef = useRef(0)

  const energyPercentage = (user.tapsLeft / user.energyLimit) * 100
  const { rank, icon } = gameLogic.calculateRank(user.totalEarned)

  const handleTapStart = useCallback(() => {
    setIsPressed(true)
  }, [])

  const handleTapEnd = useCallback(() => {
    setIsPressed(false)
  }, [])

  const handleTap = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      event.preventDefault()

      const result = onTap(event)

      if (result?.success) {
        const rect = containerRef.current?.getBoundingClientRect()
        if (rect) {
          let clientX, clientY

          if ("clientX" in event) {
            clientX = event.clientX
            clientY = event.clientY
          } else if (event.touches && event.touches[0]) {
            clientX = event.touches[0].clientX
            clientY = event.touches[0].clientY
          } else {
            clientX = rect.left + rect.width / 2
            clientY = rect.top + rect.height / 2
          }

          const x = clientX - rect.left
          const y = clientY - rect.top

          const effect = {
            id: effectIdRef.current++,
            x,
            y,
            amount: result.earned,
            type: result.type,
          }

          setTapEffects((prev) => [...prev, effect])

          setTimeout(() => {
            setTapEffects((prev) => prev.filter((e) => e.id !== effect.id))
          }, 800)
        }
      }
    },
    [onTap],
  )

  return (
    <div className="pb-4">
      {/* Compact Header */}
      <div className="flex items-center gap-1 sm:gap-2 mb-3 sm:mb-4">
        {/* Rank Button */}
        <button
          onClick={onOpenRank}
          className="relative bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/40 rounded-lg p-1.5 sm:p-2 hover:border-yellow-500/60 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-yellow-500/40 group overflow-hidden flex flex-col items-center justify-center min-w-[40px] sm:min-w-[50px]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-orange-400/20 to-yellow-400/20 animate-pulse" />
          <div className="absolute top-0.5 right-0.5 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-yellow-400 rounded-full animate-ping opacity-75" />

          <div className="relative text-center">
            <div className="text-sm sm:text-base mb-0.5 animate-bounce">{icon}</div>
            <div className="text-xs text-yellow-400 font-bold bg-black/30 px-1 sm:px-1.5 py-0.5 rounded-full">#{rank}</div>
          </div>
        </button>

        {/* Enhanced Combo & Streak */}
        <div className="flex-1 grid grid-cols-2 gap-1 sm:gap-2">
          <div
            className={`relative bg-black/30 border rounded-lg p-1.5 sm:p-2 text-center overflow-hidden ${
              user.combo >= 10
                ? "shadow-lg shadow-orange-500/30 animate-background-pulse border-orange-400"
                : "border-gray-700/30"
            }`}
          >
            {user.combo >= 10 && (
              <div className="absolute inset-0 bg-gradient-to-t from-red-500/20 via-orange-500/20 to-yellow-500/20 animate-pulse" />
            )}

            <div className="relative">
              <div className="text-sm sm:text-base mb-0.5">🔥</div>
              <div className="text-orange-400 font-bold text-xs sm:text-sm">{user.combo}</div>
              <div className="text-xs text-gray-300 font-semibold uppercase tracking-wide">COMBO</div>
            </div>

            {user.combo >= 10 && (
              <>
                <div className="absolute top-1 right-1 w-1 h-1 bg-orange-400 rounded-full animate-ping" />
              </>
            )}
          </div>

          <div
            className={`relative bg-black/30 border rounded-lg p-1.5 sm:p-2 text-center overflow-hidden ${
              user.streak > 0
                ? "shadow-lg shadow-blue-500/30 animate-background-pulse border-blue-400"
                : "border-gray-700/30"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 via-purple-500/10 to-blue-500/10 animate-pulse" />

            <div className="relative">
              <div className="text-sm sm:text-base mb-0.5">⚡</div>
              <div className="text-blue-400 font-bold text-xs sm:text-sm">{user.streak}</div>
              <div className="text-xs text-gray-300 font-semibold uppercase tracking-wide">STREAK</div>
            </div>

            <div className="absolute top-1 left-1 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-60" />
          </div>
        </div>
      </div>

      {/* Enhanced Main Tap Area with Optimized Coin (No Rotation) */}
      <div className="relative mb-4 sm:mb-6" ref={containerRef}>
        <div
          className={`relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 mx-auto cursor-pointer transition-all duration-200 group ${
            isPressed ? "scale-95 animate-coin-press" : "hover:scale-105"
          }`}
          onClick={handleTap}
          onTouchStart={(e) => {
            handleTapStart()
            handleTap(e)
          }}
          onTouchEnd={handleTapEnd}
          onMouseDown={handleTapStart}
          onMouseUp={handleTapEnd}
          onMouseLeave={handleTapEnd}
        >
          {/* Optimized Aura Layers */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 rounded-full opacity-15 animate-pulse" />
          <div className="absolute inset-1 sm:inset-2 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 rounded-full opacity-20 animate-ping" />
          <div className="absolute inset-2 sm:inset-4 bg-gradient-to-r from-cyan-400 via-green-500 to-blue-500 rounded-full opacity-25 animate-pulse" />

          {/* Main Coin Container with Smooth Animation */}
          <div className="relative z-10 w-full h-full bg-gradient-to-br from-green-400/30 to-blue-500/30 rounded-full border-4 border-green-500/60 shadow-2xl shadow-green-500/60 flex items-center justify-center overflow-hidden backdrop-blur-sm">
            {/* Inner Glow */}
            <div className="absolute inset-4 bg-gradient-to-br from-green-300/20 to-blue-300/20 rounded-full animate-pulse" />

            {/* Optimized Coin Image (No Rotation) */}
            <div className={`relative z-20 transition-transform duration-200 ${isPressed ? "scale-90" : ""}`}>
              <Image
                src="/images/uc-coin.png"
                alt="UC Coin"
                width={80}
                height={80}
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain drop-shadow-2xl"
                priority
                quality={100}
                style={{
                  filter: "drop-shadow(0 0 20px rgba(76, 175, 80, 0.6))",
                }}
              />
            </div>

            {/* Tap Ripple Effect */}
            <div
              className={`absolute inset-0 rounded-full border-4 border-white/30 transition-all duration-300 ${
                isPressed ? "scale-100 opacity-0" : "scale-0 opacity-100"
              }`}
            />
          </div>

          {/* Enhanced Tap Effects */}
          {tapEffects.map((effect) => (
            <div
              key={effect.id}
              className={`absolute pointer-events-none z-30 font-bold select-none ${
                effect.type === "critical"
                  ? "text-red-400 text-base sm:text-lg drop-shadow-lg animate-bounce-up-critical"
                  : effect.type === "jackpot"
                    ? "text-green-400 text-lg sm:text-xl drop-shadow-xl animate-bounce-up-jackpot"
                    : "text-orange-400 text-sm sm:text-base drop-shadow-md animate-pop-up"
              }`}
              style={{
                left: effect.x,
                top: effect.y,
                transform: "translate(-50%, -50%)",
                textShadow: "0 0 10px currentColor",
              }}
            >
              +{gameLogic.formatNumber(effect.amount)}
              {effect.type === "jackpot" && " 🎰"}
              {effect.type === "critical" && " 🔥"}
            </div>
          ))}

          {/* Optimized Floating Particles */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-ping opacity-40"
              style={{
                left: `${25 + i * 10}%`,
                top: `${25 + i * 10}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${2 + i * 0.2}s`,
              }}
            />
          ))}

          {/* Optimized Orbital Particles */}
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={`orbit-${i}`}
              className="absolute w-2 h-2 sm:w-3.5 sm:h-3.5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-60 animate-orbit"
              style={{
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                animationDelay: `${i * 1}s`,
              }}
            />
          ))}
        </div>

        {/* Enhanced Tap Instruction */}
        <div className="text-center mt-2 sm:mt-3">
          <div className="bg-gradient-to-r from-black/40 to-gray-900/40 backdrop-blur-md border border-green-500/50 rounded-xl px-2 sm:px-4 py-1 sm:py-2 inline-block shadow-lg shadow-green-500/20">
            <p className="text-green-400 font-bold text-xs flex items-center gap-1 sm:gap-2">
              <span className="animate-bounce">👆</span>
              <span>Tap to Mine UC!</span>
              <span className="animate-pulse">💎</span>
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Energy System */}
      <div className="bg-gradient-to-r from-black/40 to-gray-900/40 backdrop-blur-md border border-green-500/40 rounded-xl p-2 sm:p-3 shadow-xl shadow-green-500/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center text-lg sm:text-xl shadow-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-orange-500/30 to-yellow-400/30 animate-pulse" />
              <span className="relative animate-pulse">⚡</span>
            </div>
            <div>
              <p className="text-white font-bold text-base font-display">
                {user.tapsLeft} / {user.energyLimit}
              </p>
              <p className="text-xs text-gray-300 font-semibold uppercase tracking-wide">Energy</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm sm:text-lg font-bold text-yellow-400 drop-shadow-lg font-display">
              {Math.round(energyPercentage)}%
            </div>
            <div className="text-xs text-gray-400">Charged</div>
          </div>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="relative w-full h-2 sm:h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-700/50 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full transition-all duration-500 relative overflow-hidden"
            style={{ width: `${energyPercentage}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>

          {energyPercentage > 50 && (
            <>
              <div className="absolute top-0.5 left-1/4 w-0.5 h-0.5 sm:w-1 sm:h-1 bg-yellow-400 rounded-full animate-ping" />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
