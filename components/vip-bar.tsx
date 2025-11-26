"use client"

import { useAppContext } from "@/context/app-context"

export default function VIPBar() {
  const { user } = useAppContext()

  if (!user) return null

  const nextLevelPoints = (user.vipLevel + 1) * 500
  const progressPercentage = ((user.points % 500) / 500) * 100

  return (
    <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-primary/20 p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="text-xl">👑</div>
          <div>
            <p className="text-xs text-muted-foreground">VIP Level {user.vipLevel}</p>
            <p className="text-sm font-bold text-foreground">{user.points} points</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Prochain niveau</p>
          <p className="text-sm font-semibold text-primary">{nextLevelPoints - user.points} pts</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  )
}
