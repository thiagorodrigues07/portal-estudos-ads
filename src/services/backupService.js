/**
 * backupService.js
 * Central de exportação, importação e restauração de dados com validação.
 */

import { validateBackupPayload } from '../schemas/dataSchemas.js';
import { CURRENT_DATA_VERSION } from './migrationService.js';
import { createAutoSnapshot } from './storageService.js';

/**
 * Monta o payload de backup completo
 */
export function buildBackupPayload(state) {
  return {
    version: CURRENT_DATA_VERSION,
    exportedAt: new Date().toISOString(),
    faculdade: state.faculdade,
    disciplinas: state.disciplinas,
    modulos: state.modulos,
    resumos: state.resumos,
    kahoots: state.kahoots,
    notas: state.notas,
    projetos: state.projetos,
    attempts: state.attempts,
    spacedReviews: state.spacedReviews,
    spacedIntervals: state.spacedIntervals,
    favorites: state.favorites,
    faculdadeAnotacoes: state.faculdadeAnotacoes,
    flashcards: state.flashcards || [],
    eventosCalendario: state.eventosCalendario || [],
    estudosTempo: state.estudosTempo || { horasTotais: 0, sessoes: [] }
  };
}

/**
 * Valida e processa a importação de um backup
 */
export function parseAndValidateBackup(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    const validation = validateBackupPayload(parsed);

    if (!validation.valid) {
      return { sucesso: false, erro: validation.error };
    }

    // Cria um snapshot de segurança antes de aplicar a restauração
    createAutoSnapshot('Pré-Restauração de Backup');

    return {
      sucesso: true,
      data: parsed,
      resumo: {
        versao: parsed.version || '2.0',
        disciplinas: parsed.disciplinas?.length || 0,
        modulos: parsed.modulos?.length || 0,
        kahoots: parsed.kahoots?.length || 0,
        resumos: parsed.resumos?.length || 0,
        tentativas: Object.keys(parsed.attempts || {}).length,
        flashcards: parsed.flashcards?.length || 0,
        eventos: parsed.eventosCalendario?.length || 0,
        notas: parsed.notas?.length || 0,
        projetos: parsed.projetos?.length || 0
      }
    };
  } catch (error) {
    return { sucesso: false, erro: `JSON inválido ou corrompido: ${error.message}` };
  }
}
