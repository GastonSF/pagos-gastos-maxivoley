"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CheckCircle, XCircle, Users, Clock, UserCheck, UserX, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Usuario {
  id: string
  nombre: string
  apellido: string
  dni: string
  telefono: string
  email: string
  estado: "pendiente" | "activo" | "rechazado"
  created_at: string
}

export default function JugadoresPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const fetchUsuarios = async () => {
    setLoading(true)
    setError(null)

    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("rol", "jugador")
      .order("created_at", { ascending: false })

    if (error) {
      setError("Error al cargar los jugadores")
      console.error("Error fetching usuarios:", error)
    } else {
      setUsuarios(data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchUsuarios()
  }, [])

  const handleAprobar = async (id: string) => {
    setActionLoading(id)

    const { error } = await supabase
      .from("usuarios")
      .update({ estado: "activo" })
      .eq("id", id)

    if (error) {
      console.error("Error approving user:", error)
      setError("Error al aprobar el jugador")
    } else {
      await fetchUsuarios()
    }

    setActionLoading(null)
  }

  const handleRechazar = async (id: string) => {
    setActionLoading(id)

    const { error } = await supabase
      .from("usuarios")
      .update({ estado: "rechazado" })
      .eq("id", id)

    if (error) {
      console.error("Error rejecting user:", error)
      setError("Error al rechazar el jugador")
    } else {
      await fetchUsuarios()
    }

    setActionLoading(null)
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return (
          <Badge className="bg-warning/20 text-warning border-warning/30">
            <Clock className="w-3 h-3 mr-1" />
            Pendiente
          </Badge>
        )
      case "activo":
        return (
          <Badge className="bg-success/20 text-success border-success/30">
            <UserCheck className="w-3 h-3 mr-1" />
            Activo
          </Badge>
        )
      case "rechazado":
        return (
          <Badge className="bg-destructive/20 text-destructive border-destructive/30">
            <UserX className="w-3 h-3 mr-1" />
            Rechazado
          </Badge>
        )
      default:
        return <Badge>{estado}</Badge>
    }
  }

  const pendientes = usuarios.filter((u) => u.estado === "pendiente").length
  const activos = usuarios.filter((u) => u.estado === "activo").length
  const rechazados = usuarios.filter((u) => u.estado === "rechazado").length

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-display text-4xl text-foreground tracking-wide">
              Gestion de Jugadores
            </h1>
            <p className="text-muted-foreground">
              Aprobar o rechazar solicitudes de registro
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/20">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{usuarios.length}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-warning/20">
                <Clock className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{pendientes}</p>
                <p className="text-sm text-muted-foreground">Pendientes</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-success/20">
                <UserCheck className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{activos}</p>
                <p className="text-sm text-muted-foreground">Activos</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-destructive/20">
                <UserX className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{rechazados}</p>
                <p className="text-sm text-muted-foreground">Rechazados</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/20 border border-destructive/30 rounded-lg text-destructive">
            {error}
          </div>
        )}

        {/* Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Lista de Jugadores</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Spinner className="w-8 h-8 text-primary" />
              </div>
            ) : usuarios.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No hay jugadores registrados
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-muted-foreground">Nombre</TableHead>
                    <TableHead className="text-muted-foreground">DNI</TableHead>
                    <TableHead className="text-muted-foreground">Telefono</TableHead>
                    <TableHead className="text-muted-foreground">Email</TableHead>
                    <TableHead className="text-muted-foreground">Estado</TableHead>
                    <TableHead className="text-muted-foreground text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usuarios.map((usuario) => (
                    <TableRow key={usuario.id} className="border-border">
                      <TableCell className="text-foreground font-medium">
                        {usuario.nombre} {usuario.apellido}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{usuario.dni}</TableCell>
                      <TableCell className="text-muted-foreground">{usuario.telefono}</TableCell>
                      <TableCell className="text-muted-foreground">{usuario.email}</TableCell>
                      <TableCell>{getEstadoBadge(usuario.estado)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {usuario.estado === "pendiente" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleAprobar(usuario.id)}
                                disabled={actionLoading === usuario.id}
                                className="bg-success hover:bg-success/90 text-success-foreground"
                              >
                                {actionLoading === usuario.id ? (
                                  <Spinner className="w-4 h-4" />
                                ) : (
                                  <>
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Aprobar
                                  </>
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRechazar(usuario.id)}
                                disabled={actionLoading === usuario.id}
                              >
                                {actionLoading === usuario.id ? (
                                  <Spinner className="w-4 h-4" />
                                ) : (
                                  <>
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Rechazar
                                  </>
                                )}
                              </Button>
                            </>
                          )}
                          {usuario.estado === "activo" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRechazar(usuario.id)}
                              disabled={actionLoading === usuario.id}
                              className="border-destructive/50 text-destructive hover:bg-destructive/10"
                            >
                              {actionLoading === usuario.id ? (
                                <Spinner className="w-4 h-4" />
                              ) : (
                                <>
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Desactivar
                                </>
                              )}
                            </Button>
                          )}
                          {usuario.estado === "rechazado" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAprobar(usuario.id)}
                              disabled={actionLoading === usuario.id}
                              className="border-success/50 text-success hover:bg-success/10"
                            >
                              {actionLoading === usuario.id ? (
                                <Spinner className="w-4 h-4" />
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Reactivar
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
