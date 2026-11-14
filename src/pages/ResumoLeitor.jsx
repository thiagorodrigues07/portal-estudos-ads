import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStudy } from '../context/StudyContext';
import {
  ArrowLeft,
  Printer,
  Star,
  CheckCircle2,
  Clock,
  BookOpen,
  Calendar,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  Type,
  AlignLeft,
  Highlighter,
  List,
  Sparkles,
  Zap,
  Check
} from 'lucide-react';
import Badge from '../components/common/Badge';
import CodeBlock from '../components/common/CodeBlock';
import EmptyState from '../components/common/EmptyState';
import { SM2_GRADES } from '../services/sm2Service';

export default function ResumoLeitor() {
  const { id } = useParams();
  const {
    resumos,
    disciplinas,
    modulos,
    kahoots,
    isFavorite,
    toggleFavorite,
    spacedReviews,
    recordSM2Review,
    registrarSessao
  } = useStudy();

  const resumo = resumos.find(r => r.id === id);

  if (!resumo) {
    return (
      <div className="py-12">
        <EmptyState
          title="Resumo não encontrado"
          description="O resumo solicitado não existe ou foi removido."
          actionLabel="Voltar para a Biblioteca"
          onAction={() => window.history.back()}
        />
      </div>
    );
  }

  const disciplina = disciplinas.find(d => d.id === resumo.disciplinaId);
  const modulo = modulos.find(m => m.id === resumo.moduloId);
  const kahoot = kahoots.find(k => k.moduloId === resumo.moduloId || k.disciplinaId === resumo.disciplinaId);

  const favorito = isFavorite(resumo.id);
  const rev = spacedReviews[resumo.id];
  const foiRevisado = rev?.status === 'estudado' || rev?.status === 'em_revisao' || rev?.status === 'dominado';

  // Configurações do Leitor
  const [formatoPedagogico, setFormatoPedagogico] = useState('completo'); // 'completo' | 'simplificado'
  const [tamanhoFonte, setTamanhoFonte] = useState('base'); // 'sm' | 'base' | 'lg' | 'xl'
  const [espacamento, setEspacamento] = useState('relaxed'); // 'normal' | 'relaxed' | 'loose'
  const [destaqueAtivo, setDestaqueAtivo] = useState(false);
  const [painelAjustes, setPainelAjustes] = useState(false);
  const [revisaoSalvaFeedback, setRevisaoSalvaFeedback] = useState(false);

  const handleMarcarRevisado = () => {
    recordSM2Review(resumo.id, 'resumo', SM2_GRADES.GOOD, {
      titulo: resumo.titulo,
      disciplinaId: resumo.disciplinaId,
      moduloId: resumo.moduloId
    });
    // Registra sessão de estudo de leitura
    registrarSessao(resumo.tempoLeituraMin || 10, {
      disciplinaId: resumo.disciplinaId,
      moduloId: resumo.moduloId,
      tipo: 'resumo',
      notas: `Leitura teórica: ${resumo.titulo}`
    });
    setRevisaoSalvaFeedback(true);
    setTimeout(() => setRevisaoSalvaFeedback(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  // Mapeamento de classes tipográficas
  const fontClasses = {
    sm: 'text-xs sm:text-sm',
    base: 'text-sm sm:text-base',
    lg: 'text-base sm:text-lg',
    xl: 'text-lg sm:text-xl'
  };

  const leadingClasses = {
    normal: 'leading-normal space-y-4',
    relaxed: 'leading-relaxed space-y-6',
    loose: 'leading-loose space-y-8'
  };

  // Gerador dinâmico de Resumo Simplificado (Direto ao Ponto)
  const pontosSimplificados = [
    resumo.conteudo?.introducao,
    ...(resumo.conteudo?.secoes || []).map(s => `📌 ${s.titulo}: ${s.texto}`),
    resumo.conteudo?.destaqueImportante ? `⚡ Ponto Crítico para Provas: ${resumo.conteudo.destaqueImportante}` : null
  ].filter(Boolean);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16">
      {/* Barra Superior de Ações (Oculta na impressão) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <Link
          to="/resumos"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Resumos
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          {/* Alternador de Formato: Completo vs Simplificado */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setFormatoPedagogico('completo')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                formatoPedagogico === 'completo'
                  ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-300'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Resumo Completo</span>
            </button>
            <button
              onClick={() => setFormatoPedagogico('simplificado')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                formatoPedagogico === 'simplificado'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-300'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Simplificado (2 min)</span>
            </button>
          </div>

          {/* Botão de Ajustes Tipográficos */}
          <button
            onClick={() => setPainelAjustes(!painelAjustes)}
            className={`p-2 rounded-xl border transition-colors ${
              painelAjustes
                ? 'bg-slate-200 dark:bg-slate-700 text-slate-800'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'
            }`}
            title="Ajustes de fonte e espaçamento"
          >
            <Type className="w-4 h-4" />
          </button>

          {/* Destaque de Conceitos */}
          <button
            onClick={() => setDestaqueAtivo(!destaqueAtivo)}
            className={`p-2 rounded-xl border transition-colors ${
              destaqueAtivo
                ? 'bg-yellow-100 border-yellow-300 text-yellow-700'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'
            }`}
            title="Destacar conceitos importantes"
          >
            <Highlighter className="w-4 h-4" />
          </button>

          {/* Botão Marcar como Revisado */}
          <button
            onClick={handleMarcarRevisado}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              foiRevisado
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${foiRevisado ? 'text-emerald-600' : 'text-slate-400'}`} />
            <span>{foiRevisado ? 'Revisado' : 'Marcar como Lido'}</span>
          </button>

          {/* Favoritar */}
          <button
            onClick={() => toggleFavorite(resumo.id)}
            className={`p-2 rounded-xl border transition-colors ${
              favorito
                ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-600'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 hover:text-amber-500'
            }`}
            title={favorito ? "Remover dos favoritos" : "Favoritar resumo"}
          >
            <Star className={`w-4 h-4 ${favorito ? 'fill-amber-500 text-amber-500' : ''}`} />
          </button>

          {/* Botão Imprimir / Salvar PDF */}
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-semibold hover:opacity-90 transition-opacity"
            title="Salvar como PDF ou Imprimir"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PDF / Imprimir</span>
          </button>
        </div>
      </div>

      {revisaoSalvaFeedback && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fade-in no-print">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Leitura registrada no histórico e horas de estudo contabilizadas!</span>
        </div>
      )}

      {/* Painel Flutuante de Ajustes Tipográficos */}
      {painelAjustes && (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4 text-xs no-print animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-semibold">Tamanho da fonte:</span>
            <div className="flex items-center gap-1">
              {['sm', 'base', 'lg', 'xl'].map(size => (
                <button
                  key={size}
                  onClick={() => setTamanhoFonte(size)}
                  className={`px-2.5 py-1 rounded-lg font-bold ${
                    tamanhoFonte === size
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {size.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-semibold">Espaçamento:</span>
            <div className="flex items-center gap-1">
              {[
                { id: 'normal', label: 'Compacto' },
                { id: 'relaxed', label: 'Médio' },
                { id: 'loose', label: 'Amplo' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setEspacamento(item.id)}
                  className={`px-2.5 py-1 rounded-lg font-medium ${
                    espacamento === item.id
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sumário Navegável (TOC) */}
      {formatoPedagogico === 'completo' && resumo.conteudo?.secoes?.length > 1 && (
        <nav className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2 no-print">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
            <List className="w-3.5 h-3.5 text-sky-600" />
            Sumário Navegável
          </span>
          <div className="flex flex-wrap gap-2 text-xs">
            {resumo.conteudo.secoes.map((sec, idx) => (
              <a
                key={idx}
                href={`#secao-${idx + 1}`}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sky-700 dark:text-sky-300 hover:bg-sky-50 transition-colors"
              >
                {sec.titulo}
              </a>
            ))}
          </div>
        </nav>
      )}

      {/* Artigo / Leitor */}
      <article className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-10 shadow-xs space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Metadados do Resumo */}
        <header className="space-y-3 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary" size="sm">{disciplina?.nome || 'Disciplina'}</Badge>
            {modulo && (
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                • {modulo.titulo}
              </span>
            )}
            <Badge variant={formatoPedagogico === 'completo' ? 'default' : 'warning'} size="xs">
              {formatoPedagogico === 'completo' ? 'Versão Teórica Aprofundada' : 'Versão Rápida / Direto ao Ponto'}
            </Badge>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight leading-snug">
            {resumo.titulo}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Tempo estimado: {formatoPedagogico === 'simplificado' ? '2-3 minutos' : `${resumo.tempoLeituraMin} minutos`}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Atualizado em: {resumo.dataAtualizacao}
            </span>
            {rev?.lastReviewDate && (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                Última revisão pessoal: {rev.lastReviewDate}
              </span>
            )}
          </div>
        </header>

        {/* ======================================= */}
        {/* FORMATO 1: RESUMO COMPLETO APROFUNDADO  */}
        {/* ======================================= */}
        {formatoPedagogico === 'completo' ? (
          <div className={`${fontClasses[tamanhoFonte]} ${leadingClasses[espacamento]} text-slate-700 dark:text-slate-200`}>
            {/* Introdução */}
            {resumo.conteudo?.introducao && (
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed border-l-4 border-sky-500 pl-4 py-1 italic bg-sky-50/30 dark:bg-sky-950/20 rounded-r-xl">
                {resumo.conteudo.introducao}
              </p>
            )}

            {/* Seções de Conteúdo */}
            {resumo.conteudo?.secoes?.map((secao, idx) => (
              <section key={idx} id={`secao-${idx + 1}`} className="pt-4 scroll-mt-20">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 text-sky-800 dark:text-sky-300">
                  {secao.titulo}
                </h2>

                {secao.texto && (
                  <p className={`${destaqueAtivo ? 'bg-yellow-50 dark:bg-yellow-950/30 p-2 rounded-lg' : ''}`}>
                    {secao.texto}
                  </p>
                )}

                {/* Itens com marcadores */}
                {secao.itens?.length > 0 && (
                  <ul className="my-3 space-y-2 list-disc list-inside bg-slate-50/70 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                    {secao.itens.map((item, i) => (
                      <li key={i} className="text-xs sm:text-sm">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Tabelas conceituais */}
                {secao.tabela && (
                  <div className="my-4 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                        <tr>
                          {secao.tabela.colunas?.map((col, cIdx) => (
                            <th key={cIdx} className="p-3 border-b border-slate-200 dark:border-slate-700">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {secao.tabela.linhas?.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="p-3">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            ))}

            {/* Bloco de Código de Exemplo */}
            {resumo.conteudo?.codigoExemplo && (
              <div className="pt-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Exemplo de Código Prático:
                </span>
                <CodeBlock code={resumo.conteudo.codigoExemplo} language="javascript" />
              </div>
            )}

            {/* Destaque Importante */}
            {resumo.conteudo?.destaqueImportante && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-l-4 border-amber-500 text-amber-900 dark:text-amber-200 text-xs sm:text-sm leading-relaxed mt-6">
                <strong>⚡ Ponto de Atenção em Avaliações:</strong> {resumo.conteudo.destaqueImportante}
              </div>
            )}
          </div>
        ) : (
          /* ============================================== */
          /* FORMATO 2: RESUMO SIMPLIFICADO (2 MINUTOS)      */
          /* ============================================== */
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-xs text-amber-800 dark:text-amber-200">
              💡 <strong>Modo Rápido:</strong> Visão geral sintetizada para revisão momentos antes de questionários e provas.
            </div>

            <div className="space-y-3">
              {pontosSimplificados.map((ponto, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 text-xs sm:text-sm leading-relaxed"
                >
                  {ponto}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rodapé de Continuidade */}
        <footer className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
          <div>
            <span className="text-xs text-slate-400 block">Próxima etapa pedagógica sugerida:</span>
            {kahoot ? (
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Fixar conceitos no quiz: <strong>{kahoot.titulo}</strong>
              </span>
            ) : (
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Revisar os flashcards da disciplina
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {kahoot && (
              <Link
                to={`/kahoots/${kahoot.id}`}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Ir para o Quiz</span>
              </Link>
            )}
            <Link
              to="/flashcards"
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>Praticar Flashcards</span>
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}
