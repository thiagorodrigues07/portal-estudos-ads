import React, { createContext, useContext, useState, useEffect } from 'react';
import faculdadeData from '../data/faculdade.json';
import disciplinasData from '../data/disciplinas.json';
import modulosData from '../data/modulos.json';
import resumosData from '../data/resumos.json';
import kahootsData from '../data/kahoots.json';
import projetosData from '../data/projetos.json';
import notasData from '../data/notas.json';

import { getItem, setItem, clearAllStorage, getSnapshotHistory, createAutoSnapshot } from '../services/storageService';
import { runMigrations, CURRENT_STORAGE_PREFIX } from '../services/migrationService';
import { calculateSM2, getTodayDateString, addDays, SM2_GRADES } from '../services/sm2Service';
import { buildBackupPayload, parseAndValidateBackup } from '../services/backupService';
import { useAcademic } from '../hooks/useAcademic';
import { useSpacedRepetition } from '../hooks/useSpacedRepetition';
import { useFlashcards } from '../hooks/useFlashcards';
import { useCalendar } from '../hooks/useCalendar';
import { useStudyTimer } from '../hooks/useStudyTimer';

const StudyContext = createContext(null);

// Utilitário para formatar data atual no padrão YYYY-MM-DD (local)
export const getTodayString = getTodayDateString;

// Utilitário para adicionar dias a uma data
export const addDaysToDate = addDays;

