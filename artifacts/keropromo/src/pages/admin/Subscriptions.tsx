import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CreditCard, Users, TrendingUp, AlertTriangle } from "lucide-react";

const mockSubscriptions = [
  { id: 1, entrepreneur: "Maria Silva", plan: "Pro", amount: 29.90, status: "active", nextBilling: "01/04/2026", startedAt: "01/01/2026" },
  { id: 2, entrepreneur: "Joao Santos", plan: "Starter", amount: 9.90, status: "active", nextBilling: "15/04/2026", startedAt: "15/01/2026" },
  { id: 3, entrepreneur: "Ana Oliveira", plan: "Business", amount: 99.90, status: "active", nextBilling: "20/03/2026", startedAt: "20/12/2025" },
  { id: 4, entrepreneur: "Pedro Costa", plan: "Pro", amount: 29.90, status: "trial", nextBilling: "15/03/2026", startedAt: "05/03/2026" },
  { id: 5, entrepreneur: "Carla Mendes", plan: "Starter", amount: 9.90, status: "cancelled", nextBilling: "-", startedAt: "10/02/2026" },
];

export default function AdminSubscriptions() {
  const statusLabel: Record<string, { text: string; color: string }> = {
    active: { text: "Ativa", color: "bg-green-100 text-green-700" },
    trial: { text: "Trial", color: "bg-blue-100 text-blue-700" },
    cancelled: { text: "Cancelada", color: "bg-red-100 text-red-700" },
    past_due: { text: "Inadimplente", color: "bg-yellow-100 text-yellow-700" },
  };

  const mrr = mockSubscriptions.filter(s => s.status === "active").reduce((sum, s) => sum + s.amount, 0);

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Assinaturas</h1>
          <p className="text-muted-foreground">Gerencie todas as assinaturas dos empreendedores</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{mockSubscriptions.length}</p>
            <p className="text-sm text-muted-foreground">Total</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{mockSubscriptions.filter(s => s.status === "active").length}</p>
            <p className="text-sm text-muted-foreground">Ativas</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-primary">R$ {mrr.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">MRR</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{mockSubscriptions.filter(s => s.status === "trial").length}</p>
            <p className="text-sm text-muted-foreground">Em Trial</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Empreendedor</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Plano</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Valor</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Inicio</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Prox. Cobranca</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockSubscriptions.map(s => (
                <tr key={s.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{s.entrepreneur}</td>
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{s.plan}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-foreground">R$ {s.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{s.startedAt}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{s.nextBilling}</td>
                  <td className="px-4 py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusLabel[s.status]?.color}`}>{statusLabel[s.status]?.text}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
