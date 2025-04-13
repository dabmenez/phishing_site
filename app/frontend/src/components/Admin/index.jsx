import React, { useState, useEffect } from 'react';
import ClicksTable from './ClicksTable';
import SubmissionsTable from './SubmissionsTable';
import './styles.css';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('clicks');
    const [stats, setStats] = useState({
        totalClicks: 0,
        totalSubmissions: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/stats`);
            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>Dashboard de Monitoramento - Phishing Test</h1>
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
                {activeTab === 'clicks' ? (
                    <ClicksTable />
                ) : (
                    <SubmissionsTable />
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
