import { PublicLayout } from "@/components/layout/PublicLayout";
import { Link } from "wouter";
import { Zap, Target, Smartphone, TrendingUp, Check, ChevronDown, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const faqs = [
  { q: "O que é o KERO PROMO?", a: "O KERO PROMO é uma plataforma SaaS que conecta empreendedores aos maiores marketplaces (Shopee, Temu, Amazon e Mercado Livre) como afiliados. Você seleciona ofertas do nosso catálogo e agenda o envio automático para seus grupos de WhatsApp Business." },
  { q: "Preciso do WhatsApp Business?", a: "Sim! O KERO PROMO funciona exclusivamente com o WhatsApp Business. Se você ainda usa o WhatsApp comum, é necessário migrar antes de conectar seus grupos." },
  { q: "O KERO PROMO armazena dados dos participantes dos meus grupos?", a: "Não. O KERO PROMO armazena apenas o nome do grupo, o nicho e o token de conexão. Nenhum dado de participantes, contatos ou mensagens é lido, armazenado ou processado." },
  { q: "Como funciona o trial gratuito?", a: "Você tem 10 dias para testar o KERO PROMO gratuitamente. Cadastramos seu cartão no momento da criação da conta, mas a cobrança só inicia após os 10 dias. Você pode cancelar a qualquer momento." },
  { q: "Como recebo minhas comissões?", a: "As comissões são calculadas automaticamente com base nas vendas geradas pelos seus links de afiliado. O valor fica disponível na sua carteira digital 35 dias após a venda, e você pode solicitar o saque via Pix a qualquer momento." },
  { q: "Existe valor mínimo para saque?", a: "Não! Você pode solicitar o saque de qualquer valor disponível na sua carteira digital. Os saques são processados manualmente pela equipe KERO PROMO via Pix." },
  { q: "Quantos grupos posso gerenciar?", a: "Depende do seu plano: Starter permite 1 grupo, Pro permite 3 grupos, e Business oferece grupos ilimitados." },
  { q: "Posso ter colaboradores na minha conta?", a: "Sim! Nos planos Pro (até 2) e Business (até 10), você pode convidar colaboradores para ajudar na gestão de grupos e agendamentos." },
  { q: "Como funciona o envio automático para o WhatsApp?", a: "Você seleciona uma oferta do catálogo, escolhe os grupos de destino e agenda a data/hora. No horário programado, o KERO PROMO envia automaticamente a imagem da oferta e o link de afiliado no grupo via Z-API ou Evolution API." },
  { q: "Posso cancelar minha assinatura?", a: "Sim, a qualquer momento nas configurações do seu painel. Após o cancelamento, você mantém acesso até o fim do período já pago." },
];

const testimonials = [
  {
    name: "Maria Silva",
    groups: 12,
    text: "Antes eu passava o dia todo baixando foto, criando link, enviando em grupo por grupo. Agora o KERO PROMO faz tudo. Minhas vendas triplicaram!",
    avatar: "https://ui-avatars.com/api/?name=Maria+Silva&background=25D366&color=fff&size=80"
  },
  {
    name: "Carlos Oliveira",
    groups: 28,
    text: "Em 3 meses consegui sair do emprego CLT. Hoje administro meus grupos com o KERO PROMO e ganho mais do que o dobro do meu antigo salário.",
    avatar: "https://ui-avatars.com/api/?name=Carlos+Oliveira&background=1DA851&color=fff&size=80"
  },
  {
    name: "Ana Beatriz Costa",
    groups: 15,
    text: "A carteira digital com Pix é sensacional. Recebo minhas comissões sem complicação e consigo acompanhar tudo pelo painel.",
    avatar: "https://ui-avatars.com/api/?name=Ana+Beatriz&background=16A34A&color=fff&size=80"
  },
  {
    name: "Roberto Santos",
    groups: 42,
    text: "Comecei com 1 grupo e hoje tenho mais de 40. O plano Business é perfeito pra quem quer escalar de verdade. Recomendo demais!",
    avatar: "https://ui-avatars.com/api/?name=Roberto+Santos&background=15803D&color=fff&size=80"
  },
  {
    name: "Juliana Ferreira",
    groups: 18,
    text: "O agendamento automático mudou minha vida. Programo tudo no domingo e a semana toda roda no piloto automático. Mais tempo pra minha família!",
    avatar: "https://ui-avatars.com/api/?name=Juliana+Ferreira&background=22C55E&color=fff&size=80"
  },
  {
    name: "Pedro Henrique Lima",
    groups: 35,
    text: "Já testei várias plataformas e nenhuma chega perto do KERO PROMO. O catálogo de ofertas é incrível e o suporte é muito rápido.",
    avatar: "https://ui-avatars.com/api/?name=Pedro+Lima&background=4ADE80&color=000&size=80"
  }
];

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

export default function Landing() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 md:pt-20 md:pb-32 overflow-hidden bg-background">
        <div className="absolute inset-0 w-full h-full">
          <img
            src={`${import.meta.env.BASE_URL}images/hero-people.png`}
            alt="Pessoas felizes usando celular"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/60"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-primary/10 text-primary font-bold text-sm mb-6 border border-primary/20">
              Automatize suas comissões de afiliado
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-foreground tracking-tight leading-tight text-balance">
              Seu grupo de vendas no WhatsApp no{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#1DA851]">
                piloto automático.
              </span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl">
              As melhores ofertas dos maiores marketplaces diretamente em seus grupos de promoções. Comece a faturar como afiliado hoje!
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/cadastro"
                className="px-8 py-4 bg-lime-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-lime-500/30 hover:shadow-lime-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5 fill-current" />
                Começar Teste Grátis de 10 Dias
              </Link>
              <a
                href="#como-funciona"
                className="px-8 py-4 bg-card text-foreground border border-border rounded-2xl font-bold text-lg hover:bg-secondary transition-colors flex items-center justify-center"
              >
                Entender como funciona
              </a>
            </div>
            <p className="mt-4 text-sm text-muted-foreground font-medium">Sem compromisso. Cancele quando quiser.</p>
          </motion.div>
        </div>
      </section>

      {/* Marketplaces Parceiros */}
      <section className="py-12 bg-card border-y border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-8">
            Marketplaces parceiros
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
            <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Mercado Livre">
                <rect width="40" height="40" rx="8" fill="#FFE600"/>
                <path d="M20 10c-2.5 0-5 1.5-6 4-1 2.5-.5 5 1 7s4 3 6 3 4.5-1 6-3 2-4.5 1-7c-1-2.5-3.5-4-6-4h-2zm0 2c1.5 0 3 .8 3.8 2.2.8 1.4.6 3-.3 4.2-.9 1.2-2.3 1.8-3.5 1.8s-2.6-.6-3.5-1.8c-.9-1.2-1.1-2.8-.3-4.2C17 12.8 18.5 12 20 12z" fill="#2D3277"/>
              </svg>
              <span className="font-bold text-foreground text-sm hidden sm:block">Mercado Livre</span>
            </div>
            <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Magalu">
                <rect width="40" height="40" rx="8" fill="#0086FF"/>
                <circle cx="20" cy="16" r="5" fill="white"/>
                <path d="M13 28c0-4 3-7 7-7s7 3 7 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              </svg>
              <span className="font-bold text-foreground text-sm hidden sm:block">Magalu</span>
            </div>
            <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Shopee">
                <rect width="40" height="40" rx="8" fill="#EE4D2D"/>
                <path d="M20 11c-2.8 0-5.2 1.8-6 4.5h12c-.8-2.7-3.2-4.5-6-4.5z" fill="white"/>
                <rect x="13" y="17" width="14" height="3" rx="1.5" fill="white"/>
                <path d="M15 22v5c0 1 .8 2 1.8 2h6.4c1 0 1.8-1 1.8-2v-5" stroke="white" strokeWidth="2" fill="none"/>
              </svg>
              <span className="font-bold text-foreground text-sm hidden sm:block">Shopee</span>
            </div>
            <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Amazon">
                <rect width="40" height="40" rx="8" fill="#232F3E"/>
                <path d="M12 22c2.5 2.5 6 4 9 4s5.5-1 7-2.5" stroke="#FF9900" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                <path d="M26 21l2 2.5 2-1" stroke="#FF9900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <text x="20" y="18" textAnchor="middle" dominantBaseline="central" fill="white" fontWeight="700" fontSize="11">a</text>
              </svg>
              <span className="font-bold text-foreground text-sm hidden sm:block">Amazon</span>
            </div>
            <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Temu">
                <rect width="40" height="40" rx="8" fill="#FB7701"/>
                <text x="20" y="22" textAnchor="middle" dominantBaseline="central" fill="white" fontWeight="900" fontSize="14" fontFamily="inherit">Temu</text>
              </svg>
              <span className="font-bold text-foreground text-sm hidden sm:block">Temu</span>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">Como funciona</h2>
            <p className="mt-4 text-lg text-muted-foreground">Três passos simples para começar a faturar como afiliado</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative bg-card p-8 rounded-3xl border border-border/50 hover:border-primary/50 transition-colors group"
            >
              <div className="absolute -top-5 left-8 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center font-black text-lg shadow-lg shadow-primary/30">
                1
              </div>
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 mt-4 group-hover:scale-110 transition-transform">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 font-display">Escolha ofertas prontas</h3>
              <p className="text-muted-foreground">Nosso time cadastra as melhores ofertas da Shopee, Amazon, Temu, Magalu e Mercado Livre. É só escolher e agendar.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative bg-card p-8 rounded-3xl border border-border/50 hover:border-primary/50 transition-colors group"
            >
              <div className="absolute -top-5 left-8 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center font-black text-lg shadow-lg shadow-primary/30">
                2
              </div>
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 mt-4 group-hover:scale-110 transition-transform">
                <Smartphone className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 font-display">Envio automático para grupos</h3>
              <p className="text-muted-foreground">Conecte seu WhatsApp Business uma vez e programe envios para a semana toda. O sistema dispara sozinho!</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative bg-card p-8 rounded-3xl border border-border/50 hover:border-primary/50 transition-colors group"
            >
              <div className="absolute -top-5 left-8 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center font-black text-lg shadow-lg shadow-primary/30">
                3
              </div>
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 mt-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 font-display">Receba comissões na carteira</h3>
              <p className="text-muted-foreground">Acompanhe seus cliques e vendas em tempo real. Suas comissões caem direto na carteira digital para saque via Pix.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Planos */}
      <section id="planos" className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-foreground mb-4">Planos que crescem com você</h2>
            <p className="text-lg text-muted-foreground">Todos os planos incluem 10 dias grátis para você testar a plataforma. Cancele a qualquer momento.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-background rounded-3xl p-8 border ${plan.popular ? "border-primary shadow-2xl shadow-primary/10 relative md:scale-105 z-10" : "border-border"}`}
              >
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
                  className={`block text-center py-3 rounded-xl font-bold transition-all ${plan.popular ? "bg-lime-500 text-white hover:bg-lime-600 hover:shadow-lg" : "bg-secondary text-foreground hover:bg-secondary/80"}`}
                >
                  {plan.cta}
                </Link>
                <div className="mt-8 space-y-4">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-sm font-medium text-foreground">{f}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map((f) => (
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
      </section>

      {/* Depoimentos */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-12 text-center">Empreendedores que já mudaram o jogo</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-black/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                <div className="flex items-center gap-1 text-yellow-400 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-white/90 italic mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full"
                    loading="lazy"
                  />
                  <div>
                    <strong className="block text-sm">{t.name}</strong>
                    <span className="text-xs text-white/70">{t.groups} Grupos no WhatsApp</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">Perguntas Frequentes</h2>
            <p className="text-lg text-muted-foreground">Encontre respostas para as dúvidas mais comuns sobre o KERO PROMO</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-border rounded-xl overflow-hidden bg-card">
                <button
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors"
                  onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                >
                  <span className="font-semibold text-foreground pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform ${openFaqIndex === i ? "rotate-180" : ""}`} />
                </button>
                {openFaqIndex === i && (
                  <div className="px-5 pb-5 text-muted-foreground leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-primary to-[#1DA851] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-display font-extrabold mb-6">Pronto para faturar como afiliado?</h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de empreendedores que já automatizaram seus grupos de WhatsApp e estão ganhando comissões todos os dias.
          </p>
          <Link
            href="/cadastro"
            className="inline-flex items-center gap-2 px-10 py-4 bg-white text-primary rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
          >
            <Zap className="w-5 h-5 fill-current" />
            Começar Teste Grátis de 10 Dias
          </Link>
          <p className="mt-4 text-sm text-white/60 font-medium">Sem compromisso. Cancele quando quiser.</p>
        </div>
      </section>
    </PublicLayout>
  );
}
