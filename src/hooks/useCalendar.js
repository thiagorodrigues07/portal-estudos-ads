/**
 * useCalendar.js
 * Planejamento Acadêmico, Provas, Trabalhos, Entregas e Prazos.
 */

import { useState } from 'react';
import { getItem, setItem } from '../services/storageService';
import { getTodayDateString } from '../services/sm2Service';

export function useCalendar() {
  const [eventosCalendario, setEventosState] = useState(() => getItem('eventos_calendario', [
    {
      id: 'evt_demo_1',
      titulo: 'Avaliação Regimental — Programação de Computadores',
      tipo: 'prova',
      data: '2026-04-15',
      hora: '19:30',
      disciplinaId: 'prog-computadores',
      descricao: 'Prova abrangendo variáveis, condicionais, repetições e matrizes.',
      status: 'pendente',
      prioridade: 'alta'
    },
    {
      id: 'evt_demo_2',
      titulo: 'Entrega do Mapeamento de Heurísticas de UX',
      tipo: 'trabalho',
      data: '2026-04-22',
      hora: '23:59',
      disciplinaId: 'interface-ux',
      descricao: 'Documentação de avaliação heurística de produto real em PDF.',
      status: 'em_andamento',
      prioridade: 'media'
    }
  ]));

  const setEventosCalendario = (data) => {
    setEventosState(data);
    setItem('eventos_calendario', data);
  };

  const addEvento = (evento) => {
    const novo = {
      id: evento.id || `evt_${Date.now()}`,
      titulo: evento.titulo.trim(),
      tipo: evento.tipo || 'atividade',
      data: evento.data || getTodayDateString(),
      hora: evento.hora || '',
      disciplinaId: evento.disciplinaId || '',
      descricao: evento.descricao || '',
      status: evento.status || 'pendente',
      prioridade: evento.prioridade || 'media'
    };
    const updated = [novo, ...eventosCalendario];
    setEventosCalendario(updated);
    return novo;
  };

  const updateEvento = (id, fields) => {
    const updated = eventosCalendario.map(e => e.id === id ? { ...e, ...fields } : e);
    setEventosCalendario(updated);
  };

  const deleteEvento = (id) => {
    const updated = eventosCalendario.filter(e => e.id !== id);
    setEventosCalendario(updated);
  };

  const setEventoStatus = (id, status) => {
    updateEvento(id, { status });
  };

  const today = getTodayDateString();

  // Próximos eventos (ordenados cronologicamente)
  const getUpcomingEvents = (limit = 5) => {
    return eventosCalendario
      .filter(e => e.data >= today && e.status !== 'concluido')
      .sort((a, b) => a.data.localeCompare(b.data))
      .slice(0, limit);
  };

  // Eventos atrasados
  const getOverdueEvents = () => {
    return eventosCalendario
      .filter(e => e.data < today && e.status !== 'concluido')
      .sort((a, b) => a.data.localeCompare(b.data));
  };

  return {
    eventosCalendario,
    setEventosCalendario,
    addEvento,
    updateEvento,
    deleteEvento,
    setEventoStatus,
    getUpcomingEvents,
    getOverdueEvents
  };
}
