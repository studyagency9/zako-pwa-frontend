"use client"

import { useState, useRef } from "react"
import { useAppContext } from "@/context/app-context"
import { ChevronLeft, Zap, Trash2, Plus, Minus, Shirt, ShoppingCart, Bike, Store, Camera, Calendar, X, Check, Info, Tag } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

// Custom SVG Icons for better UI
const IconTShirt = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z" />
  </svg>
)

const IconShirt = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z" />
    <path d="M12 4v10" />
  </svg>
)

const IconPants = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M6 2c0-.55.45-1 1-1h10c.55 0 1 .45 1 1v19c0 1.1-.9 2-2 2h-1a1 1 0 01-1-1v-6H9.5v6a1 1 0 01-1 1h-1c-1.1 0-2-.9-2-2V2z" />
  </svg>
)

const IconShorts = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 2c0-.55.45-1 1-1h14c.55 0 1 .45 1 1v11c0 1.1-.9 2-2 2h-2.5l-3.5-3-3.5 3H6c-1.1 0-2-.9-2-2V2z" />
  </svg>
)

const IconSheets = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 8h20" />
    <path d="M2 14h20" />
  </svg>
)

const IconCurtains = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M5 3v18" />
    <path d="M19 3v18" />
    <path d="M5 3h14" />
    <path d="M5 7c3 0 4 4 7 4s4-4 7-4" />
    <path d="M5 14c3 0 4 4 7 4s4-4 7-4" />
  </svg>
)

// Expanded Item Types with Weights (in kg) for Kilo estimation
const ITEM_TYPES = [
  // Vêtements
  { id: "tshirt", label: "T-Shirt", icon: IconTShirt, weight: 0.2, pricePiece: 500, category: "Vêtements" },
  { id: "shirt", label: "Chemise", icon: IconShirt, weight: 0.25, pricePiece: 600, category: "Vêtements" },
  { id: "pants", label: "Pantalon", icon: IconPants, weight: 0.5, pricePiece: 800, category: "Vêtements" },
  { id: "shorts", label: "Culotte", icon: IconShorts, weight: 0.3, pricePiece: 400, category: "Vêtements" },
  { id: "shoes", label: "Chaussure", icon: IconTShirt, weight: 0.5, pricePiece: 1000, category: "Vêtements" },
  { id: "wedding_dress", label: "Robe de mariage", icon: IconTShirt, weight: 1.0, pricePiece: 5000, category: "Vêtements" },
  { id: "evening_dress", label: "Robe de soirée", icon: IconTShirt, weight: 0.8, pricePiece: 3000, category: "Vêtements" },

  // Linge de maison
  { id: "sheets", label: "Draps", icon: IconSheets, weight: 0.8, pricePiece: 1000, category: "Linge de maison" },
  { id: "curtain_light", label: "Rideau (Léger)", icon: IconCurtains, weight: 0.5, pricePiece: 1500, category: "Linge de maison" },
  { id: "curtain_heavy", label: "Rideau (Lourd)", icon: IconCurtains, weight: 1.5, pricePiece: 2500, category: "Linge de maison" },
  { id: "pillowcase", label: "Taie d'oreiller", icon: IconSheets, weight: 0.2, pricePiece: 300, category: "Linge de maison" },
  { id: "chair_cover", label: "Housse de chaise", icon: IconTShirt, weight: 0.3, pricePiece: 700, category: "Linge de maison" },
  { id: "duvet", label: "Couette", icon: IconSheets, weight: 2.5, pricePiece: 3500, category: "Linge de maison" },
  { id: "tablecloth", label: "Nappe", icon: IconSheets, weight: 0.6, pricePiece: 1200, category: "Linge de maison" },
]

