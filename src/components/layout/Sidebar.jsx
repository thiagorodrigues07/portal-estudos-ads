import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  FileText,
  HelpCircle,
  FolderGit2,
  FileCode,
  PlusCircle,
  X,
  Code2
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/faculdade', label: 'Minha Faculdade', icon: GraduationCap },
  { to: '/disciplinas', label: 'Disciplinas', icon: BookOpen },
  { to: '/resumos', label: 'Biblioteca de Resumos', icon: FileText },
  { to: '/kahoots', label: 'Central de Kahoots', icon: HelpCircle },
  { to: '/projetos', label: 'Projetos & Portfólio', icon: FolderGit2 },
  { to: '/notas', label: 'Caderno de Notas', icon: FileCode },
  { to: '/gerenciador', label: 'Novo Conteúdo (JSON)', icon: PlusCircle },
];

export default function Sidebar({ isOpen, onClose }) {
  const { faculdade, disciplinas, resumos, kahoots } = useStudy();

  return (
    <>
      {/* Overlay no Mobile */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
        flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Topo / Logo */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                Portal ADS
              </h1>
              <p className="text-[11px] font-medium text-sky-600 dark:text-sky-400">
                Cruzeiro do Sul • 2026-2027
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu de Navegação */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider uppercase text-slate-400 dark:text-slate-500">
            Navegação Acadêmica
          </div>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                onClick={() => onClose && onClose()}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-semibold shadow-xs' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                  }
                `}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Rodapé da Sidebar - Resumo de Status */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="rounded-xl p-3 bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>Semestre Atual</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{faculdade.semestreAtual}º Semestre</span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {disciplinas.length} Matérias • {kahoots.length} Kahoots
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
