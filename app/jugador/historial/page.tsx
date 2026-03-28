"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, ArrowLeft, Check, X, Clock, Minus, LogOut, Volleyball, Home, History, Users, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { createClient } from "@/lib/supabase/client"

const MESES = [
  "", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
]

interface Pago {
  id: string
  mes: number
  anio: number
  monto: number
  estado: "pendiente" | "confirmado" | "rechazado"
  url_comprobante: string | null
  fecha_confirmacion: string | null
  created_at: string
}

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
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Mi Pago</span>
            </Link>
            <Link
              href="/jugador/historial"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium bg-primary/10 text-primary"
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

export default function HistorialPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [playerName, setPlayerName] = useState("")
  const [pagos, setPagos] = useState<Pago[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

      // Get logged in user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        router.push("/auth/login")
        return
      }

      // Get user info from usuarios table
      const { data: userData, error: userDataError } = await supabase
        .from("usuarios")
        .select("id, nombre, apellido")
        .eq("email", user.email)
        .single()

      if (userDataError || !userData) {
        setError("No se encontraron datos del usuario")
        setLoading(false)
        return
      }

      setPlayerName(`${userData.nombre} ${userData.apellido}`)

      // Fetch all pagos for this user
      const { data: pagosData, error: pagosError } = await supabase
        .from("pagos")
        .select("*")
        .eq("usuario_id", userData.id)
        .order("anio", { ascending: false })
        .order("mes", { ascending: false })

      if (pagosError) {
        setError("Error al cargar el historial de pagos")
        setLoading(false)
        return
      }

      setPagos(pagosData || [])
      setLoading(false)
    }

    fetchData()
  }, [router])

  const pagosConfirmados = pagos.filter(p => p.estado === "confirmado")
  const totalAbonado = pagosConfirmados.reduce((sum, p) => sum + (p.monto || 0), 0)

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—"
    const date = new Date(dateStr)
    return date.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="bg-card border-border p-6">
          <p className="text-destructive">{error}</p>
          <Button onClick={() => router.push("/auth/login")} className="mt-4">
            Volver al login
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <PlayerNavbar playerName={playerName} />

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Link
          href="/jugador/mi-pago"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 animate-fade-in"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Mi Pago
        </Link>

        <h1 className="font-display text-3xl tracking-wide text-foreground mb-6 animate-fade-in animate-fade-in-delay-1">
          MI HISTORIAL DE PAGOS
        </h1>

        <Card className="bg-card border-border mb-6 animate-fade-in animate-fade-in-delay-2">
          <CardContent className="p-0">
            {pagos.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No hay pagos registrados todavia
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Mes</TableHead>
                    <TableHead className="text-muted-foreground">Estado</TableHead>
                    <TableHead className="text-muted-foreground text-center">Comprobante</TableHead>
                    <TableHead className="text-muted-foreground text-right">Fecha de confirmacion</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagos.map((pago, index) => (
                    <TableRow 
                      key={pago.id} 
                      className="border-border hover:bg-muted/30"
                      style={{ animationDelay: `${(index + 3) * 100}ms` }}
                    >
                      <TableCell className="text-foreground font-medium">
                        {MESES[pago.mes]} {pago.anio}
                      </TableCell>
                      <TableCell>
                        {pago.estado === "confirmado" ? (
                          <span className="inline-flex items-center gap-1.5 text-emerald-400">
                            <Check className="h-4 w-4" />
                            Confirmado
                          </span>
                        ) : pago.estado === "pendiente" ? (
                          <span className="inline-flex items-center gap-1.5 text-amber-400">
                            <Clock className="h-4 w-4" />
                            Pendiente
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-rose-400">
                            <X className="h-4 w-4" />
                            Rechazado
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {pago.url_comprobante ? (
                          <a 
                            href={pago.url_comprobante} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted transition-colors text-primary"
                          >
                            <Eye className="h-4 w-4" />
                          </a>
                        ) : (
                          <Minus className="h-4 w-4 text-muted-foreground mx-auto" />
                        )}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {formatDate(pago.fecha_confirmacion)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border animate-fade-in animate-fade-in-delay-5">
          <CardContent className="py-4">
            <p className="text-center text-muted-foreground">
              <span className="text-foreground font-semibold">{pagosConfirmados.length}</span> pagos confirmados - 
              <span className="text-primary font-semibold"> ${totalAbonado.toLocaleString("es-AR")}</span> abonados en total
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
