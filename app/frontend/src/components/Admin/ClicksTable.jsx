import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";

/* troque pelo seu componente, se já existir */
const Checkbox = ({ checked, indeterminate, onChange }) => (
  <input
    type="checkbox"
    className="h-4 w-4 cursor-pointer accent-blue-600"
    ref={el => el && (el.indeterminate = indeterminate)}
    checked={checked}
    onChange={onChange}
  />
);

const API = process.env.REACT_APP_BACKEND_URL;

/* helper p/ datas ISO → “YYYY-MM-DD HH:MM:SS” */
const fmt = ts => ts?.slice(0, 19).replace("T", " ") ?? "-";

const ClicksTable = ({ onRefresh }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLo] = useState(true);
  const [sel, setSel] = useState(new Set());

  /* fetch ---------------------------------------------------------------- */
  const fetchRows = async () => {
    setLo(true);
    try   { setRows(await (await fetch(`${API}/admin/target-link`)).json()); }
    catch (e) { console.error(e); }
    finally { setLo(false); }
  };
  useEffect(() => { fetchRows(); }, []);

  /* seleção -------------------------------------------------------------- */
  const toggleOne = email =>
    setSel(s => {
      const n = new Set(s);
      n.has(email) ? n.delete(email) : n.add(email);
      return n;
    });

  const toggleAll = () =>
    setSel(sel.size === rows.length ? new Set()
                                   : new Set(rows.map(r => r.email)));

  /* deleção -------------------------------------------------------------- */
  const deleteSelected = async () => {
    if (!sel.size) return;
    try {
      await fetch(`${API}/admin/emails`, {
        method:  "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails: Array.from(sel) }),
      });
      setSel(new Set());
      await fetchRows();
      onRefresh?.();
    } catch (e) { console.error(e); }
  };

  /* UI ------------------------------------------------------------------- */
  if (loading) return <p className="py-8 text-center">Carregando…</p>;

  return (
    <div className="space-y-4">
      {/* barra de ações */}
      <Button
        disabled={!sel.size}
        onClick={deleteSelected}
        className="flex items-center gap-1 bg-red-600 hover:bg-red-700 disabled:opacity-40"
      >
        <Trash2 className="h-4 w-4" />
        Delete&nbsp;({sel.size})
      </Button>

      {/* tabela */}
      <div className="overflow-auto rounded-xl border">
        <table className="min-w-[960px] w-full text-sm border-x">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="w-8 text-center px-3 py-2">
                <Checkbox
                  checked={sel.size === rows.length && rows.length > 0}
                  indeterminate={sel.size > 0 && sel.size < rows.length}
                  onChange={toggleAll}
                />
              </th>
              <th className="px-4 py-2">EMAIL</th>
              <th className="px-4 py-2">LINK&nbsp;ID</th>
              <th className="px-4 py-2">CAMPAIGN</th>
              <th className="px-4 py-2">CREATED</th>
              <th className="px-4 py-2">CLICKED</th>
              <th className="px-4 py-2">SUBMITTED</th>
              <th className="px-4 py-2">IP</th>
              <th className="px-4 py-2">USER&nbsp;AGENT</th>
            </tr>
          </thead>

          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="odd:bg-white even:bg-gray-50 border-b">
                <td className="text-center px-3 py-2">
                  <Checkbox
                    checked={sel.has(r.email)}
                    onChange={() => toggleOne(r.email)}
                  />
                </td>
                <td className="px-4 py-2">{r.email}</td>
                <td className="px-4 py-2">{r.link_id}</td>
                <td className="px-4 py-2">{r.campaign ?? "-"}</td>
                <td className="px-4 py-2">{fmt(r.created_at)}</td>
                <td className="px-4 py-2">{fmt(r.clicked_at)}</td>
                <td className="px-4 py-2">{fmt(r.submitted_at)}</td>
                <td className="px-4 py-2">{r.ip_address ?? "-"}</td>
                <td className="px-4 py-2 max-w-[300px] break-all">{r.user_agent ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClicksTable;
