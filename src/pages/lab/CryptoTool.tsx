import { useRef, useState } from "react";
import { PageLayout } from "@/src/components/layout/PageLayout";
import { SEO } from "@/src/components/layout/SEO";
import CryptoJS from "crypto-js";
import {
  Fingerprint,
  Lock,
  Copy,
  Check,
  KeyRound,
  FileUp,
  RefreshCw,
  AlertCircle,
  Unlock,
  ShieldCheck,
  Hash,
  Braces,
} from "lucide-react";

type Mode = "hash" | "cipher";

const HASH_ALGOS: { id: string; fn: (input: CryptoJS.lib.WordArray | string) => string }[] = [
  { id: "MD5", fn: (s) => CryptoJS.MD5(s).toString() },
  { id: "SHA-1", fn: (s) => CryptoJS.SHA1(s).toString() },
  { id: "SHA-256", fn: (s) => CryptoJS.SHA256(s).toString() },
  { id: "SHA-384", fn: (s) => CryptoJS.SHA384(s).toString() },
  { id: "SHA-512", fn: (s) => CryptoJS.SHA512(s).toString() },
  { id: "SHA3-256", fn: (s) => CryptoJS.SHA3(s, { outputLength: 256 }).toString() },
  { id: "SHA3-512", fn: (s) => CryptoJS.SHA3(s, { outputLength: 512 }).toString() },
  { id: "RIPEMD-160", fn: (s) => CryptoJS.RIPEMD160(s).toString() },
  { id: "HmacSHA256", fn: (s) => CryptoJS.HmacSHA256(s, "aether").toString() },
];

const CIPHERS = [
  { id: "aes", name: "AES-256-GCM", desc: "Enkripsi modern via Web Crypto + PBKDF2 (100k iterasi)" },
  { id: "caesar", name: "Caesar", desc: "Geser alfabet klasik (shift 1-25)" },
  { id: "xor", name: "XOR", desc: "XOR stream dengan kunci string (output base64)" },
  { id: "base64", name: "Base64", desc: "Encode/decode teks ke base64" },
];

const enc = new TextEncoder();
const dec = new TextDecoder();

function bytesToB64(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function b64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64.trim());
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function deriveKey(pass: string, salt: Uint8Array): Promise<CryptoKey> {
  const material = await crypto.subtle.importKey("raw", enc.encode(pass), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

async function aesEncrypt(text: string, pass: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(pass, salt);
  const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(text));
  const out = new Uint8Array(salt.length + iv.length + ct.byteLength);
  out.set(salt, 0);
  out.set(iv, salt.length);
  out.set(new Uint8Array(ct), salt.length + iv.length);
  return bytesToB64(out);
}

async function aesDecrypt(b64: string, pass: string): Promise<string> {
  const data = b64ToBytes(b64);
  if (data.length < 28) throw new Error("Payload tidak valid");
  const salt = data.slice(0, 16);
  const iv = data.slice(16, 28);
  const ct = data.slice(28);
  const key = await deriveKey(pass, salt);
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct);
  return dec.decode(plain);
}

function caesar(text: string, shift: number, decrypt: boolean): string {
  const s = decrypt ? (26 - (shift % 26)) % 26 : shift % 26;
  return text.replace(/[a-zA-Z]/g, (c) => {
    const base = c <= "Z" ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + s) % 26) + base);
  });
}

function xorBytes(text: string, key: string): Uint8Array {
  const k = enc.encode(key);
  const t = enc.encode(text);
  const out = new Uint8Array(t.length);
  for (let i = 0; i < t.length; i++) out[i] = t[i] ^ k[i % k.length];
  return out;
}

function wordArrayFromBytes(bytes: Uint8Array): CryptoJS.lib.WordArray {
  return CryptoJS.lib.WordArray.create(bytes);
}

