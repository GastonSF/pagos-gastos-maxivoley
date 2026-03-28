"use client"

import { useEffect, useState } from "react"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"

export function AppNavbar() {
  const [userName, setUserName] = useState({ nombre: "", apellido: "" })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUser() {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user?.email) {
        const { data: usuario } = await supabase
          .from("usuarios")
          .select("nombre, apellido")
          .eq("email", user.email)
          .single()
        
        if (usuario) {
          setUserName({ nombre: usuario.nombre, apellido: usuario.apellido })
        }
      }
      
      setLoading(false)
    }
    
    fetchUser()
  }, [])

  const initials = userName.nombre && userName.apellido
    ? `${userName.nombre.charAt(0)}${userName.apellido.charAt(0)}`.toUpperCase()
    : "?"

  const fullName = userName.nombre && userName.apellido
    ? `${userName.nombre} ${userName.apellido}`
    : "Cargando..."

  return (
    <header className="sticky top-0 z-20 h-16 bg-card border-b border-border">
      <div className="flex items-center justify-between h-full px-6 lg:px-8">
        {/* App name - hidden on mobile since hamburger takes that space */}
        <div className="flex items-center gap-2 pl-12 lg:pl-0">
          <h1 className="font-heading text-xl lg:text-2xl tracking-wide text-foreground">
            Pagos y Gastos MaxiVoley
          </h1>
          <span className="text-2xl" role="img" aria-label="volleyball">
            🏐
          </span>
        </div>

        {/* User section */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3">
            <Avatar className="h-9 w-9 bg-secondary">
              <AvatarFallback className="bg-secondary text-foreground text-sm font-medium">
                {loading ? "..." : initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Tecnico</span>
              <span className="text-sm font-medium text-foreground">
                {loading ? "Cargando..." : fullName}
              </span>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Cerrar sesion</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
