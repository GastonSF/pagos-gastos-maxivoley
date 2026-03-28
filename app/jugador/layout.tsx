import Image from "next/image"

export default function JugadorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1">
        {children}
      </main>
      <footer className="px-6 py-4 border-t border-border flex items-center justify-center gap-3">
        <span className="text-xs text-muted-foreground">Craneado por</span>
        <a href="https://www.otra-forma.com" target="_blank" rel="noopener noreferrer">
          <Image src="/otra-forma.png" alt="Otra Forma" width={80} height={20} className="opacity-70 hover:opacity-100 transition-opacity" />
        </a>
      </footer>
    </div>
  )
}
