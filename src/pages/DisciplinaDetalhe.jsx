import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStudy } from '../context/StudyContext';
import {
  BookOpen,
  ArrowLeft,
  Layers,
  FileText,
  HelpCircle,
  FolderGit2,
  CheckCircle2,
  Clock,
  Circle,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  BrainCircuit
} from 'lucide-react';
import Badge from '../components/common/Badge';
import CodeBlock from '../components/common/CodeBlock';
import EmptyState from '../components/common/EmptyState';

export default function DisciplinaDetalhe() {
  const { id } = useParams();
  const {
    disciplinas,
    modulos,
    resumos,
    kahoots,
    projetos,
    moduleProgress,
    updateModuleProgress
  } = useStudy();

  const [abaAtiva, setAbaAtiva] = useState('modulos');
  const [moduloAberto, setModuloAberto] = useState(null);

  const disciplina = disciplinas.find(d => d.id === id);

  if (!disciplina) {
    return (
      <div className="py-12">
        <EmptyState
          title="Disciplina não encontrada"
          description="A matéria solicitada não existe ou foi removida."
          actionLabel="Voltar para Disciplinas"
          onAction={() => window.history.back()}
        />
      </div>
    );
  }

  const modulosDaDisc = modulos.filter(m => m.disciplinaId === disciplina.id);
  const resumosDaDisc = resumos.filter(r => r.disciplinaId === disciplina.id);
  const kahootsDaDisc = kahoots.filter(k => k.disciplinaId === disciplina.id);
  const projetosDaDisc = projetos.filter(p => p.disciplinasRelacionadas?.includes(disciplina.id));

  const totalModulos = modulosDaDisc.length;
  const concluidos = modulosDaDisc.filter(m => (moduleProgress[m.id] || m.status) === 'concluido').length;
  const progresso = totalModulos > 0 ? Math.round((concluidos / totalModulos) * 100) : 0;

  const toggleAccordion = (modId) => {
    setModuloAberto(prev => prev === modId ? null : modId);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      {/* Botão de Retorno */}
      <Link
        to="/disciplinas"
        className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para todas as disciplinas
      </Link>

      {/* Hero da Disciplina */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="primary" size="sm">{disciplina.semestre}º Semestre</Badge>
          <Badge variant={disciplina.status === 'Concluída' ? 'success' : 'default'} size="sm">
            {disciplina.status}
          </Badge>
          {disciplina.professor && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Prof.: <strong className="text-slate-700 dark:text-slate-200">{disciplina.professor}</strong>
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">
          {disciplina.nome}
        </h1>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          {disciplina.descricao}
        </p>

        {/* Barra de Progresso Geral da Matéria */}
        <div className="pt-2 max-w-md">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
            <span>Progresso da Disciplina</span>
            <span className="font-semibold">{progresso}% ({concluidos}/{totalModulos} módulos)</span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-sky-500 rounded-full transition-all duration-300"
              style={{ width: `${progresso}%` }}
            />
          </div>
        </div>
      </div>

      {/* Abas de Conteúdo */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 overflow-x-auto text-xs sm:text-sm font-semibold">
        <button
          onClick={() => setAbaAtiva('modulos')}
          className={`pb-3 px-1 border-b-2 flex items-center gap-2 transition-colors ${
            abaAtiva === 'modulos'
              ? 'border-sky-600 text-sky-600 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Módulos ({modulosDaDisc.length})</span>
        </button>

        <button
          onClick={() => setAbaAtiva('resumos')}
          className={`pb-3 px-1 border-b-2 flex items-center gap-2 transition-colors ${
            abaAtiva === 'resumos'
              ? 'border-sky-600 text-sky-600 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Resumos Teóricos ({resumosDaDisc.length})</span>
        </button>

        <button
          onClick={() => setAbaAtiva('kahoots')}
          className={`pb-3 px-1 border-b-2 flex items-center gap-2 transition-colors ${
            abaAtiva === 'kahoots'
              ? 'border-sky-600 text-sky-600 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Kahoots & Quizzes ({kahootsDaDisc.length})</span>
        </button>

        {projetosDaDisc.length > 0 && (
          <button
            onClick={() => setAbaAtiva('projetos')}
            className={`pb-3 px-1 border-b-2 flex items-center gap-2 transition-colors ${
              abaAtiva === 'projetos'
                ? 'border-sky-600 text-sky-600 dark:text-sky-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            <span>Projetos ({projetosDaDisc.length})</span>
          </button>
        )}
      </div>

      {/* Conteúdo da Aba Ativa */}
      {abaAtiva === 'modulos' && (
        <div className="space-y-4">
          {modulosDaDisc.length === 0 ? (
            <EmptyState
              title="Nenhum módulo cadastrado"
              description="Adicione módulos nos arquivos JSON ou através do Gerenciador de Conteúdo para estruturar as aulas desta disciplina."
            />
          ) : (
            modulosDaDisc.map((modulo) => {
              const statusAtual = moduleProgress[modulo.id] || modulo.status || 'nao_iniciado';
              const estaAberto = moduloAberto === modulo.id;
              const kahootVinculado = kahoots.find(k => k.id === modulo.kahootId);

              return (
                <div
                  key={modulo.id}
                  className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs transition-all"
                >
                  {/* Cabeçalho do Card de Módulo */}
                  <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        {statusAtual === 'concluido' && (
                          <Badge variant="success" size="xs">
                            <CheckCircle2 className="w-3 h-3" />
                            Concluído
                          </Badge>
                        )}
                        {statusAtual === 'estudando' && (
                          <Badge variant="warning" size="xs">
                            <Clock className="w-3 h-3" />
                            Estudando
                          </Badge>
                        )}
                        {statusAtual === 'nao_iniciado' && (
                          <Badge variant="default" size="xs">
                            <Circle className="w-3 h-3" />
                            Não iniciado
                          </Badge>
                        )}
                        {modulo.dataUltimaRevisao && (
                          <span className="text-[11px] text-slate-400">
                            Última revisão: {modulo.dataUltimaRevisao}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                        {modulo.titulo}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {modulo.descricao}
                      </p>
                    </div>

                    {/* Controles de Ação rápida */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {/* Alternador de Status */}
                      <select
                        value={statusAtual}
                        onChange={(e) => updateModuleProgress(modulo.id, e.target.value)}
                        className="px-2.5 py-1 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 outline-none"
                      >
                        <option value="nao_iniciado">Não iniciado</option>
                        <option value="estudando">Estudando</option>
                        <option value="concluido">Concluído</option>
                      </select>

                      {/* Botão de Expansão */}
                      <button
                        onClick={() => toggleAccordion(modulo.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title={estaAberto ? "Recolher detalhes" : "Expandir detalhes"}
                      >
                        {estaAberto ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Corpo Detalhado Expansível */}
                  {estaAberto && (
                    <div className="px-5 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-5 text-xs sm:text-sm">
                      {/* Objetivos */}
                      {modulo.objetivos?.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                            <Lightbulb className="w-4 h-4 text-amber-500" />
                            Objetivos de Aprendizagem
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
                            {modulo.objetivos.map((obj, i) => (
                              <li key={i}>{obj}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Resumo Teórico */}
                      {modulo.resumoTeorico && (
                        <div>
                          <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
                            Resumo Teórico do Conteúdo
                          </h4>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                            {modulo.resumoTeorico}
                          </p>
                        </div>
                      )}

                      {/* Conceitos Principais e Definições */}
                      {modulo.conceitosPrincipais?.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                            Conceitos Principais
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {modulo.conceitosPrincipais.map((c, i) => (
                              <span key={i} className="px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-xs font-medium border border-sky-100 dark:border-sky-900">
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Código de Exemplo */}
                      {modulo.codigoExemplo && (
                        <div>
                          <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
                            Exemplo Prático de Código
                          </h4>
                          <CodeBlock code={modulo.codigoExemplo} language="javascript" />
                        </div>
                      )}

                      {/* Erros Comuns e Atenção */}
                      {modulo.errosComuns?.length > 0 && (
                        <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40">
                          <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-1.5 flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                            Erros e Confusões Comuns
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-amber-900/90 dark:text-amber-200/90">
                            {modulo.errosComuns.map((err, i) => (
                              <li key={i}>{err}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Pontos para Memorizar */}
                      {modulo.pontosMemorizar?.length > 0 && (
                        <div className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-900/40">
                          <h4 className="font-semibold text-indigo-800 dark:text-indigo-300 mb-1.5 flex items-center gap-1.5">
                            <BrainCircuit className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            Pontos para Memorizar (Chave para Provas)
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-indigo-900/90 dark:text-indigo-200/90">
                            {modulo.pontosMemorizar.map((pt, i) => (
                              <li key={i}>{pt}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Link de Kahoot Vinculado */}
                      {kahootVinculado && (
                        <div className="pt-2 flex items-center justify-between bg-sky-50 dark:bg-sky-950/40 p-3 rounded-xl border border-sky-100 dark:border-sky-900">
                          <div className="flex items-center gap-2">
                            <HelpCircle className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                            <span className="font-medium text-slate-800 dark:text-slate-200">
                              Kahoot Vinculado: {kahootVinculado.titulo}
                            </span>
                          </div>
                          <Link
                            to={`/kahoots/${kahootVinculado.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-600 text-white hover:bg-sky-500 font-semibold text-xs transition-colors"
                          >
                            <span>Revisar Kahoot</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Aba de Resumos */}
      {abaAtiva === 'resumos' && (
        <div className="space-y-3">
          {resumosDaDisc.length === 0 ? (
            <EmptyState
              title="Nenhum resumo nesta disciplina"
              description="Cadastre resumos teóricos para revisar os conteúdos das aulas."
            />
          ) : (
            resumosDaDisc.map((resumo) => (
              <div
                key={resumo.id}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {resumo.titulo}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {resumo.tempoLeituraMin} min de leitura • {resumo.tags?.join(', ')}
                  </p>
                </div>
                <Link
                  to={`/resumos/${resumo.id}`}
                  className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-colors"
                >
                  Ler Resumo
                </Link>
              </div>
            ))
          )}
        </div>
      )}

      {/* Aba de Kahoots */}
      {abaAtiva === 'kahoots' && (
        <div className="space-y-3">
          {kahootsDaDisc.length === 0 ? (
            <EmptyState
              title="Nenhum Kahoot cadastrado"
              description="Vincule seus quizzes nesta disciplina para preparar o estudo antes de realizá-los."
            />
          ) : (
            kahootsDaDisc.map((k) => (
              <div
                key={k.id}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {k.titulo}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {k.questoes?.length || 0} questões com gabarito explicado
                  </p>
                </div>
                <Link
                  to={`/kahoots/${k.id}`}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition-colors"
                >
                  Abrir Central de Estudo
                </Link>
              </div>
            ))
          )}
        </div>
      )}

      {/* Aba de Projetos */}
      {abaAtiva === 'projetos' && (
        <div className="space-y-3">
          {projetosDaDisc.map((proj) => (
            <div
              key={proj.id}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between"
            >
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {proj.nome}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {proj.tecnologias.join(' • ')}
                </p>
              </div>
              <Link
                to={`/projetos/${proj.id}`}
                className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-colors"
              >
                Ver Projeto
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
