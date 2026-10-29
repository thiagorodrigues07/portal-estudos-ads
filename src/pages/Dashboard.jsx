import React from 'react';
import { Link } from 'react-router-dom';
import { useStudy } from '../context/StudyContext';
import {
  BookOpen,
  FileText,
  HelpCircle,
  FolderGit2,
  CheckCircle2,
  Clock,
  Star,
  ArrowRight,
  TrendingUp,
  BookmarkCheck,
  Sparkles,
  Layers
} from 'lucide-react';
import Badge from '../components/common/Badge';

export default function Dashboard() {
  const {
    faculdade,
    disciplinas,
    modulos,
    resumos,
    kahoots,
    projetos,
    moduleProgress,
    reviews,
    favorites,
    isFavorite,
    toggleFavorite
  } = useStudy();

  // Cálculos de progresso real baseados nos dados cadastrados
  const totalModulos = modulos.length;
  const modulosConcluidos = modulos.filter(m => (moduleProgress[m.id] || m.status) === 'concluido').length;
  const modulosEstudando = modulos.filter(m => (moduleProgress[m.id] || m.status) === 'estudando').length;
  const porcentagemGeral = totalModulos > 0 ? Math.round((modulosConcluidos / totalModulos) * 100) : 0;

  // Itens em andamento para a seção "Continuar Estudando"
  const itensEmAndamento = modulos.filter(m => (moduleProgress[m.id] || m.status) === 'estudando');

  // Revisões pendentes (resumos ainda não marcados como revisados no LocalStorage)
  const revisoesPendentes = resumos.filter(r => !reviews[r.id]?.revisado);

  // Favoritos
  const resumosFavoritos = resumos.filter(r => favorites.includes(r.id));
  const kahootsFavoritos = kahoots.filter(k => favorites.includes(k.id));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Banner de Boas-Vindas */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-600 via-sky-700 to-indigo-800 p-6 sm:p-8 text-white shadow-lg">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-sky-100 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Graduação em Análise e Desenvolvimento de Sistemas</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Ambiente Pessoal de Estudos — ADS
          </h2>
          <p className="mt-2 text-sm sm:text-base text-sky-100/90 leading-relaxed">
            {faculdade.instituicao} • {faculdade.semestreAtual}º Semestre ({faculdade.periodo}) • Previsão {faculdade.previsaoConclusao}.
            Organize suas disciplinas, revise os conceitos-chave antes de responder aos Kahoots e acompanhe sua evolução prática.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/disciplinas"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-sky-800 text-xs sm:text-sm font-semibold hover:bg-sky-50 transition-colors shadow-sm"
            >
              <BookOpen className="w-4 h-4" />
              Ver Disciplinas
            </Link>
            <Link
              to="/kahoots"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500/30 hover:bg-sky-500/40 border border-white/20 text-white text-xs sm:text-sm font-semibold transition-colors backdrop-blur-xs"
            >
              <HelpCircle className="w-4 h-4" />
              Central de Kahoots
            </Link>
          </div>
        </div>

        {/* Círculo decorativo de fundo */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Grid de Métricas Reais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Disciplinas */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Disciplinas</span>
            <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">{disciplinas.length}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">no 1º semestre</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Todas em andamento</p>
        </div>

        {/* Módulos e Progresso */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Progresso dos Módulos</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">{porcentagemGeral}%</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{modulosConcluidos}/{totalModulos} concluídos</span>
          </div>
          <div className="mt-2 w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${porcentagemGeral}%` }}
            />
          </div>
        </div>

        {/* Resumos Cadastrados */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Resumos Teóricos</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">{resumos.length}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">disponíveis</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Com opção para exportar em PDF</p>
        </div>

        {/* Kahoots / Quizzes */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Kahoots Cadastrados</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">{kahoots.length}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">quizzes</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Com gabarito e estudo pré-quiz</p>
        </div>
      </div>

      {/* Seção Dupla: Continuar Estudando & Revisões Pendentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Continuar Estudando */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Continuar Estudando
              </h3>
            </div>
            <Link to="/disciplinas" className="text-xs text-sky-600 hover:text-sky-700 dark:text-sky-400 font-medium inline-flex items-center gap-1">
              Ver todas <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex-1 space-y-3">
            {itensEmAndamento.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 py-6 text-center">
                Nenhum módulo marcado como "Estudando" no momento.
              </p>
            ) : (
              itensEmAndamento.map((modulo) => {
                const disc = disciplinas.find(d => d.id === modulo.disciplinaId);
                return (
                  <div
                    key={modulo.id}
                    className="p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/70 dark:hover:bg-slate-800/80 transition-colors flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-3">
                      <div className="text-[11px] font-medium text-sky-600 dark:text-sky-400 truncate">
                        {disc?.nome}
                      </div>
                      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate mt-0.5">
                        {modulo.titulo}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="warning" size="xs">Em andamento</Badge>
                        {modulo.dataUltimaRevisao && (
                          <span className="text-[10px] text-slate-400">
                            Revisto em {modulo.dataUltimaRevisao}
                          </span>
                        )}
                      </div>
                    </div>
                    <Link
                      to={`/disciplinas/${modulo.disciplinaId}`}
                      className="p-2 rounded-lg bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 shadow-2xs shrink-0"
                      title="Abrir módulo"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Revisões Pendentes */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookmarkCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Revisões Pendentes
              </h3>
            </div>
            <Link to="/resumos" className="text-xs text-sky-600 hover:text-sky-700 dark:text-sky-400 font-medium inline-flex items-center gap-1">
              Biblioteca <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex-1 space-y-3">
            {revisoesPendentes.length === 0 ? (
              <div className="py-8 text-center text-slate-500 dark:text-slate-400 text-xs flex flex-col items-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
                <span>Excelente! Todos os resumos cadastrados foram revisados recentemente.</span>
              </div>
            ) : (
              revisoesPendentes.slice(0, 3).map((resumo) => {
                const disc = disciplinas.find(d => d.id === resumo.disciplinaId);
                return (
                  <div
                    key={resumo.id}
                    className="p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/70 dark:hover:bg-slate-800/80 transition-colors flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-3">
                      <div className="text-[11px] font-medium text-purple-600 dark:text-purple-400 truncate">
                        {disc?.nome}
                      </div>
                      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate mt-0.5">
                        {resumo.titulo}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {resumo.tempoLeituraMin} min de leitura • {resumo.tags?.slice(0, 2).join(', ')}
                      </p>
                    </div>
                    <Link
                      to={`/resumos/${resumo.id}`}
                      className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium transition-colors shrink-0"
                    >
                      Revisar
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Conteúdos Favoritos */}
      {(resumosFavoritos.length > 0 || kahootsFavoritos.length > 0) && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Seus Favoritos
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {resumosFavoritos.map(r => (
              <Link
                key={r.id}
                to={`/resumos/${r.id}`}
                className="p-3 rounded-xl border border-slate-200/70 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700 bg-slate-50/50 dark:bg-slate-800/40 transition-colors block group"
              >
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-sky-600 dark:text-sky-400 mb-1">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Resumo</span>
                </div>
                <h4 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400 truncate">
                  {r.titulo}
                </h4>
              </Link>
            ))}
            {kahootsFavoritos.map(k => (
              <Link
                key={k.id}
                to={`/kahoots/${k.id}`}
                className="p-3 rounded-xl border border-slate-200/70 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700 bg-slate-50/50 dark:bg-slate-800/40 transition-colors block group"
              >
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-amber-600 dark:text-amber-400 mb-1">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Kahoot / Quiz</span>
                </div>
                <h4 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 truncate">
                  {k.titulo}
                </h4>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
