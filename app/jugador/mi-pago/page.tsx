"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { Upload, FileText, Check, AlertTriangle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"

type PaymentState = "none" | "pending" | "confirmed"

interface UploadedFile {
  name: string
  uploadDate: string
}

// Demo data
const PLAYER_NAME = "Ramiro Suárez"
const CURRENT_MONTH = "Julio 2025"
const MONTHLY_FEE = "$2.000"

export default function MiPagoPage() {
  const [paymentState, setPaymentState] = useState<PaymentState>("none")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && isValidFileType(file)) {
      setSelectedFile(file)
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && isValidFileType(file)) {
      setSelectedFile(file)
    }
  }

  const isValidFileType = (file: File) => {
    const validTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"]
    return validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024
  }

  const handleSubmit = () => {
    if (selectedFile) {
      setUploadedFile({
        name: selectedFile.name,
        uploadDate: new Date().toLocaleDateString("es-AR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
      })
      setPaymentState("pending")
      setSelectedFile(null)
    }
  }

  // For demo: allow cycling through states
  const cycleState = () => {
    if (paymentState === "none") setPaymentState("pending")
    else if (paymentState === "pending") setPaymentState("confirmed")
    else setPaymentState("none")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar playerName={PLAYER_NAME} />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Welcome Card */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 mb-6 animate-fade-in">
          <CardContent className="py-6">
            <h1 className="font-display text-3xl tracking-wide text-foreground">
              Hola, {PLAYER_NAME.split(" ")[0]}
            </h1>
            <p className="text-muted-foreground mt-1">
              {CURRENT_MONTH} · Cuota mensual: {MONTHLY_FEE}
            </p>
          </CardContent>
        </Card>

        {/* Payment Status Card */}
        <Card className="bg-card border-border animate-fade-in animate-fade-in-delay-1">
          <CardContent className="py-6">
            {/* STATE A - Sin pago registrado */}
            {paymentState === "none" && (
              <div className="space-y-6">
                {/* Status Badge */}
                <div className="flex justify-center">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warning/10 text-warning border border-warning/30">
                    <AlertTriangle className="h-4 w-4" />
                    Sin comprobante este mes
                  </span>
                </div>

                {/* Upload Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`
                    relative border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer
                    ${isDragging ? "border-primary bg-primary/5" : "border-primary/50 hover:border-primary hover:bg-primary/5"}
                    ${selectedFile ? "border-primary bg-primary/5" : ""}
                  `}
                >
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  
                  {selectedFile ? (
                    <div className="space-y-2">
                      <FileText className="h-10 w-10 text-primary mx-auto" />
                      <p className="text-foreground font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Archivo seleccionado · Hacé clic para cambiar
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-10 w-10 text-primary mx-auto" />
                      <p className="text-foreground font-medium">
                        Subí tu comprobante de transferencia
                      </p>
                      <p className="text-sm text-muted-foreground">
                        PDF, JPG o PNG · Máximo 10MB
                      </p>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedFile}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover:glow-teal transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Enviar Comprobante
                </Button>

                {/* Helper Text */}
                <p className="text-sm text-muted-foreground text-center">
                  Una vez enviado, el técnico lo revisará y confirmará tu pago.
                </p>
              </div>
            )}

            {/* STATE B - Pendiente de confirmación */}
            {paymentState === "pending" && (
              <div className="space-y-6">
                {/* Status Badge */}
                <div className="flex justify-center">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warning/10 text-warning border border-warning/30">
                    <span className="h-2 w-2 rounded-full bg-warning animate-pulse-dot" />
                    Comprobante enviado — esperando confirmación
                  </span>
                </div>

                {/* File Info */}
                <div className="flex items-center justify-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-foreground font-medium">
                      {uploadedFile?.name || "comprobante_julio2025.pdf"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Subido el {uploadedFile?.uploadDate || "03/07/2025"}
                    </p>
                  </div>
                </div>

                {/* Note */}
                <p className="text-sm text-muted-foreground text-center">
                  El técnico revisará tu comprobante a la brevedad.
                </p>
              </div>
            )}

            {/* STATE C - Pago confirmado */}
            {paymentState === "confirmed" && (
              <div className="space-y-6">
                {/* Status Badge */}
                <div className="flex justify-center">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success border border-success/30">
                    <Check className="h-4 w-4" />
                    Pago confirmado
                  </span>
                </div>

                {/* Confirmation Details */}
                <div className="text-center space-y-2">
                  <p className="text-muted-foreground">Confirmado el 05/07/2025</p>
                  <p className="text-2xl font-semibold text-foreground">{MONTHLY_FEE}</p>
                </div>

                {/* Celebration Note */}
                <p className="text-sm text-success text-center">
                  ¡Gracias por pagar a tiempo!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Demo Toggle (for demonstration purposes) */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={cycleState}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            [Demo: Cambiar estado → {paymentState === "none" ? "Pendiente" : paymentState === "pending" ? "Confirmado" : "Sin pago"}]
          </button>
        </div>

        {/* History Link */}
        <div className="mt-8 text-center animate-fade-in animate-fade-in-delay-2">
          <Link
            href="/jugador/mi-historial"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <Clock className="h-4 w-4" />
            Ver mi historial
          </Link>
        </div>
      </main>
    </div>
  )
}
