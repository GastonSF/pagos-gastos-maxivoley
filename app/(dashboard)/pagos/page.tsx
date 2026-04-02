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
import { ReceiptModal } from "@/components/receipt-modal"
import { Spinner } from "@/components/ui/spinner"
import { createClient } from "@/lib/supabase/client"

type PaymentStatus = "confirmado" | "pendiente" | "rechazado" | "sin-comprobante"

interface Payment {
  id: string
  jugador_id: string
  jugador_nombre: string
  jugador_apellido: string
  jugador_dni: string
  mes: number
  anio: number
  monto: number
  numero_transferencia: string | null
  nota: string | null
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

function StatusBadge({ status }: { status: PaymentStatus }) {
  const config = {
    confirmado: {
      bg: "bg-emerald-500/20",
      text: "text-emerald-400",
      label: "Confirmado",
    },
    pendiente: {
      bg: "bg-amber-500/20",
      text: "text-amber-400",
      label: "Pendiente",
    },
    rechazado: {
      bg: "bg-rose-500/20",
      text: "text-rose-400",
      label: "Rechazado",
    },
    "sin-comprobante": {
      bg: "bg-slate-500/20",
      text: "text-slate-400",
      label: "Sin comprobante",
    },
  }

  const { bg, text, label } = config[status] || config["sin-comprobante"]

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
      {status === "pendiente" && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
        </span>
      )}
      {label}
    </span>
  )
}

export default function PagosPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  
  // Default to March 2026 as specified
  const [mesSeleccionado, setMesSeleccionado] = useState(3)
  const [anioSeleccionado, setAnioSeleccionado] = useState(2026)

  const supabase = createClient()

  const fetchPayments = async () => {
    setLoading(true)
    
    const { data, error } = await supabase
      .from("pagos")
      .select(`
        *,
        usuarios (
          nombre,
          apellido,
          dni
        )
      `)
      .eq("mes", Number(mesSeleccionado))
      .eq("anio", Number(anioSeleccionado))
      .order("fecha_subida", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching payments:", error)
      setLoading(false)
      return
    }

    console.log("[v0] Fetched payments:", data)

    const formattedPayments: Payment[] = (data || []).map((p: {
      id: string
      jugador_id: string
      mes: number
      anio: number
      monto: number
      numero_transferencia: string | null
      nota: string | null
      fecha_subida: string | null
      comprobante_url: string | null
      estado: PaymentStatus
      usuarios: { nombre: string; apellido: string; dni: string }
    }) => ({
      id: p.id,
      jugador_id: p.jugador_id,
      jugador_nombre: p.usuarios?.nombre || "",
      jugador_apellido: p.usuarios?.apellido || "",
      jugador_dni: p.usuarios?.dni || "",
      mes: p.mes,
      anio: p.anio,
      monto: p.monto,
      numero_transferencia: p.numero_transferencia,
      nota: p.nota,
      fecha_subida: p.fecha_subida,
      comprobante_url: p.url_comprobante,
      estado: p.estado,
    }))

    setPayments(formattedPayments)
    setLoading(false)
  }

  useEffect(() => {
    fetchPayments()
  }, [mesSeleccionado, anioSeleccionado])

  const updatePaymentStatus = async (paymentId: string, newStatus: "confirmado" | "rechazado") => {
    setUpdating(paymentId)
    
    const { error } = await supabase
      .from("pagos")
      .update({ estado: newStatus })
      .eq("id", paymentId)

    if (error) {
      console.error("[v0] Error updating payment:", error)
      setUpdating(null)
      return
    }

    setPayments((prev) =>
      prev.map((p) =>
        p.id === paymentId ? { ...p, estado: newStatus } : p
      )
    )
    setUpdating(null)
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

  const formatMonto = (monto: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(monto)
  }

  const confirmados = payments.filter((p) => p.estado === "confirmado").length
  const pendientes = payments.filter((p) => p.estado === "pendiente").length
  const rechazados = payments.filter((p) => p.estado === "rechazado").length

  const years = [2024, 2025, 2026, 2027]

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
            value={mesSeleccionado.toString()} 
            onValueChange={(v) => setMesSeleccionado(Number(v))}
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
            value={anioSeleccionado.toString()} 
            onValueChange={(v) => setAnioSeleccionado(Number(v))}
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
        <span className="text-emerald-400 font-medium">{confirmados} confirmados</span>
        <span className="text-muted-foreground">·</span>
        <span className="text-amber-400 font-medium">{pendientes} pendientes</span>
        <span className="text-muted-foreground">·</span>
        <span className="text-rose-400 font-medium">{rechazados} rechazados</span>
      </div>

      {/* Payments Table */}
      <Card className="bg-card border-border animate-fade-in">
        <CardHeader className="sr-only">
          <CardTitle>Lista de pagos</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Nombre y Apellido</TableHead>
                  <TableHead className="text-muted-foreground">DNI</TableHead>
                  <TableHead className="text-muted-foreground">Monto</TableHead>
                  <TableHead className="text-muted-foreground hidden md:table-cell">N° Transferencia</TableHead>
                  <TableHead className="text-muted-foreground hidden lg:table-cell">Nota</TableHead>
                  <TableHead className="text-muted-foreground">Estado</TableHead>
                  <TableHead className="text-muted-foreground hidden sm:table-cell">Fecha subida</TableHead>
                  <TableHead className="text-muted-foreground">Comprobante</TableHead>
                  <TableHead className="text-muted-foreground">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
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
                        {payment.jugador_nombre} {payment.jugador_apellido}
                      </TableCell>
                      <TableCell className="text-muted-foreground font-mono text-sm">
                        {payment.jugador_dni}
                      </TableCell>
                      <TableCell className="text-foreground font-medium">
                        {formatMonto(payment.monto)}
                      </TableCell>
                      <TableCell className="text-muted-foreground hidden md:table-cell">
                        {payment.numero_transferencia || "-"}
                      </TableCell>
                      <TableCell className="text-muted-foreground hidden lg:table-cell max-w-[150px] truncate">
                        {payment.nota || "-"}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={payment.estado} />
                      </TableCell>
                      <TableCell className="text-muted-foreground hidden sm:table-cell">
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
                        {payment.estado === "pendiente" ? (
                          <div className="flex items-center gap-2">
                            <Button 
                              size="sm" 
                              className="bg-emerald-600 text-white hover:bg-emerald-700 h-8"
                              onClick={() => updatePaymentStatus(payment.id, "confirmado")}
                              disabled={updating === payment.id}
                            >
                              {updating === payment.id ? (
                                <Spinner className="h-4 w-4" />
                              ) : (
                                "Confirmar"
                              )}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="border-rose-500 text-rose-400 hover:bg-rose-500/10 h-8"
                              onClick={() => updatePaymentStatus(payment.id, "rechazado")}
                              disabled={updating === payment.id}
                            >
                              Rechazar
                            </Button>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            {payment.estado === "confirmado" ? "Ya confirmado" : 
                             payment.estado === "rechazado" ? "Rechazado" : "-"}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Receipt Modal */}
      {selectedPayment && (
        <ReceiptModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          filename={selectedPayment.comprobante_url || ""}
          uploadDate={formatDate(selectedPayment.fecha_subida)}
          playerName={`${selectedPayment.jugador_nombre} ${selectedPayment.jugador_apellido}`}
        />
      )}
    </div>
  )
}
