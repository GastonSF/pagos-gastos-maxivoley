"use client"

import { useState } from "react"
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

type PaymentStatus = "confirmado" | "pendiente" | "sin-comprobante"

interface Payment {
  jugador: string
  dni: string
  mes: string
  fechaSubida: string | null
  comprobante: string | null
  estado: PaymentStatus
}

const payments: Payment[] = [
  {
    jugador: "Ramiro Suarez",
    dni: "38291045",
    mes: "Julio 2025",
    fechaSubida: "25/07/2025",
    comprobante: "comprobante_suarez_jul25.pdf",
    estado: "confirmado",
  },
  {
    jugador: "Valentina Rios",
    dni: "41023876",
    mes: "Julio 2025",
    fechaSubida: "24/07/2025",
    comprobante: "comprobante_rios_jul25.jpg",
    estado: "pendiente",
  },
  {
    jugador: "Ezequiel Morales",
    dni: "36748291",
    mes: "Julio 2025",
    fechaSubida: "23/07/2025",
    comprobante: "comprobante_morales_jul25.pdf",
    estado: "confirmado",
  },
  {
    jugador: "Luciana Ferreyra",
    dni: "39182034",
    mes: "Julio 2025",
    fechaSubida: "22/07/2025",
    comprobante: "comprobante_ferreyra_jul25.png",
    estado: "pendiente",
  },
  {
    jugador: "Matias Herrera",
    dni: "40293847",
    mes: "Julio 2025",
    fechaSubida: "21/07/2025",
    comprobante: "comprobante_herrera_jul25.pdf",
    estado: "confirmado",
  },
  {
    jugador: "Sofia Blanco",
    dni: "37654321",
    mes: "Julio 2025",
    fechaSubida: null,
    comprobante: null,
    estado: "sin-comprobante",
  },
  {
    jugador: "Nicolas Vega",
    dni: "35987654",
    mes: "Julio 2025",
    fechaSubida: "20/07/2025",
    comprobante: "comprobante_vega_jul25.pdf",
    estado: "pendiente",
  },
  {
    jugador: "Camila Torres",
    dni: "42109876",
    mes: "Julio 2025",
    fechaSubida: null,
    comprobante: null,
    estado: "sin-comprobante",
  },
]

export default function PagosPage() {
  const [selectedMonth, setSelectedMonth] = useState("julio-2025")
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)

  const confirmados = payments.filter((p) => p.estado === "confirmado").length
  const pendientes = payments.filter((p) => p.estado === "pendiente").length
  const sinComprobante = payments.filter((p) => p.estado === "sin-comprobante").length

  const openReceiptModal = (payment: Payment) => {
    setSelectedPayment(payment)
    setModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="font-heading text-4xl tracking-wide text-foreground">
          PAGOS DEL MES
        </h1>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[180px] bg-card border-border text-foreground">
            <SelectValue placeholder="Seleccionar mes" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="abril-2025" className="text-foreground">Abril 2025</SelectItem>
            <SelectItem value="mayo-2025" className="text-foreground">Mayo 2025</SelectItem>
            <SelectItem value="junio-2025" className="text-foreground">Junio 2025</SelectItem>
            <SelectItem value="julio-2025" className="text-foreground">Julio 2025</SelectItem>
          </SelectContent>
        </Select>
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
              {payments.map((payment, index) => (
                <TableRow 
                  key={payment.dni} 
                  className={`border-border hover:bg-secondary/50 ${index % 2 === 1 ? 'bg-secondary/20' : ''}`}
                >
                  <TableCell className="font-medium text-foreground">
                    {payment.jugador}
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-sm">
                    {payment.dni}
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden sm:table-cell">
                    {payment.mes}
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden md:table-cell">
                    {payment.fechaSubida || "-"}
                  </TableCell>
                  <TableCell>
                    {payment.comprobante ? (
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
                      >
                        Confirmar Pago
                      </Button>
                    ) : payment.estado === "confirmado" ? (
                      <span className="text-muted-foreground text-sm">Ya confirmado</span>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Receipt Modal */}
      {selectedPayment && (
        <ReceiptModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          filename={selectedPayment.comprobante || ""}
          uploadDate={selectedPayment.fechaSubida || ""}
          playerName={selectedPayment.jugador}
        />
      )}
    </div>
  )
}
