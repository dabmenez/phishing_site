import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AdminDashboard from './components/Admin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/l/:linkId" element={<LandingPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/error" element={<div>Invalid or expired link</div>} />
      </Routes>
    </Router>
  );
}

export default App;
