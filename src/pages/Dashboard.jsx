import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStudy, getTodayString } from '../context/StudyContext';
import {
  Calendar,
  Clock,
  BookOpen,
  HelpCircle,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  Sparkles,
  Flame,
  Check,
  BrainCircuit,
  GraduationCap,
  CalendarDays,
  Plus,
  Play,
  BarChart3,
  Target
} from 'lucide-react';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';

export default function Dashboard() {
  const {
    faculdade,
    disciplinas,
    modulos,
    resumos,
    kahoots,
    flashcards,
    eventosCalendario,
    estudosTempo,
    registrarSessao,
    getProdutividadeSemanal,
    getDueReviews,
    getOverdueReviews,
    getDueTodayReviews,
    getModulesInProgress,
    getKahootsPendingFirstAttempt,
    getItemsWithDifficulties,
    getStudyRecommendations,
    getUpcomingEvents,
    attempts,
    spacedReviews
  } = useStudy();

  const [modalTimer, setModalTimer] = useState(false);
  const [minutosInput, setMinutosInput] = useState(30);
  const [disciplinaSessao, setDisciplinaSessao] = useState(disciplinas[0]?.id || '');
  const [tipoSessao, setTipoSessao] = useState('modulo');
  const [notasSessao, setNotasSessao] = useState('');
  const [sessaoRegistradaFeedback, setSessaoRegistradaFeedback] = useState(false);

  const revisoesAtrasadas = getOverdueReviews();
  const revisoesHoje = getDueTodayReviews();
  const modulosEmAndamento = getModulesInProgress();
  const kahootsPendentes = getKahootsPendingFirstAttempt();
  const conteudosDificuldades = getItemsWithDifficulties();
  const recomendacoes = getStudyRecommendations ? getStudyRecommendations() : [];
  const proximasEntregas = getUpcomingEvents ? getUpcomingEvents(3) : [];
  const produtividadeSemanal = getProdutividadeSemanal ? getProdutividadeSemanal() : [];

  // Módulos concluídos e taxa global
  const modulosConcluidos = modulos.filter(m => m.status === 'estudado' || m.status === 'dominado').length;
  const modulosDominados = modulos.filter(m => m.status === 'dominado').length;
  const taxaGeral = modulos.length > 0 ? Math.round((modulosConcluidos / modulos.length) * 100) : 0;

  // Estatísticas de Kahoots
  let totalQuestoesRespondidas = 0;
  let totalAcertos = 0;
  const todasTentativas = [];
  Object.entries(attempts).forEach(([kahootId, lista]) => {
    const kahootObj = kahoots.find(k => k.id === kahootId);
    lista.forEach(att => {
      totalQuestoesRespondidas += (att.totalQuestoes || 0);
      totalAcertos += (att.acertos || 0);
      todasTentativas.push({
        ...att,
        kahootTitulo: kahootObj?.titulo || 'Quiz',
        kahootId
      });
    });
  });
  todasTentativas.sort((a, b) => b.data.localeCompare(a.data));
  const ultimasTentativas = todasTentativas.slice(0, 4);
  const taxaAcertoGlobal = totalQuestoesRespondidas > 0 ? Math.round((totalAcertos / totalQuestoesRespondidas) * 100) : null;

  // Flashcards dominados
  const flashcardsDominados = (flashcards || []).filter(f => {
    const rev = spacedReviews[f.id];
    return rev && rev.status === 'dominado';
  }).length;

  const handleSalvarSessao = (e) => {
    e.preventDefault();
    registrarSessao(minutosInput, {
      disciplinaId: disciplinaSessao,
      tipo: tipoSessao,
      notas: notasSessao.trim()
    });
    setSessaoRegistradaFeedback(true);
    setTimeout(() => {
      setSessaoRegistradaFeedback(false);
      setModalTimer(false);
      setNotasSessao('');
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl pb-16">
      {/* 1. HERO BANNER COM IDENTIFICAÇÃO E AÇÕES RÁPIDAS */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white border border-slate-800 shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-indigo-200">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>{faculdade.curso} • {faculdade.instituicao} ({faculdade.semestreAtual}º Sem. Noturno)</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Painel de Acompanhamento Acadêmico
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Ciclo de retenção ativa: <strong>Módulo Teórico → Resumo → Flashcards → Kahoot → SM-2 Repetição Espaçada</strong>.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to="/revisoes"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-sm"
              >
                <Calendar className="w-4 h-4" />
                <span>Revisões ({revisoesHoje.length + revisoesAtrasadas.length})</span>
              </Link>

              <Link
                to="/flashcards"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors shadow-sm"
              >
                <BrainCircuit className="w-4 h-4" />
                <span>Praticar Flashcards ({flashcards?.length || 0})</span>
              </Link>

              <button
                onClick={() => setModalTimer(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-colors cursor-pointer"
              >
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Registrar Tempo de Estudo</span>
              </button>
            </div>
          </div>

          {/* Card Rápido de Progresso Global no Banner */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md min-w-[220px] text-center space-y-2">
            <span className="text-xs text-indigo-200 font-medium">Progresso da Graduação</span>
            <div className="text-3xl font-black text-white">{taxaGeral}%</div>
            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-400 h-full rounded-full transition-all duration-500" style={{ width: `${taxaGeral}%` }} />
            </div>
            <span className="text-[11px] text-slate-300 block">{modulosConcluidos} de {modulos.length} módulos concluídos</span>
          </div>
        </div>
      </div>

      {/* 2. CARDS DE INDICADORES QUANTITATIVOS (MÉTRICAS CENTRAIS) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Horas Estudadas */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>Horas Estudadas</span>
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
            {estudosTempo?.horasTotais || 0}h
          </div>
          <span className="text-[11px] text-slate-400 mt-1">
            {(estudosTempo?.sessoes || []).length} sessões registradas
          </span>
        </div>

        {/* Taxa de Acertos nos Quizzes */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>Taxa nos Kahoots</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
            {taxaAcertoGlobal !== null ? `${taxaAcertoGlobal}%` : 'Sem dados'}
          </div>
          <span className="text-[11px] text-slate-400 mt-1">
            {totalQuestoesRespondidas > 0 ? `${totalAcertos}/${totalQuestoesRespondidas} questões` : 'Realize um quiz'}
          </span>
        </div>

        {/* Conteúdos Dominados */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>Conteúdos Dominados</span>
            <CheckCircle2 className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
            {modulosDominados}
          </div>
          <span className="text-[11px] text-slate-400 mt-1">
            {modulos.length - modulosConcluidos} módulos pendentes
          </span>
        </div>

        {/* Flashcards */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>Central Flashcards</span>
            <BrainCircuit className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
            {flashcards?.length || 0}
          </div>
          <span className="text-[11px] text-slate-400 mt-1">
            {flashcardsDominados} cartões dominados
          </span>
        </div>
      </div>

      {/* 3. RECOMENDAÇÕES INTELIGENTES BASEADAS NO HISTÓRICO REAL */}
      {recomendacoes.length > 0 && (
        <section className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50 to-sky-50 dark:from-indigo-950/40 dark:to-sky-950/40 border border-indigo-200/80 dark:border-indigo-900/60 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">
              Recomendações do Sistema para Você
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {recomendacoes.map(rec => (
              <div
                key={rec.id}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/40 flex flex-col justify-between"
              >
                <div>
                  <Badge
                    variant={rec.tipo === 'urgente' ? 'warning' : rec.tipo === 'reforco' ? 'default' : 'primary'}
                    size="xs"
                  >
                    {rec.tipo === 'urgente' ? 'Prioritário' : rec.tipo === 'reforco' ? 'Reforço' : rec.tipo === 'prazo' ? 'Prazo' : 'Sugerido'}
                  </Badge>
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-1.5 line-clamp-1">
                    {rec.titulo}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {rec.descricao}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <Link
                    to={rec.link}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                  >
                    <span>Acessar agora</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. GRÁFICO DE PRODUTIVIDADE SEMANAL & PRÓXIMAS AVALIAÇÕES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico Interativo de Produtividade */}
        <section className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Histórico de Produtividade Semanal
                </h3>
              </div>
              <span className="text-xs text-slate-400">Últimos 7 dias</span>
            </div>

            <div className="h-40 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-slate-100 dark:border-slate-800">
              {produtividadeSemanal.map((dia, idx) => {
                const maxMins = Math.max(60, ...produtividadeSemanal.map(d => d.minutos));
                const alturaPct = Math.max(8, Math.round((dia.minutos / maxMins) * 100));

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group relative">
                    {/* Tooltip */}
                    <div className="absolute -top-7 px-2 py-0.5 rounded bg-slate-900 text-white text-[10px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      {dia.minutos} min ({dia.horas}h)
                    </div>

                    <div
                      className={`w-full max-w-[28px] rounded-t-lg transition-all ${
                        dia.minutos > 0
                          ? 'bg-indigo-600 dark:bg-indigo-500 group-hover:bg-indigo-400'
                          : 'bg-slate-100 dark:bg-slate-800'
                      }`}
                      style={{ height: `${alturaPct}%` }}
                    />
                    <span className="text-[10px] text-slate-400 capitalize">
                      {dia.diaSemana}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>Total da semana: <strong>{produtividadeSemanal.reduce((a, b) => a + b.minutos, 0)} min</strong></span>
            <button
              onClick={() => setModalTimer(true)}
              className="text-indigo-600 hover:underline font-semibold cursor-pointer"
            >
              + Adicionar estudo
            </button>
          </div>
        </section>

        {/* Próximas Avaliações e Prazos do Calendário */}
        <section className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Próximas Avaliações e Prazos ({proximasEntregas.length})
                </h3>
              </div>
              <Link to="/calendario" className="text-xs text-sky-600 font-semibold hover:underline">
                Ver calendário →
              </Link>
            </div>

            {proximasEntregas.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center">
                Nenhuma avaliação ou trabalho pendente registrado para as próximas semanas.
              </p>
            ) : (
              <div className="space-y-2.5">
                {proximasEntregas.map(evt => {
                  const disc = disciplinas.find(d => d.id === evt.disciplinaId);
                  return (
                    <div
                      key={evt.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold text-sky-600 dark:text-sky-400">
                            {evt.tipo}
                          </span>
                          {disc && <span className="text-[10px] text-slate-400">• {disc.nome}</span>}
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate mt-0.5">
                          {evt.titulo}
                        </h4>
                      </div>
                      <Badge variant={evt.prioridade === 'alta' ? 'warning' : 'primary'} size="xs">
                        {evt.data}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-right">
            <Link to="/calendario" className="text-xs font-semibold text-sky-600 hover:underline">
              Adicionar nova prova / entrega →
            </Link>
          </div>
        </section>
      </div>

      {/* 5. REVISÕES DE HOJE & ATRASADAS (ALERTA DE RETENÇÃO SM-2) */}
      {(revisoesAtrasadas.length > 0 || revisoesHoje.length > 0) && (
        <section className="rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Atenção: Revisões Pendentes para Hoje ({revisoesAtrasadas.length + revisoesHoje.length})
              </h2>
            </div>
            <Link to="/revisoes" className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline">
              Gerenciar todas →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[...revisoesAtrasadas, ...revisoesHoje].slice(0, 6).map(item => {
              const kahootObj = kahoots.find(k => k.id === item.id);
              const moduloObj = modulos.find(m => m.id === item.id);
              const flashcardObj = (flashcards || []).find(f => f.id === item.id);
              const disc = disciplinas.find(d => d.id === (kahootObj?.disciplinaId || moduloObj?.disciplinaId || flashcardObj?.disciplinaId));

              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-amber-900/40 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                      {disc?.nome || item.tipo}
                    </span>
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-1 mt-0.5">
                      {kahootObj?.titulo || moduloObj?.titulo || flashcardObj?.frente || item.titulo}
                    </h3>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      Repetições: {item.repetitions || item.stage || 0}
                    </span>
                    <Link
                      to={item.tipo === 'kahoot' ? `/kahoots/${item.id}` : item.tipo === 'flashcard' ? `/flashcards` : `/modulos/${item.id}`}
                      className="px-2.5 py-1 rounded-lg bg-amber-600 text-white font-semibold text-[11px] hover:bg-amber-500 transition-colors"
                    >
                      Revisar
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 6. PROGRESSO DETALHADO POR DISCIPLINA */}
      <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-sky-600" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Progresso por Disciplina
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {taxaGeral}% dos módulos concluídos
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {disciplinas.map(d => {
            const modsDaDisc = modulos.filter(m => m.disciplinaId === d.id);
            const concluidos = modsDaDisc.filter(m => m.status === 'estudado' || m.status === 'dominado').length;
            const pct = modsDaDisc.length > 0 ? Math.round((concluidos / modsDaDisc.length) * 100) : 0;

            return (
              <div key={d.id} className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{d.nome}</span>
                  <span className="font-semibold text-sky-600">{pct}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-sky-500 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
                </div>
                <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>{concluidos}/{modsDaDisc.length} módulos</span>
                  <Link to={`/disciplinas/${d.id}`} className="text-sky-600 hover:underline">Ver aulas →</Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. MODAL PARA REGISTRAR TEMPO DE ESTUDO */}
      {modalTimer && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-timer-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
        >
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-4">
            <h3 id="modal-timer-title" className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-500" />
              <span>Registrar Sessão de Estudo</span>
            </h3>

            {sessaoRegistradaFeedback ? (
              <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold text-center">
                Sessão salva com sucesso! Seu histórico de horas foi atualizado.
              </div>
            ) : (
              <form onSubmit={handleSalvarSessao} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Tempo estudado (minutos):</label>
                  <input
                    type="number"
                    min="1"
                    max="600"
                    value={minutosInput}
                    onChange={(e) => setMinutosInput(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Disciplina:</label>
                  <select
                    value={disciplinaSessao}
                    onChange={(e) => setDisciplinaSessao(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500"
                  >
                    {disciplinas.map(d => (
                      <option key={d.id} value={d.id}>{d.nome}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Tipo de atividade:</label>
                  <select
                    value={tipoSessao}
                    onChange={(e) => setTipoSessao(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500"
                  >
                    <option value="modulo">Leitura Teórica de Módulo</option>
                    <option value="kahoot">Quiz / Kahoot</option>
                    <option value="flashcards">Prática com Flashcards</option>
                    <option value="projeto">Desenvolvimento de Projeto</option>
                    <option value="resumo">Elaboração de Resumo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Anotações rápidas (opcional):</label>
                  <input
                    type="text"
                    value={notasSessao}
                    onChange={(e) => setNotasSessao(e.target.value)}
                    placeholder="Ex: Pratiquei lógica condicional e operadores"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalTimer(false)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                  >
                    Salvar Sessão
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
