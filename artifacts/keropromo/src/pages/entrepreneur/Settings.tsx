import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Settings as SettingsIcon, User, CreditCard, Bell, Key, LogOut, Shield, Globe } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

export default function Settings() {
  const { user, logout } = useAuth(true);
  const [activeTab, setActiveTab] = useState("profile");

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
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Plano Atual</h3>
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-foreground">Plano Pro</p>
                  <p className="text-sm text-muted-foreground">3 grupos · 150 envios/mes · 2 colaboradores</p>
                </div>
                <p className="text-2xl font-bold text-primary">R$ 29,90<span className="text-sm font-normal text-muted-foreground">/mes</span></p>
              </div>
              <div className="flex gap-3 mt-4">
                <button className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold hover:opacity-90">Fazer Upgrade</button>
                <button className="px-6 py-2.5 rounded-xl font-semibold text-destructive border border-destructive/30 hover:bg-destructive/5">Cancelar Assinatura</button>
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Metodo de Pagamento</h3>
              <div className="flex items-center gap-3 bg-muted/30 rounded-xl p-4">
                <CreditCard className="w-8 h-8 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Cartao **** **** **** 4242</p>
                  <p className="text-sm text-muted-foreground">Expira em 12/2027</p>
                </div>
              </div>
              <button className="mt-3 text-sm text-primary font-medium hover:underline">Alterar cartao</button>
            </div>
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
