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
  Award,
  BrainCircuit,
  CalendarDays,
  Check
} from 'lucide-react';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import { SM2_GRADES } from '../services/sm2Service';

export default function RevisoesHoje() {
  const {
    disciplinas,
    modulos,
    resumos,
    kahoots,
    flashcards,
    spacedReviews,
    spacedIntervals,
    updateSpacedIntervals,
    recordSM2Review,
    getDueReviews,
    getOverdueReviews,
    getDueTodayReviews,
    getFutureReviews,
    getModulesInProgress,
    getKahootsPendingFirstAttempt,
    getItemsWithDifficulties
  } = useStudy();

  const [abaAtiva, setAbaAtiva] = useState('hoje'); // 'hoje' | 'futuras' | 'dominados' | 'dificuldades' | 'config'
  const [modalItemRevisar, setModalItemRevisar] = useState(null);
  const [anotacoesRevisao, setAnotacoesRevisao] = useState('');
  const [revisaoConcluidaFeedback, setRevisaoConcluidaFeedback] = useState(false);
  const [intervalosEditaveis, setIntervalosEditaveis] = useState(spacedIntervals.join(', '));
  const [salvoIntervalosFeedback, setSalvoIntervalosFeedback] = useState(false);

  const hojeStr = getTodayString();
  const revisoesHoje = getDueTodayReviews();
  const revisoesAtrasadas = getOverdueReviews();
  const revisoesFuturas = getFutureReviews();
  const modulosEmAndamento = getModulesInProgress();
  const itensComDificuldades = getItemsWithDifficulties();

  // Lista de itens dominados
  const itensDominados = Object.values(spacedReviews).filter(r => r.status === 'dominado');

  const handleClassificarSM2 = (grade) => {
    if (!modalItemRevisar) return;

    recordSM2Review(modalItemRevisar.id, modalItemRevisar.tipo, grade, {
      notes: anotacoesRevisao.trim(),
      titulo: modalItemRevisar.titulo,
      disciplinaId: modalItemRevisar.disciplinaId
    });

    setRevisaoConcluidaFeedback(true);
    setTimeout(() => {
      setRevisaoConcluidaFeedback(false);
      setModalItemRevisar(null);
      setAnotacoesRevisao('');
    }, 1500);
  };

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
            <span>Algoritmo SM-2 SuperMemo</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Revisões e Rotina Espaçada
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Intervalos calculados cientificamente pelo seu desempenho para máxima retenção de longo prazo.
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

      {/* Abas de Navegação */}
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
          onClick={() => setAbaAtiva('futuras')}
          className={`pb-3 px-1 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            abaAtiva === 'futuras'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          <span>Próximos Dias ({revisoesFuturas.length})</span>
        </button>

        <button
          onClick={() => setAbaAtiva('dominados')}
          className={`pb-3 px-1 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            abaAtiva === 'dominados'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Dominados ({itensDominados.length})</span>
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
          <span>Configuração SM-2</span>
        </button>
      </div>

      {/* ABA 1: HOJE & ATRASADAS */}
      {abaAtiva === 'hoje' && (
        <div className="space-y-6">
          {revisoesAtrasadas.length === 0 && revisoesHoje.length === 0 ? (
            <EmptyState
              title="Tudo em dia!"
              description="Você não possui nenhuma revisão pendente para hoje. Parabéns pelo ritmo acadêmico!"
              actionLabel="Ver revisões futuras"
              onAction={() => setAbaAtiva('futuras')}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...revisoesAtrasadas, ...revisoesHoje].map(item => {
                const kahootObj = kahoots.find(k => k.id === item.id);
                const moduloObj = modulos.find(m => m.id === item.id);
                const flashcardObj = (flashcards || []).find(f => f.id === item.id);
                const disc = disciplinas.find(d => d.id === (kahootObj?.disciplinaId || moduloObj?.disciplinaId || flashcardObj?.disciplinaId));
                const isAtrasado = item.nextReviewDate < hojeStr;

                return (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <Badge variant={isAtrasado ? 'warning' : 'primary'} size="xs">
                          {isAtrasado ? `Atrasado desde ${item.nextReviewDate}` : 'Para Hoje'}
                        </Badge>
                        <span className="text-[11px] text-slate-400 uppercase font-semibold">
                          {item.tipo}
                        </span>
                      </div>

                      <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 block mb-0.5">
                        {disc?.nome}
                      </span>
                      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                        {kahootObj?.titulo || moduloObj?.titulo || flashcardObj?.frente || item.titulo}
                      </h3>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div className="text-[11px] text-slate-400">
                        <span>Repetições: <strong>{item.repetitions || item.stage || 0}</strong></span>
                        {item.easeFactor && <span className="ml-2">EF: <strong>{item.easeFactor}</strong></span>}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setModalItemRevisar({
                            id: item.id,
                            tipo: item.tipo,
                            titulo: kahootObj?.titulo || moduloObj?.titulo || flashcardObj?.frente || item.titulo,
                            disciplinaId: disc?.id
                          })}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors cursor-pointer"
                        >
                          Avaliar Retenção
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ABA 2: REVISÕES FUTURAS */}
      {abaAtiva === 'futuras' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Próximas Revisões Programadas pelo SM-2 ({revisoesFuturas.length})
          </h3>

          {revisoesFuturas.length === 0 ? (
            <EmptyState
              title="Nenhuma revisão futura agendada"
              description="Conclua o estudo de módulos ou faça quizzes para alimentar a rotina espaçada."
            />
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
              {revisoesFuturas.map(item => {
                const kahootObj = kahoots.find(k => k.id === item.id);
                const moduloObj = modulos.find(m => m.id === item.id);
                const disc = disciplinas.find(d => d.id === (kahootObj?.disciplinaId || moduloObj?.disciplinaId));

                return (
                  <div key={item.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400">
                        {disc?.nome} • {item.tipo}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                        {kahootObj?.titulo || moduloObj?.titulo || item.titulo}
                      </h4>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400">
                        Repetições: <strong>{item.repetitions || item.stage || 0}</strong>
                      </span>
                      <Badge variant="primary" size="sm">
                        Agendado: {item.nextReviewDate}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ABA 3: CONTEÚDOS DOMINADOS */}
      {abaAtiva === 'dominados' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs text-emerald-800 dark:text-emerald-200">
            Conteúdos dominados atingiram intervalos longos (21+ dias) com alto índice de retenção. Eles continuam salvos e podem ser revisados a qualquer momento.
          </div>

          {itensDominados.length === 0 ? (
            <EmptyState
              title="Ainda não há conteúdos dominados"
              description="Continue revisando seus módulos e quizzes até atingir repetições consecutivas com sucesso."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {itensDominados.map(item => (
                <div key={item.id} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      {item.titulo || item.id}
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      Última revisão: {item.lastReviewDate} • EF: {item.easeFactor}
                    </span>
                  </div>
                  <Badge variant="success" size="xs">
                    Dominado
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ABA 4: DIFICULDADES */}
      {abaAtiva === 'dificuldades' && (
        <div className="space-y-4">
          {itensComDificuldades.length === 0 ? (
            <EmptyState
              title="Nenhuma dificuldade registrada"
              description="Quando você encontrar dificuldades em um quiz ou flashcard, o conteúdo aparecerá aqui para reforço direcionado."
            />
          ) : (
            <div className="space-y-3">
              {itensComDificuldades.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/40 shadow-xs flex items-center justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold text-rose-600 uppercase">
                      Desempenho: {item.lastAttempt.percentual}%
                    </span>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                      {item.kahoot.titulo}
                    </h4>
                    {item.lastAttempt.dificuldades && (
                      <p className="text-xs text-rose-700 dark:text-rose-300 mt-1">
                        Relato: {item.lastAttempt.dificuldades}
                      </p>
                    )}
                  </div>
                  <Link
                    to={`/kahoots/${item.kahoot.id}`}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs"
                  >
                    Praticar Reforço
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ABA 5: CONFIGURAÇÕES SM-2 */}
      {abaAtiva === 'config' && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Parâmetros do Algoritmo SM-2
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            O algoritmo SuperMemo-2 adapta a data de cada revisão conforme a dificuldade informada.
            Você classifica entre <strong>Novamente</strong> (recomeça), <strong>Difícil</strong> (intervalo curto), <strong>Bom</strong> (avanço normal) e <strong>Fácil</strong> (avanço ampliado).
          </p>

          <form onSubmit={handleSalvarIntervalos} className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Intervalos base padrão para estágio inicial (dias):
              </label>
              <input
                type="text"
                value={intervalosEditaveis}
                onChange={(e) => setIntervalosEditaveis(e.target.value)}
                className="w-full max-w-md px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer"
            >
              Salvar Intervalos Base
            </button>
            {salvoIntervalosFeedback && (
              <span className="text-xs text-emerald-600 font-semibold ml-3">
                Salvo com sucesso!
              </span>
            )}
          </form>
        </div>
      )}

      {/* MODAL DE CLASSIFICAÇÃO SM-2 */}
      {modalItemRevisar && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
        >
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-indigo-600">
                Avaliação de Retenção — SM-2
              </span>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mt-1">
                {modalItemRevisar.titulo}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Como foi lembrar este conteúdo? O sistema ajustará o próximo intervalo automaticamente.
              </p>
            </div>

            {revisaoConcluidaFeedback ? (
              <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold text-center flex items-center justify-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Revisão registrada! Próximo intervalo calculado pelo SM-2.</span>
              </div>
            ) : (
              <div className="space-y-3">
                <textarea
                  value={anotacoesRevisao}
                  onChange={(e) => setAnotacoesRevisao(e.target.value)}
                  placeholder="Anotações sobre a revisão (opcional)..."
                  rows={2}
                  className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500 resize-none"
                />

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <button
                    onClick={() => handleClassificarSM2(SM2_GRADES.AGAIN)}
                    className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 border border-rose-200 text-rose-700 dark:text-rose-300 font-semibold text-xs text-center flex flex-col items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4 text-rose-600" />
                    <span>Novamente</span>
                    <span className="text-[9px] text-slate-400">1 dia</span>
                  </button>

                  <button
                    onClick={() => handleClassificarSM2(SM2_GRADES.HARD)}
                    className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 border border-amber-200 text-amber-700 dark:text-amber-300 font-semibold text-xs text-center flex flex-col items-center gap-1 cursor-pointer"
                  >
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Difícil</span>
                    <span className="text-[9px] text-slate-400">+ moderado</span>
                  </button>

                  <button
                    onClick={() => handleClassificarSM2(SM2_GRADES.GOOD)}
                    className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 dark:text-indigo-300 font-semibold text-xs text-center flex flex-col items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                    <span>Bom</span>
                    <span className="text-[9px] text-slate-400">+ normal</span>
                  </button>

                  <button
                    onClick={() => handleClassificarSM2(SM2_GRADES.EASY)}
                    className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 dark:text-emerald-300 font-semibold text-xs text-center flex flex-col items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Fácil</span>
                    <span className="text-[9px] text-slate-400">+ longo</span>
                  </button>
                </div>

                <div className="pt-2 text-right">
                  <button
                    onClick={() => setModalItemRevisar(null)}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
