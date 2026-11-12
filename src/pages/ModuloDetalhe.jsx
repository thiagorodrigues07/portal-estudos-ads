import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStudy, getTodayString } from '../context/StudyContext';
import {
  Layers,
  ArrowLeft,
  BookOpen,
  HelpCircle,
  Lightbulb,
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  Clock,
  Play,
  Check,
  ExternalLink,
  Calendar,
  FileText
} from 'lucide-react';
import Badge from '../components/common/Badge';
import CodeBlock from '../components/common/CodeBlock';
import EmptyState from '../components/common/EmptyState';

export default function ModuloDetalhe() {
  const { id } = useParams();
  const {
    modulos,
    disciplinas,
    resumos,
    kahoots,
    setModuleManualStatus,
    recordSpacedReview,
    spacedReviews,
    getKahootAttempts
  } = useStudy();

  const modulo = modulos.find(m => m.id === id);

  if (!modulo) {
    return (
      <div className="py-12">
        <EmptyState
          title="Módulo não encontrado"
          description="O módulo solicitado não existe ou foi removido."
          actionLabel="Voltar para Disciplinas"
          onAction={() => window.history.back()}
        />
      </div>
    );
  }

  const disciplina = disciplinas.find(d => d.id === modulo.disciplinaId);
  const resumoRelacionado = resumos.find(r => r.moduloId === modulo.id || r.disciplinaId === modulo.disciplinaId);
  const kahootRelacionado = kahoots.find(k => k.id === modulo.kahootId || k.moduloId === modulo.id);
  const tentativasKahoot = kahootRelacionado ? getKahootAttempts(kahootRelacionado.id) : [];

  const reviewInfo = spacedReviews[modulo.id] || null;
  const statusAtual = modulo.status || 'nao_iniciado';

  const [feedbackSalvo, setFeedbackSalvo] = useState(false);

  const handleIniciarEstudo = () => {
    setModuleManualStatus(modulo.id, 'em_estudo');
    setFeedbackSalvo(true);
    setTimeout(() => setFeedbackSalvo(false), 2000);
  };

  const handleConcluirModulo = () => {
    recordSpacedReview(modulo.id, 'modulo', {
      status: 'estudado',
      notes: 'Conclusão de leitura e estudo teórico do módulo.'
    });
    setFeedbackSalvo(true);
    setTimeout(() => setFeedbackSalvo(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      {/* Navegação e Trilha (Breadcrumbs) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Link to="/disciplinas" className="hover:text-sky-600">Disciplinas</Link>
          <span>/</span>
          {disciplina && (
            <Link to={`/disciplinas/${disciplina.id}`} className="hover:text-sky-600 truncate max-w-[150px]">
              {disciplina.nome}
            </Link>
          )}
          <span>/</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
            {modulo.titulo}
          </span>
        </div>

        {/* Controles de Status do Módulo */}
        <div className="flex items-center gap-2 shrink-0">
          {statusAtual !== 'estudado' && statusAtual !== 'dominado' ? (
            <button
              onClick={handleIniciarEstudo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{statusAtual === 'em_estudo' ? 'Em Estudo' : 'Iniciar Estudo'}</span>
            </button>
          ) : (
            <Badge variant="success" size="sm">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Estudo Concluído
            </Badge>
          )}

          <button
            onClick={handleConcluirModulo}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-100 transition-colors"
            title="Marcar leitura como concluída e agendar 1ª revisão"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Concluir e Agendar Revisão</span>
          </button>
        </div>
      </div>

      {feedbackSalvo && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Status do módulo atualizado e sincronizado com o cronograma de estudos!</span>
        </div>
      )}

      {/* Header do Módulo */}
      <section className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="primary" size="sm">
            <BookOpen className="w-3.5 h-3.5" />
            {disciplina?.nome || 'Disciplina'}
          </Badge>
          <Badge variant={statusAtual === 'dominado' || statusAtual === 'estudado' ? 'success' : statusAtual === 'em_estudo' ? 'warning' : 'default'} size="sm">
            Status: {statusAtual === 'em_estudo' ? 'Em Estudo' : statusAtual === 'estudado' ? 'Estudado' : statusAtual === 'dominado' ? 'Dominado' : 'Não Iniciado'}
          </Badge>
          {reviewInfo?.nextReviewDate && (
            <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Próxima Revisão: {reviewInfo.nextReviewDate}
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-50">
          {modulo.titulo}
        </h1>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {modulo.descricao}
        </p>

        {/* Atalhos de Ação Rápida */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3">
          {kahootRelacionado && (
            <Link
              to={`/kahoots/${kahootRelacionado.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition-colors shadow-xs"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Fazer Kahoot deste Módulo</span>
            </Link>
          )}

          {resumoRelacionado && (
            <Link
              to={`/resumos/${resumoRelacionado.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
            >
              <FileText className="w-4 h-4 text-sky-600" />
              <span>Ler Resumo Formatado (com PDF)</span>
            </Link>
          )}
        </div>
      </section>

      {/* 1. OBJETIVOS DE APRENDIZAGEM */}
      {modulo.objetivos?.length > 0 && (
        <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <Lightbulb className="w-5 h-5" />
            <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
              Objetivos de Aprendizagem
            </h2>
          </div>
          <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 list-disc list-inside">
            {modulo.objetivos.map((obj, i) => (
              <li key={i}>{obj}</li>
            ))}
          </ul>
        </section>
      )}

      {/* 2. RESUMO TEÓRICO COMPLETO */}
      <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400">
          <BookOpen className="w-5 h-5" />
          <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
            Resumo Teórico do Módulo
          </h2>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
          {modulo.resumoTeorico}
        </div>
      </section>

      {/* 3. CONCEITOS PRINCIPAIS E DEFINIÇÕES */}
      {(modulo.conceitosPrincipais?.length > 0 || modulo.definicoes?.length > 0) && (
        <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
            <Layers className="w-5 h-5" />
            <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
              Conceitos Principais e Definições
            </h2>
          </div>

          {modulo.conceitosPrincipais?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {modulo.conceitosPrincipais.map((c, i) => (
                <span key={i} className="px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-semibold border border-purple-200 dark:border-purple-800">
                  {c}
                </span>
              ))}
            </div>
          )}

          {modulo.definicoes?.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {modulo.definicoes.map((d, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    {d.termo}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {d.significado}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 4. CÓDIGO E EXEMPLO PRÁTICO */}
      {(modulo.exemplosPraticos || modulo.codigoExemplo) && (
        <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
            Exemplo Prático e Código
          </h2>

          {modulo.exemplosPraticos && (
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {modulo.exemplosPraticos}
            </p>
          )}

          {modulo.codigoExemplo && (
            <CodeBlock code={modulo.codigoExemplo} language="javascript" />
          )}
        </section>
      )}

      {/* 5. CONFUSÕES COMUNS E PONTOS PARA MEMORIZAR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modulo.errosComuns?.length > 0 && (
          <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Erros Comuns / Pegadinhas
              </h3>
            </div>
            <ul className="space-y-1.5 text-xs text-rose-900 dark:text-rose-200 list-disc list-inside">
              {modulo.errosComuns.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </section>
        )}

        {modulo.pontosMemorizar?.length > 0 && (
          <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <BrainCircuit className="w-5 h-5" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Pontos-Chave para Memorizar
              </h3>
            </div>
            <ul className="space-y-1.5 text-xs text-indigo-900 dark:text-indigo-200 list-disc list-inside">
              {modulo.pontosMemorizar.map((pt, i) => (
                <li key={i}>{pt}</li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* 6. CENTRAL DO KAHOOT DESTE MÓDULO */}
      {kahootRelacionado ? (
        <section className="rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1">
                <HelpCircle className="w-4 h-4" />
                <span>Quiz Oficial de Fixação</span>
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                {kahootRelacionado.titulo}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {kahootRelacionado.questoes?.length || 0} questões com gabarito consultável
              </p>
            </div>

            <Link
              to={`/kahoots/${kahootRelacionado.id}`}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shrink-0 shadow-xs"
            >
              <span>Abrir Central de Estudo do Kahoot</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          {tentativasKahoot.length > 0 && (
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-amber-200/60 dark:border-amber-900/40 text-xs flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">
                Seu histórico neste quiz: <strong>{tentativasKahoot.length} tentativa(s)</strong>
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                Última nota: {tentativasKahoot[0].percentual}% de acerto
              </span>
            </div>
          )}
        </section>
      ) : (
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
          Nenhum Kahoot vinculado a este módulo ainda. Você pode criar um na Central de Kahoots.
        </div>
      )}
    </div>
  );
}
