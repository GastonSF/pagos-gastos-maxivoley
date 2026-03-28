"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  ArrowUpCircle, 
  BarChart2,
  Menu,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/jugadores", icon: Users, label: "Jugadores" },
  { href: "/pagos", icon: CreditCard, label: "Pagos" },
  { href: "/egresos", icon: ArrowUpCircle, label: "Egresos" },
  { href: "/resumen", icon: BarChart2, label: "Resumen" },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile hamburger button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden text-foreground"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-60 bg-sidebar border-r border-sidebar-border transition-transform duration-300",
          "lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo area */}
          <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
            <span className="font-heading text-2xl tracking-wide text-foreground">
              MAXIVOLEY
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-teal"
                      : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive && "text-teal")} />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>
    </>
  )
}
