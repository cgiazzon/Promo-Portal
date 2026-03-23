// Módulo para gerenciar falhas, quedas ou bloqueios de fontes.
export class GerenciadorErros {
  static registrarErro(erro: Error) {
    console.error("[Erros] Falha capturada:", erro.message);
  }
}
