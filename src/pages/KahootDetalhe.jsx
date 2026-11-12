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
  Check
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
    spacedReviews
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

  // Tentativas e revisão espaçada
  const attemptsList = getKahootAttempts(kahoot.id);
  const reviewInfo = spacedReviews[kahoot.id] || null;

  // Estado para editar link da URL do Kahoot
  const [editandoUrl, setEditandoUrl] = useState(false);
  const [urlInput, setUrlInput] = useState(kahoot.urlKahoot || '');

  // Controle de visibilidade das respostas (auto-teste de memória)
  const [respostasVisiveis, setRespostasVisiveis] = useState({});
  const [mostrarTodasRespostas, setMostrarTodasRespostas] = useState(false);

  // Formulário de Registro de Tentativa
  const [dataTentativa, setDataTentativa] = useState(getTodayString());
  const [totalQuestoes, setTotalQuestoes] = useState(kahoot.questoes?.length || 5);
  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState(0);
  const [dificuldades, setDificuldades] = useState('');
  const [observacoesTentativa, setObservacoesTentativa] = useState('');
  const [anteciparRevisao, setAnteciparRevisao] = useState(false);
  const [formErro, setFormErro] = useState('');
  const [tentativaSalvaFeedback, setTentativaSalvaFeedback] = useState(false);

  // Anotações pessoais gerais do Kahoot
  const [anotacoesGerais, setAnotacoesGerais] = useState(kahoot.anotacoesPessoais || '');
  const [anotacaoSalvaFeedback, setAnotacaoSalvaFeedback] = useState(false);

  // Cálculo em tempo real de erros e percentual
  const handleAcertosChange = (val) => {
    const numAcertos = Math.max(0, Number(val));
    setAcertos(numAcertos);
    const total = Number(totalQuestoes) || 1;
    if (numAcertos <= total) {
      setErros(total - numAcertos);
      setFormErro('');
    } else {
      setFormErro('Quantidade de acertos não pode ultrapassar o total de questões.');
    }
  };

  const handleTotalChange = (val) => {
    const numTotal = Math.max(1, Number(val));
    setTotalQuestoes(numTotal);
    if (acertos <= numTotal) {
      setErros(numTotal - acertos);
      setFormErro('');
    } else {
      setFormErro('Total de questões deve ser maior ou igual aos acertos.');
    }
  };

  const percentualAtual = totalQuestoes > 0 ? Math.round((acertos / totalQuestoes) * 100) : 0;

  const toggleResposta = (qId) => {
    setRespostasVisiveis(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  const handleSalvarUrl = (e) => {
    e.preventDefault();
    updateKahoot(kahoot.id, { urlKahoot: urlInput.trim() });
    setEditandoUrl(false);
  };

  const handleSalvarTentativa = (e) => {
    e.preventDefault();
    setFormErro('');

    const totalNum = Number(totalQuestoes);
    const acertosNum = Number(acertos);
    const errosNum = Number(erros);

    if (acertosNum + errosNum !== totalNum) {
      setFormErro(`A soma de acertos (${acertosNum}) e erros (${errosNum}) deve ser igual ao total (${totalNum}).`);
      return;
    }

    saveKahootAttempt(kahoot.id, {
      data: dataTentativa,
      totalQuestoes: totalNum,
      acertos: acertosNum,
      erros: errosNum,
      dificuldades: dificuldades.trim(),
      observacoes: observacoesTentativa.trim(),
      anteciparRevisao: anteciparRevisao || percentualAtual < 70
    });

    setTentativaSalvaFeedback(true);
    setTimeout(() => setTentativaSalvaFeedback(false), 3000);
    setDificuldades('');
    setObservacoesTentativa('');
  };

  const handleSalvarAnotacoesGerais = (e) => {
    e.preventDefault();
    updateKahoot(kahoot.id, { anotacoesPessoais: anotacoesGerais });
    setAnotacaoSalvaFeedback(true);
    setTimeout(() => setAnotacaoSalvaFeedback(false), 2500);
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

        {modulo && (
          <Link
            to={`/modulos/${modulo.id}`}
            className="inline-flex items-center gap-1.5 text-xs text-sky-600 dark:text-sky-400 hover:underline font-medium"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Ver Módulo Completo</span>
          </Link>
        )}
      </div>

      {/* 1. IDENTIFICAÇÃO DA MATÉRIA E DO MÓDULO */}
      <section className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="warning" size="sm">
            <HelpCircle className="w-3.5 h-3.5" />
            Estudo Pré-Quiz
          </Badge>
          <Badge variant="primary" size="sm">
            {disciplina?.nome || 'Disciplina'}
          </Badge>
          {modulo && (
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              • {modulo.titulo}
            </span>
          )}
          {kahoot.isDemonstracao && (
            <Badge variant="default" size="xs">Demonstração / Modelo</Badge>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-50">
          {kahoot.titulo}
        </h1>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {kahoot.descricao}
        </p>

        {/* Metadados e Resumo de Desempenho */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
          <span>Questões cadastradas: <strong className="text-slate-700 dark:text-slate-200">{kahoot.questoes?.length || 0}</strong></span>
          <span>•</span>
          <span>Tentativas registradas: <strong className="text-slate-700 dark:text-slate-200">{attemptsList.length}</strong></span>
          {attemptsList.length > 0 && (
            <>
              <span>•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                Última nota: {attemptsList[0].percentual}% ({attemptsList[0].acertos}/{attemptsList[0].totalQuestoes})
              </span>
            </>
          )}
          {reviewInfo?.nextReviewDate && (
            <>
              <span>•</span>
              <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Próxima revisão: {reviewInfo.nextReviewDate}
              </span>
            </>
          )}
        </div>
      </section>

      {/* 2. RESUMO TEÓRICO DO CONTEÚDO */}
      <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400">
          <BookOpen className="w-5 h-5" />
          <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
            1. Resumo Teórico do Conteúdo
          </h2>
        </div>

        {kahoot.resumoTeorico ? (
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            {kahoot.resumoTeorico}
          </p>
        ) : (
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Este Kahoot ainda não possui resumo cadastrado. Complete o resumo para reforçar a preparação.</span>
          </div>
        )}
      </section>

      {/* 3. CONCEITOS QUE PRECISO MEMORIZAR */}
      {kahoot.conceitosCobrados?.length > 0 && (
        <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <Lightbulb className="w-5 h-5" />
            <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
              2. Conceitos que Preciso Memorizar
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {kahoot.conceitosCobrados.map((conc, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 text-xs text-emerald-900 dark:text-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>{conc}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. DEFINIÇÕES IMPORTANTES */}
      {modulo?.definicoes?.length > 0 && (
        <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
            <BookOpen className="w-5 h-5" />
            <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
              3. Definições Importantes
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {modulo.definicoes.map((def, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/50">
                <h4 className="text-xs font-bold text-purple-800 dark:text-purple-300 mb-1">
                  {def.termo}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {def.significado}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. EXEMPLOS PRÁTICOS */}
      {kahoot.exemplosExplicativos?.length > 0 && (
        <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Layers className="w-5 h-5" />
            <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
              4. Exemplos Práticos
            </h2>
          </div>
          <div className="space-y-2">
            {kahoot.exemplosExplicativos.map((ex, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                {ex}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. CONFUSÕES COMUNS E PONTOS DE ATENÇÃO (PEGADINHAS) */}
      {kahoot.errosComuns?.length > 0 && (
        <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
              5. Confusões Comuns e Pontos de Atenção (Atenção às Pegadinhas)
            </h2>
          </div>
          <div className="space-y-2">
            {kahoot.errosComuns.map((err, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-xs sm:text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
                • {err}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. QUESTÕES PARA TESTAR MINHA MEMÓRIA (Gabarito Oculto por Padrão) */}
      <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
              6. Questões para Testar Minha Memória
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              O gabarito fica oculto antecipadamente para treinar a recuperação ativa de memória.
            </p>
          </div>

          {kahoot.questoes?.length > 0 && (
            <button
              onClick={() => setMostrarTodasRespostas(!mostrarTodasRespostas)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0"
            >
              {mostrarTodasRespostas ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Ocultar Todas as Respostas</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Revelar Todas as Respostas</span>
                </>
              )}
            </button>
          )}
        </div>

        {!kahoot.questoes || kahoot.questoes.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            Nenhuma questão cadastrada para este quiz ainda. Você pode importar via CSV ou JSON na Central.
          </div>
        ) : (
          <div className="space-y-3">
            {kahoot.questoes.map((q, idx) => {
              const visivel = mostrarTodasRespostas || respostasVisiveis[q.id || idx];

              return (
                <div
                  key={q.id || idx}
                  className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-4 space-y-2.5 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {q.pergunta}
                      </h4>
                    </div>

                    <button
                      onClick={() => toggleResposta(q.id || idx)}
                      className="text-xs font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400 shrink-0"
                    >
                      {visivel ? 'Ocultar resposta' : 'Ver resposta'}
                    </button>
                  </div>

                  {visivel && (
                    <div className="pl-7 space-y-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 animate-fade-in text-xs">
                      <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-medium">
                        <strong>Resposta Correta:</strong> {q.respostaCorreta}
                      </div>
                      {q.explicacao && (
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                          <strong>Explicação:</strong> {q.explicacao}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 8. BOTÃO PARA ABRIR O KAHOOT ORIGINAL */}
      <section className="p-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-amber-100">
              Preparado para Testar?
            </span>
            <h3 className="text-lg font-bold mt-0.5">
              Fazer o Quiz no Kahoot
            </h3>
            <p className="text-xs text-amber-100/90 mt-1 max-w-lg">
              Você revisou a base teórica e as pegadinhas. Clique para responder às perguntas no Kahoot e depois retorne aqui para registrar seu resultado.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            {kahoot.urlKahoot ? (
              <a
                href={kahoot.urlKahoot}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-amber-800 hover:bg-amber-50 font-bold text-xs sm:text-sm shadow-sm transition-all shrink-0 cursor-pointer w-full sm:w-auto"
              >
                <span>Abrir Kahoot do Quiz</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <button
                onClick={() => setEditandoUrl(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold text-xs transition-colors shrink-0 border border-white/30"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Cadastrar Link do Kahoot</span>
              </button>
            )}
          </div>
        </div>

        {/* Gerenciador / Editor inline da URL do Kahoot */}
        <div className="pt-2 border-t border-white/20 text-xs flex flex-wrap items-center justify-between gap-2">
          {editandoUrl ? (
            <form onSubmit={handleSalvarUrl} className="flex items-center gap-2 w-full">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Cole o link do seu Kahoot (https://create.kahoot.it/...)"
                className="flex-1 px-3 py-1.5 rounded-lg text-slate-800 bg-white text-xs outline-none"
                required
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-semibold text-xs"
              >
                Salvar Link
              </button>
              <button
                type="button"
                onClick={() => setEditandoUrl(false)}
                className="px-2 py-1.5 rounded-lg text-amber-100 text-xs hover:underline"
              >
                Cancelar
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-between w-full text-amber-100 text-[11px]">
              <span>
                Link cadastrado: {kahoot.urlKahoot ? kahoot.urlKahoot : 'Nenhum link cadastrado ainda.'}
              </span>
              <button
                onClick={() => { setUrlInput(kahoot.urlKahoot || ''); setEditandoUrl(true); }}
                className="underline hover:text-white ml-2 cursor-pointer"
              >
                {kahoot.urlKahoot ? 'Alterar link' : 'Adicionar link'}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 9. REGISTRO DE RESULTADO DA TENTATIVA */}
      <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
          <TrendingUp className="w-5 h-5" />
          <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
            7. Registrar Tentativa e Resultado
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Após responder ao quiz no Kahoot, informe seus acertos para que o sistema calcule sua taxa de aproveitamento e programe sua próxima revisão.
        </p>

        <form onSubmit={handleSalvarTentativa} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Data do Quiz
              </label>
              <input
                type="date"
                value={dataTentativa}
                onChange={(e) => setDataTentativa(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Total de Questões
              </label>
              <input
                type="number"
                min="1"
                value={totalQuestoes}
                onChange={(e) => handleTotalChange(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500 font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 text-emerald-600 dark:text-emerald-400">
                Acertos
              </label>
              <input
                type="number"
                min="0"
                max={totalQuestoes}
                value={acertos}
                onChange={(e) => handleAcertosChange(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 outline-none focus:border-emerald-500 font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 text-rose-600 dark:text-rose-400">
                Erros
              </label>
              <input
                type="number"
                min="0"
                value={erros}
                readOnly
                className="w-full px-3 py-2 text-xs rounded-xl bg-rose-50/40 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 outline-none font-bold cursor-not-allowed"
              />
            </div>
          </div>

          {/* Banner de Taxa de Acerto Calculada */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Taxa de Aproveitamento Calculada:
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-base font-extrabold ${
                percentualAtual >= 80 ? 'text-emerald-600 dark:text-emerald-400' :
                percentualAtual >= 60 ? 'text-amber-600 dark:text-amber-400' :
                'text-rose-600 dark:text-rose-400'
              }`}>
                {percentualAtual}%
              </span>
              <Badge variant={percentualAtual >= 80 ? 'success' : percentualAtual >= 60 ? 'warning' : 'default'} size="xs">
                {percentualAtual >= 80 ? 'Ótimo Domínio' : percentualAtual >= 60 ? 'Em Evolução' : 'Necessita Reforço'}
              </Badge>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Dificuldades Encontradas (Conteúdos que errou ou teve dúvida)
            </label>
            <input
              type="text"
              value={dificuldades}
              onChange={(e) => setDificuldades(e.target.value)}
              placeholder="Ex: Confundi a sintaxe de operador relacional; esqueci curto-circuito..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Observações Pessoais da Tentativa
            </label>
            <input
              type="text"
              value={observacoesTentativa}
              onChange={(e) => setObservacoesTentativa(e.target.value)}
              placeholder="Ex: Respondi com pressa no celular; revisar antes da prova presencial..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="anteciparCheck"
              checked={anteciparRevisao || percentualAtual < 70}
              onChange={(e) => setAnteciparRevisao(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="anteciparCheck" className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              Antecipar próxima revisão para amanhã (Recomendado se teve dúvidas ou percentual &lt; 70%)
            </label>
          </div>

          {formErro && (
            <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold">{formErro}</p>
          )}

          <div className="flex items-center justify-between pt-2">
            {tentativaSalvaFeedback ? (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Tentativa registrada com sucesso e próxima revisão agendada!
              </span>
            ) : <span />}

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              Salvar Resultado
            </button>
          </div>
        </form>
      </section>

      {/* 10. HISTÓRICO DE TENTATIVAS E PRÓXIMA REVISÃO */}
      <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <History className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
              8. Histórico de Tentativas e Próximas Revisões
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {attemptsList.length} registro(s)
          </span>
        </div>

        {attemptsList.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            Nenhuma tentativa registrada para este quiz ainda. Realize o Kahoot e registre sua primeira pontuação acima!
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {attemptsList.map((att, idx) => (
              <div key={att.id || idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Tentativa em {att.data}
                    </span>
                    <Badge variant={att.percentual >= 80 ? 'success' : att.percentual >= 60 ? 'warning' : 'default'} size="xs">
                      {att.percentual}% de acerto
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-3">
                    <span>Acertos: <strong>{att.acertos}</strong> / {att.totalQuestoes}</span>
                    <span>Erros: <strong>{att.erros}</strong></span>
                  </div>
                  {att.dificuldades && (
                    <p className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-md mt-1">
                      <strong>Dificuldade:</strong> {att.dificuldades}
                    </p>
                  )}
                  {att.observacoes && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                      "{att.observacoes}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ANOTAÇÕES PESSOAIS GERAIS */}
      <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <MessageSquare className="w-5 h-5 text-sky-600" />
          <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
            9. Minhas Anotações Gerais do Quiz
          </h2>
        </div>

        <form onSubmit={handleSalvarAnotacoesGerais} className="space-y-3">
          <textarea
            value={anotacoesGerais}
            onChange={(e) => setAnotacoesGerais(e.target.value)}
            rows={3}
            placeholder="Anotações livres sobre este quiz, fórmulas a decorar ou macetes..."
            className="w-full p-3.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-sky-500 transition-colors resize-none"
          />

          <div className="flex items-center justify-between">
            {anotacaoSalvaFeedback ? (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Anotações salvas com sucesso!
              </span>
            ) : <span />}

            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              Salvar Anotações
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
