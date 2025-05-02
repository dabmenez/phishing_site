/* -------------------------------------------------------------------------- */
/*  src/components/Admin/index.jsx                                            */
/* -------------------------------------------------------------------------- */
import React, { useState, useEffect, useMemo, useRef } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/my-tabs";
import { MailCheck, ShieldCheck, List, Download, Upload } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import ClicksTable from "./ClicksTable";
import SubmissionsTable from "./SubmissionsTable";
import "./admin.css";

const isEmailHeader = h => /(e[-_\s]?mail|upn|nome\s*upn|user.?principal.?name)/i.test(h);
const isTemaHeader = h => /(tema|assunto|campaign)/i.test(h);

const readSheet = async file => {
  const wb = XLSX.read(await file.arrayBuffer(), { type: "array" });
  const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 });
  return rows.filter(r => r.length);
};

export default function AdminDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState("clicks");
  const [stats, setStats] = useState({ totalClicks: 0, totalSubmissions: 0 });
  const [links, setLinks] = useState([]);
  const [email, setEmail] = useState("");
  const [tema, setTema] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const API = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchStats();
    fetchLinks();
  }, []);

  const fetchStats = async () => {
    try {
      const j = await (await fetch(`${API}/admin/stats`)).json();
      setStats({
        totalClicks: j.total_clicks ?? j.totalClicks ?? 0,
        totalSubmissions: j.total_submissions ?? j.totalSubmissions ?? 0,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const fetchLinks = async () => {
    try {
      setLinks(await (await fetch(`${API}/admin/target-link`)).json());
    } catch (e) {
      console.error(e);
    }
  };

  const genLink = async payload => {
    const r = await fetch(`${API}/admin/generate-link`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!r.ok) throw new Error((await r.json()).detail || "Erro");
  };

  const handleGenerate = async () => {
    if (!email) return;
    setBusy(true);
    setMsg(null);
    try {
      await genLink({ email, campaign: tema || undefined });
      setEmail("");
      setTema("");
      await Promise.all([fetchStats(), fetchLinks()]);
      setMsg("Link gerado com sucesso ✅");
    } catch (err) {
      setMsg(err.message || "Erro inesperado");
    } finally {
      setBusy(false);
    }
  };

  const handleFileChange = e => {
    setFile(e.target.files[0] || null);
    setMsg(null);
  };

  const handleImport = async () => {
    if (!file) return;
    setBusy(true);
    setMsg("Processando planilha…");
    try {
      const rows = await readSheet(file);
      const header = rows[0].map(h => String(h).toLowerCase().trim());
      const idxEmail = header.findIndex(isEmailHeader);
      const idxTema = header.findIndex(isTemaHeader);
      if (idxEmail === -1) throw new Error("Coluna de email não encontrada.");
      const records = rows.slice(1)
        .map(row => ({ email: row[idxEmail], campaign: idxTema !== -1 ? row[idxTema] : undefined }))
        .filter(r => r.email);
      for (let i = 0; i < records.length; i += 10) {
        await Promise.all(records.slice(i, i + 10).map(rec => genLink(rec)));
      }
      await Promise.all([fetchStats(), fetchLinks()]);
      setMsg(`Processado: ${records.length} registros ✅`);
    } catch (err) {
      console.error(err);
      setMsg(err.message || "Erro ao processar planilha");
    } finally {
      setBusy(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const chartData = useMemo(() => {
    const map = {};
    links.forEach(l => {
      if (l.clicked_at) {
        const d = format(parseISO(l.clicked_at), "yyyy-MM-dd");
        (map[d] ??= { date: d, clicks: 0, submissions: 0 }).clicks++;
      }
      if (l.submitted_at) {
        const d = format(parseISO(l.submitted_at), "yyyy-MM-dd");
        (map[d] ??= { date: d, clicks: 0, submissions: 0 }).submissions++;
      }
    });
    return Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
  }, [links]);

  const exportCSV = async () => {
    try {
      const [clicksRes, formsRes] = await Promise.all([
        fetch(`${API}/admin/target-link`),
        fetch(`${API}/data/export`),
      ]);
      const clicks = await clicksRes.json();
      const forms = await formsRes.json();
      const buildCsv = (headers, rows) => [
        headers.join(","),
        ...rows.map(r => headers.map(h => {
          const key = h.toLowerCase().replace(/ /g, "_");
          return `"${String(r[key] ?? "").replace(/"/g, '""')}"`;
        }).join(","))
      ].join("\n");
      const clickCsv = buildCsv(
        ["ID","Email","Link ID","Campaign","Created At","Clicked At","Submitted At","IP Address","User Agent"],
        clicks
      );
      const formCsv = buildCsv(
        ["ID","Link ID","Email","Nome","CPF","Timestamp","IP Address","User Agent"],
        forms
      );
      const zip = new JSZip();
      zip.file("click_tracking.csv", clickCsv);
      zip.file("form_submissions.csv", formCsv);
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `phishing_export_${new Date().toISOString().slice(0,10)}.zip`);
    } catch (err) {
      console.error("Erro exportação:", err);
      alert("Falha ao exportar dados");
    }
  };

  return (
    <div className="admin-page">
      <h1 className="admin-title">Phishing Test – Admin Dashboard</h1>
      <div className="kpi-grid">
        {[
          { title: "Total Emails", icon: <List size={32} color="#3b82f6" />, value: links.length },
          { title: "Total Clicks", icon: <MailCheck size={32} color="#3b82f6" />, value: stats.totalClicks },
          { title: "Total Submissions", icon: <ShieldCheck size={32} color="#3b82f6" />, value: stats.totalSubmissions },
        ].map(({ title, icon, value }) => (
          <div key={title} className="kpi-card">
            <div className="kpi-info">
              <span className="kpi-title">{title}</span>
              <span className="kpi-value">{value}</span>
            </div>
            {icon}
          </div>
        ))}
      </div>

      <div className="section-card">
        <div className="section-header">
          <h2 className="section-title">Gerar & Importar Links</h2>
          <button className="export-btn" onClick={exportCSV}>
            <Download size={16} /> Exportar dados (.zip)
          </button>
        </div>
        <div className="section-body">
          <div className="field-group">
            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              placeholder="john@empresa.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <label className="label">Tema (opcional)</label>
            <input
              className="input"
              type="text"
              placeholder="investimento | gti | rh"
              value={tema}
              onChange={e => setTema(e.target.value)}
            />
            <button
              className="action-btn"
              onClick={handleGenerate}
              disabled={busy || !email}
            >
              {busy ? "Processando…" : "Gerar Link Manual"}
            </button>
            {msg && <p className="message">{msg}</p>}
          </div>

          <div className="field-group">
            <label className="label">Importar Planilha</label>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Upload size={20} color="#666" />
              <input
                className="input"
                type="file"
                accept=".csv,.xlsx"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
            </div>
            <p style={{ fontSize: "0.85rem", color: "#777" }}>
              Use cabeçalhos “Email” e “Tema”.
            </p>
            <button
              className="action-btn"
              onClick={handleImport}
              disabled={busy || !file}
            >
              {busy ? "Importando…" : "Importar Planilha"}
            </button>
          </div>
        </div>
      </div>

      {links.length > 0 && (
        <div className="chart-card">
          <div className="chart-title">Clicks × Submissions</div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={d => format(parseISO(d), "dd/MM")} />
                <YAxis allowDecimals={false} />
                <Tooltip labelFormatter={d => format(parseISO(String(d)), "PPP")} />
                <Line type="monotone" dataKey="clicks" stroke="#3b82f6" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="submissions" stroke="#10b981" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="tabs-container">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="tabs-list">
            <TabsTrigger className="tab-trigger" value="clicks">Click Tracking</TabsTrigger>
            <TabsTrigger className="tab-trigger" value="submissions">Form Submissions</TabsTrigger>
          </TabsList>
          <TabsContent className="tab-content" value="clicks">
            <ClicksTable key={refreshKey} onRefresh={fetchLinks} />
          </TabsContent>
          <TabsContent className="tab-content" value="submissions">
            <SubmissionsTable key={refreshKey} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
