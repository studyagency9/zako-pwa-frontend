"use client"

import { useState } from "react"
import { useAppContext } from "@/context/app-context"
import { ChevronRight, Zap, Star, Award, Gift, User, Phone, Mail } from "lucide-react"

export default function Onboarding() {
  const { setUser, setCurrentScreen } = useAppContext()
  const [step, setStep] = useState("welcome") // 'welcome' or 'signup'
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "+237 ",
    email: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === "phone" && !value.startsWith("+237 ")) return
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSignUp = () => {
    if (!formData.firstName || !formData.lastName || formData.phone.length < 14) return

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      username: `${formData.firstName} ${formData.lastName}`,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      email: formData.email,
      points: 250,
      vipLevel: 0,
      orders: [],
      referralCode: `ZAKO-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    }
    setUser(newUser)
    setCurrentScreen("home")
  }

  
  if (step === "signup") {
    return (
      <div className="w-full h-screen flex flex-col bg-muted/30 p-6 font-sans">
        <header className="flex-shrink-0 animate-fade-in-down flex justify-between items-center">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-lg">Z</div>
          <button onClick={() => setStep("welcome")} className="text-sm font-semibold text-muted-foreground hover:text-foreground">Retour</button>
        </header>
        <main className="flex-grow flex flex-col justify-center animate-fade-in-up">
          <div className="bg-background p-8 rounded-3xl shadow-2xl max-w-sm mx-auto w-full">
            <h1 className="text-3xl font-extrabold text-foreground mb-2 tracking-tight text-center">Créez votre compte</h1>
            <p className="text-muted-foreground mb-8 text-center">Rejoignez la communauté Zako !</p>
            <div className="space-y-5">
              <InputField icon={<User size={20} />} type="text" name="firstName" placeholder="Prénom" value={formData.firstName} onChange={handleInputChange} />
              <InputField icon={<User size={20} />} type="text" name="lastName" placeholder="Nom" value={formData.lastName} onChange={handleInputChange} />
              <InputField icon={<Phone size={20} />} type="tel" name="phone" placeholder="Téléphone" value={formData.phone} onChange={handleInputChange} />
              <InputField icon={<Mail size={20} />} type="email" name="email" placeholder="Email (Optionnel)" value={formData.email} onChange={handleInputChange} />
            </div>
            <button onClick={handleSignUp} className="w-full bg-primary text-primary-foreground mt-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 group shadow-lg shadow-primary/30">
              S'inscrire
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="w-full h-screen flex flex-col bg-background p-6 font-sans">
      <header className="flex-shrink-0 animate-fade-in-down">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-3xl flex items-center justify-center text-4xl font-bold text-white shadow-lg">
          Z
        </div>
      </header>
      <main className="flex-grow flex flex-col justify-center text-center animate-fade-in-up">
        <h1 className="text-5xl font-extrabold text-foreground mb-4 tracking-tight">Bienvenue chez Zako</h1>
        <p className="text-xl text-muted-foreground max-w-md mx-auto mb-12">La propreté impeccable, livrée directement à votre porte.</p>
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-16">
          <FeatureCard icon={<Zap size={24} className="text-primary" />} text="Ultra rapide" />
          <FeatureCard icon={<Star size={24} className="text-yellow-400" />} text="Top noté" />
          <FeatureCard icon={<Gift size={24} className="text-green-500" />} text="Points fidélité" />
        </div>
      </main>
      <footer className="flex-shrink-0 w-full max-w-sm mx-auto space-y-3 animate-fade-in-up">
        <button onClick={() => setStep("signup")} className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 group shadow-lg shadow-blue-500/30">
          Commencer
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
              </footer>
    </div>
  )
}

function FeatureCard({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-4 bg-card rounded-2xl border border-border/10 shadow-sm">
      {icon}
      <p className="text-sm font-semibold text-foreground text-center">{text}</p>
    </div>
  )
}

function InputField({ icon, ...props }: { icon: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground">{icon}</div>
      <input {...props} className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" />
    </div>
  )
}
