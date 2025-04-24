import { useEffect, useState } from 'react';
import { FunnelChart, Funnel, Tooltip, LabelList } from 'recharts';

export default function FunnelChartStats() {
  const [stats, setStats] = useState(null);
  const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

  useEffect(() => {
    fetch(`${API}/admin/stats`)
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error);
  }, [API]);

  if (!stats) return null;

  const data = [
    { name: 'Opened',    value: stats.total_opens       ?? stats.total_links },
    { name: 'Clicked',   value: stats.total_clicks      },
    { name: 'Submitted', value: stats.total_submissions },
  ];

  return (
    <div style={{ width: 400, margin: '2rem auto' }}>
      <FunnelChart width={400} height={250}>
        <Tooltip />
        <Funnel dataKey="value" data={data} isAnimationActive>
          <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
        </Funnel>
      </FunnelChart>
    </div>
  );
}
