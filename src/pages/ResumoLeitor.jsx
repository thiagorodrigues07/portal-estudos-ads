import React from 'react';
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
  ExternalLink
} from 'lucide-react';
import Badge from '../components/common/Badge';
import CodeBlock from '../components/common/CodeBlock';
import EmptyState from '../components/common/EmptyState';

export default function ResumoLeitor() {
  const { id } = useParams();
  const {
    resumos,
    disciplinas,
    modulos,
    kahoots,
    isFavorite,
    toggleFavorite,
    reviews,
    markAsReviewed
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
  const foiRevisado = reviews[resumo.id]?.revisado;
  const dataRevisao = reviews[resumo.id]?.dataUltimaRevisao;

  const handlePrint = () => {
    window.print();
  };

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

        <div className="flex items-center gap-2">
          {/* Botão Marcar como Revisado */}
          <button
            onClick={() => markAsReviewed(resumo.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              foiRevisado
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${foiRevisado ? 'text-emerald-600' : 'text-slate-400'}`} />
            <span>{foiRevisado ? 'Revisado Hoje' : 'Marcar como Revisado'}</span>
          </button>

          {/* Botão Favoritar */}
          <button
            onClick={() => toggleFavorite(resumo.id)}
            className={`p-2 rounded-xl border transition-colors ${
              favorito
                ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-600'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 hover:text-amber-500 hover:bg-slate-50'
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
            <span>Salvar em PDF / Imprimir</span>
          </button>
        </div>
      </div>

      {/* Artigo / Leitor */}
      <article className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-10 shadow-xs space-y-8">
        {/* Metadados do Resumo */}
        <header className="space-y-3 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary" size="sm">{disciplina?.nome || 'Disciplina'}</Badge>
            {modulo && (
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                • {modulo.titulo}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight leading-snug">
            {resumo.titulo}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Tempo estimado: {resumo.tempoLeituraMin} minutos
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Atualizado em: {resumo.dataAtualizacao}
            </span>
            {dataRevisao && (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                Última revisão pessoal: {dataRevisao}
              </span>
            )}
          </div>

          {resumo.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {resumo.tags.map((tag, i) => (
                <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Introdução */}
        {resumo.conteudo?.introducao && (
          <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
            {resumo.conteudo.introducao}
          </p>
        )}

        {/* Seções de Conteúdo */}
        {resumo.conteudo?.secoes?.map((secao, idx) => (
          <div key={idx} className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 border-l-4 border-sky-600 pl-3">
              {secao.titulo}
            </h2>

            {secao.texto && (
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {secao.texto}
              </p>
            )}

            {/* Listas */}
            {secao.itens?.length > 0 && (
              <ul className="space-y-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 pl-4 list-disc">
                {secao.itens.map((item, itemIdx) => (
                  <li key={itemIdx} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            )}

            {/* Tabelas quando houver */}
            {secao.tabela && (
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 my-4">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 uppercase font-semibold text-[11px]">
                    <tr>
                      {secao.tabela.colunas.map((col, cIdx) => (
                        <th key={cIdx} className="p-3 border-b border-slate-200 dark:border-slate-800">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {secao.tabela.linhas.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        {row.map((cell, cellIdx) => (
                          <td key={cellIdx} className="p-3 text-slate-600 dark:text-slate-300">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}

        {/* Bloco de Código de Exemplo */}
        {resumo.conteudo?.codigoExemplo && (
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Exemplo de Código Relacionado
            </h3>
            <CodeBlock code={resumo.conteudo.codigoExemplo} language="javascript" />
          </div>
        )}

        {/* Caixa de Destaque Discreta (Callout) */}
        {resumo.conteudo?.destaqueImportante && (
          <div className="rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 p-4 sm:p-5 flex items-start gap-3.5">
            <AlertCircle className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-sky-900 dark:text-sky-100 leading-relaxed">
              <strong className="font-semibold block mb-1">Atenção para Avaliações e Provas:</strong>
              {resumo.conteudo.destaqueImportante}
            </div>
          </div>
        )}

        {/* Link para o Kahoot Relacionado */}
        {kahoot && (
          <div className="no-print pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">
                <HelpCircle className="w-4 h-4" />
                <span>Quiz Recomendado para este Conteúdo</span>
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {kahoot.titulo}
              </h4>
            </div>
            <Link
              to={`/kahoots/${kahoot.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-colors shrink-0"
            >
              <span>Abrir Central do Kahoot</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </article>
    </div>
  );
}
