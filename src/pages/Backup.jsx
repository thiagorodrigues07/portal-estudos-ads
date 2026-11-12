import React, { useState } from 'react';
import { useStudy, getTodayString } from '../context/StudyContext';
import {
  Download,
  Upload,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  FileCode,
  ShieldCheck,
  Database,
  Info
} from 'lucide-react';
import Badge from '../components/common/Badge';

export default function Backup() {
  const {
    exportFullBackup,
    importFullBackup,
    resetAllDataToDefaults,
    disciplinas,
    modulos,
    resumos,
    kahoots,
    attempts,
    notas,
    projetos
  } = useStudy();

  const [arquivoUpload, setArquivoUpload] = useState(null);
  const [previaBackup, setPreviaBackup] = useState(null);
  const [erroImportacao, setErroImportacao] = useState('');
  const [sucessoFeedback, setSucessoFeedback] = useState('');
  const [confirmacaoReset, setConfirmacaoReset] = useState(false);

  // 1. Download do Backup JSON
  const handleDownloadBackup = () => {
    const jsonStr = exportFullBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_portal_ads_${getTodayString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 2. Leitura do arquivo para Pré-visualização
  const handleFileChange = (e) => {
    setErroImportacao('');
    setSucessoFeedback('');
    setPreviaBackup(null);

    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result;
        const parsed = JSON.parse(content);

        if (!parsed || typeof parsed !== 'object') {
          throw new Error('O arquivo não é um JSON válido.');
        }

        // Gera resumo da prévia
        setPreviaBackup({
          rawJson: content,
          versao: parsed.version || 'desconhecida',
          dataExportacao: parsed.exportedAt || 'não informada',
          disciplinas: parsed.disciplinas?.length || 0,
          modulos: parsed.modulos?.length || 0,
          kahoots: parsed.kahoots?.length || 0,
          tentativas: Object.keys(parsed.attempts || {}).length,
          notas: parsed.notas?.length || 0,
          projetos: parsed.projetos?.length || 0
        });
      } catch (err) {
        setErroImportacao(`Erro ao ler arquivo: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  // 3. Confirmar restauração do backup
  const handleConfirmarRestauracao = () => {
    if (!previaBackup?.rawJson) return;

    const res = importFullBackup(previaBackup.rawJson);
    if (res.sucesso) {
      setSucessoFeedback('Backup restaurado com sucesso! Seus dados foram atualizados no navegador.');
      setPreviaBackup(null);
    } else {
      setErroImportacao(`Erro ao restaurar: ${res.erro}`);
    }
  };

  // 4. Resetar para o padrão inicial
  const handleExecutarReset = () => {
    resetAllDataToDefaults();
    setConfirmacaoReset(false);
    setSucessoFeedback('Todos os dados pessoais do navegador foram redefinidos para os valores padrão de fábrica.');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl pb-16">
      {/* Cabeçalho */}
      <div className="border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Database className="w-4 h-4" />
          <span>Segurança e Sincronização</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          Gerenciador de Backup e Dados
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Exporte seus dados pessoais, transfira seu progresso entre computadores ou recupere um backup com total segurança.
        </p>
      </div>

      {/* Aviso de Transparência sobre o Armazenamento Local */}
      <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 flex items-start gap-3">
        <Info className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
        <div className="text-xs text-sky-900 dark:text-sky-200 leading-relaxed space-y-1">
          <p>
            <strong>Como funciona a persistência dos seus estudos:</strong> Como este portal é hospedado estaticamente no GitHub Pages sem cobranças de servidores ou bancos de dados na nuvem, todas as suas tentativas, anotações e revisões ficam salvas na memória local (<code>LocalStorage</code>) do seu navegador atual.
          </p>
          <p>
            Para não perder seu histórico ao formatar o computador ou para sincronizar seus estudos entre o notebook e o desktop da faculdade, baixe o arquivo de backup abaixo regularmente e restaure-o no outro dispositivo!
          </p>
        </div>
      </div>

      {/* Status Atual dos Dados em Memória */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3">
          Dados Atualmente Armazenados no seu Navegador
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block text-[11px]">Disciplinas</span>
            <span className="text-base font-bold text-slate-800 dark:text-slate-100">{disciplinas.length}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block text-[11px]">Módulos</span>
            <span className="text-base font-bold text-slate-800 dark:text-slate-100">{modulos.length}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block text-[11px]">Kahoots</span>
            <span className="text-base font-bold text-slate-800 dark:text-slate-100">{kahoots.length}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block text-[11px]">Tentativas de Quiz</span>
            <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">
              {Object.values(attempts).reduce((acc, cur) => acc + cur.length, 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Exportar e Importar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bloco 1: Exportar Backup */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Download className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                1. Exportar Backup Completo
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Gera um arquivo <code>.json</code> seguro contendo todas as suas disciplinas, módulos, kahoots, histórico de notas, datas de revisões e anotações pessoais.
            </p>
          </div>

          <button
            onClick={handleDownloadBackup}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Baixar Arquivo de Backup JSON</span>
          </button>
        </div>

        {/* Bloco 2: Restaurar Backup */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Upload className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                2. Restaurar Backup JSON
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Carregue um arquivo de backup previamente exportado. O sistema validará os dados e exibirá uma prévia antes de qualquer alteração.
            </p>
          </div>

          <div>
            <label className="w-full py-2.5 px-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 text-slate-600 dark:text-slate-300 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer bg-slate-50 dark:bg-slate-800/40">
              <Upload className="w-4 h-4 text-emerald-600" />
              <span>Selecionar Arquivo JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {erroImportacao && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-300 font-medium flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{erroImportacao}</span>
        </div>
      )}

      {sucessoFeedback && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{sucessoFeedback}</span>
        </div>
      )}

      {/* Modal / Painel de Pré-visualização do Backup antes de Aplicar */}
      {previaBackup && (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-400 dark:border-emerald-600 shadow-lg space-y-4 animate-fade-in">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Pré-visualização do Backup Validado</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800">
              <span className="text-slate-400 block text-[10px]">Versão:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{previaBackup.versao}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800">
              <span className="text-slate-400 block text-[10px]">Disciplinas:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{previaBackup.disciplinas}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800">
              <span className="text-slate-400 block text-[10px]">Módulos:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{previaBackup.modulos}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800">
              <span className="text-slate-400 block text-[10px]">Kahoots:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{previaBackup.kahoots}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800">
              <span className="text-slate-400 block text-[10px]">Quizzes com Tentativas:</span>
              <span className="font-semibold text-emerald-600">{previaBackup.tentativas}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800">
              <span className="text-slate-400 block text-[10px]">Notas Técnicas:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{previaBackup.notas}</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ao confirmar, os dados do seu navegador serão substituídos pelas informações deste arquivo.
          </p>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setPreviaBackup(null)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmarRestauracao}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-xs"
            >
              Confirmar e Restaurar Backup
            </button>
          </div>
        </div>
      )}

      {/* Bloco 3: Reset de Fábrica Seguro */}
      <div className="rounded-2xl border border-rose-200/80 dark:border-rose-900/40 p-5 bg-rose-50/20 dark:bg-rose-950/10 space-y-3">
        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
          <RotateCcw className="w-4 h-4" />
          <span>Zona de Recuperação: Resetar Dados Locais</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Se você quiser recomeçar do zero e apagar todo o progresso do navegador para restaurar os dados originais padrão da faculdade, use esta opção com cuidado.
        </p>

        {confirmacaoReset ? (
          <div className="p-3 rounded-xl bg-rose-100 dark:bg-rose-950 border border-rose-300 dark:border-rose-800 flex items-center justify-between gap-3 text-xs">
            <span className="text-rose-800 dark:text-rose-200 font-semibold">
              Tem certeza absoluta? Isso apagará tentativas e anotações deste navegador.
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setConfirmacaoReset(false)}
                className="px-3 py-1 rounded-lg text-slate-600 bg-white dark:bg-slate-800 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleExecutarReset}
                className="px-3 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-500"
              >
                Sim, Resetar Tudo
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setConfirmacaoReset(true)}
            className="px-3 py-1.5 rounded-lg border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/60 font-semibold text-xs transition-colors"
          >
            Redefinir para Valores Padrão
          </button>
        )}
      </div>
    </div>
  );
}
