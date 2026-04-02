"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const supabase = createClient()
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (signInError) {
        if (signInError.message.includes("Invalid login credentials")) {
          setError("Email o contraseña incorrectos")
        } else if (signInError.message.includes("Email not confirmed")) {
          setError("Debés confirmar tu email antes de iniciar sesión")
        } else {
          setError(signInError.message)
        }
        return
      }

      if (data.user) {
        // Get user data from usuarios table to check status and role
        const { data: userData, error: userError } = await supabase
          .from("usuarios")
          .select("estado, rol")
          .eq("id", data.user.id)
          .single()

        if (userError || !userData) {
          setError("Usuario no encontrado")
          return
        }

        // Redirect based on role and status
        if (userData.rol === "admin") {
          router.push("/admin/dashboard")
        } else if (userData.rol === "jugador" && userData.estado === "activo") {
          router.push("/jugador/mi-pago")
        } else if (userData.rol === "jugador" && userData.estado === "pendiente") {
          router.push("/pendiente")
        } else {
          setError("Estado de cuenta no válido")
        }
      }
    } catch (err) {
      setError("Ocurrió un error inesperado. Por favor intentá de nuevo.")
      console.error("Login error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-border animate-fade-in">
        <CardContent className="pt-8 pb-6 px-6">
          <div className="text-center mb-8 animate-fade-in animate-fade-in-delay-1">
            <h1 className="font-display text-4xl tracking-wide text-foreground">
              Pagos y Gastos MaxiVóley
            </h1>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg flex items-center gap-2 animate-fade-in">
              <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="animate-fade-in animate-fade-in-delay-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1.5 bg-muted border-border text-foreground placeholder:text-muted-foreground"
                required
                disabled={isLoading}
              />
            </div>

            <div className="animate-fade-in animate-fade-in-delay-3">
              <Label htmlFor="password" className="text-foreground">Contraseña</Label>
              <div className="relative mt-1.5">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-muted border-border text-foreground pr-10"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2 animate-fade-in animate-fade-in-delay-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover:glow-teal transition-all font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>
            </div>
          </form>

          <div className="mt-4 text-center animate-fade-in animate-fade-in-delay-5">
            <Link href="/auth/reset-password" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <div className="mt-4 text-center animate-fade-in animate-fade-in-delay-5">
            <Link href="/auth/registro" className="text-sm text-primary hover:text-primary/80 transition-colors">
              ¿No tenés cuenta? Registrate &rarr;
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
