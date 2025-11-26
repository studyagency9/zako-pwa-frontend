"use client"
import { useAppContext } from "@/context/app-context"
import { Home, ListOrdered, User } from "lucide-react"

export default function BottomNav() {
  const { currentScreen, setCurrentScreen } = useAppContext()

  // Only show on main screens
  if (!['home', 'orders', 'profile'].includes(currentScreen)) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-[280px]">
      <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-full p-1.5 shadow-2xl flex justify-between items-center relative">
        
        {/* Active Indicator Background (optional, simplified here) */}
        
        <button 
          onClick={() => setCurrentScreen('home')}
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 rounded-full transition-all duration-300 ${currentScreen === 'home' ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
        >
           <Home size={20} strokeWidth={currentScreen === 'home' ? 2.5 : 2} fill={currentScreen === 'home' ? "currentColor" : "none"} />
           {currentScreen === 'home' && <span className="w-1 h-1 bg-white rounded-full mt-1 animate-in zoom-in" />}
        </button>

        <div className="w-px h-6 bg-white/10" />

        <button 
          onClick={() => setCurrentScreen('orders')}
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 rounded-full transition-all duration-300 ${currentScreen === 'orders' ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
        >
           <ListOrdered size={20} strokeWidth={currentScreen === 'orders' ? 2.5 : 2} />
           {currentScreen === 'orders' && <span className="w-1 h-1 bg-white rounded-full mt-1 animate-in zoom-in" />}
        </button>

        <div className="w-px h-6 bg-white/10" />

        <button 
          onClick={() => setCurrentScreen('profile')}
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 rounded-full transition-all duration-300 ${currentScreen === 'profile' ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
        >
           <User size={20} strokeWidth={currentScreen === 'profile' ? 2.5 : 2} />
           {currentScreen === 'profile' && <span className="w-1 h-1 bg-white rounded-full mt-1 animate-in zoom-in" />}
        </button>
      </div>
    </div>
  )
}
