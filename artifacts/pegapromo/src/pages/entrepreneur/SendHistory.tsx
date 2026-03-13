import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useListSendHistory } from "@workspace/api-client-react";
import { History, CheckCircle, XCircle, Clock, Filter, Search } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

export default function SendHistory() {
  const { data: history, isLoading } = useListSendHistory();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const statusIcon: Record<string, React.ReactNode> = {
    delivered: <CheckCircle className="w-4 h-4 text-green-500" />,
    failed: <XCircle className="w-4 h-4 text-red-500" />,
    pending: <Clock className="w-4 h-4 text-yellow-500" />,
  };
  const statusLabel: Record<string, string> = { delivered: "Entregue", failed: "Falhou", pending: "Pendente" };

  const filtered = history?.filter(h => {
    if (filter !== "all" && h.status !== filter) return false;
    if (search && !h.offerTitle?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Historico de Envios</h1>
          <p className="text-muted-foreground">Acompanhe todos os envios realizados para seus grupos</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="text" placeholder="Buscar por oferta..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background text-foreground" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            {[
              { key: "all", label: "Todos" },
              { key: "delivered", label: "Entregues" },
              { key: "failed", label: "Falhos" },
              { key: "pending", label: "Pendentes" },
            ].map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === f.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{history?.length || 0}</p>
            <p className="text-sm text-muted-foreground">Total de Envios</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{history?.filter(h => h.status === "delivered").length || 0}</p>
            <p className="text-sm text-muted-foreground">Entregues</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-red-500">{history?.filter(h => h.status === "failed").length || 0}</p>
            <p className="text-sm text-muted-foreground">Falhas</p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Carregando historico...</div>
        ) : !filtered?.length ? (
          <div className="text-center py-12 bg-card border border-border rounded-2xl">
            <History className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-lg font-semibold text-foreground">Nenhum envio encontrado</p>
            <p className="text-muted-foreground">Seus envios aparecerão aqui após serem processados</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Oferta</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Grupo</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Data</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(h => (
                  <tr key={h.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{h.offerTitle}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{h.groupName}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {h.sentAt ? format(new Date(h.sentAt), "dd/MM/yyyy HH:mm", { locale: ptBR }) : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-sm">
                        {statusIcon[h.status]}
                        {statusLabel[h.status] || h.status}
                      </span>
                    </td>
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
