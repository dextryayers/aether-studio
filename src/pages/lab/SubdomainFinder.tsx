import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { PageLayout } from "@/src/components/layout/PageLayout";
import { SEO } from "@/src/components/layout/SEO";
import {
  Search,
  Globe,
  Copy,
  Check,
  Download,
  Loader2,
  AlertCircle,
  ArrowDownUp,
  Filter,
  Radar,
  X,
  History,
  ShieldAlert,
  Tags,
  Layers,
  Trash2,
  Terminal,
  ScanLine,
  RefreshCw,
  Network,
} from "lucide-react";

const EXAMPLES = ["tesla.com", "github.com", "google.com", "shopify.com"];

const INTERESTING = [
  "admin", "dev", "stage", "staging", "test", "testing", "uat", "qa", "internal",
  "vpn", "git", "jenkins", "api", "beta", "alpha", "backup", "db", "database",
  "mysql", "grafana", "kibana", "jira", "ci", "cd", "gateway", "proxy",
  "sandbox", "demo", "preview", "staging", "intranet", "private", "hidden",
];

const MAX_RENDER = 400;
const IP_CONCURRENCY = 12;

const recentKey = "sdf:recent:v1";

function loadRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(recentKey) || "[]");
  } catch {
    return [];
  }
}

function pushRecent(domain: string) {
  const next = [domain, ...loadRecent().filter((d) => d !== domain)].slice(0, 6);
  localStorage.setItem(recentKey, JSON.stringify(next));
}

function firstLabel(sub: string, domain: string): string {
  const rest = sub.endsWith(`.${domain}`) ? sub.slice(0, -domain.length - 1) : "";
  if (!rest) return "";
  const parts = rest.split(".");
  return parts[parts.length - 1];
}

function isInteresting(sub: string): boolean {
  const labels = sub.split(".").slice(0, -2);
  return labels.some((l) => INTERESTING.includes(l));
}

