"use client"

import Link from "next/link"



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
          href="/auth/login"
          className="group flex-1 flex flex-col items-center justify-center gap-4 p-8 md:p-10 bg-card rounded-xl border border-border cursor-pointer transition-all duration-300 hover:border-teal hover:shadow-lg hover:shadow-teal/10"
        >
          <img 
            src="/tecnico.png" 
            alt="Tecnico" 
            className="w-28 h-28 object-contain group-hover:scale-105 transition-transform duration-300" 
          />
          <span className="font-heading text-2xl md:text-3xl text-foreground group-hover:text-teal transition-colors duration-300 text-center">
            SOY TÉCNICO / ADMINISTRACIÓN
          </span>
        </Link>

        {/* Jugador Card */}
        <Link
          href="/auth/login"
          className="group flex-1 flex flex-col items-center justify-center gap-4 p-8 md:p-10 bg-card rounded-xl border border-border cursor-pointer transition-all duration-300 hover:border-teal hover:shadow-lg hover:shadow-teal/10"
        >
          <span style={{ fontSize: "100px" }} className="group-hover:scale-105 transition-transform duration-300">
            🏐
          </span>
          <span className="font-heading text-2xl md:text-3xl text-foreground group-hover:text-teal transition-colors duration-300 text-center">
            SOY JUGADOR
          </span>
        </Link>
      </div>
    </div>
  )
}
