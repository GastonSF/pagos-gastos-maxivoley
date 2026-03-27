"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, ArrowLeft, Check, X, Minus, LogOut, Volleyball, Home, History, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { createClient } from "@/lib/supabase/client"

const PLAYER_NAME = "Ramiro Suarez"

interface PaymentRecord {
  month: string
  status: "confirmado" | "no_presentado"
  hasReceipt: boolean
  confirmationDate: string | null
}

const paymentHistory: PaymentRecord[] = [
  { month: "Julio 2025", status: "confirmado", hasReceipt: true, confirmationDate: "05/07/2025" },
  { month: "Junio 2025", status: "confirmado", hasReceipt: true, confirmationDate: "07/06/2025" },
  { month: "Mayo 2025", status: "confirmado", hasReceipt: true, confirmationDate: "03/05/2025" },
  { month: "Abril 2025", status: "no_presentado", hasReceipt: false, confirmationDate: null },
  { month: "Marzo 2025", status: "confirmado", hasReceipt: true, confirmationDate: "04/03/2025" },
  { month: "Febrero 2025", status: "confirmado", hasReceipt: true, confirmationDate: "06/02/2025" },
]

const totalPaid = paymentHistory.filter((p) => p.status === "confirmado").length
const totalMonths = paymentHistory.length
const totalAmount = totalPaid * 2000

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
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium bg-primary/10 text-primary"
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">Historial</span>
            </Link>
            <Link
              href="/jugador/resumen"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
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

export default function HistorialPage() {
  return (
    <div className="min-h-screen bg-background">
      <PlayerNavbar playerName={PLAYER_NAME} />

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Link
          href="/jugador/mi-pago"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 animate-fade-in"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Mi Pago
        </Link>

        <h1 className="font-display text-3xl tracking-wide text-foreground mb-6 animate-fade-in animate-fade-in-delay-1">
          MI HISTORIAL DE PAGOS
        </h1>

        <Card className="bg-card border-border mb-6 animate-fade-in animate-fade-in-delay-2">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Mes</TableHead>
                  <TableHead className="text-muted-foreground">Estado</TableHead>
                  <TableHead className="text-muted-foreground text-center">Comprobante</TableHead>
                  <TableHead className="text-muted-foreground text-right">Fecha de confirmacion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentHistory.map((record, index) => (
                  <TableRow 
                    key={record.month} 
                    className="border-border hover:bg-muted/30"
                    style={{ animationDelay: `${(index + 3) * 100}ms` }}
                  >
                    <TableCell className="text-foreground font-medium">
                      {record.month}
                    </TableCell>
                    <TableCell>
                      {record.status === "confirmado" ? (
                        <span className="inline-flex items-center gap-1.5 text-success">
                          <Check className="h-4 w-4" />
                          Confirmado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-destructive">
                          <X className="h-4 w-4" />
                          No presentado
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {record.hasReceipt ? (
                        <button className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted transition-colors text-primary">
                          <Eye className="h-4 w-4" />
                        </button>
                      ) : (
                        <Minus className="h-4 w-4 text-muted-foreground mx-auto" />
                      )}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {record.confirmationDate || "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="bg-card border-border animate-fade-in animate-fade-in-delay-5">
          <CardContent className="py-4">
            <p className="text-center text-muted-foreground">
              <span className="text-foreground font-semibold">{totalPaid} de {totalMonths}</span> meses pagados - 
              <span className="text-primary font-semibold"> ${totalAmount.toLocaleString("es-AR")}</span> abonados en total
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
