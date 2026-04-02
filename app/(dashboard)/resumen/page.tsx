"use client"

import { useEffect, useState } from "react"
import { Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { createClient } from "@/lib/supabase/client"

interface PagoConfirmado {
  id: string
  monto: number
  fecha_subida: string
  usuarios: {
    nombre: string
    apellido: string
  }
}

interface Egreso {
  id: string
  descripcion: string
  monto: number
  comprobante_url?: string
}

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
]

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString('es-AR')}`
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-AR')
}

export default function ResumenPage() {
  const now = new Date()
  const [mesSeleccionado, setMesSeleccionado] = useState(now.getMonth() + 1)
  const [anioSeleccionado, setAnioSeleccionado] = useState(now.getFullYear())
  const [loading, setLoading] = useState(true)
  
  const [totalRecaudado, setTotalRecaudado] = useState(0)
  const [totalEgresos, setTotalEgresos] = useState(0)
  const [pagosConfirmados, setPagosConfirmados] = useState<PagoConfirmado[]>([])
  const [egresos, setEgresos] = useState<Egreso[]>([])
  const [jugadoresActivos, setJugadoresActivos] = useState(0)
  const [jugadoresQuePagaron, setJugadoresQuePagaron] = useState(0)

  const saldo = totalRecaudado - totalEgresos

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const supabase = createClient()

      // Fetch total recaudado (confirmed payments for selected month)
      const { data: pagosData } = await supabase
        .from("pagos")
        .select("monto, fecha_subida, id, usuarios(nombre, apellido)")
        .eq("estado", "confirmado")
        .eq("mes", mesSeleccionado)
        .eq("anio", anioSeleccionado)

      const recaudado = pagosData?.reduce((sum, p) => sum + (p.monto || 0), 0) || 0
      setTotalRecaudado(recaudado)
      setPagosConfirmados(pagosData as PagoConfirmado[] || [])
      setJugadoresQuePagaron(pagosData?.length || 0)

      // Fetch total egresos for selected month
      const { data: egresosData } = await supabase
        .from("egresos")
        .select("*")
        .eq("mes", mesSeleccionado)
        .eq("anio", anioSeleccionado)

      const egresosTotal = egresosData?.reduce((sum, e) => sum + (e.monto || 0), 0) || 0
      setTotalEgresos(egresosTotal)
      setEgresos(egresosData || [])

      // Fetch total jugadores activos
      const { count: activosCount } = await supabase
        .from("usuarios")
        .select("*", { count: "exact", head: true })
        .eq("rol", "jugador")
        .eq("estado", "activo")

      setJugadoresActivos(activosCount || 0)

      setLoading(false)
    }

    fetchData()
  }, [mesSeleccionado, anioSeleccionado])

  // Donut chart data
  const noPagaron = jugadoresActivos - jugadoresQuePagaron
  const donutData = [
    { name: "Pagaron", value: jugadoresQuePagaron, color: "#00d4aa" },
    { name: "No pagaron", value: noPagaron > 0 ? noPagaron : 0, color: "#f43f5e" },
  ]
  const totalJugadores = donutData.reduce((sum, item) => sum + item.value, 0)
  const percentage = totalJugadores > 0 ? Math.round((donutData[0].value / totalJugadores) * 100) : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner className="h-8 w-8 text-teal" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-4xl tracking-wide text-foreground">
            RESUMEN DEL EQUIPO — {MESES[mesSeleccionado - 1].toUpperCase()} {anioSeleccionado}
          </h1>
          <p className="text-muted-foreground mt-1">
            Esta informacion es publica para todos los miembros del equipo.
          </p>
        </div>
        <div className="flex gap-2">
          <Select
            value={String(mesSeleccionado)}
            onValueChange={(v) => setMesSeleccionado(Number(v))}
          >
            <SelectTrigger className="w-[140px] bg-card border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MESES.map((mes, index) => (
                <SelectItem key={index + 1} value={String(index + 1)}>
                  {mes}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={String(anioSeleccionado)}
            onValueChange={(v) => setAnioSeleccionado(Number(v))}
          >
            <SelectTrigger className="w-[100px] bg-card border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2026">2026</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 lg:gap-6">
        <Card className="bg-card border-border animate-fade-in animate-fade-in-1">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Jugadores Activos</p>
            <p className="font-heading text-4xl tracking-wide text-foreground mt-2">
              {jugadoresActivos}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border animate-fade-in animate-fade-in-1">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total Recaudado</p>
            <p className="font-heading text-4xl tracking-wide text-teal mt-2">
              {formatCurrency(totalRecaudado)}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border animate-fade-in animate-fade-in-2">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total Egresos</p>
            <p className="font-heading text-4xl tracking-wide text-amber mt-2">
              {formatCurrency(totalEgresos)}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border animate-fade-in animate-fade-in-3">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Saldo del Mes</p>
            <p className={`font-heading text-4xl tracking-wide mt-2 ${saldo >= 0 ? 'text-emerald' : 'text-rose-500'}`}>
              {formatCurrency(saldo)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Confirmed Payments */}
        <Card className="bg-card border-border animate-fade-in animate-fade-in-2">
          <CardHeader>
            <CardTitle className="font-heading text-xl tracking-wide text-foreground">
              PAGOS CONFIRMADOS ({pagosConfirmados.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pagosConfirmados.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No hay pagos confirmados para este mes.
              </p>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {pagosConfirmados.map((payment) => (
                  <div 
                    key={payment.id}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {payment.usuarios?.nombre} {payment.usuarios?.apellido}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(payment.fecha_subida)}
                      </p>
                    </div>
                    <span className="font-heading text-lg text-teal">
                      {formatCurrency(payment.monto)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expenses List */}
        <Card className="bg-card border-border animate-fade-in animate-fade-in-2">
          <CardHeader>
            <CardTitle className="font-heading text-xl tracking-wide text-foreground">
              EGRESOS DEL MES ({egresos.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {egresos.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No hay egresos registrados para este mes.
              </p>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {egresos.map((expense) => (
                  <div 
                    key={expense.id}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <p className="font-medium text-foreground">{expense.descripcion}</p>
                      {expense.comprobante_url && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-teal hover:text-teal hover:bg-teal/10"
                          onClick={() => window.open(expense.comprobante_url, '_blank')}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Ver comprobante</span>
                        </Button>
                      )}
                    </div>
                    <span className="font-heading text-lg text-amber">
                      {formatCurrency(expense.monto)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Donut Chart */}
      <Card className="bg-card border-border animate-fade-in animate-fade-in-3">
        <CardHeader>
          <CardTitle className="font-heading text-xl tracking-wide text-foreground">
            ESTADO DE PAGOS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-heading text-4xl text-teal">{percentage}%</span>
              <span className="text-muted-foreground text-sm">pago</span>
            </div>
          </div>
          {/* Legend */}
          <div className="flex justify-center gap-6 mt-4">
            {donutData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-muted-foreground">
                  {item.name} ({item.value})
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Footer Note */}
      <p className="text-center text-sm text-muted-foreground">
        Pagos y Gastos MaxiVoley - Resumen generado automaticamente cada mes.
      </p>
    </div>
  )
}
