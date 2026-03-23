import { MercadoLivreAPI } from "./mercadolivre";
import dotenv from "dotenv";

// Carrega as variáveis (como as chaves Pessoais) do arquivo .env
dotenv.config();

export class MonitoramentoFontes {
  static async iniciar() {
    console.log("==========================================");
    console.log("[Monitoramento] Robô Crawler Despertado...");
    console.log("==========================================");
    
    // 1. O Robô veste o crachá do "App" do usuário e entra na porta oficial
    await MercadoLivreAPI.autenticar();

    // 2. O Robô digita o filtro e faz o scrape nativo das páginas da fonte
    const ofertas = await MercadoLivreAPI.buscarOfertas("promoção smartphone");
    
    // 3. Imprime as top 3 ofertas mais baratas como teste real na tela
    console.table(ofertas.slice(0, 3));
  }
}
