import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useListCommissions } from "@workspace/api-client-react";
import { Coins, TrendingUp, Clock, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Commissions() {
  const { data: commissions, isLoading } = useListCommissions();

  const statusLabel: Record<string, { text: string; color: string }> = {
    pending: { text: "Pendente", color: "bg-yellow-100 text-yellow-700" },
    approved: { text: "Aprovada", color: "bg-green-100 text-green-700" },
    paid: { text: "Paga", color: "bg-blue-100 text-blue-700" },
    cancelled: { text: "Cancelada", color: "bg-red-100 text-red-700" },
  };

  const total = commissions?.reduce((sum, c) => sum + (Number(c.amount) || 0), 0) || 0;
  const approved = commissions?.filter(c => c.status === "approved").reduce((sum, c) => sum + (Number(c.amount) || 0), 0) || 0;
  const pending = commissions?.filter(c => c.status === "pending").reduce((sum, c) => sum + (Number(c.amount) || 0), 0) || 0;

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Comissoes</h1>
          <p className="text-muted-foreground">Acompanhe suas comissoes de afiliado por marketplace</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"><DollarSign className="w-5 h-5 text-green-600" /></div>
              <p className="text-sm text-muted-foreground">Total Comissoes</p>
            </div>
            <p className="text-3xl font-bold text-foreground">R$ {total.toFixed(2)}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><TrendingUp className="w-5 h-5 text-blue-600" /></div>
              <p className="text-sm text-muted-foreground">Aprovadas</p>
            </div>
            <p className="text-3xl font-bold text-foreground">R$ {approved.toFixed(2)}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center"><Clock className="w-5 h-5 text-yellow-600" /></div>
              <p className="text-sm text-muted-foreground">Pendentes</p>
            </div>
            <p className="text-3xl font-bold text-foreground">R$ {pending.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-sm text-yellow-800">
          <strong>Aviso:</strong> As comissoes levam em media 35 dias para serem confirmadas pelos marketplaces. Apos confirmadas, o valor fica disponivel para saque na sua carteira.
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Carregando comissoes...</div>
        ) : !commissions?.length ? (
          <div className="text-center py-12 bg-card border border-border rounded-2xl">
            <Coins className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-lg font-semibold text-foreground">Nenhuma comissao ainda</p>
            <p className="text-muted-foreground">Envie ofertas para seus grupos e as comissoes aparecerão aqui</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Marketplace</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Oferta</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Valor</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {commissions.map(c => (
                  <tr key={c.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{c.marketplace}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{c.offerTitle}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-foreground">R$ {Number(c.amount).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusLabel[c.status]?.color || "bg-gray-100 text-gray-500"}`}>
                        {statusLabel[c.status]?.text || c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{c.createdAt ? format(new Date(c.createdAt), "dd/MM/yyyy", { locale: ptBR }) : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
