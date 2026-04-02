"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
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

    setIsLoading(true)

    try {
      const supabase = createClient()
      
      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.password
      })

      if (updateError) {
        setError(updateError.message)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push("/auth/login")
      }, 2000)
    } catch (err) {
      setError("Ocurrio un error inesperado. Por favor intenta de nuevo.")
      console.error("Update password error:", err)
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
              Nueva Contraseña
            </h1>
            <p className="text-muted-foreground mt-2">
              Ingresa tu nueva contraseña
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg flex items-center gap-2 animate-fade-in">
              <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {success ? (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                  <Lock className="h-8 w-8 text-success" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-success">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">Contraseña actualizada</span>
                </div>
                <p className="text-muted-foreground text-sm">
                  Tu contraseña fue actualizada correctamente. Redirigiendo al inicio de sesion...
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="animate-fade-in animate-fade-in-delay-2">
                <Label htmlFor="password" className="text-foreground">Nueva Contraseña</Label>
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
                    minLength={6}
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

              <div className="animate-fade-in animate-fade-in-delay-3">
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
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isLoading}
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
                      Actualizando...
                    </>
                  ) : (
                    "Actualizar contraseña"
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
