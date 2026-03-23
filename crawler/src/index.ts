import { MonitoramentoFontes } from "./monitoramento";
import { EstatisticasSistema } from "./estatisticas";

async function iniciarCrawler() {
  console.log("=== INICIANDO MÓDULO ISOLADO DE CRAWLER ===");
  MonitoramentoFontes.iniciar();
  EstatisticasSistema.exibirMetricas();
}

iniciarCrawler();
