import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/use-auth";
import { useListGroups } from "@workspace/api-client-react";
import { MessageSquare, Send, Users, Wifi, WifiOff } from "lucide-react";

export default function CollaboratorGroups() {
  useAuth(true, "collaborator");
  const { data: groups, isLoading } = useListGroups();

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Meus Grupos Atribuidos</h1>
          <p className="text-muted-foreground">Grupos de WhatsApp que voce pode gerenciar e enviar ofertas</p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-sm text-yellow-800">
          <strong>Importante:</strong> O PEGAPROMO nao armazena contatos ou dados de participantes dos grupos. Apenas o nome, nicho e token de conexao sao utilizados.
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Carregando grupos...</div>
        ) : !groups?.length ? (
          <div className="text-center py-12 bg-card border border-border rounded-2xl">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-lg font-semibold text-foreground">Nenhum grupo atribuido</p>
            <p className="text-muted-foreground">Solicite ao empreendedor que atribua grupos a voce</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groups.map(g => (
              <div key={g.id} className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{g.name}</p>
                      <p className="text-sm text-muted-foreground">{g.niche}</p>
                    </div>
                  </div>
                  {g.isConnected ? <Wifi className="w-5 h-5 text-green-500" /> : <WifiOff className="w-5 h-5 text-red-400" />}
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 bg-primary text-primary-foreground py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 hover:opacity-90">
                    <Send className="w-3.5 h-3.5" />
                    Enviar Oferta
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
