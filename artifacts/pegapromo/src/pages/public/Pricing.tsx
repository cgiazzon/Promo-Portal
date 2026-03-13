import { PublicLayout } from "@/components/layout/PublicLayout";
import { Link } from "wouter";
import { Check } from "lucide-react";

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "9,90",
      description: "Para quem está começando seu primeiro grupo",
      features: ["1 grupo gerenciado", "30 ofertas agendadas/mês", "Catálogo completo", "Carteira digital (Pix)"],
      notIncluded: ["Colaboradores", "Métricas avançadas"],
      cta: "Começar Starter"
    },
    {
      name: "Pro",
      price: "29,90",
      description: "A escolha da maioria dos empreendedores",
      popular: true,
      features: ["Até 3 grupos gerenciados", "150 ofertas agendadas/mês", "Catálogo completo", "Carteira digital (Pix)", "Métricas avançadas", "2 Colaboradores"],
      notIncluded: [],
      cta: "Começar Pro (Teste Grátis)"
    },
    {
      name: "Business",
      price: "99,90",
      description: "Para impérios de ofertas com grandes audiências",
      features: ["Grupos ilimitados", "Ofertas ilimitadas", "Catálogo completo", "Carteira digital (Pix)", "Métricas avançadas", "10 Colaboradores", "Suporte prioritário"],
      notIncluded: [],
      cta: "Começar Business"
    }
  ];

  return (
    <PublicLayout>
      <div className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-6xl font-display font-extrabold text-foreground mb-6">Planos que crescem com você</h1>
            <p className="text-xl text-muted-foreground">Todos os planos incluem 10 dias grátis para você testar a plataforma. Cancele a qualquer momento.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div key={plan.name} className={`bg-card rounded-3xl p-8 border ${plan.popular ? 'border-primary shadow-2xl shadow-primary/10 relative scale-105 z-10' : 'border-border'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Mais Escolhido
                  </div>
                )}
                <h3 className="text-2xl font-display font-bold text-foreground">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mt-2 min-h-[40px]">{plan.description}</p>
                <div className="my-6">
                  <span className="text-4xl font-black text-foreground">R${plan.price}</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <Link 
                  href={`/cadastro?plan=${plan.name.toLowerCase()}`}
                  className={`block text-center py-3 rounded-xl font-bold transition-all ${plan.popular ? 'bg-primary text-white hover:bg-primary/90 hover:shadow-lg' : 'bg-secondary text-foreground hover:bg-secondary/80'}`}
                >
                  {plan.cta}
                </Link>
                
                <div className="mt-8 space-y-4">
                  {plan.features.map(f => (
                    <div key={f} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-sm font-medium text-foreground">{f}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map(f => (
                    <div key={f} className="flex items-start gap-3 opacity-40 grayscale">
                      <Check className="w-5 h-5 shrink-0" />
                      <span className="text-sm font-medium line-through">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
