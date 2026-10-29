import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StudyProvider } from './context/StudyContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Faculdade from './pages/Faculdade';
import Disciplinas from './pages/Disciplinas';
import DisciplinaDetalhe from './pages/DisciplinaDetalhe';
import Resumos from './pages/Resumos';
import ResumoLeitor from './pages/ResumoLeitor';
import Kahoots from './pages/Kahoots';
import KahootDetalhe from './pages/KahootDetalhe';
import Projetos from './pages/Projetos';
import ProjetoDetalhe from './pages/ProjetoDetalhe';
import NotasTecnicas from './pages/NotasTecnicas';
import GerenciadorConteudo from './pages/GerenciadorConteudo';

export default function App() {
  return (
    <StudyProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="faculdade" element={<Faculdade />} />
            <Route path="disciplinas" element={<Disciplinas />} />
            <Route path="disciplinas/:id" element={<DisciplinaDetalhe />} />
            <Route path="resumos" element={<Resumos />} />
            <Route path="resumos/:id" element={<ResumoLeitor />} />
            <Route path="kahoots" element={<Kahoots />} />
            <Route path="kahoots/:id" element={<KahootDetalhe />} />
            <Route path="projetos" element={<Projetos />} />
            <Route path="projetos/:id" element={<ProjetoDetalhe />} />
            <Route path="notas" element={<NotasTecnicas />} />
            <Route path="gerenciador" element={<GerenciadorConteudo />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </StudyProvider>
  );
}
