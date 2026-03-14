import { Link } from "wouter";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "") || "";

function KeroPromoLogo({ size = "md" }: { size?: "sm" | "md" }) {
  const dim = size === "sm" ? 36 : 44;
  const innerDim = size === "sm" ? 28 : 34;
  return (
    <div
      className="bg-[#25D366] flex items-center justify-center shrink-0"
      style={{ width: dim, height: dim, borderRadius: 10 }}
    >
      <img
        src={`${basePath}/images/kero-logo.png`}
        alt="KERO PROMO logo"
        width={innerDim}
        height={innerDim}
        className="object-contain"
        style={{ borderRadius: 6 }}
      />
    </div>
  );
}

export { KeroPromoLogo };

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <header className="sticky top-0 z-50 glass-panel border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <KeroPromoLogo />
            <span className="font-display font-bold text-2xl tracking-tight text-foreground">
              KERO<span className="text-primary">PROMO</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <a href={`${basePath}/#como-funciona`} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Como funciona</a>
            <a href={`${basePath}/#planos`} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Planos</a>
            <a href={`${basePath}/#faq`} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-foreground hover:text-primary transition-colors">
              Entrar
            </Link>
            <Link href="/cadastro" className="hidden sm:flex px-5 py-2.5 bg-lime-500 text-white rounded-xl font-bold hover:bg-lime-600 hover:shadow-lg hover:shadow-lime-500/20 transition-all">
              Teste Grátis
            </Link>
            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-lg">
            <nav className="flex flex-col px-4 py-4 gap-3">
              <a href={`${basePath}/#como-funciona`} className="text-sm font-medium text-foreground py-2" onClick={() => setMobileMenuOpen(false)}>Como funciona</a>
              <a href={`${basePath}/#planos`} className="text-sm font-medium text-foreground py-2" onClick={() => setMobileMenuOpen(false)}>Planos</a>
              <a href={`${basePath}/#faq`} className="text-sm font-medium text-foreground py-2" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
              <Link href="/cadastro" className="mt-2 px-5 py-2.5 bg-lime-500 text-white rounded-xl font-bold text-center" onClick={() => setMobileMenuOpen(false)}>
                Teste Grátis
              </Link>
            </nav>
          </div>
        )}
      </header>
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <footer className="bg-[#111] text-gray-300 border-t border-border/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <KeroPromoLogo size="sm" />
                <span className="font-display font-bold text-xl text-white">KERO<span className="text-primary">PROMO</span></span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed max-w-md">
                A plataforma que conecta empreendedores digitais aos maiores marketplaces do Brasil. Automatize seus grupos de WhatsApp e ganhe comissões como afiliado.
              </p>
              <div className="flex gap-4 mt-6">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-primary/20 transition-colors" aria-label="Instagram">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-primary/20 transition-colors" aria-label="TikTok">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.76a8.28 8.28 0 004.76 1.5v-3.4a4.85 4.85 0 01-1-.17z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-primary/20 transition-colors" aria-label="YouTube">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-[#25D366]/20 transition-colors" aria-label="WhatsApp">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Produto</h4>
              <ul className="space-y-3">
                <li><a href={`${basePath}/#como-funciona`} className="text-sm text-gray-400 hover:text-white transition-colors">Como funciona</a></li>
                <li><a href={`${basePath}/#planos`} className="text-sm text-gray-400 hover:text-white transition-colors">Planos</a></li>
                <li><a href={`${basePath}/#faq`} className="text-sm text-gray-400 hover:text-white transition-colors">FAQ</a></li>
                <li><Link href="/cadastro" className="text-sm text-gray-400 hover:text-white transition-colors">Cadastre-se</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Privacidade</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Contato</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 space-y-6">
            <div className="flex flex-wrap items-center gap-4 justify-center">
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Formas de pagamento:</span>
              <div className="flex gap-3">
                <span className="px-3 py-1.5 bg-white/10 rounded-lg text-xs font-bold text-gray-300">VISA</span>
                <span className="px-3 py-1.5 bg-white/10 rounded-lg text-xs font-bold text-gray-300">MASTERCARD</span>
                <span className="px-3 py-1.5 bg-white/10 rounded-lg text-xs font-bold text-gray-300">ELO</span>
                <span className="px-3 py-1.5 bg-[#25D366]/20 rounded-lg text-xs font-bold text-[#25D366]">PIX</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 justify-center">
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Selos:</span>
              <div className="flex gap-3">
                <span className="px-3 py-1.5 bg-blue-900/30 rounded-lg text-xs font-bold text-blue-400 border border-blue-800/30">Buscape Certificado</span>
                <span className="px-3 py-1.5 bg-green-900/30 rounded-lg text-xs font-bold text-green-400 border border-green-800/30">Google Site Seguro</span>
              </div>
            </div>

            <div className="text-center space-y-2">
              <p className="text-xs text-gray-500">
                KERO PROMO TECNOLOGIA LTDA — CNPJ: 00.000.000/0001-00 — Rua Exemplo, 123 — Belo Horizonte/MG — CEP 30000-000
              </p>
              <p className="text-xs text-gray-600">
                A KERO PROMO atua como plataforma de automação para afiliados. Os valores de comissão são definidos pelos marketplaces parceiros e podem variar. Resultados individuais dependem do desempenho de cada empreendedor.
              </p>
              <p className="text-xs text-gray-600">
                © 2026 KERO PROMO. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
