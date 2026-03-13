import { Link } from "wouter";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <header className="sticky top-0 z-50 glass-panel border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <img 
              src={`${import.meta.env.BASE_URL}images/logo-mark.png`} 
              alt="PEGAPROMO" 
              className="w-10 h-10 group-hover:scale-105 transition-transform" 
            />
            <span className="font-display font-bold text-2xl tracking-tight text-foreground">
              PEGA<span className="text-primary">PROMO</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/#como-funciona" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Como funciona</Link>
            <Link href="/precos" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Planos</Link>
            <Link href="/faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">FAQ</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-foreground hover:text-primary transition-colors">
              Entrar
            </Link>
            <Link href="/cadastro" className="hidden sm:flex px-5 py-2.5 bg-foreground text-background rounded-xl font-bold hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/20 transition-all">
              Teste Grátis
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <footer className="bg-foreground text-muted py-12 border-t border-border/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="font-display font-bold text-white text-sm">P</span>
            </div>
            <span className="font-display font-bold text-xl">PEGAPROMO</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 PEGAPROMO. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="text-muted-foreground hover:text-white transition-colors text-sm">Termos</a>
            <a href="#" className="text-muted-foreground hover:text-white transition-colors text-sm">Privacidade</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
