"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FileText } from "lucide-react"

interface ReceiptModalProps {
  isOpen: boolean
  onClose: () => void
  filename: string
  uploadDate: string
  playerName: string
}

export function ReceiptModal({
  isOpen,
  onClose,
  filename,
  uploadDate,
  playerName,
}: ReceiptModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border text-foreground max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl tracking-wide">
            COMPROBANTE DE PAGO
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Placeholder receipt image */}
          <div className="aspect-[3/4] bg-secondary/50 rounded-lg flex flex-col items-center justify-center border border-border">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-sm">Vista previa del comprobante</p>
          </div>
          
          {/* Receipt details */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Jugador:</span>
              <span className="text-foreground font-medium">{playerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Archivo:</span>
              <span className="text-foreground font-mono text-xs">{filename}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fecha de subida:</span>
              <span className="text-foreground">{uploadDate}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
