"use client"

import Link from "next/link"
import { User, Circle } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      {/* Logo / Title */}
      <div className="text-center mb-12">
        <h1 className="font-heading text-6xl md:text-7xl tracking-wide text-foreground">
          PAGOS Y GASTOS
        </h1>
        <h2 className="font-heading text-5xl md:text-6xl tracking-wide text-teal mt-1">
          MAXIVÓLEY
        </h2>
      </div>

      {/* Role Selection Cards */}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-2xl">
        {/* Tecnico / Administración Card */}
        <Link
          href="/auth/login?role=tecnico"
          className="group flex-1 flex flex-col items-center justify-center gap-4 p-8 md:p-10 bg-card rounded-xl border border-border transition-all duration-300 hover:border-teal hover:bg-card/80 hover:shadow-lg hover:shadow-teal/10"
        >
          <div className="relative w-20 h-20 flex items-center justify-center rounded-full bg-secondary group-hover:bg-teal/20 transition-colors duration-300">
            <User className="w-10 h-10 text-muted-foreground group-hover:text-teal transition-colors duration-300" />
            <Circle className="absolute -bottom-1 -right-1 w-6 h-6 text-muted-foreground group-hover:text-teal transition-colors duration-300 fill-secondary group-hover:fill-teal/20" />
          </div>
          <span className="font-heading text-2xl md:text-3xl text-foreground group-hover:text-teal transition-colors duration-300 text-center">
            SOY TÉCNICO / ADMINISTRACIÓN
          </span>
        </Link>

        {/* Jugador Card */}
        <Link
          href="/auth/login?role=jugador"
          className="group flex-1 flex flex-col items-center justify-center gap-4 p-8 md:p-10 bg-card rounded-xl border border-border transition-all duration-300 hover:border-teal hover:bg-card/80 hover:shadow-lg hover:shadow-teal/10"
        >
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-secondary group-hover:bg-teal/20 transition-colors duration-300">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-10 h-10 text-muted-foreground group-hover:text-teal transition-colors duration-300"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              <path d="M2 12h20" />
            </svg>
          </div>
          <span className="font-heading text-2xl md:text-3xl text-foreground group-hover:text-teal transition-colors duration-300 text-center">
            SOY JUGADOR
          </span>
        </Link>
      </div>
    </div>
  )
}
