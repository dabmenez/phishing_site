import React, { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

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

  const fmt = (iso) => {
    const d = new Date(iso);
    return isNaN(d) ? "-" : d.toLocaleString("pt-BR", { hour12: false });
  };

  if (loading) return <Skeleton className="h-32 w-full rounded-xl" />;

  return (
    <div className="overflow-auto rounded-xl border">
      <table className="min-w-full text-sm whitespace-nowrap">
        <thead>
          <tr className="bg-muted/50 text-left text-xs uppercase tracking-wider">
            <th className="px-3 py-2">ID</th>
            <th className="px-3 py-2">Link ID</th>
            <th className="px-3 py-2">Email</th>
            <th className="px-3 py-2">Nome</th>
            <th className="px-3 py-2">CPF</th>
            <th className="px-3 py-2">Timestamp</th>
            <th className="px-3 py-2">IP</th>
            <th className="px-3 py-2">User Agent</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="hover:bg-gray-50">
              <td className="px-3 py-2">{r.id}</td>
              <td className="px-3 py-2">{r.link_id}</td>
              <td className="px-3 py-2">{r.email}</td>
              <td className="px-3 py-2">{r.nome}</td>
              <td className="px-3 py-2">{r.cpf}</td>
              <td className="px-3 py-2">{fmt(r.timestamp)}</td>
              <td className="px-3 py-2">{r.ip_address || "-"}</td>
              <td className="px-3 py-2 max-w-xs break-all">{r.user_agent || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubmissionsTable;
