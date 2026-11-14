import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

// Mock de localStorage em memória para os testes
class LocalStorageMock {
  constructor() {
    this.store = {};
  }
  clear() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
}

globalThis.localStorage = new LocalStorageMock();

import { getItem, setItem, createAutoSnapshot, getSnapshotHistory } from '../src/services/storageService.js';
import { CURRENT_STORAGE_PREFIX } from '../src/services/migrationService.js';

describe('Camada de Persistência (storageService)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('deve retornar defaultData quando chave não existir', () => {
    const val = getItem('disciplinas', [{ id: 'padrao' }]);
    assert.deepEqual(val, [{ id: 'padrao' }]);
  });

  it('deve gravar e recuperar dados com o prefixo correto', () => {
    const dados = [{ id: 'disc-1', nome: 'Algoritmos' }];
    const ok = setItem('disciplinas', dados);

    assert.equal(ok, true);
    assert.ok(localStorage.getItem(`${CURRENT_STORAGE_PREFIX}disciplinas`));

    const recuperado = getItem('disciplinas', []);
    assert.deepEqual(recuperado, dados);
  });

  it('deve realizar merge seguro adicionando novos itens padrão sem sobrescrever customizações', () => {
    // Aluno alterou a disciplina disc-1
    const salvos = [{ id: 'disc-1', nome: 'Algoritmos Alterado' }];
    setItem('disciplinas', salvos);

    // Sistema tem default com disc-1 e uma nova disc-2
    const padrao = [
      { id: 'disc-1', nome: 'Algoritmos Original' },
      { id: 'disc-2', nome: 'Banco de Dados' }
    ];

    const resultado = getItem('disciplinas', padrao);
    assert.equal(resultado.length, 2);
    assert.equal(resultado.find(d => d.id === 'disc-1').nome, 'Algoritmos Alterado');
    assert.equal(resultado.find(d => d.id === 'disc-2').nome, 'Banco de Dados');
  });

  it('deve retornar defaultData de forma graciosa se o JSON estiver corrompido', () => {
    localStorage.setItem(`${CURRENT_STORAGE_PREFIX}corrompido`, '{ invalid json ...');
    const recuperado = getItem('corrompido', { seguro: true });
    assert.deepEqual(recuperado, { seguro: true });
  });

  it('deve registrar histórico de snapshots automáticos e permitir consulta', () => {
    createAutoSnapshot('Ponto 1');
    createAutoSnapshot('Ponto 2');

    const history = getSnapshotHistory();
    assert.equal(history.length, 2);
    assert.equal(history[0].label, 'Ponto 2');
    assert.equal(history[1].label, 'Ponto 1');
  });
});
