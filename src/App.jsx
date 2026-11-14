import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StudyProvider } from './context/StudyContext';
import Layout from './components/layout/Layout';
import LoadingFallback from './components/common/LoadingFallback';

// Lazy loading das páginas para otimização de bundle e code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Faculdade = lazy(() => import('./pages/Faculdade'));
const Disciplinas = lazy(() => import('./pages/Disciplinas'));
const DisciplinaDetalhe = lazy(() => import('./pages/DisciplinaDetalhe'));
const ModuloDetalhe = lazy(() => import('./pages/ModuloDetalhe'));
const RevisoesHoje = lazy(() => import('./pages/RevisoesHoje'));
const Resumos = lazy(() => import('./pages/Resumos'));
const ResumoLeitor = lazy(() => import('./pages/ResumoLeitor'));
const Kahoots = lazy(() => import('./pages/Kahoots'));
const KahootDetalhe = lazy(() => import('./pages/KahootDetalhe'));
const Flashcards = lazy(() => import('./pages/Flashcards'));
const CalendarioAcademico = lazy(() => import('./pages/CalendarioAcademico'));
const Projetos = lazy(() => import('./pages/Projetos'));
const ProjetoDetalhe = lazy(() => import('./pages/ProjetoDetalhe'));
const NotasTecnicas = lazy(() => import('./pages/NotasTecnicas'));
const GerenciadorConteudo = lazy(() => import('./pages/GerenciadorConteudo'));
const Backup = lazy(() => import('./pages/Backup'));

export default function App() {
  return (
    <StudyProvider>
      <HashRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="revisoes" element={<RevisoesHoje />} />
              <Route path="flashcards" element={<Flashcards />} />
              <Route path="calendario" element={<CalendarioAcademico />} />
              <Route path="disciplinas" element={<Disciplinas />} />
              <Route path="disciplinas/:id" element={<DisciplinaDetalhe />} />
              <Route path="modulos/:id" element={<ModuloDetalhe />} />
              <Route path="kahoots" element={<Kahoots />} />
              <Route path="kahoots/:id" element={<KahootDetalhe />} />
              <Route path="resumos" element={<Resumos />} />
              <Route path="resumos/:id" element={<ResumoLeitor />} />
              <Route path="faculdade" element={<Faculdade />} />
              <Route path="backup" element={<Backup />} />
              <Route path="gerenciador" element={<GerenciadorConteudo />} />
              <Route path="projetos" element={<Projetos />} />
              <Route path="projetos/:id" element={<ProjetoDetalhe />} />
              <Route path="notas" element={<NotasTecnicas />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Suspense>
      </HashRouter>
    </StudyProvider>
  );
}
