import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

function loadJson(filename) {
  const filePath = path.resolve('src/data', filename);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

test('Integridade dos Dados: Parsing e estrutura básica de todos os JSONs em src/data', () => {
  const files = [
    'disciplinas.json',
    'faculdade.json',
    'kahoots.json',
    'modulos.json',
    'notas.json',
    'projetos.json',
    'resumos.json'
  ];

  for (const file of files) {
    const data = loadJson(file);
    assert.ok(data !== null && typeof data === 'object', `${file} deve ser um JSON válido`);
  }
});

test('Integridade dos Dados: Relações referenciais entre Disciplinas, Módulos e Resumos', () => {
  const disciplinas = loadJson('disciplinas.json');
  const modulos = loadJson('modulos.json');
  const resumos = loadJson('resumos.json');
  const kahoots = loadJson('kahoots.json');

  assert.ok(Array.isArray(disciplinas), 'disciplinas.json deve ser array');
  assert.ok(Array.isArray(modulos), 'modulos.json deve ser array');
  assert.ok(Array.isArray(resumos), 'resumos.json deve ser array');
  assert.ok(Array.isArray(kahoots), 'kahoots.json deve ser array');

  const discIds = new Set(disciplinas.map(d => d.id));
  assert.equal(discIds.size, disciplinas.length, 'IDs de disciplinas devem ser únicos');

  // Módulos devem apontar para disciplinas existentes
  for (const m of modulos) {
    assert.ok(m.id, `Módulo ${m.nome} deve ter id`);
    assert.ok(discIds.has(m.disciplinaId), `Módulo ${m.id} faz referência a disciplina inexistente: ${m.disciplinaId}`);
  }

  // Resumos devem apontar para disciplinas existentes
  for (const r of resumos) {
    assert.ok(r.id, `Resumo ${r.titulo} deve ter id`);
    assert.ok(discIds.has(r.disciplinaId), `Resumo ${r.id} faz referência a disciplina inexistente: ${r.disciplinaId}`);
  }

  // Kahoots devem ter questões válidas e disciplina existente
  for (const k of kahoots) {
    assert.ok(k.id, `Kahoot ${k.titulo} deve ter id`);
    assert.ok(discIds.has(k.disciplinaId), `Kahoot ${k.id} aponta para disciplina inexistente: ${k.disciplinaId}`);
    assert.ok(Array.isArray(k.questoes), `Kahoot ${k.id} deve ter array de questões`);
    
    for (const [idx, q] of k.questoes.entries()) {
      assert.ok(q.pergunta, `Questão ${idx} do kahoot ${k.id} sem pergunta`);
      const hasCorretaString = typeof q.respostaCorreta === 'string' && q.respostaCorreta.length > 0;
      const hasOpcoesArray = Array.isArray(q.opcoes) && q.opcoes.length >= 2 && typeof q.correta === 'number';
      assert.ok(
        hasCorretaString || hasOpcoesArray,
        `Questão ${idx} do kahoot ${k.id} deve ter 'respostaCorreta' válida ou 'opcoes' e índice 'correta'`
      );
    }
  }
});

test('Integridade dos Dados: Notas e Projetos com campos essenciais', () => {
  const notas = loadJson('notas.json');
  const projetos = loadJson('projetos.json');

  assert.ok(Array.isArray(notas), 'notas.json deve ser array');
  assert.ok(Array.isArray(projetos), 'projetos.json deve ser array');

  for (const nota of notas) {
    assert.ok(nota.id, 'Nota deve ter ID');
    assert.ok(nota.titulo, 'Nota deve ter título');
    assert.ok(nota.categoria, 'Nota deve ter categoria');
  }

  for (const p of projetos) {
    assert.ok(p.id, 'Projeto deve ter ID');
    assert.ok(p.nome, 'Projeto deve ter nome');
  }
});
