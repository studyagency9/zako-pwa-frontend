"use client"

import { useState, useEffect, memo } from "react"
import { useDebounce } from "@/hooks/use-debounce"
import { useAppContext } from "@/context/app-context"
import VIPBar from "@/components/vip-bar"
import PressingCard from "@/components/pressing-card"
import { Search, Home as HomeIcon, MapPin, Scale, Tag, User, CircleUser } from "lucide-react"
import dynamic from 'next/dynamic'
import { Drawer } from 'vaul';

const MemoizedMapView = memo(dynamic(() => import('@/components/map-view'), { ssr: false }))

const MOCK_PRESSINGS = [
  {
    id: "1",
    name: "Zako Express",
    rating: 4.9,
    distance: 0.5,
    pricePerKilo: 2500,
    pricePerPiece: 500,
    delivery: true,
    pricingType: "both" as const,
    phone: "699123456",
    coords: { lat: 4.052, lng: 9.704 },
  },
  {
    id: "2",
    name: "Lessive Premium",
    rating: 4.8,
    distance: 1.2,
    pricePerKilo: 2800,
    pricePerPiece: 600,
    delivery: false,
    pricingType: "kilo" as const,
    phone: "678234567",
    coords: { lat: 4.06, lng: 9.71 },
  },
  {
    id: "3",
    name: "Pressing Central",
    rating: 4.7,
    distance: 1.8,
    pricePerKilo: 2300,
    pricePerPiece: 450,
    delivery: true,
    pricingType: "piece" as const,
    phone: "697345678",
    coords: { lat: 4.045, lng: 9.715 },
  },
  {
    id: "4",
    name: "Quick Wash",
    rating: 4.6,
    distance: 2.1,
    pricePerKilo: 2400,
    pricePerPiece: 480,
    delivery: false,
    pricingType: "both" as const,
    phone: "656456789",
    coords: { lat: 4.055, lng: 9.69 },
  },
]

