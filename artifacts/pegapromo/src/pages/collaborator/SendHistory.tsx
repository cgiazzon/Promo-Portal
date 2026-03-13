import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/use-auth";
import { History, CheckCircle, XCircle, Clock } from "lucide-react";

const mockHistory = [
  { id: 1, offer: "Fone Bluetooth TWS Pro 5.0", group: "Ofertas Tech & Games", date: "13/03/2026 14:30", status: "delivered" },
  { id: 2, offer: "Echo Dot 5a Geracao", group: "Promos Casa & Decoracao", date: "13/03/2026 12:00", status: "delivered" },
  { id: 3, offer: "Kit 10 Camisetas Basicas", group: "Moda & Beleza Ofertas", date: "13/03/2026 10:15", status: "failed" },
  { id: 4, offer: "Smartwatch Ultra 2024", group: "Ofertas Tech & Games", date: "12/03/2026 20:00", status: "delivered" },
  { id: 5, offer: "Air Fryer Digital 5L", group: "Promos Casa & Decoracao", date: "12/03/2026 18:30", status: "delivered" },
  { id: 6, offer: "Protetor Solar FPS 70", group: "Moda & Beleza Ofertas", date: "12/03/2026 16:00", status: "delivered" },
];

export default function CollaboratorSendHistory() {
  useAuth(true, "collaborator");

  const statusIcon: Record<string, React.ReactNode> = {
    delivered: <CheckCircle className="w-4 h-4 text-green-500" />,
    failed: <XCircle className="w-4 h-4 text-red-500" />,
    pending: <Clock className="w-4 h-4 text-yellow-500" />,
  };
  const statusLabel: Record<string, string> = { delivered: "Entregue", failed: "Falhou", pending: "Pendente" };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Historico de Envios</h1>
          <p className="text-muted-foreground">Seus envios realizados como colaborador</p>
        </div>

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
              {mockHistory.map(h => (
                <tr key={h.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{h.offer}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{h.group}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{h.date}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 text-sm">
                      {statusIcon[h.status]}
                      {statusLabel[h.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
