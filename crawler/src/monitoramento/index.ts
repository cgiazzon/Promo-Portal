import { MercadoLivreAPI } from "./mercadolivre";

// Módulo para monitorar pontas e fontes de informações externas.
export class MonitoramentoFontes {
  static async iniciar() {
    console.log("[Monitoramento] Iniciando acompanhamento das fontes...");
    
    // Inicia a busca como teste no Mercado Livre
    const ofertas = await MercadoLivreAPI.buscarOfertas("promoção smartphone");
    console.log("[Monitoramento] Primeiros 3 itens processados de exemplo:", ofertas.slice(0, 3));
  }
}
