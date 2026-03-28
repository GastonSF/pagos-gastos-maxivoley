"use client"

import { useEffect, useState } from "react"
import { Eye, Trash2, Loader2 } from "lucide-react"
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
import { createClient } from "@/lib/supabase/client"

interface Egreso {
  id: string
  descripcion: string
  monto: number
  mes: number
  anio: number
  comprobante_url?: string
  created_at: string
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

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString('es-AR')}`
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

export default function EgresosPage() {
  const [egresos, setEgresos] = useState<Egreso[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  
  const now = new Date()
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(now.getFullYear())
  
  // Form state
  const [descripcion, setDescripcion] = useState("")
  const [monto, setMonto] = useState("")
  const [formMonth, setFormMonth] = useState(now.getMonth() + 1)
  const [formYear, setFormYear] = useState(now.getFullYear())
  
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedEgreso, setSelectedEgreso] = useState<Egreso | null>(null)

  const supabase = createClient()

  const fetchEgresos = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("egresos")
      .select("*")
      .eq("mes", selectedMonth)
      .eq("anio", selectedYear)
      .order("created_at", { ascending: false })

    if (!error && data) {
      setEgresos(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchEgresos()
  }, [selectedMonth, selectedYear])

  const totalEgresos = egresos.reduce((sum, e) => sum + (e.monto || 0), 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!descripcion.trim() || !monto) return

    setSubmitting(true)
    const { error } = await supabase.from("egresos").insert({
      descripcion: descripcion.trim(),
      monto: parseFloat(monto),
      mes: formMonth,
      anio: formYear,
    })

    if (!error) {
      setDescripcion("")
      setMonto("")
      // Refresh if viewing the same month/year
      if (formMonth === selectedMonth && formYear === selectedYear) {
        fetchEgresos()
      }
    }
    setSubmitting(false)
  }

  const handleDelete = async (id: string) => {
    setDeleting(id)
    const { error } = await supabase.from("egresos").delete().eq("id", id)
    if (!error) {
      setEgresos(egresos.filter((e) => e.id !== id))
    }
    setDeleting(null)
  }

  const openReceiptModal = (egreso: Egreso) => {
    setSelectedEgreso(egreso)
    setModalOpen(true)
  }

  const currentMonthName = MONTHS.find((m) => m.value === selectedMonth)?.label || ""
  const years = [2024, 2025, 2026]

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
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="descripcion" className="text-foreground">
                  Descripcion
                </Label>
                <Input
                  id="descripcion"
                  placeholder="Ej: Honorarios tecnico"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                  required
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
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    className="pl-7 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>
              </div>

              {/* Month Selector */}
              <div className="space-y-2">
                <Label className="text-foreground">Mes</Label>
                <Select
                  value={formMonth.toString()}
                  onValueChange={(v) => setFormMonth(parseInt(v))}
                >
                  <SelectTrigger className="bg-secondary border-border text-foreground">
                    <SelectValue placeholder="Seleccionar mes" />
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
              </div>

              {/* Year Selector */}
              <div className="space-y-2">
                <Label className="text-foreground">Anio</Label>
                <Select
                  value={formYear.toString()}
                  onValueChange={(v) => setFormYear(parseInt(v))}
                >
                  <SelectTrigger className="bg-secondary border-border text-foreground">
                    <SelectValue placeholder="Seleccionar anio" />
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

            {/* File Upload */}
            <div className="space-y-2">
              <Label className="text-foreground">Comprobante (opcional)</Label>
              <FileUploadZone />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-teal text-primary-foreground hover:bg-teal/90 font-medium"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registrando...
                </>
              ) : (
                "Registrar Egreso"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-4">
        <Select
          value={selectedMonth.toString()}
          onValueChange={(v) => setSelectedMonth(parseInt(v))}
        >
          <SelectTrigger className="w-40 bg-secondary border-border text-foreground">
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
          <SelectTrigger className="w-28 bg-secondary border-border text-foreground">
            <SelectValue placeholder="Anio" />
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

      {/* Expenses List */}
      <Card className="bg-card border-border animate-fade-in animate-fade-in-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-heading text-xl tracking-wide text-foreground">
            EGRESOS DE {currentMonthName.toUpperCase()} {selectedYear}
          </CardTitle>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-amber/20 text-amber">
            Total: {formatCurrency(totalEgresos)}
          </span>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-teal" />
            </div>
          ) : egresos.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No hay egresos registrados para {currentMonthName} {selectedYear}
            </div>
          ) : (
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
                {egresos.map((egreso, index) => (
                  <TableRow
                    key={egreso.id}
                    className={`border-border hover:bg-secondary/50 ${
                      index % 2 === 1 ? "bg-secondary/20" : ""
                    }`}
                  >
                    <TableCell className="font-medium text-foreground">
                      {egreso.descripcion}
                    </TableCell>
                    <TableCell className="font-heading text-lg text-amber">
                      {formatCurrency(egreso.monto)}
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden sm:table-cell">
                      {formatDate(egreso.created_at)}
                    </TableCell>
                    <TableCell>
                      {egreso.comprobante_url ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-teal hover:text-teal hover:bg-teal/10"
                          onClick={() => openReceiptModal(egreso)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Ver comprobante</span>
                        </Button>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-rose hover:text-rose hover:bg-rose/10"
                        disabled={deleting === egreso.id}
                        onClick={() => handleDelete(egreso.id)}
                      >
                        {deleting === egreso.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
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
          )}
        </CardContent>
      </Card>

      {/* Receipt Modal */}
      {selectedEgreso && selectedEgreso.comprobante_url && (
        <ReceiptModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          filename={selectedEgreso.comprobante_url}
          uploadDate={formatDate(selectedEgreso.created_at)}
          playerName={selectedEgreso.descripcion}
        />
      )}
    </div>
  )
}
