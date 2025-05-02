import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InvestimentoLanding from './themes/InvestimentoLanding';
import RHLanding         from './themes/RHLanding';
import TILanding         from './themes/TILanding';
import DefaultLanding    from './themes/DefaultLanding';
import './styles.css';

const LandingPage = () => {
  const { linkId } = useParams();
  const navigate     = useNavigate();
  const [campaign, setCampaign] = useState(null);

  useEffect(() => {
    const recordClick = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/landing/l/${linkId}`);
        if (!res.ok) return navigate('/error');
        const data = await res.json();
        setCampaign(data.campaign.toLowerCase());
      } catch {
        navigate('/error');
      }
    };
    if (linkId) recordClick();
  }, [linkId, navigate]);

  if (!campaign) return <div>Loading...</div>;

  if (campaign.includes('investimento')) {
    return <InvestimentoLanding linkId={linkId} />;
  }
  else if (campaign.includes('recursos')) {
    return <RHLanding linkId={linkId} />;
  }
  else if (
       campaign.includes('governança') 
    || campaign.includes('gti')
  ) {
    return <TILanding linkId={linkId} />;
  }
  else {
    return <DefaultLanding linkId={linkId} />;
  }
};

export default LandingPage;