export function StudyProvider({ children }) {
  // 0. Executa migrações na montagem inicial
  useEffect(() => {
    runMigrations();
  }, []);

  // 1. Tema Claro / Escuro
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem(`${CURRENT_STORAGE_PREFIX}theme`);
      if (saved) return saved === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (darkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem(`${CURRENT_STORAGE_PREFIX}theme`, 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem(`${CURRENT_STORAGE_PREFIX}theme`, 'light');
      }
    } catch (e) {
      console.warn('Erro ao salvar tema:', e);
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // 2. Módulos e Disciplinas Acadêmicas
  const academic = useAcademic();
  const {
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
  } = academic;

  // 3. Revisão Espaçada (SM-2)
  const spaced = useSpacedRepetition((itemId, tipo, updated) => {
    if (tipo === 'modulo') {
      updateModule(itemId, {
        status: updated.status,
        dataUltimaRevisao: updated.lastReviewDate
      });
    }
  });
  const {
    spacedReviews,
    setSpacedReviews,
    spacedIntervals,
    updateSpacedIntervals,
    recordSM2Review,
    recordSpacedReview,
    getDueReviews,
    getOverdueReviews,
    getDueTodayReviews,
    getFutureReviews
  } = spaced;

  // 4. Flashcards
  const flashcardHook = useFlashcards(recordSM2Review);
  const {
    flashcards,
    setFlashcards,
    addFlashcard,
    updateFlashcard,
    deleteFlashcard,
    toggleFlashcardFavorite,
    importFromKahoot,
    importFromModulo
  } = flashcardHook;

  // 5. Calendário Acadêmico
  const calendarHook = useCalendar();
  const {
    eventosCalendario,
    setEventosCalendario,
    addEvento,
    updateEvento,
    deleteEvento,
    setEventoStatus,
    getUpcomingEvents,
    getOverdueEvents
  } = calendarHook;

  // 6. Horas de Estudo e Produtividade
  const timerHook = useStudyTimer();
  const {
    estudosTempo,
    registrarSessao,
    getProdutividadeSemanal
  } = timerHook;

  // 7. Resumos
  const [resumos, setResumosState] = useState(() => getItem('resumos', resumosData));
  const setResumos = (data) => {
    setResumosState(data);
    setItem('resumos', data);
  };
  const addResumo = (novo) => setResumos([novo, ...resumos]);
  const updateResumo = (id, fields) => setResumos(resumos.map(r => r.id === id ? { ...r, ...fields } : r));
  const deleteResumo = (id) => setResumos(resumos.filter(r => r.id !== id));

  // 8. Kahoots
  const [kahoots, setKahootsState] = useState(() => getItem('kahoots', kahootsData));
  const setKahoots = (data) => {
    setKahootsState(data);
    setItem('kahoots', data);
  };
  const addKahoot = (novo) => setKahoots([novo, ...kahoots]);
  const updateKahoot = (id, fields) => setKahoots(kahoots.map(k => k.id === id ? { ...k, ...fields } : k));
  const deleteKahoot = (id) => setKahoots(kahoots.filter(k => k.id !== id));

  // 9. Histórico de Tentativas de Kahoots
  const [attempts, setAttemptsState] = useState(() => getItem('attempts', {}));
  const setAttempts = (data) => {
    setAttemptsState(data);
    setItem('attempts', data);
  };

  // 10. Notas Técnicas
  const [notas, setNotasState] = useState(() => getItem('notas', notasData));
  const setNotas = (data) => {
    setNotasState(data);
    setItem('notas', data);
  };
  const addNote = (novaNota) => setNotas([novaNota, ...notas]);
  const updateNote = (id, fields) => setNotas(notas.map(n => n.id === id ? { ...n, ...fields } : n));
  const deleteNote = (id) => setNotas(notas.filter(n => n.id !== id));

  // 11. Projetos (Portfólio)
  const [projetos, setProjetosState] = useState(() => getItem('projetos', projetosData));
  const setProjetos = (data) => {
    setProjetosState(data);
    setItem('projetos', data);
  };
  const addProjeto = (novo) => setProjetos([novo, ...projetos]);
  const updateProjeto = (id, fields) => setProjetos(projetos.map(p => p.id === id ? { ...p, ...fields } : p));
  const deleteProjeto = (id) => setProjetos(projetos.filter(p => p.id !== id));

  // 12. Favoritos & Anotações de Faculdade
  const [favorites, setFavoritesState] = useState(() => getItem('favorites', []));
  const setFavorites = (data) => {
    setFavoritesState(data);
    setItem('favorites', data);
  };
  const toggleFavorite = (id) => {
    const updated = favorites.includes(id) ? favorites.filter(item => item !== id) : [...favorites, id];
    setFavorites(updated);
  };
  const isFavorite = (id) => favorites.includes(id);

  const [faculdadeAnotacoes, setFaculdadeAnotacoesState] = useState(() => getItem('faculdade_anotacoes', []));
  const setFaculdadeAnotacoes = (data) => {
    setFaculdadeAnotacoesState(data);
    setItem('faculdade_anotacoes', data);
  };

  // --- REGISTRAR TENTATIVA DE KAHOOT (COM SM-2 ADAPTATIVO) ---
  const saveKahootAttempt = (kahootId, attemptData) => {
    const today = attemptData.data || getTodayString();
    const total = Number(attemptData.totalQuestoes) || 1;
    const acertos = Number(attemptData.acertos) || 0;
    const erros = Number(attemptData.erros) || 0;
    const percentual = Math.round((acertos / total) * 100);

    const novaTentativa = {
      id: `attempt_${Date.now()}`,
      data: today,
      totalQuestoes: total,
      acertos,
      erros,
      percentual,
      dificuldades: attemptData.dificuldades || '',
      observacoes: attemptData.observacoes || '',
      anteciparRevisao: Boolean(attemptData.anteciparRevisao)
    };

    const tentativasAnteriores = attempts[kahootId] || [];
    const novoHistorico = [novaTentativa, ...tentativasAnteriores];
    const novosAttempts = { ...attempts, [kahootId]: novoHistorico };
    setAttempts(novosAttempts);

    // Mapeamento de percentual para nota SM-2:
    // < 70% ou antecipar: AGAIN (1)
    // 70% - 84%: GOOD (4)
    // >= 85%: EASY (5)
    let sm2Grade = SM2_GRADES.GOOD;
    if (novaTentativa.anteciparRevisao || percentual < 70) {
      sm2Grade = SM2_GRADES.AGAIN;
    } else if (percentual >= 85) {
      sm2Grade = SM2_GRADES.EASY;
    }

    const kahootAtual = kahoots.find(k => k.id === kahootId);
    recordSM2Review(kahootId, 'kahoot', sm2Grade, {
      titulo: kahootAtual?.titulo,
      disciplinaId: kahootAtual?.disciplinaId,
      moduloId: kahootAtual?.moduloId,
      notes: novaTentativa.observacoes
    });

    if (kahootAtual?.moduloId) {
      updateModule(kahootAtual.moduloId, {
        status: percentual >= 85 ? 'dominado' : 'estudado',
        dataUltimaRevisao: today
      });
    }

    // Registra sessão de estudo automaticamente (estudo prático ~ 10 a 20 min)
    registrarSessao(15, {
      disciplinaId: kahootAtual?.disciplinaId,
      moduloId: kahootAtual?.moduloId,
      tipo: 'kahoot',
      notas: `Tentativa Kahoot: ${acertos}/${total} acertos (${percentual}%)`
    });

    return novaTentativa;
  };

  const getKahootAttempts = (kahootId) => {
    return attempts[kahootId] || [];
  };

  // Módulos em andamento
  const getModulesInProgress = () => {
    return modulos.filter(m => m.status === 'em_estudo' || m.status === 'estudando');
  };

  // Kahoots sem tentativa
  const getKahootsPendingFirstAttempt = () => {
    return kahoots.filter(k => !attempts[k.id] || attempts[k.id].length === 0);
  };

  // Conteúdos com dificuldades
  const getItemsWithDifficulties = () => {
    const items = [];
    kahoots.forEach(k => {
      const hist = attempts[k.id];
      if (hist && hist.length > 0) {
        const last = hist[0];
        if (last.percentual < 70 || last.anteciparRevisao || last.dificuldades) {
          items.push({
            kahoot: k,
            lastAttempt: last,
            totalAttempts: hist.length
          });
        }
      }
    });
    return items;
  };

  // --- RECOMENDAÇÕES INTELIGENTES BASEADAS EM DESEMPENHO REAL ---
  const getStudyRecommendations = () => {
    const recs = [];

    // 1. Revisões atrasadas têm prioridade absoluta
    const atrasadas = getOverdueReviews();
    if (atrasadas.length > 0) {
      recs.push({
        id: 'rec_overdue',
        tipo: 'urgente',
        titulo: `${atrasadas.length} revisão(ões) atrasada(s)`,
        descricao: 'Revise os conteúdos pendentes para evitar que a curva do esquecimento apague o conteúdo aprendido.',
        link: '/revisoes'
      });
    }

    // 2. Kahoots com pontuação baixa (< 70%)
    const comDificuldade = getItemsWithDifficulties();
    if (comDificuldade.length > 0) {
      const pior = comDificuldade[0];
      recs.push({
        id: `rec_diff_${pior.kahoot.id}`,
        tipo: 'reforco',
        titulo: `Reforçar: ${pior.kahoot.titulo}`,
        descricao: `Último desempenho de ${pior.lastAttempt.percentual}%. Releia os conceitos e refaça o quiz.`,
        link: `/kahoots/${pior.kahoot.id}`
      });
    }

    // 3. Próximas provas e prazos nos próximos 7 dias
    const proximos = getUpcomingEvents(3);
    proximos.forEach(evt => {
      recs.push({
        id: `rec_evt_${evt.id}`,
        tipo: 'prazo',
        titulo: `Atenção ao prazo: ${evt.titulo}`,
        descricao: `Agendado para ${evt.data}. Status atual: ${evt.status}.`,
        link: '/faculdade'
      });
    });

    // 4. Módulos não iniciados
    const naoIniciados = modulos.filter(m => !m.status || m.status === 'nao_iniciado');
    if (naoIniciados.length > 0 && recs.length < 4) {
      const proximo = naoIniciados[0];
      recs.push({
        id: `rec_mod_${proximo.id}`,
        tipo: 'novo',
        titulo: `Novo conteúdo: ${proximo.titulo}`,
        descricao: 'Inicie a leitura teórica deste módulo para avançar na grade do semestre.',
        link: `/modulos/${proximo.id}`
      });
    }

    return recs;
  };

  // --- BACKUP E RESTAURAÇÃO ---
  const exportFullBackup = () => {
    createAutoSnapshot('Backup Manual');
    const state = {
      faculdade,
      disciplinas,
      modulos,
      resumos,
      kahoots,
      notas,
      projetos,
      attempts,
      spacedReviews,
      spacedIntervals,
      favorites,
      faculdadeAnotacoes,
      flashcards,
      eventosCalendario,
      estudosTempo
    };
    return JSON.stringify(buildBackupPayload(state), null, 2);
  };

  const importFullBackup = (jsonString) => {
    const res = parseAndValidateBackup(jsonString);
    if (!res.sucesso) {
      return { sucesso: false, erro: res.erro };
    }

    const { data, resumo } = res;
    if (data.disciplinas) setDisciplinas(data.disciplinas);
    if (data.modulos) setModulos(data.modulos);
    if (data.resumos) setResumos(data.resumos);
    if (data.kahoots) setKahoots(data.kahoots);
    if (data.notas) setNotas(data.notas);
    if (data.projetos) setProjetos(data.projetos);
    if (data.faculdade) setFaculdade(data.faculdade);
    if (data.attempts) setAttempts(data.attempts);
    if (data.spacedReviews) setSpacedReviews(data.spacedReviews);
    if (data.spacedIntervals) updateSpacedIntervals(data.spacedIntervals);
    if (data.favorites) setFavorites(data.favorites);
    if (data.faculdadeAnotacoes) setFaculdadeAnotacoes(data.faculdadeAnotacoes);
    if (data.flashcards) setFlashcards(data.flashcards);
    if (data.eventosCalendario) setEventosCalendario(data.eventosCalendario);
    if (data.estudosTempo) timerHook.setEstudosTempo(data.estudosTempo);

    return { sucesso: true, resumo };
  };

  const resetAllDataToDefaults = () => {
    createAutoSnapshot('Antes de Resetar');
    clearAllStorage();
    setFaculdade(faculdadeData);
    setDisciplinas(disciplinasData);
    setModulos(modulosData);
    setResumos(resumosData);
    setKahoots(kahootsData);
    setNotas(notasData);
    setProjetos(projetosData);
    setAttempts({});
    setSpacedReviews({});
    setFavorites([]);
    setFaculdadeAnotacoes([]);
    setFlashcards([]);
    setEventosCalendario([]);
    updateSpacedIntervals([0, 1, 3, 7, 14]);
  };

  // Restauração de snapshots do histórico
  const getSnapshots = () => getSnapshotHistory();
  const restoreSnapshot = (snapshotId) => {
    const list = getSnapshotHistory();
    const snap = list.find(s => s.id === snapshotId);
    if (!snap || !snap.data) return false;

    if (snap.data.disciplinas) setDisciplinas(snap.data.disciplinas);
    if (snap.data.modulos) setModulos(snap.data.modulos);
    if (snap.data.resumos) setResumos(snap.data.resumos);
    if (snap.data.kahoots) setKahoots(snap.data.kahoots);
    if (snap.data.attempts) setAttempts(snap.data.attempts);
    if (snap.data.spacedReviews) setSpacedReviews(snap.data.spacedReviews);
    if (snap.data.flashcards) setFlashcards(snap.data.flashcards);
    if (snap.data.eventosCalendario) setEventosCalendario(snap.data.eventosCalendario);
    if (snap.data.notas) setNotas(snap.data.notas);
    if (snap.data.projetos) setProjetos(snap.data.projetos);
    if (snap.data.favorites) setFavorites(snap.data.favorites);
    return true;
  };

  // Controle de busca global (Ctrl + K)
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <StudyContext.Provider value={{
      darkMode,
      toggleDarkMode,
      // Acadêmico
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
      setModuleManualStatus,
      // Resumos
      resumos,
      setResumos,
      addResumo,
      updateResumo,
      deleteResumo,
      // Kahoots
      kahoots,
      setKahoots,
      addKahoot,
      updateKahoot,
      deleteKahoot,
      saveKahootAttempt,
      getKahootAttempts,
      attempts,
      // Notas
      notas,
      setNotas,
      addNote,
      updateNote,
      deleteNote,
      // Projetos
      projetos,
      setProjetos,
      addProjeto,
      updateProjeto,
      deleteProjeto,
      // Revisão Espaçada SM-2
      spacedReviews,
      spacedIntervals,
      updateSpacedIntervals,
      recordSM2Review,
      recordSpacedReview,
      getDueReviews,
      getOverdueReviews,
      getDueTodayReviews,
      getFutureReviews,
      getModulesInProgress,
      getKahootsPendingFirstAttempt,
      getItemsWithDifficulties,
      getStudyRecommendations,
      // Flashcards
      flashcards,
      setFlashcards,
      addFlashcard,
      updateFlashcard,
      deleteFlashcard,
      toggleFlashcardFavorite,
      importFromKahoot,
      importFromModulo,
      // Calendário Acadêmico
      eventosCalendario,
      setEventosCalendario,
      addEvento,
      updateEvento,
      deleteEvento,
      setEventoStatus,
      getUpcomingEvents,
      getOverdueEvents,
      // Horas e Produtividade
      estudosTempo,
      registrarSessao,
      getProdutividadeSemanal,
      // Favoritos & Lembretes
      favorites,
      toggleFavorite,
      isFavorite,
      faculdadeAnotacoes,
      setFaculdadeAnotacoes,
      // Backup & Snapshots
      exportFullBackup,
      importFullBackup,
      resetAllDataToDefaults,
      getSnapshots,
      restoreSnapshot,
      // Busca Global
      isSearchOpen,
      openSearch,
      closeSearch
    }}>
      {children}
    </StudyContext.Provider>
  );
}

export function useStudy() {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudy deve ser usado dentro de um StudyProvider');
  }
  return context;
}
