import React from 'react';
import { FolderSearch } from 'lucide-react';

export default function EmptyState({
  title = "Nenhum conteúdo encontrado",
  description = "Ainda não há dados cadastrados para este filtro ou seção.",
  actionLabel,
  onAction,
  icon: Icon = FolderSearch
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 my-4">
      <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-4">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-sky-600 hover:bg-sky-500 text-white transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
