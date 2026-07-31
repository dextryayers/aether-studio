import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { PageLayout } from "@/src/components/layout/PageLayout";
import { SEO } from "@/src/components/layout/SEO";
import {
  Search,
  Copy,
  Check,
  Download,
  Loader2,
  AlertCircle,
  Globe,
  X,
  Terminal,
  History,
  Trash2,
  Network,
  Braces,
  ScanLine,
  ShieldCheck,
  Filter,
  ArrowDownUp,
  AlertTriangle,
  Crosshair,
  Zap,
  ListTree,
  Clock,
} from "lucide-react";

type DnsRecord = {
  name: string;
  type: string;
  ttl: number;
  data: string;
  confirmed: boolean;
};

type ReverseRecord = {
  ip: string;
  ptr: string | null;
};

const RECORD_TYPES: { type: string; id: number }[] = [
  { type: "A", id: 1 },
  { type: "AAAA", id: 28 },
  { type: "CNAME", id: 5 },
  { type: "MX", id: 15 },
  { type: "NS", id: 2 },
  { type: "TXT", id: 16 },
  { type: "SOA", id: 6 },
  { type: "CAA", id: 257 },
  { type: "SRV", id: 33 },
  { type: "HTTPS", id: 65 },
  { type: "SVCB", id: 64 },
  { type: "DNSKEY", id: 48 },
  { type: "DS", id: 43 },
  { type: "TLSA", id: 52 },
  { type: "SSHFP", id: 44 },
  { type: "NAPTR", id: 35 },
  { type: "LOC", id: 29 },
  { type: "HINFO", id: 13 },
  { type: "PTR", id: 12 },
];

const DEEP_HOSTS = [
  "www", "mail", "smtp", "pop", "pop3", "imap", "mx", "ns1", "ns2", "ns3", "ns4",
  "ftp", "sftp", "blog", "shop", "store", "app", "m", "mobile", "api", "dev",
  "staging", "test", "beta", "admin", "portal", "webmail", "cdn", "static",
  "assets", "media", "vpn", "remote", "git", "status", "support", "help",
  "dashboard", "docs", "console", "account", "login", "secure", "autodiscover",
  "autoconfig", "www2", "chat", "email",
];

const SRV_NAMES = [
  "_sip._tcp", "_sip._udp", "_sips._tcp", "_sipfederationtls._tcp",
  "_xmpp-server._tcp", "_xmpp-client._tcp", "_imap._tcp", "_imaps._tcp",
  "_pop3._tcp", "_ldap._tcp", "_kerberos._tcp", "_autodiscover._tcp",
  "_caldav._tcp", "_carddav._tcp", "_matrix._tcp", "_minecraft._tcp",
  "_h323cs._tcp", "_ocsp._tcp", "_submit._tcp", "_submission._tcp",
];

