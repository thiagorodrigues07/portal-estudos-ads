import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import {
  GraduationCap,
  Calendar,
  Clock,
  Building2,
  CheckCircle2,
  BookOpen,
  CalendarDays,
  FileCheck2,
  Plus,
  Trash2,
  AlertCircle
} from 'lucide-react';
import Badge from '../components/common/Badge';

export default function Faculdade() {
  const { faculdade, setFaculdade, disciplinas } = useStudy();

  // Estado local para adicionar novas observações ou datas acadêmicas
  const [novasAnotacoes, setNovasAnotacoes] = useState(() => {
    try {
      const saved = localStorage.getItem('portal_ads_anotacoes_faculdade');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [tituloAnotacao, setTituloAnotacao] = useState('');
  const [dataAnotacao, setDataAnotacao] = useState('');
  const [descAnotacao, setDescAnotacao] = useState('');

  const handleSalvarAnotacao = (e) => {
    e.preventDefault();
    if (!tituloAnotacao.trim()) return;
    const novoItem = {
      id: Date.now().toString(),
      titulo: tituloAnotacao.trim(),
      data: dataAnotacao,
      descricao: descAnotacao.trim()
    };
    const listaAtualizada = [novoItem, ...novasAnotacoes];
    setNovasAnotacoes(listaAtualizada);
    localStorage.setItem('portal_ads_anotacoes_faculdade', JSON.stringify(listaAtualizada));
    setTituloAnotacao('');
    setDataAnotacao('');
    setDescAnotacao('');
  };

  const handleRemoverAnotacao = (id) => {
    const listaAtualizada = novasAnotacoes.filter(item => item.id !== id);
    setNovasAnotacoes(listaAtualizada);
    localStorage.setItem('portal_ads_anotacoes_faculdade', JSON.stringify(listaAtualizada));
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      {/* Cabeçalho da Seção */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>Perfil Acadêmico Oficial</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Minha Faculdade
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Informações institucionais, grade curricular e acompanhamento de datas do curso.
          </p>
        </div>
      </div>

      {/* Cards de Identificação Acadêmica */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Instituição */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-400">Instituição de Ensino</span>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">
              {faculdade.instituicao}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Ensino Superior Presencial / Noturno</p>
          </div>
        </div>

        {/* Curso e Situação */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-400">Graduação Tecnológica</span>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">
              {faculdade.curso}
            </h4>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="success" size="xs">
                <CheckCircle2 className="w-3 h-3" />
                {faculdade.situacao}
              </Badge>
              <span className="text-xs text-slate-500 dark:text-slate-400">Período {faculdade.periodo}</span>
            </div>
          </div>
        </div>

        {/* Semestre e Previsão */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-400">Tempo de Curso</span>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">
              {faculdade.semestreAtual}º Semestre Atual
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Previsão de conclusão: <span className="font-semibold text-slate-700 dark:text-slate-300">{faculdade.previsaoConclusao}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Grade Curricular do Semestre */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Grade Curricular Atual — 1º Semestre
            </h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {disciplinas.length} disciplinas cadastradas
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {disciplinas.map((disc, idx) => (
            <div key={disc.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {disc.nome}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {disc.descricao}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 pl-9 sm:pl-0">
                <Badge variant="primary" size="xs">
                  {disc.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Observações Acadêmicas e Calendário Pessoal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário para Cadastrar Observação / Data de Prova */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Adicionar Lembrete / Data Importante
            </h3>
          </div>
          <form onSubmit={handleSalvarAnotacao} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Título do Evento ou Observação
              </label>
              <input
                type="text"
                value={tituloAnotacao}
                onChange={(e) => setTituloAnotacao(e.target.value)}
                placeholder="Ex: Prova Presencial A1, Entrega de Trabalho..."
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-sky-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Data (opcional)
              </label>
              <input
                type="date"
                value={dataAnotacao}
                onChange={(e) => setDataAnotacao(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Detalhes
              </label>
              <textarea
                value={descAnotacao}
                onChange={(e) => setDescAnotacao(e.target.value)}
                rows={2}
                placeholder="Conteúdos cobrados, orientações do professor..."
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-sky-500 resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Salvar Registro
            </button>
          </form>
        </div>

        {/* Lista de Registros Acadêmicos */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <FileCheck2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Registros e Datas Cadastradas
            </h3>
          </div>

          <div className="flex-1 space-y-3">
            {novasAnotacoes.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                Nenhuma data ou observação registrada ainda. Preencha o formulário ao lado para organizar seu calendário semestral.
              </div>
            ) : (
              novasAnotacoes.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                        {item.titulo}
                      </h4>
                      {item.data && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-medium">
                          {item.data}
                        </span>
                      )}
                    </div>
                    {item.descricao && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {item.descricao}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoverAnotacao(item.id)}
                    className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Excluir anotação"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
