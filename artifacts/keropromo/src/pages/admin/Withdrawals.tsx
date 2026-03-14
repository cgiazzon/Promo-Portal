import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Banknote, Clock, CheckCircle, XCircle, Search } from "lucide-react";
import { useState } from "react";

const mockWithdrawals = [
  { id: 1, entrepreneur: "Maria Silva", amount: 150.00, pixKey: "maria@email.com", status: "pending", requestedAt: "13/03/2026 10:30" },
  { id: 2, entrepreneur: "Ana Oliveira", amount: 89.50, pixKey: "123.456.789-00", status: "pending", requestedAt: "12/03/2026 18:00" },
  { id: 3, entrepreneur: "Joao Santos", amount: 45.00, pixKey: "+5511999999999", status: "completed", requestedAt: "10/03/2026 14:00", completedAt: "10/03/2026 16:30" },
  { id: 4, entrepreneur: "Pedro Costa", amount: 200.00, pixKey: "pedro@email.com", status: "completed", requestedAt: "08/03/2026 09:00", completedAt: "08/03/2026 11:15" },
  { id: 5, entrepreneur: "Carla Mendes", amount: 30.00, pixKey: "carla@email.com", status: "rejected", requestedAt: "06/03/2026 12:00" },
];

export default function AdminWithdrawals() {
  const [filter, setFilter] = useState("all");

  const statusLabel: Record<string, { text: string; color: string; icon: React.ReactNode }> = {
    pending: { text: "Pendente", color: "bg-yellow-100 text-yellow-700", icon: <Clock className="w-4 h-4" /> },
    completed: { text: "Pago", color: "bg-green-100 text-green-700", icon: <CheckCircle className="w-4 h-4" /> },
    rejected: { text: "Rejeitado", color: "bg-red-100 text-red-700", icon: <XCircle className="w-4 h-4" /> },
  };

  const filtered = filter === "all" ? mockWithdrawals : mockWithdrawals.filter(w => w.status === filter);
  const pendingTotal = mockWithdrawals.filter(w => w.status === "pending").reduce((s, w) => s + w.amount, 0);

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Saques (Pix)</h1>
          <p className="text-muted-foreground">Gerencie solicitacoes de saque dos empreendedores</p>
        </div>

        {pendingTotal > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="text-sm text-yellow-800">
              <strong>{mockWithdrawals.filter(w => w.status === "pending").length} saques pendentes</strong> totalizando <strong>R$ {pendingTotal.toFixed(2)}</strong>
            </div>
            <button className="bg-yellow-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-yellow-700">Processar Pendentes</button>
          </div>
        )}

        <div className="flex gap-2 mb-6">
          {["all", "pending", "completed", "rejected"].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium ${filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
              {f === "all" ? "Todos" : statusLabel[f]?.text}
            </button>
          ))}
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Empreendedor</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Valor</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Chave Pix</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Solicitado em</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(w => (
                <tr key={w.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{w.entrepreneur}</td>
                  <td className="px-4 py-3 text-sm font-bold text-foreground">R$ {w.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground font-mono">{w.pixKey}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{w.requestedAt}</td>
                  <td className="px-4 py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusLabel[w.status]?.color}`}>{statusLabel[w.status]?.text}</span></td>
                  <td className="px-4 py-3">
                    {w.status === "pending" && (
                      <div className="flex gap-1">
                        <button className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:bg-green-700">Aprovar</button>
                        <button className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:bg-red-600">Rejeitar</button>
                      </div>
                    )}
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
