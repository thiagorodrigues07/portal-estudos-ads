import React from 'react';
import { Menu, Search, Sun, Moon, Sparkles } from 'lucide-react';
import { useStudy } from '../../context/StudyContext';

export default function Header({ onToggleSidebar }) {
  const { darkMode, toggleDarkMode, openSearch } = useStudy();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between px-4 sm:px-6 transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Abrir menu de navegação"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Botão de Busca Global Rápida */}
        <button
          onClick={openSearch}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700/70 text-slate-500 dark:text-slate-400 text-xs sm:text-sm border border-slate-200/60 dark:border-slate-700/60 transition-all cursor-pointer group"
        >
          <Search className="w-4 h-4 text-slate-400 group-hover:text-sky-500 transition-colors" />
          <span className="hidden sm:inline">Buscar disciplinas, módulos, resumos...</span>
          <span className="sm:hidden">Buscar...</span>
          <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 shadow-2xs">
            Ctrl K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-2">
        {/* Indicador de Status Acadêmico */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-100 dark:border-sky-900 text-sky-700 dark:text-sky-300 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-sky-500" />
          <span>ADS • Noturno (Conclusão 2027)</span>
        </div>

        {/* Toggle Dark / Light Mode */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title={darkMode ? "Mudar para modo claro" : "Mudar para modo escuro"}
          aria-label="Alternar tema"
        >
          {darkMode ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>
      </div>
    </header>
  );
}
