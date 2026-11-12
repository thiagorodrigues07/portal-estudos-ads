import React, { createContext, useContext, useState, useEffect } from 'react';
import faculdadeData from '../data/faculdade.json';
import disciplinasData from '../data/disciplinas.json';
import modulosData from '../data/modulos.json';
import resumosData from '../data/resumos.json';
import kahootsData from '../data/kahoots.json';
import projetosData from '../data/projetos.json';
import notasData from '../data/notas.json';

const StudyContext = createContext(null);

const STORAGE_PREFIX = 'portal_ads_v2_';

// Utilitário para formatar data atual no padrão YYYY-MM-DD (local)
export const getTodayString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Utilitário para adicionar dias a uma data
export const addDaysToDate = (dateStr, days) => {
  const d = new Date(dateStr ? `${dateStr}T12:00:00` : `${getTodayString()}T12:00:00`);
  d.setDate(d.getDate() + Number(days));
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Carregador seguro do LocalStorage com merge
const loadFromStorage = (key, defaultData) => {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    if (!raw) return defaultData;
    const parsed = JSON.parse(raw);
    
    // Se for array de objetos com 'id', faz merge mantendo customizações
    if (Array.isArray(defaultData) && Array.isArray(parsed)) {
      const parsedMap = new Map(parsed.map(item => [item.id, item]));
      // Adiciona itens default que ainda não existem
      defaultData.forEach(item => {
        if (!parsedMap.has(item.id)) {
          parsedMap.set(item.id, item);
        }
      });
      return Array.from(parsedMap.values());
    }
    
    return parsed;
  } catch (e) {
    console.warn(`Erro ao carregar chave ${key} do localStorage:`, e);
    return defaultData;
  }
};

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(data));
  } catch (e) {
    console.error(`Erro ao salvar chave ${key} no localStorage:`, e);
  }
};

