import React, { useState } from 'react';
import { useStudy, getTodayString } from '../context/StudyContext';
import {
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Check,
  CalendarDays,
  FileText,
  GraduationCap,
  Sparkles
} from 'lucide-react';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';

export default function CalendarioAcademico() {
  const {
    eventosCalendario,
    addEvento,
    updateEvento,
    deleteEvento,
    setEventoStatus,
    disciplinas
  } = useStudy();

  const [visao, setVisao] = useState('mensal'); // 'mensal' | 'cronologico' | 'lista'
  const [filtroDisciplina, setFiltroDisciplina] = useState('todas');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [modalNovo, setModalNovo] = useState(false);

  // Mês exibido no calendário
  const hoje = new Date();
  const [anoExibido, setAnoExibido] = useState(hoje.getFullYear());
  const [mesExibido, setMesExibido] = useState(hoje.getMonth()); // 0 a 11

  // Formulário de Novo Evento
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState('prova');
  const [dataEvento, setDataEvento] = useState(getTodayString());
  const [hora, setHora] = useState('19:30');
  const [discId, setDiscId] = useState(disciplinas[0]?.id || '');
  const [prioridade, setPrioridade] = useState('alta');
  const [descricao, setDescricao] = useState('');

  const hojeStr = getTodayString();

  // Filtragem
  const eventosFiltrados = (eventosCalendario || []).filter(e => {
    const matchDisc = filtroDisciplina === 'todas' || e.disciplinaId === filtroDisciplina;
    const matchStatus = filtroStatus === 'todos' || e.status === filtroStatus;
    return matchDisc && matchStatus;
  });

  // Funções de navegação de mês
  const handleMesAnterior = () => {
    if (mesExibido === 0) {
      setMesExibido(11);
      setAnoExibido(prev => prev - 1);
    } else {
      setMesExibido(prev => prev - 1);
    }
  };

  const handleProximoMes = () => {
    if (mesExibido === 11) {
      setMesExibido(0);
      setAnoExibido(prev => prev + 1);
    } else {
      setMesExibido(prev => prev + 1);
    }
  };

  // Montagem da grade do mês
  const primeiroDiaDoMes = new Date(anoExibido, mesExibido, 1).getDay(); // 0 = Domingo
  const totalDiasNoMes = new Date(anoExibido, mesExibido + 1, 0).getDate();
  const nomeDoMes = new Date(anoExibido, mesExibido, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  const diasGrade = [];
  // Dias em branco antes do 1º dia
  for (let i = 0; i < primeiroDiaDoMes; i++) {
    diasGrade.push(null);
  }
  for (let dia = 1; dia <= totalDiasNoMes; dia++) {
    const dataFormatada = `${anoExibido}-${String(mesExibido + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    const eventosDoDia = eventosFiltrados.filter(e => e.data === dataFormatada);
    diasGrade.push({
      dia,
      data: dataFormatada,
      eventos: eventosDoDia,
      isHoje: dataFormatada === hojeStr
    });
  }

  const handleSalvarNovoEvento = (e) => {
    e.preventDefault();
    if (!titulo.trim() || !dataEvento) return;

    addEvento({
      titulo: titulo.trim(),
      tipo,
      data: dataEvento,
      hora,
      disciplinaId: discId || undefined,
      prioridade,
      descricao: descricao.trim(),
      status: 'pendente'
    });

    setModalNovo(false);
    setTitulo('');
    setDescricao('');
  };

  // Cálculo de dias restantes
  const calcularPrazoTexto = (dataStr) => {
    if (dataStr === hojeStr) return 'Hoje!';
    const diffTime = new Date(`${dataStr}T12:00:00`) - new Date(`${hojeStr}T12:00:00`);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return `Atrasado (${Math.abs(diffDays)}d)`;
    return `Em ${diffDays} dia(s)`;
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl pb-16">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <CalendarDays className="w-4 h-4" />
            <span>Gestão de Prazos e Avaliações</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Calendário e Planejamento Acadêmico
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Acompanhe datas de provas, entrega de trabalhos regimentais, atividades e compromissos da graduação.
          </p>
        </div>

        <button
          onClick={() => setModalNovo(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Avaliação / Prazo</span>
        </button>
      </div>

      {/* Controles de Visualização e Filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setVisao('mensal')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              visao === 'mensal'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-300'
            }`}
          >
            Grade Mensal
          </button>
          <button
            onClick={() => setVisao('cronologico')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              visao === 'cronologico'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-300'
            }`}
          >
            Próximos Prazos
          </button>
          <button
            onClick={() => setVisao('lista')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              visao === 'lista'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-300'
            }`}
          >
            Lista Completa
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <select
            value={filtroDisciplina}
            onChange={(e) => setFiltroDisciplina(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 outline-none"
          >
            <option value="todas">Todas as Disciplinas</option>
            {disciplinas.map(d => (
              <option key={d.id} value={d.id}>{d.nome}</option>
            ))}
          </select>

          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 outline-none"
          >
            <option value="todos">Todos os Status</option>
            <option value="pendente">Pendente</option>
            <option value="em_andamento">Em Andamento</option>
            <option value="concluido">Concluído</option>
          </select>
        </div>
      </div>

      {/* ========================================= */}
      {/* VISÃO 1: GRADE MENSAL INTERATIVA          */}
      {/* ========================================= */}
      {visao === 'mensal' && (
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 capitalize">
              {nomeDoMes}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleMesAnterior}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleProximoMes}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cabeçalho dos Dias da Semana */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 py-1">
            <span>Dom</span>
            <span>Seg</span>
            <span>Ter</span>
            <span>Qua</span>
            <span>Qui</span>
            <span>Sex</span>
            <span>Sáb</span>
          </div>

          {/* Grade de Dias */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {diasGrade.map((item, idx) => {
              if (!item) {
                return <div key={`empty_${idx}`} className="min-h-[70px] rounded-xl bg-slate-50/40 dark:bg-slate-800/20" />;
              }

              return (
                <div
                  key={item.data}
                  className={`min-h-[70px] p-1.5 sm:p-2 rounded-xl border transition-all flex flex-col justify-between ${
                    item.isHoje
                      ? 'border-sky-500 bg-sky-50/30 dark:bg-sky-950/30'
                      : 'border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className={`font-bold ${item.isHoje ? 'text-sky-600 dark:text-sky-400' : 'text-slate-700 dark:text-slate-300'}`}>
                      {item.dia}
                    </span>
                    {item.isHoje && (
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                    )}
                  </div>

                  <div className="space-y-1 my-1">
                    {item.eventos.map(evt => (
                      <div
                        key={evt.id}
                        title={`${evt.titulo} (${evt.tipo})`}
                        className={`text-[9px] sm:text-[10px] p-1 rounded font-medium truncate ${
                          evt.tipo === 'prova'
                            ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200'
                            : evt.tipo === 'trabalho'
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200'
                            : 'bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-200'
                        }`}
                      >
                        {evt.titulo}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ========================================= */}
      {/* VISÃO 2: CRONOLÓGICA (PRÓXIMOS PRAZOS)    */}
      {/* ========================================= */}
      {visao === 'cronologico' && (
        <section className="space-y-3">
          {eventosFiltrados.length === 0 ? (
            <EmptyState
              title="Nenhuma atividade ou prova agendada"
              description="Cadastre as datas de provas e entregas do semestre para acompanhar seus prazos."
              actionLabel="Cadastrar Prazo"
              onAction={() => setModalNovo(true)}
            />
          ) : (
            eventosFiltrados
              .sort((a, b) => a.data.localeCompare(b.data))
              .map(evt => {
                const disc = disciplinas.find(d => d.id === evt.disciplinaId);
                const prazoTexto = calcularPrazoTexto(evt.data);
                const isAtrasado = evt.data < hojeStr && evt.status !== 'concluido';

                return (
                  <div
                    key={evt.id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={evt.tipo === 'prova' ? 'warning' : 'primary'} size="xs">
                          {evt.tipo.toUpperCase()}
                        </Badge>
                        {disc && <span className="text-xs text-slate-400 font-medium">{disc.nome}</span>}
                        <Badge variant={isAtrasado ? 'warning' : 'default'} size="xs">
                          {prazoTexto}
                        </Badge>
                      </div>

                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                        {evt.titulo}
                      </h4>

                      {evt.descricao && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                          {evt.descricao}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right text-xs">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 block">{evt.data}</span>
                        {evt.hora && <span className="text-slate-400 text-[11px]">{evt.hora}</span>}
                      </div>

                      <button
                        onClick={() => setEventoStatus(evt.id, evt.status === 'concluido' ? 'pendente' : 'concluido')}
                        className={`p-2 rounded-xl border transition-colors ${
                          evt.status === 'concluido'
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-600'
                            : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600'
                        }`}
                        title={evt.status === 'concluido' ? 'Marcar como pendente' : 'Marcar como concluído'}
                      >
                        <Check className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => deleteEvento(evt.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-500 transition-colors"
                        title="Excluir evento"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
          )}
        </section>
      )}

      {/* ========================================= */}
      {/* VISÃO 3: LISTA & HISTÓRICO COMPLETO       */}
      {/* ========================================= */}
      {visao === 'lista' && (
        <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3">Data</th>
                <th className="p-3">Tipo</th>
                <th className="p-3">Atividade / Prova</th>
                <th className="p-3">Disciplina</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {eventosFiltrados.map(evt => {
                const disc = disciplinas.find(d => d.id === evt.disciplinaId);
                return (
                  <tr key={evt.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {evt.data} {evt.hora && <span className="text-[10px] text-slate-400 block">{evt.hora}</span>}
                    </td>
                    <td className="p-3 uppercase font-bold text-[10px] text-slate-500">
                      {evt.tipo}
                    </td>
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-100">
                      {evt.titulo}
                    </td>
                    <td className="p-3 text-slate-500 dark:text-slate-400">
                      {disc?.nome || '-'}
                    </td>
                    <td className="p-3">
                      <Badge variant={evt.status === 'concluido' ? 'success' : evt.status === 'em_andamento' ? 'warning' : 'default'} size="xs">
                        {evt.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => deleteEvento(evt.id)}
                        className="text-slate-400 hover:text-rose-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}

      {/* MODAL CADASTRAR NOVO EVENTO */}
      {modalNovo && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
        >
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-sky-600" />
              <span>Cadastrar Novo Compromisso / Prazo</span>
            </h3>

            <form onSubmit={handleSalvarNovoEvento} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Título do evento / prova:</label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                  placeholder="Ex: Prova Regimental A1 - Algoritmos"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Tipo:</label>
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  >
                    <option value="prova">Prova / Avaliação</option>
                    <option value="trabalho">Entrega de Trabalho</option>
                    <option value="atividade">Atividade Prática</option>
                    <option value="lembrete">Lembrete Importante</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Disciplina:</label>
                  <select
                    value={discId}
                    onChange={(e) => setDiscId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  >
                    <option value="">Geral / Sem disciplina</option>
                    {disciplinas.map(d => (
                      <option key={d.id} value={d.id}>{d.nome}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Data:</label>
                  <input
                    type="date"
                    value={dataEvento}
                    onChange={(e) => setDataEvento(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Horário (opcional):</label>
                  <input
                    type="time"
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Descrição / Instruções:</label>
                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  rows={2}
                  placeholder="Ex: Conteúdo dos capítulos 1 a 4, levar calculadora..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalNovo(false)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold"
                >
                  Salvar Compromisso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
