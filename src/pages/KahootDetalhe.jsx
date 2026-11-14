import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStudy, getTodayString } from '../context/StudyContext';
import {
  HelpCircle,
  ArrowLeft,
  ExternalLink,
  BookOpen,
  Layers,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  Save,
  MessageSquare,
  AlertCircle,
  Clock,
  History,
  TrendingUp,
  Award,
  Calendar,
  XCircle,
  Edit2,
  Check,
  Play,
  RotateCcw,
  Plus,
  Trash2,
  BrainCircuit,
  Sparkles
} from 'lucide-react';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';

export default function KahootDetalhe() {
  const { id } = useParams();
  const {
    kahoots,
    disciplinas,
    modulos,
    updateKahoot,
    saveKahootAttempt,
    getKahootAttempts,
    spacedReviews,
    importFromKahoot
  } = useStudy();

  const kahoot = kahoots.find(k => k.id === id);

  if (!kahoot) {
    return (
      <div className="py-12">
        <EmptyState
          title="Kahoot não encontrado"
          description="O quiz solicitado não existe ou foi removido."
          actionLabel="Voltar para a Central"
          onAction={() => window.history.back()}
        />
      </div>
    );
  }

  const disciplina = disciplinas.find(d => d.id === kahoot.disciplinaId);
  const modulo = modulos.find(m => m.id === kahoot.moduloId);
  const attemptsList = getKahootAttempts(kahoot.id);
  const reviewInfo = spacedReviews[kahoot.id] || null;

  // Abas de visualização da página: 'teoria' (estudo teórico/link) | 'simulado' (responder no portal)
  const [abaAtiva, setAbaAtiva] = useState('teoria');

  // Estado para editar link da URL do Kahoot
  const [editandoUrl, setEditandoUrl] = useState(false);
  const [urlInput, setUrlInput] = useState(kahoot.urlKahoot || '');

  // Controle de visibilidade das respostas na aba teoria
  const [respostasVisiveis, setRespostasVisiveis] = useState({});

  // Formulário manual de tentativa
  const [dataTentativa, setDataTentativa] = useState(getTodayString());
  const [totalQuestoes, setTotalQuestoes] = useState(kahoot.questoes?.length || 5);
  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState(0);
  const [dificuldades, setDificuldades] = useState('');
  const [observacoesTentativa, setObservacoesTentativa] = useState('');
  const [anteciparRevisao, setAnteciparRevisao] = useState(false);
  const [formErro, setFormErro] = useState('');
  const [tentativaSalvaFeedback, setTentativaSalvaFeedback] = useState(false);

  // Anotações pessoais
  const [anotacoesGerais, setAnotacoesGerais] = useState(kahoot.anotacoesPessoais || '');
  const [anotacaoSalvaFeedback, setAnotacaoSalvaFeedback] = useState(false);
  const [flashcardsGeradosFeedback, setFlashcardsGeradosFeedback] = useState(false);

  // Estados da Edição Individual de Questões
  const [modalEditarQuestao, setModalEditarQuestao] = useState(null); // { id, pergunta, respostaCorreta, explicacao }
  const [modalNovaQuestao, setModalNovaQuestao] = useState(false);
  const [novaPergunta, setNovaPergunta] = useState('');
  const [novaResposta, setNovaResposta] = useState('');
  const [novaExplicacao, setNovaExplicacao] = useState('');

  // --- ESTADOS DO MODO SIMULADO INTERNO ---
  const [simuladoIniciado, setSimuladoIniciado] = useState(false);
  const [indiceQuestaoSimulado, setIndiceQuestaoSimulado] = useState(0);
  const [respostaSelecionada, setRespostaSelecionada] = useState(null);
  const [mostrarResultadoQuestao, setMostrarResultadoQuestao] = useState(false);
  const [respostasSimulado, setRespostasSimulado] = useState({}); // { [qId]: { escolhida, correta, acertou } }
  const [simuladoFinalizado, setSimuladoFinalizado] = useState(false);

  const totalQuestoesKahoot = kahoot.questoes?.length || 0;
  const questaoSimuladoAtual = kahoot.questoes?.[indiceQuestaoSimulado] || null;

  // Gerador dinâmico de 4 alternativas plausíveis para o Simulado
  const gerarAlternativas = (q) => {
    if (!q) return [];
    if (q.opcoes && Array.isArray(q.opcoes) && q.opcoes.length >= 2) {
      return q.opcoes;
    }
    // Cria alternativas baseadas no gabarito e outras questões
    const outrasRespostas = (kahoot.questoes || [])
      .filter(item => item.id !== q.id)
      .map(item => item.respostaCorreta)
      .slice(0, 3);

    const poolDistratores = [
      'Nenhuma das alternativas anteriores está correta.',
      'Ocorre sobrecarga de pilha de execução (Stack Overflow).',
      'O valor é redefinido automaticamente para nulo em runtime.',
      'A instrução é ignorada pelo interpretador sem gerar aviso.'
    ];

    const distractors = [...outrasRespostas];
    let poolIndex = 0;
    while (distractors.length < 3) {
      const dist = poolDistratores[poolIndex++] || `Opção alternativa ${distractors.length + 1}`;
      if (!distractors.includes(dist) && dist !== q.respostaCorreta) {
        distractors.push(dist);
      }
    }

    const unicas = Array.from(new Set([q.respostaCorreta, ...distractors.slice(0, 3)]));
    // Embaralha de forma determinística
    return unicas.sort((a, b) => a.localeCompare(b));
  };

  const alternativasAtuais = questaoSimuladoAtual ? gerarAlternativas(questaoSimuladoAtual) : [];

  const handleIniciarSimulado = () => {
    setSimuladoIniciado(true);
    setIndiceQuestaoSimulado(0);
    setRespostaSelecionada(null);
    setMostrarResultadoQuestao(false);
    setRespostasSimulado({});
    setSimuladoFinalizado(false);
  };

  const handleConfirmarRespostaSimulado = () => {
    if (!respostaSelecionada || !questaoSimuladoAtual) return;

    const acertou = respostaSelecionada.trim() === questaoSimuladoAtual.respostaCorreta.trim();
    setRespostasSimulado(prev => ({
      ...prev,
      [questaoSimuladoAtual.id]: {
        escolhida: respostaSelecionada,
        correta: questaoSimuladoAtual.respostaCorreta,
        acertou
      }
    }));
    setMostrarResultadoQuestao(true);
  };

  const handleAvancarSimulado = () => {
    setMostrarResultadoQuestao(false);
    setRespostaSelecionada(null);

    if (indiceQuestaoSimulado < totalQuestoesKahoot - 1) {
      setIndiceQuestaoSimulado(prev => prev + 1);
    } else {
      // Fim do simulado
      setSimuladoFinalizado(true);
      const respostasArr = Object.values(respostasSimulado);
      // Inclui a última respondida
      const ultimosAcertos = respostasArr.filter(r => r.acertou).length;
      const total = totalQuestoesKahoot;
      const ultimosErros = total - ultimosAcertos;

      saveKahootAttempt(kahoot.id, {
        data: getTodayString(),
        totalQuestoes: total,
        acertos: ultimosAcertos,
        erros: ultimosErros,
        dificuldades: ultimosErros > 0 ? `Simulado interno: ${ultimosErros} erro(s)` : 'Nenhum erro no simulado!',
        observacoes: 'Tentativa realizada diretamente no Simulado Integrado do Portal ADS.'
      });
    }
  };

  // Gerar Flashcards a partir deste Quiz
  const handleGerarFlashcards = () => {
    const total = importFromKahoot(kahoot);
    setFlashcardsGeradosFeedback(true);
    setTimeout(() => setFlashcardsGeradosFeedback(false), 3000);
  };

  // CRUD Questão Individual
  const handleExcluirQuestao = (qId) => {
    if (!window.confirm('Deseja excluir esta questão do quiz?')) return;
    const atualizadas = (kahoot.questoes || []).filter(q => q.id !== qId);
    updateKahoot(kahoot.id, { questoes: atualizadas });
  };

  const handleSalvarEdicaoQuestao = (e) => {
    e.preventDefault();
    if (!modalEditarQuestao) return;
    const atualizadas = (kahoot.questoes || []).map(q => q.id === modalEditarQuestao.id ? modalEditarQuestao : q);
    updateKahoot(kahoot.id, { questoes: atualizadas });
    setModalEditarQuestao(null);
  };

  const handleAdicionarNovaQuestao = (e) => {
    e.preventDefault();
    if (!novaPergunta.trim() || !novaResposta.trim()) return;
    const nova = {
      id: `q_${Date.now()}`,
      pergunta: novaPergunta.trim(),
      respostaCorreta: novaResposta.trim(),
      explicacao: novaExplicacao.trim()
    };
    const atualizadas = [...(kahoot.questoes || []), nova];
    updateKahoot(kahoot.id, { questoes: atualizadas });
    setModalNovaQuestao(false);
    setNovaPergunta('');
    setNovaResposta('');
    setNovaExplicacao('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      {/* Botão Retorno */}
      <div className="flex items-center justify-between">
        <Link
          to="/kahoots"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para a Central de Kahoots
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGerarFlashcards}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-semibold hover:bg-purple-100 transition-colors cursor-pointer"
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Gerar Flashcards deste Quiz</span>
          </button>
        </div>
      </div>

      {flashcardsGeradosFeedback && (
        <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-xs text-purple-800 dark:text-purple-200 font-semibold flex items-center gap-2 animate-fade-in">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>Flashcards gerados e integrados à repetição espaçada SM-2!</span>
        </div>
      )}

      {/* HEADER DO KAHOOT */}
      <section className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="warning" size="sm">
              <HelpCircle className="w-3.5 h-3.5" />
              Quiz de Fixação
            </Badge>
            {disciplina && <Badge variant="primary" size="sm">{disciplina.nome}</Badge>}
            {modulo && <Badge variant="default" size="sm">{modulo.titulo}</Badge>}
          </div>

          {/* Alternador de Modo: Teoria vs Simulado */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => { setAbaAtiva('teoria'); setSimuladoIniciado(false); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                abaAtiva === 'teoria'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-300'
              }`}
            >
              Ficha Preparatória
            </button>
            <button
              onClick={() => { setAbaAtiva('simulado'); handleIniciarSimulado(); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                abaAtiva === 'simulado'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-300'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>Modo Simulado Interno</span>
            </button>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-50">
          {kahoot.titulo}
        </h1>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {kahoot.descricao}
        </p>

        {/* Link Oficial do Kahoot Externo */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          {kahoot.urlKahoot ? (
            <a
              href={kahoot.urlKahoot}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-colors shadow-xs"
            >
              <span>Abrir Quiz no Kahoot Oficial</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          ) : (
            <span className="text-xs text-slate-400">Link externo não cadastrado.</span>
          )}

          <button
            onClick={() => setEditandoUrl(!editandoUrl)}
            className="text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline"
          >
            {editandoUrl ? 'Cancelar edição' : 'Editar link externo'}
          </button>
        </div>

        {editandoUrl && (
          <form onSubmit={(e) => {
            e.preventDefault();
            updateKahoot(kahoot.id, { urlKahoot: urlInput.trim() });
            setEditandoUrl(false);
          }} className="flex items-center gap-2 pt-2 max-w-md">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://kahoot.it/challenge/..."
              className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
            />
            <button type="submit" className="px-3 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-semibold shrink-0">
              Salvar
            </button>
          </form>
        )}
      </section>

      {/* ======================================================== */}
      {/* ABA 1: MODO SIMULADO INTERNO (RESPONDER DENTRO DO PORTAL) */}
      {/* ======================================================== */}
      {abaAtiva === 'simulado' && (
        <section className="space-y-6 animate-fade-in">
          {totalQuestoesKahoot === 0 ? (
            <EmptyState
              title="Este Kahoot não possui questões cadastradas"
              description="Cadastre questões usando o botão abaixo para poder praticar no Modo Simulado."
              actionLabel="Adicionar Questão"
              onAction={() => setModalNovaQuestao(true)}
            />
          ) : simuladoFinalizado ? (
            /* Tela de Resultado do Simulado */
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mx-auto">
                <Award className="w-8 h-8" />
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">
                  Simulado Concluído!
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Seu resultado foi salvo no histórico e integrado com o algoritmo de repetição espaçada SM-2.
                </p>
              </div>

              <div className="flex items-center justify-center gap-6 py-4">
                <div className="text-center">
                  <span className="text-xs text-slate-400 block">Acertos</span>
                  <span className="text-3xl font-extrabold text-emerald-600">
                    {Object.values(respostasSimulado).filter(r => r.acertou).length}
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-xs text-slate-400 block">Total</span>
                  <span className="text-3xl font-extrabold text-slate-700 dark:text-slate-300">
                    {totalQuestoesKahoot}
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-xs text-slate-400 block">Percentual</span>
                  <span className="text-3xl font-extrabold text-amber-600">
                    {Math.round((Object.values(respostasSimulado).filter(r => r.acertou).length / totalQuestoesKahoot) * 100)}%
                  </span>
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={handleIniciarSimulado}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Refazer Simulado</span>
                </button>
                <button
                  onClick={() => setAbaAtiva('teoria')}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50"
                >
                  Ver Ficha Teórica
                </button>
              </div>
            </div>
          ) : (
            /* Questão Ativa do Simulado */
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-3">
                <span>Questão <strong>{indiceQuestaoSimulado + 1}</strong> de <strong>{totalQuestoesKahoot}</strong></span>
                <span className="text-amber-600 font-semibold">Simulado Ativo</span>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 leading-snug">
                  {questaoSimuladoAtual.pergunta}
                </h3>
              </div>

              {/* Alternativas */}
              <div className="space-y-2.5">
                {alternativasAtuais.map((opcao, idx) => {
                  const isSelecionada = respostaSelecionada === opcao;
                  const isCorreta = opcao.trim() === questaoSimuladoAtual.respostaCorreta.trim();

                  let styleClass = 'border-slate-200 dark:border-slate-700 hover:border-amber-400 bg-white dark:bg-slate-800';
                  if (mostrarResultadoQuestao) {
                    if (isCorreta) {
                      styleClass = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-100 font-bold';
                    } else if (isSelecionada && !isCorreta) {
                      styleClass = 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-100';
                    }
                  } else if (isSelecionada) {
                    styleClass = 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-semibold';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={mostrarResultadoQuestao}
                      onClick={() => setRespostaSelecionada(opcao)}
                      className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-start gap-3 cursor-pointer ${styleClass}`}
                    >
                      <span className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1">{opcao}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explicação da Resposta */}
              {mostrarResultadoQuestao && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 animate-fade-in text-xs">
                  <div className="flex items-center gap-2 font-bold">
                    {respostaSelecionada?.trim() === questaoSimuladoAtual.respostaCorreta?.trim() ? (
                      <span className="text-emerald-600 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        Resposta Correta!
                      </span>
                    ) : (
                      <span className="text-rose-600 flex items-center gap-1.5">
                        <XCircle className="w-4 h-4" />
                        Resposta Incorreta. A alternativa certa é: {questaoSimuladoAtual.respostaCorreta}
                      </span>
                    )}
                  </div>
                  {questaoSimuladoAtual.explicacao && (
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      💡 <strong>Justificativa:</strong> {questaoSimuladoAtual.explicacao}
                    </p>
                  )}
                </div>
              )}

              {/* Ações do Simulado */}
              <div className="pt-2 flex items-center justify-end gap-3">
                {!mostrarResultadoQuestao ? (
                  <button
                    disabled={!respostaSelecionada}
                    onClick={handleConfirmarRespostaSimulado}
                    className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white font-semibold text-xs cursor-pointer"
                  >
                    Confirmar Resposta
                  </button>
                ) : (
                  <button
                    onClick={handleAvancarSimulado}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{indiceQuestaoSimulado < totalQuestoesKahoot - 1 ? 'Próxima Questão' : 'Ver Resultado'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ======================================================== */}
      {/* ABA 2: FICHA PREPARATÓRIA / ESTUDO TEÓRICO COMPLETO     */}
      {/* ======================================================== */}
      {abaAtiva === 'teoria' && (
        <div className="space-y-8 animate-fade-in">
          {/* Resumo Teórico */}
          {kahoot.resumoTeorico && (
            <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <Lightbulb className="w-5 h-5" />
                <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  Resumo Preparatório Pré-Quiz
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {kahoot.resumoTeorico}
              </p>
            </section>
          )}

          {/* Conceitos Cobrados & Erros Comuns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400">
                <CheckCircle2 className="w-5 h-5" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Conceitos Mais Cobrados
                </h3>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 list-disc list-inside">
                {kahoot.conceitosCobrados?.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </section>

            <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Erros e Pegadinhas Comuns
                </h3>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 list-disc list-inside">
                {kahoot.errosComuns?.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </section>
          </div>

          {/* Banco de Questões do Quiz com Edição Individual */}
          <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Questões Cadastradas ({kahoot.questoes?.length || 0})
                </h3>
              </div>
              <button
                onClick={() => setModalNovaQuestao(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Questão</span>
              </button>
            </div>

            <div className="space-y-3">
              {kahoot.questoes?.map((q, idx) => {
                const visivel = respostasVisiveis[q.id];
                return (
                  <div
                    key={q.id || idx}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                        {idx + 1}. {q.pergunta}
                      </h4>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => setRespostasVisiveis(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                          className="p-1 text-slate-400 hover:text-slate-600"
                          title={visivel ? 'Ocultar resposta' : 'Mostrar resposta'}
                        >
                          {visivel ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => setModalEditarQuestao(q)}
                          className="p-1 text-slate-400 hover:text-amber-500"
                          title="Editar questão"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleExcluirQuestao(q.id)}
                          className="p-1 text-slate-400 hover:text-rose-500"
                          title="Excluir questão"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {visivel && (
                      <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800/40 text-xs space-y-1 animate-fade-in">
                        <p className="font-semibold text-emerald-700 dark:text-emerald-300">
                          Gabarito: {q.respostaCorreta}
                        </p>
                        {q.explicacao && (
                          <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                            {q.explicacao}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Histórico de Tentativas */}
          <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Histórico de Tentativas ({attemptsList.length})
                </h3>
              </div>
            </div>

            {attemptsList.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                Nenhuma tentativa registrada para este quiz. Pratique no Modo Simulado para gerar estatísticas!
              </p>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {attemptsList.map((att, i) => (
                  <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{att.data}</span>
                      <p className="text-[11px] text-slate-400">
                        {att.acertos}/{att.totalQuestoes} acertos {att.dificuldades && `• ${att.dificuldades}`}
                      </p>
                    </div>
                    <Badge variant={att.percentual >= 80 ? 'success' : att.percentual >= 60 ? 'warning' : 'default'} size="xs">
                      {att.percentual}%
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* MODAL ADICIONAR NOVA QUESTÃO */}
      {modalNovaQuestao && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
        >
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Adicionar Nova Questão ao Quiz
            </h3>

            <form onSubmit={handleAdicionarNovaQuestao} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Enunciado da pergunta:</label>
                <textarea
                  value={novaPergunta}
                  onChange={(e) => setNovaPergunta(e.target.value)}
                  required
                  rows={2}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Resposta correta (gabarito):</label>
                <input
                  type="text"
                  value={novaResposta}
                  onChange={(e) => setNovaResposta(e.target.value)}
                  required
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Justificativa / Explicação (opcional):</label>
                <textarea
                  value={novaExplicacao}
                  onChange={(e) => setNovaExplicacao(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalNovaQuestao(false)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold"
                >
                  Salvar Questão
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDITAR QUESTÃO */}
      {modalEditarQuestao && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
        >
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Editar Questão
            </h3>

            <form onSubmit={handleSalvarEdicaoQuestao} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Enunciado da pergunta:</label>
                <textarea
                  value={modalEditarQuestao.pergunta}
                  onChange={(e) => setModalEditarQuestao({ ...modalEditarQuestao, pergunta: e.target.value })}
                  required
                  rows={2}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Resposta correta:</label>
                <input
                  type="text"
                  value={modalEditarQuestao.respostaCorreta}
                  onChange={(e) => setModalEditarQuestao({ ...modalEditarQuestao, respostaCorreta: e.target.value })}
                  required
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Explicação / Justificativa:</label>
                <textarea
                  value={modalEditarQuestao.explicacao || ''}
                  onChange={(e) => setModalEditarQuestao({ ...modalEditarQuestao, explicacao: e.target.value })}
                  rows={2}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalEditarQuestao(null)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold"
                >
                  Atualizar Questão
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
