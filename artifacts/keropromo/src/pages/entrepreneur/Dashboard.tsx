import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useGetEntrepreneurDashboard, useGetFeaturedOffer } from "@workspace/api-client-react";
import { ArrowUpRight, Copy, Zap, Clock, Users, Calendar, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { OfferCard } from "@/components/OfferCard";

export default function Dashboard() {
  const { data: dashboard, isLoading } = useGetEntrepreneurDashboard();
  const { data: featuredOffer } = useGetFeaturedOffer();

  if (isLoading || !dashboard) {
    return <DashboardLayout><div className="animate-pulse flex gap-4"><div className="w-1/4 h-32 bg-muted rounded-xl"></div></div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">Olá, Empreendedor! 👋</h1>
        <p className="text-muted-foreground mt-1">Aqui está o resumo da sua operação.</p>
      </div>

      {/* Featured Offer Banner */}
      {featuredOffer && featuredOffer.offer && (
        <div className="mb-10 relative overflow-hidden bg-gradient-to-br from-primary to-[#168a41] rounded-3xl shadow-xl shadow-primary/20 text-white border border-primary/20 p-1">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-8 border border-white/20">
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400 text-yellow-950 text-xs font-black uppercase tracking-wider mb-4 shadow-sm">
                <Zap className="w-3.5 h-3.5 fill-current" />
                Oferta da Semana
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-black leading-tight text-balance mb-4">
                {featuredOffer.offer.title}
              </h2>
              {featuredOffer.motivationalMessage && (
                <p className="text-white/80 text-lg mb-6 italic">"{featuredOffer.motivationalMessage}"</p>
              )}
              
              <div className="flex flex-wrap items-center gap-4">
                <button className="bg-white text-primary px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-gray-50 active:scale-95 transition-all flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Agendar para meus grupos
                </button>
              </div>
            </div>

            <div className="w-full md:w-72 shrink-0 bg-white rounded-2xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
              <OfferCard offer={featuredOffer.offer} />
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card p-6 rounded-2xl border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-muted-foreground text-sm font-medium">Grupos Conectados</p>
          <h3 className="text-3xl font-display font-black text-foreground mt-1">{dashboard.groupCount}</h3>
        </div>
        
        <div className="bg-card p-6 rounded-2xl border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-muted-foreground text-sm font-medium">Agendados Hoje</p>
          <h3 className="text-3xl font-display font-black text-foreground mt-1">{dashboard.scheduledToday}</h3>
        </div>

        <div className="bg-card p-6 rounded-2xl border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-muted-foreground text-sm font-medium">Cliques na Semana</p>
          <h3 className="text-3xl font-display font-black text-foreground mt-1">{dashboard.weeklyClicks}</h3>
        </div>

        <div className="bg-card p-6 rounded-2xl border shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <a href="/dashboard/carteira" className="text-xs font-bold text-primary flex items-center hover:underline">
              Sacar <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </a>
          </div>
          <p className="text-muted-foreground text-sm font-medium relative z-10">Saldo Disponível</p>
          <h3 className="text-3xl font-display font-black text-foreground mt-1 relative z-10">
            {formatCurrency(dashboard.availableBalance)}
          </h3>
        </div>
      </div>

      {/* Notifications */}
      {dashboard.notifications && dashboard.notifications.length > 0 && (
        <div className="bg-card rounded-2xl border shadow-sm p-6">
          <h3 className="text-lg font-bold font-display mb-4">Últimas Atualizações</h3>
          <div className="space-y-3">
            {dashboard.notifications.map(notif => (
              <div key={notif.id} className="flex gap-3 items-start p-3 rounded-xl hover:bg-secondary/50 transition-colors">
                <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${notif.type === 'success' ? 'bg-primary' : notif.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                <div>
                  <p className="text-sm text-foreground font-medium">{notif.message}</p>
                  <span className="text-xs text-muted-foreground">{new Date(notif.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
