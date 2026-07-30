import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { api } from "@/src/services/api";
import { Pencil, Trash2, Plus, X, Clock } from "lucide-react";

export default function TimelineManager() {
  const location = useLocation();
  const [events, setEvents] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { if (location.hash === "#new") setShowForm(true); }, [location.hash]);
  const [form, setForm] = useState({ year: "", title_en: "", title_id: "", event_en: "", event_id: "", order: 0 });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => { load(); }, []);

  const load = async () => { try { setEvents(await api.getTimeline()); } catch {} };
  const showMsg = (t: "success" | "error", s: string) => { setMessage({ type: t, text: s }); setTimeout(() => setMessage(null), 2500); };

  const openNew = () => { setEditing(null); setForm({ year: "", title_en: "", title_id: "", event_en: "", event_id: "", order: 0 }); setShowForm(true); };
  const openEdit = (e: any) => { setEditing(e); setForm({ year: e.year, title_en: e.title_en, title_id: e.title_id, event_en: e.event_en, event_id: e.event_id, order: e.order }); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditing(null); };

  const save = async () => {
    setSaving(true);
    try {
      if (editing) { await api.updateTimeline(editing.id, form); showMsg("success", "Event updated"); }
      else { await api.createTimeline(form); showMsg("success", "Event created"); }
      closeForm(); await load();
    } catch { showMsg("error", "Failed to save"); } finally { setSaving(false); }
  };

  const remove = async (id: string) => {
    try { await api.deleteTimeline(id); showMsg("success", "Event deleted"); await load(); } catch { showMsg("error", "Failed to delete"); }
  };

  const btn = "h-9 px-5 bg-primary text-black text-[9px] font-black uppercase tracking-[0.25em] hover:brightness-110 transition-all disabled:opacity-40";
  const input = "w-full h-10 bg-[#050505] border border-zinc-800 px-3 text-sm text-white outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-zinc-700";

  return (
    <div className="space-y-5 lg:space-y-8">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl lg:text-3xl font-black tracking-tighter uppercase text-white truncate">Timeline</h1>
          <p className="text-[9px] lg:text-[10px] text-zinc-500 font-medium mt-0.5 lg:mt-1 tracking-wide">{events.length} {events.length === 1 ? "event" : "events"}</p>
        </div>
        <button onClick={openNew} className="shrink-0 h-9 lg:h-10 px-4 lg:px-5 bg-primary text-black text-[8px] lg:text-[9px] font-black uppercase tracking-[0.25em] hover:brightness-110 transition-all flex items-center gap-1.5 lg:gap-2">
          <Plus className="h-3 w-3 lg:h-3.5 lg:w-3.5" /> <span className="hidden sm:inline">New Event</span><span className="sm:hidden">New</span>
        </button>
      </div>

      {message && (
        <div className={`fixed left-4 right-4 lg:left-auto lg:right-6 top-4 lg:top-6 z-50 px-4 lg:px-5 py-3 border text-[10px] font-bold uppercase tracking-wider ${
          message.type === "success" ? "bg-primary/10 border-primary/30 text-primary" : "bg-red-500/10 border-red-500/30 text-red-400"
        }`}>
          {message.text}
        </div>
      )}

      {showForm && (
        <div className="border border-zinc-800/60 bg-[#0a0a0a] p-4 lg:p-6 space-y-4 lg:space-y-5 relative">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] lg:text-xs font-bold uppercase tracking-widest text-zinc-400">{editing ? "Edit Event" : "New Event"}</h2>
            <button onClick={closeForm} className="text-zinc-600 hover:text-zinc-300"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
            <div className="space-y-1 lg:space-y-1.5">
              <label className="text-[8px] lg:text-[9px] font-bold uppercase tracking-widest text-zinc-500">Year</label>
              <input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className={input} placeholder="2021 - 2022" />
            </div>
            <div className="space-y-1 lg:space-y-1.5">
              <label className="text-[8px] lg:text-[9px] font-bold uppercase tracking-widest text-zinc-500">Order</label>
              <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: +e.target.value })} className={input} />
            </div>
            <div className="space-y-1 lg:space-y-1.5">
              <label className="text-[8px] lg:text-[9px] font-bold uppercase tracking-widest text-zinc-500">Title (EN)</label>
              <input value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} className={input} placeholder="English title" />
            </div>
            <div className="space-y-1 lg:space-y-1.5">
              <label className="text-[8px] lg:text-[9px] font-bold uppercase tracking-widest text-zinc-500">Title (ID)</label>
              <input value={form.title_id} onChange={(e) => setForm({ ...form, title_id: e.target.value })} className={input} placeholder="Judul Indonesia" />
            </div>
            <div className="space-y-1 lg:space-y-1.5">
              <label className="text-[8px] lg:text-[9px] font-bold uppercase tracking-widest text-zinc-500">Description (EN)</label>
              <textarea value={form.event_en} onChange={(e) => setForm({ ...form, event_en: e.target.value })}
                className="w-full h-24 lg:h-28 bg-[#050505] border border-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-zinc-700 resize-none" placeholder="English description" />
            </div>
            <div className="space-y-1 lg:space-y-1.5">
              <label className="text-[8px] lg:text-[9px] font-bold uppercase tracking-widest text-zinc-500">Description (ID)</label>
              <textarea value={form.event_id} onChange={(e) => setForm({ ...form, event_id: e.target.value })}
                className="w-full h-24 lg:h-28 bg-[#050505] border border-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-zinc-700 resize-none" placeholder="Deskripsi Indonesia" />
            </div>
          </div>
          <div className="flex gap-3 pt-1 lg:pt-2">
            <button onClick={save} disabled={saving} className={btn}>{saving ? "Saving..." : editing ? "Update" : "Create"}</button>
            <button onClick={closeForm} className="h-9 px-5 border border-zinc-800 text-[9px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:border-zinc-600 transition-all">Cancel</button>
          </div>
        </div>
      )}

      {events.length === 0 ? (
        <div className="border border-zinc-800/50 p-8 lg:p-12 text-center">
          <div className="w-10 h-10 lg:w-12 lg:h-12 mx-auto mb-3 lg:mb-4 border border-zinc-800 flex items-center justify-center">
            <Clock className="h-4 w-4 lg:h-5 lg:w-5 text-zinc-600" />
          </div>
          <p className="text-xs lg:text-sm font-bold text-zinc-500">No timeline events</p>
          <p className="text-[9px] lg:text-[10px] text-zinc-700 mt-1 mb-5">Document your journey with timeline events</p>
          <button onClick={openNew} className="h-9 px-5 bg-primary text-black text-[9px] font-black uppercase tracking-[0.25em] hover:brightness-110 transition-all">+ Create Event</button>
        </div>
      ) : (
        <div className="space-y-1.5 lg:space-y-2">
          {events.map((e) => (
            <div key={e.id} className="flex items-center justify-between bg-[#0a0a0a] border border-zinc-800/40 px-3 lg:px-5 py-3 lg:py-4 hover:border-zinc-700/60 transition-all gap-2">
              <div className="flex items-center gap-3 lg:gap-4 min-w-0">
                <span className="text-xs lg:text-sm font-mono font-bold text-primary shrink-0">{e.year}</span>
                <div className="min-w-0">
                  <p className="text-xs lg:text-sm font-bold text-white truncate">{e.title_en}</p>
                  {e.title_id && <p className="text-[8px] lg:text-[10px] text-zinc-500 truncate">ID: {e.title_id}</p>}
                </div>
              </div>
              <div className="flex items-center gap-1 lg:gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity shrink-0">
                <button onClick={() => openEdit(e)} className="p-1.5 lg:p-2 text-zinc-600 hover:text-primary hover:bg-primary/10"><Pencil className="h-3 w-3 lg:h-3.5 lg:w-3.5" /></button>
                <button onClick={() => remove(e.id)} className="p-1.5 lg:p-2 text-zinc-600 hover:text-red-400 hover:bg-red-500/10"><Trash2 className="h-3 w-3 lg:h-3.5 lg:w-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
