import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStudy } from '../context/StudyContext';
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Target,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ListOrdered,
  BookOpen
} from 'lucide-react';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';

export default function ProjetoDetalhe() {
  const { id } = useParams();
  const { projetos, disciplinas, modulos } = useStudy();

  const projeto = projetos.find(p => p.id === id);

  if (!projeto) {
    return (
      <div className="py-12">
        <EmptyState
          title="Projeto não encontrado"
          description="O projeto solicitado não foi localizado no portfólio."
          actionLabel="Voltar para Projetos"
          onAction={() => window.history.back()}
        />
      </div>
    );
  }

  const disciplinasRel = disciplinas.filter(d => projeto.disciplinasRelacionadas?.includes(d.id));

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Botão Retorno */}
      <Link
        to="/projetos"
        className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para todos os projetos
      </Link>

      {/* Header do Projeto */}
      <section className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Badge variant={projeto.status === 'concluido' ? 'success' : 'warning'} size="sm">
            {projeto.status === 'concluido' ? 'Concluído' : 'Em Desenvolvimento'}
          </Badge>

          <div className="flex items-center gap-3">
            {projeto.githubUrl && (
              <a
                href={projeto.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>Repositório</span>
              </a>
            )}
            {projeto.demoUrl && (
              <a
                href={projeto.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Ver Demonstração</span>
              </a>
            )}
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-50">
          {projeto.nome}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          {projeto.descricao}
        </p>

        {/* Tecnologias */}
        {projeto.tecnologias?.length > 0 && (
          <div className="pt-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Stack Tecnológica
            </span>
            <div className="flex flex-wrap gap-2">
              {projeto.tecnologias.map((tech, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-medium border border-indigo-100 dark:border-indigo-900/40">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Problema & Objetivos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Problema */}
        <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <Target className="w-5 h-5" />
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Problema a Resolver
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {projeto.problema || 'Nenhum problema registrado.'}
          </p>
        </section>

        {/* Objetivos */}
        <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400">
            <CheckCircle2 className="w-5 h-5" />
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Objetivos do Projeto
            </h2>
          </div>
          <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 list-disc list-inside">
            {projeto.objetivos?.map((obj, i) => (
              <li key={i}>{obj}</li>
            ))}
          </ul>
        </section>
      </div>

      {/* Funcionalidades */}
      {projeto.funcionalidades?.length > 0 && (
        <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <Wrench className="w-5 h-5" />
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Principais Funcionalidades
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {projeto.funcionalidades.map((func, i) => (
              <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                <span>{func}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Aprendizados, Dificuldades e Soluções */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <Lightbulb className="w-5 h-5" />
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Aprendizados Obtidos
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {projeto.aprendizados}
          </p>
        </section>

        <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Dificuldades & Soluções
            </h2>
          </div>
          <div className="space-y-2 text-xs sm:text-sm">
            <p className="text-slate-600 dark:text-slate-300">
              <strong>Desafio:</strong> {projeto.dificuldades}
            </p>
            <p className="text-slate-600 dark:text-slate-300">
              <strong>Solução adotada:</strong> {projeto.solucoes}
            </p>
          </div>
        </section>
      </div>

      {/* Etapas do Desenvolvimento */}
      {projeto.etapas?.length > 0 && (
        <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400">
            <ListOrdered className="w-5 h-5" />
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Etapas do Ciclo de Desenvolvimento
            </h2>
          </div>
          <div className="space-y-2">
            {projeto.etapas.map((etapa, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs sm:text-sm text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                {etapa}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Disciplinas Relacionadas */}
      {disciplinasRel.length > 0 && (
        <section className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Disciplinas Relacionadas:
            </span>
            <div className="flex items-center gap-2">
              {disciplinasRel.map(d => (
                <Link
                  key={d.id}
                  to={`/disciplinas/${d.id}`}
                  className="text-xs text-sky-600 hover:underline font-medium"
                >
                  {d.nome}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
