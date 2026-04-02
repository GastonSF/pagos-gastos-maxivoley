"use client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FileText, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

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
  const isImage = filename.match(/\.(jpg|jpeg|png)$/i)
  const isPdf = filename.match(/\.pdf$/i)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border text-foreground max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl tracking-wide">
            COMPROBANTE DE PAGO
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="aspect-[3/4] bg-secondary/50 rounded-lg flex flex-col items-center justify-center border border-border overflow-hidden">
            {isImage ? (
              <img 
                src={filename} 
                alt="Comprobante" 
                className="w-full h-full object-contain"
              />
            ) : isPdf ? (
              <iframe
                src={filename}
                className="w-full h-full"
                title="Comprobante PDF"
              />
            ) : (
              <>
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-sm">Vista previa no disponible</p>
              </>
            )}
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Jugador:</span>
              <span className="text-foreground font-medium">{playerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fecha de subida:</span>
              <span className="text-foreground">{uploadDate}</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.open(filename, "_blank")}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Abrir en nueva pestaña
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
