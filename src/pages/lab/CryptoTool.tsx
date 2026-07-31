import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
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
  ShieldCheck,
  Hash,
  Zap,
  Download,
  ArrowLeftRight,
  Dice5,
  Gauge,
  Eye,
  EyeOff,
  CaseUpper,
  Unlock,
} from "lucide-react";

type Mode = "hash" | "cipher" | "password";

type HashAlgo = {
  id: string;
  hmac?: boolean;
  fn: (bytes: Uint8Array, wa: CryptoJS.lib.WordArray) => string;
};

function waToBytes(wa: CryptoJS.lib.WordArray): Uint8Array {
  const bytes = new Uint8Array(wa.sigBytes);
  for (let i = 0; i < wa.sigBytes; i++) {
    bytes[i] = (wa.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
  }
  return bytes;
}

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(bytes: Uint8Array): string {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff).toString(16).padStart(8, "0");
}

const HASH_ALGOS: HashAlgo[] = [
  { id: "MD5", fn: (_b, wa) => CryptoJS.MD5(wa).toString() },
  { id: "SHA-1", fn: (_b, wa) => CryptoJS.SHA1(wa).toString() },
  { id: "SHA-224", fn: (_b, wa) => CryptoJS.SHA224(wa).toString() },
  { id: "SHA-256", fn: (_b, wa) => CryptoJS.SHA256(wa).toString() },
  { id: "SHA-384", fn: (_b, wa) => CryptoJS.SHA384(wa).toString() },
  { id: "SHA-512", fn: (_b, wa) => CryptoJS.SHA512(wa).toString() },
  { id: "SHA3-256", fn: (_b, wa) => CryptoJS.SHA3(wa, { outputLength: 256 }).toString() },
  { id: "SHA3-512", fn: (_b, wa) => CryptoJS.SHA3(wa, { outputLength: 512 }).toString() },
  { id: "RIPEMD-160", fn: (_b, wa) => CryptoJS.RIPEMD160(wa).toString() },
  { id: "CRC32", fn: (b) => crc32(b) },
  { id: "HmacMD5", hmac: true, fn: (_b, wa) => CryptoJS.HmacMD5(wa, hmacSecret).toString() },
  { id: "HmacSHA1", hmac: true, fn: (_b, wa) => CryptoJS.HmacSHA1(wa, hmacSecret).toString() },
  { id: "HmacSHA256", hmac: true, fn: (_b, wa) => CryptoJS.HmacSHA256(wa, hmacSecret).toString() },
  { id: "HmacSHA512", hmac: true, fn: (_b, wa) => CryptoJS.HmacSHA512(wa, hmacSecret).toString() },
];

let hmacSecret = "aether";

const CIPHERS = [
  { id: "aes", name: "AES-256-GCM", desc: "Modern, Web Crypto + PBKDF2 100k iterasi", needsKey: true, selfInv: false },
  { id: "caesar", name: "Caesar", desc: "Geser alfabet klasik (shift 1-25)", needsKey: false, selfInv: false },
  { id: "vigenere", name: "Vigenère", desc: "Polialfabetik dengan kunci kata", needsKey: true, selfInv: false },
  { id: "xor", name: "XOR", desc: "XOR stream kunci string → base64", needsKey: true, selfInv: false },
  { id: "rot47", name: "ROT47", desc: "Rotasi ASCII printable (inverse sendiri)", needsKey: false, selfInv: true },
  { id: "base64", name: "Base64", desc: "Encode/decode teks ↔ base64", needsKey: false, selfInv: false },
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

function vigenere(text: string, key: string, decrypt: boolean): string {
  const k = key.toLowerCase().replace(/[^a-z]/g, "");
  if (!k) throw new Error("Kunci harus berisi alfabet.");
  let j = 0;
  return text.replace(/[a-zA-Z]/g, (c) => {
    const base = c <= "Z" ? 65 : 97;
    const shift = (k[j % k.length].charCodeAt(0) - 97) * (decrypt ? -1 : 1);
    j++;
    return String.fromCharCode((((c.charCodeAt(0) - base + shift) % 26) + 26) % 26 + base);
  });
}

function xorBytes(text: string, key: string): Uint8Array {
  const k = enc.encode(key);
  const t = enc.encode(text);
  const out = new Uint8Array(t.length);
  for (let i = 0; i < t.length; i++) out[i] = t[i] ^ k[i % k.length];
  return out;
}

function rot47(text: string): string {
  return text.replace(/[\x21-\x7E]/g, (c) =>
    String.fromCharCode(33 + ((c.charCodeAt(0) - 33 + 47) % 94))
  );
}

function entropyBits(s: string): number {
  let pool = 0;
  if (/[a-z]/.test(s)) pool += 26;
  if (/[A-Z]/.test(s)) pool += 26;
  if (/[0-9]/.test(s)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(s)) pool += 33;
  return s.length ? s.length * Math.log2(pool) : 0;
}

function formatTime(seconds: number): string {
  if (seconds < 1) return "instan";
  if (seconds < 60) return `${seconds.toFixed(1)} detik`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} menit`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} jam`;
  if (seconds < 31536000) return `${Math.round(seconds / 86400)} hari`;
  const years = seconds / 31536000;
  if (years < 1e6) return `${Math.round(years)} tahun`;
  return `≈ ∞ (${(years / 1e6).toFixed(1)} juta tahun)`;
}

