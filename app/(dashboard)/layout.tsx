import { AppSidebar } from "@/components/app-sidebar"
import { AppNavbar } from "@/components/app-navbar"
import Image from "next/image"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppSidebar />
      <div className="lg:pl-60 flex flex-col flex-1">
        <AppNavbar />
        <main className="p-6 lg:p-8 flex-1">
          {children}
        </main>
        <footer className="lg:px-8 px-6 py-4 border-t border-border flex items-center justify-center gap-3">
          <span className="text-xs text-muted-foreground">Craneado por</span>
          <a href="https://www.otra-forma.com" target="_blank" rel="noopener noreferrer">
            <Image src="/otra-forma.png" alt="Otra Forma" width={80} height={20} className="opacity-70 hover:opacity-100 transition-opacity" />
          </a>
        </footer>
      </div>
    </div>
  )
}
