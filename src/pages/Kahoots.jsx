import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStudy } from '../context/StudyContext';
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
  FileSpreadsheet
} from 'lucide-react';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';

export default function Kahoots() {
  const { kahoots, disciplinas, modulos, setKahoots } = useStudy();

  const [busca, setBusca] = useState('');
  const [filtroDisciplina, setFiltroDisciplina] = useState('todas');
  const [modalImportarAberto, setModalImportarAberto] = useState(false);
  const [textoImportacao, setTextoImportacao] = useState('');
  const [erroImportacao, setErroImportacao] = useState('');
  const [sucessoImportacao, setSucessoImportacao] = useState('');

  // Filtros
  const kahootsFiltrados = kahoots.filter(k => {
    const q = busca.toLowerCase();
    const matchBusca = k.titulo.toLowerCase().includes(q) ||
                       k.descricao.toLowerCase().includes(q) ||
                       k.questoes?.some(qu => qu.pergunta.toLowerCase().includes(q));
    const matchDisc = filtroDisciplina === 'todas' || k.disciplinaId === filtroDisciplina;
    return matchBusca && matchDisc;
  });

  // Importador JSON/CSV simples
  const handleImportar = () => {
    setErroImportacao('');
    setSucessoImportacao('');

    if (!textoImportacao.trim()) {
      setErroImportacao('Cole o conteúdo JSON ou CSV para importar.');
      return;
    }

    try {
      // Tenta JSON primeiro
      if (textoImportacao.trim().startsWith('{') || textoImportacao.trim().startsWith('[')) {
        const parsed = JSON.parse(textoImportacao);
        const novos = Array.isArray(parsed) ? parsed : [parsed];
        
        // Validação mínima de campos
        for (const item of novos) {
          if (!item.titulo || !item.disciplinaId) {
            throw new Error("Cada registro deve possuir ao menos 'titulo' e 'disciplinaId'.");
          }
        }

        setKahoots(prev => [...novos, ...prev]);
        setSucessoImportacao(`${novos.length} Kahoot(s) importado(s) com sucesso!`);
        setTextoImportacao('');
        setTimeout(() => setModalImportarAberto(false), 1500);
        return;
      }

      // Se for CSV (Linhas com: Pergunta;Resposta;Explicacao)
      const linhas = textoImportacao.trim().split('\n');
      if (linhas.length < 2) {
        throw new Error('O formato CSV deve conter um cabeçalho e ao menos uma linha de dados.');
      }

      const questoesImportadas = [];
      // Ignora a primeira linha (cabeçalho)
      for (let i = 1; i < linhas.length; i++) {
        const partes = linhas[i].split(';').map(p => p.trim());
        if (partes.length >= 2) {
          questoesImportadas.push({
            id: `q_csv_${Date.now()}_${i}`,
            pergunta: partes[0],
            respostaCorreta: partes[1],
            explicacao: partes[2] || 'Sem explicação adicional.'
          });
        }
      }

      if (questoesImportadas.length === 0) {
        throw new Error('Nenhuma questão válida encontrada no formato Pergunta;Resposta;Explicacao');
      }

      // Cria um novo Kahoot agrupando essas questões
      const novoKahoot = {
        id: `kahoot_import_${Date.now()}`,
        titulo: `Kahoot Importado (${new Date().toLocaleDateString('pt-BR')})`,
        disciplinaId: disciplinas[0]?.id || 'prog-computadores',
        moduloId: '',
        descricao: 'Quiz importado via arquivo CSV de questões.',
        urlKahoot: 'https://kahoot.it',
        dataCriacao: new Date().toISOString().split('T')[0],
        statusRevisao: 'pendente',
        resumoTeorico: 'Revise os conteúdos antes de executar as questões importadas.',
        conceitosCobrados: ['Conceitos gerais'],
        exemplosExplicativos: [],
        errosComuns: [],
        questoes: questoesImportadas,
        anotacoesPessoais: 'Importado via CSV.'
      };

      setKahoots(prev => [novoKahoot, ...prev]);
      setSucessoImportacao(`${questoesImportadas.length} questões importadas em um novo Kahoot!`);
      setTextoImportacao('');
      setTimeout(() => setModalImportarAberto(false), 1500);
    } catch (err) {
      setErroImportacao(`Erro de validação: ${err.message}`);
    }
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
            Estude a fundamentação teórica, conheça as pegadinhas e revise o gabarito antes de abrir o quiz no Kahoot.
          </p>
        </div>

        <button
          onClick={() => setModalImportarAberto(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors shrink-0 shadow-2xs"
        >
          <Upload className="w-4 h-4 text-sky-600" />
          <span>Importar Questões (JSON / CSV)</span>
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
            placeholder="Buscar por quiz, pergunta de prova ou conteúdo..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-amber-500 transition-colors shadow-2xs"
          />
        </div>

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
      </div>

      {/* Lista de Kahoots */}
      {kahootsFiltrados.length === 0 ? (
        <EmptyState
          title="Nenhum Kahoot encontrado"
          description="Ajuste os filtros de busca ou utilize o botão de importação acima para cadastrar seus quizzes."
          actionLabel="Limpar busca"
          onAction={() => { setBusca(''); setFiltroDisciplina('todas'); }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {kahootsFiltrados.map((kahoot) => {
            const disc = disciplinas.find(d => d.id === kahoot.disciplinaId);
            const mod = modulos.find(m => m.id === kahoot.moduloId);

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
                    <Badge variant="warning" size="xs">
                      {kahoot.questoes?.length || 0} Questões
                    </Badge>
                  </div>

                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {kahoot.titulo}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {kahoot.descricao}
                  </p>

                  {mod && (
                    <div className="mt-3 text-[11px] text-slate-400">
                      Módulo: <span className="text-slate-600 dark:text-slate-300">{mod.titulo}</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
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

      {/* Modal de Importação de Questões */}
      {modalImportarAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Upload className="w-4 h-4 text-sky-600" />
                Importar Questões (JSON ou CSV)
              </h3>
              <button
                onClick={() => setModalImportarAberto(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
              <p>Você pode colar um array <strong>JSON</strong> de Kahoots ou linhas <strong>CSV</strong> separadas por ponto-e-vírgula:</p>
              <code className="block bg-slate-100 dark:bg-slate-800 p-2 rounded text-[11px]">
                Pergunta;RespostaCorreta;Explicacao<br/>
                O que é variável?;Espaço de memória;Aloca dados dinâmicos.
              </code>
            </div>

            <textarea
              value={textoImportacao}
              onChange={(e) => setTextoImportacao(e.target.value)}
              placeholder="Cole o código JSON ou texto CSV aqui..."
              rows={6}
              className="w-full p-3 text-xs font-mono rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-sky-500 resize-none"
            />

            {erroImportacao && (
              <p className="text-xs text-red-600 dark:text-red-400 font-medium">{erroImportacao}</p>
            )}
            {sucessoImportacao && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{sucessoImportacao}</p>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setModalImportarAberto(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleImportar}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-colors"
              >
                Confirmar Importação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
