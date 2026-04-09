"use client"

import { useEffect, useState } from "react"
import { Trash2, Loader2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { FileUploadZone } from "@/components/file-upload-zone"
import { createClient } from "@/lib/supabase/client"

interface Ingreso {
  id: string
  descripcion: string
  monto: number
  mes: number
  anio: number
  nota?: string
  url_comprobante?: string
  fecha_carga: string
}

const MONTHS = [
  { value: 1, label: "Enero" }, { value: 2, label: "Febrero" },
  { value: 3, label: "Marzo" }, { value: 4, label: "Abril" },
  { value: 5, label: "Mayo" }, { value: 6, label: "Junio" },
  { value: 7, label: "Julio" }, { value: 8, label: "Agosto" },
  { value: 9, label: "Septiembre" }, { value: 10, label: "Octubre" },
  { value: 11, label: "Noviembre" }, { value: 12, label: "Diciembre" },
]

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString('es-AR')}`
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  })
}

export default function IngresosExtraPage() {
  const [ingresos, setIngresos] = useState<Ingreso[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const now = new Date()
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(now.getFullYear())
  const [descripcion, setDescripcion] = useState("")
  const [monto, setMonto] = useState("")
  const [nota, setNota] = useState("")
  const [formMonth, setFormMonth] = useState(now.getMonth() + 1)
  const [formYear, setFormYear] = useState(now.getFullYear())
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const supabase = createClient()
  const years = [2024, 2025, 2026]

  const fetchIngresos = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("ingresos")
      .select("*")
      .eq("mes", selectedMonth)
      .eq("anio", selectedYear)
      .order("fecha_carga", { ascending: false })
    if (!error && data) setIngresos(data)
    setLoading(false)
  }

  useEffect(() => { fetchIngresos() }, [selectedMonth, selectedYear])

  const totalIngresos = ingresos.reduce((sum, i) => sum + (i.monto || 0), 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!descripcion.trim() || !monto) return
    setSubmitting(true)

    let url_comprobante = null

    if (selectedFile) {
      const ext = selectedFile.name.split('.').pop()
      const fileName = `ingreso_${Date.now()}.${ext}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("comprobantes-ingresos")
        .upload(fileName, selectedFile)

      if (!uploadError && uploadData) {
        const { data: urlData } = supabase.storage
          .from("comprobantes-ingresos")
          .getPublicUrl(fileName)
        url_comprobante = urlData.publicUrl
      }
    }

    const { error } = await supabase.from("ingresos").insert({
      descripcion: descripcion.trim(),
      monto: parseFloat(monto),
      mes: formMonth,
      anio: formYear,
      nota: nota.trim() || null,
      url_comprobante,
    })

    if (!error) {
      setDescripcion("")
      setMonto("")
      setNota("")
      setSelectedFile(null)
      if (formMonth === selectedMonth && formYear === selectedYear) fetchIngresos()
    }
    setSubmitting(false)
  }

  const handleDelete = async (id: string) => {
    setDeleting(id)
    const { error } = await supabase.from("ingresos").delete().eq("id", id)
    if (!error) setIngresos(ingresos.filter((i) => i.id !== id))
    setDeleting(null)
  }

  const currentMonthName = MONTHS.find((m) => m.value === selectedMonth)?.label || ""

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-4xl tracking-wide text-foreground">
        INGRESOS EXTRA
      </h1>

      <Card className="bg-card border-border animate-fade-in">
        <CardHeader>
          <CardTitle className="font-heading text-xl tracking-wide text-foreground">
            REGISTRAR INGRESO EXTRA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-foreground">Descripción</Label>
                <Input
                  placeholder="Ej: Venta de empanadas"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Monto</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    type="number" step="0.01" min="0" placeholder="0.00"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    className="pl-7 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Mes</Label>
                <Select value={formMonth.toString()} onValueChange={(v) => setFormMonth(parseInt(v))}>
                  <SelectTrigger className="bg-secondary border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {MONTHS.map((m) => (
                      <SelectItem key={m.value} value={m.value.toString()} className="text-foreground">
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Año</Label>
                <Select value={formYear.toString()} onValueChange={(v) => setFormYear(parseInt(v))}>
                  <SelectTrigger className="bg-secondary border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {years.map((y) => (
                      <SelectItem key={y} value={y.toString()} className="text-foreground">
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Nota (opcional)</Label>
              <Textarea
                placeholder="Ej: Recaudado en el partido del sábado"
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                className="bg-secondary border-border text-foreground placeholder:text-muted-foreground resize-none"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Comprobante (opcional)</Label>
              <FileUploadZone onFileSelect={setSelectedFile} />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-teal text-white hover:bg-teal/90 font-medium"
            >
              {submitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Registrando...</>
              ) : (
                "Registrar Ingreso Extra"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-4">
        <Select value={selectedMonth.toString()} onValueChange={(v) => setSelectedMonth(parseInt(v))}>
          <SelectTrigger className="w-40 bg-secondary border-border text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {MONTHS.map((m) => (
              <SelectItem key={m.value} value={m.value.toString()} className="text-foreground">
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(parseInt(v))}>
          <SelectTrigger className="w-28 bg-secondary border-border text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {years.map((y) => (
              <SelectItem key={y} value={y.toString()} className="text-foreground">{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-card border-border animate-fade-in">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-heading text-xl tracking-wide text-foreground">
            INGRESOS DE {currentMonthName.toUpperCase()} {selectedYear}
          </CardTitle>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-teal/20 text-teal">
            Total: {formatCurrency(totalIngresos)}
          </span>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-teal" />
            </div>
          ) : ingresos.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No hay ingresos extra registrados para {currentMonthName} {selectedYear}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Descripción</TableHead>
                  <TableHead className="text-muted-foreground">Monto</TableHead>
                  <TableHead className="text-muted-foreground hidden sm:table-cell">Nota</TableHead>
                  <TableHead className="text-muted-foreground hidden sm:table-cell">Fecha</TableHead>
                  <TableHead className="text-muted-foreground">Comprobante</TableHead>
                  <TableHead className="text-muted-foreground">Eliminar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ingresos.map((ingreso, index) => (
                  <TableRow
                    key={ingreso.id}
                    className={`border-border hover:bg-secondary/50 ${index % 2 === 1 ? "bg-secondary/20" : ""}`}
                  >
                    <TableCell className="font-medium text-foreground">{ingreso.descripcion}</TableCell>
                    <TableCell className="font-heading text-lg text-teal">{formatCurrency(ingreso.monto)}</TableCell>
                    <TableCell className="text-muted-foreground hidden sm:table-cell">
                      {ingreso.nota || "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden sm:table-cell">
                      {formatDate(ingreso.fecha_carga)}
                    </TableCell>
                    <TableCell>
                      {ingreso.url_comprobante ? (
                        <Button
                          variant="ghost" size="icon"
                          className="h-8 w-8 text-teal hover:text-teal hover:bg-teal/10"
                          onClick={() => window.open(ingreso.url_comprobante, '_blank')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost" size="icon"
                        className="h-8 w-8 text-rose hover:text-rose hover:bg-rose/10"
                        disabled={deleting === ingreso.id}
                        onClick={() => handleDelete(ingreso.id)}
                      >
                        {deleting === ingreso.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="border-border bg-secondary/30 hover:bg-secondary/30">
                  <TableCell className="font-bold text-foreground">Total</TableCell>
                  <TableCell className="font-heading text-xl text-teal">{formatCurrency(totalIngresos)}</TableCell>
                  <TableCell className="hidden sm:table-cell" />
                  <TableCell className="hidden sm:table-cell" />
                  <TableCell />
                  <TableCell />
                </TableRow>
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
