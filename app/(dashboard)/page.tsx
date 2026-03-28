"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { TrendingUp, ArrowUpCircle, Wallet, Users } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { KpiCard } from "@/components/kpi-card"
import { ProgressRing } from "@/components/progress-ring"
import { PaymentsBarChart } from "@/components/payments-bar-chart"
import { RecentActivityTable } from "@/components/recent-activity-table"

interface DashboardData {
  totalJugadores: number
  jugadoresActivos: number
  jugadoresPendientes: number
  totalRecaudado: number
  totalEgresos: number
  saldo: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<DashboardData>({
    totalJugadores: 0,
    jugadoresActivos: 0,
    jugadoresPendientes: 0,
    totalRecaudado: 0,
    totalEgresos: 0,
    saldo: 0,
  })

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

      // Check authentication
      const { data: authData, error: authError } = await supabase.auth.getUser()
      if (authError || !authData?.user) {
        router.push("/auth/login")
        return
      }

      // Get current month date range
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString()

      // Fetch all data in parallel
      const [
        jugadoresResult,
        activosResult,
        pendientesResult,
        pagosResult,
        egresosResult,
      ] = await Promise.all([
        // Count all jugadores
        supabase
          .from("usuarios")
          .select("*", { count: "exact", head: true })
          .eq("rol", "jugador"),
        // Count active jugadores
        supabase
          .from("usuarios")
          .select("*", { count: "exact", head: true })
          .eq("rol", "jugador")
          .eq("estado", "activo"),
        // Count pending jugadores
        supabase
          .from("usuarios")
          .select("*", { count: "exact", head: true })
          .eq("rol", "jugador")
          .eq("estado", "pendiente"),
        // Sum confirmed payments for current month
        supabase
          .from("pagos")
          .select("monto")
          .eq("estado", "confirmado")
          .gte("created_at", startOfMonth)
          .lte("created_at", endOfMonth),
        // Sum expenses for current month
        supabase
          .from("egresos")
          .select("monto")
          .gte("created_at", startOfMonth)
          .lte("created_at", endOfMonth),
      ])

      const totalJugadores = jugadoresResult.count ?? 0
      const jugadoresActivos = activosResult.count ?? 0
      const jugadoresPendientes = pendientesResult.count ?? 0
      
      const totalRecaudado = pagosResult.data?.reduce(
        (sum, pago) => sum + (pago.monto || 0), 
        0
      ) ?? 0
      
      const totalEgresos = egresosResult.data?.reduce(
        (sum, egreso) => sum + (egreso.monto || 0), 
        0
      ) ?? 0

      setData({
        totalJugadores,
        jugadoresActivos,
        jugadoresPendientes,
        totalRecaudado,
        totalEgresos,
        saldo: totalRecaudado - totalEgresos,
      })
      setLoading(false)
    }

    fetchData()
  }, [router])

  // Format currency
  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString("es-AR")}`
  }

  // Calculate progress percentage
  const progressPercentage = data.totalJugadores > 0 
    ? Math.round((data.jugadoresActivos / data.totalJugadores) * 100) 
    : 0

  // Get current month name in Spanish
  const currentMonth = new Date().toLocaleDateString("es-AR", { 
    month: "long", 
    year: "numeric" 
  }).toUpperCase()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-5xl tracking-wide text-foreground">
          {currentMonth}
        </h1>
        <p className="text-muted-foreground mt-1">Resumen del mes actual</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <KpiCard
          title="Total Recaudado"
          value={formatCurrency(data.totalRecaudado)}
          icon={TrendingUp}
          accent="teal"
          animationDelay={0}
        />
        <KpiCard
          title="Pagaron este mes"
          value={`${data.jugadoresActivos} de ${data.totalJugadores}`}
          icon={Users}
          accent="teal"
          animationDelay={1}
        >
          <ProgressRing progress={progressPercentage} />
        </KpiCard>
        <KpiCard
          title="Total Egresos"
          value={formatCurrency(data.totalEgresos)}
          icon={ArrowUpCircle}
          accent="amber"
          animationDelay={2}
        />
        <KpiCard
          title="Saldo del Mes"
          value={formatCurrency(data.saldo)}
          icon={Wallet}
          accent="emerald"
          animationDelay={3}
        />
      </div>

      {/* Bar Chart */}
      <PaymentsBarChart />

      {/* Recent Activity Table */}
      <RecentActivityTable />
    </div>
  )
}
