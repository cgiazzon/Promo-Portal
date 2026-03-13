import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useListOffers, useCreateSchedule, useListGroups } from "@workspace/api-client-react";
import { useState } from "react";
import { OfferCard } from "@/components/OfferCard";
import { Search, Filter, X, Calendar as CalendarIcon, Clock, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";

export default function Catalog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [marketplaceFilter, setMarketplaceFilter] = useState("");
  
  const { data: offers, isLoading } = useListOffers({ marketplace: marketplaceFilter || undefined });
  const { data: groups } = useListGroups();
  const { mutateAsync: schedule } = useCreateSchedule();
  const { toast } = useToast();

  const [schedulingOffer, setSchedulingOffer] = useState<any>(null);
  const [scheduleData, setScheduleData] = useState({ groupIds: [] as number[], date: "", time: "" });

  const filteredOffers = offers?.filter(o => 
    o.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleData.date || !scheduleData.time || scheduleData.groupIds.length === 0) {
      toast({ variant: "destructive", title: "Preencha todos os campos" });
      return;
    }

    const scheduledAt = new Date(`${scheduleData.date}T${scheduleData.time}:00`).toISOString();

    try {
      await schedule({
        data: {
          offerId: schedulingOffer.id,
          groupIds: scheduleData.groupIds,
          scheduledAt
        }
      });
      toast({ title: "Sucesso!", description: "Oferta agendada para envio." });
      setSchedulingOffer(null);
      setScheduleData({ groupIds: [], date: "", time: "" });
    } catch (err) {
      toast({ variant: "destructive", title: "Erro ao agendar" });
    }
  };

  const toggleGroupSelection = (id: number) => {
    setScheduleData(prev => ({
      ...prev,
      groupIds: prev.groupIds.includes(id) 
        ? prev.groupIds.filter(g => g !== id)
        : [...prev.groupIds, id]
    }));
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Catálogo de Ofertas</h1>
          <p className="text-muted-foreground mt-1">Encontre os melhores produtos para seus grupos.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card p-4 rounded-2xl border shadow-sm mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Buscar produtos..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-secondary border-none rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
          />
        </div>
        <select 
          value={marketplaceFilter}
          onChange={(e) => setMarketplaceFilter(e.target.value)}
          className="px-4 py-3 bg-secondary border-none rounded-xl focus:ring-2 focus:ring-primary outline-none appearance-none font-medium text-foreground"
        >
          <option value="">Todos Marketplaces</option>
          <option value="Shopee">Shopee</option>
          <option value="Amazon">Amazon</option>
          <option value="Mercado Livre">Mercado Livre</option>
          <option value="Temu">Temu</option>
        </select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
          {[1,2,3,4,5,6].map(i => <div key={i} className="bg-muted h-96 rounded-2xl"></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredOffers?.map(offer => (
            <OfferCard key={offer.id} offer={offer} onSchedule={setSchedulingOffer} />
          ))}
        </div>
      )}

      {/* Scheduling Modal */}
      {schedulingOffer && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border shadow-2xl rounded-3xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-display font-bold">Agendar Envio</h2>
              <button onClick={() => setSchedulingOffer(null)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleScheduleSubmit} className="p-6 space-y-6">
              {/* Offer Preview short */}
              <div className="flex gap-4 items-center bg-secondary/50 p-3 rounded-xl">
                <img src={schedulingOffer.imageUrl} className="w-16 h-16 rounded-lg object-cover" />
                <div>
                  <h4 className="font-bold line-clamp-1">{schedulingOffer.title}</h4>
                  <p className="text-primary font-black">{formatCurrency(schedulingOffer.finalPrice)}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3">Selecione os Grupos</label>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                  {groups?.map(group => (
                    <div 
                      key={group.id} 
                      onClick={() => toggleGroupSelection(group.id)}
                      className={`p-3 border rounded-xl flex items-center justify-between cursor-pointer transition-colors ${scheduleData.groupIds.includes(group.id) ? 'border-primary bg-primary/5' : 'hover:bg-secondary'}`}
                    >
                      <span className="font-medium">{group.name}</span>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${scheduleData.groupIds.includes(group.id) ? 'border-primary bg-primary text-white' : 'border-border'}`}>
                        {scheduleData.groupIds.includes(group.id) && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                  ))}
                  {groups?.length === 0 && <p className="text-sm text-muted-foreground">Você ainda não conectou nenhum grupo.</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 flex items-center gap-2"><CalendarIcon className="w-4 h-4"/> Data</label>
                  <input 
                    type="date" 
                    value={scheduleData.date}
                    onChange={e => setScheduleData(p => ({...p, date: e.target.value}))}
                    className="w-full px-4 py-3 rounded-xl border focus:border-primary outline-none bg-background"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 flex items-center gap-2"><Clock className="w-4 h-4"/> Horário</label>
                  <input 
                    type="time" 
                    value={scheduleData.time}
                    onChange={e => setScheduleData(p => ({...p, time: e.target.value}))}
                    className="w-full px-4 py-3 rounded-xl border focus:border-primary outline-none bg-background"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 border-t flex justify-end gap-3">
                <button type="button" onClick={() => setSchedulingOffer(null)} className="px-6 py-3 font-bold text-muted-foreground hover:bg-secondary rounded-xl transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">
                  Confirmar Agendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
