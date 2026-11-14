/**
 * useFlashcards.js
 * Gerenciamento da Central de Flashcards e integração com revisão espaçada.
 */

import { useState } from 'react';
import { getItem, setItem } from '../services/storageService';

export function useFlashcards(recordSM2Review) {
  const [flashcards, setFlashcardsState] = useState(() => getItem('flashcards', []));

  const setFlashcards = (data) => {
    setFlashcardsState(data);
    setItem('flashcards', data);
  };

  const addFlashcard = (card) => {
    const novo = {
      id: card.id || `fc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      frente: card.frente.trim(),
      verso: card.verso.trim(),
      disciplinaId: card.disciplinaId,
      moduloId: card.moduloId || '',
      assunto: card.assunto || '',
      tags: card.tags || [],
      favorito: Boolean(card.favorito),
      origem: card.origem || 'manual',
      dataCriacao: card.dataCriacao || new Date().toISOString().split('T')[0]
    };
    const updated = [novo, ...flashcards];
    setFlashcards(updated);
    return novo;
  };

  const updateFlashcard = (id, fields) => {
    const updated = flashcards.map(f => f.id === id ? { ...f, ...fields } : f);
    setFlashcards(updated);
  };

  const deleteFlashcard = (id) => {
    const updated = flashcards.filter(f => f.id !== id);
    setFlashcards(updated);
  };

  const toggleFlashcardFavorite = (id) => {
    const card = flashcards.find(f => f.id === id);
    if (card) {
      updateFlashcard(id, { favorito: !card.favorito });
    }
  };

  /**
   * Converte questões de Kahoot em Flashcards
   */
  const importFromKahoot = (kahoot) => {
    if (!kahoot || !kahoot.questoes || kahoot.questoes.length === 0) return 0;
    let count = 0;
    const novos = [];

    kahoot.questoes.forEach(q => {
      // Verifica se já existe para evitar duplicata
      const jaExiste = flashcards.some(f => f.frente.toLowerCase() === q.pergunta.toLowerCase());
      if (!jaExiste) {
        novos.push({
          id: `fc_kahoot_${Date.now()}_${++count}`,
          frente: q.pergunta,
          verso: `${q.respostaCorreta}${q.explicacao ? `\n\n💡 Explicação: ${q.explicacao}` : ''}`,
          disciplinaId: kahoot.disciplinaId,
          moduloId: kahoot.moduloId || '',
          assunto: kahoot.titulo,
          tags: ['Kahoot', 'Quiz'],
          favorito: false,
          origem: 'kahoot',
          dataCriacao: new Date().toISOString().split('T')[0]
        });
      }
    });

    if (novos.length > 0) {
      setFlashcards([...novos, ...flashcards]);
    }
    return novos.length;
  };

  /**
   * Converte definições de módulo ou seções de resumo em Flashcards
   */
  const importFromModulo = (modulo) => {
    if (!modulo || !modulo.definicoes || modulo.definicoes.length === 0) return 0;
    let count = 0;
    const novos = [];

    modulo.definicoes.forEach(d => {
      const jaExiste = flashcards.some(f => f.frente.toLowerCase() === `O que é: ${d.termo}`.toLowerCase());
      if (!jaExiste) {
        novos.push({
          id: `fc_mod_${Date.now()}_${++count}`,
          frente: `O que é: ${d.termo}?`,
          verso: d.significado,
          disciplinaId: modulo.disciplinaId,
          moduloId: modulo.id,
          assunto: modulo.titulo,
          tags: ['Definição', 'Conceito'],
          favorito: false,
          origem: 'modulo',
          dataCriacao: new Date().toISOString().split('T')[0]
        });
      }
    });

    if (novos.length > 0) {
      setFlashcards([...novos, ...flashcards]);
    }
    return novos.length;
  };

  return {
    flashcards,
    setFlashcards,
    addFlashcard,
    updateFlashcard,
    deleteFlashcard,
    toggleFlashcardFavorite,
    importFromKahoot,
    importFromModulo
  };
}
