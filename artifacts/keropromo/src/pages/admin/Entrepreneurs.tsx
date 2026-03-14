import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Users, Search, Eye, Ban, CheckCircle, Mail, Filter } from "lucide-react";
import { useState } from "react";

const mockEntrepreneurs = [
  { id: 1, name: "Maria Silva", email: "maria@email.com", plan: "Pro", groups: 3, sends: 89, status: "active", createdAt: "01/01/2026" },
  { id: 2, name: "Joao Santos", email: "joao@email.com", plan: "Starter", groups: 1, sends: 24, status: "active", createdAt: "15/01/2026" },
  { id: 3, name: "Ana Oliveira", email: "ana@email.com", plan: "Business", groups: 8, sends: 312, status: "active", createdAt: "20/12/2025" },
  { id: 4, name: "Pedro Costa", email: "pedro@email.com", plan: "Pro", groups: 2, sends: 56, status: "trial", createdAt: "05/03/2026" },
  { id: 5, name: "Carla Mendes", email: "carla@email.com", plan: "Starter", groups: 1, sends: 0, status: "suspended", createdAt: "10/02/2026" },
];

export default function AdminEntrepreneurs() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = mockEntrepreneurs.filter(e => {
    if (statusFilter !== "all" && e.status !== statusFilter) return false;
    if (search && !e.name.toLowerCase().includes(search.toLowerCase()) && !e.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const statusLabel: Record<string, { text: string; color: string }> = {
    active: { text: "Ativo", color: "bg-green-100 text-green-700" },
    trial: { text: "Trial", color: "bg-blue-100 text-blue-700" },
    suspended: { text: "Suspenso", color: "bg-red-100 text-red-700" },
    cancelled: { text: "Cancelado", color: "bg-gray-100 text-gray-500" },
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Empreendedores</h1>
          <p className="text-muted-foreground">Gerencie todos os empreendedores da plataforma</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{mockEntrepreneurs.length}</p>
            <p className="text-sm text-muted-foreground">Total</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{mockEntrepreneurs.filter(e => e.status === "active").length}</p>
            <p className="text-sm text-muted-foreground">Ativos</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{mockEntrepreneurs.filter(e => e.status === "trial").length}</p>
            <p className="text-sm text-muted-foreground">Em Trial</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-red-500">{mockEntrepreneurs.filter(e => e.status === "suspended").length}</p>
            <p className="text-sm text-muted-foreground">Suspensos</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="text" placeholder="Buscar por nome ou e-mail..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background text-foreground" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="px-4 py-2.5 rounded-xl border border-input bg-background text-foreground" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">Todos os Status</option>
            <option value="active">Ativos</option>
            <option value="trial">Em Trial</option>
            <option value="suspended">Suspensos</option>
          </select>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Nome</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Plano</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Grupos</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Envios</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(e => (
                <tr key={e.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-foreground">{e.name}</p>
                    <p className="text-xs text-muted-foreground">{e.email}</p>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{e.plan}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{e.groups}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{e.sends}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusLabel[e.status]?.color}`}>{statusLabel[e.status]?.text}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/50" title="Visualizar"><Eye className="w-4 h-4" /></button>
                      <button className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/50" title="E-mail"><Mail className="w-4 h-4" /></button>
                      <button className="p-2 text-muted-foreground hover:text-destructive rounded-lg hover:bg-muted/50" title="Suspender"><Ban className="w-4 h-4" /></button>
                    </div>
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
