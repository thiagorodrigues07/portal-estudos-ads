import React from 'react';
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
  Check
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
    getDueReviews,
    getOverdueReviews,
    getDueTodayReviews,
    getModulesInProgress,
    getKahootsPendingFirstAttempt,
    getItemsWithDifficulties,
    attempts,
    recordSpacedReview
  } = useStudy();

  const revisoesAtrasadas = getOverdueReviews();
  const revisoesHoje = getDueTodayReviews();
  const modulosEmAndamento = getModulesInProgress();
  const kahootsPendentes = getKahootsPendingFirstAttempt();
  const conteudosDificuldades = getItemsWithDifficulties();

  // Histórico de tentativas recentes em todos os Kahoots
  const todasTentativas = [];
  Object.entries(attempts).forEach(([kahootId, lista]) => {
    const kahootObj = kahoots.find(k => k.id === kahootId);
    lista.forEach(att => {
      todasTentativas.push({
        ...att,
        kahootTitulo: kahootObj?.titulo || 'Quiz',
        kahootId
      });
    });
  });
  todasTentativas.sort((a, b) => b.data.localeCompare(a.data));
  const ultimasTentativas = todasTentativas.slice(0, 4);

  // Módulos concluídos e taxa global de progresso
  const modulosConcluidos = modulos.filter(m => m.status === 'estudado' || m.status === 'dominado').length;
  const taxaGeral = modulos.length > 0 ? Math.round((modulosConcluidos / modulos.length) * 100) : 0;

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl pb-16">
      {/* 1. TOPO: BANNER DA ROTINA DE ESTUDOS */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white border border-slate-800 shadow-md">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{faculdade.curso} • {faculdade.instituicao} ({faculdade.semestreAtual}º Sem. Noturno)</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Painel da Rotina de Estudos
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Sequência pedagógica ativa: <strong>Estudar Módulo → Revisar Conceitos → Fazer Kahoot → Registrar Resultado → Revisar no Intervalo</strong>.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to="/revisoes"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-sm"
            >
              <Calendar className="w-4 h-4" />
              <span>Ver Revisões de Hoje ({revisoesHoje.length + revisoesAtrasadas.length})</span>
            </Link>

            <Link
              to="/kahoots"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>Central de Kahoots</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. REVISÕES DE HOJE & ATRASADAS (PRIORIDADE MÁXIMA) */}
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
              const disc = disciplinas.find(d => d.id === (kahootObj?.disciplinaId || moduloObj?.disciplinaId));

              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-amber-900/40 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                      {disc?.nome}
                    </span>
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-1 mt-0.5">
                      {kahootObj?.titulo || moduloObj?.titulo}
                    </h3>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      Estágio {item.stage}
                    </span>
                    <Link
                      to={item.tipo === 'kahoot' ? `/kahoots/${item.id}` : `/modulos/${item.id}`}
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

      {/* 3. GRID PRINCIPAL: MÓDULOS EM ANDAMENTO & KAHOOTS PENDENTES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Módulos em Andamento */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Módulos em Andamento ({modulosEmAndamento.length})
                </h3>
              </div>
              <Link to="/disciplinas" className="text-xs text-sky-600 font-semibold hover:underline">
                Disciplinas
              </Link>
            </div>

            <div className="space-y-2.5">
              {modulosEmAndamento.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">
                  Nenhum módulo marcado como "Em Estudo" no momento.
                </p>
              ) : (
                modulosEmAndamento.map(m => {
                  const disc = disciplinas.find(d => d.id === m.disciplinaId);
                  return (
                    <div
                      key={m.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
                    >
                      <div className="min-w-0 pr-2">
                        <span className="text-[10px] text-sky-600 dark:text-sky-400 font-medium">{disc?.nome}</span>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{m.titulo}</h4>
                      </div>
                      <Link
                        to={`/modulos/${m.id}`}
                        className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shrink-0"
                      >
                        Estudar
                      </Link>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Kahoots Pendentes de Primeira Tentativa */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Kahoots Aguardando Tentativa ({kahootsPendentes.length})
                </h3>
              </div>
              <Link to="/kahoots" className="text-xs text-amber-600 font-semibold hover:underline">
                Ver todos
              </Link>
            </div>

            <div className="space-y-2.5">
              {kahootsPendentes.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">
                  Todos os Kahoots cadastrados já possuem ao menos uma tentativa registrada!
                </p>
              ) : (
                kahootsPendentes.slice(0, 4).map(k => {
                  const disc = disciplinas.find(d => d.id === k.disciplinaId);
                  return (
                    <div
                      key={k.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
                    >
                      <div className="min-w-0 pr-2">
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">{disc?.nome}</span>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{k.titulo}</h4>
                      </div>
                      <Link
                        to={`/kahoots/${k.id}`}
                        className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs shrink-0"
                      >
                        Preparar
                      </Link>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. ÚLTIMOS RESULTADOS REGISTRADOS & CONTEÚDOS COM DIFICULDADES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Últimos Resultados de Quizzes */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Últimos Resultados de Kahoots
              </h3>
            </div>
          </div>

          {ultimasTentativas.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              Nenhuma tentativa registrada ainda. Quando fizer um quiz, anote seus acertos para ver o histórico aqui.
            </p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {ultimasTentativas.map((att, i) => (
                <div key={i} className="py-2.5 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      {att.kahootTitulo}
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      {att.data} • {att.acertos}/{att.totalQuestoes} acertos
                    </span>
                  </div>
                  <Badge variant={att.percentual >= 80 ? 'success' : att.percentual >= 60 ? 'warning' : 'default'} size="xs">
                    {att.percentual}%
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Conteúdos com Mais Dificuldades (Reforço) */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-500" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Pontos de Atenção / Dificuldades ({conteudosDificuldades.length})
              </h3>
            </div>
            <Link to="/revisoes" className="text-xs text-rose-600 font-semibold hover:underline">
              Reforçar
            </Link>
          </div>

          {conteudosDificuldades.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              Nenhum ponto crítico relatado nas tentativas recentes. Ótimo desempenho!
            </p>
          ) : (
            <div className="space-y-2.5">
              {conteudosDificuldades.slice(0, 3).map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                      {item.kahoot.titulo}
                    </h4>
                    {item.lastAttempt.dificuldades && (
                      <p className="text-[11px] text-rose-700 dark:text-rose-300 line-clamp-1">
                        {item.lastAttempt.dificuldades}
                      </p>
                    )}
                  </div>
                  <Link
                    to={`/kahoots/${item.kahoot.id}`}
                    className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-semibold text-[11px] hover:bg-rose-500 shrink-0"
                  >
                    Praticar
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 5. PROGRESSO POR DISCIPLINA */}
      <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-sky-600" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Progresso nas Disciplinas do 1º Semestre
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
                  <div className="h-full bg-sky-500 rounded-full" style={{ width: `${pct}%` }} />
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

      {/* 6. ATALHOS RÁPIDOS SECUNDÁRIOS */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <Link to="/resumos" className="hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-sky-600" />
            <span>Biblioteca de Resumos</span>
          </Link>
          <Link to="/projetos" className="hover:text-slate-700 dark:hover:text-slate-200">
            Portfólio de Projetos
          </Link>
          <Link to="/notas" className="hover:text-slate-700 dark:hover:text-slate-200">
            Caderno de Notas
          </Link>
        </div>
        <Link to="/backup" className="text-indigo-600 hover:underline font-semibold">
          Fazer Backup dos Dados (JSON)
        </Link>
      </div>
    </div>
  );
}
