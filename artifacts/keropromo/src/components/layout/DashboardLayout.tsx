import { Link, useLocation } from "wouter";
import { LayoutDashboard, ShoppingBag, Users, CalendarClock, History, Wallet, Settings, LogOut, Menu, X, ShieldAlert, CreditCard, Banknote, Coins, MessageSquare, Store } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "") || "";

export function DashboardLayout({ children, role: roleProp }: { children: React.ReactNode, role?: "admin" | "entrepreneur" | "collaborator" }) {
  const [location] = useLocation();
  const role = roleProp || (location.startsWith("/admin") ? "admin" : location.startsWith("/collaborator") ? "collaborator" : "entrepreneur");
  const { user, logout } = useAuth(true, role);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getLinks = () => {
    if (role === "admin") {
      return [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/ofertas", label: "Ofertas", icon: ShoppingBag },
        { href: "/admin/marketplaces", label: "Marketplaces", icon: Store },
        { href: "/admin/empreendedores", label: "Empreendedores", icon: Users },
        { href: "/admin/comissoes", label: "Comissões", icon: Coins },
        { href: "/admin/saques", label: "Saques (Pix)", icon: Banknote },
        { href: "/admin/assinaturas", label: "Assinaturas", icon: CreditCard },
      ];
    }
    if (role === "collaborator") {
      return [
        { href: "/collaborator", label: "Dashboard", icon: LayoutDashboard },
        { href: "/collaborator/grupos", label: "Meus Grupos", icon: MessageSquare },
        { href: "/collaborator/historico", label: "Histórico", icon: History },
      ];
    }
    return [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/dashboard/catalogo", label: "Catálogo de Ofertas", icon: ShoppingBag },
      { href: "/dashboard/grupos", label: "Meus Grupos", icon: MessageSquare },
      { href: "/dashboard/agendamentos", label: "Agendamentos", icon: CalendarClock },
      { href: "/dashboard/historico", label: "Histórico", icon: History },
      { href: "/dashboard/carteira", label: "Carteira Digital", icon: Wallet },
      { href: "/dashboard/comissoes", label: "Comissões", icon: Coins },
      { href: "/dashboard/colaboradores", label: "Colaboradores", icon: Users },
      { href: "/dashboard/configuracoes", label: "Configurações", icon: Settings },
    ];
  };

  const links = getLinks();

  if (!user) return <div className="min-h-screen flex items-center justify-center bg-background">Carregando...</div>;

  return (
    <div className="min-h-screen bg-[#F4F7F5] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col bg-card border-r border-border shadow-sm">
        <div className="h-20 flex items-center px-8 border-b border-border/50">
          <Link href={links[0].href} className="flex items-center gap-3">
            <div className="bg-[#25D366] flex items-center justify-center shrink-0 rounded-xl shadow-md shadow-primary/20" style={{ width: 40, height: 40 }}>
              <img
                src={`${basePath}/images/kero-logo.png`}
                alt="KERO PROMO logo"
                width={30}
                height={30}
                className="object-contain rounded-lg"
              />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-foreground">
              KERO<span className="text-primary">PROMO</span>
            </span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
          {links.map((link) => {
            const isActive = location === link.href || (link.href !== links[0].href && location.startsWith(link.href));
            const Icon = link.icon;
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-muted-foreground")} />
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-border/50">
          <div className="bg-secondary rounded-xl p-4 mb-4">
            <div className="font-bold text-sm text-foreground">{user.name}</div>
            <div className="text-xs text-muted-foreground truncate">{user.email}</div>
            <div className="mt-2 text-[10px] font-black uppercase tracking-wider text-primary bg-primary/10 inline-block px-2 py-1 rounded-md">
              Plano Pro
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sair da conta
          </button>
        </div>
      </aside>

      {/* Mobile Header & Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-card border-b border-border flex items-center justify-between px-4 sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <div className="bg-[#25D366] flex items-center justify-center shrink-0 rounded-lg" style={{ width: 32, height: 32 }}>
              <img
                src={`${basePath}/images/kero-logo.png`}
                alt="KERO PROMO logo"
                width={24}
                height={24}
                className="object-contain rounded-md"
              />
            </div>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-foreground">
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </header>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-16 bg-card z-30 flex flex-col border-b border-border shadow-xl animate-in slide-in-from-top">
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
              {links.map((link) => {
                const isActive = location === link.href;
                const Icon = link.icon;
                return (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-4 rounded-xl font-bold transition-all",
                      isActive ? "bg-primary text-white" : "text-foreground bg-secondary/50"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}
              <button 
                onClick={logout}
                className="flex items-center gap-3 px-4 py-4 rounded-xl font-bold text-destructive bg-destructive/10 mt-auto"
              >
                <LogOut className="w-5 h-5" />
                Sair
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {user.status === "trial" && role === "entrepreneur" && (
            <div className="mb-6 bg-gradient-to-r from-accent to-yellow-400 text-accent-foreground p-4 rounded-2xl shadow-lg border border-yellow-300 flex items-center justify-between">
              <div>
                <strong className="font-display text-lg block">Seu período de teste grátis (10 dias) está ativo!</strong>
                <span className="text-sm font-medium">Aproveite todas as funções. A cobrança iniciará automaticamente ao fim do período.</span>
              </div>
              <Link href="/dashboard/configuracoes" className="px-4 py-2 bg-black/10 hover:bg-black/20 rounded-xl font-bold text-sm transition-colors backdrop-blur-sm hidden sm:block">
                Ver Assinatura
              </Link>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
