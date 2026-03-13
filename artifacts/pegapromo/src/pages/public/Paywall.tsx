import { PublicLayout } from "@/components/layout/PublicLayout";
import { Link } from "wouter";
import { Clock, CreditCard, Shield, Zap, CheckCircle } from "lucide-react";

export default function Paywall() {
  return (
    <PublicLayout>
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Clock className="w-8 h-8 text-yellow-600" />
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-3">Seu periodo de teste acabou</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Para continuar usando o PEGAPROMO e todas suas funcionalidades, escolha um plano e ative sua assinatura.
        </p>

        <div className="bg-card border border-border rounded-2xl p-8 mb-8 text-left">
          <h2 className="text-xl font-bold text-foreground mb-4">Com o PEGAPROMO voce pode:</h2>
          <ul className="space-y-3">
            {[
              "Enviar ofertas automaticamente para seus grupos de WhatsApp",
              "Acessar catalogo com ofertas de Shopee, Temu, Amazon e Mercado Livre",
              "Agendar envios e rastrear historico completo",
              "Acompanhar comissoes e sacar via Pix",
              "Convidar colaboradores para sua equipe",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { name: "Starter", price: "R$ 9,90", features: "1 grupo · 30 envios/mes" },
            { name: "Pro", price: "R$ 29,90", features: "3 grupos · 150 envios/mes · 2 colaboradores", popular: true },
            { name: "Business", price: "R$ 99,90", features: "Ilimitado" },
          ].map((plan) => (
            <div key={plan.name} className={`rounded-2xl p-6 border ${plan.popular ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-border bg-card"}`}>
              {plan.popular && <p className="text-xs font-bold text-primary uppercase mb-2">Mais Escolhido</p>}
              <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
              <p className="text-2xl font-bold text-foreground mt-1">{plan.price}<span className="text-sm font-normal text-muted-foreground">/mes</span></p>
              <p className="text-sm text-muted-foreground mt-2">{plan.features}</p>
              <Link href="/cadastro" className={`mt-4 block w-full py-2.5 rounded-xl font-semibold text-center ${plan.popular ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"}`}>
                Assinar {plan.name}
              </Link>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5"><Shield className="w-4 h-4" />Pagamento seguro</span>
          <span className="flex items-center gap-1.5"><CreditCard className="w-4 h-4" />Cancele quando quiser</span>
          <span className="flex items-center gap-1.5"><Zap className="w-4 h-4" />Ativacao imediata</span>
        </div>
      </div>
    </PublicLayout>
  );
}
