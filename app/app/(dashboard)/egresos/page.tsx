"use client"

import { useState } from "react"
import { Eye, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { FileUploadZone } from "@/components/file-upload-zone"
import { ReceiptModal } from "@/components/receipt-modal"

interface Expense {
  id: string
  descripcion: string
  monto: number
  fecha: string
  comprobante: string
}

const expenses: Expense[] = [
  {
    id: "1",
    descripcion: "Honorarios tecnico",
    monto: 8000,
    fecha: "01/07/2025",
    comprobante: "honorarios_jul25.pdf",
  },
  {
    id: "2",
    descripcion: "Alquiler de cancha",
    monto: 3000,
    fecha: "08/07/2025",
    comprobante: "alquiler_jul25.pdf",
  },
  {
    id: "3",
    descripcion: "Pelotas de competicion",
    monto: 1000,
    fecha: "15/07/2025",
    comprobante: "pelotas_jul25.pdf",
  },
]

const totalEgresos = expenses.reduce((sum, exp) => sum + exp.monto, 0)

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString('es-AR')}`
}

export default function EgresosPage() {
  const [selectedMonth, setSelectedMonth] = useState("julio-2025")
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)

  const openReceiptModal = (expense: Expense) => {
    setSelectedExpense(expense)
    setModalOpen(true)
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <h1 className="font-heading text-4xl tracking-wide text-foreground">
        EGRESOS DEL MES
      </h1>

      {/* New Expense Form */}
      <Card className="bg-card border-border animate-fade-in">
        <CardHeader>
          <CardTitle className="font-heading text-xl tracking-wide text-foreground">
            REGISTRAR NUEVO EGRESO
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="descripcion" className="text-foreground">
                Descripcion
              </Label>
              <Input
                id="descripcion"
                placeholder="Ej: Honorarios tecnico"
                className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="monto" className="text-foreground">
                Monto
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="monto"
                  type="number"
                  placeholder="0.00"
                  className="pl-7 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Month Selector */}
            <div className="space-y-2">
              <Label className="text-foreground">Mes</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="bg-secondary border-border text-foreground">
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
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label className="text-foreground">Comprobante</Label>
            <FileUploadZone />
          </div>

          {/* Submit Button */}
          <Button className="w-full bg-teal text-primary-foreground hover:bg-teal/90 font-medium">
            Registrar Egreso
          </Button>
        </CardContent>
      </Card>

      {/* Expenses List */}
      <Card className="bg-card border-border animate-fade-in animate-fade-in-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-heading text-xl tracking-wide text-foreground">
            EGRESOS DE JULIO 2025
          </CardTitle>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-amber/20 text-amber">
            Total: {formatCurrency(totalEgresos)}
          </span>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Descripcion</TableHead>
                <TableHead className="text-muted-foreground">Monto</TableHead>
                <TableHead className="text-muted-foreground hidden sm:table-cell">Fecha</TableHead>
                <TableHead className="text-muted-foreground">Comprobante</TableHead>
                <TableHead className="text-muted-foreground">Eliminar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense, index) => (
                <TableRow 
                  key={expense.id} 
                  className={`border-border hover:bg-secondary/50 ${index % 2 === 1 ? 'bg-secondary/20' : ''}`}
                >
                  <TableCell className="font-medium text-foreground">
                    {expense.descripcion}
                  </TableCell>
                  <TableCell className="font-heading text-lg text-amber">
                    {formatCurrency(expense.monto)}
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden sm:table-cell">
                    {expense.fecha}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-teal hover:text-teal hover:bg-teal/10"
                      onClick={() => openReceiptModal(expense)}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Ver comprobante</span>
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-rose hover:text-rose hover:bg-rose/10"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Eliminar egreso</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {/* Total Row */}
              <TableRow className="border-border bg-secondary/30 hover:bg-secondary/30">
                <TableCell className="font-bold text-foreground">Total</TableCell>
                <TableCell className="font-heading text-xl text-amber">
                  {formatCurrency(totalEgresos)}
                </TableCell>
                <TableCell className="hidden sm:table-cell" />
                <TableCell />
                <TableCell />
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Receipt Modal */}
      {selectedExpense && (
        <ReceiptModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          filename={selectedExpense.comprobante}
          uploadDate={selectedExpense.fecha}
          playerName={selectedExpense.descripcion}
        />
      )}
    </div>
  )
}
