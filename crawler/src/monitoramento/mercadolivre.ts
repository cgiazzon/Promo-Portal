import axios from "axios";

export class MercadoLivreAPI {
  private static readonly BASE_URL = "https://api.mercadolibre.com";
  private static accessToken: string | null = null;

  static async autenticar() {
    const clientId = process.env.ML_APP_ID;
    const clientSecret = process.env.ML_SECRET_KEY;

    if (!clientId || !clientSecret) {
      console.warn("[ML-API] ⚠️ AVISO: Chaves não configuradas no .env. A busca não estará logada.");
      return;
    }

    try {
      console.log("[ML-API] 🔐 Gerando Token de Acesso seguro do seu App...");
      const response = await axios.post(`${this.BASE_URL}/oauth/token`, null, {
        params: {
          grant_type: "client_credentials",
          client_id: clientId,
          client_secret: clientSecret
        }
      });
      
      this.accessToken = response.data.access_token;
      console.log("[ML-API] ✅ Token App gerado! Robô validado com chaves do Mercado Livre.");
    } catch (error: any) {
      console.error("[ML-API] ❌ Falha de credenciais:", error?.response?.data || error.message);
    }
  }

  static async buscarOfertas(
    termoDaBusca: string = "ofertas",
    limite: number = 20,
    precoMin?: number,
    precoMax?: number
  ) {
    console.log(`[ML-API] 🔍 Filtro ativo: "${termoDaBusca}" | Quantidade: ${limite} itens | Limite de Preço: R$${precoMin || 0} - R$${precoMax || 'Máx'}`);
    
    // Se tivermos o token de aprovação, nós mandamos junto pro ML saber que somos VIP
    const headers: any = {};
    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    }

    // Configurando parâmetros avançados da Documentação do ML
    const params: any = {
      q: termoDaBusca,
      limit: limite,
      sort: "price_asc" // Filtrar pelos mais baratos do nicho
    };

    if (precoMin || precoMax) {
      const min = precoMin ? precoMin.toString() : "*";
      const max = precoMax ? precoMax.toString() : "*";
      params.price = `${min}-${max}`;
    }

    try {
      const response = await axios.get(`${this.BASE_URL}/sites/MLB/search`, {
        params,
        headers
      });

      const itens = response.data.results;
      console.log(`[ML-API] ✨ Sucesso! O Crawler capturou ${itens.length} anúncios brutos.`);
      
      // Filtramos apenas as moedas de Ouro cruzeiras pro nosso extrato
      return itens.map((item: any) => ({
        id: item.id,
        titulo: item.title,
        preco_atual: item.price,
        condicao: item.condition,
        estoque: item.available_quantity,
        imagem: item.thumbnail,
        link: item.permalink
      }));

    } catch (error: any) {
      console.error("[ML-API] ❌ Erro de varredura:", error?.response?.data || error.message);
      throw error;
    }
  }
}
