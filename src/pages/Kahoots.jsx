import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStudy, getTodayString } from '../context/StudyContext';
import {
  HelpCircle,
  Search,
  Filter,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Upload,
  CheckCircle2,
  Clock,
  Sparkles,
  FileSpreadsheet,
  AlertCircle,
  Plus,
  Trash2,
  Calendar,
  Layers
} from 'lucide-react';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';

export default function Kahoots() {
  const {
    kahoots,
    disciplinas,
    modulos,
    addKahoot,
    updateKahoot,
    getKahootAttempts,
    spacedReviews
  } = useStudy();

  const [busca, setBusca] = useState('');
  const [filtroDisciplina, setFiltroDisciplina] = useState('todas');
  const [filtroStatus, setFiltroStatus] = useState('todos');

  // Estados do Modal de Importação
  const [modalImportarAberto, setModalImportarAberto] = useState(false);
  const [etapaImportacao, setEtapaImportacao] = useState('input'); // 'input' | 'preview'
  const [textoImportacao, setTextoImportacao] = useState('');
  const [formatoDetectado, setFormatoDetectado] = useState('csv');
  const [questoesPrevia, setQuestoesPrevia] = useState([]);
  const [disciplinaDestino, setDisciplinaDestino] = useState(disciplinas[0]?.id || '');
  const [moduloDestino, setModuloDestino] = useState('');
  const [modoDestino, setModoDestino] = useState('novo'); // 'novo' | 'existente'
  const [kahootDestinoId, setKahootDestinoId] = useState('');
  const [novoTitulo, setNovoTitulo] = useState('');
  const [novoLink, setNovoLink] = useState('');
  const [erroImportacao, setErroImportacao] = useState('');
  const [sucessoImportacao, setSucessoImportacao] = useState('');

  // Filtros
  const kahootsFiltrados = kahoots.filter(k => {
    const q = busca.toLowerCase();
    const matchBusca = k.titulo.toLowerCase().includes(q) ||
                       k.descricao?.toLowerCase().includes(q) ||
                       k.questoes?.some(qu => qu.pergunta.toLowerCase().includes(q));
    const matchDisc = filtroDisciplina === 'todas' || k.disciplinaId === filtroDisciplina;

    const tentativas = getKahootAttempts(k.id);
    let matchStatus = true;
    if (filtroStatus === 'realizados') {
      matchStatus = tentativas.length > 0;
    } else if (filtroStatus === 'pendentes') {
      matchStatus = tentativas.length === 0;
    } else if (filtroStatus === 'revisao_hoje') {
      const rev = spacedReviews[k.id];
      matchStatus = rev && rev.nextReviewDate <= getTodayString();
    }

    return matchBusca && matchDisc && matchStatus;
  });

  // Módulos da disciplina selecionada no modal
  const modulosDaDisciplina = modulos.filter(m => m.disciplinaId === disciplinaDestino);

  // Parser para pré-visualização
  const handleProcessarPrevia = () => {
    setErroImportacao('');
    if (!textoImportacao.trim()) {
      setErroImportacao('Cole o conteúdo CSV ou JSON para processar a prévia.');
      return;
    }

    try {
      const trimmed = textoImportacao.trim();

      // Caso 1: JSON
      if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        setFormatoDetectado('json');
        const parsed = JSON.parse(trimmed);
        let items = [];

        if (Array.isArray(parsed)) {
          // Pode ser array de questões ou array de kahoots
          if (parsed[0]?.pergunta) {
            items = parsed;
          } else if (parsed[0]?.questoes) {
            items = parsed.flatMap(k => k.questoes || []);
          }
        } else if (parsed.questoes) {
          items = parsed.questoes;
        }

        if (items.length === 0) {
          throw new Error('Nenhuma questão válida encontrada no JSON informado.');
        }

        const previa = items.map((it, idx) => ({
          id: `q_pre_${idx + 1}`,
          pergunta: it.pergunta || it.question || 'Sem pergunta',
          respostaCorreta: it.respostaCorreta || it.answer || it.correctAnswer || 'Sem resposta',
          explicacao: it.explicacao || it.explanation || ''
        }));

        setQuestoesPrevia(previa);
        setEtapaImportacao('preview');
        return;
      }

      // Caso 2: CSV
      setFormatoDetectado('csv');
      const linhas = trimmed.split('\n').map(l => l.trim()).filter(Boolean);
      if (linhas.length < 2) {
        throw new Error('O CSV deve conter ao menos a linha de cabeçalho e uma linha de dados.');
      }

      // Detecta separador (, ou ;)
      const primeiraLinha = linhas[0];
      const sep = primeiraLinha.includes(';') ? ';' : ',';

      const cabecalhos = primeiraLinha.split(sep).map(h => h.trim().toLowerCase());
      const idxPergunta = cabecalhos.findIndex(h => h.includes('pergunta') || h.includes('question'));
      const idxResposta = cabecalhos.findIndex(h => h.includes('resposta') || h.includes('answer') || h.includes('corret'));
      const idxExplicacao = cabecalhos.findIndex(h => h.includes('explica') || h.includes('justificativa') || h.includes('exp'));

      const parsedQuestoes = [];
      for (let i = 1; i < linhas.length; i++) {
        const partes = linhas[i].split(sep).map(p => p.trim());
        const perg = idxPergunta !== -1 ? partes[idxPergunta] : partes[0];
        const resp = idxResposta !== -1 ? partes[idxResposta] : partes[1];
        const expl = idxExplicacao !== -1 ? partes[idxExplicacao] : partes[2] || '';

        if (perg && resp) {
          parsedQuestoes.push({
            id: `q_csv_${Date.now()}_${i}`,
            pergunta: perg.replace(/^"|"$/g, ''),
            respostaCorreta: resp.replace(/^"|"$/g, ''),
            explicacao: expl.replace(/^"|"$/g, '')
          });
        }
      }

      if (parsedQuestoes.length === 0) {
        throw new Error('Não foi possível identificar colunas válidas no CSV. Use: Pergunta;RespostaCorreta;Explicacao');
      }

      setQuestoesPrevia(parsedQuestoes);
      setEtapaImportacao('preview');
    } catch (err) {
      setErroImportacao(`Falha ao ler dados: ${err.message}`);
    }
  };

  // Confirmar Importação
  const handleConfirmarImportacao = () => {
    if (!disciplinaDestino) {
      setErroImportacao('Selecione a disciplina de destino obrigatoriamente.');
      return;
    }

    if (modoDestino === 'novo') {
      const tituloFinal = novoTitulo.trim() || `Kahoot Importado (${new Date().toLocaleDateString('pt-BR')})`;
      const novoK = {
        id: `kahoot_${Date.now()}`,
        titulo: tituloFinal,
        disciplinaId: disciplinaDestino,
        moduloId: moduloDestino || '',
        descricao: `Quiz com ${questoesPrevia.length} questões importadas.`,
        urlKahoot: novoLink.trim() || '',
        dataCriacao: getTodayString(),
        statusRevisao: 'pendente',
        resumoTeorico: 'Resumo teórico a ser completado para este quiz.',
        conceitosCobrados: ['Conceitos gerais'],
        exemplosExplicativos: [],
        errosComuns: [],
        questoes: questoesPrevia,
        anotacoesPessoais: ''
      };
      addKahoot(novoK);
      setSucessoImportacao(`Kahoot "${tituloFinal}" criado com ${questoesPrevia.length} questões!`);
    } else {
      // Adiciona questões ao Kahoot existente
      const existente = kahoots.find(k => k.id === kahootDestinoId);
      if (!existente) {
        setErroImportacao('Selecione um Kahoot de destino válido.');
        return;
      }
      const questoesAtualizadas = [...(existente.questoes || []), ...questoesPrevia];
      updateKahoot(existente.id, { questoes: questoesAtualizadas });
      setSucessoImportacao(`${questoesPrevia.length} questão(ões) adicionada(s) ao Kahoot "${existente.titulo}"!`);
    }

    setTimeout(() => {
      setModalImportarAberto(false);
      setEtapaImportacao('input');
      setTextoImportacao('');
      setQuestoesPrevia([]);
      setSucessoImportacao('');
      setNovoTitulo('');
      setNovoLink('');
    }, 1800);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>Central de Fixação e Quizzes</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Central de Kahoots
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Estude os resumos e as pegadinhas antes de responder às perguntas, registre seus resultados e acompanhe sua evolução.
          </p>
        </div>

        <button
          onClick={() => { setModalImportarAberto(true); setEtapaImportacao('input'); setErroImportacao(''); }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition-colors shrink-0 shadow-xs cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Importar Questões (CSV / JSON)</span>
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
            placeholder="Buscar por nome do quiz, matéria ou pergunta..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-amber-500 transition-colors shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filtroDisciplina}
            onChange={(e) => setFiltroDisciplina(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 outline-none focus:border-amber-500 shadow-2xs"
          >
            <option value="todas">Todas as Disciplinas</option>
            {disciplinas.map(d => (
              <option key={d.id} value={d.id}>{d.nome}</option>
            ))}
          </select>

          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 outline-none focus:border-amber-500 shadow-2xs"
          >
            <option value="todos">Todos os Status</option>
            <option value="realizados">Com Tentativas Feitas</option>
            <option value="pendentes">Nunca Realizados</option>
            <option value="revisao_hoje">Revisão para Hoje</option>
          </select>
        </div>
      </div>

      {/* Lista de Kahoots */}
      {kahootsFiltrados.length === 0 ? (
        <EmptyState
          title="Nenhum Kahoot encontrado"
          description="Ajuste os filtros de busca ou utilize o botão de importação acima para cadastrar suas perguntas."
          actionLabel="Limpar busca"
          onAction={() => { setBusca(''); setFiltroDisciplina('todas'); setFiltroStatus('todos'); }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {kahootsFiltrados.map((kahoot) => {
            const disc = disciplinas.find(d => d.id === kahoot.disciplinaId);
            const mod = modulos.find(m => m.id === kahoot.moduloId);
            const tentativas = getKahootAttempts(kahoot.id);
            const ultimaTentativa = tentativas[0] || null;
            const rev = spacedReviews[kahoot.id] || null;

            return (
              <div
                key={kahoot.id}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:border-amber-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 truncate">
                      {disc?.nome}
                    </span>
                    <Badge variant={tentativas.length > 0 ? 'success' : 'default'} size="xs">
                      {kahoot.questoes?.length || 0} Questões
                    </Badge>
                  </div>

                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {kahoot.titulo}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {kahoot.descricao}
                  </p>

                  {mod && (
                    <div className="mt-3 text-[11px] text-slate-400 truncate">
                      Módulo: <span className="text-slate-600 dark:text-slate-300 font-medium">{mod.titulo}</span>
                    </div>
                  )}

                  {/* Resumo de Desempenho do Aluno */}
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between">
                    {ultimaTentativa ? (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-[11px]">Última nota:</span>
                        <span className={`font-bold ${
                          ultimaTentativa.percentual >= 80 ? 'text-emerald-600 dark:text-emerald-400' :
                          ultimaTentativa.percentual >= 60 ? 'text-amber-600 dark:text-amber-400' :
                          'text-rose-600 dark:text-rose-400'
                        }`}>
                          {ultimaTentativa.percentual}%
                        </span>
                        <span className="text-[10px] text-slate-400">({tentativas.length}x)</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Nenhuma tentativa ainda</span>
                    )}

                    {rev?.nextReviewDate && (
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Rev.: {rev.nextReviewDate}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <Link
                    to={`/kahoots/${kahoot.id}`}
                    className="w-full py-2 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-600 hover:text-white dark:hover:bg-amber-600 text-amber-800 dark:text-amber-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Estudar & Abrir Kahoot</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Avançado de Importação de Questões */}
      {modalImportarAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Upload className="w-4 h-4 text-amber-600" />
                Importar Questões (CSV ou JSON)
              </h3>
              <button
                onClick={() => setModalImportarAberto(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            {etapaImportacao === 'input' ? (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <p><strong>Formatos aceitos com detecção automática:</strong></p>
                  <p>• <strong>CSV</strong> com separador <code>;</code> ou <code>,</code>: <code>Pergunta;RespostaCorreta;Explicacao</code></p>
                  <p>• <strong>JSON</strong> estruturado: array contendo objetos com <code>pergunta</code> e <code>respostaCorreta</code>.</p>
                </div>

                {/* Seletores de Destino (Obrigatório escolher disciplina e módulo) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Disciplina de Destino *
                    </label>
                    <select
                      value={disciplinaDestino}
                      onChange={(e) => setDisciplinaDestino(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none"
                    >
                      {disciplinas.map(d => (
                        <option key={d.id} value={d.id}>{d.nome}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Módulo Associado (opcional)
                    </label>
                    <select
                      value={moduloDestino}
                      onChange={(e) => setModuloDestino(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none"
                    >
                      <option value="">Sem módulo específico</option>
                      {modulosDaDisciplina.map(m => (
                        <option key={m.id} value={m.id}>{m.titulo}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Modo de Destino */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    O que fazer com as questões importadas?
                  </label>
                  <div className="flex gap-4 text-xs">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="modoDestino"
                        value="novo"
                        checked={modoDestino === 'novo'}
                        onChange={() => setModoDestino('novo')}
                      />
                      <span>Criar um Novo Kahoot</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="modoDestino"
                        value="existente"
                        checked={modoDestino === 'existente'}
                        onChange={() => setModoDestino('existente')}
                      />
                      <span>Adicionar a um Kahoot Existente</span>
                    </label>
                  </div>
                </div>

                {modoDestino === 'novo' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Título do Novo Quiz
                      </label>
                      <input
                        type="text"
                        value={novoTitulo}
                        onChange={(e) => setNovoTitulo(e.target.value)}
                        placeholder="Ex: Kahoot - Revisão de Prova A1"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Link Original do Kahoot (opcional)
                      </label>
                      <input
                        type="url"
                        value={novoLink}
                        onChange={(e) => setNovoLink(e.target.value)}
                        placeholder="https://create.kahoot.it/..."
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Selecione o Kahoot de Destino
                    </label>
                    <select
                      value={kahootDestinoId}
                      onChange={(e) => setKahootDestinoId(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none"
                    >
                      <option value="">Selecione...</option>
                      {kahoots.filter(k => k.disciplinaId === disciplinaDestino).map(k => (
                        <option key={k.id} value={k.id}>{k.titulo}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Área de texto para colar os dados */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Conteúdo CSV ou JSON
                  </label>
                  <textarea
                    value={textoImportacao}
                    onChange={(e) => setTextoImportacao(e.target.value)}
                    placeholder="Cole aqui o texto exportado ou CSV..."
                    rows={6}
                    className="w-full p-3 font-mono text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                {erroImportacao && (
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold">{erroImportacao}</p>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setModalImportarAberto(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleProcessarPrevia}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <span>Ver Pré-visualização</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              /* ETAPA 2: PRÉ-VISUALIZAÇÃO ANTES DE SALVAR */
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {questoesPrevia.length} questão(ões) identificada(s) ({formatoDetectado.toUpperCase()})
                  </span>
                  <button
                    onClick={() => setEtapaImportacao('input')}
                    className="text-amber-600 hover:underline font-semibold"
                  >
                    Voltar e editar texto
                  </button>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2 border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50/50 dark:bg-slate-800/40">
                  {questoesPrevia.map((q, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1">
                      <div className="font-semibold text-slate-800 dark:text-slate-100">
                        {idx + 1}. {q.pergunta}
                      </div>
                      <div className="text-emerald-600 dark:text-emerald-400 font-medium">
                        ✓ {q.respostaCorreta}
                      </div>
                      {q.explicacao && (
                        <div className="text-[11px] text-slate-400 italic">
                          {q.explicacao}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {erroImportacao && (
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold">{erroImportacao}</p>
                )}
                {sucessoImportacao && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    {sucessoImportacao}
                  </p>
                )}

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setEtapaImportacao('input')}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirmarImportacao}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirmar e Salvar no Sistema</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
