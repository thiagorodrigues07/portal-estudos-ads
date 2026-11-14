/**
 * storageService.js
 * Camada centralizada de persistência, controle de cota, recuperação de falhas
 * e histórico rotativo de snapshots locais para o Portal de Estudos ADS.
 */

import { CURRENT_STORAGE_PREFIX } from './migrationService.js';

const MAX_SNAPSHOTS = 5;
const SNAPSHOTS_KEY = `${CURRENT_STORAGE_PREFIX}snapshots_history`;

/**
 * Lê uma chave com tratamento seguro de exceções e fallback.
 */
export function getItem(key, defaultData) {
  try {
    const raw = localStorage.getItem(`${CURRENT_STORAGE_PREFIX}${key}`);
    if (raw === null || raw === undefined) return defaultData;
    const parsed = JSON.parse(raw);

    // Merge seguro para arrays de objetos com ID
    if (Array.isArray(defaultData) && Array.isArray(parsed)) {
      const parsedMap = new Map(parsed.map(item => [item.id, item]));
      defaultData.forEach(item => {
        if (!parsedMap.has(item.id)) {
          parsedMap.set(item.id, item);
        }
      });
      return Array.from(parsedMap.values());
    }

    return parsed;
  } catch (error) {
    console.warn(`[storageService] Falha ao ler chave "${key}". Usando fallback.`, error);
    return defaultData;
  }
}

/**
 * Grava uma chave com tratamento de QuotaExceededError e integridade.
 */
export function setItem(key, data) {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(`${CURRENT_STORAGE_PREFIX}${key}`, serialized);
    return true;
  } catch (error) {
    if (error.name === 'QuotaExceededError' || error.code === 22) {
      console.error('[storageService] Cota de armazenamento excedida. Tentando limpar snapshots antigos...');
      pruneOldSnapshots();
      try {
        localStorage.setItem(`${CURRENT_STORAGE_PREFIX}${key}`, JSON.stringify(data));
        return true;
      } catch (retryError) {
        console.error('[storageService] Impossível salvar mesmo após liberação de cota.', retryError);
        return false;
      }
    }
    console.error(`[storageService] Erro ao gravar chave "${key}":`, error);
    return false;
  }
}

/**
 * Remove uma chave
 */
export function removeItem(key) {
  try {
    localStorage.removeItem(`${CURRENT_STORAGE_PREFIX}${key}`);
  } catch (error) {
    console.warn(`[storageService] Erro ao remover chave "${key}":`, error);
  }
}

/**
 * Cria um snapshot automático do estado atual no histórico rotativo
 */
export function createAutoSnapshot(label = 'Automático') {
  try {
    const snapshot = {
      id: `snap_${Date.now()}`,
      timestamp: new Date().toISOString(),
      label,
      data: {
        disciplinas: getItem('disciplinas', []),
        modulos: getItem('modulos', []),
        resumos: getItem('resumos', []),
        kahoots: getItem('kahoots', []),
        attempts: getItem('attempts', {}),
        spacedReviews: getItem('spaced_reviews', {}),
        flashcards: getItem('flashcards', []),
        eventosCalendario: getItem('eventos_calendario', []),
        notas: getItem('notas', []),
        projetos: getItem('projetos', []),
        favorites: getItem('favorites', [])
      }
    };

    const historyRaw = localStorage.getItem(SNAPSHOTS_KEY);
    const history = historyRaw ? JSON.parse(historyRaw) : [];

    // Adiciona o novo no início e limita ao máximo
    const updated = [snapshot, ...history].slice(0, MAX_SNAPSHOTS);
    localStorage.setItem(SNAPSHOTS_KEY, JSON.stringify(updated));
    return snapshot;
  } catch (e) {
    console.warn('[storageService] Erro ao criar snapshot automático:', e);
    return null;
  }
}

/**
 * Retorna os snapshots automáticos disponíveis
 */
export function getSnapshotHistory() {
  try {
    const historyRaw = localStorage.getItem(SNAPSHOTS_KEY);
    return historyRaw ? JSON.parse(historyRaw) : [];
  } catch {
    return [];
  }
}

/**
 * Remove snapshots mais antigos para liberar espaço
 */
function pruneOldSnapshots() {
  try {
    const history = getSnapshotHistory();
    if (history.length > 1) {
      const reduced = history.slice(0, 1);
      localStorage.setItem(SNAPSHOTS_KEY, JSON.stringify(reduced));
    } else {
      localStorage.removeItem(SNAPSHOTS_KEY);
    }
  } catch (e) {
    console.warn('[storageService] Erro ao podar snapshots:', e);
  }
}

/**
 * Limpa todos os dados locais
 */
export function clearAllStorage() {
  try {
    localStorage.clear();
  } catch (e) {
    console.warn('[storageService] Falha ao limpar storage:', e);
  }
}
