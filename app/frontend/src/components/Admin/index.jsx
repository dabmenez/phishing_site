import { useState, useEffect } from 'react';
import ClicksTable        from './ClicksTable';
import SubmissionsTable   from './SubmissionsTable';
import FunnelChart        from './FunnelChart';      // nome do arquivo .jsx
import './styles.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('clicks');
  const [stats, setStats] = useState({
    total_opens:       0,
    total_clicks:      0,
    total_submissions: 0,
  });

  const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

  /* ------------------------------------------------------------------ */
  /* Carrega estatísticas globais                                       */
  /* ------------------------------------------------------------------ */
  const fetchStats = async () => {
    try {
      const res  = await fetch(`${API}/admin/stats`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [API]);

  return (
    <div className="admin-container">
      {/* Header / KPIs -------------------------------------------------- */}
      <div className="admin-header">
        <h1>Phishing Test Dashboard</h1>

        <div className="stats-summary">
          <div className="stat-box">
            <h3>Opened</h3>
            <p>{stats?.total_opens ?? 0}</p>
          </div>
          <div className="stat-box">
            <h3>Clicked</h3>
            <p>{stats?.total_clicks ?? 0}</p>
          </div>
          <div className="stat-box">
            <h3>Submitted</h3>
            <p>{stats?.total_submissions ?? 0}</p>
          </div>
        </div>
      </div>

      {/* Funil ---------------------------------------------------------- */}
      <FunnelChart />

      {/* Abas ----------------------------------------------------------- */}
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
