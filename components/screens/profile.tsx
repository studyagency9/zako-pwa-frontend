"use client"

import { useAppContext } from "@/context/app-context"
import { ChevronLeft, LogOut, User, Award, Star, Copy, Check } from "lucide-react"
import { useState } from "react"

const InfoRow = ({ label, value }: { label: string, value: string }) => (
  <div>
    <p className="text-sm font-medium text-muted-foreground">{label}</p>
    <p className="font-semibold text-foreground">{value}</p>
  </div>
);

export default function Profile() {
  const { user, setUser, setCurrentScreen } = useAppContext()
  const [copied, setCopied] = useState(false)

  if (!user) return null

  const handleLogout = () => {
    localStorage.removeItem("zako-user")
    setUser(null)
    setCurrentScreen("onboarding")
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(user.referralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const vipProgress = (user.points % 500) / 5

  return (
    <div className="w-full h-screen bg-background flex flex-col animate-in slide-in-from-right duration-300">
      <header className="flex-shrink-0 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-4 z-10">
        <button onClick={() => setCurrentScreen("home")} className="w-10 h-10 flex items-center justify-center hover:bg-muted rounded-full transition-colors -ml-2">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Profil</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* User Info Card */}
        <div className="bg-card p-6 rounded-3xl border shadow-sm flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-4xl font-bold mb-4 border-4 border-background ring-2 ring-primary">
            {user.firstName?.[0]}
          </div>
          <div className="w-full text-left mt-6 space-y-4">
            <InfoRow label="Nom complet" value={`${user.firstName} ${user.lastName}`} />
            <InfoRow label="Téléphone" value={user.phone} />
            {user.email && <InfoRow label="Email" value={user.email} />}
          </div>
        </div>

        {/* VIP Status Card */}
        <div className="bg-card p-6 rounded-3xl border shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">Niveau VIP</h3>
            <span className="flex items-center gap-1.5 font-bold text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full text-sm">
              <Award size={16} />
              Niveau {user.vipLevel}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2.5 mb-2">
            <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${vipProgress}%` }}></div>
          </div>
          <div className="flex justify-between text-xs font-medium text-muted-foreground">
            <span>{user.points % 500} / 500 points</span>
            <span>Prochain niveau</span>
          </div>
          <div className="mt-4 pt-4 border-t border-dashed flex justify-between items-center">
            <span className="font-semibold">Total des points</span>
            <span className="font-bold text-lg text-primary flex items-center gap-2">{user.points} <Star size={16} /></span>
          </div>
        </div>

        {/* Referral Card */}
        <div className="bg-card p-6 rounded-3xl border shadow-sm">
          <h3 className="font-bold text-lg mb-3">Lien de parrainage</h3>
          <p className="text-sm text-muted-foreground mb-4">Partagez ce lien et gagnez des points pour chaque ami qui s'inscrit !</p>
          <div className="flex items-center gap-2 bg-muted p-2 rounded-xl">
            <input type="text" readOnly value={user.referralCode} className="flex-1 bg-transparent px-2 text-sm font-mono" />
            <button onClick={handleCopy} className={`w-10 h-10 flex-shrink-0 rounded-lg flex items-center justify-center transition-colors ${copied ? 'bg-green-500 text-white' : 'bg-primary text-primary-foreground'}`}>
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 py-3 text-red-500 font-semibold bg-red-500/10 rounded-xl hover:bg-red-500/20 transition-colors">
          <LogOut size={18} />
          Déconnexion
        </button>
      </main>
    </div>
  )
}
