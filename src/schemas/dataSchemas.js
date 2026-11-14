/**
 * Schemas e Validadores de Integridade para os Dados do Portal ADS
 * Garante que dados corrompidos ou malformatados nunca quebrem a aplicação.
 */

export const validateDisciplina = (item) => {
  if (!item || typeof item !== 'object') return false;
  return Boolean(
    typeof item.id === 'string' &&
    item.id.trim().length > 0 &&
    typeof item.nome === 'string' &&
    item.nome.trim().length > 0
  );
};

export const validateModulo = (item) => {
  if (!item || typeof item !== 'object') return false;
  return Boolean(
    typeof item.id === 'string' &&
    item.id.trim().length > 0 &&
    typeof item.disciplinaId === 'string' &&
    typeof item.titulo === 'string'
  );
};

export const validateKahoot = (item) => {
  if (!item || typeof item !== 'object') return false;
  return Boolean(
    typeof item.id === 'string' &&
    item.id.trim().length > 0 &&
    typeof item.titulo === 'string' &&
    typeof item.disciplinaId === 'string' &&
    Array.isArray(item.questoes)
  );
};

export const validateResumo = (item) => {
  if (!item || typeof item !== 'object') return false;
  return Boolean(
    typeof item.id === 'string' &&
    typeof item.titulo === 'string' &&
    typeof item.disciplinaId === 'string'
  );
};

export const validateNota = (item) => {
  if (!item || typeof item !== 'object') return false;
  return Boolean(
    typeof item.id === 'string' &&
    typeof item.titulo === 'string' &&
    typeof item.conteudo === 'string'
  );
};

export const validateProjeto = (item) => {
  if (!item || typeof item !== 'object') return false;
  return Boolean(
    typeof item.id === 'string' &&
    typeof item.nome === 'string'
  );
};

export const validateFlashcard = (item) => {
  if (!item || typeof item !== 'object') return false;
  return Boolean(
    typeof item.id === 'string' &&
    typeof item.frente === 'string' &&
    item.frente.trim().length > 0 &&
    typeof item.verso === 'string' &&
    item.verso.trim().length > 0 &&
    typeof item.disciplinaId === 'string'
  );
};

export const validateEventoCalendario = (item) => {
  if (!item || typeof item !== 'object') return false;
  return Boolean(
    typeof item.id === 'string' &&
    typeof item.titulo === 'string' &&
    typeof item.data === 'string'
  );
};

export const validateSpacedReview = (item) => {
  if (!item || typeof item !== 'object') return false;
  return Boolean(
    typeof item.id === 'string' &&
    (typeof item.stage === 'number' || typeof item.repetitions === 'number')
  );
};

/**
 * Validação estrutural do arquivo de backup
 */
export const validateBackupPayload = (payload) => {
  if (!payload || typeof payload !== 'object') {
    return { valid: false, error: 'O payload de backup não é um objeto JSON válido.' };
  }

  const collections = ['disciplinas', 'modulos', 'kahoots', 'resumos', 'notas', 'projetos'];
  const errors = [];

  collections.forEach(col => {
    if (payload[col] !== undefined && !Array.isArray(payload[col])) {
      errors.push(`A coleção "${col}" deve ser um array.`);
    }
  });

  if (payload.attempts !== undefined && (typeof payload.attempts !== 'object' || Array.isArray(payload.attempts))) {
    errors.push('A propriedade "attempts" deve ser um dicionário/objeto.');
  }

  if (payload.spacedReviews !== undefined && (typeof payload.spacedReviews !== 'object' || Array.isArray(payload.spacedReviews))) {
    errors.push('A propriedade "spacedReviews" deve ser um dicionário/objeto.');
  }

  if (errors.length > 0) {
    return { valid: false, error: errors.join(' ') };
  }

  return { valid: true };
};
