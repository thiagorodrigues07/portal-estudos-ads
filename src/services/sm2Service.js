/**
 * sm2Service.js
 * Implementação do algoritmo científico SM-2 (SuperMemo-2)
 * para repetição espaçada personalizada e adaptativa.
 */

// Formata data atual YYYY-MM-DD
export function getTodayDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Adiciona dias a uma data no formato YYYY-MM-DD
export function addDays(dateStr, days) {
  const base = dateStr ? new Date(`${dateStr}T12:00:00`) : new Date();
  base.setDate(base.getDate() + Math.max(1, Number(days)));
  const year = base.getFullYear();
  const month = String(base.getMonth() + 1).padStart(2, '0');
  const day = String(base.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const SM2_GRADES = {
  AGAIN: 1,  // Novamente (errou / esquecido)
  HARD: 3,   // Difícil (lembrou com muito esforço)
  GOOD: 4,   // Bom (lembrou após breve reflexão)
  EASY: 5    // Fácil (lembrou imediatamente)
};

/**
 * Calcula o próximo estado de revisão pelo algoritmo SM-2
 * @param {Object} currentReview Estado atual do item
 * @param {number} grade Nota de retenção (1=Novamente, 3=Difícil, 4=Bom, 5=Fácil)
 * @param {string} reviewDate Data da revisão (padrão hoje)
 */
export function calculateSM2(currentReview = {}, grade = SM2_GRADES.GOOD, reviewDate = getTodayDateString()) {
  let repetitions = Number(currentReview.repetitions || currentReview.stage || 0);
  let easeFactor = Number(currentReview.easeFactor || 2.5);
  let intervalDays = Number(currentReview.intervalDays || 1);
  let difficultiesCount = Number(currentReview.difficultiesCount || 0);

  // Garantir limites mínimos do Ease Factor
  if (isNaN(easeFactor) || easeFactor < 1.3) easeFactor = 1.3;

  let nextInterval = 1;
  let newRepetitions = repetitions;
  let status = 'em_revisao';

  if (grade === SM2_GRADES.AGAIN) {
    // Falha / Novamente: Reinicia a contagem de repetições consecutivas
    newRepetitions = 0;
    nextInterval = 1;
    difficultiesCount += 1;
    status = 'revisao_pendente';
  } else {
    // Sucesso (Difícil, Bom ou Fácil)
    if (repetitions === 0) {
      nextInterval = grade === SM2_GRADES.EASY ? 2 : 1;
      newRepetitions = 1;
    } else if (repetitions === 1) {
      nextInterval = grade === SM2_GRADES.EASY ? 8 : (grade === SM2_GRADES.HARD ? 3 : 6);
      newRepetitions = 2;
    } else {
      if (grade === SM2_GRADES.HARD) {
        nextInterval = Math.max(intervalDays + 1, Math.round(intervalDays * 1.2));
        difficultiesCount += 1;
      } else if (grade === SM2_GRADES.GOOD) {
        nextInterval = Math.round(intervalDays * easeFactor);
        newRepetitions = repetitions + 1;
      } else if (grade === SM2_GRADES.EASY) {
        nextInterval = Math.round(intervalDays * easeFactor * 1.3);
        newRepetitions = repetitions + 1;
      }
    }

    // Atualização do Ease Factor pela fórmula padrão SM-2:
    // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    const q = grade;
    const efDelta = 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02);
    easeFactor = Math.max(1.3, Number((easeFactor + efDelta).toFixed(3)));

    if (nextInterval >= 21 || newRepetitions >= 5) {
      status = 'dominado';
    } else {
      status = 'em_revisao';
    }
  }

  const nextReviewDate = addDays(reviewDate, nextInterval);

  return {
    repetitions: newRepetitions,
    stage: newRepetitions, // retrocompatibilidade com UI antiga
    easeFactor,
    intervalDays: nextInterval,
    lastReviewDate: reviewDate,
    nextReviewDate,
    lastGrade: grade,
    difficultiesCount,
    status
  };
}
