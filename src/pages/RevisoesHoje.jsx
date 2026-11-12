import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStudy, getTodayString } from '../context/StudyContext';
import {
  Calendar,
  AlertCircle,
  Clock,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  ArrowRight,
  Settings,
  Layers,
  Sparkles,
  RotateCcw,
  Sliders,
  Award
} from 'lucide-react';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';

export default function RevisoesHoje() {
  const {
    disciplinas,
    modulos,
    resumos,
    kahoots,
    spacedReviews,
    spacedIntervals,
    updateSpacedIntervals,
    recordSpacedReview,
    getDueReviews,
    getOverdueReviews,
    getDueTodayReviews,
    getModulesInProgress,
    getKahootsPendingFirstAttempt,
    getItemsWithDifficulties
  } = useStudy();

  const [abaAtiva, setAbaAtiva] = useState('hoje'); // 'hoje' | 'pendentes' | 'dificuldades' | 'config'
  const [intervalosEditaveis, setIntervalosEditaveis] = useState(spacedIntervals.join(', '));
  const [salvoIntervalosFeedback, setSalvoIntervalosFeedback] = useState(false);

  const hojeStr = getTodayString();
  const revisoesHoje = getDueTodayReviews();
  const revisoesAtrasadas = getOverdueReviews();
  const modulosEmAndamento = getModulesInProgress();
  const kahootsSemTentativa = getKahootsPendingFirstAttempt();
  const itensComDificuldades = getItemsWithDifficulties();

  const handleSalvarIntervalos = (e) => {
    e.preventDefault();
    const partes = intervalosEditaveis
      .split(',')
      .map(p => Number(p.trim()))
      .filter(n => !isNaN(n));

    if (partes.length < 2) {
      alert('Informe ao menos 2 intervalos em dias separados por vírgula (ex: 1, 3, 7, 14).');
      return;
    }

    updateSpacedIntervals(partes);
    setSalvoIntervalosFeedback(true);
    setTimeout(() => setSalvoIntervalosFeedback(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl pb-16">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4" />
            <span>Sistema de Repetição Espaçada</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Revisões e Rotina de Estudos
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Controle transparente de revisões para fixar os conteúdos na memória de longo prazo e superar dificuldades.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={revisoesAtrasadas.length > 0 ? 'warning' : 'success'} size="sm">
            {revisoesAtrasadas.length > 0 ? `${revisoesAtrasadas.length} Atrasada(s)` : 'Sem atrasos'}
          </Badge>
          <Badge variant="primary" size="sm">
            {revisoesHoje.length} para Hoje
          </Badge>
        </div>
      </div>

      {/* Abas Superiores de Filtro */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 overflow-x-auto text-xs sm:text-sm font-semibold">
        <button
          onClick={() => setAbaAtiva('hoje')}
          className={`pb-3 px-1 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            abaAtiva === 'hoje'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Para Hoje & Atrasadas ({revisoesHoje.length + revisoesAtrasadas.length})</span>
        </button>

        <button
          onClick={() => setAbaAtiva('pendentes')}
          className={`pb-3 px-1 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            abaAtiva === 'pendentes'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Em Andamento & Novos ({modulosEmAndamento.length + kahootsSemTentativa.length})</span>
        </button>

        <button
          onClick={() => setAbaAtiva('dificuldades')}
          className={`pb-3 px-1 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            abaAtiva === 'dificuldades'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          <span>Reforço / Dificuldades ({itensComDificuldades.length})</span>
        </button>

        <button
          onClick={() => setAbaAtiva('config')}
          className={`pb-3 px-1 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            abaAtiva === 'config'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Configurar Intervalos</span>
        </button>
      </div>

      {/* ABA 1: REVISÕES DE HOJE E ATRASADAS */}
      {abaAtiva === 'hoje' && (
        <div className="space-y-6">
          {/* Seção de Atrasadas */}
          {revisoesAtrasadas.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>Revisões Atrasadas ({revisoesAtrasadas.length})</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {revisoesAtrasadas.map(item => {
                  const kahootObj = kahoots.find(k => k.id === item.id);
                  const moduloObj = modulos.find(m => m.id === item.id);
                  const disc = disciplinas.find(d => d.id === (kahootObj?.disciplinaId || moduloObj?.disciplinaId));

                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-semibold text-rose-700 dark:text-rose-400">
                            {disc?.nome}
                          </span>
                          <span className="text-rose-600 font-bold">
                            Venceu em: {item.nextReviewDate}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                          {kahootObj?.titulo || moduloObj?.titulo || 'Item de estudo'}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Estágio de revisão: {item.stage} • Status: {item.status}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-rose-200/50 dark:border-rose-900/40 flex items-center justify-between">
                        <button
                          onClick={() => recordSpacedReview(item.id, item.tipo, { notes: 'Revisão concluída com sucesso' })}
                          className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
                        >
                          ✓ Marcar Revisado
                        </button>

                        <Link
                          to={item.tipo === 'kahoot' ? `/kahoots/${item.id}` : `/modulos/${item.id}`}
                          className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors flex items-center gap-1"
                        >
                          <span>Revisar Agora</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Seção de Hoje */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Programadas para Hoje ({revisoesHoje.length})</span>
            </h3>

            {revisoesHoje.length === 0 ? (
              <EmptyState
                title="Tudo em dia para hoje!"
                description="Você não tem nenhuma revisão programada pendente para o dia de hoje. Bom trabalho!"
                icon={CheckCircle2}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {revisoesHoje.map(item => {
                  const kahootObj = kahoots.find(k => k.id === item.id);
                  const moduloObj = modulos.find(m => m.id === item.id);
                  const disc = disciplinas.find(d => d.id === (kahootObj?.disciplinaId || moduloObj?.disciplinaId));

                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-semibold text-indigo-700 dark:text-indigo-400">
                            {disc?.nome}
                          </span>
                          <Badge variant="primary" size="xs">Hoje</Badge>
                        </div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                          {kahootObj?.titulo || moduloObj?.titulo || 'Item de estudo'}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Estágio: {item.stage} • {item.tipo === 'kahoot' ? 'Quiz / Kahoot' : 'Módulo Teórico'}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-indigo-200/50 dark:border-indigo-900/40 flex items-center justify-between">
                        <button
                          onClick={() => recordSpacedReview(item.id, item.tipo, { notes: 'Revisão concluída com sucesso' })}
                          className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer"
                        >
                          ✓ Marcar Revisado
                        </button>

                        <Link
                          to={item.tipo === 'kahoot' ? `/kahoots/${item.id}` : `/modulos/${item.id}`}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center gap-1"
                        >
                          <span>Revisar Agora</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ABA 2: EM ANDAMENTO E NOVOS */}
      {abaAtiva === 'pendentes' && (
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-600" />
              <span>Módulos Atualmente em Estudo ({modulosEmAndamento.length})</span>
            </h3>

            {modulosEmAndamento.length === 0 ? (
              <p className="text-xs text-slate-400 p-4 border border-dashed rounded-xl text-center">
                Nenhum módulo marcado como "Em Estudo" no momento.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {modulosEmAndamento.map(m => {
                  const disc = disciplinas.find(d => d.id === m.disciplinaId);
                  return (
                    <div key={m.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-sky-600 dark:text-sky-400 font-semibold">{disc?.nome}</span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">{m.titulo}</h4>
                      </div>
                      <Link
                        to={`/modulos/${m.id}`}
                        className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold"
                      >
                        Continuar
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>Kahoots Aguardando Primeira Tentativa ({kahootsSemTentativa.length})</span>
            </h3>

            {kahootsSemTentativa.length === 0 ? (
              <p className="text-xs text-slate-400 p-4 border border-dashed rounded-xl text-center">
                Excelente! Você já realizou ao menos uma tentativa em todos os Kahoots cadastrados.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {kahootsSemTentativa.map(k => {
                  const disc = disciplinas.find(d => d.id === k.disciplinaId);
                  return (
                    <div key={k.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">{disc?.nome}</span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">{k.titulo}</h4>
                        <span className="text-[11px] text-slate-400">{k.questoes?.length || 0} questões</span>
                      </div>
                      <Link
                        to={`/kahoots/${k.id}`}
                        className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold"
                      >
                        Estudar & Fazer
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ABA 3: CONTEÚDOS COM MAIS DIFICULDADES */}
      {abaAtiva === 'dificuldades' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
            Esta seção reúne os quizzes em que você registrou dificuldades específicas ou obteve pontuação inferior a 70%. O sistema programa revisões mais frequentes para estes tópicos.
          </div>

          {itensComDificuldades.length === 0 ? (
            <EmptyState
              title="Nenhuma dificuldade registrada"
              description="Quando você registrar uma tentativa com nota abaixo de 70% ou relatar pontos fracos, eles aparecerão aqui para reforço."
              icon={Award}
            />
          ) : (
            <div className="space-y-3">
              {itensComDificuldades.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-white dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                        {item.kahoot.titulo}
                      </h4>
                      <Badge variant={item.lastAttempt.percentual < 60 ? 'warning' : 'default'} size="xs">
                        Última nota: {item.lastAttempt.percentual}%
                      </Badge>
                    </div>
                    {item.lastAttempt.dificuldades && (
                      <p className="text-xs text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 p-2 rounded-lg">
                        <strong>Dificuldade relatada:</strong> {item.lastAttempt.dificuldades}
                      </p>
                    )}
                  </div>

                  <Link
                    to={`/kahoots/${item.kahoot.id}`}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shrink-0"
                  >
                    Praticar Reforço
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ABA 4: CONFIGURAÇÃO DE INTERVALOS ESPAÇADOS */}
      {abaAtiva === 'config' && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Ajustar Intervalos da Revisão Espaçada
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            O algoritmo utiliza intervalos em dias após cada revisão bem-sucedida. O padrão recomendado para a faculdade é:
            <strong> Dia 0 (estudo inicial), Dia 1 (1ª revisão), Dia 3 (2ª revisão), Dia 7 (3ª revisão) e Dia 14 (4ª revisão).</strong>
          </p>

          <form onSubmit={handleSalvarIntervalos} className="space-y-3 max-w-md">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Intervalos em dias (separados por vírgula)
              </label>
              <input
                type="text"
                value={intervalosEditaveis}
                onChange={(e) => setIntervalosEditaveis(e.target.value)}
                placeholder="0, 1, 3, 7, 14"
                className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500"
                required
              />
            </div>

            {salvoIntervalosFeedback && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                ✓ Intervalos atualizados e salvos no navegador!
              </p>
            )}

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
            >
              Salvar Novos Intervalos
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
