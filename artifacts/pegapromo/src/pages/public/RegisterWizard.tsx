import { PublicLayout } from "@/components/layout/PublicLayout";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useRegister } from "@workspace/api-client-react";
import { Check, CreditCard, User, Package, Loader2, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";

export default function RegisterWizard() {
  const [step, setStep] = useState(1);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { mutateAsync: registerMutation } = useRegister();
  
  const { register, handleSubmit, getValues, watch, setValue } = useForm({
    defaultValues: { name: "", email: "", password: "", phone: "", planId: 2 }
  });

  const [loading, setLoading] = useState(false);

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const onFinalSubmit = async () => {
    setLoading(true);
    try {
      // Mock stripe processing time
      await new Promise(r => setTimeout(r, 1500));
      const res = await registerMutation({ data: getValues() });
      if (res.token) {
        localStorage.setItem("auth_token", res.token);
      }
      setStep(4);
    } catch (e: unknown) {
      toast({
        variant: "destructive",
        title: "Erro no cadastro",
        description: "Ocorreu um erro ao criar sua conta."
      });
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    { id: 1, name: "Starter", price: "9,90" },
    { id: 2, name: "Pro", price: "29,90" },
    { id: 3, name: "Business", price: "99,90" }
  ];

  const selectedPlanId = watch("planId");
  const selectedPlan = plans.find(p => p.id === selectedPlanId);

  return (
    <PublicLayout>
      <div className="flex-1 py-12 bg-background">
        <div className="max-w-2xl mx-auto px-4">
          
          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border z-0 rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
              </div>
              
              {[
                { s: 1, icon: User, label: "Dados" },
                { s: 2, icon: Package, label: "Plano" },
                { s: 3, icon: CreditCard, label: "Pagamento" },
                { s: 4, icon: Check, label: "Pronto" }
              ].map(item => (
                <div key={item.s} className="relative z-10 flex flex-col items-center gap-2 bg-background px-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= item.s ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-muted text-muted-foreground'}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs font-bold hidden sm:block ${step >= item.s ? 'text-primary' : 'text-muted-foreground'}`}>{item.label}</span>
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
                    <input {...register("name")} className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">E-mail</label>
                    <input {...register("email")} type="email" className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary outline-none" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">WhatsApp</label>
                      <input {...register("phone")} placeholder="(11) 99999-9999" className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary outline-none" required />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Senha</label>
                      <input {...register("password")} type="password" className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary outline-none" required />
                    </div>
                  </div>
                  <button onClick={nextStep} className="w-full mt-6 bg-primary text-white py-4 rounded-xl font-bold hover:-translate-y-0.5 transition-transform flex items-center justify-center gap-2">
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
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${selectedPlanId === plan.id ? 'border-primary bg-primary/5 shadow-md' : 'border-border hover:border-primary/40'}`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-bold text-lg">{plan.name}</h3>
                          <p className="text-sm text-muted-foreground">10 dias de teste grátis</p>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-black">R${plan.price}</span>
                          <span className="text-xs text-muted-foreground block">/mês</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex gap-4 mt-8">
                    <button onClick={prevStep} className="px-6 py-4 rounded-xl font-bold bg-secondary text-secondary-foreground hover:bg-secondary/80">Voltar</button>
                    <button onClick={nextStep} className="flex-1 bg-primary text-white py-4 rounded-xl font-bold hover:-translate-y-0.5 transition-transform flex items-center justify-center gap-2">
                      Pagamento <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4">
                <h2 className="text-2xl font-display font-bold mb-2">Finalizar Assinatura</h2>
                <p className="text-muted-foreground mb-6">Você não será cobrado hoje. O plano <strong>{selectedPlan?.name} (R${selectedPlan?.price}/mês)</strong> iniciará após 10 dias.</p>
                
                <div className="bg-secondary p-6 rounded-2xl mb-6 border border-border/50">
                  {/* Mock Stripe Elements */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Número do Cartão (Mock)</label>
                      <input placeholder="0000 0000 0000 0000" className="w-full px-4 py-3 rounded-xl border border-border bg-white outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Validade</label>
                        <input placeholder="MM/AA" className="w-full px-4 py-3 rounded-xl border border-border bg-white outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">CVC</label>
                        <input placeholder="123" className="w-full px-4 py-3 rounded-xl border border-border bg-white outline-none" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={prevStep} className="px-6 py-4 rounded-xl font-bold bg-secondary text-secondary-foreground hover:bg-secondary/80">Voltar</button>
                  <button 
                    onClick={onFinalSubmit} 
                    disabled={loading}
                    className="flex-1 bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                    Iniciar Teste Grátis
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="text-center animate-in zoom-in-95 duration-500 py-8">
                <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-display font-black text-foreground mb-4">Conta criada com sucesso!</h2>
                <p className="text-lg text-muted-foreground mb-8">Seja bem-vindo ao PEGAPROMO.</p>
                
                <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl text-left mb-8">
                  <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-2">
                    <Check className="w-5 h-5 text-blue-600" />
                    Último passo importante
                  </h3>
                  <p className="text-blue-800 text-sm">
                    Para conectar a plataforma aos seus grupos, certifique-se de estar usando o <strong>WhatsApp Business</strong>. O WhatsApp comum não é suportado pela integração oficial.
                  </p>
                </div>

                <button onClick={() => setLocation("/login")} className="w-full bg-foreground text-background py-4 rounded-xl font-bold text-lg hover:bg-primary transition-colors">
                  Acessar meu Painel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
