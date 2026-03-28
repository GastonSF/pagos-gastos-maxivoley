"use client"

import { useEffect, useState } from "react"
import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { StatusBadge } from "@/components/status-badge"
import { ReceiptModal } from "@/components/receipt-modal"
import { Spinner } from "@/components/ui/spinner"
import { createClient } from "@/lib/supabase/client"

type PaymentStatus = "confirmado" | "pendiente" | "sin-comprobante"

interface Payment {
  id: string
  jugador_id: string
  jugador_nombre: string
  jugador_dni: string
  mes: number
  anio: number
  fecha_subida: string | null
  comprobante_url: string | null
  estado: PaymentStatus
}

const MONTHS = [
  { value: 1, label: "Enero" },
  { value: 2, label: "Febrero" },
  { value: 3, label: "Marzo" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Mayo" },
  { value: 6, label: "Junio" },
  { value: 7, label: "Julio" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Septiembre" },
  { value: 10, label: "Octubre" },
  { value: 11, label: "Noviembre" },
  { value: 12, label: "Diciembre" },
]

export default function PagosPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [confirming, setConfirming] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  
  const now = new Date()
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(now.getFullYear())

  const supabase = createClient()

  const fetchPayments = async () => {
    setLoading(true)
    
    const { data, error } = await supabase
      .from("pagos")
      .select(`
        id,
        jugador_id,
        mes,
        anio,
        fecha_subida,
        comprobante_url,
        estado,
        usuarios!inner (
          nombre,
          dni
        )
      `)
      .eq("mes", selectedMonth)
      .eq("anio", selectedYear)
      .order("fecha_subida", { ascending: false, nullsFirst: false })

    if (error) {
      console.error("Error fetching payments:", error)
      setLoading(false)
      return
    }

    const formattedPayments: Payment[] = (data || []).map((p: {
      id: string
      jugador_id: string
      mes: number
      anio: number
      fecha_subida: string | null
      comprobante_url: string | null
      estado: PaymentStatus
      usuarios: { nombre: string; dni: string }
    }) => ({
      id: p.id,
      jugador_id: p.jugador_id,
      jugador_nombre: p.usuarios.nombre,
      jugador_dni: p.usuarios.dni,
      mes: p.mes,
      anio: p.anio,
      fecha_subida: p.fecha_subida,
      comprobante_url: p.comprobante_url,
      estado: p.estado,
    }))

    setPayments(formattedPayments)
    setLoading(false)
  }

  useEffect(() => {
    fetchPayments()
  }, [selectedMonth, selectedYear])

  const confirmPayment = async (paymentId: string) => {
    setConfirming(paymentId)
    
    const { error } = await supabase
      .from("pagos")
      .update({ estado: "confirmado" })
      .eq("id", paymentId)

    if (error) {
      console.error("Error confirming payment:", error)
      setConfirming(null)
      return
    }

    setPayments((prev) =>
      prev.map((p) =>
        p.id === paymentId ? { ...p, estado: "confirmado" as PaymentStatus } : p
      )
    )
    setConfirming(null)
  }

  const openReceiptModal = (payment: Payment) => {
    setSelectedPayment(payment)
    setModalOpen(true)
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-"
    const date = new Date(dateStr)
    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const getMonthLabel = (mes: number, anio: number) => {
    const month = MONTHS.find((m) => m.value === mes)
    return `${month?.label || ""} ${anio}`
  }

  const confirmados = payments.filter((p) => p.estado === "confirmado").length
  const pendientes = payments.filter((p) => p.estado === "pendiente").length
  const sinComprobante = payments.filter((p) => p.estado === "sin-comprobante").length

  const currentYear = now.getFullYear()
  const years = [currentYear - 1, currentYear, currentYear + 1]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner className="h-8 w-8 text-teal" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="font-heading text-4xl tracking-wide text-foreground">
          PAGOS DEL MES
        </h1>
        <div className="flex items-center gap-2">
          <Select 
            value={selectedMonth.toString()} 
            onValueChange={(v) => setSelectedMonth(parseInt(v))}
          >
            <SelectTrigger className="w-[140px] bg-card border-border text-foreground">
              <SelectValue placeholder="Mes" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {MONTHS.map((month) => (
                <SelectItem 
                  key={month.value} 
                  value={month.value.toString()} 
                  className="text-foreground"
                >
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select 
            value={selectedYear.toString()} 
            onValueChange={(v) => setSelectedYear(parseInt(v))}
          >
            <SelectTrigger className="w-[100px] bg-card border-border text-foreground">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {years.map((year) => (
                <SelectItem 
                  key={year} 
                  value={year.toString()} 
                  className="text-foreground"
                >
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-emerald font-medium">{confirmados} confirmados</span>
        <span className="text-muted-foreground">·</span>
        <span className="text-amber font-medium">{pendientes} pendientes</span>
        <span className="text-muted-foreground">·</span>
        <span className="text-rose font-medium">{sinComprobante} sin comprobante</span>
      </div>

      {/* Payments Table */}
      <Card className="bg-card border-border animate-fade-in">
        <CardHeader className="sr-only">
          <CardTitle>Lista de pagos</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Jugador</TableHead>
                <TableHead className="text-muted-foreground">DNI</TableHead>
                <TableHead className="text-muted-foreground hidden sm:table-cell">Mes</TableHead>
                <TableHead className="text-muted-foreground hidden md:table-cell">Fecha de subida</TableHead>
                <TableHead className="text-muted-foreground">Comprobante</TableHead>
                <TableHead className="text-muted-foreground">Estado</TableHead>
                <TableHead className="text-muted-foreground">Accion</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No hay pagos registrados para este mes
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((payment, index) => (
                  <TableRow 
                    key={payment.id} 
                    className={`border-border hover:bg-secondary/50 ${index % 2 === 1 ? 'bg-secondary/20' : ''}`}
                  >
                    <TableCell className="font-medium text-foreground">
                      {payment.jugador_nombre}
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-sm">
                      {payment.jugador_dni}
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden sm:table-cell">
                      {getMonthLabel(payment.mes, payment.anio)}
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden md:table-cell">
                      {formatDate(payment.fecha_subida)}
                    </TableCell>
                    <TableCell>
                      {payment.comprobante_url ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-teal hover:text-teal hover:bg-teal/10"
                          onClick={() => openReceiptModal(payment)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Ver comprobante</span>
                        </Button>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={payment.estado} />
                    </TableCell>
                    <TableCell>
                      {payment.estado === "pendiente" ? (
                        <Button 
                          size="sm" 
                          className="bg-teal text-primary-foreground hover:bg-teal/90 h-8"
                          onClick={() => confirmPayment(payment.id)}
                          disabled={confirming === payment.id}
                        >
                          {confirming === payment.id ? (
                            <Spinner className="h-4 w-4" />
                          ) : (
                            "Confirmar Pago"
                          )}
                        </Button>
                      ) : payment.estado === "confirmado" ? (
                        <span className="text-muted-foreground text-sm">Ya confirmado</span>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Receipt Modal */}
      {selectedPayment && (
        <ReceiptModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          filename={selectedPayment.comprobante_url || ""}
          uploadDate={formatDate(selectedPayment.fecha_subida)}
          playerName={selectedPayment.jugador_nombre}
        />
      )}
    </div>
  )
}