export default function Commande() {
  const {
    selectedPressing,
    addToCart,
    placeOrder,
    setCurrentScreen,
    addPoints,
  } = useAppContext()

  // Local state for the order form
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [collectMethod, setCollectMethod] = useState<"collect" | "delivery">("collect")
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0])
  const [activeCategory, setActiveCategory] = useState("Vêtements")
  const [photos, setPhotos] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isPlacing, setIsPlacing] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
    const [showRecap, setShowRecap] = useState(false)

  if (!selectedPressing) return null

  const pricingType = selectedPressing.pricingType as 'kilo' | 'piece'

  const displayedItems = ITEM_TYPES.filter(item => item.category === activeCategory)

  const handleQuantityChange = (itemId: string, delta: number) => {
    setQuantities(prev => {
      const current = prev[itemId] || 0
      const next = Math.max(0, current + delta)
      if (next === 0) {
        const { [itemId]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [itemId]: next }
    })
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const url = URL.createObjectURL(file)
      setPhotos([...photos, url])
    }
  }

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index))
  }

  // Calculations
  const totalItems = Object.values(quantities).reduce((a, b) => a + b, 0)
  
  const calculateTotal = () => {
    let total = 0
    let totalWeight = 0

    ITEM_TYPES.forEach(item => {
      const qty = quantities[item.id] || 0
      if (qty > 0) {
        if (pricingType === 'piece') {
          total += qty * (selectedPressing.pricePerPiece || item.pricePiece) 
        } else {
          // Kilo mode
          totalWeight += qty * item.weight
        }
      }
    })

    if (pricingType === 'kilo') {
      total = Math.max(1, totalWeight) * (selectedPressing.pricePerKilo || 0)
    }

    return { total, totalWeight }
  }

  const { total, totalWeight } = calculateTotal()

  const handleConfirmOrder = () => {
    setIsPlacing(true)
    // Simulate API call
    setTimeout(() => {
        placeOrder(collectMethod) 
        addPoints(Math.floor(total / 100))
        setIsPlacing(false)
        setShowConfetti(true)
        setTimeout(() => {
            setShowConfetti(false)
            setCurrentScreen("home")
        }, 2000)
    }, 1500)
  }

  if (showRecap) {
    return (
        <div className="fixed inset-0 w-full h-full bg-background z-[100] flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex-shrink-0 p-4 flex items-center gap-3 border-b bg-background/80 backdrop-blur-md z-10 shadow-sm">
                <button 
                    onClick={() => setShowRecap(false)} 
                    className="w-10 h-10 flex items-center justify-center hover:bg-muted rounded-full transition-colors active:scale-95"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="font-bold text-xl leading-none">Récapitulatif</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">Vérifiez avant de valider</p>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 pb-32 bg-muted/30">
                <div className="max-w-md mx-auto space-y-6">
                    
                    {/* Pressing Card */}
                    <div className="bg-card rounded-3xl border shadow-sm p-5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/50" />
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-2xl font-bold text-primary flex-shrink-0">
                                {selectedPressing.name[0]}
                            </div>
                            <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Votre commande chez</p>
                                <h2 className="font-bold text-xl leading-tight">{selectedPressing.name}</h2>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 mt-6">
                            <div className="bg-muted/50 rounded-xl p-3 flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" />
                                    Date prévue
                                </span>
                                <span className="font-bold text-sm">
                                    {format(new Date(orderDate), 'dd MMM yyyy', { locale: fr })}
                                </span>
                            </div>
                            <div className="bg-muted/50 rounded-xl p-3 flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                                    {collectMethod === 'collect' ? <Store className="w-3.5 h-3.5" /> : <Bike className="w-3.5 h-3.5" />}
                                    Mode
                                </span>
                                <span className="font-bold text-sm">
                                    {collectMethod === 'collect' ? 'Dépôt agence' : 'Livraison'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Items Breakdown */}
                    <div className="bg-card rounded-3xl border shadow-sm p-5">
                        <h3 className="font-bold text-lg mb-4 flex items-center justify-between">
                            <span>Détail des articles</span>
                            <span className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full font-bold">{totalItems} items</span>
                        </h3>
                        <div className="space-y-4">
                            {ITEM_TYPES.map(item => {
                                const qty = quantities[item.id] || 0
                                if (qty === 0) return null
                                return (
                                    <div key={item.id} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-lg text-muted-foreground">
                                                <item.icon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm">{item.label}</p>
                                                <p className="text-[10px] font-medium text-muted-foreground">
                                                    {pricingType === 'kilo' ? `~${item.weight}kg/u` : `${item.pricePiece} F/u`}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-medium text-muted-foreground">x{qty}</span>
                                            <span className="font-bold text-sm min-w-[60px] text-right">
                                                {pricingType === 'piece' 
                                                    ? `${item.pricePiece * qty} F`
                                                    : `~${(item.weight * qty).toFixed(1)} kg`
                                                }
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Dashed Separator */}
                        <div className="my-6 relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t-2 border-dashed border-muted-foreground/20" />
                            </div>
                        </div>

                        {/* Total Section */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                                <span>Sous-total estimé</span>
                                <span className="font-medium">{Math.round(total)} F</span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-green-600">
                                <span>Frais de service</span>
                                <span className="font-bold">Offert</span>
                            </div>
                            <div className="flex justify-between items-center mt-4 pt-2">
                                <span className="font-bold text-lg">Total à payer</span>
                                <div className="text-right">
                                    <span className="block text-2xl font-black text-primary">{Math.round(total)} F</span>
                                    {pricingType === 'kilo' && (
                                        <span className="text-[10px] text-orange-600 font-bold bg-orange-50 px-1.5 py-0.5 rounded">
                                            Estimation (~{totalWeight.toFixed(1)} kg)
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Photos Preview */}
                    {photos.length > 0 && (
                        <div className="bg-card rounded-3xl border shadow-sm p-5">
                            <h3 className="font-bold text-sm mb-3 text-muted-foreground uppercase tracking-wider">Photos jointes</h3>
                            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                                {photos.map((url, idx) => (
                                    <div key={idx} className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border shadow-sm">
                                        <img src={url} alt="vêtement" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Fixed Footer Button */}
            <div className="flex-shrink-0 p-4 bg-background/80 backdrop-blur-xl border-t shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20">
                <button 
                    onClick={handleConfirmOrder}
                    disabled={isPlacing}
                    className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold text-lg shadow-lg shadow-primary/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    {isPlacing ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Traitement...</span>
                        </>
                    ) : (
                        <>
                            <span>Confirmer la commande</span>
                            <ChevronLeft className="w-5 h-5 rotate-180" />
                        </>
                    )}
                </button>
            </div>

            {showConfetti && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 animate-in fade-in duration-300">
                    <div className="bg-background w-full max-w-sm p-8 rounded-[2rem] shadow-2xl flex flex-col items-center animate-in zoom-in duration-300 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-600" />
                        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                            <Check className="w-12 h-12 text-green-600" strokeWidth={3} />
                        </div>
                        <h2 className="text-2xl font-black mb-2 text-foreground">Commande Reçue !</h2>
                        <p className="text-muted-foreground mb-8 leading-relaxed">
                            Votre demande a été transmise à <span className="font-bold text-foreground">{selectedPressing.name}</span>. Vous recevrez une notification dès validation.
                        </p>
                        <div className="w-full bg-muted/50 rounded-xl p-4 text-sm font-bold text-muted-foreground flex items-center justify-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                            Redirection...
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
  }

  return (
    <div className="w-full h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between z-10">
        <button onClick={() => setCurrentScreen("home")} className="w-10 h-10 flex items-center justify-center hover:bg-muted rounded-full transition-colors -ml-2">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Commande chez</p>
            <h1 className="text-base font-bold text-foreground leading-tight">{selectedPressing.name}</h1>
        </div>
        <div className="w-10 flex justify-end">
             {/* Placeholder for balance spacing */}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-5 space-y-8 pb-32">
        
        {/* Top Info Banner */}
        <div className={`p-4 rounded-2xl flex items-start gap-3 ${pricingType === 'kilo' ? 'bg-orange-50 text-orange-800' : 'bg-blue-50 text-blue-800'}`}>
            <div className={`p-2 rounded-lg ${pricingType === 'kilo' ? 'bg-orange-100' : 'bg-blue-100'}`}>
                {pricingType === 'kilo' ? <Info className="w-5 h-5" /> : <Tag className="w-5 h-5" />}
            </div>
            <div>
                <h3 className="font-bold text-sm mb-0.5">{pricingType === 'kilo' ? 'Tarification au Poids' : 'Tarification à la Pièce'}</h3>
                <p className="text-xs opacity-80 leading-relaxed">
                    {pricingType === 'kilo' 
                        ? "Le prix est calculé selon le poids total. Une estimation est fournie ici." 
                        : "Le prix est fixe par article selon la grille tarifaire du pressing."}
                </p>
            </div>
        </div>

        {/* Date Picker */}
        <section>
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full"></span>
                Date de collecte
            </h2>
            <div className="relative">
                <input 
                    type="date" 
                    value={orderDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setOrderDate(e.target.value)}
                    className="w-full bg-card border border-border shadow-sm p-4 pl-12 rounded-2xl font-medium text-lg outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </div>
        </section>

        {/* Collection Method */}
        <section>
             <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full"></span>
                Mode de remise
            </h2>
            <div className="grid grid-cols-2 gap-4">
                <button
                onClick={() => setCollectMethod("collect")}
                className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${collectMethod === "collect" ? "border-primary bg-primary/5 shadow-md shadow-primary/10" : "border-transparent bg-muted/50 hover:bg-muted"}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${collectMethod === "collect" ? "bg-primary text-white" : "bg-background text-muted-foreground"}`}>
                    <Store className="w-6 h-6" />
                </div>
                <span className={`font-bold text-sm ${collectMethod === "collect" ? "text-primary" : "text-muted-foreground"}`}>Je dépose</span>
                </button>
                
                <button
                onClick={() => setCollectMethod("delivery")}
                className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${collectMethod === "delivery" ? "border-primary bg-primary/5 shadow-md shadow-primary/10" : "border-transparent bg-muted/50 hover:bg-muted"}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${collectMethod === "delivery" ? "bg-primary text-white" : "bg-background text-muted-foreground"}`}>
                    <Bike className="w-6 h-6" />
                </div>
                <span className={`font-bold text-sm ${collectMethod === "delivery" ? "text-primary" : "text-muted-foreground"}`}>On récupère</span>
                </button>
            </div>
        </section>

        {/* Items Selection */}
        <section>
             <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full"></span>
                Vos articles
            </h2>
            <div className="flex gap-2 mb-6 border-b">
                {["Vêtements", "Linge de maison"].map(category => (
                  <button 
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`pb-2 px-1 font-semibold transition-colors border-b-2 ${activeCategory === category ? 'text-primary border-primary' : 'text-muted-foreground border-transparent hover:text-foreground'}`}>
                    {category}
                  </button>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
                {displayedItems.map((item) => {
                    const qty = quantities[item.id] || 0
                    return (
                        <div key={item.id} className={`bg-card border rounded-2xl p-3 flex flex-col justify-between transition-all duration-300 ${qty > 0 ? 'border-primary/50 shadow-lg shadow-primary/10' : 'border-border shadow-sm'}`}>
                            <div className="flex flex-col items-center text-center">
                                <div className={`w-20 h-20 mb-3 rounded-full flex items-center justify-center text-3xl transition-colors ${qty > 0 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                    <item.icon className="w-10 h-10" />
                                </div>
                                <p className="font-bold text-sm text-foreground leading-tight h-10 flex items-center justify-center">{item.label}</p>
                                <p className="text-xs font-medium text-muted-foreground mt-1">
                                    {pricingType === 'piece' 
                                        ? `${item.pricePiece} F / pièce` 
                                        : `~${item.weight} kg / unité`
                                    }
                                </p>
                            </div>
                            <div className="flex items-center justify-center gap-3 bg-muted/50 rounded-full p-1 mt-4">
                                <button 
                                    onClick={() => handleQuantityChange(item.id, -1)}
                                    disabled={qty === 0}
                                    className="w-8 h-8 rounded-full bg-background shadow-sm flex items-center justify-center disabled:opacity-30 disabled:shadow-none active:scale-95 transition-all text-foreground"
                                >
                                    <Minus size={14} strokeWidth={3} />
                                </button>
                                <span className="w-6 text-center font-bold text-lg">{qty}</span>
                                <button 
                                    onClick={() => handleQuantityChange(item.id, 1)}
                                    className="w-8 h-8 rounded-full bg-primary text-primary-foreground shadow-sm flex items-center justify-center active:scale-95 transition-all"
                                >
                                    <Plus size={14} strokeWidth={3} />
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>

        {/* Photo Upload */}
        <section>
             <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full"></span>
                Photos (Optionnel)
            </h2>
            
            <div className="grid grid-cols-3 gap-3">
                 <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 flex flex-col items-center justify-center gap-2 text-primary hover:bg-primary/10 transition-colors group"
                >
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm group-active:scale-90 transition-transform">
                        <Camera size={20} />
                    </div>
                    <span className="text-xs font-bold">Ajouter</span>
                </button>
                
                {photos.map((url, idx) => (
                    <div key={idx} className="aspect-square rounded-2xl relative group overflow-hidden border shadow-sm">
                        <img src={url} alt="upload" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end p-2">
                            <button 
                                onClick={() => removePhoto(idx)}
                                className="w-6 h-6 bg-white/90 text-red-500 rounded-full flex items-center justify-center shadow-sm backdrop-blur-sm"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </div>
                ))}
                 <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handlePhotoUpload} 
                />
            </div>
        </section>
      </main>

      {/* Bottom Action Bar */}
      <footer className="flex-shrink-0 bg-background/80 backdrop-blur-xl border-t border-border/50 p-4 pb-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20">
        <div className="flex justify-between items-end mb-4 px-1">
            <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Total estimé</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-primary tracking-tight">{Math.round(total)}</span>
                    <span className="text-sm font-bold text-muted-foreground">FCFA</span>
                </div>
                {pricingType === 'kilo' && <p className="text-xs text-orange-600 font-medium mt-1">~{totalWeight.toFixed(1)} kg</p>}
            </div>
            <div className="text-right">
                 <div className="inline-flex items-center justify-center px-3 py-1 bg-muted rounded-full text-xs font-bold">
                    {totalItems} article{totalItems > 1 ? 's' : ''}
                 </div>
            </div>
        </div>
        <button
            onClick={() => setShowRecap(true)}
            disabled={totalItems === 0}
            className="w-full bg-gradient-to-r from-primary to-primary/90 text-primary-foreground py-4 rounded-2xl font-bold text-lg shadow-lg shadow-primary/25 disabled:opacity-50 disabled:shadow-none active:scale-[0.98] transition-all"
        >
            Vérifier ma commande
        </button>
      </footer>
    </div>
  )
}
