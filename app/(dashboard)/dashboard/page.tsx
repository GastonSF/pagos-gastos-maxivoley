"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { KpiCard } from "@/components/kpi-card"
import { Spinner } from "@/components/ui/spinner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DollarSign, TrendingDown, Wallet, Clock } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

interface DashboardData {
  jugadoresActivos: number
  totalRecaudado: number
  totalEgresos: number
  saldo: number
  pagosPendientes: number
}

interface MonthlyData {
  month: string
  recaudado: number
  egresos: number
}

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
]

function getNextSixMonths() {
  const months = []
  const now = new Date()
  for (let i = 0; i < 6; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() + i, 1)
    months.push({
      mes: date.getMonth() + 1,
      anio: date.getFullYear(),
      label: MONTH_NAMES[date.getMonth()]
    })
  }
  return months
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [chartData, setChartData] = useState<MonthlyData[]>([])
  const [loading, setLoading] = useState(true)

  const now = new Date()
  const mesActual = now.getMonth() + 1
  const anioActual = now.getFullYear()
  const mesNombre = MONTH_NAMES[now.getMonth()]

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

      const [jugadoresRes, pagosRes, egresosRes, pendientesRes] = await Promise.all([
        supabase
          .from("usuarios")
          .select("*", { count: "exact", head: true })
          .eq("rol", "jugador")
          .eq("estado", "activo"),
        supabase
          .from("pagos")
          .select("monto")
          .eq("estado", "confirmado")
          .eq("mes", mesActual)
          .eq("anio", anioActual),
        supabase
          .from("egresos")
          .select("monto")
          .eq("mes", mesActual)
          .eq("anio", anioActual),
        supabase
          .from("pagos")
          .select("*", { count: "exact", head: true })
          .eq("estado", "pendiente"),
      ])

      const totalRecaudado = pagosRes.data?.reduce((sum, p) => sum + (p.monto || 0), 0) || 0
      const totalEgresos = egresosRes.data?.reduce((sum, e) => sum + (e.monto || 0), 0) || 0

      setData({
        jugadoresActivos: jugadoresRes.count || 0,
        totalRecaudado,
        totalEgresos,
        saldo: totalRecaudado - totalEgresos,
        pagosPendientes: pendientesRes.count || 0,
      })

      const monthsToFetch = getNextSixMonths()
      const monthlyDataPromises = monthsToFetch.map(async ({ mes, anio, label }) => {
        const [pagosMonthRes, egresosMonthRes] = await Promise.all([
          supabase
            .from("pagos")
            .select("monto")
            .eq("estado", "confirmado")
            .eq("mes", mes)
            .eq("anio", anio),
          supabase
            .from("egresos")
            .select("monto")
            .eq("mes", mes)
            .eq("anio", anio),
        ])

        const recaudado = pagosMonthRes.data?.reduce((sum, p) => sum + (p.monto || 0), 0) || 0
        const egresos = egresosMonthRes.data?.reduce((sum, e) => sum + (e.monto || 0), 0) || 0

        return { month: label, recaudado, egresos }
      })

      const monthlyResults = await Promise.all(monthlyDataPromises)
      setChartData(monthlyResults)
      setLoading(false)
    }

    fetchData()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatYAxis = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
    return `$${value}`
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
        <h1 className="font-heading text-3xl tracking-wide text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Resumen financiero - {mesNombre} {anioActual}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <KpiCard title="Jugadores Activos" value={String(data?.jugadoresActivos || 0)} icon={Users} accent="teal" animationDelay={0} />
        <KpiCard title="Total Recaudado" value={formatCurrency(data?.totalRecaudado || 0)} icon={DollarSign} accent="emerald" animationDelay={1} />
        <KpiCard title="Total Egresos" value={formatCurrency(data?.totalEgresos || 0)} icon={TrendingDown} accent="rose" animationDelay={2} />
        <KpiCard title="Saldo" value={formatCurrency(data?.saldo || 0)} icon={Wallet} accent={(data?.saldo || 0) >= 0 ? "emerald" : "rose"} animationDelay={3} />
        <KpiCard title="Pagos Pendientes" value={String(data?.pagosPendientes || 0)} icon={Clock} accent="amber" animationDelay={0} />
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="font-heading text-xl tracking-wide text-foreground">
            EVOLUCIÓN MENSUAL
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3d5c" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={{ stroke: "#1e3d5c" }} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={{ stroke: "#1e3d5c" }} tickLine={false} tickFormatter={formatYAxis} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1a2f4a", border: "1px solid #1e3d5c", borderRadius: "8px", color: "#f8fafc" }}
                  labelStyle={{ color: "#f8fafc", fontWeight: 600 }}
                  formatter={(value: number) => [formatCurrency(value), ""]}
                />
                <Legend
                  wrapperStyle={{ paddingTop: "16px" }}
                  formatter={(value) => (
                    <span style={{ color: "#94a3b8", fontSize: "12px" }}>
                      {value === "recaudado" ? "Recaudado" : "Egresos"}
                    </span>
                  )}
                />
                <Bar dataKey="recaudado" fill="#00d4aa" radius={[4, 4, 0, 0]} name="recaudado" />
                <Bar dataKey="egresos" fill="#f59e0b" radius={[4, 4, 0, 0]} name="egresos" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
