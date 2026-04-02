"use client"

import { useState } from "react"
import Link from "next/link"
import { Loader2, AlertCircle, CheckCircle2, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const supabase = createClient()
      
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/auth/update-password"
      })

      if (resetError) {
        setError(resetError.message)
        return
      }

      setSuccess(true)
    } catch (err) {
      setError("Ocurrio un error inesperado. Por favor intenta de nuevo.")
      console.error("Reset password error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-border animate-fade-in">
        <CardContent className="pt-8 pb-6 px-6">
          <div className="text-center mb-8 animate-fade-in animate-fade-in-delay-1">
            <h1 className="font-display text-4xl tracking-wide text-foreground">
              Recuperar Contraseña
            </h1>
            <p className="text-muted-foreground mt-2">
              Ingresa tu email y te enviaremos un link para restablecer tu contraseña
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
                  <Mail className="h-8 w-8 text-success" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-success">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">Email enviado</span>
                </div>
                <p className="text-muted-foreground text-sm">
                  Te enviamos un email con el link para restablecer tu contraseña. Revisa tu bandeja de entrada y spam.
                </p>
              </div>
              <div className="pt-4">
                <Link href="/auth/login">
                  <Button variant="outline" className="w-full">
                    Volver al inicio de sesion
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="animate-fade-in animate-fade-in-delay-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="mt-1.5 bg-muted border-border text-foreground placeholder:text-muted-foreground"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="pt-2 animate-fade-in animate-fade-in-delay-3">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover:glow-teal transition-all font-semibold"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar link de recuperacion"
                  )}
                </Button>
              </div>

              <div className="mt-4 text-center animate-fade-in animate-fade-in-delay-4">
                <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Volver al inicio de sesion
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
