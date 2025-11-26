import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Encomendas from './pages/Encomendas';
import Ocorrencias from './pages/Ocorrencias';
import Funcionarios from './pages/Funcionarios';
import FolhaPonto from './pages/FolhaPonto';
import Moradores from './pages/Moradores';
import ItensRecebidos from './pages/ItensRecebidos';
import Entregadores from './pages/Entregadores';
import VisitasEntregadores from './pages/VisitasEntregadores';
import Empresas from './pages/Empresas';
import MateriaisEmprestados from './pages/MateriaisEmprestados';
import Visitantes from './pages/Visitantes';

const queryClient = new QueryClient();

function App() {
  const location = useLocation();
  
  return (
    <Layout currentPageName={location.pathname}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/encomendas" element={<Encomendas />} />
        <Route path="/ocorrencias" element={<Ocorrencias />} />
        <Route path="/funcionarios" element={<Funcionarios />} />
        <Route path="/folha-ponto" element={<FolhaPonto />} />
        <Route path="/moradores" element={<Moradores />} />
        <Route path="/itens-recebidos" element={<ItensRecebidos />} />
        <Route path="/entregadores" element={<Entregadores />} />
        <Route path="/visitas-entregadores" element={<VisitasEntregadores />} />
        <Route path="/empresas" element={<Empresas />} />
        <Route path="/materiais" element={<MateriaisEmprestados />} />
        <Route path="/visitantes" element={<Visitantes />} />
      </Routes>
    </Layout>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <App />
      </HashRouter>
    </QueryClientProvider>
  </React.StrictMode>
);