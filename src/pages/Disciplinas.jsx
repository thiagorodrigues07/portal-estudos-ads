import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStudy } from '../context/StudyContext';
import {
  BookOpen,
  Search,
  Filter,
  Layers,
  FileText,
  HelpCircle,
  FolderGit2,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';

export default function Disciplinas() {
  const { disciplinas, modulos, resumos, kahoots, projetos, moduleProgress } = useStudy();

  const [busca, setBusca] = useState('');
  const [filtroSemestre, setFiltroSemestre] = useState('todos');
  const [filtroStatus, setFiltroStatus] = useState('todos');

  // Filtragem
  const disciplinasFiltradas = disciplinas.filter(d => {
    const matchBusca = d.nome.toLowerCase().includes(busca.toLowerCase()) ||
                       d.descricao.toLowerCase().includes(busca.toLowerCase());
    const matchSemestre = filtroSemestre === 'todos' || d.semestre.toString() === filtroSemestre;
    const matchStatus = filtroStatus === 'todos' || d.status === filtroStatus;
    return matchBusca && matchSemestre && matchStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Estrutura Curricular</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Catálogo de Disciplinas
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Explore as matérias da graduação, acesse módulos de estudo, resumos e quizzes vinculados.
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
            placeholder="Filtrar disciplina por nome ou assunto..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-sky-500 transition-colors shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Filtro Semestre */}
          <select
            value={filtroSemestre}
            onChange={(e) => setFiltroSemestre(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 outline-none focus:border-sky-500 shadow-2xs"
          >
            <option value="todos">Todos os Semestres</option>
            <option value="1">1º Semestre</option>
            <option value="2">2º Semestre</option>
            <option value="3">3º Semestre</option>
            <option value="4">4º Semestre</option>
            <option value="5">5º Semestre</option>
          </select>

          {/* Filtro Status */}
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 outline-none focus:border-sky-500 shadow-2xs"
          >
            <option value="todos">Todos os Status</option>
            <option value="Em andamento">Em andamento</option>
            <option value="Concluída">Concluída</option>
            <option value="Não iniciada">Não iniciada</option>
          </select>
        </div>
      </div>

      {/* Lista de Cards de Disciplinas */}
      {disciplinasFiltradas.length === 0 ? (
        <EmptyState
          title="Nenhuma disciplina encontrada"
          description="Tente ajustar os filtros de busca ou verifique se há disciplinas cadastradas para o semestre selecionado."
          actionLabel="Limpar filtros"
          onAction={() => { setBusca(''); setFiltroSemestre('todos'); setFiltroStatus('todos'); }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {disciplinasFiltradas.map((disc) => {
            const modulosDaDisc = modulos.filter(m => m.disciplinaId === disc.id);
            const resumosDaDisc = resumos.filter(r => r.disciplinaId === disc.id);
            const kahootsDaDisc = kahoots.filter(k => k.disciplinaId === disc.id);
            const projetosDaDisc = projetos.filter(p => p.disciplinasRelacionadas?.includes(disc.id));

            const concluidos = modulosDaDisc.filter(m => (moduleProgress[m.id] || m.status) === 'concluido').length;
            const progressoDisc = modulosDaDisc.length > 0 ? Math.round((concluidos / modulosDaDisc.length) * 100) : 0;

            return (
              <div
                key={disc.id}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:shadow-md hover:border-sky-200 dark:hover:border-slate-700 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <Badge variant="primary" size="xs">
                      {disc.semestre}º Semestre
                    </Badge>
                    <Badge variant={disc.status === 'Concluída' ? 'success' : 'default'} size="xs">
                      {disc.status}
                    </Badge>
                  </div>

                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    {disc.nome}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {disc.descricao}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  {/* Barra de Progresso da Disciplina */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                      <span>Progresso dos módulos</span>
                      <span className="font-semibold">{progressoDisc}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sky-500 rounded-full transition-all duration-300"
                        style={{ width: `${progressoDisc}%` }}
                      />
                    </div>
                  </div>

                  {/* Badges de Contagem de Recursos */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="inline-flex items-center gap-1" title="Módulos cadastrados">
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      {modulosDaDisc.length}
                    </span>
                    <span className="inline-flex items-center gap-1" title="Resumos disponíveis">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      {resumosDaDisc.length}
                    </span>
                    <span className="inline-flex items-center gap-1" title="Kahoots vinculados">
                      <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                      {kahootsDaDisc.length}
                    </span>
                    {projetosDaDisc.length > 0 && (
                      <span className="inline-flex items-center gap-1" title="Projetos relacionados">
                        <FolderGit2 className="w-3.5 h-3.5 text-slate-400" />
                        {projetosDaDisc.length}
                      </span>
                    )}
                  </div>

                  <Link
                    to={`/disciplinas/${disc.id}`}
                    className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-sky-600 hover:text-white dark:hover:bg-sky-600 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 group/btn"
                  >
                    <span>Acessar Módulos e Conteúdos</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
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