export default function Home() {
  const { setCurrentScreen, setSelectedPressing, user } = useAppContext()
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    delivery: null as boolean | null,
    pricingType: null as 'kilo' | 'piece' | null,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(true);
  const [isUserDrawerOpen, setIsUserDrawerOpen] = useState(false);
  const [activeSnap, setActiveSnap] = useState<number | string | null>(0.5);
  const [triggerRecenter, setTriggerRecenter] = useState<number>(0);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
        
  const filteredPressings = MOCK_PRESSINGS.filter((p) => {
    const searchMatch = p.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
    const deliveryMatch = filters.delivery === null || p.delivery === filters.delivery;
    const pricingMatch = filters.pricingType === null || p.pricingType === filters.pricingType || p.pricingType === 'both';
    return searchMatch && deliveryMatch && pricingMatch;
  });

  const handleSelectPressing = (pressing: (typeof MOCK_PRESSINGS)[0]) => {
    setSelectedPressing(pressing)
    setCurrentScreen("commande")
  }

  const handleRecenter = () => {
    setTriggerRecenter(prev => prev + 1);
  };

  return (
    <div className="w-full h-screen bg-background flex flex-col relative">
      {/* Map Background */}
      <div className="absolute inset-0 z-0">
        <MemoizedMapView 
          pressings={MOCK_PRESSINGS} 
          hoveredPressingId={null} 
          triggerRecenter={triggerRecenter} 
        />
      </div>

      {/* Top UI Overlay */}
      <div className="absolute top-0 left-0 right-0 p-4 z-10 flex justify-between items-start pointer-events-none">
        {/* Brand */}
        <div className="pointer-events-auto">
            <div className="bg-background/90 px-6 py-2 rounded-full shadow-sm border border-border/50">
                <span className="font-black text-2xl tracking-tighter text-primary">Zako</span>
            </div>
        </div>

        {/* User & Location */}
        <div className="flex flex-col gap-3 pointer-events-auto">
            {/* Profile */}
            <button onClick={() => setIsUserDrawerOpen(true)} className="relative w-12 h-12 rounded-full bg-background/90 shadow-sm border border-border/50 flex items-center justify-center overflow-hidden active:scale-95 transition-transform">
                {user ? (
                     <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 36 36">
                          <circle
                            className="text-muted/20"
                            strokeWidth="2"
                            stroke="currentColor"
                            fill="transparent"
                            r="16"
                            cx="18"
                            cy="18"
                          />
                          <circle
                            className="text-primary"
                            strokeWidth="2"
                            strokeDasharray={`${(user.points % 500) / 5 * 100 / 100 * 100.5}, 100.5`}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="16"
                            cx="18"
                            cy="18"
                            style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                          />
                        </svg>
                        <span className="relative">{user.firstName?.[0] || 'U'}</span>
                     </div>
                ) : (
                    <User className="w-5 h-5 text-muted-foreground" />
                )}
            </button>
            
            {/* Location Indicator */}
            <button onClick={handleRecenter} className="w-11 h-11 rounded-full bg-background/90 shadow-sm border border-border/50 flex items-center justify-center text-primary active:scale-95 transition-transform">
                <MapPin className="w-5 h-5" />
            </button>
        </div>
      </div>

      {/* Search Bar */}
      
      {/* Bottom Sheet */}
      <Drawer.Root
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        snapPoints={[0.9, 0.5, 0.15]}
        activeSnapPoint={activeSnap}
        setActiveSnapPoint={setActiveSnap}
        dismissible={false}
        modal={false}
      >
                      <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 hidden" />
          <Drawer.Content className="bg-background flex flex-col rounded-t-[10px] fixed bottom-0 left-0 right-0 z-20 h-full max-h-[97%] outline-none shadow-xl transform-gpu will-change-transform">
            <div className="bg-background rounded-t-[10px] flex flex-col h-full">
              {/* Drag Handle Area */}
              <div className="w-full flex items-center justify-center pt-4 pb-2 cursor-grab touch-none">
                <div className="w-12 h-1.5 rounded-full bg-muted-foreground" />
              </div>
              
              <div className="px-4 pb-4 flex flex-col flex-1 min-h-0">
                <div className="flex-shrink-0">
                    <Drawer.Title className="font-bold text-2xl mb-4">Pressings à Proches</Drawer.Title>
                    <Drawer.Description className="sr-only">Liste des pressings disponibles à proximité</Drawer.Description>
                    <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Rechercher un pressing ou un service..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-muted border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    </div>
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
                    <button onClick={() => setFilters({ ...filters, delivery: filters.delivery === true ? null : true })} className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition-colors ${filters.delivery === true ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        <HomeIcon size={16} /> Livraison
                    </button>
                    <button onClick={() => setFilters({ ...filters, delivery: filters.delivery === false ? null : false })} className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition-colors ${filters.delivery === false ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        <MapPin size={16} /> À récupérer
                    </button>
                    <button onClick={() => setFilters({ ...filters, pricingType: filters.pricingType === 'kilo' ? null : 'kilo' })} className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition-colors ${filters.pricingType === 'kilo' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        <Scale size={16} /> Au Kilo
                    </button>
                    <button className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full bg-muted text-muted-foreground`}>
                        <Tag size={16} /> Prix bas
                    </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto pb-24">
                  <div className="space-y-4">
                    {filteredPressings.map((pressing) => (
                        <div key={pressing.id}>
                        <PressingCard pressing={pressing} onSelect={() => handleSelectPressing(pressing)} />
                        </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      {/* User Info Drawer */}
      <Drawer.Root open={isUserDrawerOpen} onOpenChange={setIsUserDrawerOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="bg-background flex flex-col rounded-t-[10px] fixed bottom-0 left-0 right-0 z-50 max-h-[96%] outline-none">
            <div className="p-4 bg-background rounded-t-[10px] flex-1">
              <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-8" />
              <Drawer.Title className="sr-only">Profil Utilisateur</Drawer.Title>
              {user && (
                <div className="max-w-md mx-auto">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold border-2 border-primary/20">
                      {user.firstName?.[0]}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{user.firstName} {user.lastName}</h2>
                      <p className="text-muted-foreground">{user.phone}</p>
                    </div>
                  </div>

                  <div className="bg-card p-4 rounded-2xl border shadow-sm mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold">Niveau VIP {user.vipLevel}</h3>
                      <span className="font-bold text-yellow-500">{user.points} points</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${(user.points % 500) / 5}%` }}></div>
                    </div>
                  </div>

                  <div className="bg-card p-4 rounded-2xl border shadow-sm">
                    <h3 className="font-bold mb-2">Lien de parrainage</h3>
                    <div className="flex items-center gap-2 bg-muted p-2 rounded-lg">
                      <input type="text" readOnly value={user.referralCode} className="flex-1 bg-transparent px-2 text-sm font-mono" />
                      <button onClick={() => navigator.clipboard.writeText(user.referralCode)} className="w-9 h-9 flex-shrink-0 rounded-md flex items-center justify-center bg-primary text-primary-foreground">
                        <User size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
}
