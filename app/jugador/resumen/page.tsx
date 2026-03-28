"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, TrendingUp, TrendingDown, Wallet, LogOut, Volleyball, Home, History, Users, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { createClient } from "@/lib/supabase/client"

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
]

interface PagoConfirmado {
  id: string
  monto: number
  fecha_confirmacion: string | null
  usuarios: {
    nombre: string
    apellido: string
  } | null
}

interface Egreso {
  id: string
  descripcion: string
  monto: number
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
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">Historial</span>
            </Link>
            <Link
              href="/jugador/resumen"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium bg-primary/10 text-primary"
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

export default function ResumenPage() {
  const [loading, setLoading] = useState(true)
  const [playerName, setPlayerName] = useState("")
  const [mes, setMes] = useState(3)
  const [anio, setAnio] = useState(2026)
  const [totalRecaudado, setTotalRecaudado] = useState(0)
  const [totalEgresos, setTotalEgresos] = useState(0)
  const [pagosConfirmados, setPagosConfirmados] = useState<PagoConfirmado[]>([])
  const [egresos, setEgresos] = useState<Egreso[]>([])
  const [totalJugadores, setTotalJugadores] = useState(0)
  const [jugadoresPagaron, setJugadoresPagaron] = useState(0)

  useEffect(() => {
    fetchData()
  }, [mes, anio])

  const fetchData = async () => {
    setLoading(true)
    const supabase = createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: userData } = await supabase
        .from("usuarios")
        .select("nombre, apellido")
        .eq("id", user.id)
        .single()
      
      if (userData) {
        setPlayerName(`${userData.nombre} ${userData.apellido}`)
      }
    }

    // Get total recaudado (sum of confirmed payments)
    const { data: pagosData } = await supabase
      .from("pagos")
      .select("monto")
      .eq("estado", "confirmado")
      .eq("mes", mes)
      .eq("anio", anio)

    const recaudado = pagosData?.reduce((sum, p) => sum + (p.monto || 0), 0) || 0
    setTotalRecaudado(recaudado)

    // Get total egresos
    const { data: egresosData } = await supabase
      .from("egresos")
      .select("id, descripcion, monto")
      .eq("mes", mes)
      .eq("anio", anio)

    const egresosTotal = egresosData?.reduce((sum, e) => sum + (e.monto || 0), 0) || 0
    setTotalEgresos(egresosTotal)
    setEgresos(egresosData || [])

    // Get confirmed payments with user info
    const { data: pagosConfirmadosData } = await supabase
      .from("pagos")
      .select("id, monto, fecha_confirmacion, usuarios(nombre, apellido)")
      .eq("estado", "confirmado")
      .eq("mes", mes)
      .eq("anio", anio)
      .order("fecha_confirmacion", { ascending: false })

    setPagosConfirmados(pagosConfirmadosData as PagoConfirmado[] || [])
    setJugadoresPagaron(pagosConfirmadosData?.length || 0)

    // Get total active players
    const { count } = await supabase
      .from("usuarios")
      .select("*", { count: "exact", head: true })
      .eq("rol", "jugador")
      .eq("estado", "activo")

    setTotalJugadores(count || 0)

    setLoading(false)
  }

  const saldo = totalRecaudado - totalEgresos
  const jugadoresNoPagaron = Math.max(0, totalJugadores - jugadoresPagaron)
  const paymentPercentage = totalJugadores > 0 
    ? Math.round((jugadoresPagaron / totalJugadores) * 100) 
    : 0

  const paymentChartData = [
    { name: "Pagaron", value: jugadoresPagaron, color: "#00d4aa" },
    { name: "No pagaron", value: jugadoresNoPagaron, color: "#f43f5e" },
  ]

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-"
    const date = new Date(dateString)
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <PlayerNavbar playerName={playerName} />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <Link
          href="/jugador/mi-pago"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 animate-fade-in"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Mi Pago
        </Link>

        <div className="mb-8 animate-fade-in animate-fade-in-delay-1">
          <h1 className="font-display text-3xl tracking-wide text-foreground">
            RESUMEN DEL EQUIPO — {MESES[mes - 1]} {anio}
          </h1>
          <p className="text-muted-foreground mt-1">
            Esta informacion es publica para todos los miembros del equipo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card border-border animate-fade-in animate-fade-in-delay-2">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Recaudado</p>
                  <p className="text-2xl font-semibold text-primary">
                    ${totalRecaudado.toLocaleString("es-AR")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border animate-fade-in animate-fade-in-delay-3">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                  <TrendingDown className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Egresos</p>
                  <p className="text-2xl font-semibold text-warning">
                    ${totalEgresos.toLocaleString("es-AR")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border animate-fade-in animate-fade-in-delay-4">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                  <Wallet className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Saldo del Mes</p>
                  <p className={`text-2xl font-semibold ${saldo >= 0 ? "text-success" : "text-destructive"}`}>
                    ${saldo.toLocaleString("es-AR")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-card border-border animate-fade-in animate-fade-in-delay-5">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-xl tracking-wide text-foreground">
                Pagos confirmados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {pagosConfirmados.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No hay pagos confirmados este mes</p>
                ) : (
                  pagosConfirmados.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between py-2 border-b border-border last:border-0"
                    >
                      <div>
                        <p className="text-foreground">
                          {payment.usuarios?.nombre} {payment.usuarios?.apellido}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(payment.fecha_confirmacion)}
                        </p>
                      </div>
                      <span className="text-primary font-medium">
                        ${payment.monto.toLocaleString("es-AR")}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border animate-fade-in animate-fade-in-delay-5">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-xl tracking-wide text-foreground">
                Egresos del mes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {egresos.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No hay egresos registrados este mes</p>
                ) : (
                  egresos.map((expense) => (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between py-2 border-b border-border last:border-0"
                    >
                      <p className="text-foreground">{expense.descripcion}</p>
                      <span className="text-warning font-medium">
                        -${expense.monto.toLocaleString("es-AR")}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-border animate-fade-in animate-fade-in-delay-5">
          <CardHeader className="pb-0">
            <CardTitle className="font-display text-xl tracking-wide text-foreground text-center">
              Estado de pagos del mes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {paymentChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => {
                      const data = paymentChartData.find((d) => d.name === value)
                      return (
                        <span className="text-foreground">
                          {value}: {data?.value}
                        </span>
                      )
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ marginBottom: "36px" }}>
                <div className="text-center">
                  <p className="text-3xl font-bold text-foreground">{paymentPercentage}%</p>
                  <p className="text-sm text-muted-foreground">pago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground animate-fade-in">
          Pagos y Gastos MaxiVoley - Resumen generado automaticamente cada mes.
        </div>
      </main>
    </div>
  )
}
