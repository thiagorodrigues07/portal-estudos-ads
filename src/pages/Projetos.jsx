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
  ArrowRight,
  Plus,
  Trash2,
  Edit2
} from 'lucide-react';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';

export default function Projetos() {
  const { projetos, setProjetos, disciplinas } = useStudy();

  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');

  // Estados dos Modais
  const [modalAberto, setModalAberto] = useState(false);
  const [projetoEditando, setProjetoEditando] = useState(null);

  // Form de projeto
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [problema, setProblema] = useState('');
  const [objetivosStr, setObjetivosStr] = useState('');
  const [tecnologiasStr, setTecnologiasStr] = useState('');
  const [linguagensStr, setLinguagensStr] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [status, setStatus] = useState('em_desenvolvimento');
  const [aprendizados, setAprendizados] = useState('');
  const [documentacao, setDocumentacao] = useState('');

  const projetosFiltrados = projetos.filter(p => {
    const q = busca.toLowerCase();
    const matchBusca = p.nome.toLowerCase().includes(q) ||
                       p.descricao.toLowerCase().includes(q) ||
                       p.tecnologias?.some(t => t.toLowerCase().includes(q));
    const matchStatus = filtroStatus === 'todos' || p.status === filtroStatus;
    return matchBusca && matchStatus;
  });

  const getStatusBadge = (st) => {
    switch (st) {
      case 'concluido':
        return <Badge variant="success" size="xs">Concluído</Badge>;
      case 'em_desenvolvimento':
        return <Badge variant="warning" size="xs">Em Desenvolvimento</Badge>;
      case 'planejado':
        return <Badge variant="primary" size="xs">Planejado</Badge>;
      default:
        return <Badge variant="default" size="xs">{st}</Badge>;
    }
  };

  const handleAbrirCriar = () => {
    setProjetoEditando(null);
    setNome('');
    setDescricao('');
    setProblema('');
    setObjetivosStr('');
    setTecnologiasStr('');
    setLinguagensStr('');
    setGithubUrl('');
    setDemoUrl('');
    setStatus('em_desenvolvimento');
    setAprendizados('');
    setDocumentacao('');
    setModalAberto(true);
  };

  const handleAbrirEditar = (proj) => {
    setProjetoEditando(proj);
    setNome(proj.nome);
    setDescricao(proj.descricao);
    setProblema(proj.problema || '');
    setObjetivosStr(proj.objetivos?.join('\n') || '');
    setTecnologiasStr(proj.tecnologias?.join(', ') || '');
    setLinguagensStr(proj.linguagens?.join(', ') || '');
    setGithubUrl(proj.githubUrl || '');
    setDemoUrl(proj.demoUrl || '');
    setStatus(proj.status || 'em_desenvolvimento');
    setAprendizados(proj.aprendizados || '');
    setDocumentacao(proj.documentacao || '');
    setModalAberto(true);
  };

  const handleSalvarProjeto = (e) => {
    e.preventDefault();
    if (!nome.trim() || !descricao.trim()) return;

    const dataHoje = new Date().toISOString().split('T')[0];
    const techArray = tecnologiasStr.split(',').map(t => t.trim()).filter(Boolean);
    const langArray = linguagensStr.split(',').map(l => l.trim()).filter(Boolean);
    const objArray = objetivosStr.split('\n').map(o => o.trim()).filter(Boolean);

    if (projetoEditando) {
      const atualizados = projetos.map(p => p.id === projetoEditando.id ? {
        ...p,
        nome: nome.trim(),
        descricao: descricao.trim(),
        problema: problema.trim() || undefined,
        objetivos: objArray,
        tecnologias: techArray,
        linguagens: langArray,
        githubUrl: githubUrl.trim() || undefined,
        demoUrl: demoUrl.trim() || undefined,
        status,
        aprendizados: aprendizados.trim() || undefined,
        documentacao: documentacao.trim() || undefined
      } : p);
      setProjetos(atualizados);
    } else {
      const novo = {
        id: `proj_${Date.now()}`,
        nome: nome.trim(),
        descricao: descricao.trim(),
        problema: problema.trim() || undefined,
        objetivos: objArray,
        tecnologias: techArray,
        linguagens: langArray,
        githubUrl: githubUrl.trim() || undefined,
        demoUrl: demoUrl.trim() || undefined,
        status,
        dataInicio: dataHoje,
        aprendizados: aprendizados.trim() || undefined,
        documentacao: documentacao.trim() || undefined,
        screenshots: []
      };
      setProjetos([novo, ...projetos]);
    }

    setModalAberto(false);
  };

  const handleExcluirProjeto = (id) => {
    if (!window.confirm('Deseja excluir este projeto do portfólio?')) return;
    setProjetos(projetos.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl pb-16">
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

        <button
          onClick={handleAbrirCriar}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors shrink-0 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Projeto</span>
        </button>
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
          actionLabel="Cadastrar Projeto"
          onAction={handleAbrirCriar}
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
                    <div className="flex items-center gap-2">
                      {proj.dataInicio && (
                        <span className="text-[11px] text-slate-400">
                          {proj.dataInicio}
                        </span>
                      )}
                      <button
                        onClick={() => handleAbrirEditar(proj)}
                        className="p-1 text-slate-400 hover:text-indigo-600"
                        title="Editar projeto"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleExcluirProjeto(proj.id)}
                        className="p-1 text-slate-400 hover:text-rose-500"
                        title="Excluir projeto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
                        className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-1 text-xs"
                      >
                        <Github className="w-4 h-4" />
                        <span>GitHub</span>
                      </a>
                    )}
                    {proj.demoUrl && (
                      <a
                        href={proj.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 text-xs font-semibold"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Demo</span>
                      </a>
                    )}
                  </div>

                  <Link
                    to={`/projetos/${proj.id}`}
                    className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1"
                  >
                    <span>Ver detalhes</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL CADASTRAR / EDITAR PROJETO */}
      {modalAberto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
        >
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              {projetoEditando ? 'Editar Projeto' : 'Cadastrar Novo Projeto'}
            </h3>

            <form onSubmit={handleSalvarProjeto} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Nome do projeto:</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  placeholder="Ex: Plataforma de Estudos ADS"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Descrição geral:</label>
                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  required
                  rows={2}
                  placeholder="Resumo dos objetivos e propósito da aplicação..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Status:</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  >
                    <option value="em_desenvolvimento">Em Desenvolvimento</option>
                    <option value="concluido">Concluído</option>
                    <option value="planejado">Planejado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Tecnologias (vírgulas):</label>
                  <input
                    type="text"
                    value={tecnologiasStr}
                    onChange={(e) => setTecnologiasStr(e.target.value)}
                    placeholder="React, Vite, Tailwind CSS"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Repositório GitHub (URL):</label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Demo / Publicação (URL):</label>
                  <input
                    type="url"
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    placeholder="https://...github.io/..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Problema que o projeto resolve:</label>
                <textarea
                  value={problema}
                  onChange={(e) => setProblema(e.target.value)}
                  rows={2}
                  placeholder="Dificuldade ou oportunidade prática identificada..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Objetivos (um por linha):</label>
                <textarea
                  value={objetivosStr}
                  onChange={(e) => setObjetivosStr(e.target.value)}
                  rows={2}
                  placeholder="Centralizar anotações&#10;Criar rotina de revisão"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Aprendizados Técnicos:</label>
                <textarea
                  value={aprendizados}
                  onChange={(e) => setAprendizados(e.target.value)}
                  rows={2}
                  placeholder="O que foi aprendido durante o desenvolvimento..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                >
                  {projetoEditando ? 'Salvar Alterações' : 'Cadastrar Projeto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
