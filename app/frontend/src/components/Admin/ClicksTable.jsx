import React, { useState, useEffect } from 'react';

const ClicksTable = () => {
    const [clicks, setClicks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClicks();
    }, []);

    const fetchClicks = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/target-link`);
            const data = await response.json();
            setClicks(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching clicks:', error);
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Link ID</th>
                        <th>Clicked At</th>
                        <th>IP Address</th>
                        <th>User Agent</th>
                    </tr>
                </thead>
                <tbody>
                    {clicks.map((click) => (
                        <tr key={click.id}>
                            <td>{click.email}</td>
                            <td>{click.link_id}</td>
                            <td>{new Date(click.clicked_at).toLocaleString()}</td>
                            <td>{click.ip_address}</td>
                            <td>{click.user_agent}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ClicksTable;
