import { useEffect, useState } from "react";
import { api } from "@/src/services/api";
import { Save, Phone } from "lucide-react";

export default function ContactManager() {
  const [form, setForm] = useState({ email: "", phone: "", address: "", social_links: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [jsonError, setJsonError] = useState(false);

  useEffect(() => {
    api.getContact()
      .then((data) => {
        if (data) setForm({
          email: data.email || "", phone: data.phone || "", address: data.address || "",
          social_links: JSON.stringify(data.social_links || {}, null, 2),
        });
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const save = async () => {
    let social_links: Record<string, string> = {};
    try { social_links = JSON.parse(form.social_links); setJsonError(false); }
    catch { setJsonError(true); setMessage({ type: "error", text: "Invalid JSON in social links" }); setTimeout(() => setMessage(null), 2500); return; }
    setSaving(true);
    try { await api.updateContact({ ...form, social_links }); setMessage({ type: "success", text: "Contact info saved" }); setTimeout(() => setMessage(null), 2000); }
    catch { setMessage({ type: "error", text: "Failed to save" }); } finally { setSaving(false); }
  };

  if (!loaded) {
    return (
      <div className="space-y-5 lg:space-y-8">
        <div className="h-6 lg:h-8 w-36 lg:w-48 bg-zinc-800 animate-pulse" />
        <div className="border border-zinc-800/50 p-4 lg:p-6 space-y-4 lg:space-y-5">
          <div className="grid grid-cols-2 gap-3 lg:gap-4"><div className="h-10 bg-zinc-800/50 animate-pulse" /><div className="h-10 bg-zinc-800/50 animate-pulse" /></div>
          <div className="h-10 bg-zinc-800/50 animate-pulse" />
          <div className="h-24 lg:h-32 bg-zinc-800/50 animate-pulse" />
        </div>
      </div>
    );
  }

  const input = "w-full h-10 bg-[#050505] border border-zinc-800 px-3 text-sm text-white outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all";

  return (
    <div className="space-y-5 lg:space-y-8">
      <div>
        <h1 className="text-xl lg:text-3xl font-black tracking-tighter uppercase text-white">Contact Info</h1>
        <p className="text-[9px] lg:text-[10px] text-zinc-500 font-medium mt-0.5 lg:mt-1 tracking-wide">Manage your contact details and social links</p>
      </div>

      {message && (
        <div className={`px-4 lg:px-5 py-3 border text-[10px] font-bold uppercase tracking-wider ${
          message.type === "success" ? "bg-primary/10 border-primary/30 text-primary" : "bg-red-500/10 border-red-500/30 text-red-400"
        }`}>
          {message.text}
        </div>
      )}

      <div className="border border-zinc-800/60 bg-[#0a0a0a] p-4 lg:p-6 space-y-4 lg:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
          <div className="space-y-1 lg:space-y-1.5">
            <label className="text-[8px] lg:text-[9px] font-bold uppercase tracking-widest text-zinc-500">Email</label>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={input} placeholder="hello@example.com" />
          </div>
          <div className="space-y-1 lg:space-y-1.5">
            <label className="text-[8px] lg:text-[9px] font-bold uppercase tracking-widest text-zinc-500">Phone</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={input} placeholder="+62 ..." />
          </div>
        </div>
        <div className="space-y-1 lg:space-y-1.5">
          <label className="text-[8px] lg:text-[9px] font-bold uppercase tracking-widest text-zinc-500">Address</label>
          <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={input} placeholder="City, Country" />
        </div>
        <div className="space-y-1 lg:space-y-1.5">
          <label className="text-[8px] lg:text-[9px] font-bold uppercase tracking-widest text-zinc-500">Social Links (JSON)</label>
          <textarea value={form.social_links} onChange={(e) => { setForm({ ...form, social_links: e.target.value }); setJsonError(false); }}
            className={`w-full h-28 lg:h-36 bg-[#050505] border px-3 lg:px-4 py-2 lg:py-3 text-sm font-mono text-white outline-none transition-all resize-none ${
              jsonError ? "border-red-500/50" : "border-zinc-800 focus:border-primary/60 focus:ring-1 focus:ring-primary/20"
            }`} placeholder='{&#10;  "github": "https://...",&#10;  "linkedin": "https://..."&#10;}' />
          {jsonError && <p className="text-[9px] lg:text-[10px] text-red-400 font-medium">Invalid JSON — check your syntax</p>}
        </div>
        <button onClick={save} disabled={saving}
          className="h-9 lg:h-10 px-5 lg:px-6 bg-primary text-black text-[9px] font-black uppercase tracking-[0.25em] hover:brightness-110 transition-all disabled:opacity-40 flex items-center gap-2">
          <Save className="h-3 lg:h-3.5 w-3 lg:w-3.5" />
          {saving ? "Saving..." : message?.type === "success" ? "Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
