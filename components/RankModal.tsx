"use client"

import { useState, useEffect } from "react"
import type { User } from "@/types"
import { gameLogic } from "@/lib/game-logic"
import { X } from "lucide-react"
import Image from "next/image"
import { firebaseService } from "@/lib/firebase" // Declare the firebaseService variable

interface RankModalProps {
  isOpen: boolean
  onClose: () => void
  user: User
}

interface LeaderboardUser {
  id: string
  firstName: string
  lastName?: string
  avatarUrl?: string
  totalEarned: number
  rank: number
}

export const RankModal = ({ isOpen, onClose, user }: RankModalProps) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)
  const [userRank, setUserRank] = useState(0)

  useEffect(() => {
    if (isOpen) {
      loadLeaderboard()
    }
  }, [isOpen])

  const loadLeaderboard = async () => {
    try {
      setLoading(true)

      // Get all users from Firebase using the correct method
      const usersData = await firebaseService.getGlobalLeaderboard()

      // Convert to leaderboard format
      const sortedUsers = usersData.map((userData, index) => ({
        ...userData,
        rank: index + 1,
      }))

      setLeaderboard(sortedUsers)

      // Find current user's rank
      const currentUserRank = sortedUsers.findIndex((u) => u.id === user.id) + 1
      setUserRank(currentUserRank || 0)
    } catch (error) {
      console.error("Failed to load leaderboard:", error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return { icon: "👑", color: "text-yellow-400" }
    if (rank === 2) return { icon: "🥈", color: "text-gray-300" }
    if (rank === 3) return { icon: "🥉", color: "text-orange-400" }
    if (rank <= 10) return { icon: "🏆", color: "text-purple-400" }
    if (rank <= 50) return { icon: "🎖️", color: "text-blue-400" }
    return { icon: "⭐", color: "text-green-400" }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-md border-2 border-yellow-500/30 rounded-2xl shadow-xl shadow-yellow-500/20 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/30 bg-gradient-to-r from-yellow-500/10 to-orange-500/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center text-2xl shadow-lg">
              🏆
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-display">Global Leaderboard</h2>
              <p className="text-sm text-gray-300">Top 100 Players by Balance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-gray-700/20 hover:bg-red-500/20 border border-gray-700/30 hover:border-red-500/50 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-400 transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Your Rank */}
        {userRank > 0 && (
          <div className="p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 border-b border-gray-700/30">
            <div className="flex items-center gap-3 p-3 bg-black/30 rounded-xl border border-green-500/30 animate-background-pulse">
              <div className="text-2xl">{getRankIcon(userRank).icon}</div>
              <div className="flex-1">
                <div className="text-white font-bold">Your Position</div>
                <div className="text-sm text-gray-300">
                  #{userRank} of {leaderboard.length}
                </div>
              </div>
              <div className="text-right">
                <div className="text-green-400 font-bold">{gameLogic.formatNumber(user.totalEarned)}</div>
                <div className="text-xs text-gray-400">UC Earned</div>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4 animate-spin text-green-400">⏳</div>
              <p className="text-gray-400">Loading leaderboard...</p>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-xl font-bold text-white font-display mb-2">No Data Available</h3>
              <p className="text-gray-400">Leaderboard will update soon!</p>
            </div>
          ) : (
            <div className="p-4 space-y-2">
              {leaderboard.map((player, index) => {
                const rankInfo = getRankIcon(player.rank)
                const isCurrentUser = player.id === user.id
                const displayName = `${player.firstName} ${player.lastName || ""}`.trim()
                const avatarUrl =
                  player.avatarUrl ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName.replace(/\s+/g, "+"))}&background=4CAF50&color=fff&size=40`

                return (
                  <div
                    key={player.id}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                      isCurrentUser
                        ? "bg-gradient-to-r from-green-500/20 to-blue-500/20 border-2 border-green-500/40 shadow-lg"
                        : "bg-black/20 hover:bg-black/30 border border-gray-700/20 hover:border-gray-600/30"
                    }`}
                  >
                    {/* Rank */}
                    <div className="flex items-center gap-2 min-w-[60px]">
                      <span className={`text-lg ${rankInfo.color}`}>{rankInfo.icon}</span>
                      <span className={`font-bold ${isCurrentUser ? "text-green-400" : "text-white"}`}>
                        #{player.rank}
                      </span>
                    </div>

                    {/* Avatar */}
                    <Image
                      src={avatarUrl || "/placeholder.svg"}
                      alt="Player Avatar"
                      width={40}
                      height={40}
                      className={`rounded-full border-2 ${isCurrentUser ? "border-green-500" : "border-gray-500"}`}
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold truncate ${isCurrentUser ? "text-green-400" : "text-white"}`}>
                        {displayName}
                        {isCurrentUser && " (You)"}
                      </div>
                      <div className="text-xs text-gray-400">{gameLogic.formatNumber(player.totalEarned)} UC</div>
                    </div>

                    {/* Badge for top ranks */}
                    {player.rank <= 3 && (
                      <div
                        className={`px-2 py-1 rounded-lg text-xs font-bold shadow-sm ${
                          player.rank === 1
                            ? "bg-yellow-500/20 text-yellow-400"
                            : player.rank === 2
                              ? "bg-gray-500/20 text-gray-300"
                              : "bg-orange-500/20 text-orange-400"
                        }`}
                      >
                        {player.rank === 1 ? "CHAMPION" : player.rank === 2 ? "RUNNER-UP" : "THIRD PLACE"}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
