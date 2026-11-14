import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateSM2, SM2_GRADES, addDays } from '../src/services/sm2Service.js';

describe('Algoritmo SM-2 (SuperMemo-2)', () => {
  it('deve reiniciar repetições e agendar para 1 dia ao escolher "Novamente" (AGAIN)', () => {
    const current = {
      repetitions: 3,
      easeFactor: 2.5,
      intervalDays: 7,
      stage: 3
    };

    const result = calculateSM2(current, SM2_GRADES.AGAIN, '2026-03-01');

    assert.equal(result.repetitions, 0);
    assert.equal(result.intervalDays, 1);
    assert.equal(result.status, 'revisao_pendente');
    assert.equal(result.nextReviewDate, '2026-03-02');
  });

  it('deve avançar intervalo inicial para 1 dia na primeira revisão com "Bom" (GOOD)', () => {
    const current = {
      repetitions: 0,
      easeFactor: 2.5,
      intervalDays: 1
    };

    const result = calculateSM2(current, SM2_GRADES.GOOD, '2026-03-01');

    assert.equal(result.repetitions, 1);
    assert.equal(result.intervalDays, 1);
    assert.equal(result.status, 'em_revisao');
    assert.equal(result.nextReviewDate, '2026-03-02');
  });

  it('deve avançar para 6 dias na segunda repetição consecutiva com "Bom" (GOOD)', () => {
    const current = {
      repetitions: 1,
      easeFactor: 2.5,
      intervalDays: 1
    };

    const result = calculateSM2(current, SM2_GRADES.GOOD, '2026-03-01');

    assert.equal(result.repetitions, 2);
    assert.equal(result.intervalDays, 6);
    assert.equal(result.status, 'em_revisao');
    assert.equal(result.nextReviewDate, '2026-03-07');
  });

  it('deve multiplicar pelo Ease Factor nas repetições subsequentes', () => {
    const current = {
      repetitions: 2,
      easeFactor: 2.5,
      intervalDays: 6
    };

    const result = calculateSM2(current, SM2_GRADES.GOOD, '2026-03-01');

    assert.equal(result.repetitions, 3);
    assert.equal(result.intervalDays, 15); // 6 * 2.5 = 15
    assert.equal(result.nextReviewDate, '2026-03-16');
  });

  it('deve classificar como "dominado" ao atingir intervalo >= 21 dias', () => {
    const current = {
      repetitions: 3,
      easeFactor: 2.5,
      intervalDays: 15
    };

    const result = calculateSM2(current, SM2_GRADES.GOOD, '2026-03-01');

    assert.equal(result.repetitions, 4);
    assert.ok(result.intervalDays >= 21);
    assert.equal(result.status, 'dominado');
  });

  it('deve manter Ease Factor no limite mínimo de 1.3 após sucessivas dificuldades', () => {
    let current = {
      repetitions: 0,
      easeFactor: 1.4,
      intervalDays: 1
    };

    // Várias avaliações difíceis não devem deixar o EF cair abaixo de 1.3
    for (let i = 0; i < 5; i++) {
      current = calculateSM2(current, SM2_GRADES.HARD, '2026-03-01');
    }

    assert.ok(current.easeFactor >= 1.3, `Ease Factor esperado >= 1.3, obtido: ${current.easeFactor}`);
  });
});