const PALETTE = [
  { color: "text-emerald-400", badge: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" },
  { color: "text-teal-400", badge: "border-teal-500/30 bg-teal-500/10 text-teal-400" },
  { color: "text-cyan-400", badge: "border-cyan-500/30 bg-cyan-500/10 text-cyan-400" },
  { color: "text-purple-400", badge: "border-purple-500/30 bg-purple-500/10 text-purple-400" },
  { color: "text-blue-400", badge: "border-blue-500/30 bg-blue-500/10 text-blue-400" },
  { color: "text-amber-400", badge: "border-amber-500/30 bg-amber-500/10 text-amber-400" },
  { color: "text-rose-400", badge: "border-rose-500/30 bg-rose-500/10 text-rose-400" },
  { color: "text-lime-400", badge: "border-lime-500/30 bg-lime-500/10 text-lime-400" },
  { color: "text-fuchsia-400", badge: "border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-400" },
  { color: "text-orange-400", badge: "border-orange-500/30 bg-orange-500/10 text-orange-400" },
];

const RESOLVERS = [
  {
    name: "Google",
    query: async (name: string, type: number) => {
      const r = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${type}`);
      if (!r.ok) throw new Error("HTTP");
      return r.json();
    },
  },
  {
    name: "Cloudflare",
    query: async (name: string, type: number) => {
      const r = await fetch(
        `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${type}`,
        { headers: { accept: "application/dns-json" } }
      );
      if (!r.ok) throw new Error("HTTP");
      return r.json();
    },
  },
];

const EXAMPLES = ["tesla.com", "github.com", "google.com", "aether.studio"];

const recentKey = "dnf:recent:v3";

type Answer = { name: string; type: number; TTL: number; data: string };

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

function formatData(type: string, data: string): string {
  if (type === "TXT") return data.replace(/"/g, "");
  if (type === "SRV") {
    const m = data.match(/^(\d+)\s+(\d+)\s+(\d+)\s+(\S+)/);
    if (m) return `${m[4]} :${m[3]} (prio ${m[1]} · weight ${m[2]})`;
  }
  return data;
}

function parseSvcParam(key: number, val: number[]): string | null {
  const fmt = (arr: number[]) => arr.map((b) => b.toString(16).padStart(2, "0")).join("");
  switch (key) {
    case 1: {
      const out: string[] = [];
      let i = 0;
      while (i < val.length) {
        const l = val[i];
        out.push(String.fromCharCode(...val.slice(i + 1, i + 1 + l)));
        i += 1 + l;
      }
      return `alpn=${out.join(",")}`;
    }
    case 2:
      return "no-default-alpn";
    case 3:
      return `port=${(val[0] << 8) | val[1]}`;
    case 4: {
      const ips: string[] = [];
      for (let i = 0; i + 3 < val.length; i += 4)
        ips.push(`${val[i]}.${val[i + 1]}.${val[i + 2]}.${val[i + 3]}`);
      return `ipv4hint=${ips.join(",")}`;
    }
    case 5:
      return `ech=0x${fmt(val).slice(0, 32)}${val.length > 16 ? "…" : ""}`;
    case 6: {
      const ips: string[] = [];
      for (let i = 0; i + 15 < val.length; i += 16) {
        const g: string[] = [];
        for (let j = 0; j < 16; j += 2) g.push(fmt([val[i + j], val[i + j + 1]]));
        ips.push(g.join(":"));
      }
      return `ipv6hint=${ips.join(",")}`;
    }
    default:
      return val.length ? `key${key}=0x${fmt(val).slice(0, 32)}` : null;
  }
}

function parseSvc(data: string): string {
  if (!data.startsWith("\\# ")) return data;
  const raw = data
    .slice(3)
    .split(" ")
    .map((h) => parseInt(h, 16))
    .filter((n) => !isNaN(n))
    .slice(1);
  if (raw.length < 3) return data;
  let pos = 0;
  const priority = (raw[0] << 8) | raw[1];
  pos = 2;
  let target = "";
  if (raw[pos] === 0) {
    target = ".";
    pos++;
  } else {
    let name = "";
    while (pos < raw.length) {
      const len = raw[pos];
      pos++;
      if (len === 0) break;
      name += String.fromCharCode(...raw.slice(pos, pos + len)) + ".";
      pos += len;
    }
    target = name || ".";
  }
  const parts: string[] = [String(priority), target];
  while (pos + 3 < raw.length) {
    const key = (raw[pos] << 8) | raw[pos + 1];
    const len = (raw[pos + 2] << 8) | raw[pos + 3];
    pos += 4;
    const val = raw.slice(pos, pos + len);
    pos += len;
    const s = parseSvcParam(key, val);
    if (s) parts.push(s);
  }
  return parts.join(" ");
}

async function runPool<T>(
  tasks: (() => Promise<T>)[],
  concurrency: number,
  onProgress?: (done: number, total: number) => void
): Promise<PromiseSettledResult<T>[]> {
  let i = 0;
  let done = 0;
  const results: PromiseSettledResult<T>[] = [];
  const workers = Array.from({ length: Math.min(concurrency, tasks.length) }, async () => {
    while (i < tasks.length) {
      const idx = i++;
      try {
        const v = await tasks[idx]();
        results[idx] = { status: "fulfilled", value: v };
      } catch (e) {
        results[idx] = { status: "rejected", reason: e };
      }
      done++;
      onProgress?.(done, tasks.length);
    }
  });
  await Promise.all(workers);
  return results;
}

export default function DnsFinder() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [domain, setDomain] = useState("");
  const [records, setRecords] = useState<DnsRecord[]>([]);
  const [reverses, setReverses] = useState<ReverseRecord[]>([]);
  const [chains, setChains] = useState<Record<string, string[]>>({});
  const [svcPretty, setSvcPretty] = useState<Record<string, string>>({});
  const [wildcard, setWildcard] = useState<boolean | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set(RECORD_TYPES.map((r) => r.type)));
  const [deep, setDeep] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [descending, setDescending] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedKey, setCopiedKey] = useState("");
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [stats, setStats] = useState({ queries: 0, ms: 0 });
  const firstRun = useRef(true);
  const token = useRef(0);

  const search = async (d?: string) => {
    const raw = (d ?? domain).trim().toLowerCase().replace(/^https?:\/\//, "").split("/")[0].split(":")[0];
    if (!raw) {
      setError("Masukkan nama domain dulu.");
      return;
    }
    if (selected.size === 0) {
      setError("Pilih minimal satu tipe record.");
      return;
    }
    setDomain(raw);
    setSearchParams({ domain: raw }, { replace: true });
    pushRecent(raw);
    setLoading(true);
    setError("");
    setRecords([]);
    setReverses([]);
    setChains({});
    setSvcPretty({});
    setWildcard(null);
    setFilter("");
    setPhase(0);
    setProgress({ done: 0, total: 0 });
    token.current += 1;
    const t = token.current;
    const t0 = performance.now();
    let queries = 0;
    const timer = setInterval(() => setPhase((p) => Math.min(p + 1, 4)), 2200);
    try {
      const types = RECORD_TYPES.filter((r) => selected.has(r.type));
      const all: DnsRecord[] = [];
      let nx = false;
      const tasks: (() => Promise<void>)[] = [];

      // 1) Apex types (dual resolver)
      for (const tp of types) {
        for (const res of RESOLVERS) {
          tasks.push(async () => {
            try {
              const j = await res.query(raw, tp.id);
              if (j.Status === 3) throw new Error("NXDOMAIN");
              if (j.Status !== 0) throw new Error(`Status ${j.Status}`);
              results.push({ tp, res: res.name, answers: (j.Answer || []) as Answer[] });
            } catch (e) {
              failures.push({ tp, res: res.name, msg: (e as Error).message });
            }
          });
        }
      }

      // 2) Deep scan: wordlist hosts (A, AAAA, CNAME, HTTPS)
      if (deep) {
        for (const host of DEEP_HOSTS) {
          const fqdn = `${host}.${raw}`;
          for (const type of [1, 28, 5, 65]) {

            tasks.push(async () => {
              try {
                const j = await RESOLVERS[0].query(fqdn, type);
                if (j.Status === 0 && j.Answer) {
                  deepResults.push(
                    ((j.Answer || []) as Answer[])
                      .filter((a) => a.type === type)
                      .map((a) => ({ tp: type, name: a.name, ttl: a.TTL ?? 0, data: a.data }))
                  );
                }
              } catch {
                /* ignore per-host failures */
              }
            });
          }
        }
        // SRV services
        for (const srv of SRV_NAMES) {
          tasks.push(async () => {
            try {
              const j = await RESOLVERS[0].query(`${srv}.${raw}`, 33);
              if (j.Status === 0 && j.Answer) {
                deepResults.push(
                  ((j.Answer || []) as Answer[])
                    .filter((a) => a.type === 33)
                    .map((a) => ({ tp: 33, name: a.name, ttl: a.TTL ?? 0, data: a.data }))
                );
              }
            } catch {
              /* ignore */
            }
          });
        }
        // DMARC + MTA-STS
        for (const pre of ["_dmarc", "_mta-sts"]) {
          tasks.push(async () => {
            try {
              const j = await RESOLVERS[0].query(`${pre}.${raw}`, 16);
              if (j.Status === 0 && j.Answer) {
                deepResults.push(
                  ((j.Answer || []) as Answer[])
                    .filter((a) => a.type === 16)
                    .map((a) => ({ tp: 16, name: a.name, ttl: a.TTL ?? 0, data: a.data }))
                );
              }
            } catch {
              /* ignore */
            }
          });
        }
      }

      const results: { tp: { type: string; id: number }; res: string; answers: Answer[] }[] = [];
      const failures: { tp: { type: string; id: number }; res: string; msg: string }[] = [];
      const deepResults: { tp: number; name: string; ttl: number; data: string }[][] = [];
      const onProgress = (doneN: number, totalN: number) => {
        setProgress({ done: doneN, total: totalN });
        setStats({ queries: doneN, ms: Math.round(performance.now() - t0) });
      };

      await runPool(tasks, 16, onProgress);

      if (t !== token.current) return;

      // Merge apex dual-resolver
      for (const tp of types) {
        const got = results.filter((r) => r.tp.type === tp.type);
        const answered = got.filter((g) => g.answers.length > 0);
        const merged = new Map<string, { name: string; ttl: number; data: string; seen: number }>();
        for (const g of answered) {
          for (const ans of g.answers) {
            const cur = merged.get(ans.data);
            if (cur) {
              cur.seen++;
              cur.ttl = Math.min(cur.ttl, ans.TTL ?? cur.ttl);
            } else {
              merged.set(ans.data, { name: ans.name.replace(/\.$/, ""), ttl: ans.TTL ?? 0, data: ans.data, seen: 1 });
            }
          }
        }
        merged.forEach((m) =>
          all.push({ ...m, type: tp.type, confirmed: m.seen >= 2 && got.length >= 2 })
        );
        if (merged.size === 0 && got.length > 0 && failures.some((f) => f.tp.type === tp.type && f.msg === "NXDOMAIN")) {
          nx = true;
        }
      }

      // Merge deep results
      const deepMerged = new Map<string, { name: string; ttl: number; data: string }>();
      for (const batch of deepResults) {
        for (const rec of batch) {
          const key = `${rec.tp}:${rec.data}`;
          const cur = deepMerged.get(key);
          if (cur) cur.ttl = Math.min(cur.ttl, rec.ttl);
          else deepMerged.set(key, { name: rec.name.replace(/\.$/, ""), ttl: rec.ttl, data: rec.data });
        }
      }
      const TYPE_ID_TO_NAME = new Map(RECORD_TYPES.map((r) => [r.id, r.type]));
      deepMerged.forEach((m, key) => {
        const tpId = Number(key.split(":")[0]);
        all.push({ ...m, type: TYPE_ID_TO_NAME.get(tpId) || "A", confirmed: false });
      });

      // Pretty-parse HTTPS/SVCB
      const svc: Record<string, string> = {};
      all
        .filter((r) => r.type === "HTTPS" || r.type === "SVCB")
        .forEach((r) => {
          svc[r.data] = parseSvc(r.data);
        });
      setSvcPretty(svc);

      // CNAME / MX / NS chain resolution
      const chainTargets = new Set<string>();
      all
        .filter((r) => r.type === "CNAME" || r.type === "NS")
        .forEach((r) => chainTargets.add(r.data.replace(/\.$/, "")));
      all
        .filter((r) => r.type === "MX")
        .forEach((r) => {
          const t = r.data.split(" ").pop()?.replace(/\.$/, "");
          if (t && t.includes(".")) chainTargets.add(t);
        });
      const chainList = Array.from(chainTargets).slice(0, 30);
      const chainResults = await runPool(
        chainList.map(
          (target) => () =>
            RESOLVERS[0]
              .query(target, 1)
              .then((j: any) =>
                j.Status === 0 && j.Answer
                  ? ((j.Answer as Answer[]).filter((a) => a.type === 1).map((a) => a.data))
                  : []
              )
              .catch(() => [])
        ),
        12
      );
      const chainMap: Record<string, string[]> = {};
      chainResults.forEach((r, i) => {
        if (r.status === "fulfilled" && r.value.length) chainMap[chainList[i]] = r.value;
      });
      setChains(chainMap);

      // Wildcard detection
      const probe = `probe-${Math.random().toString(36).slice(2, 8)}.${raw}`;
      try {
        const w = await RESOLVERS[0].query(probe, 1);
        setWildcard(w.Status === 0 && Array.isArray(w.Answer) && w.Answer.length > 0);
      } catch {
        setWildcard(null);
      }

      // Reverse PTR (unique A/AAAA IPs)
      const uniqueIps = Array.from(
        new Set(all.filter((r) => r.type === "A" || r.type === "AAAA").map((r) => r.data))
      ).slice(0, 40);
      if (uniqueIps.length > 0) {
        const ptrResults = await runPool(
          uniqueIps.map(
            (ip) => () =>
              RESOLVERS[0]
                .query(ip, 12)
                .then((j: any) => {
                  if (j.Status !== 0) return null;
                  const a = (j.Answer || []) as Answer[];
                  const p = a.find((x) => x.type === 12);
                  return p ? p.data.replace(/\.$/, "") : null;
                })
                .catch(() => null)
          ),
          14
        );
        const revs: ReverseRecord[] = [];
        ptrResults.forEach((r, i) => {
          if (r.status === "fulfilled") revs.push({ ip: uniqueIps[i], ptr: r.value });
        });
        setReverses(revs);
      }

      setStats({ queries, ms: Math.round(performance.now() - t0) });

      if (all.length === 0) {
        setError(
          nx
            ? `Domain ${raw} tidak ditemukan (NXDOMAIN).`
            : `Tidak ada record yang ditemukan untuk ${raw}.`
        );
      } else {
        setRecords(all);
      }
    } catch {
      setError("Gagal terhubung ke server DNS. Coba lagi sebentar.");
    } finally {
      clearInterval(timer);
      setLoading(false);
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

  const typeStyle = (type: string) => {
    const idx = RECORD_TYPES.findIndex((r) => r.type === type);
    return PALETTE[((idx % PALETTE.length) + PALETTE.length) % PALETTE.length];
  };

  const filtered = useMemo(() => {
    const f = filter.trim().toLowerCase();
    const base = f
      ? records.filter(
          (r) => r.data.toLowerCase().includes(f) || r.type.toLowerCase().includes(f) || r.name.toLowerCase().includes(f)
        )
      : records;
    return [...base].sort((a, b) => (descending ? b.data.localeCompare(a.data) : a.data.localeCompare(b.data)));
  }, [records, filter, descending]);

  const grouped = useMemo(() => {
    const map = new Map<string, DnsRecord[]>();
    for (const rec of filtered) {
      if (!map.has(rec.type)) map.set(rec.type, []);
      map.get(rec.type)!.push(rec);
    }
    return RECORD_TYPES.filter((tp) => map.has(tp.type)).map((tp) => ({ type: tp.type, items: map.get(tp.type)! }));
  }, [filtered]);

  const confirmedCount = useMemo(() => records.filter((r) => r.confirmed).length, [records]);
  const hostCount = useMemo(() => new Set(records.map((r) => r.name)).size, [records]);

  const copyAll = () => {
    if (!records.length) return;
    const text = records
      .map((r) => `${r.name}. ${r.ttl} IN ${r.type} ${formatData(r.type, r.data)}`)
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const copyRow = (rec: DnsRecord) => {
    const text = `${rec.name}. ${rec.ttl} IN ${rec.type} ${formatData(rec.type, rec.data)}`;
    navigator.clipboard.writeText(text);
    setCopiedKey(`${rec.type}:${rec.data}:${rec.ttl}`);
    setTimeout(() => setCopiedKey(""), 1500);
  };

  const download = () => {
    if (!records.length) return;
    const lines = records.map((r) => `${r.name}. ${r.ttl} IN ${r.type} ${formatData(r.type, r.data)}`);
    if (reverses.length) {
      lines.push("", "; REVERSE (PTR)");
      reverses.forEach((r) => lines.push(r.ptr ? `${r.ip} IN PTR ${r.ptr}` : `; ${r.ip} - no PTR`));
    }
    const blob = new Blob([lines.join("\n") + "\n"], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${domain.replace(/[^a-z0-9.-]/g, "_")}_dns.txt`;
    a.click();
  };

  const toggleType = (tp: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(tp)) next.delete(tp);
      else next.add(tp);
      return next;
    });
  };

  const phaseText = [
    `Menyiapkan ${progress.total || "…"} query...`,
    "Scanning subdomain wordlist & SRV services...",
    "CNAME-chain & target resolution...",
    "Reverse PTR & merging...",
    "Menggabungkan hasil...",
  ];

  const progressPct = progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;

  return (
    <PageLayout>
      <SEO
        title="DNS Finder | Lab"
        description="Deep DNS enumeration: 19 tipe × 2 resolver, wordlist 48 host, SRV, DMARC, CNAME-chain, reverse PTR"
        path="/lab/dns-finder"
      />
      <div className="min-h-screen pt-32 pb-24 px-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Crosshair className="h-5 w-5 text-emerald-400" />
            </div>
            <h1 className="text-2xl lg:text-4xl font-black tracking-tighter uppercase text-foreground">
              DNS Finder
            </h1>
          </div>
          <p className="text-xs lg:text-sm text-muted-foreground max-w-xl">
            Deep DNS enumeration: <span className="text-emerald-400">19 tipe record</span> ×{" "}
            <span className="text-emerald-400">2 resolver</span> (cross-verified), wordlist{" "}
            <span className="text-emerald-400">48 host</span> umum, SRV services, DMARC/MTA-STS, CNAME-chain,
            deteksi wildcard & reverse PTR.
          </p>
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
                className="w-full h-12 bg-background border border-border px-4 pr-10 text-sm text-foreground outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all placeholder:text-muted-foreground"
              />
              <Globe className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <button
              onClick={() => search()}
              disabled={loading}
              className="shrink-0 h-12 px-6 bg-primary text-primary-foreground text-[9px] font-black uppercase tracking-[0.25em] hover:brightness-110 transition-all disabled:opacity-40 flex items-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
              {loading ? "Crawling" : "Deep Lookup"}
            </button>
          </div>

          {/* Tajam mode toggle */}
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <button
              onClick={() => setDeep((v) => !v)}
              className="flex items-center gap-2.5 group"
              title="Wordlist subdomain + SRV + DMARC + CNAME-chain"
            >
              <span
                className={`relative w-10 h-5 border transition-colors ${
                  deep ? "bg-emerald-500/20 border-emerald-500/50" : "bg-muted/30 border-border"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-3.5 w-3.5 transition-all ${
                    deep ? "left-5.5 bg-emerald-400" : "left-0.5 bg-muted-foreground/50"
                  }`}
                  style={{ left: deep ? "22px" : "2px" }}
                />
              </span>
              <span className={`text-[9px] font-black uppercase tracking-widest ${deep ? "text-emerald-400" : "text-muted-foreground"}`}>
                Tajam Mode
              </span>
            </button>
            <span className="text-[9px] text-muted-foreground/60">
              {DEEP_HOSTS.length} host + {SRV_NAMES.length} SRV + DMARC/MTA-STS + CNAME-chain + PTR
            </span>
          </div>

          {/* Record type chips */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
              Records ({selected.size}/{RECORD_TYPES.length}):
            </span>
            {RECORD_TYPES.map(({ type }) => (
              <button
                key={type}
                onClick={() => toggleType(type)}
                className={`px-2.5 py-1 text-[9px] font-mono border transition-colors ${
                  selected.has(type)
                    ? "border-emerald-500/50 text-emerald-400 bg-emerald-500/10"
                    : "border-border/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                {type}
              </button>
            ))}
            <button
              onClick={() =>
                setSelected(
                  selected.size === RECORD_TYPES.length ? new Set() : new Set(RECORD_TYPES.map((r) => r.type))
                )
              }
              className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest border border-border/40 text-muted-foreground/60 hover:text-foreground transition-colors"
            >
              {selected.size === RECORD_TYPES.length ? "Semua off" : "Semua"}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
              Coba:
            </span>
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => search(ex)}
                disabled={loading}
                className="px-2.5 py-1 border border-border/60 text-[10px] font-mono text-muted-foreground hover:text-emerald-400 hover:border-emerald-500/40 transition-colors disabled:opacity-40"
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
                  className="px-2.5 py-1 border border-border/40 text-[10px] font-mono text-muted-foreground/70 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors disabled:opacity-40"
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

        {/* Loading */}
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
                  <div className="w-16 h-16 border-2 border-border border-t-emerald-400 rounded-full animate-spin" />
                  <Braces className="absolute inset-0 m-auto h-6 w-6 text-emerald-400 animate-pulse" />
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground">
                    Deep crawling {domain}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1 font-mono">
                    <span className="inline-block w-2 text-emerald-400 animate-pulse">▸</span>{" "}
                    {phaseText[Math.min(phase, phaseText.length - 1)]}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1 tabular-nums">
                    {progress.done}/{progress.total} query · {progressPct}%
                  </p>
                </div>
                <div className="w-56 h-0.5 bg-border overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 transition-all duration-200"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        {!loading && records.length > 0 && (
          <>
            {/* Stats cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
              <div className="border border-border/60 px-4 py-3">
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                  Records
                </p>
                <p className="text-xl font-black text-foreground tabular-nums">{records.length}</p>
              </div>
              <div className="border border-border/60 px-4 py-3">
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                  Hostnames
                </p>
                <p className="text-xl font-black text-foreground tabular-nums">{hostCount}</p>
              </div>
              <div className="border border-border/60 px-4 py-3">
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                  Terverifikasi
                </p>
                <p className="text-xl font-black text-emerald-400 tabular-nums">{confirmedCount}</p>
              </div>
              <div className="border border-border/60 px-4 py-3">
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                  Reverse PTR
                </p>
                <p className="text-xl font-black text-foreground tabular-nums">
                  {reverses.filter((r) => r.ptr).length}
                  <span className="text-xs text-muted-foreground">/{reverses.length}</span>
                </p>
              </div>
              <div className="border border-border/60 px-4 py-3">
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                  Query · Waktu
                </p>
                <p className="text-xl font-black text-foreground tabular-nums">
                  {stats.queries}
                  <span className="text-xs text-muted-foreground"> q</span>
                </p>
                <p className="text-[9px] text-muted-foreground/70 mt-0.5 tabular-nums">{stats.ms} ms</p>
              </div>
            </div>

            {/* Wildcard banner */}
            <AnimatePresence>
              {wildcard !== null && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex items-center gap-2 px-4 py-3 mb-4 border ${
                    wildcard
                      ? "border-amber-500/30 bg-amber-500/5"
                      : "border-emerald-500/20 bg-emerald-500/5"
                  }`}
                >
                  {wildcard ? (
                    <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
                  ) : (
                    <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                  )}
                  <p className="text-[11px] font-medium text-foreground/80">
                    {wildcard
                      ? `Wildcard record terdeteksi: *.${domain} aktif — hasil wordlist bisa termasuk wildcard match.`
                      : `Tidak ada wildcard record (probe random tidak dijawab).`}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Toolbar */}
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="relative flex-1 min-w-[180px]">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="Filter nilai / tipe / hostname..."
                  className="w-full h-9 bg-background border border-border pl-9 pr-3 text-xs text-foreground outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all placeholder:text-muted-foreground"
                />
              </div>
              <button
                onClick={() => setDescending((v) => !v)}
                className="h-9 px-3 border border-border text-[8px] font-bold uppercase tracking-widest text-muted-foreground hover:text-emerald-400 hover:border-emerald-500/40 transition-all flex items-center gap-1.5"
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

            {/* Groups */}
            <div className="space-y-6">
              {grouped.map((group) => {
                const style = typeStyle(group.type);
                const conf = group.items.filter((r) => r.confirmed).length;
                return (
                  <div key={group.type} className="border border-border/60">
                    <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border/60 bg-muted/20">
                      <span className={`px-2 py-0.5 border text-[9px] font-mono font-bold ${style.badge}`}>
                        {group.type}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                        {group.items.length} record{group.items.length !== 1 ? "s" : ""}
                      </span>
                      {conf > 0 && (
                        <span className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-widest text-emerald-400/80">
                          <ShieldCheck className="h-2.5 w-2.5" /> {conf} verified
                        </span>
                      )}
                      <span className="ml-auto text-[9px] font-mono text-muted-foreground/50">
                        type {RECORD_TYPES.find((r) => r.type === group.type)?.id ?? "?"}
                      </span>
                    </div>
                    <div className="divide-y divide-border/30">
                      {group.items.map((rec, i) => {
                        const key = `${rec.type}:${rec.data}:${rec.ttl}:${i}`;
                        const isDeep = rec.name !== domain;
                        const hostLabel = isDeep ? rec.name.slice(0, -(domain.length + 1)) : "";
                        const chain = chains[rec.data.replace(/\.$/, "")];
                        const pretty = svcPretty[rec.data];
                        const value = pretty && pretty !== rec.data ? pretty : formatData(rec.type, rec.data);
                        return (
                          <div
                            key={key}
                            className="group flex items-center justify-between gap-4 px-4 py-2.5 hover:bg-muted/30 transition-colors"
                          >
                            <div className="min-w-0 flex-1">
                              <p className={`text-xs font-mono break-all ${style.color}`}>{value}</p>
                              <p className="text-[9px] font-mono text-muted-foreground/50 mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                                {rec.name} · TTL {rec.ttl}s
                                {hostLabel && (
                                  <span className="px-1.5 py-px bg-muted/40 border border-border/40 text-[8px] font-bold uppercase tracking-widest text-muted-foreground">
                                    {hostLabel}
                                  </span>
                                )}
                                {chain && chain.length > 0 && (
                                  <span className="text-cyan-400/80" title="Target resolved">
                                    → {chain.join(", ")}
                                  </span>
                                )}
                                {rec.confirmed && (
                                  <span
                                    className="flex items-center gap-1 text-emerald-400/70"
                                    title="Dikonfirmasi oleh kedua resolver"
                                  >
                                    <ShieldCheck className="h-2.5 w-2.5" /> 2 resolver
                                  </span>
                                )}
                              </p>
                            </div>
                            <button
                              onClick={() => copyRow(rec)}
                              className="shrink-0 p-1 text-muted-foreground/50 hover:text-emerald-400 transition-colors"
                              title="Salin (format dig)"
                            >
                              {copiedKey === key ? (
                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Reverse PTR group */}
              {reverses.length > 0 && (
                <div className="border border-border/60">
                  <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border/60 bg-muted/20">
                    <span className="px-2 py-0.5 border text-[9px] font-mono font-bold border-sky-500/30 bg-sky-500/10 text-sky-400">
                      REVERSE
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                      PTR lookup ({reverses.filter((r) => r.ptr).length} resolved)
                    </span>
                  </div>
                  <div className="divide-y divide-border/30">
                    {reverses.map((r) => (
                      <div
                        key={r.ip}
                        className="group flex items-center justify-between gap-4 px-4 py-2.5 hover:bg-muted/30 transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-mono text-sky-300/90 break-all">{r.ptr ?? "—"}</p>
                          <p className="text-[9px] font-mono text-muted-foreground/50 mt-0.5">{r.ip}</p>
                        </div>
                        {r.ptr && (
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(r.ptr!);
                              setCopiedKey(`ptr:${r.ip}`);
                              setTimeout(() => setCopiedKey(""), 1500);
                            }}
                            className="shrink-0 p-1 text-muted-foreground/50 hover:text-sky-400 transition-colors"
                            title="Salin PTR"
                          >
                            {copiedKey === `ptr:${r.ip}` ? (
                              <Check className="h-3.5 w-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
              <p className="flex items-center gap-1.5 text-[9px] text-muted-foreground/60 uppercase tracking-widest">
                <Terminal className="h-3 w-3 text-emerald-500/60" />
                Copy format dig · Export menyertakan reverse PTR
              </p>
              <p className="flex items-center gap-1.5 text-[9px] text-muted-foreground/60 uppercase tracking-widest">
                <ListTree className="h-3 w-3 text-emerald-500/60" /> {grouped.length} tipe ditemukan
                <Clock className="h-3 w-3 text-emerald-500/60 ml-3" /> {stats.ms} ms · {stats.queries} query
              </p>
            </div>
          </>
        )}

        {/* Empty initial state */}
        {!loading && records.length === 0 && !error && (
          <div className="border border-dashed border-border/40 px-6 py-14">
            <div className="flex flex-col items-center gap-3 text-center">
              <ScanLine className="h-6 w-6 text-muted-foreground/40" />
              <p className="text-xs text-muted-foreground">
                Masukkan domain untuk deep DNS enumeration penuh (mode tajam: ~300 query).
              </p>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
