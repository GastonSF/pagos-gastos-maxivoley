"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, Clock, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

export default function RegistroPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    telefono: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    if (formData.dni.length < 7 || formData.dni.length > 8) {
      setError("El DNI debe tener entre 7 y 8 dígitos")
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || 
            `${window.location.origin}/auth/callback`,
          data: {
            nombre: formData.nombre,
            apellido: formData.apellido,
            dni: formData.dni,
            telefono: formData.telefono,
            rol: "jugador",
          },
        },
      })

      if (signUpError) {
        if (signUpError.message.includes("already registered")) {
          setError("Este email ya está registrado. Intentá iniciar sesión.")
        } else {
          setError(signUpError.message)
        }
        return
      }

      if (data.user) {
        setSuccess(true)
      }
    } catch (err) {
      setError("Ocurrió un error inesperado. Por favor intentá de nuevo.")
      console.error("Registration error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === "dni" && value.length > 8) return
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card border-border animate-fade-in">
          <CardContent className="pt-8 pb-6 px-6 text-center">
            <div className="mb-6">
              <CheckCircle className="h-16 w-16 text-primary mx-auto" />
            </div>
            <h1 className="font-display text-3xl tracking-wide text-foreground mb-4">
              Registro Exitoso
            </h1>
            <p className="text-muted-foreground mb-6">
              Revisá tu email para confirmar tu cuenta. Una vez confirmada, el técnico revisará tu solicitud y te habilitará el acceso.
            </p>
            <Link href="/auth/login">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover:glow-teal transition-all font-semibold">
                Ir a Iniciar Sesión
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    )
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
            <div className="animate-fade-in animate-fade-in-delay-1">
              <Label htmlFor="nombre" className="text-foreground">Nombre</Label>
              <Input
                id="nombre"
                name="nombre"
                type="text"
                value={formData.nombre}
                onChange={handleChange}
                className="mt-1.5 bg-muted border-border text-foreground placeholder:text-muted-foreground"
                required
                disabled={isLoading}
              />
            </div>

            <div className="animate-fade-in animate-fade-in-delay-1">
              <Label htmlFor="apellido" className="text-foreground">Apellido</Label>
              <Input
                id="apellido"
                name="apellido"
                type="text"
                value={formData.apellido}
                onChange={handleChange}
                className="mt-1.5 bg-muted border-border text-foreground placeholder:text-muted-foreground"
                required
                disabled={isLoading}
              />
            </div>

            <div className="animate-fade-in animate-fade-in-delay-2">
              <Label htmlFor="dni" className="text-foreground">DNI</Label>
              <Input
                id="dni"
                name="dni"
                type="number"
                placeholder="Ej: 38291045"
                value={formData.dni}
                onChange={handleChange}
                className="mt-1.5 bg-muted border-border text-foreground placeholder:text-muted-foreground"
                required
                disabled={isLoading}
              />
            </div>

            <div className="animate-fade-in animate-fade-in-delay-2">
              <Label htmlFor="telefono" className="text-foreground">Teléfono</Label>
              <Input
                id="telefono"
                name="telefono"
                type="text"
                placeholder="Ej: 11 1234-5678"
                value={formData.telefono}
                onChange={handleChange}
                className="mt-1.5 bg-muted border-border text-foreground placeholder:text-muted-foreground"
                required
                disabled={isLoading}
              />
            </div>

            <div className="animate-fade-in animate-fade-in-delay-3">
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
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="animate-fade-in animate-fade-in-delay-4">
              <Label htmlFor="confirmPassword" className="text-foreground">Confirmar Contraseña</Label>
              <div className="relative mt-1.5">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="bg-muted border-border text-foreground pr-10"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                    Registrando...
                  </>
                ) : (
                  "Registrarse"
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-warning/10 border border-warning/30 rounded-lg animate-fade-in animate-fade-in-delay-5">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground/90">
                Tu cuenta será revisada por el técnico antes de poder acceder. Te avisaremos cuando esté habilitada.
              </p>
            </div>
          </div>

          <div className="mt-6 text-center animate-fade-in animate-fade-in-delay-5">
            <Link href="/auth/login" className="text-sm text-primary hover:text-primary/80 transition-colors">
              ¿Ya tenés cuenta? Iniciá sesión &rarr;
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
