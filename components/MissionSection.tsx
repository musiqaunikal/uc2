"use client"

import { useState } from "react"
import type { Mission, UserMission } from "@/types"
import { Target, Clock, Code, Users, X, Send, ExternalLink, AlertCircle } from "lucide-react"

interface MissionSectionProps {
  missions: Record<string, Mission>
  userMissions: Record<string, UserMission>
  onStartMission: (missionId: string) => Promise<any>
  onVerifyMission: (missionId: string) => Promise<any>
  onSubmitPromoCode: (missionId: string, code: string) => Promise<any>
  onClaimReward: (missionId: string) => Promise<any>
}

export const MissionSection = ({
  missions,
  userMissions,
  onStartMission,
  onVerifyMission,
  onSubmitPromoCode,
  onClaimReward,
}: MissionSectionProps) => {
  const [currentFilter, setCurrentFilter] = useState("all")
  const [promoCodeModal, setPromoCodeModal] = useState<{
    isOpen: boolean
    missionId: string
    code: string
    submitting: boolean
    error: string
  }>({
    isOpen: false,
    missionId: "",
    code: "",
    submitting: false,
    error: "",
  })

  const filters = [
    { id: "all", label: "All", icon: "🎯" },
    { id: "join_channel", label: "Join", icon: "👥" },
    { id: "url_timer", label: "Timer", icon: "⏰" },
    { id: "promo_code", label: "Code", icon: "🔐" },
  ]

  const filteredMissions = Object.entries(missions).filter(([id, mission]) => {
    if (!mission || !mission.active) return false
    if (currentFilter === "all") return true
    return mission.type === currentFilter
  })

  const sortedMissions = filteredMissions.sort(([aId, a], [bId, b]) => {
    const aUserMission = userMissions[aId]
    const bUserMission = userMissions[bId]

    const aCompleted = aUserMission?.completed || false
    const bCompleted = bUserMission?.completed || false

    if (aCompleted !== bCompleted) {
      return aCompleted ? 1 : -1
    }

    return (a.priority || 999) - (b.priority || 999)
  })

  const getMissionIcon = (mission: Mission) => {
    switch (mission.type) {
      case "join_channel":
      case "join_group":
        return <Users className="w-6 h-6" />
      case "url_timer":
        return <Clock className="w-6 h-6" />
      case "promo_code":
        return <Code className="w-6 h-6" />
      default:
        return <Target className="w-6 h-6" />
    }
  }

  const handleOpenPromoModal = (missionId: string) => {
    setPromoCodeModal({
      isOpen: true,
      missionId,
      code: "",
      submitting: false,
      error: "",
    })
  }

  const handleClosePromoModal = () => {
    setPromoCodeModal({
      isOpen: false,
      missionId: "",
      code: "",
      submitting: false,
      error: "",
    })
  }

  const handleSubmitPromoCode = async () => {
    if (!promoCodeModal.code.trim()) return

    setPromoCodeModal((prev) => ({ ...prev, submitting: true, error: "" }))

    try {
      const result = await onSubmitPromoCode(promoCodeModal.missionId, promoCodeModal.code)
      if (result.success) {
        handleClosePromoModal()
      } else {
        setPromoCodeModal((prev) => ({ ...prev, error: "Incorrect code. Try again." }))
      }
    } catch (error) {
      setPromoCodeModal((prev) => ({ ...prev, error: "Failed to submit code. Try again." }))
    } finally {
      setPromoCodeModal((prev) => ({ ...prev, submitting: false }))
    }
  }

  const handleReturnToMission = () => {
    const mission = missions[promoCodeModal.missionId]
    if (mission?.url) {
      window.open(mission.url, "_blank")
    }
  }

  const handleClaimMissionReward = (missionId: string) => {
    onClaimReward(missionId)
  }

  return (
    <div className="pb-4">
      {/* Enhanced Section Header */}
      <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-xl p-3 mb-4 shadow-lg shadow-green-500/20">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center text-xl shadow-lg">
            🎯
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-display">Missions & Rewards</h2>
            <p className="text-gray-300 text-xs">Complete tasks to earn UC</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-400 font-semibold">
                {sortedMissions.filter(([id]) => !userMissions[id]?.completed).length} Active Missions
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Mission Filters */}
      <div className="flex gap-1 mb-4 p-1 bg-black/30 backdrop-blur-md border border-gray-700/30 rounded-lg overflow-x-auto">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setCurrentFilter(filter.id)}
            className={`px-3 py-2 rounded-lg font-semibold text-xs whitespace-nowrap transition-all duration-300 flex items-center gap-1 ${
              currentFilter === filter.id
                ? "bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-md border border-green-500/50"
                : "text-gray-400 hover:text-white hover:bg-gray-800/30 border border-transparent"
            }`}
          >
            <span className="text-sm">{filter.icon}</span>
            {filter.label}
          </button>
        ))}
      </div>

      {/* Enhanced Missions List */}
      <div className="space-y-3">
        {sortedMissions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-7xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-white font-display mb-2">No Missions Available</h3>
            <p className="text-gray-400 text-base">Check back later for new missions!</p>
          </div>
        ) : (
          sortedMissions.map(([missionId, mission]) => {
            const userMission = userMissions[missionId] || {
              started: false,
              completed: false,
              claimed: false,
              currentCount: 0,
            }

            const progressPercentage = Math.min((userMission.currentCount / (mission.requiredCount || 1)) * 100, 100)

            let buttonContent = ""
            let buttonClass =
              "w-full font-bold py-3.5 px-5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            let buttonAction: (() => void) | undefined
            let isDisabled = false

            if (userMission.claimed) {
              buttonContent = "✅ Claimed"
              buttonClass += " bg-green-500/20 text-green-400 border border-green-500/30"
              isDisabled = true
            } else if (userMission.completed) {
              buttonContent = `🎁 Claim ${mission.reward} UC`
              buttonClass +=
                " bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white hover:scale-105"
              buttonAction = () => handleClaimMissionReward(missionId)
            } else if (userMission.started) {
              if (mission.type === "promo_code") {
                buttonContent = "🔐 Enter Code"
                buttonClass +=
                  " bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white hover:scale-105"
                buttonAction = () => handleOpenPromoModal(missionId)
              } else {
                buttonContent = "✅ Verify"
                buttonClass +=
                  " bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white hover:scale-105"
                buttonAction = () => onVerifyMission(missionId)
              }
            } else {
              buttonContent = "▶️ Start Mission"
              buttonClass +=
                " bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white hover:scale-105"
              buttonAction = () => onStartMission(missionId)
            }

            return (
              <div
                key={missionId}
                className={`bg-gradient-to-br from-black/30 to-gray-900/30 backdrop-blur-md border rounded-2xl p-5 transition-all duration-500 hover:shadow-xl ${
                  userMission.claimed
                    ? "border-green-500/40 shadow-green-500/10 opacity-75"
                    : userMission.completed
                      ? "border-green-500/40 shadow-green-500/10"
                      : userMission.started
                        ? "border-blue-500/40 shadow-blue-500/10"
                        : "border-gray-700/30 hover:border-green-500/40"
                }`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg">
                    {getMissionIcon(mission)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-white font-display truncate">{mission.title}</h3>
                      <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-3 py-0.5 rounded-lg text-xs font-bold shadow-md">
                        {mission.category}
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 mb-3 leading-relaxed">{mission.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-300 bg-black/30 px-3 py-1.5 rounded-lg border border-gray-700/30">
                        Progress: {userMission.currentCount}/{mission.requiredCount || 1}
                      </div>
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1.5 rounded-lg text-sm font-bold shadow-md animate-pulse">
                        💎 +{mission.reward} UC
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Progress Bar */}
                <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden mb-4 border border-gray-700/50 shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-1000 relative overflow-hidden"
                    style={{ width: `${progressPercentage}%` }}
                  >
                    <div className="absolute inset-0 bg-white/30 animate-pulse" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                  </div>
                </div>

                {/* Enhanced Action Button */}
                <button onClick={buttonAction} disabled={isDisabled} className={buttonClass}>
                  {buttonContent}
                </button>
              </div>
            )
          })
        )}
      </div>

      {/* Enhanced Promo Code Modal */}
      {promoCodeModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md mx-4 bg-gray-900/95 backdrop-blur-md border-2 border-purple-500/30 rounded-2xl shadow-xl shadow-purple-500/20">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center text-2xl">
                  🔐
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white font-display">Enter Promo Code</h2>
                  <p className="text-sm text-gray-400">Enter the code you found</p>
                </div>
              </div>
              <button
                onClick={handleClosePromoModal}
                className="w-10 h-10 bg-gray-700/20 hover:bg-red-500/20 border border-gray-700/30 hover:border-red-500/50 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-400 transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
                  Promo Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={promoCodeModal.code}
                    onChange={(e) => {
                      setPromoCodeModal((prev) => ({ ...prev, code: e.target.value, error: "" }))
                    }}
                    placeholder="Enter your promo code..."
                    className={`w-full bg-gray-800/50 border-2 ${
                      promoCodeModal.error ? "border-red-500" : "border-gray-700/50 focus:border-purple-500"
                    } rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none transition-all duration-200 text-lg font-mono tracking-wider`}
                    autoFocus
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400">
                    <Code className="w-5 h-5" />
                  </div>
                </div>
                {promoCodeModal.error && (
                  <div className="flex items-center gap-2 mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span className="text-sm text-red-400 font-semibold">{promoCodeModal.error}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={handleSubmitPromoCode}
                  disabled={!promoCodeModal.code.trim() || promoCodeModal.submitting}
                  className="w-full bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 disabled:from-gray-700 disabled:to-gray-800 text-white font-bold py-3.5 px-5 rounded-xl transition-all duration-200 hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  {promoCodeModal.submitting ? "Submitting..." : "Submit Code"}
                </button>

                <button
                  onClick={handleReturnToMission}
                  className="w-full bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 hover:text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 border border-blue-600/30 hover:border-blue-500/50 flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Return to Mission
                </button>

                <button
                  onClick={handleClosePromoModal}
                  className="w-full bg-gray-700/20 hover:bg-gray-700/40 text-gray-300 hover:text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 border border-gray-700/30 hover:border-gray-600/50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
