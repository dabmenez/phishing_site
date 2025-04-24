import React, { useState, useEffect, useMemo } from 'react';
import ClicksTable from './ClicksTable';
import SubmissionsTable from './SubmissionsTable';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import './styles.css';

const AdminDashboard = () => {
  // -------------------------------- state ----------------------------------
  const [activeTab, setActiveTab] = useState('clicks');
  const [stats, setStats] = useState({ totalClicks: 0, totalSubmissions: 0 });
  const [links, setLinks] = useState([]);
  const [email, setEmail] = useState('');
  const [campaign, setCampaign] = useState('');
  const [loadingLinks, setLoadingLinks] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const API = process.env.REACT_APP_BACKEND_URL;

  // --------------------------- effects / fetchers ---------------------------
  useEffect(() => {
    fetchStats();
    fetchLinks();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API}/admin/stats`);
      setStats(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchLinks = async () => {
    setLoadingLinks(true);
    try {
      const res = await fetch(`${API}/admin/target-link`);
      setLinks(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingLinks(false);
    }
  };

  // ------------------------------ link form --------------------------------
  const handleGenerate = async () => {
    if (!email) return;
    setGenerating(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`${API}/admin/generate-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, campaign: campaign || undefined }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.detail || 'Erro ao gerar link');
      }
      setEmail('');
      setCampaign('');
      await Promise.all([fetchStats(), fetchLinks()]);
    } catch (e) {
      setErrorMsg(e.message);
    } finally {
      setGenerating(false);
    }
  };

  // ---------------------------- chart helper -------------------------------
  const chartData = useMemo(() => {
    const map = {};
    links.forEach(l => {
      if (l.clicked_at) {
        const d = format(parseISO(l.clicked_at), 'yyyy-MM-dd');
        map[d] ??= { date: d, clicks: 0, submissions: 0 };
        map[d].clicks += 1;
      }
      if (l.submitted_at) {
        const d = format(parseISO(l.submitted_at), 'yyyy-MM-dd');
        map[d] ??= { date: d, clicks: 0, submissions: 0 };
        map[d].submissions += 1;
      }
    });
    return Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
  }, [links]);

  // -------------------------------- render ---------------------------------
  return (
    <div className="admin-container">
      {/* título + KPIs */}
      <div className="admin-header">
        <h1>Dashboard de Monitoramento – Phishing Test</h1>
        <div className="stats-summary">
          <div className="stat-box">
            <h3>Total Clicks</h3>
            <p>{stats.totalClicks}</p>
          </div>
          <div className="stat-box">
            <h3>Total Submissions</h3>
            <p>{stats.totalSubmissions}</p>
          </div>
        </div>
      </div>

      {/* form gerar link */}
      <div className="form-container">
        <h2>Gerar link personalizado</h2>
        <div className="form-group">
          <label>Email do colaborador</label>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="john@acme.com" />
        </div>
        <div className="form-group">
          <label>Campanha (opcional)</label>
          <input value={campaign} onChange={e => setCampaign(e.target.value)} placeholder="investimento | gti | rh" />
        </div>
        <button onClick={handleGenerate} disabled={generating || !email}>
          {generating ? 'Gerando…' : 'Gerar link'}
        </button>
        {errorMsg && <p style={{ color: 'red', marginTop: 10 }}>{errorMsg}</p>}
      </div>

      {/* gráfico */}
      {!loadingLinks && (
        <div className="export-container" style={{ marginBottom: 40 }}>
          <h2>Cliques × Submissões</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={d => format(parseISO(d), 'dd/MM')}
                  stroke="#555"
                />
                <YAxis allowDecimals={false} stroke="#555" />
                <Tooltip
                  labelFormatter={d => format(parseISO(String(d)), 'PPP')}
                />
                <Line type="monotone" dataKey="clicks" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="submissions" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* tabs */}
      <div className="tab-buttons">
        <button
          className={activeTab === 'clicks' ? 'active' : ''}
          onClick={() => setActiveTab('clicks')}
        >
          Click Tracking
        </button>
        <button
          className={activeTab === 'submissions' ? 'active' : ''}
          onClick={() => setActiveTab('submissions')}
        >
          Form Submissions
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'clicks' ? <ClicksTable /> : <SubmissionsTable />}
      </div>
    </div>
  );
};

export default AdminDashboard;