export function StudyProvider({ children }) {
  // 1. Tema Claro / Escuro
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}theme`);
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
        localStorage.setItem(`${STORAGE_PREFIX}theme`, 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem(`${STORAGE_PREFIX}theme`, 'light');
      }
    } catch (e) {
      console.warn('Erro ao salvar tema:', e);
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // 2. Intervalos de Revisão Espaçada (configuráveis pelo aluno)
  // Padrão: Dia 0 (inicial), Dia 1 (1ª rev), Dia 3 (2ª rev), Dia 7 (3ª rev), Dia 14 (4ª rev)
  const [spacedIntervals, setSpacedIntervals] = useState(() => {
    return loadFromStorage('spaced_intervals', [0, 1, 3, 7, 14]);
  });

  const updateSpacedIntervals = (newIntervals) => {
    setSpacedIntervals(newIntervals);
    saveToStorage('spaced_intervals', newIntervals);
  };

  // 3. Dados Principais com Persistência Local Real
  const [faculdade, setFaculdadeState] = useState(() => loadFromStorage('faculdade', faculdadeData));
  const [disciplinas, setDisciplinasState] = useState(() => loadFromStorage('disciplinas', disciplinasData));
  const [modulos, setModulosState] = useState(() => loadFromStorage('modulos', modulosData));
  const [resumos, setResumosState] = useState(() => loadFromStorage('resumos', resumosData));
  const [kahoots, setKahootsState] = useState(() => loadFromStorage('kahoots', kahootsData));
  const [notas, setNotasState] = useState(() => loadFromStorage('notas', notasData));
  const [projetos, setProjetosState] = useState(() => loadFromStorage('projetos', projetosData));

  // 4. Histórico de Tentativas de Kahoots:
  // { [kahootId]: [ { id, data, totalQuestoes, acertos, erros, percentual, dificuldades, observacoes, anteciparRevisao } ] }
  const [attempts, setAttemptsState] = useState(() => loadFromStorage('attempts', {}));

  // 5. Estado de Revisão Espaçada por Item (Módulos, Kahoots, Resumos):
  // { [itemId]: { id, tipo, stage: 0..4, nextReviewDate, lastReviewDate, status, difficultiesCount, history: [] } }
  const [spacedReviews, setSpacedReviewsState] = useState(() => loadFromStorage('spaced_reviews', {}));

  // 6. Favoritos (array de IDs)
  const [favorites, setFavoritesState] = useState(() => loadFromStorage('favorites', []));

  // 7. Anotações Acadêmicas da Faculdade (Datas de provas, eventos)
  const [faculdadeAnotacoes, setFaculdadeAnotacoesState] = useState(() => loadFromStorage('faculdade_anotacoes', []));

  // Sincronizadores com localStorage
  const setFaculdade = (data) => { setFaculdadeState(data); saveToStorage('faculdade', data); };
  const setDisciplinas = (data) => { setDisciplinasState(data); saveToStorage('disciplinas', data); };
  const setModulos = (data) => { setModulosState(data); saveToStorage('modulos', data); };
  const setResumos = (data) => { setResumosState(data); saveToStorage('resumos', data); };
  const setKahoots = (data) => { setKahootsState(data); saveToStorage('kahoots', data); };
  const setNotas = (data) => { setNotasState(data); saveToStorage('notas', data); };
  const setProjetos = (data) => { setProjetosState(data); saveToStorage('projetos', data); };
  const setAttempts = (data) => { setAttemptsState(data); saveToStorage('attempts', data); };
  const setSpacedReviews = (data) => { setSpacedReviewsState(data); saveToStorage('spaced_reviews', data); };
  const setFavorites = (data) => { setFavoritesState(data); saveToStorage('favorites', data); };
  const setFaculdadeAnotacoes = (data) => { setFaculdadeAnotacoesState(data); saveToStorage('faculdade_anotacoes', data); };

  // --- MÉTODOS DE NEGÓCIO ---

  // Favoritar / Desfavoritar
  const toggleFavorite = (id) => {
    const updated = favorites.includes(id) ? favorites.filter(item => item !== id) : [...favorites, id];
    setFavorites(updated);
  };
  const isFavorite = (id) => favorites.includes(id);

  // CRUD e Atualizações de Kahoot
  const updateKahoot = (id, updatedFields) => {
    const updated = kahoots.map(k => k.id === id ? { ...k, ...updatedFields } : k);
    setKahoots(updated);
  };

  const addKahoot = (novoKahoot) => {
    const updated = [novoKahoot, ...kahoots];
    setKahoots(updated);
  };

  const deleteKahoot = (id) => {
    const updated = kahoots.filter(k => k.id !== id);
    setKahoots(updated);
  };

  // CRUD e Atualizações de Módulo
  const updateModule = (id, updatedFields) => {
    const updated = modulos.map(m => m.id === id ? { ...m, ...updatedFields } : m);
    setModulos(updated);
  };

  const addModule = (novoModulo) => {
    const updated = [...modulos, novoModulo];
    setModulos(updated);
  };

  // CRUD de Notas Técnicas
  const addNote = (novaNota) => {
    const updated = [novaNota, ...notas];
    setNotas(updated);
  };

  const deleteNote = (id) => {
    const updated = notas.filter(n => n.id !== id);
    setNotas(updated);
  };

  // --- SISTEMA DE TENTATIVAS DE KAHOOT ---
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

    // Atualiza a repetição espaçada do Kahoot e do Módulo associado
    const kahootAtual = kahoots.find(k => k.id === kahootId);
    const reviewInfo = spacedReviews[kahootId] || {
      id: kahootId,
      tipo: 'kahoot',
      stage: 0,
      nextReviewDate: today,
      status: 'nao_iniciado',
      difficultiesCount: 0,
      history: []
    };

    let nextStage = reviewInfo.stage;
    let nextDate = today;
    let newStatus = 'estudado';
    let difficultiesCount = reviewInfo.difficultiesCount || 0;

    // Se teve dificuldades ou percentual < 70%: antecipa para amanhã (+1 dia)
    if (novaTentativa.anteciparRevisao || percentual < 70) {
      nextDate = addDaysToDate(today, 1);
      newStatus = 'revisao_pendente';
      difficultiesCount += 1;
    } else {
      // Avança estágio
      nextStage = Math.min((reviewInfo.stage || 0) + 1, spacedIntervals.length - 1);
      const daysToAdd = spacedIntervals[nextStage] || 1;
      nextDate = addDaysToDate(today, daysToAdd);

      if (nextStage >= spacedIntervals.length - 1 && percentual >= 85) {
        newStatus = 'dominado';
      } else {
        newStatus = 'em_revisao';
      }
    }

    const updatedReviewInfo = {
      ...reviewInfo,
      id: kahootId,
      tipo: 'kahoot',
      disciplinaId: kahootAtual?.disciplinaId,
      moduloId: kahootAtual?.moduloId,
      titulo: kahootAtual?.titulo,
      stage: nextStage,
      lastReviewDate: today,
      nextReviewDate: nextDate,
      lastScore: percentual,
      status: newStatus,
      difficultiesCount,
      history: [
        { data: today, percentual, stage: nextStage, observacoes: novaTentativa.observacoes },
        ...(reviewInfo.history || [])
      ]
    };

    const novosReviews = { ...spacedReviews, [kahootId]: updatedReviewInfo };

    // Se o Kahoot tem módulo associado, marca também o módulo como em_estudo ou estudado
    if (kahootAtual?.moduloId) {
      updateModule(kahootAtual.moduloId, {
        status: newStatus === 'dominado' ? 'dominado' : 'estudado',
        dataUltimaRevisao: today
      });
    }

    setSpacedReviews(novosReviews);
    return novaTentativa;
  };

  // Concluir ou agendar revisão de qualquer item (Módulo, Resumo ou Kahoot)
  const recordSpacedReview = (itemId, tipo, { status, nextDate, notes, stageIncrement = true }) => {
    const today = getTodayString();
    const current = spacedReviews[itemId] || {
      id: itemId,
      tipo,
      stage: 0,
      nextReviewDate: today,
      status: 'nao_iniciado',
      history: []
    };

    let nextStage = current.stage;
    if (stageIncrement) {
      nextStage = Math.min(current.stage + 1, spacedIntervals.length - 1);
    }

    const calculatedNextDate = nextDate || addDaysToDate(today, spacedIntervals[nextStage] || 1);

    const updated = {
      ...current,
      id: itemId,
      tipo,
      stage: nextStage,
      lastReviewDate: today,
      nextReviewDate: calculatedNextDate,
      status: status || (nextStage >= spacedIntervals.length - 1 ? 'dominado' : 'estudado'),
      history: [
        { data: today, stage: nextStage, notes: notes || '' },
        ...(current.history || [])
      ]
    };

    const updatedReviews = { ...spacedReviews, [itemId]: updated };
    setSpacedReviews(updatedReviews);

    // Atualiza status no módulo ou resumo caso seja o caso
    if (tipo === 'modulo') {
      updateModule(itemId, {
        status: updated.status,
        dataUltimaRevisao: today
      });
    }
  };

  // Alterar status manual de um módulo
  const setModuleManualStatus = (moduleId, newStatus) => {
    updateModule(moduleId, { status: newStatus });
    const today = getTodayString();
    const current = spacedReviews[moduleId] || {
      id: moduleId,
      tipo: 'modulo',
      stage: 0,
      nextReviewDate: today,
      status: newStatus
    };
    setSpacedReviews({
      ...spacedReviews,
      [moduleId]: {
        ...current,
        status: newStatus,
        lastReviewDate: today,
        nextReviewDate: newStatus === 'estudado' ? addDaysToDate(today, spacedIntervals[1] || 1) : current.nextReviewDate
      }
    });
  };

  // --- SELETORES DINÂMICOS PARA O DASHBOARD E REVISÕES DE HOJE ---
  const todayStr = getTodayString();

  // Revisões de Hoje (programadas para hoje ou atrasadas)
  const getDueReviews = () => {
    const items = [];
    Object.values(spacedReviews).forEach(rev => {
      if (rev.status === 'dominado') return;
      if (rev.nextReviewDate && rev.nextReviewDate <= todayStr) {
        items.push(rev);
      }
    });
    return items.sort((a, b) => a.nextReviewDate.localeCompare(b.nextReviewDate));
  };

  const getOverdueReviews = () => {
    return getDueReviews().filter(item => item.nextReviewDate < todayStr);
  };

  const getDueTodayReviews = () => {
    return getDueReviews().filter(item => item.nextReviewDate === todayStr);
  };

  // Módulos em andamento
  const getModulesInProgress = () => {
    return modulos.filter(m => m.status === 'em_estudo' || m.status === 'estudando');
  };

  // Kahoots que nunca foram tentados
  const getKahootsPendingFirstAttempt = () => {
    return kahoots.filter(k => !attempts[k.id] || attempts[k.id].length === 0);
  };

  // Conteúdos com dificuldades (tentativas < 70% ou marcadas como dificuldade)
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

  // Obter tentativas de um Kahoot específico
  const getKahootAttempts = (kahootId) => {
    return attempts[kahootId] || [];
  };

  // --- BACKUP E RESTAURAÇÃO ---
  const exportFullBackup = () => {
    const backupData = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
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
      faculdadeAnotacoes
    };
    return JSON.stringify(backupData, null, 2);
  };

  const importFullBackup = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Arquivo JSON inválido.');
      }

      // Validação mínima de estrutura
      if (parsed.disciplinas && Array.isArray(parsed.disciplinas)) setDisciplinas(parsed.disciplinas);
      if (parsed.modulos && Array.isArray(parsed.modulos)) setModulos(parsed.modulos);
      if (parsed.resumos && Array.isArray(parsed.resumos)) setResumos(parsed.resumos);
      if (parsed.kahoots && Array.isArray(parsed.kahoots)) setKahoots(parsed.kahoots);
      if (parsed.notas && Array.isArray(parsed.notas)) setNotas(parsed.notas);
      if (parsed.projetos && Array.isArray(parsed.projetos)) setProjetos(parsed.projetos);
      if (parsed.faculdade) setFaculdade(parsed.faculdade);
      if (parsed.attempts) setAttempts(parsed.attempts);
      if (parsed.spacedReviews) setSpacedReviews(parsed.spacedReviews);
      if (parsed.spacedIntervals) setSpacedIntervals(parsed.spacedIntervals);
      if (parsed.favorites) setFavorites(parsed.favorites);
      if (parsed.faculdadeAnotacoes) setFaculdadeAnotacoes(parsed.faculdadeAnotacoes);

      return {
        sucesso: true,
        resumo: {
          disciplinas: parsed.disciplinas?.length || 0,
          modulos: parsed.modulos?.length || 0,
          kahoots: parsed.kahoots?.length || 0,
          tentativas: Object.keys(parsed.attempts || {}).length,
          notas: parsed.notas?.length || 0
        }
      };
    } catch (err) {
      return { sucesso: false, erro: err.message };
    }
  };

  const resetAllDataToDefaults = () => {
    localStorage.clear();
    setFaculdadeState(faculdadeData);
    setDisciplinasState(disciplinasData);
    setModulosState(modulosData);
    setResumosState(resumosData);
    setKahootsState(kahootsData);
    setNotasState(notasData);
    setProjetosState(projetosData);
    setAttemptsState({});
    setSpacedReviewsState({});
    setFavoritesState([]);
    setFaculdadeAnotacoesState([]);
    setSpacedIntervals([0, 1, 3, 7, 14]);
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
      faculdade,
      setFaculdade,
      disciplinas,
      setDisciplinas,
      modulos,
      setModulos,
      resumos,
      setResumos,
      kahoots,
      setKahoots,
      notas,
      setNotas,
      projetos,
      setProjetos,
      // Kahoot CRUD & Tentativas
      updateKahoot,
      addKahoot,
      deleteKahoot,
      saveKahootAttempt,
      getKahootAttempts,
      attempts,
      // Módulo CRUD & Status
      updateModule,
      addModule,
      setModuleManualStatus,
      // Notas CRUD
      addNote,
      deleteNote,
      // Revisão Espaçada
      spacedReviews,
      spacedIntervals,
      updateSpacedIntervals,
      recordSpacedReview,
      getDueReviews,
      getOverdueReviews,
      getDueTodayReviews,
      getModulesInProgress,
      getKahootsPendingFirstAttempt,
      getItemsWithDifficulties,
      // Favoritos & Lembretes
      favorites,
      toggleFavorite,
      isFavorite,
      faculdadeAnotacoes,
      setFaculdadeAnotacoes,
      // Backup
      exportFullBackup,
      importFullBackup,
      resetAllDataToDefaults,
      // Busca
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