function randomPassword(length: number, opts: { upper: boolean; lower: boolean; digits: boolean; symbols: boolean }): string {
  let pool = "";
  if (opts.upper) pool += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (opts.lower) pool += "abcdefghijklmnopqrstuvwxyz";
  if (opts.digits) pool += "0123456789";
  if (opts.symbols) pool += "!@#$%^&*()-_=+[]{};:,.<>?";
  if (!pool) return "";
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr, (n) => pool[n % pool.length]).join("");
}

export default function CryptoTool() {
  const [mode, setMode] = useState<Mode>("hash");

  // Hash tab
  const [hashInput, setHashInput] = useState("");
  const [verifyHash, setVerifyHash] = useState("");
  const [secret, setSecret] = useState("aether");
  const [upper, setUpper] = useState(false);
  const [copied, setCopied] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileHashes, setFileHashes] = useState<{ id: string; value: string }[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const showSecret = useMemo(() => HASH_ALGOS.some((a) => a.hmac), []);

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
  const [showKey, setShowKey] = useState(false);

  // Password tab
  const [pLength, setPLength] = useState(20);
  const [pOpts, setPOpts] = useState({ upper: true, lower: true, digits: true, symbols: true });
  const [pCount, setPCount] = useState(3);
  const [passwords, setPasswords] = useState<string[]>([]);
  const [pInput, setPInput] = useState("");
  const [copiedPw, setCopiedPw] = useState("");

  hmacSecret = secret;
  const inputBytes = useMemo(() => enc.encode(hashInput), [hashInput]);
  const inputWa = useMemo(() => CryptoJS.lib.WordArray.create(inputBytes), [inputBytes]);

  const hashes = useMemo(
    () =>
      HASH_ALGOS.map((a) => ({
        id: a.id,
        value: hashInput
          ? a.hmac && !secret
            ? ""
            : a.fn(inputBytes, inputWa)
          : "",
      })),
    [hashInput, inputBytes, inputWa, secret]
  );

  const matches = useMemo(() => {
    const set = new Set<string>();
    if (verifyHash && hashInput) {
      hashes.forEach((h) => {
        if (h.value.toLowerCase() === verifyHash.trim().toLowerCase()) set.add(h.id);
      });
    }
    return set;
  }, [verifyHash, hashInput, hashes]);

  const display = (v: string) => (upper ? v.toUpperCase() : v);

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
        setCOutput(cipherMode === "encrypt" ? await aesEncrypt(cInput, cKey) : await aesDecrypt(cInput, cKey));
      } else if (cipher === "caesar") {
        setCOutput(caesar(cInput, cShift, cipherMode === "decrypt"));
      } else if (cipher === "vigenere") {
        if (!cKey) {
          setCError("Masukkan kunci kata.");
          setCBusy(false);
          return;
        }
        setCOutput(vigenere(cInput, cKey, cipherMode === "decrypt"));
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
      } else if (cipher === "rot47") {
        setCOutput(rot47(cInput));
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
    const wa = CryptoJS.lib.WordArray.create(buf);
    setFileHashes(HASH_ALGOS.filter((a) => !a.hmac).map((a) => ({ id: a.id, value: a.fn(buf, wa) })));
  };

  const copyText = async (label: string, text: string) => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 1500);
  };

  const copyAll = () => {
    const lines = hashes.filter((h) => h.value).map((h) => `${h.id}: ${display(h.value)}`);
    if (lines.length) copyText("all", lines.join("\n"));
  };

  const downloadOutput = () => {
    if (!cOutput) return;
    const blob = new Blob([cOutput], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `crypto_${cipher}_${cipherMode}.txt`;
    a.click();
  };

  const generatePassphrase = () => {
    setCKey(randomPassword(24, { upper: true, lower: true, digits: true, symbols: false }));
  };

  const swapIO = () => {
    setCInput(cOutput);
    setCOutput("");
  };

  const genPasswords = () => {
    setPasswords(Array.from({ length: pCount }, () => randomPassword(pLength, pOpts)));
  };

  const pwEntropy = entropyBits(pInput);
  const pwGuesses = pwEntropy ? Math.pow(2, pwEntropy) : 0;
  const pwLabel =
    pwEntropy >= 100 ? ["Excellent", "text-emerald-400", "bg-emerald-500/10 border-emerald-500/30"]
    : pwEntropy >= 70 ? ["Strong", "text-emerald-400", "bg-emerald-500/10 border-emerald-500/30"]
    : pwEntropy >= 50 ? ["Good", "text-amber-400", "bg-amber-500/10 border-amber-500/30"]
    : pwEntropy >= 30 ? ["Weak", "text-orange-400", "bg-orange-500/10 border-orange-500/30"]
    : ["Very Weak", "text-red-400", "bg-red-500/10 border-red-500/30"];

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

  const inputBox =
    "w-full bg-background border border-border px-4 py-3 text-sm font-mono text-foreground outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/20 transition-all placeholder:text-muted-foreground";
  const inputLine =
    "w-full h-10 bg-background border border-border px-4 text-xs font-mono text-foreground outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/20 transition-all placeholder:text-muted-foreground";

  return (
    <PageLayout>
      <SEO
        title="Crypto Tool | Lab"
        description="14 algoritma hash (MD5, SHA, SHA-3, CRC32, HMAC), Encrypt/Decrypt (AES-256-GCM, Caesar, Vigenère, XOR, ROT47, Base64) & Password analyzer"
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
            <span className="text-fuchsia-400">14 algoritma hash</span> ·{" "}
            <span className="text-fuchsia-400">6 cipher</span> · password generator & analyzer. 100%
            client-side.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabBtn("hash", <Hash className="h-3.5 w-3.5" />, `Hash (${HASH_ALGOS.length})`)}
          {tabBtn("cipher", <Lock className="h-3.5 w-3.5" />, "Encrypt / Decrypt")}
          {tabBtn("password", <KeyRound className="h-3.5 w-3.5" />, "Password")}
        </div>

        <AnimatePresence mode="wait">
          {/* ============ HASH TAB ============ */}
          {mode === "hash" && (
            <motion.div
              key="hash"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="space-y-6"
            >
              <div>
                <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                  Teks / string
                </label>
                <textarea
                  value={hashInput}
                  onChange={(e) => setHashInput(e.target.value)}
                  placeholder="Masukkan teks untuk di-hash..."
                  rows={3}
                  className={inputBox}
                />
                <p className="text-[9px] text-muted-foreground/50 mt-1 tabular-nums">
                  {hashInput.length} chars · {inputBytes.length} bytes
                </p>
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

              {showSecret && (
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                    HMAC secret
                  </label>
                  <input
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    placeholder="Kunci rahasia untuk HmacMD5/HmacSHA1/HmacSHA256/HmacSHA512..."
                    className={inputLine}
                  />
                </div>
              )}

              {/* Verify */}
              <div>
                <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                  Verify — cocokkan hash dengan teks (opsional)
                </label>
                <input
                  value={verifyHash}
                  onChange={(e) => setVerifyHash(e.target.value)}
                  placeholder="Tempel hash untuk dicek cocok dengan teks di atas..."
                  className={inputLine}
                />
              </div>

              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setUpper((v) => !v)}
                  className={`flex items-center gap-1.5 h-8 px-3 border text-[8px] font-bold uppercase tracking-widest transition-colors ${
                    upper
                      ? "border-fuchsia-500/50 bg-fuchsia-500/10 text-fuchsia-400"
                      : "border-border/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <CaseUpper className="h-3 w-3" /> UPPERCASE
                </button>
                <button
                  onClick={copyAll}
                  disabled={!hashes.some((h) => h.value)}
                  className="h-8 px-3 border border-border/60 text-[8px] font-bold uppercase tracking-widest text-muted-foreground hover:text-fuchsia-400 disabled:opacity-30 transition-colors"
                >
                  {copied === "all" ? "Copied ✓" : "Copy all"}
                </button>
              </div>

              {/* Hash list */}
              <div className="border border-border/60 divide-y divide-border/30">
                {hashes.map((h) => (
                  <div
                    key={h.id}
                    className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-muted/30 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-fuchsia-400">
                          {h.id}
                        </span>
                        {h.value && (
                          <span className="text-[8px] font-mono text-muted-foreground/50 tabular-nums">
                            {h.value.length} hex
                          </span>
                        )}
                        {matches.has(h.id) && (
                          <span className="flex items-center gap-1 px-1.5 py-px bg-emerald-500/10 border border-emerald-500/30 text-[8px] font-bold uppercase tracking-widest text-emerald-400">
                            <ShieldCheck className="h-2.5 w-2.5" /> Cocok
                          </span>
                        )}
                        {h.id.startsWith("Hmac") && !secret && (
                          <span className="text-[8px] text-muted-foreground/50 italic">butuh secret</span>
                        )}
                      </div>
                      <p className="text-[11px] font-mono text-foreground/80 break-all mt-1">
                        {h.value ? display(h.value) : "—"}
                      </p>
                    </div>
                    <button
                      onClick={() => copyText(h.id, display(h.value))}
                      disabled={!h.value}
                      className="shrink-0 p-1.5 text-muted-foreground/50 hover:text-fuchsia-400 disabled:opacity-30 transition-colors"
                      title="Salin"
                    >
                      {copied === h.id ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>

              <p className="text-[9px] text-muted-foreground/50">
                Hash bersifat satu arah (tidak bisa di-decrypt). CRC32 = checksum 8 hex. Algoritma HMAC
                butuh secret.
                {fileName && " Hash file dihitung dari byte file, bukan teks."}
              </p>
            </motion.div>
          )}

          {/* ============ CIPHER TAB ============ */}
          {mode === "cipher" && (
            <motion.div
              key="cipher"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="space-y-6"
            >
              {/* Cipher picker */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
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
                    <p
                      className={`text-[10px] font-black uppercase tracking-widest ${
                        cipher === c.id ? "text-fuchsia-400" : "text-foreground"
                      }`}
                    >
                      {c.name}
                    </p>
                    <p className="text-[9px] text-muted-foreground/70 mt-0.5">{c.desc}</p>
                  </button>
                ))}
              </div>

              {/* Mode toggle */}
              {!CIPHERS.find((c) => c.id === cipher)?.selfInv && (
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
                  {cipher === "aes" && (
                    <button
                      onClick={generatePassphrase}
                      className="ml-auto flex items-center gap-1.5 h-9 px-3 border border-border/60 text-[8px] font-bold uppercase tracking-widest text-muted-foreground hover:text-fuchsia-400 transition-colors"
                      title="Generate passphrase acak"
                    >
                      <Dice5 className="h-3 w-3" /> Acak
                    </button>
                  )}
                </div>
              )}

              {/* Key inputs */}
              {(cipher === "aes" || cipher === "vigenere" || cipher === "xor") && (
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                    {cipher === "aes" ? "Passphrase" : cipher === "vigenere" ? "Kunci kata (alfabet)" : "Kunci XOR"}
                  </label>
                  <div className="relative">
                    <input
                      type={showKey ? "text" : "password"}
                      value={cKey}
                      onChange={(e) => setCKey(e.target.value)}
                      placeholder={cipher === "aes" ? "Passphrase untuk PBKDF2..." : "Kunci string..."}
                      className={`${inputLine} pr-10`}
                    />
                    <button
                      onClick={() => setShowKey((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-fuchsia-400 transition-colors"
                    >
                      {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
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
                  {cipherMode === "encrypt" || (CIPHERS.find((c) => c.id === cipher)?.selfInv)
                    ? "Teks asli"
                    : cipher === "base64"
                    ? "Base64"
                    : "Ciphertext"}
                </label>
                <textarea
                  value={cInput}
                  onChange={(e) => setCInput(e.target.value)}
                  placeholder={
                    cipherMode === "encrypt" || (CIPHERS.find((c) => c.id === cipher)?.selfInv)
                      ? "Masukkan teks untuk dienkripsi..."
                      : "Tempel ciphertext..."
                  }
                  rows={3}
                  className={inputBox}
                />
                <p className="text-[9px] text-muted-foreground/50 mt-1 tabular-nums">
                  {cInput.length} chars · {enc.encode(cInput).length} bytes
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={runCipher}
                  disabled={cBusy}
                  className="flex items-center gap-2 h-11 px-6 bg-primary text-primary-foreground text-[9px] font-black uppercase tracking-[0.25em] hover:brightness-110 transition-all disabled:opacity-40"
                >
                  {cBusy ? (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Zap className="h-3.5 w-3.5" />
                  )}
                  {cipherMode === "encrypt" || (CIPHERS.find((c) => c.id === cipher)?.selfInv)
                    ? "Process"
                    : "Decrypt"}
                </button>
                {cOutput && (
                  <button
                    onClick={swapIO}
                    className="flex items-center gap-2 h-11 px-4 border border-border/60 text-[8px] font-bold uppercase tracking-widest text-muted-foreground hover:text-fuchsia-400 transition-colors"
                    title="Pindahkan hasil ke input"
                  >
                    <ArrowLeftRight className="h-3.5 w-3.5" /> Swap
                  </button>
                )}
              </div>

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
                      {cipherMode === "encrypt" || (CIPHERS.find((c) => c.id === cipher)?.selfInv) ? (
                        <Lock className="h-3 w-3" />
                      ) : (
                        <Unlock className="h-3 w-3" />
                      )}
                      Hasil {cipherMode === "encrypt" || (CIPHERS.find((c) => c.id === cipher)?.selfInv) ? "encrypt" : "decrypt"}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={downloadOutput}
                        className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-widest text-muted-foreground hover:text-fuchsia-400 transition-colors"
                        title="Download .txt"
                      >
                        <Download className="h-3 w-3" /> TXT
                      </button>
                      <button
                        onClick={async () => {
                          await navigator.clipboard.writeText(cOutput);
                          setCopiedOut(true);
                          setTimeout(() => setCopiedOut(false), 1500);
                        }}
                        className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-widest text-muted-foreground hover:text-fuchsia-400 transition-colors"
                      >
                        {copiedOut ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                        {copiedOut ? "Copied" : "Salin"}
                      </button>
                    </div>
                  </div>
                  <p className="px-4 py-3 text-xs font-mono text-foreground/90 break-all">{cOutput}</p>
                </div>
              )}

              <p className="text-[9px] text-muted-foreground/50">
                AES-256-GCM: <span className="font-mono">base64(salt|iv|tag+ciphertext)</span> — decrypt butuh
                passphrase sama. ROT47 inverse sendiri (tidak butuh mode). Caesar/Vigenère/XOR klasik (tidak
                aman untuk produksi).
              </p>
            </motion.div>
          )}

          {/* ============ PASSWORD TAB ============ */}
          {mode === "password" && (
            <motion.div
              key="password"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="space-y-8"
            >
              {/* Generator */}
              <div className="border border-border/60">
                <div className="px-4 py-3 border-b border-border/60 bg-muted/20 flex items-center gap-2">
                  <Dice5 className="h-3.5 w-3.5 text-fuchsia-400" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-foreground">
                    Generator
                  </span>
                  <span className="text-[9px] text-muted-foreground/60">crypto.getRandomValues</span>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                      Panjang: {pLength}
                    </label>
                    <input
                      type="range"
                      min={4}
                      max={64}
                      value={pLength}
                      onChange={(e) => setPLength(Number(e.target.value))}
                      className="w-full accent-fuchsia-500"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        ["upper", "A-Z"],
                        ["lower", "a-z"],
                        ["digits", "0-9"],
                        ["symbols", "!@#"],
                      ] as const
                    ).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => setPOpts((o) => ({ ...o, [key]: !o[key] }))}
                        className={`px-3 py-1.5 border text-[9px] font-mono transition-colors ${
                          pOpts[key]
                            ? "border-fuchsia-500/50 bg-fuchsia-500/10 text-fuchsia-400"
                            : "border-border/60 text-muted-foreground/60"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                    <div className="flex items-center gap-2 ml-2">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                        Jumlah:
                      </span>
                      {[1, 3, 5, 10].map((n) => (
                        <button
                          key={n}
                          onClick={() => setPCount(n)}
                          className={`px-2 py-1 border text-[9px] font-mono transition-colors ${
                            pCount === n
                              ? "border-fuchsia-500/50 bg-fuchsia-500/10 text-fuchsia-400"
                              : "border-border/60 text-muted-foreground/60"
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={genPasswords}
                    disabled={!pOpts.upper && !pOpts.lower && !pOpts.digits && !pOpts.symbols}
                    className="flex items-center gap-2 h-10 px-5 bg-primary text-primary-foreground text-[9px] font-black uppercase tracking-[0.25em] hover:brightness-110 transition-all disabled:opacity-40"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Generate
                  </button>
                  {passwords.length > 0 && (
                    <div className="divide-y divide-border/30 border border-border/60">
                      {passwords.map((pw, i) => (
                        <div key={i} className="flex items-center justify-between gap-3 px-4 py-2.5">
                          <p className="text-xs font-mono text-foreground/90 break-all">{pw}</p>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[8px] font-mono text-muted-foreground/50 tabular-nums">
                              {entropyBits(pw).toFixed(0)} bit
                            </span>
                            <button
                              onClick={async () => {
                                await navigator.clipboard.writeText(pw);
                                setCopiedPw(String(i));
                                setTimeout(() => setCopiedPw(""), 1500);
                              }}
                              className="p-1 text-muted-foreground/50 hover:text-fuchsia-400 transition-colors"
                            >
                              {copiedPw === String(i) ? (
                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Analyzer */}
              <div className="border border-border/60">
                <div className="px-4 py-3 border-b border-border/60 bg-muted/20 flex items-center gap-2">
                  <Gauge className="h-3.5 w-3.5 text-fuchsia-400" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-foreground">
                    Strength Analyzer
                  </span>
                </div>
                <div className="p-4 space-y-4">
                  <input
                    type="text"
                    value={pInput}
                    onChange={(e) => setPInput(e.target.value)}
                    placeholder="Analisis kekuatan password..."
                    className={inputLine}
                  />
                  {pInput && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <div className="border border-border/50 px-3 py-2">
                          <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground">Panjang</p>
                          <p className="text-sm font-black text-foreground tabular-nums">{pInput.length}</p>
                        </div>
                        <div className="border border-border/50 px-3 py-2">
                          <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground">Entropy</p>
                          <p className="text-sm font-black text-foreground tabular-nums">
                            {pwEntropy.toFixed(1)} <span className="text-[9px] text-muted-foreground">bit</span>
                          </p>
                        </div>
                        <div className="border border-border/50 px-3 py-2">
                          <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground">
                            Karakter unik
                          </p>
                          <p className="text-sm font-black text-foreground tabular-nums">
                            {new Set(pInput).size}
                          </p>
                        </div>
                        <div className="border border-border/50 px-3 py-2">
                          <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground">
                            Waktu crack
                          </p>
                          <p className="text-sm font-black text-foreground tabular-nums">
                            {pwGuesses ? formatTime(pwGuesses / 1e10) : "—"}
                          </p>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-[9px] font-black uppercase tracking-widest ${pwLabel[1]}`}>
                            {pwLabel[0]}
                          </span>
                          <span className="text-[8px] text-muted-foreground/50">@ 10^10 guesses/s</span>
                        </div>
                        <div className="h-1.5 bg-border overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${pwLabel[2]} ${
                              pwLabel[0] === "Excellent" ? "bg-emerald-400" : ""
                            } ${pwLabel[0] === "Strong" ? "bg-emerald-400" : ""} ${
                              pwLabel[0] === "Good" ? "bg-amber-400" : ""
                            } ${pwLabel[0] === "Weak" ? "bg-orange-400" : ""} ${
                              pwLabel[0] === "Very Weak" ? "bg-red-400" : ""
                            }`}
                            style={{ width: `${Math.min(100, (pwEntropy / 128) * 100)}%` }}
                          />
                        </div>
                        <p className="text-[9px] text-muted-foreground/50 mt-1.5">
                          Estimasi: {pwGuesses ? formatTime(pwGuesses / 1e10) : "—"} dengan brute force,
                          atau {pwGuesses ? formatTime(pwGuesses / 1e12) : "—"} dengan GPU cluster (10^12/s).
                          Password dari kamus bisa jauh lebih cepat.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
}

