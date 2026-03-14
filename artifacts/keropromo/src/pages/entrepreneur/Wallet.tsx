import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useGetWallet, useRequestWithdrawal, useUpdatePixKey } from "@workspace/api-client-react";
import { PixKeyInputPixKeyType } from "@workspace/api-client-react";
import { formatCurrency } from "@/lib/utils";
import { Wallet as WalletIcon, ArrowDownRight, ArrowUpRight, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function Wallet() {
  const { data: wallet, isLoading } = useGetWallet();
  const { mutateAsync: requestWithdraw } = useRequestWithdrawal();
  const { mutateAsync: updatePix } = useUpdatePixKey();
  
  const [pixKeyType, setPixKeyType] = useState<PixKeyInputPixKeyType>("cpf");
  const [pixKey, setPixKey] = useState("");
  const [isEditingPix, setIsEditingPix] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleUpdatePix = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updatePix({ data: { pixKeyType, pixKey } });
      toast({ title: "Chave Pix atualizada com sucesso!" });
      setIsEditingPix(false);
      queryClient.invalidateQueries({ queryKey: ["/api/wallet"] });
    } catch(err) {
      toast({ variant: "destructive", title: "Erro ao salvar Chave Pix" });
    }
  };

  const handleWithdraw = async () => {
    if (!wallet?.pixKey) {
      toast({ variant: "destructive", title: "Cadastre uma chave Pix primeiro!" });
      return;
    }
    if (wallet.availableBalance <= 0) return;

    if (confirm(`Confirmar saque de ${formatCurrency(wallet.availableBalance)}? O valor será enviado para sua chave Pix cadastrada.`)) {
      try {
        await requestWithdraw({ data: { amount: wallet.availableBalance } });
        toast({ title: "Saque solicitado!", description: "O administrador processará seu pagamento em breve." });
        queryClient.invalidateQueries({ queryKey: ["/api/wallet"] });
      } catch(err) {
        toast({ variant: "destructive", title: "Erro ao solicitar saque" });
      }
    }
  };

  if (isLoading || !wallet) {
    return <DashboardLayout><div className="animate-pulse h-96 bg-muted rounded-3xl"></div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">Carteira Digital</h1>
        <p className="text-muted-foreground mt-1">Gerencie suas comissões e solicite saques via Pix.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Balance Card */}
        <div className="lg:col-span-2 bg-foreground text-background p-8 rounded-3xl relative overflow-hidden shadow-xl shadow-black/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-2 text-background/70 mb-2">
                <WalletIcon className="w-5 h-5" />
                <span className="font-semibold text-sm tracking-wide uppercase">Saldo Disponível</span>
              </div>
              <h2 className="text-5xl sm:text-6xl font-display font-black tracking-tight text-white mb-6">
                {formatCurrency(wallet.availableBalance)}
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-6 border-t border-background/10">
              <div className="flex gap-6 w-full sm:w-auto">
                <div>
                  <span className="text-xs text-background/50 uppercase tracking-wider block mb-1">A Liberar (35d)</span>
                  <span className="font-bold text-yellow-400">{formatCurrency(wallet.pendingBalance)}</span>
                </div>
                <div>
                  <span className="text-xs text-background/50 uppercase tracking-wider block mb-1">Total Sacado</span>
                  <span className="font-bold text-white">{formatCurrency(wallet.totalWithdrawn)}</span>
                </div>
              </div>

              <button 
                onClick={handleWithdraw}
                disabled={wallet.availableBalance <= 0}
                className="w-full sm:w-auto px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Solicitar Saque Pix
              </button>
            </div>
          </div>
        </div>

        {/* Pix Setup */}
        <div className="bg-card border p-6 rounded-3xl shadow-sm">
          <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary/10 text-primary flex items-center justify-center">
              <Zap className="w-3 h-3" />
            </div>
            Sua Chave Pix
          </h3>
          
          {!isEditingPix && wallet.pixKey ? (
            <div className="bg-secondary/50 rounded-xl p-4 border border-border/50">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Tipo: {wallet.pixKeyType}</p>
              <p className="font-mono font-medium text-lg truncate">{wallet.pixKey}</p>
              <button 
                onClick={() => {
                  setPixKeyType((wallet.pixKeyType || "cpf") as PixKeyInputPixKeyType);
                  setPixKey(wallet.pixKey || "");
                  setIsEditingPix(true);
                }}
                className="mt-4 text-sm font-bold text-primary hover:underline"
              >
                Alterar Chave
              </button>
            </div>
          ) : (
            <form onSubmit={handleUpdatePix} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1">Tipo de Chave</label>
                <select value={pixKeyType} onChange={e => setPixKeyType(e.target.value as PixKeyInputPixKeyType)} className="w-full p-2.5 rounded-lg border bg-background text-sm font-medium">
                  <option value="cpf">CPF</option>
                  <option value="cnpj">CNPJ</option>
                  <option value="email">E-mail</option>
                  <option value="phone">Telefone</option>
                  <option value="random">Chave Aleatória</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1">Chave Pix</label>
                <input required value={pixKey} onChange={e => setPixKey(e.target.value)} className="w-full p-2.5 rounded-lg border bg-background text-sm font-mono" placeholder="Sua chave..." />
              </div>
              <div className="flex gap-2">
                {wallet.pixKey && <button type="button" onClick={() => setIsEditingPix(false)} className="flex-1 py-2 bg-secondary font-bold text-sm rounded-lg">Cancelar</button>}
                <button type="submit" className="flex-1 py-2 bg-foreground text-background font-bold text-sm rounded-lg">Salvar</button>
              </div>
            </form>
          )}

          <div className="mt-6 flex items-start gap-3 bg-blue-50 text-blue-800 p-3 rounded-xl text-xs font-medium">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <p>Os saques são processados manualmente em até 2 dias úteis pela equipe KEROPROMO.</p>
          </div>
        </div>
      </div>

      <div className="bg-card border rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b">
          <h3 className="font-display font-bold text-lg">Histórico de Transações</h3>
        </div>
        <div className="divide-y divide-border/50">
          {wallet.transactions?.map(tx => (
            <div key={tx.id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-secondary/20 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                  {tx.type === 'credit' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-bold text-foreground">{tx.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <CalendarClock className="w-3 h-3" />
                    {new Date(tx.createdAt).toLocaleDateString('pt-BR')} às {new Date(tx.createdAt).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </div>
              <div className={`font-black font-mono ${tx.type === 'credit' ? 'text-green-600' : 'text-foreground'}`}>
                {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
              </div>
            </div>
          ))}
          {(!wallet.transactions || wallet.transactions.length === 0) && (
            <div className="p-12 text-center text-muted-foreground font-medium">
              Nenhuma transação encontrada.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

// Need to import missing icons at the top of the file
import { Zap, Info, CalendarClock } from "lucide-react";
