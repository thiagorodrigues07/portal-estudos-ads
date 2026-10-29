import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStudy } from '../context/StudyContext';
import {
  FolderGit2,
  Search,
  Filter,
  ExternalLink,
  Github,
  Calendar,
  Layers,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';

export default function Projetos() {
  const { projetos, disciplinas } = useStudy();

  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');

  const projetosFiltrados = projetos.filter(p => {
    const q = busca.toLowerCase();
    const matchBusca = p.nome.toLowerCase().includes(q) ||
                       p.descricao.toLowerCase().includes(q) ||
                       p.tecnologias?.some(t => t.toLowerCase().includes(q));
    const matchStatus = filtroStatus === 'todos' || p.status === filtroStatus;
    return matchBusca && matchStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'concluido':
        return <Badge variant="success" size="xs">Concluído</Badge>;
      case 'em_desenvolvimento':
        return <Badge variant="warning" size="xs">Em Desenvolvimento</Badge>;
      case 'planejado':
        return <Badge variant="primary" size="xs">Planejado</Badge>;
      default:
        return <Badge variant="default" size="xs">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <FolderGit2 className="w-4 h-4" />
            <span>Portfólio Prático</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Projetos Acadêmicos e Pessoais
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Documentação de software, desafios resolvidos, tecnologias aplicadas e links de repositórios para construir seu portfólio.
          </p>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome do projeto ou tecnologia (React, Python, SQL)..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-indigo-500 transition-colors shadow-2xs"
          />
        </div>

        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 outline-none focus:border-indigo-500 shadow-2xs"
        >
          <option value="todos">Todos os Status</option>
          <option value="em_desenvolvimento">Em Desenvolvimento</option>
          <option value="concluido">Concluídos</option>
          <option value="planejado">Planejados</option>
        </select>
      </div>

      {/* Lista de Projetos */}
      {projetosFiltrados.length === 0 ? (
        <EmptyState
          title="Nenhum projeto encontrado"
          description="Nenhum projeto corresponde à pesquisa atual."
          actionLabel="Limpar busca"
          onAction={() => { setBusca(''); setFiltroStatus('todos'); }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projetosFiltrados.map((proj) => {
            return (
              <div
                key={proj.id}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs hover:border-indigo-200 dark:hover:border-slate-700 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    {getStatusBadge(proj.status)}
                    {proj.dataInicio && (
                      <span className="text-[11px] text-slate-400">
                        Início: {proj.dataInicio}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {proj.nome}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {proj.descricao}
                  </p>

                  {/* Tags de Tecnologias */}
                  {proj.tecnologias?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {proj.tecnologias.map((tech, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-medium border border-indigo-100 dark:border-indigo-900/40">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors"
                        title="Repositório GitHub"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {proj.demoUrl && (
                      <a
                        href={proj.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors"
                        title="Demonstração Online"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <Link
                    to={`/projetos/${proj.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 text-indigo-700 dark:text-indigo-300 font-semibold text-xs transition-colors"
                  >
                    <span>Ver Documentação</span>
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
