import React, { createContext, useContext, useState, useEffect } from 'react';
import faculdadeData from '../data/faculdade.json';
import disciplinasData from '../data/disciplinas.json';
import modulosData from '../data/modulos.json';
import resumosData from '../data/resumos.json';
import kahootsData from '../data/kahoots.json';
import projetosData from '../data/projetos.json';
import notasData from '../data/notas.json';

const StudyContext = createContext(null);

export function StudyProvider({ children }) {
  // 1. Tema Claro / Escuro
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('portal_ads_theme');
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
        localStorage.setItem('portal_ads_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('portal_ads_theme', 'light');
      }
    } catch (e) {
      console.warn('Erro ao acessar localStorage para tema:', e);
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // 2. Progresso de Módulos: { [moduloId]: 'nao_iniciado' | 'estudando' | 'concluido' }
  const [moduleProgress, setModuleProgress] = useState(() => {
    try {
      const saved = localStorage.getItem('portal_ads_progress');
      if (saved) return JSON.parse(saved);
      // Inicializa com os status padrão do JSON
      const initial = {};
      modulosData.forEach(m => {
        initial[m.id] = m.status || 'nao_iniciado';
      });
      return initial;
    } catch {
      return {};
    }
  });

  const updateModuleProgress = (moduleId, status) => {
    setModuleProgress(prev => {
      const updated = { ...prev, [moduleId]: status };
      try {
        localStorage.setItem('portal_ads_progress', JSON.stringify(updated));
      } catch (e) {
        console.warn('Erro ao salvar progresso:', e);
      }
      return updated;
    });
  };

  // 3. Status de Revisões: { [resumoId]: { revisado: boolean, dataUltimaRevisao: string } }
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem('portal_ads_reviews');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const markAsReviewed = (resumoId) => {
    setReviews(prev => {
      const today = new Date().toISOString().split('T')[0];
      const updated = {
        ...prev,
        [resumoId]: {
          revisado: true,
          dataUltimaRevisao: today
        }
      };
      try {
        localStorage.setItem('portal_ads_reviews', JSON.stringify(updated));
      } catch (e) {
        console.warn('Erro ao salvar revisão:', e);
      }
      return updated;
    });
  };

  // 4. Favoritos: array de IDs
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('portal_ads_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter(item => item !== id) : [...prev, id];
      try {
        localStorage.setItem('portal_ads_favorites', JSON.stringify(updated));
      } catch (e) {
        console.warn('Erro ao salvar favorito:', e);
      }
      return updated;
    });
  };

  const isFavorite = (id) => favorites.includes(id);

  // 5. Dados base acadêmicos (carregados dos JSONs e extensíveis)
  const [faculdade, setFaculdade] = useState(faculdadeData);
  const [disciplinas, setDisciplinas] = useState(disciplinasData);
  const [modulos, setModulos] = useState(modulosData);
  const [resumos, setResumos] = useState(resumosData);
  const [kahoots, setKahoots] = useState(kahootsData);
  const [projetos, setProjetos] = useState(projetosData);
  const [notas, setNotas] = useState(notasData);

  // 6. Controle do Modal de Busca Global
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  // Atalho global Ctrl+K / Cmd+K
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
      projetos,
      setProjetos,
      notas,
      setNotas,
      moduleProgress,
      updateModuleProgress,
      reviews,
      markAsReviewed,
      favorites,
      toggleFavorite,
      isFavorite,
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
