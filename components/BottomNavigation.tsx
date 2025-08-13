"use client"

import { Hand, Rocket, Target, Wallet, Users } from "lucide-react"

interface BottomNavigationProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export const BottomNavigation = ({ activeSection, onSectionChange }: BottomNavigationProps) => {
  const navItems = [
    { id: "tap", label: "Tap", icon: Hand },
    { id: "boost", label: "Boost", icon: Rocket },
    { id: "missions", label: "Missions", icon: Target },
    { id: "wallet", label: "Wallet", icon: Wallet },
    { id: "friends", label: "Friends", icon: Users },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t-2 border-green-500/40 p-1 sm:p-2 z-50 shadow-2xl shadow-green-500/10">
      <div className="flex justify-around items-center gap-1 sm:gap-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id

          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`flex flex-col items-center gap-0.5 sm:gap-1 p-1.5 sm:p-2 rounded-lg transition-all duration-300 flex-1 max-w-[70px] sm:max-w-[80px] relative group ${
                isActive
                  ? "text-green-400 bg-green-500/15 border border-green-500/40 shadow-lg shadow-green-500/20 scale-110"
                  : "text-gray-400 hover:text-green-400 hover:scale-105 hover:bg-gray-800/30"
              }`}
            >
              {isActive && (
                <div className="absolute -top-0.5 sm:-top-1 left-1/2 transform -translate-x-1/2 w-3 sm:w-4 h-0.5 sm:h-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse" />
              )}
              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${isActive ? "scale-110" : ""}`} />
              <span className="text-xs font-semibold uppercase tracking-wide">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