export default function CryptoTool() {
  const [mode, setMode] = useState<Mode>("hash");

  // Hash tab
  const [hashInput, setHashInput] = useState("");
  const [verifyHash, setVerifyHash] = useState("");
  const [copied, setCopied] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileHashes, setFileHashes] = useState<{ id: string; value: string }[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  // Cipher tab
  const [cipher, setCipher] = useState("aes");
  const [cipherMode, setCipherMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [cInput, setCInput] = useState("");
  const [cKey, setCKey] = useState("");
  const [cShift, setCShift] = useState(3);
  const [cOutput, setCOutput] = useState("");
  const [cError, setCError] = useState("");
  const [cBusy, setCBusy] = useState(false);
  const [copiedOut, setCopiedOut] = useState(false);

  const hashes = HASH_ALGOS.map((a) => ({ id: a.id, value: hashInput ? a.fn(hashInput) : "" }));
  const matches = new Set<string>();
  if (verifyHash && hashInput) {
    hashes.forEach((h) => {
      if (h.value.toLowerCase() === verifyHash.trim().toLowerCase()) matches.add(h.id);
    });
  }

  const runCipher = async () => {
    setCError("");
    setCOutput("");
    if (!cInput) {
      setCError("Masukkan teks dulu.");
      return;
    }
    setCBusy(true);
    try {
      if (cipher === "aes") {
        if (!cKey) {
          setCError("Masukkan passphrase.");
          setCBusy(false);
          return;
        }
        setCOutput(
          cipherMode === "encrypt"
            ? await aesEncrypt(cInput, cKey)
            : await aesDecrypt(cInput, cKey)
        );
      } else if (cipher === "caesar") {
        setCOutput(caesar(cInput, cShift, cipherMode === "decrypt"));
      } else if (cipher === "xor") {
        if (!cKey) {
          setCError("Masukkan kunci XOR.");
          setCBusy(false);
          return;
        }
        if (cipherMode === "encrypt") {
          setCOutput(bytesToB64(xorBytes(cInput, cKey)));
        } else {
          setCOutput(dec.decode(xorBytes(dec.decode(b64ToBytes(cInput)), cKey)));
        }
      } else {
        if (cipherMode === "encrypt") {
          setCOutput(bytesToB64(enc.encode(cInput)));
        } else {
          setCOutput(dec.decode(b64ToBytes(cInput)));
        }
      }
    } catch (e) {
      setCError(
        cipher === "aes" && cipherMode === "decrypt"
          ? "Gagal decrypt — payload rusak atau passphrase salah."
          : `Gagal: ${(e as Error).message}`
      );
    } finally {
      setCBusy(false);
    }
  };

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    setFileName(f.name);
    const buf = new Uint8Array(await f.arrayBuffer());
    const wa = wordArrayFromBytes(buf);
    setFileHashes(
      HASH_ALGOS.filter((a) => a.id !== "HmacSHA256").map((a) => ({ id: a.id, value: a.fn(wa) }))
    );
  };

  const copyText = async (label: string, text: string) => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 1500);
  };

  const copyOutput = async () => {
    if (!cOutput) return;
    await navigator.clipboard.writeText(cOutput);
    setCopiedOut(true);
    setTimeout(() => setCopiedOut(false), 1500);
  };

  const tabBtn = (id: Mode, icon: React.ReactNode, label: string) => (
    <button
      onClick={() => setMode(id)}
      className={`flex items-center gap-2 h-10 px-5 text-[9px] font-black uppercase tracking-[0.25em] border transition-all ${
        mode === id
          ? "border-fuchsia-500/50 bg-fuchsia-500/10 text-fuchsia-400"
          : "border-border/60 text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <PageLayout>
      <SEO
        title="Crypto Tool | Lab"
        description="Generate hash (MD5, SHA-1, SHA-256, SHA-512, SHA-3) & Encrypt/Decrypt (AES-256-GCM, Caesar, XOR, Base64)"
        path="/lab/crypto-tool"
      />
      <div className="min-h-screen pt-32 pb-24 px-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center">
              <Fingerprint className="h-5 w-5 text-fuchsia-400" />
            </div>
            <h1 className="text-2xl lg:text-4xl font-black tracking-tighter uppercase text-foreground">
              Crypto Tool
            </h1>
          </div>
          <p className="text-xs lg:text-sm text-muted-foreground max-w-xl">
            Generate hash dari <span className="text-fuchsia-400">9 algoritma</span> + Encrypt/Decrypt
            (<span className="text-fuchsia-400">AES-256-GCM</span>, Caesar, XOR, Base64). 100% client-side.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabBtn("hash", <Hash className="h-3.5 w-3.5" />, "Hash")}
          {tabBtn("cipher", <Lock className="h-3.5 w-3.5" />, "Encrypt / Decrypt")}
        </div>

        {/* HASH TAB */}
        {mode === "hash" && (
          <div className="space-y-6">
            <div>
              <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                Teks / string
              </label>
              <textarea
                value={hashInput}
                onChange={(e) => setHashInput(e.target.value)}
                placeholder="Masukkan teks untuk di-hash..."
                rows={3}
                className="w-full bg-background border border-border px-4 py-3 text-sm font-mono text-foreground outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/20 transition-all placeholder:text-muted-foreground"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-2 h-9 px-4 border border-border/60 text-[8px] font-bold uppercase tracking-widest text-muted-foreground hover:text-fuchsia-400 hover:border-fuchsia-500/40 cursor-pointer transition-colors">
                <FileUp className="h-3 w-3" /> Hash file
                <input
                  ref={fileRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => onFile(e.target.files?.[0])}
                />
              </label>
              {(fileName || fileHashes.length > 0) && (
                <>
                  <span className="text-[10px] font-mono text-muted-foreground/70">{fileName}</span>
                  <button
                    onClick={() => {
                      setFileName("");
                      setFileHashes([]);
                      if (fileRef.current) fileRef.current.value = "";
                    }}
                    className="text-[9px] font-bold uppercase tracking-widest text-red-400/70 hover:text-red-400"
                  >
                    Hapus
                  </button>
                </>
              )}
            </div>

            {/* Verify */}
            <div>
              <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                Verify — cocokkan hash dengan teks (opsional)
              </label>
              <input
                value={verifyHash}
                onChange={(e) => setVerifyHash(e.target.value)}
                placeholder="Tempel hash untuk dicek cocok dengan teks di atas..."
                className="w-full h-10 bg-background border border-border px-4 text-xs font-mono text-foreground outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/20 transition-all placeholder:text-muted-foreground"
              />
            </div>

            {/* Hash list */}
            <div className="border border-border/60 divide-y divide-border/30">
              {hashes.map((h) => (
                <div key={h.id} className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-muted/30 transition-colors">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black uppercase tracking-widest text-fuchsia-400">
                        {h.id}
                      </span>
                      {matches.has(h.id) && (
                        <span className="flex items-center gap-1 px-1.5 py-px bg-emerald-500/10 border border-emerald-500/30 text-[8px] font-bold uppercase tracking-widest text-emerald-400">
                          <ShieldCheck className="h-2.5 w-2.5" /> Cocok
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-mono text-foreground/80 break-all mt-1">{h.value || "—"}</p>
                  </div>
                  <button
                    onClick={() => copyText(h.id, h.value)}
                    disabled={!h.value}
                    className="shrink-0 p-1.5 text-muted-foreground/50 hover:text-fuchsia-400 disabled:opacity-30 transition-colors"
                    title="Salin"
                  >
                    {copied === h.id ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              ))}
            </div>

            <p className="text-[9px] text-muted-foreground/50">
              Hash bersifat satu arah (tidak bisa di-decrypt). HmacSHA256 memakai kunci tetap &quot;aether&quot;.
              {fileName && " Hash file dihitung dari byte file, bukan teks."}
            </p>
          </div>
        )}

        {/* CIPHER TAB */}
        {mode === "cipher" && (
          <div className="space-y-6">
            {/* Cipher picker */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {CIPHERS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setCipher(c.id);
                    setCOutput("");
                    setCError("");
                  }}
                  className={`text-left px-4 py-3 border transition-colors ${
                    cipher === c.id
                      ? "border-fuchsia-500/50 bg-fuchsia-500/10"
                      : "border-border/60 hover:border-border"
                  }`}
                >
                  <p className={`text-[10px] font-black uppercase tracking-widest ${cipher === c.id ? "text-fuchsia-400" : "text-foreground"}`}>
                    {c.name}
                  </p>
                  <p className="text-[9px] text-muted-foreground/70 mt-0.5">{c.desc}</p>
                </button>
              ))}
            </div>

            {/* Mode toggle */}
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Mode:</span>
              <button
                onClick={() => {
                  setCipherMode("encrypt");
                  setCOutput("");
                  setCError("");
                }}
                className={`flex items-center gap-1.5 h-9 px-4 text-[8px] font-black uppercase tracking-widest border transition-all ${
                  cipherMode === "encrypt"
                    ? "border-fuchsia-500/50 bg-fuchsia-500/10 text-fuchsia-400"
                    : "border-border/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                <Lock className="h-3 w-3" /> Encrypt
              </button>
              <button
                onClick={() => {
                  setCipherMode("decrypt");
                  setCOutput("");
                  setCError("");
                }}
                className={`flex items-center gap-1.5 h-9 px-4 text-[8px] font-black uppercase tracking-widest border transition-all ${
                  cipherMode === "decrypt"
                    ? "border-fuchsia-500/50 bg-fuchsia-500/10 text-fuchsia-400"
                    : "border-border/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                <Unlock className="h-3 w-3" /> Decrypt
              </button>
            </div>

            {/* Key inputs */}
            {(cipher === "aes" || cipher === "xor") && (
              <div>
                <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                  {cipher === "aes" ? "Passphrase" : "Kunci XOR"}
                </label>
                <input
                  type="text"
                  value={cKey}
                  onChange={(e) => setCKey(e.target.value)}
                  placeholder={cipher === "aes" ? "Passphrase untuk PBKDF2..." : "Kunci string..."}
                  className="w-full h-10 bg-background border border-border px-4 text-xs font-mono text-foreground outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/20 transition-all placeholder:text-muted-foreground"
                />
              </div>
            )}
            {cipher === "caesar" && (
              <div>
                <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                  Shift (1-25): {cShift}
                </label>
                <input
                  type="range"
                  min={1}
                  max={25}
                  value={cShift}
                  onChange={(e) => setCShift(Number(e.target.value))}
                  className="w-full accent-fuchsia-500"
                />
              </div>
            )}

            {/* Message input */}
            <div>
              <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                {cipherMode === "encrypt" ? "Teks asli" : cipher === "base64" ? "Base64" : "Ciphertext"}
              </label>
              <textarea
                value={cInput}
                onChange={(e) => setCInput(e.target.value)}
                placeholder={cipherMode === "encrypt" ? "Masukkan teks untuk dienkripsi..." : "Tempel ciphertext..."}
                rows={3}
                className="w-full bg-background border border-border px-4 py-3 text-sm font-mono text-foreground outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/20 transition-all placeholder:text-muted-foreground"
              />
            </div>

            <button
              onClick={runCipher}
              disabled={cBusy}
              className="flex items-center gap-2 h-11 px-6 bg-primary text-primary-foreground text-[9px] font-black uppercase tracking-[0.25em] hover:brightness-110 transition-all disabled:opacity-40"
            >
              {cBusy ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <KeyRound className="h-3.5 w-3.5" />}
              {cipherMode === "encrypt" ? "Encrypt" : "Decrypt"}
            </button>

            {cError && (
              <div className="flex items-center gap-2 px-4 py-3 border border-red-500/30 bg-red-500/5">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                <p className="text-[11px] font-medium text-red-400">{cError}</p>
              </div>
            )}

            {cOutput && (
              <div className="border border-border/60">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/60 bg-muted/20">
                  <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-fuchsia-400">
                    {cipherMode === "encrypt" ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                    Hasil {cipherMode}
                  </span>
                  <button
                    onClick={copyOutput}
                    className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-widest text-muted-foreground hover:text-fuchsia-400 transition-colors"
                  >
                    {copiedOut ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    {copiedOut ? "Copied" : "Salin"}
                  </button>
                </div>
                <p className="px-4 py-3 text-xs font-mono text-foreground/90 break-all">{cOutput}</p>
              </div>
            )}

            <p className="text-[9px] text-muted-foreground/50">
              AES-256-GCM output: <span className="font-mono">base64(salt|iv|tag+ciphertext)</span> — decrypt
              butuh passphrase yang sama. Caesar & XOR bersifat klasik (tidak aman untuk produksi).
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
