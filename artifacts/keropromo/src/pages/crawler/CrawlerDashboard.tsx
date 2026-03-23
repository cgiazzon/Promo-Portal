import { useState, useEffect } from "react";
import { Activity, Database, AlertTriangle, BarChart3, Play, Square, Settings, RefreshCw, Server, Target, Zap, Globe, Cpu } from "lucide-react";

export default function CrawlerDashboard() {
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState("monitoramento");
  const [logs, setLogs] = useState<{time: string, msg: string, type: 'info'|'warning'|'error'|'success'}[]>([]);

  // Simulation of crawler background activity
  useEffect(() => {
    let interval: any;
    if (isRunning) {
      interval = setInterval(() => {
        const events = [
          { msg: "Varrendo fonte primária: Amazon Offers", type: "info" },
          { msg: "Novo bloco de 45 produtos capturado.", type: "success" },
          { msg: "Taxa de reposta lentidão detectada na fonte B.", type: "warning" },
          { msg: "Processando 12 itens na fila de extração...", type: "info" }
        ] as const;
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        
        setLogs(prev => [{ time: new Date().toLocaleTimeString(), ...randomEvent }, ...prev].slice(0, 50));
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div className="min-h-screen bg-[#0B0C10] text-slate-200 font-sans p-4 sm:p-8 tracking-wide">
      {/* Header Premium */}
      <header className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
            <Cpu className="text-white w-7 h-7" />
            {isRunning && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-[#0B0C10]"></span>
              </span>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tight">Crawler Engine</h1>
            <p className="text-sm text-indigo-300/80 font-medium">Módulo Isolado de Varredura e Extração</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-md">
          <button 
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all duration-300 ${
              isRunning 
              ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/30" 
              : "bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)]"
            }`}
          >
            {isRunning ? <Square fill="currentColor" className="w-4 h-4" /> : <Play fill="currentColor" className="w-4 h-4" />}
            {isRunning ? "Parar Motor" : "Iniciar Varredura"}
          </button>
          <button className="p-3 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 transition border border-transparent hover:border-white/10">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <nav className="flex flex-col gap-2">
          {[
            { id: "monitoramento", icon: Activity, label: "Monitoramento", desc: "Fontes e alvos" },
            { id: "extrato", icon: Database, label: "Extrato Bruto", desc: "Dados processados" },
            { id: "erros", icon: AlertTriangle, label: "Erros & Quedas", desc: "Logs de falhas" },
            { id: "estatisticas", icon: BarChart3, label: "Estatísticas", desc: "Métricas de sucesso" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-300 border ${
                activeTab === item.id 
                ? "bg-white/10 border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.5)]" 
                : "bg-transparent border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              <div className={`p-2 rounded-xl ${activeTab === item.id ? "bg-indigo-500 text-white" : "bg-white/5"}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">{item.label}</h3>
                <p className="text-xs opacity-70">{item.desc}</p>
              </div>
            </button>
          ))}
        </nav>

        {/* Dynamic Canvas */}
        <section className="col-span-1 lg:col-span-3">
          <div className="bg-[#12141C] border border-white/10 rounded-3xl p-6 sm:p-8 min-h-[600px] shadow-2xl relative overflow-hidden">
            
            {/* Ambient Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

            {/* TAB: MONITORAMENTO */}
            {activeTab === "monitoramento" && (
              <div className="relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <Target className="text-indigo-400" /> Fontes Analisadas
                  </h2>
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> 3 Fontes Ativas
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {["Amazon Marketplace", "Shopee API", "MercadoLivre Scraper"].map((fonte, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:border-indigo-500/50 transition-colors group cursor-pointer flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-[#1A1C25] border border-white/5 flex items-center justify-center">
                          <Globe className="w-5 h-5 text-indigo-300" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-200">{fonte}</h4>
                          <p className="text-xs text-slate-400 mt-0.5">Frequência: a cada 15 min</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-green-400 font-bold">Online</p>
                        <p className="text-[10px] text-slate-500 mt-1">Ping: {Math.floor(Math.random() * 50) + 12}ms</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Activity Feed */}
                <h3 className="text-sm font-bold tracking-widest text-slate-500 uppercase mb-4">Live Terminal Logs</h3>
                <div className="bg-[#090A0F] border border-white/10 rounded-2xl p-4 font-mono text-sm h-64 overflow-y-auto custom-scrollbar">
                  {logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500">
                      <Zap className="w-8 h-8 mb-2 opacity-20" />
                      <p>Motor inativo. Nenhum log registrado.</p>
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {logs.map((log, i) => (
                        <li key={i} className="flex items-start gap-4 p-2 hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/5">
                          <span className="text-slate-600 shrink-0">[{log.time}]</span>
                          <span className={`${
                            log.type === 'info' ? 'text-blue-300' :
                            log.type === 'success' ? 'text-green-400' :
                            log.type === 'error' ? 'text-red-400' : 'text-yellow-400'
                          }`}>
                            {log.msg}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {/* TAB: EXTRATO */}
            {activeTab === "extrato" && (
              <div className="relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center py-20">
                 <div className="w-24 h-24 bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-3xl mx-auto flex items-center justify-center mb-6">
                   <Database className="w-10 h-10 text-cyan-400" />
                 </div>
                 <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">Extrato de Dados Brutos</h2>
                 <p className="text-slate-400 max-w-md mx-auto mt-4 leading-relaxed">
                   Os itens capturados pelas fontes aparecerão aqui formatados em tabelas de extração, prontos para tratamento e categorização.
                 </p>
                 <button className="mt-8 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium transition text-sm flex items-center gap-2 mx-auto">
                   <RefreshCw className="w-4 h-4" /> Atualizar Tabela de Extrato
                 </button>
              </div>
            )}

            {/* TAB: ERROS */}
            {activeTab === "erros" && (
              <div className="relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center py-20">
                 <div className="w-24 h-24 bg-gradient-to-tr from-rose-500/20 to-red-600/20 border border-rose-500/30 rounded-3xl mx-auto flex items-center justify-center mb-6">
                   <AlertTriangle className="w-10 h-10 text-rose-400" />
                 </div>
                 <h2 className="text-2xl font-bold text-rose-300">Resiliência e Falhas</h2>
                 <p className="text-slate-400 max-w-md mx-auto mt-4 leading-relaxed">
                   O sistema está ouvindo por bloqueios de IP, falhas de CAPTCHA ou Timeouts. O robô reiniciará as conexões automaticamente caso ocorram.
                 </p>
                 <div className="mt-10 p-4 border border-rose-500/20 bg-rose-500/5 rounded-2xl max-w-lg mx-auto inline-block text-left">
                   <p className="text-sm font-mono text-rose-400/80">Monitor de Saúde: <span className="text-green-400 float-right">Aprovado (100% Instâncias Up)</span></p>
                 </div>
              </div>
            )}

            {/* TAB: ESTATÍSTICAS */}
            {activeTab === "estatisticas" && (
              <div className="relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                   <BarChart3 className="text-purple-400" /> Desempenho Global
                 </h2>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {[
                     { v: "14.2K", l: "Itens Lidos" },
                     { v: "99.8%", l: "Taxa de Sucesso" },
                     { v: "1.2s", l: "Latência Média" },
                     { v: "47 GB", l: "Dados Trafegados" },
                   ].map((st, i) => (
                     <div key={i} className="bg-[#1A1C25] border border-white/5 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                       <span className="text-3xl font-black text-white mb-1">{st.v}</span>
                       <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">{st.l}</span>
                     </div>
                   ))}
                 </div>
                 <div className="h-48 mt-8 border border-white/10 rounded-2xl bg-gradient-to-b from-white/5 to-transparent flex items-center justify-center text-slate-500 text-sm font-medium">
                   [ Gráfico de Linha de Requisições por Hora ]
                 </div>
              </div>
            )}

          </div>
        </section>

      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
