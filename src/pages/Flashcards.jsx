import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import {
  BrainCircuit,
  Search,
  Filter,
  Star,
  Plus,
  Trash2,
  Sparkles,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
  BookOpen,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import { SM2_GRADES } from '../services/sm2Service';

export default function Flashcards() {
  const {
    flashcards,
    disciplinas,
    modulos,
    kahoots,
    addFlashcard,
    updateFlashcard,
    deleteFlashcard,
    toggleFlashcardFavorite,
    importFromKahoot,
    importFromModulo,
    recordSM2Review,
    spacedReviews
  } = useStudy();

  const [modoVisao, setModoVisao] = useState('estudo'); // 'estudo' | 'gerenciador'
  const [busca, setBusca] = useState('');
  const [filtroDisciplina, setFiltroDisciplina] = useState('todas');
  const [apenasFavoritos, setApenasFavoritos] = useState(false);

  // Estados do Modo de Estudo
  const [indiceEstudo, setIndiceEstudo] = useState(0);
  const [revelado, setRevelado] = useState(false);

  // Estados do Modal de Criação Manual
  const [modalNovo, setModalNovo] = useState(false);
  const [frenteInput, setFrenteInput] = useState('');
  const [versoInput, setVersoInput] = useState('');
  const [discDestino, setDiscDestino] = useState(disciplinas[0]?.id || '');
  const [modDestino, setModDestino] = useState('');
  const [assuntoInput, setAssuntoInput] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  // Notificação rápida
  const [aviso, setAviso] = useState('');

  // Filtragem dos flashcards
  const cartoesFiltrados = (flashcards || []).filter(c => {
    const q = busca.toLowerCase();
    const matchBusca = c.frente.toLowerCase().includes(q) ||
                       c.verso.toLowerCase().includes(q) ||
                       c.assunto?.toLowerCase().includes(q) ||
                       c.tags?.some(t => t.toLowerCase().includes(q));
    const matchDisc = filtroDisciplina === 'todas' || c.disciplinaId === filtroDisciplina;
    const matchFav = !apenasFavoritos || c.favorito;
    return matchBusca && matchDisc && matchFav;
  });

  const cartaoAtual = cartoesFiltrados[indiceEstudo] || null;
  const modulosDaDisc = modulos.filter(m => m.disciplinaId === discDestino);

  const handleProximoCartao = () => {
    setRevelado(false);
    if (indiceEstudo < cartoesFiltrados.length - 1) {
      setIndiceEstudo(prev => prev + 1);
    } else {
      setIndiceEstudo(0);
    }
  };

  const handleAnteriorCartao = () => {
    setRevelado(false);
    if (indiceEstudo > 0) {
      setIndiceEstudo(prev => prev - 1);
    } else {
      setIndiceEstudo(cartoesFiltrados.length - 1);
    }
  };

  const handleAvaliarSM2 = (grade) => {
    if (!cartaoAtual) return;

    recordSM2Review(cartaoAtual.id, 'flashcard', grade, {
      titulo: cartaoAtual.frente,
      disciplinaId: cartaoAtual.disciplinaId,
      moduloId: cartaoAtual.moduloId
    });

    handleProximoCartao();
  };

  const handleSalvarNovo = (e) => {
    e.preventDefault();
    if (!frenteInput.trim() || !versoInput.trim() || !discDestino) return;

    addFlashcard({
      frente: frenteInput.trim(),
      verso: versoInput.trim(),
      disciplinaId: discDestino,
      moduloId: modDestino || undefined,
      assunto: assuntoInput.trim() || undefined,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean)
    });

    setModalNovo(false);
    setFrenteInput('');
    setVersoInput('');
    setAssuntoInput('');
    setTagsInput('');
    setAviso('Flashcard criado com sucesso!');
    setTimeout(() => setAviso(''), 3000);
  };

  const handleGerarDeKahoots = () => {
    let total = 0;
    kahoots.forEach(k => {
      total += importFromKahoot(k);
    });
    setAviso(`${total} novo(s) flashcard(s) importados dos seus Kahoots!`);
    setTimeout(() => setAviso(''), 4000);
  };

  const handleGerarDeModulos = () => {
    let total = 0;
    modulos.forEach(m => {
      total += importFromModulo(m);
    });
    setAviso(`${total} novo(s) flashcard(s) gerados a partir dos termos dos módulos!`);
    setTimeout(() => setAviso(''), 4000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl pb-16">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <BrainCircuit className="w-4 h-4" />
            <span>Memorização Ativa e Repetição Espaçada</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Central de Flashcards
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Revise conceitos-chave, termos técnicos e perguntas de provas com retenção rápida baseada no SM-2.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setModoVisao(modoVisao === 'estudo' ? 'gerenciador' : 'estudo')}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            {modoVisao === 'estudo' ? 'Ver Todos em Lista' : 'Modo de Estudo'}
          </button>

          <button
            onClick={() => setModalNovo(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Flashcard</span>
          </button>
        </div>
      </div>

      {aviso && (
        <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-xs text-purple-800 dark:text-purple-200 font-semibold flex items-center gap-2 animate-fade-in">
          <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
          <span>{aviso}</span>
        </div>
      )}

      {/* Ações Rápidas de Importação */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs">
        <span className="text-slate-500 dark:text-slate-400">
          Automação de Conteúdo: crie cartões a partir dos materiais já cadastrados:
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleGerarDeKahoots}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 font-medium hover:bg-amber-100 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Importar de Kahoots</span>
          </button>
          <button
            onClick={handleGerarDeModulos}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 font-medium hover:bg-sky-100 transition-colors cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Importar de Módulos</span>
          </button>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={busca}
            onChange={(e) => { setBusca(e.target.value); setIndiceEstudo(0); }}
            placeholder="Buscar flashcard por pergunta, conceito ou tag..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filtroDisciplina}
            onChange={(e) => { setFiltroDisciplina(e.target.value); setIndiceEstudo(0); }}
            className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 outline-none focus:border-purple-500"
          >
            <option value="todas">Todas as Disciplinas</option>
            {disciplinas.map(d => (
              <option key={d.id} value={d.id}>{d.nome}</option>
            ))}
          </select>

          <button
            onClick={() => { setApenasFavoritos(!apenasFavoritos); setIndiceEstudo(0); }}
            className={`p-2 rounded-xl border transition-colors ${
              apenasFavoritos
                ? 'bg-amber-50 border-amber-300 text-amber-600'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
            }`}
            title="Apenas favoritos"
          >
            <Star className={`w-4 h-4 ${apenasFavoritos ? 'fill-amber-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* MODO 1: ESTUDO INTERATIVO (FLIP CARD) */}
      {modoVisao === 'estudo' && (
        <div className="space-y-6">
          {cartoesFiltrados.length === 0 ? (
            <EmptyState
              title="Nenhum flashcard disponível para este filtro"
              description="Crie flashcards manualmente ou use os botões de importação rápida acima para popular sua central."
              actionLabel="Criar Flashcard"
              onAction={() => setModalNovo(true)}
            />
          ) : (
            <div className="max-w-xl mx-auto space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
                <span>Cartão <strong>{indiceEstudo + 1}</strong> de <strong>{cartoesFiltrados.length}</strong></span>
                <span className="capitalize">{cartaoAtual.origem ? `Origem: ${cartaoAtual.origem}` : ''}</span>
              </div>

              {/* CARD INTERATIVO COM FLIP */}
              <div
                onClick={() => setRevelado(!revelado)}
                className={`min-h-[260px] p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 transition-all duration-300 shadow-lg cursor-pointer flex flex-col justify-between select-none ${
                  revelado
                    ? 'border-purple-500/80 bg-purple-50/20 dark:bg-purple-950/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-purple-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <Badge variant={revelado ? 'success' : 'primary'} size="xs">
                      {revelado ? 'Verso (Resposta)' : 'Frente (Pergunta)'}
                    </Badge>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFlashcardFavorite(cartaoAtual.id);
                      }}
                      className="p-1 text-slate-400 hover:text-amber-500"
                    >
                      <Star className={`w-4 h-4 ${cartaoAtual.favorito ? 'fill-amber-500 text-amber-500' : ''}`} />
                    </button>
                  </div>

                  <div className="py-2">
                    {revelado ? (
                      <div className="space-y-3 animate-fade-in">
                        <div className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-wrap">
                          {cartaoAtual.verso}
                        </div>
                      </div>
                    ) : (
                      <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-50 leading-relaxed">
                        {cartaoAtual.frente}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    {revelado ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    {revelado ? 'Clique para ocultar resposta' : 'Clique no cartão para revelar a resposta'}
                  </span>
                </div>
              </div>

              {/* BOTÕES DE CLASSIFICAÇÃO SM-2 APÓS REVELAR */}
              {revelado ? (
                <div className="space-y-2 animate-fade-in">
                  <span className="text-[11px] font-semibold text-slate-400 text-center block">
                    Como foi recordar esta resposta?
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      onClick={() => handleAvaliarSM2(SM2_GRADES.AGAIN)}
                      className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 border border-rose-200 text-rose-700 dark:text-rose-300 font-semibold text-xs text-center cursor-pointer"
                    >
                      Novamente
                    </button>
                    <button
                      onClick={() => handleAvaliarSM2(SM2_GRADES.HARD)}
                      className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 border border-amber-200 text-amber-700 dark:text-amber-300 font-semibold text-xs text-center cursor-pointer"
                    >
                      Difícil
                    </button>
                    <button
                      onClick={() => handleAvaliarSM2(SM2_GRADES.GOOD)}
                      className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 dark:text-indigo-300 font-semibold text-xs text-center cursor-pointer"
                    >
                      Bom
                    </button>
                    <button
                      onClick={() => handleAvaliarSM2(SM2_GRADES.EASY)}
                      className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 dark:text-emerald-300 font-semibold text-xs text-center cursor-pointer"
                    >
                      Fácil
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    onClick={handleAnteriorCartao}
                    className="flex-1 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Anterior</span>
                  </button>
                  <button
                    onClick={() => setRevelado(true)}
                    className="flex-1 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Mostrar Resposta</span>
                  </button>
                  <button
                    onClick={handleProximoCartao}
                    className="flex-1 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Próximo</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* MODO 2: GERENCIADOR / LISTA DE CARDS */}
      {modoVisao === 'gerenciador' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{cartoesFiltrados.length} flashcard(s) encontrado(s)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cartoesFiltrados.map((c) => {
              const disc = disciplinas.find(d => d.id === c.disciplinaId);
              const rev = spacedReviews[c.id];

              return (
                <div
                  key={c.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase">
                        {disc?.nome}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleFlashcardFavorite(c.id)}
                          className="p-1 text-slate-400 hover:text-amber-500"
                        >
                          <Star className={`w-3.5 h-3.5 ${c.favorito ? 'fill-amber-500 text-amber-500' : ''}`} />
                        </button>
                        <button
                          onClick={() => deleteFlashcard(c.id)}
                          className="p-1 text-slate-400 hover:text-rose-500"
                          title="Excluir flashcard"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                      {c.frente}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 line-clamp-3">
                      {c.verso}
                    </p>
                  </div>

                  <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Repetições SM-2: <strong>{rev?.repetitions || 0}</strong></span>
                    {rev?.nextReviewDate && <span>Próx. revisão: {rev.nextReviewDate}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL CRIAR FLASHCARD */}
      {modalNovo && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
        >
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Cadastrar Novo Flashcard
            </h3>

            <form onSubmit={handleSalvarNovo} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">
                  Pergunta ou Termo (Frente do Cartão):
                </label>
                <textarea
                  value={frenteInput}
                  onChange={(e) => setFrenteInput(e.target.value)}
                  required
                  rows={2}
                  placeholder="Ex: O que é o algoritmo SM-2?"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">
                  Resposta ou Conceito (Verso do Cartão):
                </label>
                <textarea
                  value={versoInput}
                  onChange={(e) => setVersoInput(e.target.value)}
                  required
                  rows={3}
                  placeholder="Ex: É um algoritmo de repetição espaçada que calcula intervalos crescentes..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Disciplina:</label>
                  <select
                    value={discDestino}
                    onChange={(e) => setDiscDestino(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-purple-500"
                  >
                    {disciplinas.map(d => (
                      <option key={d.id} value={d.id}>{d.nome}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Módulo (opcional):</label>
                  <select
                    value={modDestino}
                    onChange={(e) => setModDestino(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-purple-500"
                  >
                    <option value="">Nenhum</option>
                    {modulosDaDisc.map(m => (
                      <option key={m.id} value={m.id}>{m.titulo}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalNovo(false)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold"
                >
                  Salvar Cartão
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
