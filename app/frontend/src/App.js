import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AdminDashboard from './components/Admin';
import AdminGenerateLink from './components/AdminGenerateLink';   // ⬅️ novo

function App() {
  return (
    <Router>
      <Routes>
        {/* página que o funcionário vê ao clicar no link */}
        <Route path="/l/:linkId" element={<LandingPage />} />

        {/* dashboard (tabelas de cliques / submissões) */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* nova rota para gerar link rastreável */}
        <Route path="/admin/gen" element={<AdminGenerateLink />} />

        {/* rota de erro genérica */}
        <Route path="/error" element={<div>Invalid or expired link</div>} />
      </Routes>
    </Router>
  );
}

export default App;
