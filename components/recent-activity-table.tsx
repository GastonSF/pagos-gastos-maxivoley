import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatusBadge } from "@/components/status-badge"

const recentActivity = [
  { jugador: "Ramiro Suarez", fecha: "25/07/2025", estado: "confirmado" as const },
  { jugador: "Valentina Rios", fecha: "24/07/2025", estado: "pendiente" as const },
  { jugador: "Matias Herrera", fecha: "23/07/2025", estado: "confirmado" as const },
  { jugador: "Luciana Ferreyra", fecha: "22/07/2025", estado: "pendiente" as const },
  { jugador: "Sofia Blanco", fecha: "21/07/2025", estado: "confirmado" as const },
]

export function RecentActivityTable() {
  return (
    <Card className="bg-card border-border animate-fade-in animate-fade-in-4">
      <CardHeader>
        <CardTitle className="font-heading text-xl tracking-wide text-foreground">
          ULTIMOS COMPROBANTES SUBIDOS
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Jugador</TableHead>
              <TableHead className="text-muted-foreground">Fecha</TableHead>
              <TableHead className="text-muted-foreground">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentActivity.map((item, index) => (
              <TableRow 
                key={index} 
                className="border-border hover:bg-secondary/50"
              >
                <TableCell className="font-medium text-foreground">
                  {item.jugador}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {item.fecha}
                </TableCell>
                <TableCell>
                  <StatusBadge status={item.estado} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
