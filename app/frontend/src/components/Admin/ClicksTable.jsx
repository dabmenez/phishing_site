import React, { useEffect, useState } from "react";

const ClicksTable = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/target-link`)
      .then((r) => r.json())
      .then((data) => {
        console.log(">>> DEBUG (frontend) dados recebidos:", data);
        setRows(data);
      })
      .catch((e) => console.error("target-link:", e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading…</div>;

  const fmt = (iso) => {
    if (!iso) return "-";
    try {
      const utcDate = new Date(iso);

      // Ajustar manualmente para o fuso horário de São Paulo (UTC-3)
      const localDate = new Date(utcDate.getTime() - (3 * 60 * 60 * 1000)); // subtrai 3 horas em milissegundos

      return localDate.toLocaleString("pt-BR", {
        hour12: false,
      });
    } catch (error) {
      console.error("Erro formatando data:", iso, error);
      return "-";
    }
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Link&nbsp;ID</th>
            <th>Campaign</th>
            <th>Created&nbsp;At</th>
            <th>Clicked&nbsp;At</th>
            <th>Submitted&nbsp;At</th>
            <th>IP&nbsp;Address</th>
            <th>User&nbsp;Agent</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.email}</td>
              <td>{r.link_id}</td>
              <td>{r.campaign || "-"}</td>
              <td>{fmt(r.created_at)}</td>
              <td>{fmt(r.clicked_at)}</td>
              <td>{fmt(r.submitted_at)}</td>
              <td>{r.ip_address || "-"}</td>
              <td className="ua">{r.user_agent || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClicksTable;
