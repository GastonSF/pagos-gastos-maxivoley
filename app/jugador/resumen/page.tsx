"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, TrendingUp, TrendingDown, Wallet, LogOut, Volleyball, Home, History, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { createClient } from "@/lib/supabase/client"

const PLAYER_NAME = "Ramiro Suarez"
const CURRENT_MONTH = "Julio 2025"

const summaryData = {
  totalCollected: 48000,
  totalExpenses: 12000,
  monthlyBalance: 36000,
}

const confirmedPayments = [
  { name: "Ramiro Suarez", amount: 2000, date: "05/07" },
  { name: "Lucas Fernandez", amount: 2000, date: "03/07" },
  { name: "Martin Garcia", amount: 2000, date: "02/07" },
  { name: "Diego Lopez", amount: 2000, date: "01/07" },
  { name: "Pablo Rodriguez", amount: 2000, date: "30/06" },
  { name: "Andres Martinez", amount: 2000, date: "29/06" },
  { name: "Federico Sanchez", amount: 2000, date: "28/06" },
  { name: "Nicolas Perez", amount: 2000, date: "27/06" },
]

const monthlyExpenses = [
  { description: "Alquiler cancha (4 fechas)", amount: 8000 },
  { description: "Pelotas nuevas (x3)", amount: 2500 },
  { description: "Botiquin primeros auxilios", amount: 1500 },
]

const paymentChartData = [
  { name: "Pagaron", value: 18, color: "#00d4aa" },
  { name: "No pagaron", value: 6, color: "#f43f5e" },
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
  const paymentPercentage = Math.round(
    (paymentChartData[0].value / (paymentChartData[0].value + paymentChartData[1].value)) * 100
  )

  return (
    <div className="min-h-screen bg-background">
      <PlayerNavbar playerName={PLAYER_NAME} />

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
            Resumen del equipo — {CURRENT_MONTH}
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
                    ${summaryData.totalCollected.toLocaleString("es-AR")}
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
                    ${summaryData.totalExpenses.toLocaleString("es-AR")}
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
                  <p className="text-2xl font-semibold text-success">
                    ${summaryData.monthlyBalance.toLocaleString("es-AR")}
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
                {confirmedPayments.map((payment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="text-foreground">{payment.name}</p>
                      <p className="text-xs text-muted-foreground">{payment.date}</p>
                    </div>
                    <span className="text-primary font-medium">
                      ${payment.amount.toLocaleString("es-AR")}
                    </span>
                  </div>
                ))}
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
                {monthlyExpenses.map((expense, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <p className="text-foreground">{expense.description}</p>
                    <span className="text-warning font-medium">
                      -${expense.amount.toLocaleString("es-AR")}
                    </span>
                  </div>
                ))}
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
