"use client"

import { useAppContext } from "@/context/app-context"
import { Package, Clock, CheckCircle, Truck, Home, Calendar, ChevronRight } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

const calculateProgress = (start: string, end: string) => {
  const startDate = new Date(start).getTime();
  const endDate = new Date(end).getTime();
  const now = new Date().getTime();
  if (now >= endDate) return 100;
  if (now <= startDate) return 0;
  return ((now - startDate) / (endDate - startDate)) * 100;
};

export default function Orders() {
  const { user, setCurrentScreen, setSelectedOrder } = useAppContext()
  
  const activeOrders = user?.orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled') || []
  const pastOrders = user?.orders.filter(o => o.status === 'delivered' || o.status === 'cancelled') || []

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'accepted': return 'bg-blue-100 text-blue-700'
      case 'washing': return 'bg-indigo-100 text-indigo-700'
      case 'ready': return 'bg-green-100 text-green-700'
      case 'delivered': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'pending': return 'En attente'
      case 'accepted': return 'Acceptée'
      case 'washing': return 'En lavage'
      case 'ready': return 'Prête'
      case 'delivered': return 'Livrée'
      default: return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending': return <Clock size={14} />
      case 'washing': return <Package size={14} />
      case 'ready': return <CheckCircle size={14} />
      case 'delivered': return <Truck size={14} />
      default: return <Clock size={14} />
    }
  }

  return (
    <div className="w-full h-full bg-background flex flex-col">
      <header className="p-4 border-b bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <h1 className="text-2xl font-bold">Mes Commandes</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-40">
        {/* Active Orders */}
        {activeOrders.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">En cours</h2>
            <div className="space-y-3">
              {activeOrders.map(order => (
                <div key={order.id} onClick={() => { setSelectedOrder(order); setCurrentScreen('order-details'); }} className="bg-card border rounded-3xl shadow-sm active:scale-[0.98] transition-transform cursor-pointer group overflow-hidden">
                                    <div className="p-5">
                      <div className="flex justify-between items-start">
                          <div>
                              <h3 className="font-bold text-lg text-foreground leading-tight">{order.pressingName}</h3>
                              <p className="text-xs text-muted-foreground">ID: {order.id}</p>
                          </div>
                          <div className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              {getStatusLabel(order.status)}
                          </div>
                      </div>
                      <div className="space-y-2 mt-5">
                          <div className="w-full bg-muted rounded-full h-2">
                              <div className="bg-primary h-2 rounded-full" style={{ width: `${calculateProgress(order.createdAt, order.estimatedDelivery)}%` }}></div>
                          </div>
                          <div className="flex justify-between items-center text-xs font-medium text-muted-foreground">
                              <span>Déposé le {format(new Date(order.createdAt), 'dd MMM', { locale: fr })}</span>
                              <span>Prêt le {format(new Date(order.estimatedDelivery), 'dd MMM', { locale: fr })}</span>
                          </div>
                      </div>
                  </div>
                  <div className="bg-muted/50 p-4 border-t flex justify-between items-center">
                      <div className="text-sm font-semibold text-muted-foreground">
                          {order.items.reduce((acc, i) => acc + i.quantity, 0)} articles
                      </div>
                      <div className="text-right">
                          <span className="font-bold text-lg text-foreground">{order.total} F</span>
                      </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Past Orders */}
        <section>
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Historique</h2>
          {pastOrders.length === 0 && activeOrders.length === 0 ? (
             <div className="text-center py-10 text-muted-foreground">
                 <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                 <p>Aucune commande pour le moment</p>
             </div>
          ) : (
            <div className="space-y-3">
              {pastOrders.map(order => (
                <div key={order.id} className="bg-card/50 border rounded-2xl p-4 flex justify-between items-center opacity-80 grayscale-[0.5]">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-muted-foreground font-bold">
                        {order.pressingName[0]}
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">{order.pressingName}</h3>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(order.createdAt), 'dd MMM yyyy', { locale: fr })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                        <p className="font-bold">{order.total} F</p>
                        <p className="text-xs text-muted-foreground">Terminée</p>
                    </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
