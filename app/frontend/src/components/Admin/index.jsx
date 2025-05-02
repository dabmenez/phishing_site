/* -------------------------------------------------------------------------- */
/*  src/components/Admin/index.jsx                                            */
/* -------------------------------------------------------------------------- */
import React, {
  useState, useEffect, useMemo, useRef,
} from "react";
import {
  Card, CardHeader, CardTitle, CardContent,
} from "../ui/card";
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
} from "../ui/my-tabs";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { MailCheck, ShieldCheck, Upload, List } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import * as XLSX from "xlsx";
import ClicksTable from "./ClicksTable";
import SubmissionsTable from "./SubmissionsTable";

/* ----------------------------- util helpers ------------------------------ */
const isEmailHeader = (h) =>
  /(e[-_\s]?mail|upn|nome\s*upn|user.?principal.?name)/i.test(h);
const isTemaHeader  = (h) => /(tema|assunto|campaign)/i.test(h);

const readSheet = async (file) => {
  const wb   = XLSX.read(await file.arrayBuffer(), { type: "array" });
  const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 });
  return rows.filter((r) => r.length);
};

/* -------------------------------- main ----------------------------------- */
const AdminDashboard = () => {
  /* ---------------- state ---------------- */
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab,  setActiveTab]  = useState("");
  const refreshAll                  = () => setRefreshKey((k) => k + 1);

  const [stats, setStats] = useState({ totalClicks: 0, totalSubmissions: 0 });
  const [links, setLinks] = useState([]);

  const [email, setEmail] = useState("");
  const [tema,  setTema]  = useState("");

  const [busy, setBusy]       = useState(false);
  const [msg,  setMsg]        = useState(null);
  const [file, setFile]       = useState(null);           // ← novo
  const fileInputRef          = useRef(null);             // ← para limpar

  const API = process.env.REACT_APP_BACKEND_URL;

  /* ---------------- effects ---------------- */
  useEffect(() => { fetchStats(); fetchLinks(); }, []);

  const fetchStats = async () => {
    try {
      const j = await (await fetch(`${API}/admin/stats`)).json();
      setStats({
        totalClicks:      j.total_clicks      ?? j.totalClicks      ?? 0,
        totalSubmissions: j.total_submissions ?? j.totalSubmissions ?? 0,
      });
    } catch (e) { console.error(e); }
  };

  const fetchLinks = async () => {
    try { setLinks(await (await fetch(`${API}/admin/target-link`)).json()); }
    catch (e) { console.error(e); }
  };

  /* ---------------- API helper ---------------- */
  const genLink = async (payload) => {
    const r = await fetch(`${API}/admin/generate-link`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
    });
    if (!r.ok) throw new Error((await r.json()).detail || "Erro");
  };

  /* ---------------- actions ---------------- */
  const handleGenerate = async () => {
    if (!email) return;
    setBusy(true); setMsg(null);

    try {
      await genLink({ email, campaign: tema || undefined });
      setEmail(""); setTema("");
      await Promise.all([fetchStats(), fetchLinks()]);
      setMsg("Link gerado com sucesso ✅");
    } catch (err) {
      setMsg(err.message || "Erro inesperado");
    } finally {
      setBusy(false);
    }
  };

  /* guarda o arquivo, mas não processa ainda */
  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] || null);
    setMsg(null);
  };

  /* processa o arquivo quando clicar no botão Importar */
  const handleImport = async () => {
    if (!file) return;
    setBusy(true); setMsg("Processando planilha…");

    try {
      const rows    = await readSheet(file);
      const header  = rows[0].map((h) => String(h).toLowerCase().trim());
      console.log("Cabeçalho lido:", header);

      const idxEmail = header.findIndex(isEmailHeader);
      const idxTema  = header.findIndex(isTemaHeader);
      if (idxEmail === -1) throw new Error("Coluna de email não encontrada.");

      const records = rows.slice(1)
        .map((row) => ({
          email: row[idxEmail],
          campaign: idxTema !== -1 ? row[idxTema] : undefined,
        }))
        .filter((r) => r.email);

      for (let i = 0; i < records.length; i += 10) {
        await Promise.all(records.slice(i, i + 10).map((rec) => genLink(rec)));
      }

      await Promise.all([fetchStats(), fetchLinks()]);
      setMsg(`Processado: ${records.length} registros ✅`);
    } catch (err) {
      console.error(err);
      setMsg(err.message || "Erro ao processar planilha");
    } finally {
      setBusy(false);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = ""; // limpa input
    }
  };

  /* ---------------- chart data ---------------- */
  const chartData = useMemo(() => {
    const map = {};
    links.forEach((l) => {
      if (l.clicked_at) {
        const d = format(parseISO(l.clicked_at), "yyyy-MM-dd");
        (map[d] ??= { date: d, clicks: 0, submissions: 0 }).clicks += 1;
      }
      if (l.submitted_at) {
        const d = format(parseISO(l.submitted_at), "yyyy-MM-dd");
        (map[d] ??= { date: d, clicks: 0, submissions: 0 }).submissions += 1;
      }
    });
    return Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
  }, [links]);

  /* ---------------- UI ---------------- */
  return (
    <div className="px-6 py-10 space-y-10 max-w-7xl mx-auto">
      {/* heading + KPIs */}
      <header className="space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight text-center">
          Phishing Test – Admin Dashboard
        </h1>

        {/* flex em vez de grid  */}
        <div className="flex flex-wrap justify-center gap-6">
          {/* Total Clicks */}
          <Card className="w-40 sm:w-48 flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
              <MailCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.totalClicks}</p>
            </CardContent>
          </Card>

          {/* Total Submissions */}
          <Card className="w-40 sm:w-48 flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.totalSubmissions}</p>
            </CardContent>
          </Card>

          {/* Total Emails */}
          <Card className="w-40 sm:w-48 flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Emails</CardTitle>
              <List className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{links.length}</p>
            </CardContent>
          </Card>
        </div>
      </header>

      {/* form manual + upload */}
      <Card>
        <CardHeader>
          <CardTitle>Generate personalised link(s)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2">
            {/* esquerda – manual */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@acme.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Tema (opcional)</Label>
                <Input
                  value={tema}
                  onChange={(e) => setTema(e.target.value)}
                  placeholder="investimento | gti | rh"
                />
              </div>

              {msg && <p className="text-sm font-medium">{msg}</p>}

              <Button
                disabled={busy || !email}
                onClick={handleGenerate}
                className="w-full"
              >
                {busy && !file ? "Processando…" : "Gerar link manual"}
              </Button>
            </div>

            {/* direita – upload */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>
                  CSV ou XLSX{" "}
                  <span className="text-xs text-muted-foreground">
                    (Email, Tema)
                  </span>
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept=".csv,.xlsx"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="flex-1 file:mr-4"
                  />
                  <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Envie uma planilha com cabeçalhos “Email” e “Tema”.
              </p>

              <Button
                variant="secondary"
                disabled={busy || !file}
                onClick={handleImport}
              >
                {busy && file ? "Importando…" : "Importar planilha"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* gráfico */}
      {links.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle>Clicks × Submissions</CardTitle>
            </CardHeader>
            <CardContent className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(d) => format(parseISO(d), "dd/MM")}
                  />
                  <YAxis allowDecimals={false} />
                  <Tooltip labelFormatter={(d) => format(parseISO(String(d)), "PPP")} />
                  <Line type="monotone" dataKey="clicks" strokeWidth={2} dot={false} />
                  <Line
                    type="monotone"
                    dataKey="submissions"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* tables */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="clicks">Click Tracking</TabsTrigger>
          <TabsTrigger value="submissions">Form Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="clicks">
          <ClicksTable key={refreshKey} onRefresh={refreshAll} />
        </TabsContent>

        <TabsContent value="submissions">
          <SubmissionsTable key={refreshKey} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
