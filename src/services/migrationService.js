/**
 * migrationService.js
 * Gerencia o versionamento de schema e migrações automáticas de dados locais.
 */

export const CURRENT_DATA_VERSION = '3.0.0';
export const LEGACY_STORAGE_PREFIX = 'portal_ads_v2_';
export const CURRENT_STORAGE_PREFIX = 'portal_ads_v3_';

/**
 * Realiza a migração automática entre versões de armazenamento
 */
export function runMigrations() {
  try {
    const installedVersion = localStorage.getItem(`${CURRENT_STORAGE_PREFIX}schema_version`);

    if (installedVersion === CURRENT_DATA_VERSION) {
      return { migrated: false, version: CURRENT_DATA_VERSION };
    }

    // Se encontramos dados na v2, copiamos e enriquecemos para a v3
    const legacyKeys = [
      'faculdade',
      'disciplinas',
      'modulos',
      'resumos',
      'kahoots',
      'notas',
      'projetos',
      'attempts',
      'spaced_reviews',
      'spaced_intervals',
      'favorites',
      'faculdade_anotacoes',
      'theme'
    ];

    let hasLegacy = false;
    legacyKeys.forEach(k => {
      const oldVal = localStorage.getItem(`${LEGACY_STORAGE_PREFIX}${k}`);
      if (oldVal !== null) {
        hasLegacy = true;
        // Se ainda não foi gravado na v3, copia
        if (localStorage.getItem(`${CURRENT_STORAGE_PREFIX}${k}`) === null) {
          localStorage.setItem(`${CURRENT_STORAGE_PREFIX}${k}`, oldVal);
        }
      }
    });

    // Migração de revisões para formato SM-2 enriquecido
    try {
      const rawReviews = localStorage.getItem(`${CURRENT_STORAGE_PREFIX}spaced_reviews`);
      if (rawReviews) {
        const reviewsObj = JSON.parse(rawReviews);
        let updated = false;

        Object.keys(reviewsObj).forEach(id => {
          const r = reviewsObj[id];
          if (r && r.repetitionNumber === undefined) {
            // Converte estágio 0..4 antigo em SM-2 compatível
            r.repetitionNumber = r.stage || 0;
            r.easeFactor = r.easeFactor || 2.5; // Padrão SM-2
            r.intervalDays = r.intervalDays || (r.stage === 0 ? 0 : r.stage === 1 ? 1 : r.stage === 2 ? 3 : 7);
            updated = true;
          }
        });

        if (updated) {
          localStorage.setItem(`${CURRENT_STORAGE_PREFIX}spaced_reviews`, JSON.stringify(reviewsObj));
        }
      }
    } catch (migErr) {
      console.warn('Aviso durante migração de spaced_reviews:', migErr);
    }

    // Inicializa novas coleções da v3 se não existirem
    if (localStorage.getItem(`${CURRENT_STORAGE_PREFIX}flashcards`) === null) {
      localStorage.setItem(`${CURRENT_STORAGE_PREFIX}flashcards`, JSON.stringify([]));
    }
    if (localStorage.getItem(`${CURRENT_STORAGE_PREFIX}eventos_calendario`) === null) {
      localStorage.setItem(`${CURRENT_STORAGE_PREFIX}eventos_calendario`, JSON.stringify([]));
    }
    if (localStorage.getItem(`${CURRENT_STORAGE_PREFIX}estudos_tempo`) === null) {
      localStorage.setItem(`${CURRENT_STORAGE_PREFIX}estudos_tempo`, JSON.stringify({ horasTotais: 0, sessoes: [] }));
    }

    localStorage.setItem(`${CURRENT_STORAGE_PREFIX}schema_version`, CURRENT_DATA_VERSION);
    return { migrated: true, fromLegacy: hasLegacy, version: CURRENT_DATA_VERSION };
  } catch (err) {
    console.error('Erro na execução de migrações:', err);
    return { migrated: false, error: err.message };
  }
}
