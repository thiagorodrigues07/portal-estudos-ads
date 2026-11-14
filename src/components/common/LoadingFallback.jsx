import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 space-y-3 animate-fade-in">
      <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
        Carregando módulo...
      </span>
    </div>
  );
}
