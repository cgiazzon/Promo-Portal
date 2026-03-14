import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useListSchedules } from "@workspace/api-client-react";
import { Calendar, Clock, Trash2, Edit, Plus, Send } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

export default function Schedules() {
  const { data: schedules, isLoading } = useListSchedules();
  const [showNew, setShowNew] = useState(false);

  const statusLabel: Record<string, { text: string; color: string }> = {
    pending: { text: "Pendente", color: "bg-yellow-100 text-yellow-700" },
    sent: { text: "Enviado", color: "bg-green-100 text-green-700" },
    failed: { text: "Falhou", color: "bg-red-100 text-red-700" },
    cancelled: { text: "Cancelado", color: "bg-gray-100 text-gray-500" },
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Agendamentos</h1>
            <p className="text-muted-foreground">Gerencie seus envios agendados para os grupos</p>
          </div>
          <button onClick={() => setShowNew(!showNew)} className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:opacity-90">
            <Plus className="w-4 h-4" />
            Novo Agendamento
          </button>
        </div>

        {showNew && (
          <div className="bg-card border border-border rounded-2xl p-6 mb-6">
            <h3 className="font-semibold text-foreground mb-4">Agendar Envio de Oferta</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Oferta</label>
                <select className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground">
                  <option>Selecione uma oferta...</option>
                  <option>Fone Bluetooth TWS Pro 5.0</option>
                  <option>Echo Dot 5a Geracao</option>
                  <option>Kit 10 Camisetas Basicas</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Grupo(s)</label>
                <select className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground" multiple>
                  <option>Ofertas Tech & Games</option>
                  <option>Promos Casa & Decoracao</option>
                  <option>Moda & Beleza Ofertas</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Data e Hora</label>
                <input type="datetime-local" className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground" />
              </div>
            </div>
            <div className="flex gap-3">
              <button className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:opacity-90">
                <Send className="w-4 h-4" />
                Agendar Envio
              </button>
              <button onClick={() => setShowNew(false)} className="px-6 py-2.5 rounded-xl font-semibold text-muted-foreground hover:bg-muted/50">
                Cancelar
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{schedules?.filter(s => s.status === "pending").length || 0}</p>
              <p className="text-sm text-muted-foreground">Agendados</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Send className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{schedules?.filter(s => s.status === "sent").length || 0}</p>
              <p className="text-sm text-muted-foreground">Enviados</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{schedules?.length || 0}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Carregando agendamentos...</div>
        ) : !schedules?.length ? (
          <div className="text-center py-12 bg-card border border-border rounded-2xl">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-lg font-semibold text-foreground">Nenhum agendamento</p>
            <p className="text-muted-foreground">Selecione ofertas do catalogo e agende envios para seus grupos</p>
          </div>
        ) : (
          <div className="space-y-3">
            {schedules.map((s) => (
              <div key={s.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{s.offerTitle}</p>
                    <p className="text-sm text-muted-foreground">
                      {s.groupNames?.join(", ")} · {format(new Date(s.scheduledAt), "dd/MM/yyyy 'as' HH:mm", { locale: ptBR })}
                    </p>
                    {s.shortUrl && <p className="text-xs text-primary mt-0.5">{s.shortUrl}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusLabel[s.status]?.color || "bg-gray-100 text-gray-500"}`}>
                    {statusLabel[s.status]?.text || s.status}
                  </span>
                  {s.status === "pending" && (
                    <div className="flex gap-1">
                      <button className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/50"><Edit className="w-4 h-4" /></button>
                      <button className="p-2 text-muted-foreground hover:text-destructive rounded-lg hover:bg-muted/50"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
