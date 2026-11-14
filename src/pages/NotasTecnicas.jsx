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
  Check,
  Star,
  Edit2,
  Terminal,
  Code2
} from 'lucide-react';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import CodeBlock from '../components/common/CodeBlock';

const CATEGORIAS_ESPECIFICACAO = [
  'Todas',
  'Python',
  'Java',
  'JavaScript',
  'HTML',
  'CSS',
  'SQL',
  'Banco de Dados',
  'Git e GitHub',
  'Inteligência Artificial',
  'Engenharia de Prompt',
  'Cibersegurança',
  'Redes de Computadores',
  'Estrutura de Dados',
  'Desenvolvimento de Software'
];

export default function NotasTecnicas() {
  const { notas, setNotas, disciplinas, projetos, favorites, toggleFavorite, isFavorite } = useStudy();

  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todas');
  const [apenasFavoritas, setApenasFavoritas] = useState(false);

  // Estados dos Modais
  const [modalNovaNota, setModalNovaNota] = useState(false);
  const [notaEditando, setNotaEditando] = useState(null);

  // Form de nota
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('JavaScript');
  const [conteudo, setConteudo] = useState('');
  const [blocoCodigo, setBlocoCodigo] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [discRelacionada, setDiscRelacionada] = useState('');

  // Copiar código
  const [copiadoId, setCopiadoId] = useState(null);

  const notasFiltradas = notas.filter(n => {
    const q = busca.toLowerCase();
    const matchBusca = n.titulo.toLowerCase().includes(q) ||
                       n.conteudo.toLowerCase().includes(q) ||
                       (n.blocoCodigo && n.blocoCodigo.toLowerCase().includes(q)) ||
                       n.tags?.some(t => t.toLowerCase().includes(q));
    const matchCat = categoriaAtiva === 'Todas' || n.categoria === categoriaAtiva;
    const matchFav = !apenasFavoritas || isFavorite(n.id);
    return matchBusca && matchCat && matchFav;
  });

  const handleAbrirCriar = () => {
    setNotaEditando(null);
    setTitulo('');
    setCategoria('JavaScript');
    setConteudo('');
    setBlocoCodigo('');
    setTagsInput('');
    setDiscRelacionada('');
    setModalNovaNota(true);
  };

  const handleAbrirEditar = (nota) => {
    setNotaEditando(nota);
    setTitulo(nota.titulo);
    setCategoria(nota.categoria);
    setConteudo(nota.conteudo);
    setBlocoCodigo(nota.blocoCodigo || '');
    setTagsInput(nota.tags?.join(', ') || '');
    setDiscRelacionada(nota.disciplinaRelacionada || '');
    setModalNovaNota(true);
  };

  const handleSalvarNota = (e) => {
    e.preventDefault();
    if (!titulo.trim() || !conteudo.trim()) return;

    const dataAtual = new Date().toISOString().split('T')[0];

    if (notaEditando) {
      // Edição
      const atualizadas = notas.map(n => n.id === notaEditando.id ? {
        ...n,
        titulo: titulo.trim(),
        categoria,
        conteudo: conteudo.trim(),
        blocoCodigo: blocoCodigo.trim() || undefined,
        tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
        disciplinaRelacionada: discRelacionada || undefined,
        dataAtualizacao: dataAtual
      } : n);
      setNotas(atualizadas);
    } else {
      // Criação
      const nova = {
        id: `nota_${Date.now()}`,
        titulo: titulo.trim(),
        categoria,
        conteudo: conteudo.trim(),
        blocoCodigo: blocoCodigo.trim() || undefined,
        tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
        disciplinaRelacionada: discRelacionada || undefined,
        dataCriacao: dataAtual,
        dataAtualizacao: dataAtual
      };
      setNotas([nova, ...notas]);
    }

    setModalNovaNota(false);
  };

  const handleExcluirNota = (id) => {
    if (!window.confirm('Deseja excluir esta anotação técnica?')) return;
    setNotas(notas.filter(n => n.id !== id));
  };

  const handleCopiarTexto = async (id, texto) => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiadoId(id);
      setTimeout(() => setCopiadoId(null), 2000);
    } catch (e) {
      console.warn('Erro ao copiar nota:', e);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl pb-16">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <FileCode className="w-4 h-4" />
            <span>Central de Conhecimento Técnico</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Caderno de Anotações Técnicas
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Comandos de terminal, snippets, referências sintáticas e macetes organizados por stack tecnológica.
          </p>
        </div>

        <button
          onClick={handleAbrirCriar}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-colors shrink-0 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Nova Anotação</span>
        </button>
      </div>

      {/* Barra de Categorias da Especificação */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIAS_ESPECIFICACAO.map(cat => (
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

      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por comando, código ou tag..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:border-sky-500"
          />
        </div>

        <button
          onClick={() => setApenasFavoritas(!apenasFavoritas)}
          className={`px-3 py-2 text-xs font-medium rounded-xl border flex items-center gap-1.5 transition-colors ${
            apenasFavoritas
              ? 'bg-amber-50 border-amber-300 text-amber-600'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${apenasFavoritas ? 'fill-amber-500 text-amber-500' : ''}`} />
          <span>Favoritas</span>
        </button>
      </div>

      {/* Lista de Notas Técnicas */}
      {notasFiltradas.length === 0 ? (
        <EmptyState
          title="Nenhuma anotação técnica encontrada"
          description="Nenhuma nota corresponde aos filtros ou à categoria selecionada."
          actionLabel="Criar Nota Técnica"
          onAction={handleAbrirCriar}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notasFiltradas.map((n) => {
            const disc = disciplinas.find(d => d.id === n.disciplinaRelacionada);
            const favorito = isFavorite(n.id);

            return (
              <div
                key={n.id}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between group hover:border-sky-200 dark:hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                      {n.categoria}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleFavorite(n.id)}
                        className="p-1 text-slate-400 hover:text-amber-500"
                        title={favorito ? "Remover dos favoritos" : "Favoritar nota"}
                      >
                        <Star className={`w-3.5 h-3.5 ${favorito ? 'fill-amber-500 text-amber-500' : ''}`} />
                      </button>
                      <button
                        onClick={() => handleAbrirEditar(n)}
                        className="p-1 text-slate-400 hover:text-sky-500"
                        title="Editar anotação"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleExcluirNota(n.id)}
                        className="p-1 text-slate-400 hover:text-rose-500"
                        title="Excluir nota"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 mb-2">
                    {n.titulo}
                  </h3>

                  <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {n.conteudo}
                  </div>

                  {/* Bloco de Código com Syntax Highlight */}
                  {n.blocoCodigo && (
                    <div className="mt-3">
                      <CodeBlock code={n.blocoCodigo} language={n.categoria.toLowerCase()} />
                    </div>
                  )}

                  {/* Tags */}
                  {n.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {n.tags.map((t, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Atualizado: {n.dataAtualizacao || n.dataCriacao}</span>
                  <button
                    onClick={() => handleCopiarTexto(n.id, n.blocoCodigo || n.conteudo)}
                    className="inline-flex items-center gap-1 text-slate-500 hover:text-sky-600 font-medium"
                  >
                    {copiadoId === n.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiadoId === n.id ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL CRIAR / EDITAR NOTA TÉCNICA */}
      {modalNovaNota && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
        >
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              {notaEditando ? 'Editar Anotação Técnica' : 'Criar Nova Anotação Técnica'}
            </h3>

            <form onSubmit={handleSalvarNota} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Título da nota:</label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                  placeholder="Ex: Como reverter o último commit no Git"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Categoria:</label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  >
                    {CATEGORIAS_ESPECIFICACAO.filter(c => c !== 'Todas').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Disciplina vinculada (opcional):</label>
                  <select
                    value={discRelacionada}
                    onChange={(e) => setDiscRelacionada(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  >
                    <option value="">Nenhuma</option>
                    {disciplinas.map(d => (
                      <option key={d.id} value={d.id}>{d.nome}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Conteúdo explicativo / Resumo:</label>
                <textarea
                  value={conteudo}
                  onChange={(e) => setConteudo(e.target.value)}
                  required
                  rows={3}
                  placeholder="Explicação do comando, cenário de uso, parâmetros..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Bloco de Código ou Comando (opcional):</label>
                <textarea
                  value={blocoCodigo}
                  onChange={(e) => setBlocoCodigo(e.target.value)}
                  rows={3}
                  placeholder="git reset --soft HEAD~1"
                  className="w-full p-2.5 rounded-xl bg-slate-900 text-slate-100 font-mono border border-slate-700 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Tags (separadas por vírgula):</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Git, Terminal, Desfazer, Commit"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalNovaNota(false)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold"
                >
                  {notaEditando ? 'Salvar Alterações' : 'Salvar Nota'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
