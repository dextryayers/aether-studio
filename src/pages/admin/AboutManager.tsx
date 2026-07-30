import { useEffect, useState } from "react";
import { api } from "@/src/services/api";
import { Save, User } from "lucide-react";

export default function AboutManager() {
  const [form, setForm] = useState({ content_en: "", content_id: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    api.getAbout()
      .then((data) => { if (data) setForm({ content_en: data.content_en || "", content_id: data.content_id || "" }); })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const save = async () => {
    setSaving(true);
    try { await api.updateAbout(form); setMessage({ type: "success", text: "About content saved" }); setTimeout(() => setMessage(null), 2000); }
    catch { setMessage({ type: "error", text: "Failed to save" }); } finally { setSaving(false); }
  };

  if (!loaded) {
    return (
      <div className="space-y-5 lg:space-y-8">
        <div className="h-6 lg:h-8 w-36 lg:w-48 bg-zinc-800 animate-pulse" />
        <div className="border border-zinc-800/50 p-4 lg:p-6 space-y-4 lg:space-y-5">
          <div className="h-24 lg:h-32 bg-zinc-800/50 animate-pulse" />
          <div className="h-24 lg:h-32 bg-zinc-800/50 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 lg:space-y-8">
      <div>
        <h1 className="text-xl lg:text-3xl font-black tracking-tighter uppercase text-white">About Content</h1>
        <p className="text-[9px] lg:text-[10px] text-zinc-500 font-medium mt-0.5 lg:mt-1 tracking-wide">Manage your biography in both languages</p>
      </div>

      {message && (
        <div className={`px-4 lg:px-5 py-3 border text-[10px] font-bold uppercase tracking-wider ${
          message.type === "success" ? "bg-primary/10 border-primary/30 text-primary" : "bg-red-500/10 border-red-500/30 text-red-400"
        }`}>
          {message.text}
        </div>
      )}

      <div className="border border-zinc-800/60 bg-[#0a0a0a] p-4 lg:p-6 space-y-4 lg:space-y-6">
        <div className="space-y-1.5 lg:space-y-2">
          <label className="flex items-center gap-2 text-[8px] lg:text-[9px] font-bold uppercase tracking-widest text-zinc-500">
            <span className="w-3.5 h-3.5 lg:w-4 lg:h-4 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-[5px] lg:text-[6px] text-primary font-black">EN</span>
            </span>
            English
          </label>
          <textarea value={form.content_en} onChange={(e) => setForm({ ...form, content_en: e.target.value })}
            className="w-full h-28 lg:h-40 bg-[#050505] border border-zinc-800 px-3 lg:px-4 py-2 lg:py-3 text-sm text-white outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all resize-none" placeholder="Write your biography in English..." />
        </div>
        <div className="space-y-1.5 lg:space-y-2">
          <label className="flex items-center gap-2 text-[8px] lg:text-[9px] font-bold uppercase tracking-widest text-zinc-500">
            <span className="w-3.5 h-3.5 lg:w-4 lg:h-4 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-[5px] lg:text-[6px] text-primary font-black">ID</span>
            </span>
            Indonesia
          </label>
          <textarea value={form.content_id} onChange={(e) => setForm({ ...form, content_id: e.target.value })}
            className="w-full h-28 lg:h-40 bg-[#050505] border border-zinc-800 px-3 lg:px-4 py-2 lg:py-3 text-sm text-white outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all resize-none" placeholder="Tulis biografi Anda dalam Bahasa Indonesia..." />
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
