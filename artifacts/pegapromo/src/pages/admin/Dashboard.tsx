import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useGetAdminDashboard } from "@workspace/api-client-react";
import { Users, MessagesSquare, DollarSign, MousePointerClick } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function AdminDashboard() {
  const { data: dashboard, isLoading } = useGetAdminDashboard();

  if (isLoading || !dashboard) {
    return <DashboardLayout role="admin"><div className="animate-pulse h-96 bg-muted rounded-3xl"></div></DashboardLayout>;
  }

  const stats = [
    { label: "Empreendedores Ativos", value: dashboard.activeEntrepreneurs, icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "MRR (Receita Recorrente)", value: formatCurrency(dashboard.mrr), icon: DollarSign, color: "text-green-600", bg: "bg-green-100" },
    { label: "Grupos Conectados", value: dashboard.totalGroups, icon: MessagesSquare, color: "text-purple-600", bg: "bg-purple-100" },
    { label: "Cliques em Ofertas", value: dashboard.totalClicks, icon: MousePointerClick, color: "text-orange-600", bg: "bg-orange-100" },
  ];

  return (
    <DashboardLayout role="admin">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">Visão Geral</h1>
        <p className="text-muted-foreground mt-1">Métricas de saúde da plataforma PEGAPROMO.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card p-6 rounded-2xl border shadow-sm flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-1">{stat.label}</p>
              <h3 className="text-2xl font-display font-black text-foreground">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card border rounded-2xl p-6 shadow-sm">
          <h3 className="font-display font-bold text-lg mb-6">Assinaturas por Plano</h3>
          <div className="space-y-4">
            {Object.entries(dashboard.subscriptionsByPlan).map(([plan, count]) => (
              <div key={plan} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="font-bold uppercase tracking-wider text-sm">{plan}</span>
                </div>
                <span className="font-mono font-medium bg-secondary px-3 py-1 rounded-lg">{count} assinantes</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border rounded-2xl p-6 shadow-sm">
          <h3 className="font-display font-bold text-lg mb-6">Ações Pendentes</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div>
                <strong className="text-yellow-900 block">Saques Pendentes (Pix)</strong>
                <span className="text-sm text-yellow-700">{dashboard.pendingWithdrawalsCount} solicitações</span>
              </div>
              <div className="text-right">
                <span className="font-black text-yellow-900 block">{formatCurrency(dashboard.pendingWithdrawals)}</span>
                <a href="/admin/financeiro" className="text-xs font-bold text-primary hover:underline">Processar Saques &rarr;</a>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-secondary border border-border rounded-xl">
              <div>
                <strong className="text-foreground block">Comissões a liberar nos próximos 35 dias</strong>
              </div>
              <div className="text-right">
                <span className="font-black text-foreground block">{formatCurrency(dashboard.commissionsToRelease)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
