/**
 * useStudyTimer.js
 * Rastreamento de horas de estudo, sessões de foco e histórico de produtividade.
 */

import { useState } from 'react';
import { getItem, setItem } from '../services/storageService';
import { getTodayDateString } from '../services/sm2Service';

export function useStudyTimer() {
  const [estudosTempo, setEstudosTempoState] = useState(() => getItem('estudos_tempo', {
    horasTotais: 0,
    minutosTotais: 0,
    sessoes: []
  }));

  const setEstudosTempo = (data) => {
    setEstudosTempoState(data);
    setItem('estudos_tempo', data);
  };

  const registrarSessao = (minutos, { disciplinaId = '', moduloId = '', tipo = 'estudo', notas = '' } = {}) => {
    const mins = Math.max(1, Number(minutos) || 1);
    const today = getTodayDateString();

    const novaSessao = {
      id: `ses_${Date.now()}`,
      data: today,
      minutos: mins,
      disciplinaId,
      moduloId,
      tipo,
      notas
    };

    const sessoesAtualizadas = [novaSessao, ...(estudosTempo.sessoes || [])];
    const totalMinutos = (estudosTempo.minutosTotais || 0) + mins;
    const horasTotais = Number((totalMinutos / 60).toFixed(1));

    const updated = {
      minutosTotais: totalMinutos,
      horasTotais,
      sessoes: sessoesAtualizadas
    };

    setEstudosTempo(updated);
    return novaSessao;
  };

  /**
   * Retorna os minutos estudados nos últimos 7 dias
   */
  const getProdutividadeSemanal = () => {
    const dias = [];
    const hoje = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(hoje);
      d.setDate(d.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dataStr = `${year}-${month}-${day}`;
      const diaSemana = d.toLocaleDateString('pt-BR', { weekday: 'short' });

      const totalDia = (estudosTempo.sessoes || [])
        .filter(s => s.data === dataStr)
        .reduce((acc, cur) => acc + (cur.minutos || 0), 0);

      dias.push({
        data: dataStr,
        diaSemana: diaSemana.replace('.', ''),
        minutos: totalDia,
        horas: Number((totalDia / 60).toFixed(1))
      });
    }

    return dias;
  };

  return {
    estudosTempo,
    registrarSessao,
    getProdutividadeSemanal
  };
}
