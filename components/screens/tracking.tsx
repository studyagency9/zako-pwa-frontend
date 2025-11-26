"use client"

import { useAppContext } from "@/context/app-context"
import { ChevronLeft, MessageCircle, Bell, Hourglass, CheckCircle2, WashingMachine, PackageCheck, PartyPopper, Phone } from "lucide-react"
import { useState, useEffect } from "react"
import { getWhatsAppLink, formatPhoneNumber } from "@/utils/notifications"

const STATUS_STEPS = [
  { status: "pending" as const, label: "En attente", icon: <Hourglass size={20} /> },
  { status: "accepted" as const, label: "Acceptée", icon: <CheckCircle2 size={20} /> },
  { status: "washing" as const, label: "En lavage", icon: <WashingMachine size={20} /> },
  { status: "ready" as const, label: "Prête", icon: <PackageCheck size={20} /> },
  { status: "delivered" as const, label: "Livrée", icon: <PartyPopper size={20} /> },
]

export default function Tracking() {
  const { user, setCurrentScreen, sendOrderNotification } = useAppContext()
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0)
  const [autoProgress, setAutoProgress] = useState(true)
  const [notificationSent, setNotificationSent] = useState(false)

  const latestOrder = user?.orders?.[0]

  useEffect(() => {
    if (!autoProgress || !latestOrder) return

    const statuses: (typeof latestOrder.status)[] = ["pending", "accepted", "washing", "ready", "delivered"]
    const currentIndex = statuses.indexOf(latestOrder.status)

    if (currentIndex < statuses.length - 1) {
      const timer = setTimeout(() => {
        // Simulate status update
        latestOrder.status = statuses[currentIndex + 1] as any
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [autoProgress, latestOrder])

  if (!latestOrder) {
    return (
      <div className="w-full h-screen bg-background flex flex-col items-center justify-center">
        <p className="text-muted-foreground mb-4">Aucune commande</p>
        <button
          onClick={() => setCurrentScreen("home")}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg"
        >
          Retour à l'accueil
        </button>
      </div>
    )
  }

  const currentStatusIndex = STATUS_STEPS.findIndex((s) => s.status === latestOrder.status)

  const handleWhatsAppContact = () => {
    if (!latestOrder.pressingPhone) return
    const phone = formatPhoneNumber(latestOrder.pressingPhone)
    const message = `Bonjour, je voudrais des informations sur ma commande #${latestOrder.id.toUpperCase()}`
    window.open(getWhatsAppLink(phone, message), "_blank")
  }

  const handleEnableNotifications = () => {
    sendOrderNotification("Vous recevrez une notification lors de chaque mise à jour de commande!")
    setNotificationSent(true)
    setTimeout(() => setNotificationSent(false), 3000)
  }

  return (
    <div className="w-full min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border p-4 flex items-center gap-3">
        <button onClick={() => setCurrentScreen("home")} className="p-2 hover:bg-muted rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Suivi de commande</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-32">
        {/* Order Info Card */}
        <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Commande #{latestOrder.id.substring(0, 7).toUpperCase()}</p>
            <p className="text-lg font-bold text-foreground">{latestOrder.pressingName}</p>
          </div>
          <div className="flex justify-between items-center bg-muted p-3 rounded-lg">
            <span className="font-semibold text-foreground">Total</span>
            <span className="font-bold text-lg text-primary">{latestOrder.total}F</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-2">
          {STATUS_STEPS.map((step, idx) => {
            const isActive = idx === currentStatusIndex
            const isCompleted = idx < currentStatusIndex
            return (
              <div key={step.status} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted ? 'bg-primary text-primary-foreground' : isActive ? 'bg-primary text-primary-foreground animate-pulse' : 'bg-muted text-muted-foreground'}`}>
                    {step.icon}
                  </div>
                  {idx < STATUS_STEPS.length - 1 && (
                    <div className={`w-0.5 h-full transition-all duration-300 ${isCompleted ? 'bg-primary' : 'bg-border'}`} />
                  )}
                </div>
                <div className={`py-2 transition-all duration-300 ${isActive || isCompleted ? 'opacity-100' : 'opacity-50'}`}>
                  <p className={`font-semibold ${isActive ? 'text-primary' : 'text-foreground'}`}>{step.label}</p>
                  {isActive && <p className="text-sm text-muted-foreground">En cours...</p>}
                  {isCompleted && <p className="text-sm text-muted-foreground">Terminé</p>}
                </div>
              </div>
            )
          })}
        </div>
      </main>

      {/* Footer Actions */}
      <footer className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-border p-4">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleEnableNotifications}
            className="w-full bg-secondary text-secondary-foreground py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-secondary/90 transition-all active:scale-95 disabled:opacity-50"
            disabled={notificationSent}
          >
            <Bell className="w-5 h-5" />
            {notificationSent ? 'Activées' : 'Notifications'}
          </button>
          <button
            onClick={handleWhatsAppContact}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-95"
          >
            <Phone className="w-5 h-5" />
            <span>Aide</span>
          </button>
        </div>
      </footer>
    </div>
  )
}
