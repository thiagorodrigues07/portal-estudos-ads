import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import {
  PlusCircle,
  Copy,
  Check,
  Download,
  AlertCircle,
  FileCode,
  BookOpen,
  Layers,
  FileText,
  HelpCircle,
  FolderGit2
} from 'lucide-react';
import CodeBlock from '../components/common/CodeBlock';

export default function GerenciadorConteudo() {
  const { disciplinas } = useStudy();

  const [tipoConteudo, setTipoConteudo] = useState('disciplina');
  const [copiado, setCopiado] = useState(false);

  // Estados dos formulários:
  // 1. Disciplina
  const [discId, setDiscId] = useState('');
  const [discNome, setDiscNome] = useState('');
  const [discSemestre, setDiscSemestre] = useState(1);
  const [discDesc, setDiscDesc] = useState('');

  // 2. Módulo
  const [modId, setModId] = useState('');
  const [modDiscId, setModDiscId] = useState(disciplinas[0]?.id || 'prog-computadores');
  const [modTitulo, setModTitulo] = useState('');
  const [modDesc, setModDesc] = useState('');
  const [modResumoTeorico, setModResumoTeorico] = useState('');

  // 3. Kahoot
  const [kahootId, setKahootId] = useState('');
  const [kahootTitulo, setKahootTitulo] = useState('');
  const [kahootDiscId, setKahootDiscId] = useState(disciplinas[0]?.id || 'prog-computadores');
  const [kahootUrl, setKahootUrl] = useState('https://kahoot.it');
  const [kahootResumo, setKahootResumo] = useState('');
  const [pergunta, setPergunta] = useState('');
  const [resposta, setResposta] = useState('');
  const [explicacao, setExplicacao] = useState('');

  // Gera o JSON dinâmico baseado no tipo selecionado
  const gerarJSON = () => {
    switch (tipoConteudo) {
      case 'disciplina':
        return {
          id: discId.trim() || 'nova-disciplina-id',
          nome: discNome.trim() || 'Nome da Disciplina',
          semestre: Number(discSemestre),
          status: 'Em andamento',
          professor: '',
          descricao: discDesc.trim() || 'Descrição dos objetivos da disciplina.',
          links: [],
          anotacoes: ''
        };
      case 'modulo':
        return {
          id: modId.trim() || `mod-${Date.now()}`,
          disciplinaId: modDiscId,
          titulo: modTitulo.trim() || 'Título do Módulo',
          descricao: modDesc.trim() || 'Descrição dos temas abordados no módulo.',
          objetivos: ["Compreender os princípios teóricos", "Aplicar na prática"],
          resumoTeorico: modResumoTeorico.trim() || 'Resumo teórico a ser completado.',
          conceitosPrincipais: ["Conceito 1", "Conceito 2"],
          definicoes: [{ termo: "Termo chave", significado: "Definição do termo" }],
          exemplosPraticos: "Exemplo prático de aplicação.",
          codigoExemplo: "// Trecho de código se aplicável",
          errosComuns: ["Erro comum a ser evitado em avaliações"],
          pontosMemorizar: ["Ponto chave para memorizar"],
          questoesRevisao: ["Questão de revisão 1?"],
          materiaisComplementares: [],
          kahootId: "",
          status: "estudando",
          dataUltimaRevisao: new Date().toISOString().split('T')[0],
          isDemonstracao: false
        };
      case 'kahoot':
        return {
          id: kahootId.trim() || `kahoot-${Date.now()}`,
          titulo: kahootTitulo.trim() || 'Novo Kahoot de Fixação',
          disciplinaId: kahootDiscId,
          moduloId: '',
          descricao: 'Quiz para revisão prévia e fixação de conceitos.',
          urlKahoot: kahootUrl.trim() || 'https://kahoot.it',
          dataCriacao: new Date().toISOString().split('T')[0],
          statusRevisao: 'pendente',
          resumoTeorico: kahootResumo.trim() || 'Resumo preparatório para antes de jogar.',
          conceitosCobrados: ['Conceito chave 1', 'Conceito chave 2'],
          exemplosExplicativos: ['Exemplo explicativo da pegadinha.'],
          errosComuns: ['Erro mais frequente cometido no quiz.'],
          questoes: pergunta.trim() ? [
            {
              id: 'q1',
              pergunta: pergunta.trim(),
              respostaCorreta: resposta.trim() || 'Gabarito da resposta correta',
              explicacao: explicacao.trim() || 'Justificativa teórica da resposta.'
            }
          ] : [],
          anotacoesPessoais: ''
        };
      default:
        return {};
    }
  };

  const jsonFormatado = JSON.stringify(gerarJSON(), null, 2);

  const handleCopiar = async () => {
    try {
      await navigator.clipboard.writeText(jsonFormatado);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch (e) {
      console.warn('Erro ao copiar JSON:', e);
    }
  };

  const handleBaixar = () => {
    const blob = new Blob([jsonFormatado], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `novo_${tipoConteudo}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      {/* Cabeçalho */}
      <div className="border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <PlusCircle className="w-4 h-4" />
          <span>Manutenção Desacoplada</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          Gerenciador e Exportador de Conteúdo (JSON)
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Preencha os campos abaixo para gerar novos registros prontos e compatíveis com a arquitetura do projeto.
        </p>
      </div>

      {/* Aviso de Arquitetura Estática Transparente */}
      <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
        <div className="text-xs text-sky-900 dark:text-sky-200 leading-relaxed space-y-1">
          <p>
            <strong>Como o conteúdo é salvo no GitHub Pages?</strong> Como o GitHub Pages é uma hospedagem puramente estática (sem banco de dados no servidor), o site publicado não pode gravar alterações diretamente no repositório.
          </p>
          <p>
            Para adicionar novos conteúdos de forma definitiva à sua graduação, utilize o formulário abaixo, copie o JSON gerado e cole no arquivo correspondente dentro da pasta <code className="bg-white/80 dark:bg-slate-800 px-1 py-0.5 rounded font-mono">src/data/</code> antes do próximo <code className="bg-white/80 dark:bg-slate-800 px-1 py-0.5 rounded font-mono">git push</code>.
          </p>
        </div>
      </div>

      {/* Seletor de Tipo de Conteúdo */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setTipoConteudo('disciplina')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            tipoConteudo === 'disciplina'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Nova Disciplina</span>
        </button>

        <button
          onClick={() => setTipoConteudo('modulo')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            tipoConteudo === 'modulo'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Novo Módulo</span>
        </button>

        <button
          onClick={() => setTipoConteudo('kahoot')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            tipoConteudo === 'kahoot'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Novo Kahoot</span>
        </button>
      </div>

      {/* Formulário & Preview Lado a Lado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário Interativo */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Preencha os Campos do Registro
          </h3>

          {tipoConteudo === 'disciplina' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  ID único (sem espaços, ex: banco-de-dados)
                </label>
                <input
                  type="text"
                  value={discId}
                  onChange={(e) => setDiscId(e.target.value)}
                  placeholder="banco-de-dados"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Nome da Disciplina
                </label>
                <input
                  type="text"
                  value={discNome}
                  onChange={(e) => setDiscNome(e.target.value)}
                  placeholder="Modelagem de Banco de Dados"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Semestre
                </label>
                <select
                  value={discSemestre}
                  onChange={(e) => setDiscSemestre(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-sky-500"
                >
                  <option value={1}>1º Semestre</option>
                  <option value={2}>2º Semestre</option>
                  <option value={3}>3º Semestre</option>
                  <option value={4}>4º Semestre</option>
                  <option value={5}>5º Semestre</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Descrição Ementa
                </label>
                <textarea
                  value={discDesc}
                  onChange={(e) => setDiscDesc(e.target.value)}
                  rows={3}
                  placeholder="Resumo dos objetivos e temas da disciplina..."
                  className="w-full p-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-sky-500 resize-none"
                />
              </div>
            </div>
          )}

          {tipoConteudo === 'modulo' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Vincular à Disciplina
                </label>
                <select
                  value={modDiscId}
                  onChange={(e) => setModDiscId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-sky-500"
                >
                  {disciplinas.map(d => (
                    <option key={d.id} value={d.id}>{d.nome}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Título do Módulo
                </label>
                <input
                  type="text"
                  value={modTitulo}
                  onChange={(e) => setModTitulo(e.target.value)}
                  placeholder="Módulo 2: Estruturas de Repetição"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Resumo Teórico Inicial
                </label>
                <textarea
                  value={modResumoTeorico}
                  onChange={(e) => setModResumoTeorico(e.target.value)}
                  rows={3}
                  placeholder="Explicação conceitual do módulo..."
                  className="w-full p-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-sky-500 resize-none"
                />
              </div>
            </div>
          )}

          {tipoConteudo === 'kahoot' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Título do Kahoot
                </label>
                <input
                  type="text"
                  value={kahootTitulo}
                  onChange={(e) => setKahootTitulo(e.target.value)}
                  placeholder="Kahoot: Estruturas de Dados e Listas"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Link do Kahoot (para responder)
                </label>
                <input
                  type="url"
                  value={kahootUrl}
                  onChange={(e) => setKahootUrl(e.target.value)}
                  placeholder="https://kahoot.it"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Adicionar Questão Modelo:
                </span>
                <input
                  type="text"
                  value={pergunta}
                  onChange={(e) => setPergunta(e.target.value)}
                  placeholder="Pergunta do quiz..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-amber-500"
                />
                <input
                  type="text"
                  value={resposta}
                  onChange={(e) => setResposta(e.target.value)}
                  placeholder="Resposta correta..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-amber-500"
                />
                <input
                  type="text"
                  value={explicacao}
                  onChange={(e) => setExplicacao(e.target.value)}
                  placeholder="Explicação da resposta..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Preview do JSON Pronto */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                JSON Formatado para Copiar
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopiar}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-xs font-semibold hover:bg-sky-100 transition-colors"
                >
                  {copiado ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiado ? 'Copiado!' : 'Copiar JSON'}</span>
                </button>
                <button
                  onClick={handleBaixar}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                  title="Baixar arquivo JSON"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto max-h-96 leading-relaxed">
              <code>{jsonFormatado}</code>
            </pre>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
            Destino no repositório:{' '}
            <strong className="text-slate-600 dark:text-slate-300">
              src/data/{tipoConteudo === 'disciplina' ? 'disciplinas.json' : tipoConteudo === 'modulo' ? 'modulos.json' : 'kahoots.json'}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
