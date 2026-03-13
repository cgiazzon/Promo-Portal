import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DollarSign, TrendingUp, Clock, CheckCircle, Search } from "lucide-react";
import { useState } from "react";

const mockCommissions = [
  { id: 1, entrepreneur: "Maria Silva", marketplace: "Shopee", offer: "Fone Bluetooth TWS", amount: 12.50, status: "approved", date: "10/03/2026" },
  { id: 2, entrepreneur: "Joao Santos", marketplace: "Amazon", offer: "Echo Dot 5a Geracao", amount: 8.90, status: "pending", date: "11/03/2026" },
  { id: 3, entrepreneur: "Ana Oliveira", marketplace: "Mercado Livre", offer: "Kit Camisetas", amount: 5.30, status: "paid", date: "08/03/2026" },
  { id: 4, entrepreneur: "Maria Silva", marketplace: "Temu", offer: "Smartwatch Ultra", amount: 15.00, status: "approved", date: "09/03/2026" },
  { id: 5, entrepreneur: "Pedro Costa", marketplace: "Shopee", offer: "Air Fryer Digital", amount: 22.40, status: "pending", date: "12/03/2026" },
  { id: 6, entrepreneur: "Ana Oliveira", marketplace: "Amazon", offer: "Kindle Paperwhite", amount: 18.75, status: "cancelled", date: "07/03/2026" },
];

export default function AdminCommissions() {
  const [filter, setFilter] = useState("all");
  const total = mockCommissions.reduce((s, c) => s + c.amount, 0);
  const approved = mockCommissions.filter(c => c.status === "approved").reduce((s, c) => s + c.amount, 0);

  const statusLabel: Record<string, { text: string; color: string }> = {
    pending: { text: "Pendente", color: "bg-yellow-100 text-yellow-700" },
    approved: { text: "Aprovada", color: "bg-green-100 text-green-700" },
    paid: { text: "Paga", color: "bg-blue-100 text-blue-700" },
    cancelled: { text: "Cancelada", color: "bg-red-100 text-red-700" },
  };

  const filtered = filter === "all" ? mockCommissions : mockCommissions.filter(c => c.status === filter);

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Comissoes da Plataforma</h1>
          <p className="text-muted-foreground">Gerencie comissoes de todos os empreendedores</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2"><DollarSign className="w-5 h-5 text-green-600" /><span className="text-sm text-muted-foreground">Total</span></div>
            <p className="text-3xl font-bold text-foreground">R$ {total.toFixed(2)}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2"><TrendingUp className="w-5 h-5 text-blue-600" /><span className="text-sm text-muted-foreground">Aprovadas</span></div>
            <p className="text-3xl font-bold text-foreground">R$ {approved.toFixed(2)}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2"><CheckCircle className="w-5 h-5 text-primary" /><span className="text-sm text-muted-foreground">Qtd. Registros</span></div>
            <p className="text-3xl font-bold text-foreground">{mockCommissions.length}</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {["all", "pending", "approved", "paid", "cancelled"].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium ${filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
              {f === "all" ? "Todas" : statusLabel[f]?.text}
            </button>
          ))}
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Empreendedor</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Marketplace</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Oferta</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Valor</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{c.entrepreneur}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{c.marketplace}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{c.offer}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-foreground">R$ {c.amount.toFixed(2)}</td>
                  <td className="px-4 py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusLabel[c.status]?.color}`}>{statusLabel[c.status]?.text}</span></td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{c.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
