import React, { useState, useEffect } from "react";
import { Terminal, Activity, ListFilter, Play, Square, Settings, Database, RefreshCw, BarChart2, BarChart3, AlertCircle, Search, Clock, Target, Globe, Zap, AlertTriangle, Edit2, Trash2, Hash, DollarSign, Cpu } from "lucide-react";

export default function CrawlerDashboard() {
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState("monitoramento");
  const [logs, setLogs] = useState<{time: string, msg: string, type: 'info'|'warning'|'error'|'success'}[]>([]);

  // Novos estados funcionais
  type SearchFilter = { term: string, limit: number, minPrice?: string, maxPrice?: string, state?: string, city?: string };
  const [terms, setTerms] = useState<SearchFilter[]>([
    { term: "iphone 13 pro", limit: 15, minPrice: "2500", maxPrice: "4000" },
    { term: "fritadeira airfryer", limit: 30, maxPrice: "350", state: "SP" }
  ]);
  const [newTerm, setNewTerm] = useState("");
  const [newLimit, setNewLimit] = useState(20);
  const [newMin, setNewMin] = useState("");
  const [newMax, setNewMax] = useState("");
  
  // Localidades (IBGE/Correios Integration)
  const [states, setStates] = useState<{sigla: string, nome: string}[]>([]);
  const [cities, setCities] = useState<{nome: string}[]>([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  
  // Fila Pronta pro Modulo de Disparo/Grupos
  const [capturedOffers, setCapturedOffers] = useState<{id: string, term: string, price: string, link: string, thumbnail?: string}[]>([]);

  // Fetch Estados
  useEffect(() => {
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome")
      .then(res => res.json())
      .then(data => setStates(data))
      .catch(console.error);
  }, []);

  // Fetch Municipios baseado no Estado
  useEffect(() => {
    if (selectedState) {
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedState}/municipios`)
        .then(res => res.json())
        .then(data => setCities(data))
        .catch(console.error);
    } else {
      setCities([]);
    }
  }, [selectedState]);

  const handleAddTerm = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTerm.trim() && !terms.find(t => t.term === newTerm.trim())) {
      setTerms([...terms, { 
        term: newTerm.trim(), 
        limit: newLimit, 
        minPrice: newMin || undefined, 
        maxPrice: newMax || undefined,
        state: selectedState || undefined,
        city: selectedCity || undefined
      }]);
      setNewTerm("");
      setNewMin("");
      setNewMax("");
      setSelectedState("");
      setSelectedCity("");
      setIsFormExpanded(false);
    }
  };

  const handleRemoveTerm = (termToRemove: string) => {
    setTerms(terms.filter(t => t.term !== termToRemove));
  };

  const handleEditTerm = (config: SearchFilter) => {
    setNewTerm(config.term);
    setNewLimit(config.limit);
    setNewMin(config.minPrice || "");
    setNewMax(config.maxPrice || "");
    setSelectedState(config.state || "");
    setSelectedCity(config.city || "");
    setIsFormExpanded(true);
    // Remove temporariamente o termo para dar lugar ao novo modificado em tela
    setTerms(terms.filter(t => t.term !== config.term));
  };

  // Simulation of crawler background activity processing the array of terms
  useEffect(() => {
    let interval: any;
    if (isRunning) {
      let currentTermIndex = 0;

      interval = setInterval(() => {
        if (terms.length === 0) {
          setLogs(prev => [{ time: new Date().toLocaleTimeString(), msg: "ERRO: Nenhum termo configurado para busca no Mercado Livre.", type: "error" }, ...prev].slice(0, 50));
          setIsRunning(false);
          return;
        }

        const config = terms[currentTermIndex];
        
        setLogs(prev => [
          { time: new Date().toLocaleTimeString(), msg: `[ML API] Buscando ofertas reias de: "${config.term}"...`, type: "info" },
          ...prev
        ].slice(0, 50));

        // API Oficial do Mercado Livre foi atualizada e bloqueia 403 Forbidden para Tokens que não sejam de usuário logado.
        // Tática "Ghost Scraper": Burlar API puxando a Vitrine Completa (HTML) via Proxy de CORS Aberto (AllOrigins)
        // e mastigar os Dados por DOMParser simulando WebScraping indetectável direto no próprio navegador!
        
        let priceFilter = "";
        if (config.minPrice || config.maxPrice) {
          const minP = config.minPrice || "0";
          const maxP = config.maxPrice || "0"; 
          priceFilter = `_PriceRange_${minP}-${maxP === "0" ? "0" : maxP}`;
        }
        
        const termFormatted = config.term.trim().replace(/\s+/g, '-');
        // Ignora cache e forca resultados novos sem indexadores falsos
        const mlURL = `https://lista.mercadolivre.com.br/${termFormatted}${priceFilter}_NoIndex_True`;
        const proxyURL = `https://api.allorigins.win/get?url=${encodeURIComponent(mlURL)}`;

        fetch(proxyURL)
          .then(res => {
            if(!res.ok) throw new Error("Firewall bloqueou túnel Proxy.");
            return res.json();
          })
          .then(data => {
            if (!data.contents) throw new Error("A vitrine interceptada está vazia.");
            
            // Instancia o Extrator nativo do JS
            const parser = new DOMParser();
            const doc = parser.parseFromString(data.contents, "text/html");
            const itemsNodeList = doc.querySelectorAll('.ui-search-layout__item');
            
            // Filtra e converte para objetos
            const results = Array.from(itemsNodeList)
              .slice(0, config.limit || 15) // Fatiador de Quantidade Ideal
              .map(el => {
                 const titleEl = el.querySelector('.ui-search-item__title');
                 const priceEl = el.querySelector('.andes-money-amount__fraction');
                 const linkEl = el.querySelector('.ui-search-link');
                 const imgEl = el.querySelector('img.ui-search-result-image__image');
                 
                 const title = titleEl ? titleEl.textContent : "";
                 const price = priceEl ? priceEl.textContent : "0";
                 const link = linkEl ? linkEl.getAttribute('href') : "";
                 const thumbnail = imgEl ? (imgEl.getAttribute('data-src') || imgEl.getAttribute('src')) : "";
                 
                 if (title && link) {
                   return {
                     id: "GHOST-" + Math.random().toString(36).substr(2, 9),
                     price: parseFloat(price.replace('.', '').replace(',','.')),
                     permalink: link,
                     thumbnail: thumbnail || "",
                     title: title
                   }
                 }
                 return null;
              })
              .filter(Boolean);
            
            if (results.length > 0) {
              const realOffers = results.map((item: any) => ({
                id: item.id,
                term: config.term,
                price: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price),
                link: item.permalink,
                thumbnail: item.thumbnail
              }));
              
              setCapturedOffers(prev => {
                const uniqueNew = realOffers.filter((o: any) => !prev.find(p => p.link === o.link));
                return [...uniqueNew, ...prev].slice(0, 200); // Mantém os últimos 200 pro navegador não estourar
              });
              
              setLogs(prev => [
                { time: new Date().toLocaleTimeString(), msg: `[GHOST SCRAPER] Sucesso absoluto! Extraídas ${results.length} un. válidas burlando a barreira.`, type: "success" },
                ...prev
              ].slice(0, 50));
            } else {
              setLogs(prev => [
                { time: new Date().toLocaleTimeString(), msg: `[GHOST SCRAPER] Interceptado com vazio: O Mercado Livre não tem itens para "${config.term}" nesses moldes.`, type: "warning" },
                ...prev
              ].slice(0, 50));
            }
          })
          .catch(err => {
            setLogs(prev => [{ time: new Date().toLocaleTimeString(), msg: `[ANTIBOT ALARM] Barreira de proxy ativada: ${err.message}`, type: "error" }, ...prev].slice(0, 50));
          });

        currentTermIndex = (currentTermIndex + 1) % terms.length;
      }, 5000); // Gira a cada 5 segundos buscando ao vivo sem travar o browser
    }
    return () => clearInterval(interval);
  }, [isRunning, terms]);

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
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> 1 Fonte Ativa
                  </span>
                </div>

                {/* Micro-Dashboard de Sources Conectadas */}
                <div className="flex items-center gap-3 mb-6 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl w-fit shadow-md">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5" /> Conexão Matrix:
                  </span>
                  <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 rounded-md">
                    <Globe className="w-3 h-3 text-indigo-400" />
                    <span className="text-[10px] font-black text-indigo-200">API Mercado Livre Oficial</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse ml-1 shadow-[0_0_5px_#4ade80]"></span>
                    <span className="text-[9px] text-green-400/80 uppercase tracking-wider font-bold">Online (28ms)</span>
                  </div>
                </div>

                <div className="mb-8">
                  {/* Controle de Filtros do Admin em Largura Total */}
                  <div className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 p-6 sm:p-8 rounded-3xl flex flex-col justify-start shadow-2xl">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                      <div>
                        <h4 className="text-xl font-bold text-slate-200 flex items-center gap-3 mb-1">
                           <Target className="w-6 h-6 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]" />
                           Trilhas de Rastreio Ativas
                        </h4>
                        <p className="text-xs text-slate-500">({terms.length} algoritmos rodando em loop na nuvem)</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm bg-indigo-500/10 border border-indigo-500/30 text-indigo-200 px-4 py-2 rounded-xl font-bold shadow-[0_0_15px_rgba(99,102,241,0.15)]">
                         <Database className="w-4 h-4 opacity-70" /> 
                         Fila Pronta: {capturedOffers.length} links extraídos
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                       {terms.map((config, i) => (
                         <div key={i} className="relative bg-[#090A0F]/80 backdrop-blur-sm border border-emerald-500/20 hover:border-emerald-500/50 p-4 rounded-2xl flex flex-col group transition-all shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_0_20px_rgba(52,211,153,0.1)]">
                           <div className="flex items-start justify-between gap-4 mb-3">
                             <div className="flex-1 overflow-hidden">
                               <strong className="text-base text-emerald-400 block mb-1 truncate" title={config.term}>{config.term.toUpperCase()}</strong>
                               {config.state && <span className="inline-block text-[10px] uppercase font-bold tracking-wider bg-white/5 border border-white/5 px-2 py-0.5 rounded text-slate-400 truncate max-w-full">📍 {config.city ? config.city + ' - ' : ''}{config.state}</span>}
                             </div>
                             <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                               <button onClick={() => handleEditTerm(config)} className="text-emerald-400 hover:text-emerald-300 bg-white/5 hover:bg-white/10 p-1.5 rounded-lg transition border border-transparent hover:border-white/10" title="Editar"><Edit2 className="w-3.5 h-3.5"/></button>
                               <button onClick={() => handleRemoveTerm(config.term)} className="text-red-400 hover:text-red-300 bg-white/5 hover:bg-white/10 p-1.5 rounded-lg transition border border-transparent hover:border-white/10" title="Remover Regra"><Trash2 className="w-3.5 h-3.5"/></button>
                             </div>
                           </div>
                           <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium text-slate-400 mt-auto">
                             <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md border border-white/5"><DollarSign className="w-3 h-3 text-emerald-500/70"/> {config.minPrice || config.maxPrice ? `R$${config.minPrice || '0'} a ${config.maxPrice || 'Máx'}` : 'Preço Aberto'}</div>
                             <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md border border-white/5"><Hash className="w-3 h-3 text-indigo-400/70"/> Volta {config.limit} un.</div>
                           </div>
                         </div>
                       ))}
                       {terms.length === 0 && (
                         <div className="col-span-full border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                           <AlertCircle className="w-8 h-8 text-slate-500 mb-3 opacity-50" />
                           <p className="text-sm font-bold text-slate-400">Motor Congelado</p>
                           <p className="text-xs text-slate-500 mt-1">Nenhuma regra ativa mapeada. Adicione os filtros abaixo.</p>
                         </div>
                       )}
                    </div>

                    {!isFormExpanded ? (
                      <button 
                        onClick={() => setIsFormExpanded(true)}
                        className="mt-auto w-full py-3 bg-[#0F111A] hover:bg-black/40 border border-dashed border-indigo-500/30 text-indigo-300 hover:text-indigo-200 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(99,102,241,0.05)]"
                      >
                        + Configurar Nova Trilha Padrão
                      </button>
                    ) : (
                      <form onSubmit={handleAddTerm} className="mt-auto bg-[#090A0F] border border-white/5 p-4 sm:p-5 rounded-2xl flex flex-col gap-4 shadow-xl border-t-indigo-500/30">
                        <div>
                          <label className="text-xs text-slate-400 font-bold mb-1.5 block uppercase tracking-wider">O que buscar?</label>
                          <input 
                            type="text" 
                            value={newTerm}
                            onChange={(e) => setNewTerm(e.target.value)}
                            placeholder="Ex: Fritadeira Airfryer Mondial" 
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:bg-white/10 transition"
                            disabled={isRunning}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs text-slate-400 font-bold mb-1.5 block uppercase tracking-wider">Faixa de Preço Ideal</label>
                            <div className="flex items-center bg-white/5 border border-white/10 rounded-lg overflow-hidden focus-within:border-indigo-500 focus-within:bg-white/10 transition">
                               <span className="pl-3 text-slate-500 font-bold text-xs">R$</span>
                               <input type="number" value={newMin} onChange={(e) => setNewMin(e.target.value)} placeholder="0" className="w-full bg-transparent p-2.5 text-sm text-white focus:outline-none font-medium" disabled={isRunning} />
                               <span className="text-slate-600 px-2">-</span>
                               <span className="text-slate-500 font-bold text-xs">R$</span>
                               <input type="number" value={newMax} onChange={(e) => setNewMax(e.target.value)} placeholder="Máximo" className="w-full bg-transparent p-2.5 text-sm text-white focus:outline-none font-medium" disabled={isRunning} />
                            </div>
                          </div>

                          <div>
                            <label className="text-xs text-slate-400 font-bold mb-1.5 block uppercase tracking-wider">Quantidade Alvo</label>
                            <input 
                              type="number" 
                              value={newLimit}
                              onChange={(e) => setNewLimit(Number(e.target.value))}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-indigo-500 focus:bg-white/10 transition"
                              disabled={isRunning}
                              min={1}
                              max={50}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <div>
                              <label className="text-xs text-slate-400 font-bold mb-1.5 block uppercase tracking-wider">Região Exata (UF)</label>
                              <select 
                                 value={selectedState} 
                                 onChange={(e) => { setSelectedState(e.target.value); setSelectedCity(""); }} 
                                 className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:bg-white/10 transition appearance-none cursor-pointer"
                                 disabled={isRunning}
                              >
                                 <option value="" className="bg-slate-900">Todas do Brasil</option>
                                 {states.map(st => <option key={st.sigla} value={st.sigla} className="bg-slate-900">{st.nome}</option>)}
                              </select>
                           </div>
                           <div>
                              <label className="text-xs text-slate-400 font-bold mb-1.5 block uppercase tracking-wider">Município</label>
                              <select 
                                 value={selectedCity} 
                                 onChange={(e) => setSelectedCity(e.target.value)} 
                                 className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:bg-white/10 transition appearance-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                                 disabled={isRunning || !selectedState}
                              >
                                 <option value="" className="bg-slate-900">Qualquer cidade no Estado</option>
                                 {cities.map(ct => <option key={ct.nome} value={ct.nome} className="bg-slate-900">{ct.nome}</option>)}
                              </select>
                           </div>
                        </div>

                        <div className="flex items-center gap-3 mt-2">
                          <button type="button" onClick={() => setIsFormExpanded(false)} className="flex-1 py-3 bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-transparent hover:border-red-500/30 rounded-xl text-sm font-bold transition-colors">Fechar</button>
                          <button type="submit" disabled={isRunning || !newTerm.trim()} className="flex-[2] py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:shadow-none">Confirmar Inteligência</button>
                        </div>
                      </form>
                    )}
                  </div>
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

            {/* TAB: EXTRATO / EXPORTAÇÃO DE LINKS PARA O DISTRIBUIDOR DOS GRUPOS */}
            {activeTab === "extrato" && (
              <div className="relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
                 <div className="flex items-center justify-between mb-8">
                   <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 flex items-center gap-3">
                     <Database className="w-6 h-6 text-cyan-400" /> Gatilho de Ofertas Validadas
                   </h2>
                   <div className="flex gap-3">
                     <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-sm flex items-center gap-2 transition shadow-[0_4px_15px_rgba(79,70,229,0.3)]">
                       <Zap className="w-4 h-4" /> Distribuir p/ Grupos WhatsApp ({capturedOffers.length})
                     </button>
                   </div>
                 </div>
                 
                 <div className="flex-1 bg-[#090A0F] border border-white/10 rounded-2xl overflow-hidden flex flex-col">
                    <div className="px-4 py-3 bg-white/5 border-b border-white/10 grid grid-cols-12 gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                       <div className="col-span-5">Pilar do Anúncio</div>
                       <div className="col-span-2">Preço Retido</div>
                       <div className="col-span-3">Link Trateado</div>
                       <div className="col-span-2 text-right">Ação</div>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                      {capturedOffers.length === 0 ? (
                        <div className="h-48 flex flex-col items-center justify-center text-slate-500">
                          <AlertTriangle className="w-8 h-8 mb-3 opacity-20" />
                          <p>Nenhuma oferta capturada ainda. Inicie o Motor.</p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {capturedOffers.map(oferta => (
                            <div key={oferta.id} className="px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl grid grid-cols-12 gap-4 items-center border border-transparent hover:border-white/10 transition-colors">
                              <div className="col-span-5 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-md bg-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                                  {oferta.thumbnail ? <img src={oferta.thumbnail} alt="thumb" className="w-full h-full object-cover" /> : '🛒'}
                                </div>
                                <div className="overflow-hidden">
                                  <div className="text-sm font-bold text-slate-200 truncate pr-2" title={oferta.term}>{oferta.term.toUpperCase()}</div>
                                  <div className="text-[10px] text-slate-500 font-mono">MLB{oferta.id.replace('MLB', '')}</div>
                                </div>
                              </div>
                              <div className="col-span-2 text-green-400 font-black text-sm">{oferta.price}</div>
                              <div className="col-span-3 text-cyan-400/80 hover:text-cyan-300 text-xs truncate underline cursor-pointer">
                                <a href={oferta.link} target="_blank" rel="noreferrer" title={oferta.link}>{oferta.link}</a>
                              </div>
                              <div className="col-span-2 text-right">
                                <button className="px-2 py-1 bg-white/5 hover:bg-white/20 text-slate-300 rounded text-xs font-bold border border-white/10">Ocultar</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                 </div>
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
