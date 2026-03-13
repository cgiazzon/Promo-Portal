import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useListOffers, useCreateOffer, useExtractProductData } from "@workspace/api-client-react";
import { useState } from "react";
import { Plus, Wand2, Loader2, Edit, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { getMarketplaceColor } from "@/lib/utils";

export default function AdminOffers() {
  const { data: offers, isLoading } = useListOffers();
  const { mutateAsync: extractData } = useExtractProductData();
  const { mutateAsync: createOffer } = useCreateOffer();
  
  const [isAdding, setIsAdding] = useState(false);
  const [extracting, setExtracting] = useState(false);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      url: "",
      title: "",
      originalPrice: 0,
      finalPrice: 0,
      discountPercent: 0,
      couponCode: "",
      category: "",
      imageUrl: "",
      productUrl: "",
      marketplaceId: 1
    }
  });

  const watchUrl = watch("url");

  const handleExtract = async () => {
    if (!watchUrl) return;
    setExtracting(true);
    try {
      const data = await extractData({ data: { url: watchUrl } });
      setValue("title", data.title);
      setValue("originalPrice", data.price);
      setValue("finalPrice", data.price * 0.8); // mock 20% discount
      setValue("discountPercent", 20);
      setValue("imageUrl", data.imageUrl || "");
      setValue("productUrl", watchUrl);
      // Auto detect marketplace mock
      if (data.marketplace === 'Shopee') setValue("marketplaceId", 1);
      if (data.marketplace === 'Amazon') setValue("marketplaceId", 3);
      toast({ title: "Dados extraídos com sucesso!" });
    } catch (e) {
      toast({ variant: "destructive", title: "Erro ao extrair link" });
    } finally {
      setExtracting(false);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      await createOffer({ data });
      queryClient.invalidateQueries({ queryKey: ["/api/offers"] });
      setIsAdding(false);
      reset();
      toast({ title: "Oferta criada e imagem gerada!" });
    } catch (err) {
      toast({ variant: "destructive", title: "Erro ao criar oferta" });
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Gestão de Ofertas</h1>
          <p className="text-muted-foreground mt-1">Cadastre produtos e o sistema gerará os links curtos e imagens automaticamente.</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nova Oferta
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-card p-6 sm:p-8 rounded-3xl border shadow-xl mb-8 animate-in slide-in-from-top-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold">Cadastrar Oferta</h2>
            <button onClick={() => setIsAdding(false)} className="text-muted-foreground hover:text-foreground font-medium text-sm">Cancelar</button>
          </div>

          <div className="flex gap-2 mb-8">
            <input 
              {...register("url")} 
              placeholder="Cole o link do produto (Shopee, Amazon...)" 
              className="flex-1 px-4 py-3 rounded-xl border focus:border-primary outline-none"
            />
            <button 
              type="button"
              onClick={handleExtract}
              disabled={extracting || !watchUrl}
              className="px-6 py-3 bg-foreground text-background rounded-xl font-bold hover:bg-primary transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {extracting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
              Extrair Dados
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Título do Produto</label>
                  <input {...register("title")} className="w-full px-4 py-3 rounded-xl border bg-background outline-none" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Preço Original</label>
                    <input type="number" step="0.01" {...register("originalPrice")} className="w-full px-4 py-3 rounded-xl border bg-background outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Preço Final</label>
                    <input type="number" step="0.01" {...register("finalPrice")} className="w-full px-4 py-3 rounded-xl border bg-background outline-none" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Desconto (%)</label>
                    <input type="number" {...register("discountPercent")} className="w-full px-4 py-3 rounded-xl border bg-background outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Cupom (Opcional)</label>
                    <input {...register("couponCode")} className="w-full px-4 py-3 rounded-xl border bg-background outline-none uppercase" />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">URL da Imagem</label>
                  <input {...register("imageUrl")} className="w-full px-4 py-3 rounded-xl border bg-background outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Marketplace</label>
                  <select {...register("marketplaceId")} className="w-full px-4 py-3 rounded-xl border bg-background outline-none appearance-none font-medium">
                    <option value="1">Shopee</option>
                    <option value="2">Temu</option>
                    <option value="3">Amazon</option>
                    <option value="4">Mercado Livre</option>
                  </select>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-4">Ao salvar, a imagem quadrada customizada com o badge do marketplace e percentual de desconto será gerada automaticamente.</p>
                  <button type="submit" className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg hover:-translate-y-0.5 transition-all">
                    Salvar e Gerar Imagem
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Offers Table View for Admin */}
      <div className="bg-card border rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-secondary/50 border-b border-border">
              <tr>
                <th className="p-4 font-bold text-sm text-muted-foreground">Produto</th>
                <th className="p-4 font-bold text-sm text-muted-foreground">Marketplace</th>
                <th className="p-4 font-bold text-sm text-muted-foreground">Preço</th>
                <th className="p-4 font-bold text-sm text-muted-foreground">Status</th>
                <th className="p-4 font-bold text-sm text-muted-foreground text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading ? (
                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Carregando...</td></tr>
              ) : offers?.map(offer => (
                <tr key={offer.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={offer.imageUrl} className="w-10 h-10 rounded-lg object-cover border" />
                      <div className="max-w-[200px] sm:max-w-xs">
                        <p className="font-bold text-sm truncate">{offer.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{offer.productUrl}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${getMarketplaceColor(offer.marketplaceName)}`}>
                      {offer.marketplaceName}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-sm font-bold">R${offer.finalPrice}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${offer.status === 'active' ? 'bg-primary' : 'bg-muted-foreground'}`}></div>
                      <span className="text-xs font-medium uppercase tracking-wider">{offer.status}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                      <button className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
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
