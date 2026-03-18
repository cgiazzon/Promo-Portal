import { PublicLayout } from "@/components/layout/PublicLayout";
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useRegister } from "@workspace/api-client-react";
import { Check, CreditCard, User, Package, Loader2, ArrowRight, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

async function fetchStripePublishableKey(): Promise<string> {
  const res = await fetch(`${API_BASE}/api/billing/stripe-key`);
  const data = await res.json();
  return data.publishableKey as string;
}

const plans = [
  {
    id: 1,
    name: "Starter",
    price: "9,90",
    desc: "1 grupo · 50 envios/mês",
  },
  {
    id: 2,
    name: "Pro",
    price: "29,90",
    desc: "3 grupos · 150 envios/mês · 2 colaboradores",
  },
  {
    id: 3,
    name: "Business",
    price: "99,90",
    desc: "Grupos ilimitados · Envios ilimitados",
  },
];

interface WizardFormValues {
  name: string;
  email: string;
  password: string;
  phone: string;
  planId: number;
}

interface PaymentStepProps {
  formValues: WizardFormValues;
  selectedPlan: (typeof plans)[0] | undefined;
  onSuccess: () => void;
  onBack: () => void;
}

function PaymentStep({ formValues, selectedPlan, onSuccess, onBack }: PaymentStepProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const { mutateAsync: registerMutation } = useRegister();
  const [loading, setLoading] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!stripe || !elements) return;
    setLoading(true);
    setCardError(null);

    try {
      const cardEl = elements.getElement(CardElement);
      if (!cardEl) throw new Error("Card element not mounted");

      const res = await registerMutation({ data: formValues });

      if (res.token) localStorage.setItem("auth_token", res.token);
      if (res.refreshToken) localStorage.setItem("refresh_token", res.refreshToken);

      const setupRes = await fetch(`${API_BASE}/api/billing/setup-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${res.token}`,
        },
      });

      if (setupRes.ok) {
        const { clientSecret } = await setupRes.json();
        if (clientSecret) {
          const { error } = await stripe.confirmCardSetup(clientSecret, {
            payment_method: {
              card: cardEl,
              billing_details: { name: formValues.name, email: formValues.email },
            },
          });
          if (error) {
            setCardError(error.message ?? "Erro no cartão");
            setLoading(false);
            return;
          }
        }
      }

      onSuccess();
    } catch (e: unknown) {
      toast({
        variant: "destructive",
        title: "Erro no cadastro",
        description: "Ocorreu um erro ao criar sua conta. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4">
      <h2 className="text-2xl font-display font-bold mb-2">Finalizar Assinatura</h2>
      <p className="text-muted-foreground mb-6">
        Você não será cobrado hoje. O plano{" "}
        <strong>
          {selectedPlan?.name} (R${selectedPlan?.price}/mês)
        </strong>{" "}
        iniciará após 10 dias de teste grátis.
      </p>

      <div className="bg-secondary p-6 rounded-2xl mb-4 border border-border/50">
        <label className="block text-sm font-semibold mb-3">Dados do Cartão</label>
        <div className="bg-white rounded-xl border border-border px-4 py-3.5">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#1a1a1a",
                  fontFamily: "inherit",
                  "::placeholder": { color: "#9ca3af" },
                },
                invalid: { color: "#ef4444" },
              },
              hidePostalCode: true,
            }}
            onChange={e => setCardError(e.error?.message ?? null)}
          />
        </div>
        {cardError && (
          <p className="mt-2 text-sm text-destructive">{cardError}</p>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
        <Shield className="w-3.5 h-3.5 flex-shrink-0" />
        Seus dados são protegidos por criptografia SSL. Pagamento seguro via Stripe.
      </div>

      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="px-6 py-4 rounded-xl font-bold bg-secondary text-secondary-foreground hover:bg-secondary/80"
        >
          Voltar
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading || !stripe}
          className="flex-1 bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Check className="w-5 h-5" />
          )}
          Iniciar Teste Grátis
        </button>
      </div>
    </div>
  );
}

