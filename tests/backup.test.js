import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Mock de localStorage
class LocalStorageMock {
  constructor() { this.store = {}; }
  clear() { this.store = {}; }
  getItem(key) { return this.store[key] || null; }
  setItem(key, value) { this.store[key] = String(value); }
  removeItem(key) { delete this.store[key]; }
}
globalThis.localStorage = new LocalStorageMock();

import { buildBackupPayload, parseAndValidateBackup } from '../src/services/backupService.js';
import { validateBackupPayload } from '../src/schemas/dataSchemas.js';

describe('Backup e Restauração (backupService & schemas)', () => {
  it('deve gerar payload de backup com metadados e todas as coleções', () => {
    const mockState = {
      faculdade: { curso: 'ADS' },
      disciplinas: [{ id: 'd1', nome: 'Prog' }],
      modulos: [{ id: 'm1', titulo: 'Mod 1' }],
      resumos: [],
      kahoots: [{ id: 'k1', titulo: 'Quiz 1' }],
      notas: [],
      projetos: [],
      attempts: { k1: [{ acertos: 5, totalQuestoes: 5 }] },
      spacedReviews: {},
      flashcards: [{ id: 'fc1', frente: 'P1', verso: 'R1' }],
      eventosCalendario: [{ id: 'evt1', titulo: 'Prova' }]
    };

    const payload = buildBackupPayload(mockState);

    assert.equal(typeof payload.version, 'string');
    assert.ok(payload.exportedAt);
    assert.equal(payload.disciplinas.length, 1);
    assert.equal(payload.flashcards.length, 1);
    assert.equal(payload.eventosCalendario.length, 1);
  });

  it('deve validar positivamente um backup com schema correto', () => {
    const backupJson = JSON.stringify({
      version: '3.0.0',
      exportedAt: new Date().toISOString(),
      disciplinas: [{ id: 'd1', nome: 'Prog' }],
      modulos: [],
      kahoots: [],
      attempts: {}
    });

    const resultado = parseAndValidateBackup(backupJson);
    assert.equal(resultado.sucesso, true);
    assert.equal(resultado.resumo.disciplinas, 1);
  });

  it('deve rejeitar e retornar erro amigável se o arquivo não for JSON válido', () => {
    const invalidJson = 'arquivo corrompido';
    const resultado = parseAndValidateBackup(invalidJson);

    assert.equal(resultado.sucesso, false);
    assert.ok(resultado.erro.includes('JSON inválido'));
  });

  it('deve rejeitar se as coleções não forem arrays', () => {
    const invalidSchema = {
      disciplinas: 'deveria ser array',
      modulos: 123
    };

    const val = validateBackupPayload(invalidSchema);
    assert.equal(val.valid, false);
    assert.ok(val.error.includes('deve ser um array'));
  });
});
