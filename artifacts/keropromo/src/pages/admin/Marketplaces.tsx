import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useListMarketplaces } from "@workspace/api-client-react";
import { Store, Settings, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { getMarketplaceColor } from "@/lib/utils";

export default function AdminMarketplaces() {
  const { data: marketplaces, isLoading } = useListMarketplaces();

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Marketplaces</h1>
          <p className="text-muted-foreground">Gerencie as integracoes com marketplaces de afiliados</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Carregando marketplaces...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(marketplaces || []).map(mp => {
              const color = getMarketplaceColor(mp.name);
              return (
                <div key={mp.id} className="bg-card border border-border rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: color }}>
                        {mp.name?.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{mp.name}</h3>
                        <p className="text-sm text-muted-foreground">{mp.affiliateCode ? "Programa de Afiliados" : "Marketplace"}</p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-sm text-green-600 font-medium"><CheckCircle className="w-4 h-4" />Ativo</span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Comissao Padrao</span>
                      <span className="font-medium text-foreground">{mp.commissionPercent ? `${mp.commissionPercent}%` : "Variavel"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Prazo de Pagamento</span>
                      <span className="font-medium text-foreground">35 dias</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Ofertas Ativas</span>
                      <span className="font-medium text-foreground">-</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-muted text-foreground py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-muted/80">
                      <Settings className="w-4 h-4" />
                      Configurar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
