import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { api } from "@/src/services/api";
import { Pencil, Trash2, Plus, X, Wrench } from "lucide-react";

export default function ServicesManager() {
  const location = useLocation();
  const [services, setServices] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { if (location.hash === "#new") setShowForm(true); }, [location.hash]);
  const [form, setForm] = useState({ title: "", description: "", icon: "", tags: "", order: 0 });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => { load(); }, []);

  const load = async () => { try { setServices(await api.getServices()); } catch {} };
  const showMsg = (t: "success" | "error", s: string) => { setMessage({ type: t, text: s }); setTimeout(() => setMessage(null), 2500); };

  const openNew = () => { setEditing(null); setForm({ title: "", description: "", icon: "", tags: "", order: 0 }); setShowForm(true); };
  const openEdit = (s: any) => { setEditing(s); setForm({ title: s.title, description: s.description, icon: s.icon, tags: s.tags?.join(", ") || "", order: s.order }); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditing(null); };

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...form, tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean) };
      if (editing) { await api.updateService(editing.id, payload); showMsg("success", "Service updated"); }
      else { await api.createService(payload); showMsg("success", "Service created"); }
      closeForm(); await load();
    } catch { showMsg("error", "Failed to save"); } finally { setSaving(false); }
  };

  const remove = async (id: string) => {
    try { await api.deleteService(id); showMsg("success", "Service deleted"); await load(); } catch { showMsg("error", "Failed to delete"); }
  };

  const btn = "h-9 px-5 bg-primary text-primary-foreground text-[9px] font-black uppercase tracking-[0.25em] hover:brightness-110 transition-all disabled:opacity-40";
  const input = "w-full h-10 bg-background border border-border px-3 text-sm text-foreground outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground";

  return (
    <div className="space-y-5 lg:space-y-8">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl lg:text-3xl font-black tracking-tighter uppercase text-foreground truncate">Services</h1>
          <p className="text-[9px] lg:text-[10px] text-muted-foreground font-medium mt-0.5 lg:mt-1 tracking-wide">{services.length} {services.length === 1 ? "service" : "services"}</p>
        </div>
        <button onClick={openNew} className="shrink-0 h-9 lg:h-10 px-4 lg:px-5 bg-primary text-primary-foreground text-[8px] lg:text-[9px] font-black uppercase tracking-[0.25em] hover:brightness-110 transition-all flex items-center gap-1.5 lg:gap-2">
          <Plus className="h-3 w-3 lg:h-3.5 lg:w-3.5" /> <span className="hidden sm:inline">New Service</span><span className="sm:hidden">New</span>
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
        <div className="border border-border/60 bg-card p-4 lg:p-6 space-y-4 lg:space-y-5 relative">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] lg:text-xs font-bold uppercase tracking-widest text-muted-foreground">{editing ? "Edit Service" : "New Service"}</h2>
            <button onClick={closeForm} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
            <div className="space-y-1 lg:space-y-1.5">
              <label className="text-[8px] lg:text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Title</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={input} placeholder="Service name" />
            </div>
            <div className="space-y-1 lg:space-y-1.5">
              <label className="text-[8px] lg:text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Icon (lucide)</label>
              <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className={input} placeholder="e.g. Globe" />
            </div>
            <div className="space-y-1 lg:space-y-1.5">
              <label className="text-[8px] lg:text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Tags (comma separated)</label>
              <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className={input} placeholder="Design, Dev" />
            </div>
            <div className="space-y-1 lg:space-y-1.5">
              <label className="text-[8px] lg:text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Order</label>
              <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: +e.target.value })} className={input} />
            </div>
            <div className="md:col-span-2 space-y-1 lg:space-y-1.5">
              <label className="text-[8px] lg:text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full h-20 lg:h-24 bg-background border border-border px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground resize-none" placeholder="Describe the service..." />
            </div>
          </div>
          <div className="flex gap-3 pt-1 lg:pt-2">
            <button onClick={save} disabled={saving} className={btn}>{saving ? "Saving..." : editing ? "Update" : "Create"}</button>
            <button onClick={closeForm} className="h-9 px-5 border border-border text-[9px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all">Cancel</button>
          </div>
        </div>
      )}

      {services.length === 0 ? (
        <div className="border border-border/50 p-8 lg:p-12 text-center">
          <div className="w-10 h-10 lg:w-12 lg:h-12 mx-auto mb-3 lg:mb-4 border border-border flex items-center justify-center">
            <Wrench className="h-4 w-4 lg:h-5 lg:w-5 text-muted-foreground" />
          </div>
          <p className="text-xs lg:text-sm font-bold text-muted-foreground">No services yet</p>
          <p className="text-[9px] lg:text-[10px] text-muted-foreground mt-1 mb-5">Add your first service offering</p>
          <button onClick={openNew} className="h-9 px-5 bg-primary text-primary-foreground text-[9px] font-black uppercase tracking-[0.25em] hover:brightness-110 transition-all">+ Create Service</button>
        </div>
      ) : (
        <div className="space-y-1.5 lg:space-y-2">
          {services.map((s) => (
            <div key={s.id} className="flex items-center justify-between bg-card border border-border/40 px-3 lg:px-5 py-3 lg:py-4 hover:border-border/60 transition-all gap-2">
              <div className="min-w-0">
                <p className="text-xs lg:text-sm font-bold text-foreground">{s.title}</p>
                {s.tags?.length > 0 && (
                  <div className="flex gap-1.5 lg:gap-2 mt-1 flex-wrap">
                    {s.tags.map((t: string) => (
                      <span key={t} className="text-[7px] lg:text-[8px] uppercase tracking-widest text-primary bg-primary/10 px-1 lg:px-1.5 py-0.5">{t}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 lg:gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity shrink-0">
                <button onClick={() => openEdit(s)} className="p-1.5 lg:p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"><Pencil className="h-3 w-3 lg:h-3.5 lg:w-3.5" /></button>
                <button onClick={() => remove(s.id)} className="p-1.5 lg:p-2 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 className="h-3 w-3 lg:h-3.5 lg:w-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
