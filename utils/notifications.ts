// Notification utility for local browser notifications and WhatsApp links

export function sendLocalNotification(title: string, options?: NotificationOptions) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, {
      icon: "/icon.svg",
      badge: "/icon.svg",
      ...options,
    })
  }
}

export function requestNotificationPermission() {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission()
  }
}

export function getWhatsAppLink(pressingPhone: string, message: string) {
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${pressingPhone}?text=${encoded}`
}

export function formatPhoneNumber(phone: string) {
  // Remove non-digits and add country code
  const digits = phone.replace(/\D/g, "")
  return `237${digits.slice(-9)}` // Cameroon country code
}
