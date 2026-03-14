import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/use-auth";
import { Send, Calendar, CheckCircle, Clock, MessageSquare, AlertTriangle } from "lucide-react";

const mockData = {
  todaySends: 8,
  pendingSchedules: 3,
  totalSent: 156,
  failedToday: 1,
  recentSends: [
    { id: 1, offer: "Fone Bluetooth TWS Pro 5.0", group: "Ofertas Tech & Games", time: "14:30", status: "delivered" },
    { id: 2, offer: "Echo Dot 5a Geracao Alexa", group: "Promos Casa & Decoracao", time: "12:00", status: "delivered" },
    { id: 3, offer: "Kit 10 Camisetas Basicas", group: "Moda & Beleza Ofertas", time: "10:15", status: "failed" },
    { id: 4, offer: "Smartwatch Ultra 2024", group: "Ofertas Tech & Games", time: "09:00", status: "delivered" },
  ],
  upcomingSchedules: [
    { id: 1, offer: "Air Fryer Digital 5L", group: "Promos Casa & Decoracao", time: "16:00" },
    { id: 2, offer: "Protetor Solar FPS 70", group: "Moda & Beleza Ofertas", time: "18:30" },
    { id: 3, offer: "Mouse Gamer RGB 16000dpi", group: "Ofertas Tech & Games", time: "20:00" },
  ],
};

export default function CollaboratorDashboard() {
  useAuth(true, "collaborator");

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Painel do Colaborador</h1>
          <p className="text-muted-foreground">Gerencie envios e agendamentos dos grupos atribuidos</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm text-blue-800">
          <strong>Nota:</strong> Voce esta logado como colaborador. Suas permissoes sao definidas pelo empreendedor responsavel.
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2"><Send className="w-5 h-5 text-primary" /><span className="text-sm text-muted-foreground">Envios Hoje</span></div>
            <p className="text-3xl font-bold text-foreground">{mockData.todaySends}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2"><Calendar className="w-5 h-5 text-blue-500" /><span className="text-sm text-muted-foreground">Agendados</span></div>
            <p className="text-3xl font-bold text-foreground">{mockData.pendingSchedules}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2"><CheckCircle className="w-5 h-5 text-green-500" /><span className="text-sm text-muted-foreground">Total Enviados</span></div>
            <p className="text-3xl font-bold text-foreground">{mockData.totalSent}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2"><AlertTriangle className="w-5 h-5 text-red-500" /><span className="text-sm text-muted-foreground">Falhas Hoje</span></div>
            <p className="text-3xl font-bold text-foreground">{mockData.failedToday}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-primary" />Envios Recentes</h3>
            <div className="space-y-3">
              {mockData.recentSends.map(s => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                  <div>
                    <p className="text-sm font-medium text-foreground">{s.offer}</p>
                    <p className="text-xs text-muted-foreground">{s.group} · {s.time}</p>
                  </div>
                  {s.status === "delivered" ? <CheckCircle className="w-4 h-4 text-green-500" /> : <AlertTriangle className="w-4 h-4 text-red-500" />}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-blue-500" />Proximos Agendamentos</h3>
            <div className="space-y-3">
              {mockData.upcomingSchedules.map(s => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                  <div>
                    <p className="text-sm font-medium text-foreground">{s.offer}</p>
                    <p className="text-xs text-muted-foreground">{s.group}</p>
                  </div>
                  <span className="text-sm font-medium text-primary">{s.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
