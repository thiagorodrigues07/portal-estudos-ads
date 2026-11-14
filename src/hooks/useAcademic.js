/**
 * useAcademic.js
 * Gerenciamento de Disciplinas, Módulos e Dados Institucionais da Faculdade.
 */

import { useState } from 'react';
import faculdadeData from '../data/faculdade.json';
import disciplinasData from '../data/disciplinas.json';
import modulosData from '../data/modulos.json';
import { getItem, setItem } from '../services/storageService';

export function useAcademic() {
  const [faculdade, setFaculdadeState] = useState(() => getItem('faculdade', faculdadeData));
  const [disciplinas, setDisciplinasState] = useState(() => getItem('disciplinas', disciplinasData));
  const [modulos, setModulosState] = useState(() => getItem('modulos', modulosData));

  const setFaculdade = (data) => {
    setFaculdadeState(data);
    setItem('faculdade', data);
  };

  const setDisciplinas = (data) => {
    setDisciplinasState(data);
    setItem('disciplinas', data);
  };

  const setModulos = (data) => {
    setModulosState(data);
    setItem('modulos', data);
  };

  const addDisciplina = (novaDisc) => {
    const updated = [...disciplinas, novaDisc];
    setDisciplinas(updated);
  };

  const updateDisciplina = (id, fields) => {
    const updated = disciplinas.map(d => d.id === id ? { ...d, ...fields } : d);
    setDisciplinas(updated);
  };

  const deleteDisciplina = (id) => {
    const updated = disciplinas.filter(d => d.id !== id);
    setDisciplinas(updated);
  };

  const addModule = (novoModulo) => {
    const updated = [...modulos, novoModulo];
    setModulos(updated);
  };

  const updateModule = (id, fields) => {
    const updated = modulos.map(m => m.id === id ? { ...m, ...fields } : m);
    setModulos(updated);
  };

  const deleteModule = (id) => {
    const updated = modulos.filter(m => m.id !== id);
    setModulos(updated);
  };

  const setModuleManualStatus = (moduleId, newStatus) => {
    updateModule(moduleId, { status: newStatus });
  };

  return {
    faculdade,
    setFaculdade,
    disciplinas,
    setDisciplinas,
    addDisciplina,
    updateDisciplina,
    deleteDisciplina,
    modulos,
    setModulos,
    addModule,
    updateModule,
    deleteModule,
    setModuleManualStatus
  };
}
