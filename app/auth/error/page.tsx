"use client"

import Link from "next/link"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-8 pb-8 text-center">
          {/* Error Icon */}
          <div className="mx-auto w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center mb-6">
            <AlertCircle className="w-10 h-10 text-destructive" />
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl text-foreground mb-2">
            Error de Autenticación
          </h1>
          
          {/* Subtitle */}
          <p className="text-muted-foreground mb-8">
            Hubo un problema al verificar tu cuenta. Por favor, intenta nuevamente.
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Link href="/auth/registro">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Volver a Registrarse
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" className="w-full">
                Ir al Inicio de Sesion
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
