/**
 * useSpacedRepetition.js
 * Hook dedicado ao algoritmo SM-2 e ciclo de revisões espaçadas.
 */

import { useState } from 'react';
import { getItem, setItem } from '../services/storageService';
import { calculateSM2, getTodayDateString, addDays, SM2_GRADES } from '../services/sm2Service';

export function useSpacedRepetition(onItemReviewed) {
  const [spacedReviews, setSpacedReviewsState] = useState(() => getItem('spaced_reviews', {}));
  const [spacedIntervals, setSpacedIntervalsState] = useState(() => getItem('spaced_intervals', [0, 1, 3, 7, 14]));

  const setSpacedReviews = (data) => {
    setSpacedReviewsState(data);
    setItem('spaced_reviews', data);
  };

  const updateSpacedIntervals = (newIntervals) => {
    setSpacedIntervalsState(newIntervals);
    setItem('spaced_intervals', newIntervals);
  };

  /**
   * Avalia um item pelo SM-2 clássico com as 4 notas
   * grade: 1 (Novamente), 3 (Difícil), 4 (Bom), 5 (Fácil)
   */
  const recordSM2Review = (itemId, tipo, grade, { notes = '', titulo = '', disciplinaId = '', moduloId = '' } = {}) => {
    const today = getTodayDateString();
    const current = spacedReviews[itemId] || {
      id: itemId,
      tipo,
      stage: 0,
      repetitions: 0,
      easeFactor: 2.5,
      intervalDays: 1,
      nextReviewDate: today,
      status: 'nao_iniciado',
      history: []
    };

    const sm2Result = calculateSM2(current, grade, today);

    const updated = {
      ...current,
      ...sm2Result,
      id: itemId,
      tipo: current.tipo || tipo,
      titulo: titulo || current.titulo || '',
      disciplinaId: disciplinaId || current.disciplinaId || '',
      moduloId: moduloId || current.moduloId || '',
      history: [
        {
          data: today,
          grade,
          repetitions: sm2Result.repetitions,
          intervalDays: sm2Result.intervalDays,
          easeFactor: sm2Result.easeFactor,
          notes
        },
        ...(current.history || [])
      ]
    };

    const updatedMap = { ...spacedReviews, [itemId]: updated };
    setSpacedReviews(updatedMap);

    if (onItemReviewed) {
      onItemReviewed(itemId, tipo, updated);
    }

    return updated;
  };

  /**
   * Mantém retrocompatibilidade com a API antiga `recordSpacedReview`
   */
  const recordSpacedReview = (itemId, tipo, { status, nextDate, notes, stageIncrement = true, grade = SM2_GRADES.GOOD }) => {
    return recordSM2Review(itemId, tipo, grade, { notes });
  };

  const todayStr = getTodayDateString();

  const getDueReviews = () => {
    const items = [];
    Object.values(spacedReviews).forEach(rev => {
      if (rev.status === 'dominado') return;
      if (rev.nextReviewDate && rev.nextReviewDate <= todayStr) {
        items.push(rev);
      }
    });
    return items.sort((a, b) => a.nextReviewDate.localeCompare(b.nextReviewDate));
  };

  const getOverdueReviews = () => {
    return getDueReviews().filter(item => item.nextReviewDate < todayStr);
  };

  const getDueTodayReviews = () => {
    return getDueReviews().filter(item => item.nextReviewDate === todayStr);
  };

  const getFutureReviews = () => {
    const items = [];
    Object.values(spacedReviews).forEach(rev => {
      if (rev.nextReviewDate && rev.nextReviewDate > todayStr) {
        items.push(rev);
      }
    });
    return items.sort((a, b) => a.nextReviewDate.localeCompare(b.nextReviewDate));
  };

  return {
    spacedReviews,
    setSpacedReviews,
    spacedIntervals,
    updateSpacedIntervals,
    recordSM2Review,
    recordSpacedReview,
    getDueReviews,
    getOverdueReviews,
    getDueTodayReviews,
    getFutureReviews,
    todayStr
  };
}
