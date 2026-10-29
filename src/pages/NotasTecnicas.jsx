import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import {
  FileCode,
  Search,
  Plus,
  Trash2,
  Tag,
  BookOpen,
  FolderGit2,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';

const CATEGORIAS_PADRAO = [
  'Todas',
  'Python',
  'JavaScript',
  'HTML e CSS',
  'SQL e Bancos de Dados',
  'Git e GitHub',
  'Segurança da Informação',
  'Inteligência Artificial',
  'Engenharia de Prompt',
  'Ferramentas'
];

export default function NotasTecnicas() {
  const { notas, setNotas, disciplinas, projetos } = useStudy();

  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todas');
  const [modalNovaNota, setModalNovaNota] = useState(false);

  // Form de nova nota
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('JavaScript');
  const [conteudo, setConteudo] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [discRelacionada, setDiscRelacionada] = useState('');
  const [projRelacionado, setProjRelacionado] = useState('');

  // Copiar código da nota
  const [copiadoId, setCopiadoId] = useState(null);

  // Categorias presentes dinamicamente
  const todasCategorias = Array.from(new Set([
    ...CATEGORIAS_PADRAO,
    ...notas.map(n => n.categoria).filter(Boolean)
  ]));

  const notasFiltradas = notas.filter(n => {
    const q = busca.toLowerCase();
    const matchBusca = n.titulo.toLowerCase().includes(q) ||
                       n.conteudo.toLowerCase().includes(q) ||
                       n.tags?.some(t => t.toLowerCase().includes(q));
    const matchCat = categoriaAtiva === 'Todas' || n.categoria === categoriaAtiva;
    return matchBusca && matchCat;
  });

  const handleSalvarNota = (e) => {
    e.preventDefault();
    if (!titulo.trim() || !conteudo.trim()) return;

    const nova = {
      id: `nota_${Date.now()}`,
      titulo: titulo.trim(),
      categoria,
      conteudo: conteudo.trim(),
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      disciplinaRelacionada: discRelacionada || undefined,
      projetoRelacionado: projRelacionado || undefined,
      dataCriacao: new Date().toISOString().split('T')[0]
    };

    setNotas([nova, ...notas]);
    setModalNovaNota(false);
    setTitulo('');
    setConteudo('');
    setTagsInput('');
    setDiscRelacionada('');
    setProjRelacionado('');
  };

  const handleExcluirNota = (id) => {
    setNotas(notas.filter(n => n.id !== id));
  };

  const handleCopiarConteudo = async (id, texto) => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiadoId(id);
      setTimeout(() => setCopiadoId(null), 2000);
    } catch (e) {
      console.warn('Erro ao copiar nota:', e);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <FileCode className="w-4 h-4" />
            <span>Base de Conhecimento Rápida</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Caderno de Anotações Técnicas
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Comandos frequentes de terminal, sintaxes essenciais, boas práticas e snippets para consulta instantânea.
          </p>
        </div>

        <button
          onClick={() => setModalNovaNota(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-colors shrink-0 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Nova Anotação</span>
        </button>
      </div>

      {/* Barra de Categorias Dinâmicas (Abas de Scroll) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {todasCategorias.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoriaAtiva(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              categoriaAtiva === cat
                ? 'bg-sky-600 text-white shadow-2xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Busca */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar anotações por título, comando ou tag..."
          className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-sky-500 transition-colors shadow-2xs"
        />
      </div>

      {/* Lista de Notas */}
      {notasFiltradas.length === 0 ? (
        <EmptyState
          title="Nenhuma anotação técnica encontrada"
          description="Crie sua primeira nota rápida sobre Git, JavaScript, Python ou qualquer outra tecnologia estudada."
          actionLabel="Criar Anotação"
          onAction={() => setModalNovaNota(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notasFiltradas.map((nota) => {
            const disc = disciplinas.find(d => d.id === nota.disciplinaRelacionada);
            const proj = projetos.find(p => p.id === nota.projetoRelacionado);

            return (
              <div
                key={nota.id}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant="primary" size="xs">
                      {nota.categoria}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopiarConteudo(nota.id, nota.conteudo)}
                        className="p-1 rounded text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                        title="Copiar texto da nota"
                      >
                        {copiadoId === nota.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleExcluirNota(nota.id)}
                        className="p-1 rounded text-slate-400 hover:text-red-500 transition-colors"
                        title="Excluir anotação"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2">
                    {nota.titulo}
                  </h3>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-mono text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line border border-slate-100 dark:border-slate-800/80">
                    {nota.conteudo}
                  </div>

                  {/* Tags */}
                  {nota.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {nota.tags.map((t, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Vínculos */}
                {(disc || proj) && (
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                    {disc && (
                      <span className="flex items-center gap-1 text-sky-600 dark:text-sky-400">
                        <BookOpen className="w-3 h-3" />
                        {disc.nome}
                      </span>
                    )}
                    {proj && (
                      <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                        <FolderGit2 className="w-3 h-3" />
                        {proj.nome}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Criar Nova Anotação */}
      {modalNovaNota && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-sky-600" />
                Nova Anotação Técnica
              </h3>
              <button
                onClick={() => setModalNovaNota(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSalvarNota} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Título da Anotação
                </label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ex: Como clonar branch específica no Git"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Categoria
                  </label>
                  <input
                    type="text"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    placeholder="Git, Python, IA..."
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-sky-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Tags (separadas por vírgula)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="terminal, branch, comando"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Conteúdo / Snippet
                </label>
                <textarea
                  value={conteudo}
                  onChange={(e) => setConteudo(e.target.value)}
                  rows={4}
                  placeholder="git clone -b nome-da-branch https://..."
                  className="w-full p-3 font-mono text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-sky-500 resize-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalNovaNota(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-colors"
                >
                  Salvar Anotação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
