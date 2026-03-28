"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
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
import { StatusBadge } from "@/components/status-badge"

type PlayerStatus = "activo" | "pendiente" | "rechazado"

interface Player {
  nombre: string
  dni: string
  email: string
  telefono: string
  estado: PlayerStatus
}

const players: Player[] = [
  {
    nombre: "Ramiro Suarez",
    dni: "38291045",
    email: "ramiro.suarez@email.com",
    telefono: "+54 11 4567-8901",
    estado: "activo",
  },
  {
    nombre: "Valentina Rios",
    dni: "41023876",
    email: "valentina.rios@email.com",
    telefono: "+54 11 5678-9012",
    estado: "activo",
  },
  {
    nombre: "Ezequiel Morales",
    dni: "36748291",
    email: "ezequiel.morales@email.com",
    telefono: "+54 11 6789-0123",
    estado: "pendiente",
  },
  {
    nombre: "Luciana Ferreyra",
    dni: "39182034",
    email: "luciana.ferreyra@email.com",
    telefono: "+54 11 7890-1234",
    estado: "pendiente",
  },
  {
    nombre: "Matias Herrera",
    dni: "40293847",
    email: "matias.herrera@email.com",
    telefono: "+54 11 8901-2345",
    estado: "activo",
  },
  {
    nombre: "Sofia Blanco",
    dni: "37654321",
    email: "sofia.blanco@email.com",
    telefono: "+54 11 9012-3456",
    estado: "pendiente",
  },
  {
    nombre: "Nicolas Vega",
    dni: "35987654",
    email: "nicolas.vega@email.com",
    telefono: "+54 11 0123-4567",
    estado: "rechazado",
  },
  {
    nombre: "Camila Torres",
    dni: "42109876",
    email: "camila.torres@email.com",
    telefono: "+54 11 1234-5678",
    estado: "rechazado",
  },
]

export default function JugadoresPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPlayers = players.filter(
    (player) =>
      player.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.dni.includes(searchTerm)
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="font-heading text-4xl tracking-wide text-foreground">
            JUGADORES DEL EQUIPO
          </h1>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-teal/20 text-teal">
            24 jugadores
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre o DNI..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Players Table */}
      <Card className="bg-card border-border animate-fade-in">
        <CardHeader className="sr-only">
          <CardTitle>Lista de jugadores</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Nombre completo</TableHead>
                <TableHead className="text-muted-foreground">DNI</TableHead>
                <TableHead className="text-muted-foreground hidden md:table-cell">Email</TableHead>
                <TableHead className="text-muted-foreground hidden lg:table-cell">Telefono</TableHead>
                <TableHead className="text-muted-foreground">Estado</TableHead>
                <TableHead className="text-muted-foreground">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlayers.map((player, index) => (
                <TableRow 
                  key={player.dni} 
                  className={`border-border hover:bg-secondary/50 ${index % 2 === 1 ? 'bg-secondary/20' : ''}`}
                >
                  <TableCell className="font-medium text-foreground">
                    {player.nombre}
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-sm">
                    {player.dni}
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden md:table-cell">
                    {player.email}
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden lg:table-cell">
                    {player.telefono}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={player.estado} />
                  </TableCell>
                  <TableCell>
                    {player.estado === "pendiente" ? (
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          className="bg-teal text-primary-foreground hover:bg-teal/90 h-8"
                        >
                          Aprobar
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-rose text-rose hover:bg-rose/10 h-8"
                        >
                          Rechazar
                        </Button>
                      </div>
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
    </div>
  )
}
