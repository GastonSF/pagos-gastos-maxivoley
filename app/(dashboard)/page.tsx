"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { TrendingUp, ArrowUpCircle, Wallet, Users, Clock } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { KpiCard } from "@/components/kpi-card"
import { ProgressRing } from "@/components/progress-ring"
import { PaymentsBarChart } from "@/components/payments-bar-chart"
import { RecentActivityTable } from "@/components/recent-activity-table"
import { Spinner } from "@/components/ui/spinner"

interface DashboardData {
  jugadoresActivos: number
  totalRecaudado: number
  totalEgresos: number
  saldo: number
  pagosPendientes: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<DashboardData>({
    jugadoresActivos: 0,
    totalRecaudado: 0,
    totalEgresos: 0,
    saldo: 0,
    pagosPendientes: 0,
  })

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

      // Check session first - this prevents the logout issue
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !sessionData?.session) {
        router.push("/login")
        return
      }

      // Fixed month: March 2026
      const mes = 3
      const anio = 2026

      // Fetch all data in parallel
      const [
        activosResult,
        pagosResult,
        egresosResult,
        pendientesResult,
      ] = await Promise.all([
        // Count active jugadores
        supabase
          .from("usuarios")
          .select("*", { count: "exact", head: true })
          .eq("rol", "jugador")
          .eq("estado", "activo"),
        // Sum confirmed payments for March 2026
        supabase
          .from("pagos")
          .select("monto")
          .eq("estado", "confirmado")
          .eq("mes", mes)
          .eq("anio", anio),
        // Sum expenses for March 2026
        supabase
          .from("egresos")
          .select("monto")
          .eq("mes", mes)
          .eq("anio", anio),
        // Count pending payments
        supabase
          .from("pagos")
          .select("*", { count: "exact", head: true })
          .eq("estado", "pendiente"),
      ])

      const jugadoresActivos = activosResult.count ?? 0
      
      const totalRecaudado = pagosResult.data?.reduce(
        (sum, pago) => sum + (Number(pago.monto) || 0), 
        0
      ) ?? 0
      
      const totalEgresos = egresosResult.data?.reduce(
        (sum, egreso) => sum + (Number(egreso.monto) || 0), 
        0
      ) ?? 0

      const pagosPendientes = pendientesResult.count ?? 0

      setData({
        jugadoresActivos,
        totalRecaudado,
        totalEgresos,
        saldo: totalRecaudado - totalEgresos,
        pagosPendientes,
      })
      setLoading(false)
    }

    fetchData()
  }, [router])

  // Format currency
  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString("es-AR")}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner className="h-8 w-8 text-teal" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-5xl tracking-wide text-foreground">
          MARZO 2026
        </h1>
        <p className="text-muted-foreground mt-1">Resumen del mes actual</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
        <KpiCard
          title="Jugadores Activos"
          value={String(data.jugadoresActivos)}
          icon={Users}
          accent="teal"
          animationDelay={0}
        />
        <KpiCard
          title="Total Recaudado"
          value={formatCurrency(data.totalRecaudado)}
          icon={TrendingUp}
          accent="teal"
          animationDelay={1}
        />
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
        <KpiCard
          title="Pagos Pendientes"
          value={String(data.pagosPendientes)}
          icon={Clock}
          accent="amber"
          animationDelay={4}
        />
      </div>

      {/* Bar Chart */}
      <PaymentsBarChart />

      {/* Recent Activity Table */}
      <RecentActivityTable />
    </div>
  )
}
