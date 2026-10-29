import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudy } from '../../context/StudyContext';
import {
  Search,
  BookOpen,
  FileText,
  HelpCircle,
  FolderGit2,
  FileCode,
  Layers,
  X,
  ArrowRight
} from 'lucide-react';

export default function SearchModal() {
  const {
    isSearchOpen,
    closeSearch,
    disciplinas,
    modulos,
    resumos,
    kahoots,
    projetos,
    notas
  } = useStudy();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setResults([]);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase().trim();
    const matches = [];

    // 1. Disciplinas
    disciplinas.forEach(d => {
      if (d.nome.toLowerCase().includes(q) || d.descricao.toLowerCase().includes(q)) {
        matches.push({
          tipo: 'Disciplina',
          icon: BookOpen,
          id: d.id,
          titulo: d.nome,
          subtitulo: `${d.semestre}º Semestre • ${d.status}`,
          link: `/disciplinas/${d.id}`
        });
      }
    });

    // 2. Módulos
    modulos.forEach(m => {
      const matchConceitos = m.conceitosPrincipais?.some(c => c.toLowerCase().includes(q));
      if (m.titulo.toLowerCase().includes(q) || m.descricao.toLowerCase().includes(q) || matchConceitos) {
        matches.push({
          tipo: 'Módulo',
          icon: Layers,
          id: m.id,
          titulo: m.titulo,
          subtitulo: m.descricao,
          link: `/disciplinas/${m.disciplinaId}`
        });
      }
    });

    // 3. Resumos
    resumos.forEach(r => {
      const matchTag = r.tags?.some(t => t.toLowerCase().includes(q));
      if (r.titulo.toLowerCase().includes(q) || r.assunto.toLowerCase().includes(q) || matchTag) {
        matches.push({
          tipo: 'Resumo',
          icon: FileText,
          id: r.id,
          titulo: r.titulo,
          subtitulo: `${r.assunto} • ${r.tags.join(', ')}`,
          link: `/resumos/${r.id}`
        });
      }
    });

    // 4. Kahoots & Questões
    kahoots.forEach(k => {
      const matchQuestao = k.questoes?.some(qu => qu.pergunta.toLowerCase().includes(q) || qu.respostaCorreta.toLowerCase().includes(q));
      if (k.titulo.toLowerCase().includes(q) || k.descricao.toLowerCase().includes(q) || matchQuestao) {
        matches.push({
          tipo: 'Kahoot / Quiz',
          icon: HelpCircle,
          id: k.id,
          titulo: k.titulo,
          subtitulo: k.descricao,
          link: `/kahoots/${k.id}`
        });
      }
    });

    // 5. Projetos
    projetos.forEach(p => {
      const matchTec = p.tecnologias?.some(t => t.toLowerCase().includes(q));
      if (p.nome.toLowerCase().includes(q) || p.descricao.toLowerCase().includes(q) || matchTec) {
        matches.push({
          tipo: 'Projeto',
          icon: FolderGit2,
          id: p.id,
          titulo: p.nome,
          subtitulo: p.tecnologias.join(' • '),
          link: `/projetos/${p.id}`
        });
      }
    });

    // 6. Notas Técnicas
    notas.forEach(n => {
      const matchTag = n.tags?.some(t => t.toLowerCase().includes(q));
      if (n.titulo.toLowerCase().includes(q) || n.categoria.toLowerCase().includes(q) || n.conteudo.toLowerCase().includes(q) || matchTag) {
        matches.push({
          tipo: 'Nota Técnica',
          icon: FileCode,
          id: n.id,
          titulo: n.titulo,
          subtitulo: `${n.categoria} • ${n.tags.join(', ')}`,
          link: `/notas`
        });
      }
    });

    setResults(matches);
  }, [query, disciplinas, modulos, resumos, kahoots, projetos, notas]);

  if (!isSearchOpen) return null;

  const handleSelect = (link) => {
    closeSearch();
    navigate(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Barra superior de busca */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar disciplinas, módulos, resumos, kahoots, notas..."
            className="flex-1 bg-transparent text-sm sm:text-base outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
          <button
            onClick={closeSearch}
            className="sm:hidden p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lista de Resultados */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/50">
          {!query.trim() ? (
            <div className="py-12 text-center text-slate-400 text-xs sm:text-sm">
              Digite para buscar em todos os módulos, notas, resumos e questões de Kahoot...
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              Nenhum resultado encontrado para "<span className="font-medium text-slate-700 dark:text-slate-300">{query}</span>"
            </div>
          ) : (
            results.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={`${item.tipo}-${item.id}-${idx}`}
                  onClick={() => handleSelect(item.link)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors group"
                >
                  <div className="flex items-start gap-3 min-w-0 pr-2">
                    <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 mt-0.5 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-medium uppercase tracking-wider text-sky-600 dark:text-sky-400">
                          {item.tipo}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                        {item.titulo}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {item.subtitulo}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-sky-600 dark:group-hover:text-sky-400 shrink-0 transition-transform group-hover:translate-x-0.5" />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
