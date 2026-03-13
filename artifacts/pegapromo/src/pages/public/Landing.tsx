import { PublicLayout } from "@/components/layout/PublicLayout";
import { Link } from "wouter";
import { Zap, Target, TrendingUp, Smartphone, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-background">
        <div className="absolute inset-0 w-full h-full opacity-30">
           <img 
             src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
             alt="Background" 
             className="w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/80 to-background"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-primary/10 text-primary font-bold text-sm mb-6 border border-primary/20">
              Automatize suas comissões de afiliado
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-extrabold text-foreground tracking-tight leading-tight max-w-4xl mx-auto text-balance">
              Transforme seus grupos de WhatsApp em uma <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-[#1DA851]">máquina de vendas</span>
            </h1>
            <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
              O PEGAPROMO conecta você aos maiores marketplaces, gera imagens lindas automaticamente e envia ofertas para seus grupos na hora que você quiser.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/cadastro" 
                className="px-8 py-4 bg-primary text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5 fill-current" />
                Começar Teste Grátis de 10 Dias
              </Link>
              <Link 
                href="/#como-funciona" 
                className="px-8 py-4 bg-card text-foreground border border-border rounded-2xl font-bold text-lg hover:bg-secondary transition-colors flex items-center justify-center"
              >
                Entender como funciona
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-foreground font-medium">Sem compromisso. Cancele quando quiser.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 mx-auto max-w-5xl rounded-3xl overflow-hidden shadow-2xl shadow-black/10 border border-border/50 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"></div>
            <img 
              src={`${import.meta.env.BASE_URL}images/dashboard-mock.png`} 
              alt="Dashboard PEGAPROMO" 
              className="w-full h-auto object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="como-funciona" className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">Trabalhe de forma inteligente, não dura.</h2>
            <p className="mt-4 text-lg text-muted-foreground">Tudo que você precisa para focar no que importa: crescer sua audiência.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background p-8 rounded-3xl border border-border/50 hover:border-primary/50 transition-colors group">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 font-display">Ofertas Prontas</h3>
              <p className="text-muted-foreground">Nosso time cadastra as melhores ofertas da Shopee, Amazon, Temu e Mercado Livre. É só escolher e agendar.</p>
            </div>
            
            <div className="bg-background p-8 rounded-3xl border border-border/50 hover:border-primary/50 transition-colors group">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Smartphone className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 font-display">Envio Automático</h3>
              <p className="text-muted-foreground">Conecte seu WhatsApp Business uma vez e programe envios para a semana toda. O sistema dispara sozinho!</p>
            </div>

            <div className="bg-background p-8 rounded-3xl border border-border/50 hover:border-primary/50 transition-colors group">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 font-display">Carteira Digital</h3>
              <p className="text-muted-foreground">Acompanhe seus cliques e vendas. Suas comissões caem direto na sua carteira para saque via Pix.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-12">Empreendedores que já mudaram o jogo</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-black/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                <div className="flex items-center gap-1 text-yellow-400 mb-4">
                  {[...Array(5)].map((_, j) => <Zap key={j} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-white/90 italic mb-6">
                  "Antes eu passava o dia todo baixando foto, criando link, enviando em grupo por grupo. Agora o PEGAPROMO faz tudo. Minhas vendas triplicaram."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">M</div>
                  <div>
                    <strong className="block text-sm">Maria Silva</strong>
                    <span className="text-xs text-white/70">5 Grupos no WhatsApp</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