async function resolveIp(sub: string): Promise<string[]> {
  const r = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(sub)}&type=A`);
  if (!r.ok) throw new Error("HTTP");
  const j = await r.json();
  if (j.Status === 2 || !j.Answer) return [];
  return j.Answer.filter((x: { type: number }) => x.type === 1).map((x: { data: string }) => x.data);
}

export default function SubdomainFinder() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [domain, setDomain] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [labelFilter, setLabelFilter] = useState("");
  const [descending, setDescending] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedRow, setCopiedRow] = useState("");
  const [phase, setPhase] = useState(0);
  const [ips, setIps] = useState<Record<string, string[]>>({});
  const [doneCount, setDoneCount] = useState(0);
  const [failed, setFailed] = useState<string[]>([]);
  const filterRef = useRef<HTMLInputElement>(null);
  const firstRun = useRef(true);
  const resolveToken = useRef(0);

  const search = async (d?: string) => {
    const raw = (d ?? domain).trim().toLowerCase().replace(/^https?:\/\//, "").split("/")[0].split(":")[0];
    if (!raw) {
      setError("Masukkan nama domain dulu.");
      return;
    }
    setDomain(raw);
    setSearchParams({ domain: raw }, { replace: true });
    pushRecent(raw);
    setLoading(true);
    setError("");
    setResults([]);
    setSources([]);
    setFilter("");
    setLabelFilter("");
    setDescending(false);
    setPhase(0);
    setIps({});
    setDoneCount(0);
    setFailed([]);
    resolveToken.current += 1;
    const timer = setInterval(() => setPhase((p) => Math.min(p + 1, 2)), 2200);
    try {
      const res = await fetch(`/api/subdomain-finder?domain=${encodeURIComponent(raw)}`);
      const data = await res.json().catch(() => null);
      if (!res.ok || !data) {
        throw new Error(data?.error || "Gagal mengambil data.");
      }
      if (!data.subdomains || data.subdomains.length === 0) {
        setError(`Tidak ada subdomain yang ditemukan untuk ${raw}.`);
      } else {
        setResults(data.subdomains);
        setSources(data.sources || []);
        resolveAll(data.subdomains, resolveToken.current);
      }
    } catch {
      setError("Gagal terhubung ke server. Coba lagi sebentar.");
    } finally {
      clearInterval(timer);
      setLoading(false);
    }
  };

  const resolveAll = async (subs: string[], token: number) => {
    let i = 0;
    const workers = Array.from({ length: Math.min(IP_CONCURRENCY, subs.length) }, async () => {
      while (i < subs.length) {
        const sub = subs[i++];
        try {
          const a = await resolveIp(sub);
          if (token !== resolveToken.current) return;
          if (a.length) setIps((prev) => ({ ...prev, [sub]: a }));
        } catch {
          if (token !== resolveToken.current) return;
          setFailed((prev) => (prev.includes(sub) ? prev : [...prev, sub]));
        } finally {
          if (token === resolveToken.current) setDoneCount((n) => n + 1);
        }
      }
    });
    await Promise.all(workers);
  };

  const retryIp = async (sub: string) => {
    setFailed((prev) => prev.filter((f) => f !== sub));
    try {
      const a = await resolveIp(sub);
      if (a.length) setIps((prev) => ({ ...prev, [sub]: a }));
    } catch {
      setFailed((prev) => [...prev, sub]);
    } finally {
      setDoneCount((n) => n + 1);
    }
  };

  useEffect(() => {
    const d = searchParams.get("domain");
    if (d && firstRun.current) {
      firstRun.current = false;
      setDomain(d);
      search(d);
    }
  }, []);

  const labels = useMemo(() => {
    if (!domain) return [];
    const map = new Map<string, number>();
    for (const s of results) {
      const l = firstLabel(s, domain);
      if (l) map.set(l, (map.get(l) || 0) + 1);
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10);
  }, [results, domain]);

  const interestingCount = useMemo(() => results.filter(isInteresting).length, [results]);

  const filtered = useMemo(() => {
    const f = filter.trim().toLowerCase();
    const base = results.filter(
      (s) => (!f || s.includes(f)) && (!labelFilter || firstLabel(s, domain) === labelFilter)
    );
    return [...base].sort((a, b) => (descending ? b.localeCompare(a) : a.localeCompare(b)));
  }, [results, filter, labelFilter, domain, descending]);

  const visible = filtered.slice(0, MAX_RENDER);
  const ipProgress = results.length > 0 ? Math.min(doneCount, results.length) : 0;

  const copyAll = () => {
    if (!filtered.length) return;
    navigator.clipboard.writeText(filtered.join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const copyRow = (sub: string) => {
    navigator.clipboard.writeText(sub);
    setCopiedRow(sub);
    setTimeout(() => setCopiedRow(""), 1500);
  };

  const download = () => {
    if (!filtered.length) return;
    const lines = filtered.map((s) => {
      const addrs = ips[s];
      return addrs && addrs.length ? `${s},${addrs.join(",")}` : s;
    });
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${domain.replace(/[^a-z0-9.-]/g, "_")}_subdomains.txt`;
    a.click();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.tagName === "INPUT" || t.tagName === "TEXTAREA") return;
      if (e.key === "/") {
        e.preventDefault();
        filterRef.current?.focus();
      }
      if (e.key === "Escape") setFilter("");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const phaseText = ["Menghubungi crt.sh & rapiddns.io...", "Memeriksa certspotter...", "Menggabungkan hasil..."];

  return (
    <PageLayout>
      <SEO
        title="Subdomain Finder | Lab"
        description="Enumerate subdomains dari 3 engine (crt.sh, rapiddns.io, certspotter) + resolve IP otomatis"
        path="/lab/subdomain-finder"
      />
      <div className="min-h-screen pt-32 pb-24 px-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Radar className="h-5 w-5 text-cyan-400" />
            </div>
            <h1 className="text-2xl lg:text-4xl font-black tracking-tighter uppercase text-foreground">
              Subdomain Finder
            </h1>
          </div>
          <p className="text-xs lg:text-sm text-muted-foreground max-w-xl">
            Enumerasi subdomain dari <span className="text-cyan-400">3 engine</span> (crt.sh, rapiddns.io,
            certspotter) dengan resolve IP otomatis per subdomain.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {["crt.sh", "rapiddns.io", "certspotter"].map((e) => (
              <span
                key={e}
                className={`px-2 py-0.5 border text-[9px] font-bold uppercase tracking-widest ${
                  sources.includes(e)
                    ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
                    : "border-border/40 text-muted-foreground/50"
                }`}
              >
                {e}
              </span>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="mb-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <input
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && search()}
                placeholder="example.com"
                className="w-full h-12 bg-background border border-border px-4 pr-10 text-sm text-foreground outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all placeholder:text-muted-foreground"
              />
              <Globe className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <button
              onClick={() => search()}
              disabled={loading}
              className="shrink-0 h-12 px-6 bg-primary text-primary-foreground text-[9px] font-black uppercase tracking-[0.25em] hover:brightness-110 transition-all disabled:opacity-40 flex items-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              {loading ? "Scanning" : "Find"}
            </button>
          </div>

          {/* Examples + recent */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
              Coba:
            </span>
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => search(ex)}
                disabled={loading}
                className="px-2.5 py-1 border border-border/60 text-[10px] font-mono text-muted-foreground hover:text-cyan-400 hover:border-cyan-500/40 transition-colors disabled:opacity-40"
              >
                {ex}
              </button>
            ))}
          </div>

          {!loading && loadRecent().length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                <History className="h-3 w-3" /> Riwayat:
              </span>
              {loadRecent().map((d) => (
                <button
                  key={d}
                  onClick={() => search(d)}
                  disabled={loading}
                  className="px-2.5 py-1 border border-border/40 text-[10px] font-mono text-muted-foreground/70 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors disabled:opacity-40"
                >
                  {d}
                </button>
              ))}
              <button
                onClick={() => localStorage.removeItem(recentKey)}
                className="p-1 text-muted-foreground/40 hover:text-red-400 transition-colors"
                title="Hapus riwayat"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex items-center gap-2 px-4 py-3 mb-6 border border-red-500/30 bg-red-500/5"
            >
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
              <p className="text-[11px] font-medium text-red-400">{error}</p>
              <button onClick={() => setError("")} className="ml-auto text-red-400/60 hover:text-red-400">
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scanning state */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="border border-border/60 bg-background/40 px-6 py-10 mb-6"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 border-2 border-border border-t-cyan-400 rounded-full animate-spin" />
                  <ScanLine className="absolute inset-0 m-auto h-6 w-6 text-cyan-400 animate-pulse" />
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground">
                    Scanning {domain}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1 font-mono">
                    <span className="inline-block w-2 text-cyan-400 animate-pulse">▸</span>{" "}
                    {phaseText[phase]}
                  </p>
                </div>
                <div className="w-40 h-0.5 bg-border overflow-hidden">
                  <motion.div
                    className="h-full bg-cyan-400"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        {!loading && results.length > 0 && (
          <>
            {/* Stats cards */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="border border-border/60 px-4 py-3">
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                  Total
                </p>
                <p className="text-xl font-black text-foreground tabular-nums">
                  {results.length.toLocaleString()}
                </p>
                <p className="text-[9px] text-muted-foreground/70 mt-0.5 font-mono">{domain}</p>
              </div>
              <div className="border border-border/60 px-4 py-3">
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                  Label
                </p>
                <p className="text-xl font-black text-foreground tabular-nums">{labels.length}</p>
                <p className="text-[9px] text-muted-foreground/70 mt-0.5 flex items-center gap-1">
                  <Layers className="h-2.5 w-2.5" /> group teratas
                </p>
              </div>
              <div className="border border-border/60 px-4 py-3">
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                  Menarik
                </p>
                <p className="text-xl font-black text-amber-400 tabular-nums">{interestingCount}</p>
                <p className="text-[9px] text-muted-foreground/70 mt-0.5 flex items-center gap-1">
                  <ShieldAlert className="h-2.5 w-2.5" /> dev/admin/staging
                </p>
              </div>
            </div>

            {/* Label chips */}
            {labels.length > 1 && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                  <Tags className="h-3 w-3" /> Label:
                </span>
                <button
                  onClick={() => setLabelFilter("")}
                  className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest border transition-colors ${
                    !labelFilter
                      ? "border-cyan-500/50 text-cyan-400 bg-cyan-500/10"
                      : "border-border/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Semua
                </button>
                {labels.map(([label, count]) => (
                  <button
                    key={label}
                    onClick={() => setLabelFilter(labelFilter === label ? "" : label)}
                    className={`px-2.5 py-1 text-[9px] font-mono border transition-colors flex items-center gap-1.5 ${
                      labelFilter === label
                        ? "border-cyan-500/50 text-cyan-400 bg-cyan-500/10"
                        : "border-border/60 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {label}
                    <span className="text-[8px] text-muted-foreground/60 tabular-nums">{count}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Toolbar */}
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="relative flex-1 min-w-[180px]">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  ref={filterRef}
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="Filter hasil... (tekan / untuk fokus, Esc untuk reset)"
                  className="w-full h-9 bg-background border border-border pl-9 pr-3 text-xs text-foreground outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all placeholder:text-muted-foreground"
                />
              </div>
              <button
                onClick={() => setDescending((v) => !v)}
                className="h-9 px-3 border border-border text-[8px] font-bold uppercase tracking-widest text-muted-foreground hover:text-cyan-400 hover:border-cyan-500/40 transition-all flex items-center gap-1.5"
                title="Ubah urutan"
              >
                <ArrowDownUp className="h-3 w-3" />
                {descending ? "Z-A" : "A-Z"}
              </button>
              <button
                onClick={copyAll}
                className="h-9 px-4 border border-border text-[8px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary hover:border-primary/40 transition-all flex items-center gap-1.5"
              >
                {copiedAll ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                {copiedAll ? "Copied" : "Copy All"}
              </button>
              <button
                onClick={download}
                className="h-9 px-4 border border-border text-[8px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary hover:border-primary/40 transition-all flex items-center gap-1.5"
              >
                <Download className="h-3 w-3" /> TXT
              </button>
            </div>

            {/* IP resolve progress */}
            <div className="flex items-center gap-2 mb-3">
              <Network className="h-3.5 w-3.5 text-cyan-400/70" />
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                Resolve IP: {ipProgress}/{results.length}
              </p>
              {ipProgress < results.length && (
                <div className="flex-1 max-w-[200px] h-0.5 bg-border overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 transition-all duration-300"
                    style={{ width: `${(ipProgress / results.length) * 100}%` }}
                  />
                </div>
              )}
            </div>

            {/* List */}
            <div className="border border-border/60 max-h-[55vh] overflow-y-auto">
              <AnimatePresence initial={false}>
                {visible.map((sub, i) => {
                  const interesting = isInteresting(sub);
                  const subIps = ips[sub];
                  const isFailed = failed.includes(sub);
                  const resolving = !subIps && !isFailed && ipProgress < results.length;
                  return (
                    <motion.div
                      key={sub}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.12, delay: Math.min(i * 0.004, 0.3) }}
                      className="group flex items-center justify-between px-4 py-2.5 border-b border-border/30 last:border-b-0 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-[9px] font-mono text-muted-foreground/60 w-10 shrink-0 tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {interesting && (
                          <span className="shrink-0" title="Kemungkinan internal / development">
                            <ShieldAlert className="h-3 w-3 text-amber-400/80" />
                          </span>
                        )}
                        <span
                          className={`text-xs font-mono truncate ${
                            interesting ? "text-amber-300/90" : "text-foreground"
                          }`}
                        >
                          {sub}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 ml-3 shrink-0">
                        {subIps && subIps.length > 0 ? (
                          <span className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground/70">
                            {subIps.join(" · ")}
                            <button
                              onClick={() => navigator.clipboard.writeText(subIps.join(","))}
                              className="p-0.5 text-muted-foreground/40 hover:text-cyan-400 transition-colors"
                              title="Salin IP"
                            >
                              <Copy className="h-2.5 w-2.5" />
                            </button>
                          </span>
                        ) : isFailed ? (
                          <button
                            onClick={() => retryIp(sub)}
                            className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-red-400/70 hover:text-red-400 transition-colors"
                            title="Gagal resolve, coba lagi"
                          >
                            <RefreshCw className="h-3 w-3" /> Ulangi
                          </button>
                        ) : resolving ? (
                          <Loader2 className="h-3 w-3 text-muted-foreground/50 animate-spin" />
                        ) : (
                          <span className="text-[9px] font-mono text-muted-foreground/40">—</span>
                        )}
                        <button
                          onClick={() => copyRow(sub)}
                          className="p-1 text-muted-foreground/50 hover:text-cyan-400 transition-colors"
                          title="Salin subdomain"
                        >
                          {copiedRow === sub ? (
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              {filtered.length === 0 && (
                <div className="px-4 py-10 text-center">
                  <p className="text-xs text-muted-foreground">
                    Tidak ada hasil yang cocok dengan{" "}
                    <span className="font-mono text-foreground">{filter || labelFilter}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
              <p className="flex items-center gap-1.5 text-[9px] text-muted-foreground/60 uppercase tracking-widest">
                <Terminal className="h-3 w-3 text-cyan-500/60" />
                {filtered.length > MAX_RENDER
                  ? `Menampilkan ${MAX_RENDER.toLocaleString()} dari ${filtered.length.toLocaleString()} — pakai filter untuk mempersempit`
                  : `${filtered.length} subdomain ditampilkan`}
              </p>
              <p className="flex items-center gap-1.5 text-[9px] text-muted-foreground/60 uppercase tracking-widest">
                <Network className="h-3 w-3 text-cyan-500/60" />
                Export TXT berisi subdomain + IP
              </p>
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
}
