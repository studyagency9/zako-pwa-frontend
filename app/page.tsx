"use client"
import Onboarding from "@/components/screens/onboarding"
import Home from "@/components/screens/home"
import Commande from "@/components/screens/commande"
import Tracking from "@/components/screens/tracking"
import Orders from "@/components/screens/orders"
import Profile from "@/components/screens/profile"
import OrderDetails from "@/components/screens/order-details"
import BottomNav from "@/components/bottom-nav"
import { AppProvider, useAppContext } from "@/context/app-context"

function AppContent() {
  const { currentScreen, user } = useAppContext()

  return (
    <main className="w-full h-screen bg-background overflow-hidden flex flex-col">
      <div className="flex-1 overflow-hidden relative">
        {!user ? (
            <Onboarding />
        ) : currentScreen === "home" ? (
            <Home />
        ) : currentScreen === "commande" ? (
            <Commande />
        ) : currentScreen === "tracking" ? (
            <Tracking />
        ) : currentScreen === "orders" ? (
            <Orders />
        ) : currentScreen === "profile" ? (
            <Profile />
        ) : currentScreen === "order-details" ? (
            <OrderDetails />
        ) : (
            <Home />
        )}
      </div>
      {user && <BottomNav />}
    </main>
  )
}

export default function Page() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
