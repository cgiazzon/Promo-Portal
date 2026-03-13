import { PublicLayout } from "@/components/layout/PublicLayout";
import { useState } from "react";
import { ChevronDown, MessageCircle, Send } from "lucide-react";

const faqs = [
  { q: "O que é o PEGAPROMO?", a: "O PEGAPROMO é uma plataforma SaaS que conecta empreendedores aos maiores marketplaces (Shopee, Temu, Amazon e Mercado Livre) como afiliados. Você seleciona ofertas do nosso catálogo e agenda o envio automático para seus grupos de WhatsApp Business." },
  { q: "Preciso do WhatsApp Business?", a: "Sim! O PEGAPROMO funciona exclusivamente com o WhatsApp Business. Se você ainda usa o WhatsApp comum, é necessário migrar antes de conectar seus grupos." },
  { q: "O PEGAPROMO armazena dados dos participantes dos meus grupos?", a: "Não. O PEGAPROMO armazena apenas o nome do grupo, o nicho e o token de conexão. Nenhum dado de participantes, contatos ou mensagens é lido, armazenado ou processado." },
  { q: "Como funciona o trial gratuito?", a: "Você tem 10 dias para testar o PEGAPROMO gratuitamente. Cadastramos seu cartão no momento da criação da conta, mas a cobrança só inicia após os 10 dias. Você pode cancelar a qualquer momento." },
  { q: "Como recebo minhas comissões?", a: "As comissões são calculadas automaticamente com base nas vendas geradas pelos seus links de afiliado. O valor fica disponível na sua carteira digital 35 dias após a venda, e você pode solicitar o saque via Pix a qualquer momento." },
  { q: "Existe valor mínimo para saque?", a: "Não! Você pode solicitar o saque de qualquer valor disponível na sua carteira digital. Os saques são processados manualmente pela equipe PEGAPROMO via Pix." },
  { q: "Quantos grupos posso gerenciar?", a: "Depende do seu plano: Starter permite 1 grupo, Pro permite 3 grupos, e Business oferece grupos ilimitados." },
  { q: "Posso ter colaboradores na minha conta?", a: "Sim! Nos planos Pro (até 2) e Business (até 10), você pode convidar colaboradores para ajudar na gestão de grupos e agendamentos." },
  { q: "Como funciona o envio automático para o WhatsApp?", a: "Você seleciona uma oferta do catálogo, escolhe os grupos de destino e agenda a data/hora. No horário programado, o PEGAPROMO envia automaticamente a imagem da oferta e o link de afiliado no grupo via Z-API ou Evolution API." },
  { q: "Posso cancelar minha assinatura?", a: "Sim, a qualquer momento nas configurações do seu painel. Após o cancelamento, você mantém acesso até o fim do período já pago." },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Perguntas Frequentes</h1>
          <p className="text-lg text-muted-foreground">Encontre respostas para as dúvidas mais comuns sobre o PEGAPROMO</p>
        </div>

        <div className="space-y-3 mb-16">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-border rounded-xl overflow-hidden bg-card">
              <button
                className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="font-semibold text-foreground pr-4">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform ${openIndex === i ? "rotate-180" : ""}`} />
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5 text-muted-foreground leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Fale Conosco</h2>
              <p className="text-muted-foreground">Não encontrou sua resposta? Entre em contato!</p>
            </div>
          </div>

          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Mensagem enviada com sucesso!"); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Nome</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground" placeholder="Seu nome" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">E-mail</label>
                <input type="email" className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground" placeholder="seu@email.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Mensagem</label>
              <textarea className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground min-h-[120px] resize-none" placeholder="Descreva sua dúvida..." value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
            </div>
            <button type="submit" className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity">
              <Send className="w-4 h-4" />
              Enviar Mensagem
            </button>
          </form>
        </div>
      </div>
    </PublicLayout>
  );
}
