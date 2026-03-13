import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useListCollaborators, useInviteCollaborator } from "@workspace/api-client-react";
import { Users, UserPlus, Mail, Trash2, Shield, Edit } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Collaborators() {
  const { data: collaborators, isLoading } = useListCollaborators();
  const { mutateAsync: invite } = useInviteCollaborator();
  const [showInvite, setShowInvite] = useState(false);
  const [email, setEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const { toast } = useToast();

  const handleInvite = async () => {
    if (!email) return;
    setInviting(true);
    try {
      await invite({ data: { email, permissions: ["manage_groups", "send_offers"] } });
      toast({ title: "Convite enviado!", description: `Um convite foi enviado para ${email}` });
      setEmail("");
      setShowInvite(false);
    } catch {
      toast({ title: "Erro ao enviar convite", variant: "destructive" });
    }
    setInviting(false);
  };

  const statusLabel: Record<string, { text: string; color: string }> = {
    active: { text: "Ativo", color: "bg-green-100 text-green-700" },
    pending: { text: "Pendente", color: "bg-yellow-100 text-yellow-700" },
    inactive: { text: "Inativo", color: "bg-gray-100 text-gray-500" },
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Colaboradores</h1>
            <p className="text-muted-foreground">Gerencie os colaboradores que podem acessar sua conta</p>
          </div>
          <button onClick={() => setShowInvite(!showInvite)} className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:opacity-90">
            <UserPlus className="w-4 h-4" />
            Convidar
          </button>
        </div>

        {showInvite && (
          <div className="bg-card border border-border rounded-2xl p-6 mb-6">
            <h3 className="font-semibold text-foreground mb-4">Convidar Colaborador</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-foreground mb-1.5">E-mail do colaborador</label>
                <input type="email" className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground" placeholder="colaborador@email.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="flex items-end gap-2">
                <button onClick={handleInvite} disabled={inviting} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:opacity-90 disabled:opacity-50">
                  <Mail className="w-4 h-4" />
                  {inviting ? "Enviando..." : "Enviar Convite"}
                </button>
                <button onClick={() => setShowInvite(false)} className="px-4 py-2.5 rounded-xl text-muted-foreground hover:bg-muted/50">Cancelar</button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">O colaborador receberá um e-mail com instruções de acesso. Disponibilidade depende do seu plano.</p>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Carregando colaboradores...</div>
        ) : !collaborators?.length ? (
          <div className="text-center py-12 bg-card border border-border rounded-2xl">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-lg font-semibold text-foreground">Nenhum colaborador</p>
            <p className="text-muted-foreground">Convide colaboradores para ajudar na gestão dos seus grupos</p>
          </div>
        ) : (
          <div className="space-y-3">
            {collaborators.map(c => (
              <div key={c.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{c.email}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Shield className="w-3 h-3 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">{c.permissions?.join(", ") || "Basico"}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusLabel[c.status]?.color || "bg-gray-100 text-gray-500"}`}>
                    {statusLabel[c.status]?.text || c.status}
                  </span>
                  <button className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/50"><Edit className="w-4 h-4" /></button>
                  <button className="p-2 text-muted-foreground hover:text-destructive rounded-lg hover:bg-muted/50"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
