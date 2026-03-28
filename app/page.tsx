import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-border animate-fade-in">
        <CardContent className="pt-8 pb-6 px-6">
          {/* Logo */}
          <div className="text-center mb-8 animate-fade-in animate-fade-in-delay-1">
            <h1 className="font-display text-4xl tracking-wide text-foreground">
              Pagos y Gastos MaxiVóley
            </h1>
            <p className="text-muted-foreground mt-2">
              Sistema de gestión de pagos para el equipo
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 animate-fade-in animate-fade-in-delay-2">
            <Button
              asChild
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover:glow-teal transition-all font-semibold"
            >
              <Link href="/login">Iniciar Sesión</Link>
            </Button>
            
            <Button
              asChild
              variant="outline"
              className="w-full border-border text-foreground hover:bg-muted transition-all"
            >
              <Link href="/auth/registro">Registrarse</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
