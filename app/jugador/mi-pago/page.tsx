"use client"

import { useState, useCallback, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Upload, FileText, Check, AlertTriangle, Clock, LogOut, Volleyball, Home, History, Users, Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"

type PaymentState = "loading" | "none" | "pending" | "confirmed"

interface PagoRecord {
  id: string
  mes: number
  anio: number
  monto: number
  estado: string
  url_comprobante: string
  nombre_archivo: string
  fecha_subida: string
  fecha_confirmacion?: string
}

interface UserData {
  id: string
  nombre: string
  apellido: string
}

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
]

function PlayerNavbar({ playerName }: { playerName: string }) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Volleyball className="w-5 h-5 text-primary" />
            </div>
            <span className="font-display text-xl tracking-wide text-foreground hidden sm:block">
              MAXIVOLEY
            </span>
          </div>

          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/jugador/mi-pago"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium bg-primary/10 text-primary"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Mi Pago</span>
            </Link>
            <Link
              href="/jugador/historial"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">Historial</span>
            </Link>
            <Link
              href="/jugador/resumen"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Equipo</span>
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden md:block">{playerName}</span>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default function MiPagoPage() {
  const router = useRouter()
  const [paymentState, setPaymentState] = useState<PaymentState>("loading")
  const [userData, setUserData] = useState<UserData | null>(null)
  const [pagoActual, setPagoActual] = useState<PagoRecord | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form fields
  const currentDate = new Date()
  const [selectedMes, setSelectedMes] = useState<number>(currentDate.getMonth() + 1)
  const [selectedAnio, setSelectedAnio] = useState<number>(currentDate.getFullYear())
  const [monto, setMonto] = useState<string>("")
  const [numeroTransferencia, setNumeroTransferencia] = useState<string>("")
  const [nota, setNota] = useState<string>("")

  useEffect(() => {
    loadUserAndPayment()
  }, [selectedMes, selectedAnio])

  const loadUserAndPayment = async () => {
    const supabase = createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      router.push("/auth/login")
      return
    }

    // Get user data from usuarios table
    const { data: userDataResult, error: userError } = await supabase
      .from("usuarios")
      .select("id, nombre, apellido")
      .eq("id", user.id)
      .single()

    if (userError || !userDataResult) {
      setError("Error al cargar datos del usuario")
      setPaymentState("none")
      return
    }

    setUserData(userDataResult)

    // Check for existing payment for selected month/year
    const { data: pagoData, error: pagoError } = await supabase
      .from("pagos")
      .select("*")
      .eq("usuario_id", user.id)
      .eq("mes", selectedMes)
      .eq("anio", selectedAnio)
      .single()

    if (pagoError && pagoError.code !== "PGRST116") {
      // PGRST116 = no rows found, which is fine
      console.error("Error loading payment:", pagoError)
    }

    if (pagoData) {
      setPagoActual(pagoData)
      if (pagoData.estado === "confirmado") {
        setPaymentState("confirmed")
      } else {
        setPaymentState("pending")
      }
    } else {
      setPagoActual(null)
      setPaymentState("none")
    }
  }

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
      setError(null)
    } else {
      setError("Archivo no valido. Solo PDF, JPG o PNG de hasta 10MB.")
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && isValidFileType(file)) {
      setSelectedFile(file)
      setError(null)
    } else if (file) {
      setError("Archivo no valido. Solo PDF, JPG o PNG de hasta 10MB.")
    }
  }

  const isValidFileType = (file: File) => {
    const validTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"]
    return validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024
  }

  const handleSubmit = async () => {
    if (!selectedFile || !userData || !monto) {
      setError("Por favor completa el monto y selecciona un comprobante")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = createClient()

      // Upload file to Supabase Storage
      const fileExt = selectedFile.name.split(".").pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `${userData.id}/${selectedAnio}/${selectedMes}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from("comprobantes-pagos")
        .upload(filePath, selectedFile)

      if (uploadError) {
        throw new Error("Error al subir el comprobante: " + uploadError.message)
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("comprobantes-pagos")
        .getPublicUrl(filePath)

      // Insert payment record
      const { error: insertError } = await supabase.from("pagos").insert({
        usuario_id: userData.id,
        mes: selectedMes,
        anio: selectedAnio,
        monto: parseFloat(monto.replace(/\./g, "").replace(",", ".")),
        url_comprobante: urlData.publicUrl,
        nombre_archivo: selectedFile.name,
        numero_transferencia: numeroTransferencia || null,
        nota: nota || null,
        estado: "pendiente",
        fecha_subida: new Date().toISOString(),
      })

      if (insertError) {
        throw new Error("Error al guardar el pago: " + insertError.message)
      }

      // Reload payment data
      await loadUserAndPayment()
      setSelectedFile(null)
      setMonto("")
      setNumeroTransferencia("")
      setNota("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const playerName = userData ? `${userData.nombre} ${userData.apellido}` : "Cargando..."

  if (paymentState === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <PlayerNavbar playerName={playerName} />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 mb-6 animate-fade-in">
          <CardContent className="py-6">
            <h1 className="font-display text-3xl tracking-wide text-foreground">
              Hola, {userData?.nombre || "Jugador"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {MESES[selectedMes - 1]} {selectedAnio}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border animate-fade-in animate-fade-in-delay-1">
          <CardContent className="py-6">
            {error && (
              <div className="mb-4 p-3 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                {error}
              </div>
            )}

            {paymentState === "none" && (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warning/10 text-warning border border-warning/30">
                    <AlertTriangle className="h-4 w-4" />
                    Sin comprobante este mes
                  </span>
                </div>

                {/* Month Selector */}
                <div className="space-y-2">
                  <Label htmlFor="mes">Mes</Label>
                  <Select value={selectedMes.toString()} onValueChange={(v) => setSelectedMes(parseInt(v))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el mes" />
                    </SelectTrigger>
                    <SelectContent>
                      {MESES.map((mes, index) => (
                        <SelectItem key={index + 1} value={(index + 1).toString()}>
                          {mes} {selectedAnio}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Monto */}
                <div className="space-y-2">
                  <Label htmlFor="monto">Monto pagado *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="monto"
                      type="number"
                      value={monto}
                      onChange={(e) => setMonto(e.target.value)}
                      placeholder="2000"
                      className="pl-7"
                      required
                    />
                  </div>
                </div>

                {/* Numero de transferencia */}
                <div className="space-y-2">
                  <Label htmlFor="numeroTransferencia">Numero de transferencia (opcional)</Label>
                  <Input
                    id="numeroTransferencia"
                    type="text"
                    value={numeroTransferencia}
                    onChange={(e) => setNumeroTransferencia(e.target.value)}
                    placeholder="Ej: 123456789"
                  />
                </div>

                {/* Nota */}
                <div className="space-y-2">
                  <Label htmlFor="nota">Nota o comentario (opcional)</Label>
                  <Textarea
                    id="nota"
                    value={nota}
                    onChange={(e) => setNota(e.target.value)}
                    placeholder="Ej: Pago correspondiente a julio"
                    rows={2}
                  />
                </div>

                {/* File Upload Zone */}
                <div className="space-y-2">
                  <Label>Comprobante *</Label>
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
                          Archivo seleccionado - Hace clic para cambiar
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="h-10 w-10 text-primary mx-auto" />
                        <p className="text-foreground font-medium">
                          Subi tu comprobante de transferencia
                        </p>
                        <p className="text-sm text-muted-foreground">
                          PDF, JPG o PNG - Maximo 10MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={!selectedFile || !monto || isSubmitting}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover:glow-teal transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar Comprobante"
                  )}
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                  Una vez enviado, el tecnico lo revisara y confirmara tu pago.
                </p>
              </div>
            )}

            {paymentState === "pending" && pagoActual && (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warning/10 text-warning border border-warning/30">
                    <span className="h-2 w-2 rounded-full bg-warning animate-pulse-dot" />
                    Comprobante enviado — esperando confirmacion
                  </span>
                </div>

                <div className="flex items-center justify-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-foreground font-medium">
                      {pagoActual.nombre_archivo}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Subido el {formatDate(pagoActual.fecha_subida)}
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-2xl font-semibold text-foreground">
                    ${pagoActual.monto.toLocaleString("es-AR")}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {MESES[pagoActual.mes - 1]} {pagoActual.anio}
                  </p>
                </div>

                <p className="text-sm text-muted-foreground text-center">
                  El tecnico revisara tu comprobante a la brevedad.
                </p>
              </div>
            )}

            {paymentState === "confirmed" && pagoActual && (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success border border-success/30">
                    <Check className="h-4 w-4" />
                    Pago confirmado
                  </span>
                </div>

                <div className="text-center space-y-2">
                  <p className="text-muted-foreground">
                    Confirmado el {pagoActual.fecha_confirmacion ? formatDate(pagoActual.fecha_confirmacion) : "—"}
                  </p>
                  <p className="text-2xl font-semibold text-foreground">
                    ${pagoActual.monto.toLocaleString("es-AR")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {MESES[pagoActual.mes - 1]} {pagoActual.anio}
                  </p>
                </div>

                <p className="text-sm text-success text-center">
                  Gracias por pagar a tiempo!
                </p>

                <div className="flex justify-center pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (selectedMes === 12) {
                        setSelectedMes(1)
                        setSelectedAnio(selectedAnio + 1)
                      } else {
                        setSelectedMes(selectedMes + 1)
                      }
                      setPaymentState("none")
                    }}
                    className="border-primary text-primary hover:bg-primary/10"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Informar pago de {MESES[selectedMes === 12 ? 0 : selectedMes]} {selectedMes === 12 ? selectedAnio + 1 : selectedAnio}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center animate-fade-in animate-fade-in-delay-2">
          <Link
            href="/jugador/historial"
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
