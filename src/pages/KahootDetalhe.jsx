import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStudy } from '../context/StudyContext';
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
  AlertCircle
} from 'lucide-react';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';

export default function KahootDetalhe() {
  const { id } = useParams();
  const { kahoots, disciplinas, modulos, setKahoots } = useStudy();

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

  // Controle de visibilidade das respostas (para auto-teste antes do quiz)
  const [respostasVisiveis, setRespostasVisiveis] = useState({});
  const [mostrarTodasRespostas, setMostrarTodasRespostas] = useState(false);

  // Campo de Anotações Pessoais
  const [anotacoes, setAnotacoes] = useState(kahoot.anotacoesPessoais || '');
  const [salvoFeedback, setSalvoFeedback] = useState(false);

  const toggleResposta = (qId) => {
    setRespostasVisiveis(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  const handleSalvarAnotacoes = (e) => {
    e.preventDefault();
    const atualizados = kahoots.map(k => {
      if (k.id === kahoot.id) {
        return { ...k, anotacoesPessoais: anotacoes };
      }
      return k;
    });
    setKahoots(atualizados);
    setSalvoFeedback(true);
    setTimeout(() => setSalvoFeedback(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Botão Retorno */}
      <Link
        to="/kahoots"
        className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para a Central de Kahoots
      </Link>

      {/* 1. IDENTIFICAÇÃO DA DISCIPLINA E DO MÓDULO */}
      <section className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="warning" size="sm">
            <HelpCircle className="w-3.5 h-3.5" />
            Central de Estudo Pré-Quiz
          </Badge>
          <Badge variant="primary" size="sm">
            {disciplina?.nome || 'Disciplina'}
          </Badge>
          {modulo && (
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              • {modulo.titulo}
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-50">
          {kahoot.titulo}
        </h1>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {kahoot.descricao}
        </p>

        <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span>Criado em: {kahoot.dataCriacao || 'Data não informada'}</span>
          <span>•</span>
          <span>Total de Questões: <strong>{kahoot.questoes?.length || 0}</strong></span>
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
            <span>Este Kahoot ainda não possui resumo cadastrado. Complete as anotações para reforçar sua preparação.</span>
          </div>
        )}
      </section>

      {/* 3. CONCEITOS FUNDAMENTAIS */}
      {kahoot.conceitosCobrados?.length > 0 && (
        <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <Lightbulb className="w-5 h-5" />
            <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
              2. Conceitos Fundamentais Cobrados
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

      {/* 4. EXEMPLOS EXPLICATIVOS */}
      {kahoot.exemplosExplicativos?.length > 0 && (
        <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Layers className="w-5 h-5" />
            <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
              3. Exemplos Explicativos
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

      {/* 5. ERROS OU CONFUSÕES COMUNS (PEGADINHAS) */}
      {kahoot.errosComuns?.length > 0 && (
        <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
              4. Erros e Confusões Comuns (Atenção às Pegadinhas)
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

      {/* 6. LINK PARA ABRIR O KAHOOT */}
      <section className="p-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-amber-100">
            Pronto para o Teste?
          </span>
          <h3 className="text-lg font-bold mt-0.5">
            Abrir Quiz no Kahoot
          </h3>
          <p className="text-xs text-amber-100/90 mt-1 max-w-lg">
            Você revisou a base teórica e as pegadinhas. Clique para responder às perguntas no site oficial do Kahoot.
          </p>
        </div>

        <a
          href={kahoot.urlKahoot || 'https://kahoot.it'}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-amber-800 hover:bg-amber-50 font-bold text-xs sm:text-sm shadow-sm transition-all shrink-0 cursor-pointer"
        >
          <span>Acessar Kahoot.it</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </section>

      {/* 7. QUESTÕES E RESPOSTAS PARA CONSULTA */}
      <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
              6. Questões e Respostas para Consulta
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Treine sua memória tentando responder mentalmente antes de revelar o gabarito.
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
                  <span>Ocultar Respostas</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Revelar Todas</span>
                </>
              )}
            </button>
          )}
        </div>

        {!kahoot.questoes || kahoot.questoes.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            Nenhuma questão cadastrada para este Kahoot ainda.
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
                      {visivel ? 'Ocultar' : 'Ver resposta'}
                    </button>
                  </div>

                  {visivel && (
                    <div className="pl-7 space-y-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 animate-fade-in text-xs">
                      <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-medium">
                        <strong>Resposta:</strong> {q.respostaCorreta}
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

      {/* 8. CAMPO DE ANOTAÇÕES PESSOAIS */}
      <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <MessageSquare className="w-5 h-5 text-sky-600" />
          <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
            7. Minhas Anotações e Observações Pessoais
          </h2>
        </div>

        <form onSubmit={handleSalvarAnotacoes} className="space-y-3">
          <textarea
            value={anotacoes}
            onChange={(e) => setAnotacoes(e.target.value)}
            rows={4}
            placeholder="Registre aqui seus pontos fracos neste quiz, fórmulas para memorizar ou dicas do professor..."
            className="w-full p-3.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-sky-500 transition-colors resize-none"
          />

          <div className="flex items-center justify-between">
            {salvoFeedback ? (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Anotações salvas com sucesso!
              </span>
            ) : (
              <span className="text-[11px] text-slate-400">
                Salvo localmente na aplicação.
              </span>
            )}

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
