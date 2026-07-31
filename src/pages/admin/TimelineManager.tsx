import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { api } from "@/src/services/api";
import { Pencil, Trash2, Plus, X, Clock } from "lucide-react";
import { toastSuccess, toastError, confirmDelete } from "@/src/lib/alerts";

export default function TimelineManager() {
  const location = useLocation();
  const [events, setEvents] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { if (location.hash === "#new") setShowForm(true); }, [location.hash]);
  const [form, setForm] = useState({ year: "", title_en: "", title_id: "", event_en: "", event_id: "", order: 0 });
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => { try { setEvents(await api.getTimeline()); } catch {} };

  const openNew = () => { setEditing(null); setForm({ year: "", title_en: "", title_id: "", event_en: "", event_id: "", order: 0 }); setShowForm(true); };
  const openEdit = (e: any) => { setEditing(e); setForm({ year: e.year, title_en: e.title_en, title_id: e.title_id, event_en: e.event_en, event_id: e.event_id, order: e.order }); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditing(null); };

  const save = async () => {
    setSaving(true);
    try {
      if (editing) { await api.updateTimeline(editing.id, form); toastSuccess("Event updated"); }
      else { await api.createTimeline(form); toastSuccess("Event created"); }
      closeForm(); await load();
    } catch { toastError("Failed to save"); } finally { setSaving(false); }
  };

  const remove = async (id: string) => {
    if (!await confirmDelete("this event")) return;
    try { await api.deleteTimeline(id); toastSuccess("Event deleted"); await load(); } catch { toastError("Failed to delete"); }
  };

  const btn = "h-9 px-5 bg-primary text-primary-foreground text-[9px] font-black uppercase tracking-[0.25em] hover:brightness-110 transition-all disabled:opacity-40";
  const input = "w-full h-10 bg-background border border-border px-3 text-sm text-foreground outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground";

  return (
    <div className="space-y-5 lg:space-y-8">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl lg:text-3xl font-black tracking-tighter uppercase text-foreground truncate">Timeline</h1>
          <p className="text-[9px] lg:text-[10px] text-muted-foreground font-medium mt-0.5 lg:mt-1 tracking-wide">{events.length} {events.length === 1 ? "event" : "events"}</p>
        </div>
        <button onClick={openNew} className="shrink-0 h-9 lg:h-10 px-4 lg:px-5 bg-primary text-primary-foreground text-[8px] lg:text-[9px] font-black uppercase tracking-[0.25em] hover:brightness-110 transition-all flex items-center gap-1.5 lg:gap-2">
          <Plus className="h-3 w-3 lg:h-3.5 lg:w-3.5" /> <span className="hidden sm:inline">New Event</span><span className="sm:hidden">New</span>
        </button>
      </div>

      {showForm && (
        <div className="border border-border/60 bg-card p-4 lg:p-6 space-y-4 lg:space-y-5 relative">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] lg:text-xs font-bold uppercase tracking-widest text-muted-foreground">{editing ? "Edit Event" : "New Event"}</h2>
            <button onClick={closeForm} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
            <div className="space-y-1 lg:space-y-1.5">
              <label className="text-[8px] lg:text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Year</label>
              <input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className={input} placeholder="2021 - 2022" />
            </div>
            <div className="space-y-1 lg:space-y-1.5">
              <label className="text-[8px] lg:text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Order</label>
              <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: +e.target.value })} className={input} />
            </div>
            <div className="space-y-1 lg:space-y-1.5">
              <label className="text-[8px] lg:text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Title (EN)</label>
              <input value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} className={input} placeholder="English title" />
            </div>
            <div className="space-y-1 lg:space-y-1.5">
              <label className="text-[8px] lg:text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Title (ID)</label>
              <input value={form.title_id} onChange={(e) => setForm({ ...form, title_id: e.target.value })} className={input} placeholder="Judul Indonesia" />
            </div>
            <div className="space-y-1 lg:space-y-1.5">
              <label className="text-[8px] lg:text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Description (EN)</label>
              <textarea value={form.event_en} onChange={(e) => setForm({ ...form, event_en: e.target.value })}
                className="w-full h-24 lg:h-28 bg-background border border-border px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground resize-none" placeholder="English description" />
            </div>
            <div className="space-y-1 lg:space-y-1.5">
              <label className="text-[8px] lg:text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Description (ID)</label>
              <textarea value={form.event_id} onChange={(e) => setForm({ ...form, event_id: e.target.value })}
                className="w-full h-24 lg:h-28 bg-background border border-border px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground resize-none" placeholder="Deskripsi Indonesia" />
            </div>
          </div>
          <div className="flex gap-3 pt-1 lg:pt-2">
            <button onClick={save} disabled={saving} className={btn}>{saving ? "Saving..." : editing ? "Update" : "Create"}</button>
            <button onClick={closeForm} className="h-9 px-5 border border-border text-[9px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all">Cancel</button>
          </div>
        </div>
      )}

      {events.length === 0 ? (
        <div className="border border-border/50 p-8 lg:p-12 text-center">
          <div className="w-10 h-10 lg:w-12 lg:h-12 mx-auto mb-3 lg:mb-4 border border-border flex items-center justify-center">
            <Clock className="h-4 w-4 lg:h-5 lg:w-5 text-muted-foreground" />
          </div>
          <p className="text-xs lg:text-sm font-bold text-muted-foreground">No timeline events</p>
          <p className="text-[9px] lg:text-[10px] text-muted-foreground mt-1 mb-5">Document your journey with timeline events</p>
          <button onClick={openNew} className="h-9 px-5 bg-primary text-primary-foreground text-[9px] font-black uppercase tracking-[0.25em] hover:brightness-110 transition-all">+ Create Event</button>
        </div>
      ) : (
        <div className="space-y-1.5 lg:space-y-2">
          {events.map((e) => (
            <div key={e.id} className="flex items-center justify-between bg-card border border-border/40 px-3 lg:px-5 py-3 lg:py-4 hover:border-border/60 transition-all gap-2">
              <div className="flex items-center gap-3 lg:gap-4 min-w-0">
                <span className="text-xs lg:text-sm font-mono font-bold text-primary shrink-0">{e.year}</span>
                <div className="min-w-0">
                  <p className="text-xs lg:text-sm font-bold text-foreground truncate">{e.title_en}</p>
                  {e.title_id && <p className="text-[8px] lg:text-[10px] text-muted-foreground truncate">ID: {e.title_id}</p>}
                </div>
              </div>
              <div className="flex items-center gap-1 lg:gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity shrink-0">
                <button onClick={() => openEdit(e)} className="p-1.5 lg:p-2 text-muted-foreground hover:text-primary hover:bg-primary/10"><Pencil className="h-3 w-3 lg:h-3.5 lg:w-3.5" /></button>
                <button onClick={() => remove(e.id)} className="p-1.5 lg:p-2 text-muted-foreground hover:text-red-400 hover:bg-red-500/10"><Trash2 className="h-3 w-3 lg:h-3.5 lg:w-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
