import { Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PaymentsDonutChart } from "@/components/payments-donut-chart"

const confirmedPayments = [
  { nombre: "Ramiro Suarez", monto: 2000, fecha: "25/07/2025" },
  { nombre: "Ezequiel Morales", monto: 2000, fecha: "23/07/2025" },
  { nombre: "Matias Herrera", monto: 2000, fecha: "21/07/2025" },
  { nombre: "Agustin Perez", monto: 2000, fecha: "20/07/2025" },
  { nombre: "Lucia Martinez", monto: 2000, fecha: "19/07/2025" },
  { nombre: "Fernando Lopez", monto: 2000, fecha: "18/07/2025" },
]

const expenses = [
  { descripcion: "Honorarios tecnico", monto: 8000 },
  { descripcion: "Alquiler de cancha", monto: 3000 },
  { descripcion: "Pelotas de competicion", monto: 1000 },
]

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString('es-AR')}`
}

export default function ResumenPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-4xl tracking-wide text-foreground">
          RESUMEN DEL EQUIPO — JULIO 2025
        </h1>
        <p className="text-muted-foreground mt-1">
          Esta informacion es publica para todos los miembros del equipo.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
        <Card className="bg-card border-border animate-fade-in animate-fade-in-1">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total Recaudado</p>
            <p className="font-heading text-4xl tracking-wide text-teal mt-2">
              $48.000
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border animate-fade-in animate-fade-in-2">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total Egresos</p>
            <p className="font-heading text-4xl tracking-wide text-amber mt-2">
              $12.000
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border animate-fade-in animate-fade-in-3">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Saldo del Mes</p>
            <p className="font-heading text-4xl tracking-wide text-emerald mt-2">
              $36.000
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
              PAGOS CONFIRMADOS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {confirmedPayments.map((payment, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div>
                    <p className="font-medium text-foreground">{payment.nombre}</p>
                    <p className="text-xs text-muted-foreground">{payment.fecha}</p>
                  </div>
                  <span className="font-heading text-lg text-teal">
                    {formatCurrency(payment.monto)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Expenses List */}
        <Card className="bg-card border-border animate-fade-in animate-fade-in-2">
          <CardHeader>
            <CardTitle className="font-heading text-xl tracking-wide text-foreground">
              EGRESOS DEL MES
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expenses.map((expense, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <p className="font-medium text-foreground">{expense.descripcion}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-teal hover:text-teal hover:bg-teal/10"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Ver comprobante</span>
                    </Button>
                  </div>
                  <span className="font-heading text-lg text-amber">
                    {formatCurrency(expense.monto)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Donut Chart */}
      <PaymentsDonutChart />

      {/* Footer Note */}
      <p className="text-center text-sm text-muted-foreground">
        Pagos y Gastos MaxiVoley - Resumen generado automaticamente cada mes.
      </p>
    </div>
  )
}
