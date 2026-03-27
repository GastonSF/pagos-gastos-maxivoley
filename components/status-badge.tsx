import { cn } from "@/lib/utils"

type BadgeStatus = "pendiente" | "confirmado" | "activo" | "rechazado" | "sin-comprobante"

interface StatusBadgeProps {
  status: BadgeStatus
  className?: string
}

const badgeConfig: Record<BadgeStatus, { label: string; color: string; bgColor: string; hasPulse?: boolean }> = {
  pendiente: {
    label: "Pendiente",
    color: "text-amber",
    bgColor: "bg-amber/20",
    hasPulse: true,
  },
  confirmado: {
    label: "Confirmado",
    color: "text-emerald",
    bgColor: "bg-emerald/20",
  },
  activo: {
    label: "Activo",
    color: "text-emerald",
    bgColor: "bg-emerald/20",
  },
  rechazado: {
    label: "Rechazado",
    color: "text-rose",
    bgColor: "bg-rose/20",
  },
  "sin-comprobante": {
    label: "Sin comprobante",
    color: "text-muted-foreground",
    bgColor: "bg-muted/50",
  },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = badgeConfig[status]

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
        config.bgColor,
        config.color,
        className
      )}
    >
      {config.hasPulse && (
        <span className={cn("h-1.5 w-1.5 rounded-full animate-pulse-dot", config.color.replace("text-", "bg-"))} />
      )}
      {config.label}
    </span>
  )
}
