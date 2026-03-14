import { Info, ExternalLink, Download } from "lucide-react";

export function WhatsAppBanner({ type = "info" }: { type?: "info" | "checklist" }) {
  if (type === "checklist") {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="bg-whatsapp text-white p-3 rounded-xl shadow-md">
            <Info className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-green-900 font-display">Pré-requisitos de Conexão</h3>
            <p className="text-green-800 mt-1 mb-4">
              Para conectar seus grupos ao KEROPROMO, você precisa utilizar o WhatsApp Business.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-green-800 font-medium">
                <div className="w-5 h-5 rounded-full bg-whatsapp flex items-center justify-center text-white text-xs">✓</div>
                Tenho o WhatsApp Business instalado
              </li>
              <li className="flex items-center gap-3 text-green-800 font-medium">
                <div className="w-5 h-5 rounded-full bg-whatsapp flex items-center justify-center text-white text-xs">✓</div>
                Migrei meu número para o Business
              </li>
              <li className="flex items-center gap-3 text-green-800 font-medium">
                <div className="w-5 h-5 rounded-full bg-whatsapp flex items-center justify-center text-white text-xs">✓</div>
                Tenho o token de conexão em mãos
              </li>
            </ul>
            
            <p className="mt-5 text-sm text-green-700 bg-white/50 py-2 px-3 rounded-lg border border-green-100">
              <strong>Privacidade garantida:</strong> O KEROPROMO utiliza esta conexão exclusivamente para disparo de ofertas. Nenhum contato ou mensagem do grupo é lido ou armazenado.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 flex items-center gap-4">
      <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
        <Info className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-blue-900 font-medium">
          Ainda usa o WhatsApp comum? O KEROPROMO exige o WhatsApp Business para funcionar corretamente.
        </p>
      </div>
      <a 
        href="https://business.whatsapp.com/" 
        target="_blank" 
        rel="noreferrer"
        className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-blue-100 transition-colors"
      >
        <Download className="w-4 h-4" />
        Baixar App
      </a>
    </div>
  );
}
