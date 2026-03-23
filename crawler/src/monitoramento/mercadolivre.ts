import axios from "axios";

export class MercadoLivreAPI {
  private static readonly BASE_URL = "https://api.mercadolibre.com";

  /**
   * Busca ofertas e promoções baseadas na API pública do Mercado Livre
   */
  static async buscarOfertas(termoDaBusca: string = "ofertas") {
    console.log(`[ML-API] Buscando ofertas para o termo: ${termoDaBusca}...`);
    try {
      // Exemplo usando a busca de itens (Search API)
      const response = await axios.get(`${this.BASE_URL}/sites/MLB/search`, {
        params: {
          q: termoDaBusca,
          limit: 10,
          // Outros parâmetros podem ser adicionados conforme a documentação oficial
        }
      });

      const itens = response.data.results;
      console.log(`[ML-API] Sucesso! Encontramos ${itens.length} ofertas brutas.`);
      
      return itens.map((item: any) => ({
        id: item.id,
        titulo: item.title,
        preco: item.price,
        link: item.permalink,
        imagem: item.thumbnail
      }));

    } catch (error: any) {
      console.error("[ML-API] Erro ao buscar dados do Mercado Livre:", error.message);
      throw error;
    }
  }

  // Futuramente, se precisarmos do Token OAuth do aplicativo que você está criando:
  // static async gerarTokenApp(clientId: string, clientSecret: string) { ... }
}
