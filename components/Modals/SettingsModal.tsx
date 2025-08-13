"use client"

import type { User } from "@/types"
import { X, Volume2, VolumeX, Smartphone, Bell, BellOff } from "lucide-react"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  user: User
  onUpdateSettings: (settings: Partial<User["settings"]>) => void
}

export const SettingsModal = ({ isOpen, onClose, user, onUpdateSettings }: SettingsModalProps) => {
  if (!isOpen) return null

  const toggleSetting = (setting: keyof User["settings"]) => {
    onUpdateSettings({
      [setting]: !user.settings[setting],
    })
  }

  const settings = [
    {
      id: "sound" as const,
      title: "Sound Effects",
      description: "Enable or disable game sounds",
      icon: user.settings.sound ? Volume2 : VolumeX,
      enabled: user.settings.sound,
    },
    {
      id: "vibration" as const,
      title: "Vibration",
      description: "Enable haptic feedback",
      icon: Smartphone,
      enabled: user.settings.vibration,
    },
    {
      id: "notifications" as const,
      title: "Notifications",
      description: "Receive game notifications",
      icon: user.settings.notifications ? Bell : BellOff,
      enabled: user.settings.notifications,
    },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 bg-gray-900/95 backdrop-blur-md border-2 border-green-500/30 rounded-2xl shadow-xl shadow-green-500/20">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center text-2xl">
              ⚙️
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-display">Settings</h2>
              <p className="text-sm text-gray-400">Customize your gaming experience</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-gray-700/20 hover:bg-red-500/20 border border-gray-700/30 hover:border-red-500/50 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-400 transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings List */}
        <div className="p-6 space-y-4">
          {settings.map((setting) => {
            const Icon = setting.icon

            return (
              <div
                key={setting.id}
                className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-gray-700/20 hover:border-green-500/30 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center text-white">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">{setting.title}</div>
                    <div className="text-sm text-gray-400">{setting.description}</div>
                  </div>
                </div>

                <button
                  onClick={() => toggleSetting(setting.id)}
                  className={`w-14 h-8 rounded-full border-2 transition-all duration-200 relative ${
                    setting.enabled
                      ? "bg-gradient-to-r from-green-400 to-blue-500 border-green-500/50"
                      : "bg-gray-700/20 border-gray-700/50"
                  }`}
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-200 absolute top-0.5 ${
                      setting.enabled ? "left-7" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
