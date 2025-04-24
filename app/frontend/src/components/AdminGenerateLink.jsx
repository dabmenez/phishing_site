import { useState } from 'react';

export default function AdminGenerateLink() {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);
  const BACKEND = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(
      `${BACKEND}/admin/generate-link?email=${encodeURIComponent(email)}`,
      { method: 'POST' }
    );
    const data = await res.json();
    setResult(data);
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Generate tracking link</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="user@empresa.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ marginRight: 8 }}
        />
        <button type="submit">Generate</button>
      </form>

      {result && (
        <pre style={{ background: '#eee', marginTop: 16, padding: 12 }}>
{JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
