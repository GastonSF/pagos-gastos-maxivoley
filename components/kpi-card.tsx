import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { type LucideIcon } from "lucide-react"

interface KpiCardProps {
  title: string
  value: string
  icon: LucideIcon
  accent: "teal" | "amber" | "rose" | "emerald"
  animationDelay?: number
  children?: React.ReactNode
}

const accentColors = {
  teal: "text-teal",
  amber: "text-amber",
  rose: "text-rose",
  emerald: "text-emerald",
}

const glowColors = {
  teal: "shadow-teal/20",
  amber: "shadow-amber/20",
  rose: "shadow-rose/20",
  emerald: "shadow-emerald/20",
}

export function KpiCard({ 
  title, 
  value, 
  icon: Icon, 
  accent, 
  animationDelay = 0,
  children 
}: KpiCardProps) {
  return (
    <Card 
      className={cn(
        "bg-card border-border shadow-lg animate-fade-in",
        glowColors[accent],
        animationDelay === 0 && "animate-fade-in-1",
        animationDelay === 1 && "animate-fade-in-2",
        animationDelay === 2 && "animate-fade-in-3",
        animationDelay === 3 && "animate-fade-in-4"
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className={cn("font-heading text-4xl tracking-wide", accentColors[accent])}>
              {value}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {children}
            <Icon className={cn("h-6 w-6", accentColors[accent])} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
