"use client"

import { useRouter } from "next/navigation"
import { Clock, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"

export default function PendientePage() {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-border animate-fade-in">
        <CardContent className="pt-8 pb-6 px-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-warning/10 mb-6 animate-fade-in animate-fade-in-delay-1">
              <Clock className="h-10 w-10 text-warning" />
            </div>

            <h1 className="font-display text-3xl tracking-wide text-foreground mb-4 animate-fade-in animate-fade-in-delay-2">
              CUENTA EN REVISIÓN
            </h1>

            <p className="text-foreground/80 leading-relaxed animate-fade-in animate-fade-in-delay-3">
              El técnico todavía no habilitó tu cuenta. Vas a poder acceder en cuanto lo haga. ¡Gracias por la paciencia!
            </p>

            <Button
              onClick={handleLogout}
              variant="ghost"
              className="mt-8 text-muted-foreground hover:text-foreground transition-colors animate-fade-in animate-fade-in-delay-4"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar sesión
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
