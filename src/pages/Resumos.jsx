import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStudy } from '../context/StudyContext';
import {
  FileText,
  Search,
  Filter,
  Star,
  Clock,
  Tag,
  ArrowRight,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';

export default function Resumos() {
  const { resumos, disciplinas, favorites, isFavorite, toggleFavorite, reviews } = useStudy();

  const [busca, setBusca] = useState('');
  const [filtroDisciplina, setFiltroDisciplina] = useState('todas');
  const [apenasFavoritos, setApenasFavoritos] = useState(false);
  const [apenasRevisados, setApenasRevisados] = useState('todos');

  // Filtragem
  const resumosFiltrados = resumos.filter(r => {
    const q = busca.toLowerCase();
    const matchBusca = r.titulo.toLowerCase().includes(q) ||
                       r.assunto.toLowerCase().includes(q) ||
                       r.tags?.some(t => t.toLowerCase().includes(q));

    const matchDisc = filtroDisciplina === 'todas' || r.disciplinaId === filtroDisciplina;
    const matchFav = !apenasFavoritos || isFavorite(r.id);
    
    let matchRev = true;
    if (apenasRevisados === 'revisados') {
      matchRev = !!reviews[r.id]?.revisado;
    } else if (apenasRevisados === 'pendentes') {
      matchRev = !reviews[r.id]?.revisado;
    }

    return matchBusca && matchDisc && matchFav && matchRev;
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4" />
            <span>Base Teórica Central</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Biblioteca de Resumos
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Revisões teóricas organizadas por matéria, conceitos-chave, formatação para leitura prolongada e exportação para PDF.
          </p>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por título, conceito ou tag (#algoritmos, #ux)..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-sky-500 transition-colors shadow-2xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Filtro de Disciplina */}
          <select
            value={filtroDisciplina}
            onChange={(e) => setFiltroDisciplina(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 outline-none focus:border-sky-500 shadow-2xs"
          >
            <option value="todas">Todas as Disciplinas</option>
            {disciplinas.map(d => (
              <option key={d.id} value={d.id}>{d.nome}</option>
            ))}
          </select>

          {/* Filtro de Revisão */}
          <select
            value={apenasRevisados}
            onChange={(e) => setApenasRevisados(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 outline-none focus:border-sky-500 shadow-2xs"
          >
            <option value="todos">Status de Revisão</option>
            <option value="revisados">Já Revisados</option>
            <option value="pendentes">Revisões Pendentes</option>
          </select>

          {/* Botão Favoritos */}
          <button
            onClick={() => setApenasFavoritos(!apenasFavoritos)}
            className={`px-3 py-2 text-xs font-medium rounded-xl border flex items-center gap-1.5 transition-colors ${
              apenasFavoritos
                ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${apenasFavoritos ? 'fill-amber-500 text-amber-500' : ''}`} />
            <span>Favoritos</span>
          </button>
        </div>
      </div>

      {/* Lista de Resumos */}
      {resumosFiltrados.length === 0 ? (
        <EmptyState
          title="Nenhum resumo encontrado"
          description="Nenhum resumo corresponde aos critérios de pesquisa e filtros selecionados."
          actionLabel="Limpar busca"
          onAction={() => { setBusca(''); setFiltroDisciplina('todas'); setApenasFavoritos(false); setApenasRevisados('todos'); }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resumosFiltrados.map((resumo) => {
            const disc = disciplinas.find(d => d.id === resumo.disciplinaId);
            const favorito = isFavorite(resumo.id);
            const rev = reviews[resumo.id];

            return (
              <div
                key={resumo.id}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:border-sky-200 dark:hover:border-slate-700 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 truncate">
                      {disc?.nome}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(resumo.id);
                      }}
                      className="p-1 text-slate-300 hover:text-amber-500 transition-colors"
                      title={favorito ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                    >
                      <Star className={`w-4 h-4 ${favorito ? 'fill-amber-500 text-amber-500' : ''}`} />
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    {resumo.titulo}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {resumo.conteudo?.introducao}
                  </p>

                  {/* Tags */}
                  {resumo.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {resumo.tags.map((t, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {resumo.tempoLeituraMin} min
                    </span>
                    {rev?.revisado && (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Revisado
                      </span>
                    )}
                  </div>

                  <Link
                    to={`/resumos/${resumo.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-600 hover:text-white dark:hover:bg-sky-600 text-sky-700 dark:text-sky-300 font-semibold text-xs transition-colors"
                  >
                    <span>Ler Completo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