export default function RegisterWizard() {
  const [step, setStep] = useState(1);
  const [, setLocation] = useLocation();
  const [stripePromise, setStripePromise] = useState<ReturnType<typeof loadStripe> | null>(null);

  const { register, watch, setValue, getValues } = useForm<WizardFormValues>({
    defaultValues: { name: "", email: "", password: "", phone: "", planId: 2 },
  });

  useEffect(() => {
    fetchStripePublishableKey()
      .then(key => setStripePromise(loadStripe(key)))
      .catch(e => console.error("Failed to load Stripe key:", e));
  }, []);

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const selectedPlanId = watch("planId");
  const selectedPlan = plans.find(p => p.id === selectedPlanId);

  return (
    <PublicLayout>
      <div className="flex-1 py-12 bg-background">
        <div className="max-w-2xl mx-auto px-4">
          <div className="mb-12">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border z-0 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${((step - 1) / 3) * 100}%` }}
                />
              </div>
              {[
                { s: 1, icon: User, label: "Dados" },
                { s: 2, icon: Package, label: "Plano" },
                { s: 3, icon: CreditCard, label: "Pagamento" },
                { s: 4, icon: Check, label: "Pronto" },
              ].map(item => (
                <div
                  key={item.s}
                  className="relative z-10 flex flex-col items-center gap-2 bg-background px-2"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= item.s ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-muted text-muted-foreground"}`}
                  >
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-xs font-bold hidden sm:block ${step >= item.s ? "text-primary" : "text-muted-foreground"}`}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border/50 rounded-3xl shadow-xl p-6 sm:p-10">
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4">
                <h2 className="text-2xl font-display font-bold mb-6">Crie sua conta</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Nome Completo</label>
                    <input
                      {...register("name")}
                      className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">E-mail</label>
                    <input
                      {...register("email")}
                      type="email"
                      className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary outline-none"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">WhatsApp</label>
                      <input
                        {...register("phone")}
                        placeholder="(11) 99999-9999"
                        className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Senha</label>
                      <input
                        {...register("password")}
                        type="password"
                        className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary outline-none"
                        required
                      />
                    </div>
                  </div>
                  <button
                    onClick={nextStep}
                    className="w-full mt-6 bg-primary text-white py-4 rounded-xl font-bold hover:-translate-y-0.5 transition-transform flex items-center justify-center gap-2"
                  >
                    Continuar <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4">
                <h2 className="text-2xl font-display font-bold mb-6">Escolha seu plano</h2>
                <div className="space-y-4">
                  {plans.map(plan => (
                    <div
                      key={plan.id}
                      onClick={() => setValue("planId", plan.id)}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${selectedPlanId === plan.id ? "border-primary bg-primary/5 shadow-md" : "border-border hover:border-primary/40"}`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-bold text-lg">{plan.name}</h3>
                          <p className="text-sm text-muted-foreground">{plan.desc}</p>
                          <p className="text-xs text-primary mt-1">10 dias de teste grátis</p>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-black">R${plan.price}</span>
                          <span className="text-xs text-muted-foreground block">/mês</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={prevStep}
                      className="px-6 py-4 rounded-xl font-bold bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    >
                      Voltar
                    </button>
                    <button
                      onClick={nextStep}
                      className="flex-1 bg-primary text-white py-4 rounded-xl font-bold hover:-translate-y-0.5 transition-transform flex items-center justify-center gap-2"
                    >
                      Pagamento <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && stripePromise && (
              <Elements stripe={stripePromise}>
                <PaymentStep
                  formValues={getValues()}
                  selectedPlan={selectedPlan}
                  onSuccess={() => setStep(4)}
                  onBack={prevStep}
                />
              </Elements>
            )}

            {step === 3 && !stripePromise && (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}

            {step === 4 && (
              <div className="text-center animate-in zoom-in-95 duration-500 py-8">
                <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-display font-black text-foreground mb-4">
                  Conta criada com sucesso!
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Seja bem-vindo ao KERO PROMO. Seu teste grátis começa agora.
                </p>

                <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl text-left mb-8">
                  <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-2">
                    <Check className="w-5 h-5 text-blue-600" />
                    Último passo importante
                  </h3>
                  <p className="text-blue-800 text-sm">
                    Para conectar a plataforma aos seus grupos, certifique-se de estar usando o{" "}
                    <strong>WhatsApp Business</strong>. O WhatsApp comum não é suportado pela
                    integração oficial.
                  </p>
                </div>

                <button
                  onClick={() => setLocation("/login")}
                  className="w-full bg-foreground text-background py-4 rounded-xl font-bold text-lg hover:bg-primary transition-colors"
                >
                  Acessar meu Painel
                </button>
              </div>
            )}
          </div>

          {step < 4 && (
            <p className="text-center text-sm text-muted-foreground mt-6">
              Já tem conta?{" "}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Entrar
              </Link>
            </p>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
