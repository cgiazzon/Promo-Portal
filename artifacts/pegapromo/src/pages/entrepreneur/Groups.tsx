import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { WhatsAppBanner } from "@/components/WhatsAppBanner";
import { useListGroups, useCreateGroup, useDeleteGroup, useTestGroupConnection } from "@workspace/api-client-react";
import { useState } from "react";
import { Users, Plus, Trash2, ShieldCheck, Settings, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function Groups() {
  const { data: groups, isLoading } = useListGroups();
  const { mutateAsync: createGroup } = useCreateGroup();
  const { mutateAsync: deleteGroup } = useDeleteGroup();
  const { mutateAsync: testConnection } = useTestGroupConnection();
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isAdding, setIsAdding] = useState(false);
  const [testingId, setTestingId] = useState<number | null>(null);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: { name: "", niche: "", connectionToken: "" }
  });

  const onSubmit = async (data: { name: string; niche: string; connectionToken: string }) => {
    try {
      await createGroup({ data });
      queryClient.invalidateQueries({ queryKey: ["/api/groups"] });
      setIsAdding(false);
      reset();
      toast({ title: "Grupo adicionado!" });
    } catch (err) {
      toast({ variant: "destructive", title: "Erro ao adicionar grupo" });
    }
  };

  const handleDelete = async (id: number) => {
    if(confirm("Tem certeza que deseja remover este grupo? Os agendamentos pendentes falharão.")) {
      await deleteGroup({ id });
      queryClient.invalidateQueries({ queryKey: ["/api/groups"] });
    }
  };

  const handleTest = async (id: number) => {
    setTestingId(id);
    try {
      const res = await testConnection({ id });
      toast({
        title: res.connected ? "Conexão Bem-sucedida" : "Falha na Conexão",
        description: res.message,
        variant: res.connected ? "default" : "destructive"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/groups"] });
    } catch (err) {
      toast({ variant: "destructive", title: "Erro ao testar API" });
    } finally {
      setTestingId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Meus Grupos</h1>
          <p className="text-muted-foreground mt-1">Gerencie os grupos de WhatsApp onde as ofertas serão enviadas.</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="px-6 py-3 bg-foreground text-background font-bold rounded-xl hover:bg-primary transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Adicionar Grupo
          </button>
        )}
      </div>

      <div className="mb-8">
        <WhatsAppBanner type="checklist" />
      </div>

      {isAdding && (
        <div className="bg-card p-6 rounded-3xl border shadow-xl shadow-black/5 mb-8 animate-in slide-in-from-top-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold">Novo Grupo</h2>
            <button onClick={() => setIsAdding(false)} className="text-muted-foreground hover:text-foreground font-medium text-sm">Cancelar</button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Nome do Grupo</label>
                <input {...register("name")} placeholder="Ex: Ofertas Black Friday" className="w-full px-4 py-3 rounded-xl border focus:border-primary outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Nicho / Categoria</label>
                <input {...register("niche")} placeholder="Ex: Eletrônicos, Moda..." className="w-full px-4 py-3 rounded-xl border focus:border-primary outline-none" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Token de Conexão (Z-API / Evolution API)</label>
              <input {...register("connectionToken")} placeholder="Cole seu token aqui" className="w-full px-4 py-3 rounded-xl border focus:border-primary outline-none font-mono text-sm" required />
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> O PEGAPROMO armazena este token criptografado apenas para o envio automático.
              </p>
            </div>
            <div className="flex justify-end pt-4">
              <button type="submit" className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:-translate-y-0.5 shadow-lg shadow-primary/20 transition-all">
                Salvar Grupo
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[1,2].map(i => <div key={i} className="h-24 bg-muted rounded-2xl"></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {groups?.map(group => (
            <div key={group.id} className="bg-card border rounded-2xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-50 text-whatsapp flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">{group.name}</h3>
                    <span className="text-sm text-muted-foreground bg-secondary px-2 py-0.5 rounded-md inline-block mt-1">{group.niche}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleDelete(group.id)} className="p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${group.connectionStatus === 'connected' ? 'bg-primary' : 'bg-destructive'}`}></div>
                  <span className="text-sm font-semibold">{group.connectionStatus === 'connected' ? 'Conectado' : 'Desconectado'}</span>
                </div>
                <button 
                  onClick={() => handleTest(group.id)}
                  disabled={testingId === group.id}
                  className="text-sm font-bold text-primary flex items-center gap-2 hover:underline disabled:opacity-50"
                >
                  {testingId === group.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Settings className="w-4 h-4" />}
                  Testar API
                </button>
              </div>
            </div>
          ))}
          {groups?.length === 0 && !isAdding && (
            <div className="col-span-full text-center py-12 border-2 border-dashed rounded-3xl">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-bold">Nenhum grupo cadastrado</h3>
              <p className="text-muted-foreground mt-1 mb-4">Conecte seu primeiro grupo para começar a agendar ofertas.</p>
              <button onClick={() => setIsAdding(true)} className="px-6 py-2 bg-secondary font-bold rounded-xl hover:bg-secondary/80">Adicionar Agora</button>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
