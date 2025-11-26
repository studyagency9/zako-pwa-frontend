"use client"

import { useAppContext } from "@/context/app-context"
import { ChevronLeft, Package, Calendar, Tag, Camera, CheckCircle, Truck, Clock } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

const STATUS_STEPS = [
  { status: "accepted", label: "Acceptée" },
  { status: "washing", label: "En lavage" },
  { status: "ready", label: "Prête" },
  { status: "delivered", label: "Livrée" },
];

export default function OrderDetails() {
  const { selectedOrder, setCurrentScreen } = useAppContext()

  if (!selectedOrder) return null

  const currentStatusIndex = STATUS_STEPS.findIndex(step => step.status === selectedOrder.status);

  return (
    <div className="w-full h-screen bg-muted/30 flex flex-col animate-in slide-in-from-right duration-300">
      <header className="flex-shrink-0 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-4 z-10">
        <button onClick={() => setCurrentScreen("orders")} className="w-10 h-10 flex items-center justify-center hover:bg-muted rounded-full transition-colors -ml-2">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-foreground">Commande #{selectedOrder.id.slice(-4)}</h1>
          <p className="text-xs text-muted-foreground">chez {selectedOrder.pressingName}</p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Status Timeline */}
        <div className="bg-card p-6 rounded-3xl border shadow-sm">
          <h3 className="font-bold text-lg mb-6">Suivi de votre commande</h3>
          <div className="flex justify-between items-start">
            {STATUS_STEPS.map((step, index) => (
              <div key={step.status} className="flex flex-col items-center relative flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${index <= currentStatusIndex ? 'bg-primary border-primary text-white' : 'bg-muted border-border'}`}>
                  {index <= currentStatusIndex ? <CheckCircle size={20} /> : <Clock size={20} />}
                </div>
                <p className={`mt-2 text-xs font-bold ${index <= currentStatusIndex ? 'text-primary' : 'text-muted-foreground'}`}>{step.label}</p>
                {index < STATUS_STEPS.length - 1 && (
                  <div className="absolute top-5 left-1/2 w-full h-0.5 bg-border">
                    <div className="h-full bg-primary" style={{ width: `${index < currentStatusIndex ? '100%' : '0%'}` }}></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Items & Total */}
        <div className="bg-card p-6 rounded-3xl border shadow-sm">
          <h3 className="font-bold text-lg mb-4">Résumé des articles</h3>
          <div className="space-y-3">
            {selectedOrder.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <p className="text-muted-foreground"><span className="font-semibold text-foreground">{item.quantity}x</span> {item.type}</p>
                <p className="font-semibold">{item.quantity * item.price} F</p>
              </div>
            ))}
          </div>
          <div className="border-t border-dashed my-4" />
          <div className="flex justify-between items-center font-bold text-xl">
            <p>Total Payé</p>
            <p className="text-primary">{selectedOrder.total} F</p>
          </div>
        </div>

        {/* Photos */}
        {selectedOrder.photos && selectedOrder.photos.length > 0 && (
          <div className="bg-card p-6 rounded-3xl border shadow-sm">
            <h3 className="font-bold text-lg mb-4">Photos de la commande</h3>
            <div className="grid grid-cols-3 gap-4">
              {selectedOrder.photos.map((photo, index) => (
                <div key={index} className="aspect-square rounded-xl overflow-hidden border-2 border-border">
                  <img src={photo} alt={`photo-${index}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
