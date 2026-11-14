import test from 'node:test';
import assert from 'node:assert/strict';

/**
 * Utilitários de lógica de negócio testados:
 * - Detecção de duplicatas
 * - Cálculo de pontuação e estatísticas
 * - Validação de integridade de questões
 */

function detectDuplicateQuestions(existingQuestions, newQuestions) {
  const normalize = (text) => (text || '').trim().toLowerCase().replace(/\s+/g, ' ');
  const existingSet = new Set(existingQuestions.map(q => normalize(q.pergunta)));
  
  const duplicates = [];
  const unique = [];

  for (const q of newQuestions) {
    const norm = normalize(q.pergunta);
    if (existingSet.has(norm)) {
      duplicates.push(q);
    } else {
      unique.push(q);
      existingSet.add(norm); // evita duplicatas dentro do próprio lote novo
    }
  }

  return { duplicates, unique };
}

function calculateQuizScore(questions, userAnswers) {
  let correct = 0;
  let incorrect = 0;
  const details = [];

  for (const q of questions) {
    const chosenIndex = userAnswers[q.id];
    const isAnswered = chosenIndex !== undefined && chosenIndex !== null;
    const isCorrect = isAnswered && chosenIndex === q.correta;

    if (isCorrect) correct++;
    else incorrect++;

    details.push({
      questionId: q.id,
      chosenIndex,
      correctIndex: q.correta,
      isCorrect,
      explanation: q.explicacao || ''
    });
  }

  const total = questions.length;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  return {
    total,
    correct,
    incorrect,
    percentage,
    passed: percentage >= 70,
    details
  };
}

function validateKahootStructure(kahoot) {
  const errors = [];
  if (!kahoot.id || typeof kahoot.id !== 'string') errors.push('ID inválido');
  if (!kahoot.titulo || typeof kahoot.titulo !== 'string') errors.push('Título obrigatório');
  if (!kahoot.disciplinaId) errors.push('Disciplina obrigatória');
  if (!Array.isArray(kahoot.questoes) || kahoot.questoes.length === 0) {
    errors.push('O Kahoot deve possuir pelo menos 1 questão');
  } else {
    kahoot.questoes.forEach((q, idx) => {
      if (!q.pergunta) errors.push(`Questão ${idx + 1}: texto da pergunta vazio`);
      if (!Array.isArray(q.opcoes) || q.opcoes.length < 2) errors.push(`Questão ${idx + 1}: precisa de no mínimo 2 opções`);
      if (typeof q.correta !== 'number' || q.correta < 0 || q.correta >= (q.opcoes?.length || 0)) {
        errors.push(`Questão ${idx + 1}: índice correto inválido`);
      }
    });
  }
  return { valid: errors.length === 0, errors };
}

test('Kahoot & Simulado: Detecção de questões duplicadas', () => {
  const existing = [
    { id: 'q1', pergunta: 'O que é polimorfismo?' },
    { id: 'q2', pergunta: 'Qual a complexidade do algoritmo QuickSort?' }
  ];

  const incoming = [
    { id: 'q3', pergunta: '  o que é polimorfismo?  ' }, // duplicada (case/whitespace)
    { id: 'q4', pergunta: 'O que é encapsulamento?' },      // nova
    { id: 'q5', pergunta: 'O que é encapsulamento?' }       // duplicada dentro do lote
  ];

  const { duplicates, unique } = detectDuplicateQuestions(existing, incoming);

  assert.equal(duplicates.length, 2);
  assert.equal(unique.length, 1);
  assert.equal(unique[0].pergunta, 'O que é encapsulamento?');
});

test('Kahoot & Simulado: Cálculo de score de tentativa no modo simulado', () => {
  const questions = [
    { id: 'q1', pergunta: 'Q1', opcoes: ['A', 'B', 'C', 'D'], correta: 0 },
    { id: 'q2', pergunta: 'Q2', opcoes: ['A', 'B', 'C', 'D'], correta: 2 },
    { id: 'q3', pergunta: 'Q3', opcoes: ['A', 'B', 'C', 'D'], correta: 3 },
    { id: 'q4', pergunta: 'Q4', opcoes: ['A', 'B', 'C', 'D'], correta: 1 }
  ];

  const userAnswers = {
    q1: 0, // acerto
    q2: 1, // erro (era 2)
    q3: 3, // acerto
    q4: 0  // erro (era 1)
  };

  const result = calculateQuizScore(questions, userAnswers);

  assert.equal(result.total, 4);
  assert.equal(result.correct, 2);
  assert.equal(result.incorrect, 2);
  assert.equal(result.percentage, 50);
  assert.equal(result.passed, false);
});

test('Kahoot & Simulado: Validação de estrutura e opções', () => {
  const validKahoot = {
    id: 'k1',
    titulo: 'Banco de Dados Relacional',
    disciplinaId: 'banco-dados',
    questoes: [
      { id: 'q1', pergunta: 'O que é chave primária?', opcoes: ['Identificador único', 'Chave estrangeira'], correta: 0 }
    ]
  };

  const invalidKahoot = {
    id: '',
    titulo: '',
    questoes: []
  };

  assert.equal(validateKahootStructure(validKahoot).valid, true);
  
  const invalidResult = validateKahootStructure(invalidKahoot);
  assert.equal(invalidResult.valid, false);
  assert.ok(invalidResult.errors.length >= 3);
});
