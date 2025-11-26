"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { sendLocalNotification, requestNotificationPermission } from "@/utils/notifications"

interface Order {
  id: string
  pressingId: string
  pressingName: string
  pressingPhone?: string
  items: OrderItem[]
  total: number
  status: "pending" | "accepted" | "washing" | "ready" | "delivered" | "cancelled"
  createdAt: string
  estimatedDelivery: string
  collectMethod: "collect" | "delivery"
  photos?: string[]
}

interface OrderItem {
  type: "tshirt" | "shirt" | "pants" | "sheets"
  quantity: number
  price: number
}

interface User {
  id: string
  firstName: string
  lastName: string
  phone: string
  email?: string
  username: string
  points: number
  vipLevel: number
  orders: Order[]
  referralCode: string
}

interface Pressing {
  id: string;
  name: string;
  rating: number;
  distance: number;
  pricePerKilo: number;
  pricePerPiece: number;
  delivery: boolean;
  pricingType: 'kilo' | 'piece' | 'both';
  phone?: string;
  coords: { lat: number; lng: number };
}

interface AppContextType {
  user: User | null
  currentScreen: "onboarding" | "home" | "commande" | "tracking" | "orders" | "profile" | "order-details"
  selectedPressing: Pressing | null
  selectedOrder: Order | null
  cartItems: OrderItem[]
  setUser: (user: User | null) => void
  setCurrentScreen: (screen: AppContextType["currentScreen"]) => void
  setSelectedPressing: (pressing: Pressing | null) => void
  setSelectedOrder: (order: Order | null) => void
  addToCart: (item: OrderItem, isDelta?: boolean) => void
  removeFromCart: (index: number) => void
  clearCart: () => void
  placeOrder: (collectMethod: "collect" | "delivery") => void
  addPoints: (points: number) => void
  getTotalPrice: () => number
  updateOrderStatus: (orderId: string, status: Order["status"]) => void
  sendOrderNotification: (message: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [currentScreen, setCurrentScreen] = useState<AppContextType["currentScreen"]>("onboarding")
  const [selectedPressing, setSelectedPressing] = useState<Pressing | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [cartItems, setCartItems] = useState<OrderItem[]>([])

  // Request notification permission on mount
  useEffect(() => {
    requestNotificationPermission()
  }, [])

  // Load from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("zako-user")
    const savedCart = localStorage.getItem("zako-cart")

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      if (!parsedUser.orders || parsedUser.orders.length === 0) {
        parsedUser.orders = MOCK_ORDERS;
      }
      setUser(parsedUser);
      setCurrentScreen("home");
    }
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [])

  // Save user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("zako-user", JSON.stringify(user))
    }
  }, [user])

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("zako-cart", JSON.stringify(cartItems))
  }, [cartItems])

  useEffect(() => {
    if (!user?.orders.length) return

    const latestOrder = user.orders[0]
    const statuses: Order["status"][] = ["pending", "accepted", "washing", "ready", "delivered"]
    const currentIndex = statuses.indexOf(latestOrder.status)

    if (currentIndex < statuses.length - 1) {
      const timer = setTimeout(() => {
        updateOrderStatus(latestOrder.id, statuses[currentIndex + 1])
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [user?.orders])

  const addToCart = useCallback((item: OrderItem, isDelta = false) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.type === item.type)
      if (existing) {
        const newQuantity = isDelta ? existing.quantity + item.quantity : item.quantity
        if (newQuantity <= 0) {
          return prev.filter((i) => i.type !== item.type) // Remove item if quantity is 0 or less
        }
        return prev.map((i) => (i.type === item.type ? { ...i, quantity: newQuantity } : i))
      }
      if (item.quantity > 0) {
        return [...prev, item]
      }
      return prev
    })
  }, [])

  const removeFromCart = useCallback((index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const clearCart = useCallback(() => {
    setCartItems([])
  }, [])

  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }, [cartItems])

  const placeOrder = useCallback(
    (collectMethod: "collect" | "delivery") => {
      if (!user || !selectedPressing || cartItems.length === 0) return

      const order: Order = {
        id: Math.random().toString(36).substr(2, 9),
        pressingId: selectedPressing.id,
        pressingName: selectedPressing.name,
        pressingPhone: selectedPressing.phone,
        items: cartItems,
        total: getTotalPrice(),
        status: "pending",
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
        collectMethod,
      }

      const updatedUser = {
        ...user,
        orders: [order, ...user.orders],
      }
      setUser(updatedUser)
      clearCart()
      setCurrentScreen("tracking")

      // Send notification
      sendLocalNotification("Commande confirmée! 🎉", {
        body: `Votre commande a été envoyée à ${selectedPressing.name}. Total: ${getTotalPrice()}F`,
        tag: "order-" + order.id,
      })
    },
    [user, selectedPressing, cartItems, getTotalPrice, clearCart],
  )

  const addPoints = useCallback(
    (points: number) => {
      if (!user) return
      const newPoints = user.points + points
      const newVipLevel = Math.floor(newPoints / 500)
      setUser({ ...user, points: newPoints, vipLevel: newVipLevel })

      if (newVipLevel > user.vipLevel) {
        sendLocalNotification(`Nouveau niveau VIP ${newVipLevel}! 👑`, {
          body: `Vous êtes passé VIP level ${newVipLevel}!`,
          tag: "vip-level",
        })
      }
    },
    [user],
  )

  const updateOrderStatus = useCallback(
    (orderId: string, status: Order["status"]) => {
      if (!user) return

      const updatedUser = {
        ...user,
        orders: user.orders.map((order) => (order.id === orderId ? { ...order, status } : order)),
      }
      setUser(updatedUser)

      const statusMessages = {
        pending: "Commande en attente d'acceptation ⏳",
        accepted: "Commande acceptée! ✅",
        washing: "Vos vêtements sont en lavage 🧼",
        ready: "Vos vêtements sont prêts! 📦",
        delivered: "Commande livrée! 🎉",
        cancelled: "Commande annulée."
      }

      sendLocalNotification(statusMessages[status], {
        body: `Commande ${orderId} - ${status}`,
        tag: "order-" + orderId,
      })
    },
    [user],
  )

  const sendOrderNotification = useCallback((message: string) => {
    sendLocalNotification(message, {
      tag: "manual-notification",
    })
  }, [])

  return (
    <AppContext.Provider
      value={{
        user,
        currentScreen,
        selectedPressing,
        selectedOrder,
        cartItems,
        setUser,
        setCurrentScreen,
        setSelectedPressing,
        setSelectedOrder,
        addToCart,
        removeFromCart,
        clearCart,
        placeOrder,
        addPoints,
        getTotalPrice,
        updateOrderStatus,
        sendOrderNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

const MOCK_ORDERS: Order[] = [
  {
    id: "CMD001",
    pressingId: "pressing-1",
    pressingName: "Presto Pressing",
    items: [{ type: "shirt", quantity: 5, price: 600 }, { type: "pants", quantity: 2, price: 800 }],
    total: 4600,
    status: "washing",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    estimatedDelivery: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // tomorrow
    collectMethod: "delivery",
    photos: ["/photo1.jpg", "/photo2.jpg"]
  },
  {
    id: "CMD002",
    pressingId: "pressing-2",
    pressingName: "Douala Wash",
    items: [{ type: "sheets", quantity: 2, price: 1000 }],
    total: 2000,
    status: "ready",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    collectMethod: "collect"
  },
  {
    id: "CMD003",
    pressingId: "pressing-3",
    pressingName: "Aqua Clean",
    items: [{ type: "tshirt", quantity: 10, price: 500 }],
    total: 5000,
    status: "delivered",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedDelivery: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    collectMethod: "delivery"
  }
];

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider")
  }
  return context
}
