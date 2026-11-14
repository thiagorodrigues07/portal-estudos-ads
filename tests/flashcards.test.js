import test from 'node:test';
import assert from 'node:assert/strict';

/**
 * Funções de domínio para Flashcards:
 * - Conversão de questões de Kahoot para Flashcards
 * - Conversão de conceitos de resumo para Flashcards
 * - Filtros por disciplina, tag e favoritos
 */

function convertKahootToFlashcards(kahoot) {
  if (!kahoot || !Array.isArray(kahoot.questoes)) return [];

  return kahoot.questoes.map((q, idx) => {
    const correctAnswerText = q.opcoes && q.opcoes[q.correta] !== undefined 
      ? q.opcoes[q.correta] 
      : 'Resposta correta';

    const backText = q.explicacao 
      ? `${correctAnswerText}\n\n💡 Explicação: ${q.explicacao}`
      : correctAnswerText;

    return {
      id: `fc-k-${kahoot.id}-${idx}-${Date.now()}`,
      frente: q.pergunta,
      verso: backText,
      disciplinaId: kahoot.disciplinaId,
      moduloId: kahoot.moduloId || null,
      tags: ['kahoot-import', kahoot.disciplinaId].filter(Boolean),
      origem: 'kahoot',
      origemId: kahoot.id,
      favorito: false,
      criadoEm: new Date().toISOString()
    };
  });
}

function filterFlashcards(flashcards, { search = '', disciplinaId = 'todos', apenasFavoritos = false }) {
  const normSearch = search.trim().toLowerCase();

  return flashcards.filter(card => {
    if (disciplinaId !== 'todos' && card.disciplinaId !== disciplinaId) {
      return false;
    }
    if (apenasFavoritos && !card.favorito) {
      return false;
    }
    if (normSearch) {
      const matchFront = (card.frente || '').toLowerCase().includes(normSearch);
      const matchBack = (card.verso || '').toLowerCase().includes(normSearch);
      const matchTags = (card.tags || []).some(t => t.toLowerCase().includes(normSearch));
      if (!matchFront && !matchBack && !matchTags) return false;
    }
    return true;
  });
}

test('Flashcards: Conversão automatizada de Kahoot para Flashcard com explicação', () => {
  const mockKahoot = {
    id: 'k-poo-01',
    disciplinaId: 'prog-orientada-objetos',
    moduloId: 'mod-encapsulamento',
    questoes: [
      {
        id: 'q1',
        pergunta: 'Qual modificador garante que o atributo seja visível apenas na própria classe?',
        opcoes: ['public', 'protected', 'private', 'package-private'],
        correta: 2,
        explicacao: 'O modificador private restringe o acesso direto apenas aos membros da própria classe.'
      }
    ]
  };

  const cards = convertKahootToFlashcards(mockKahoot);
  assert.equal(cards.length, 1);
  assert.equal(cards[0].frente, 'Qual modificador garante que o atributo seja visível apenas na própria classe?');
  assert.ok(cards[0].verso.includes('private'));
  assert.ok(cards[0].verso.includes('💡 Explicação: O modificador private restringe'));
  assert.equal(cards[0].disciplinaId, 'prog-orientada-objetos');
  assert.equal(cards[0].origem, 'kahoot');
});

test('Flashcards: Filtro por disciplina, termo de busca e favoritos', () => {
  const cards = [
    { id: '1', frente: 'O que é ACID?', verso: 'Atomicidade, Consistência...', disciplinaId: 'banco-dados', favorito: true, tags: ['sql'] },
    { id: '2', frente: 'O que é Herança?', verso: 'Reutilização de código...', disciplinaId: 'poo', favorito: false, tags: ['oop'] },
    { id: '3', frente: 'O que é JOIN?', verso: 'Junção de tabelas...', disciplinaId: 'banco-dados', favorito: false, tags: ['sql'] }
  ];

  // Filtro por disciplina
  const dbCards = filterFlashcards(cards, { disciplinaId: 'banco-dados' });
  assert.equal(dbCards.length, 2);

  // Filtro por busca
  const acidCards = filterFlashcards(cards, { search: 'ACID' });
  assert.equal(acidCards.length, 1);
  assert.equal(acidCards[0].id, '1');

  // Filtro por favorito
  const favCards = filterFlashcards(cards, { apenasFavoritos: true });
  assert.equal(favCards.length, 1);
  assert.equal(favCards[0].id, '1');

  // Combinação
  const emptyMatch = filterFlashcards(cards, { disciplinaId: 'poo', apenasFavoritos: true });
  assert.equal(emptyMatch.length, 0);
});
