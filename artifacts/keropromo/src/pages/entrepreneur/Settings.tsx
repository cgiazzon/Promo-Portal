import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { User, CreditCard, Bell, Key, LogOut, ExternalLink, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";

const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

interface BillingInfo {
  subscription: Record<string, unknown> | null;
  subscriptionStatus: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  planId: number | null;
}

const planNames: Record<number, string> = { 1: "Starter", 2: "Pro", 3: "Business" };
const planPrices: Record<number, string> = { 1: "9,90", 2: "29,90", 3: "99,90" };

const statusLabels: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  trialing: { label: "Período de teste", color: "text-blue-600 bg-blue-50 border-blue-200", icon: CheckCircle },
  active: { label: "Ativa", color: "text-green-600 bg-green-50 border-green-200", icon: CheckCircle },
  past_due: { label: "Pagamento pendente", color: "text-orange-600 bg-orange-50 border-orange-200", icon: AlertCircle },
  canceled: { label: "Cancelada", color: "text-red-600 bg-red-50 border-red-200", icon: AlertCircle },
  unpaid: { label: "Não paga", color: "text-red-600 bg-red-50 border-red-200", icon: AlertCircle },
};

export default function Settings() {
  const { user, logout } = useAuth(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [portalLoading, setPortalLoading] = useState(false);

  const { data: billing, isLoading: billingLoading } = useQuery<BillingInfo>({
    queryKey: ["billing-subscription"],
    enabled: activeTab === "billing",
    queryFn: async () => {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`${API_BASE}/api/billing/subscription`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch billing info");
      return res.json() as Promise<BillingInfo>;
    },
  });

  const openPortal = async () => {
    setPortalLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`${API_BASE}/api/billing/portal`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to open portal");
      const { url } = await res.json();
      window.open(url, "_blank");
    } catch {
      alert("Não foi possível abrir o portal. Tente novamente.");
    } finally {
      setPortalLoading(false);
    }
  };

  const planId = billing?.planId ?? user?.planId;
  const planName = planId ? (planNames[planId] ?? `Plano ${planId}`) : "Sem plano";
  const planPrice = planId ? (planPrices[planId] ?? "—") : null;
  const subStatus = billing?.subscriptionStatus ?? user?.subscriptionStatus ?? "trialing";
  const statusInfo = statusLabels[subStatus] ?? { label: subStatus, color: "text-muted-foreground bg-muted border-border", icon: CheckCircle };

  const tabs = [
    { key: "profile", label: "Perfil", icon: User },
    { key: "billing", label: "Assinatura", icon: CreditCard },
    { key: "notifications", label: "Notificacoes", icon: Bell },
    { key: "api", label: "Integracao", icon: Key },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Configuracoes</h1>
          <p className="text-muted-foreground">Gerencie seu perfil, assinatura e preferencias</p>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${activeTab === t.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "profile" && (
          <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
            <h3 className="text-lg font-semibold text-foreground">Dados do Perfil</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Nome completo</label>
                <input type="text" className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground" defaultValue={user?.name || ""} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">E-mail</label>
                <input type="email" className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground" defaultValue={user?.email || ""} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Telefone (WhatsApp)</label>
                <input type="tel" className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground" placeholder="+55 (11) 99999-9999" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">CPF/CNPJ</label>
                <input type="text" className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground" placeholder="000.000.000-00" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Chave Pix para Saques</label>
              <input type="text" className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground" placeholder="Sua chave Pix (CPF, e-mail, telefone ou aleatoria)" />
            </div>
            <button className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold hover:opacity-90">Salvar Alteracoes</button>
          </div>
        )}

        {activeTab === "billing" && (
          <div className="space-y-4">
            {billingLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <div className="bg-card border border-border rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Plano Atual</h3>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusInfo.color}`}>
                      <statusInfo.icon className="w-3.5 h-3.5" />
                      {statusInfo.label}
                    </span>
                  </div>
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-foreground">{planName}</p>
                      <p className="text-sm text-muted-foreground">
                        {subStatus === "trialing" ? "10 dias de teste grátis" : "Assinatura ativa"}
                      </p>
                    </div>
                    {planPrice && (
                      <p className="text-2xl font-bold text-primary">
                        R$ {planPrice}
                        <span className="text-sm font-normal text-muted-foreground">/mês</span>
                      </p>
                    )}
                  </div>

                  {(subStatus === "past_due" || subStatus === "unpaid") && (
                    <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-xl text-sm text-orange-800">
                      Há um problema com seu pagamento. Acesse o portal para regularizar sua assinatura e evitar a suspensão.
                    </div>
                  )}
                  {subStatus === "canceled" && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-800">
                      Sua assinatura foi cancelada. Reative para continuar usando a plataforma.
                    </div>
                  )}

                  <div className="flex gap-3 mt-4">
                    {billing?.stripeCustomerId ? (
                      <button
                        onClick={openPortal}
                        disabled={portalLoading}
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold hover:opacity-90 disabled:opacity-60"
                      >
                        {portalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
                        Gerenciar Assinatura
                      </button>
                    ) : (
                      <p className="text-sm text-muted-foreground">Nenhuma assinatura Stripe vinculada.</p>
                    )}
                  </div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Método de Pagamento</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Gerencie seu cartão, histórico de faturas e informações de cobrança diretamente no portal seguro.
                  </p>
                  {billing?.stripeCustomerId ? (
                    <button
                      onClick={openPortal}
                      disabled={portalLoading}
                      className="flex items-center gap-2 text-sm text-primary font-medium hover:underline disabled:opacity-60"
                    >
                      {portalLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CreditCard className="w-3.5 h-3.5" />}
                      Abrir portal de faturamento
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 bg-muted/30 rounded-xl p-4">
                      <CreditCard className="w-6 h-6 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Nenhum cartão cadastrado ainda.</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Preferencias de Notificacao</h3>
            {[
              { label: "E-mail quando envio falhar", desc: "Receba um e-mail sempre que um envio para grupo falhar" },
              { label: "Resumo diario de comissoes", desc: "Resumo das comissoes geradas no dia anterior" },
              { label: "Novas ofertas no catalogo", desc: "Aviso quando novas ofertas forem adicionadas" },
              { label: "Vencimento da assinatura", desc: "Lembrete 3 dias antes do vencimento" },
            ].map((n, i) => (
              <label key={i} className="flex items-start gap-3 p-4 rounded-xl border border-border hover:bg-muted/30 cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-1 w-4 h-4 rounded border-input text-primary focus:ring-primary" />
                <div>
                  <p className="font-medium text-foreground">{n.label}</p>
                  <p className="text-sm text-muted-foreground">{n.desc}</p>
                </div>
              </label>
            ))}
            <button className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold hover:opacity-90">Salvar Preferencias</button>
          </div>
        )}

        {activeTab === "api" && (
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">Conexao WhatsApp (Z-API)</h3>
              <p className="text-sm text-muted-foreground mb-4">Conecte seu WhatsApp Business para envio automatico de ofertas</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Instance ID</label>
                  <input type="text" className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground" placeholder="Seu Instance ID do Z-API" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Token</label>
                  <input type="password" className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground" placeholder="Seu Token de acesso" />
                </div>
              </div>
              <button className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold hover:opacity-90">Testar Conexao</button>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">Chaves de Afiliado</h3>
              <p className="text-sm text-muted-foreground mb-4">Configure suas chaves de afiliado dos marketplaces</p>
              {["Shopee", "Temu", "Amazon", "Mercado Livre"].map(mp => (
                <div key={mp} className="mb-3">
                  <label className="block text-sm font-medium text-foreground mb-1.5">{mp} - ID de Afiliado</label>
                  <input type="text" className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground" placeholder={`Seu ID de afiliado ${mp}`} />
                </div>
              ))}
              <button className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold hover:opacity-90 mt-2">Salvar Chaves</button>
            </div>
          </div>
        )}

        <div className="mt-8 border-t border-border pt-6">
          <button onClick={logout} className="flex items-center gap-2 text-destructive hover:underline font-medium">
            <LogOut className="w-4 h-4" />
            Sair da conta
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
