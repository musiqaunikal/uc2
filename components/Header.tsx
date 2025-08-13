"use client"

import type { User } from "@/types"
import { gameLogic } from "@/lib/game-logic"
import { Settings } from "lucide-react"
import Image from "next/image"

interface HeaderProps {
  user: User
  onOpenSettings: () => void
}

export const Header = ({ user, onOpenSettings }: HeaderProps) => {
  const { level, currentXP, xpForNext } = gameLogic.calculateLevel(user.xp)
  const { rank, title, icon } = gameLogic.calculateRank(user.totalEarned)
  const xpProgress = (currentXP / xpForNext) * 100

  const displayName = user.firstName + (user.lastName ? ` ${user.lastName}` : "")
  
  // Use Firebase avatar or generate one based on name
  const avatarUrl = user.avatarUrl || 
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName.replace(/\s+/g, "+"))}&background=4CAF50&color=fff&size=140`

  return (
    <header className="bg-gradient-to-r from-black/40 to-gray-900/40 backdrop-blur-lg border border-green-500/30 rounded-xl p-2 sm:p-3 mt-1 sm:mt-2 shadow-xl shadow-green-500/10">
      <div className="flex items-center gap-4 mb-4">
        {/* Avatar */}
        <div className="relative">
          <Image
            src={avatarUrl || "/placeholder.svg"}
            alt="User Avatar"
            width={40}
            height={40}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-green-500 shadow-lg shadow-green-500/50 transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full border border-black animate-pulse" />
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <h2 className="text-sm sm:text-base md:text-lg font-bold text-white font-display truncate">{displayName}</h2>
          {/* Displaying balance here as requested */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm sm:text-base md:text-lg text-white font-bold">{gameLogic.formatNumber(user.balance)}</span>
            <p className="text-xs sm:text-sm text-green-400 font-bold">UC</p>
          </div>
        </div>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center text-green-500 hover:bg-green-500 hover:text-white transition-all duration-300 hover:scale-110 shadow-lg"
        >
          <Settings className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
        </button>
      </div>

      {/* XP Progress */}
      <div>
        <div className="flex justify-between text-xs text-gray-300 mb-1 sm:mb-2">
          <span className="font-semibold">Level {level}</span>
          <span className="font-semibold">
            {currentXP} / {xpForNext} XP
          </span>
        </div>
        <div className="w-full h-1.5 sm:h-2 bg-gray-700 rounded-full overflow-hidden border border-gray-600/50 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transition-all duration-1000 relative overflow-hidden"
            style={{ width: `${xpProgress}%` }}
          >
            <div className="absolute inset-0 bg-white/30 animate-pulse" />
          </div>
        </div>
      </div>
    </header>
  )
}
