"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { KpiCard } from "@/components/kpi-card"
import { Spinner } from "@/components/ui/spinner"
import { Users, DollarSign, TrendingDown, Wallet, Clock } from "lucide-react"

interface DashboardData {
  jugadoresActivos: number
  totalRecaudado: number
  totalEgresos: number
  saldo: number
  pagosPendientes: number
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

      const [
        jugadoresRes,
        pagosRes,
        egresosRes,
        pendientesRes
      ] = await Promise.all([
        // Count jugadores activos
        supabase
          .from("usuarios")
          .select("*", { count: "exact", head: true })
          .eq("rol", "jugador")
          .eq("estado", "activo"),
        
        // Sum pagos confirmados marzo 2026
        supabase
          .from("pagos")
          .select("monto")
          .eq("estado", "confirmado")
          .eq("mes", 3)
          .eq("anio", 2026),
        
        // Sum egresos marzo 2026
        supabase
          .from("egresos")
          .select("monto")
          .eq("mes", 3)
          .eq("anio", 2026),
        
        // Count pagos pendientes
        supabase
          .from("pagos")
          .select("*", { count: "exact", head: true })
          .eq("estado", "pendiente")
      ])

      const totalRecaudado = pagosRes.data?.reduce((sum, p) => sum + (p.monto || 0), 0) || 0
      const totalEgresos = egresosRes.data?.reduce((sum, e) => sum + (e.monto || 0), 0) || 0

      setData({
        jugadoresActivos: jugadoresRes.count || 0,
        totalRecaudado,
        totalEgresos,
        saldo: totalRecaudado - totalEgresos,
        pagosPendientes: pendientesRes.count || 0
      })
      setLoading(false)
    }

    fetchData()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Spinner className="h-8 w-8 text-teal" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl tracking-wide text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Resumen financiero - Marzo 2026
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <KpiCard
          title="Jugadores Activos"
          value={String(data?.jugadoresActivos || 0)}
          icon={Users}
          accent="teal"
          animationDelay={0}
        />
        
        <KpiCard
          title="Total Recaudado"
          value={formatCurrency(data?.totalRecaudado || 0)}
          icon={DollarSign}
          accent="emerald"
          animationDelay={1}
        />
        
        <KpiCard
          title="Total Egresos"
          value={formatCurrency(data?.totalEgresos || 0)}
          icon={TrendingDown}
          accent="rose"
          animationDelay={2}
        />
        
        <KpiCard
          title="Saldo"
          value={formatCurrency(data?.saldo || 0)}
          icon={Wallet}
          accent={(data?.saldo || 0) >= 0 ? "emerald" : "rose"}
          animationDelay={3}
        />
        
        <KpiCard
          title="Pagos Pendientes"
          value={String(data?.pagosPendientes || 0)}
          icon={Clock}
          accent="amber"
          animationDelay={0}
        />
      </div>
    </div>
  )
}
