import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { api } from "@/src/services/api";
import { Pencil, Trash2, Plus, X, FolderKanban } from "lucide-react";
import ImageUpload from "@/src/components/admin/ImageUpload";
import { toastSuccess, toastError, confirmDelete } from "@/src/lib/alerts";

export default function ProjectsManager() {
  const location = useLocation();
  const [projects, setProjects] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { if (location.hash === "#new") setShowForm(true); }, [location.hash]);

  const [form, setForm] = useState({ title: "", category: "", description: "", image: "", year: "", order: 0, repo_url: "", demo_url: "", tech_stack: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try { setProjects(await api.getProjects()); } catch {}
  };

  const openNew = () => {
    setEditing(null);
    setForm({ title: "", category: "", description: "", image: "", year: "", order: 0, repo_url: "", demo_url: "", tech_stack: "" });
    setShowForm(true);
  };

  const openEdit = (p: any) => {
    setEditing(p);
    setForm({ title: p.title, category: p.category, description: p.description, image: p.image, year: p.year, order: p.order, repo_url: p.repo_url || "", demo_url: p.demo_url || "", tech_stack: p.tech_stack ? p.tech_stack.join(", ") : "" });
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditing(null); };

  const save = async () => {
    setSaving(true);
    try {
      if (editing) {
        await api.updateProject(editing.id, form);
        toastSuccess("Project updated");
      } else {
        await api.createProject(form);
        toastSuccess("Project created");
      }
      closeForm();
      await load();
    } catch (e: any) { toastError(e?.message || "Failed to save"); } finally { setSaving(false); }
  };

  const remove = async (id: string) => {
    if (!await confirmDelete("this project")) return;
    try {
      await api.deleteProject(id);
      toastSuccess("Project deleted");
      await load();
    } catch (e: any) { toastError(e?.message || "Failed to delete"); }
  };

  const btn = "h-9 px-5 bg-primary text-primary-foreground text-[9px] font-black uppercase tracking-[0.25em] hover:brightness-110 transition-all disabled:opacity-40";
  const input = "w-full h-10 bg-background border border-border px-3 text-sm text-foreground outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground";

  return (
    <div className="space-y-5 lg:space-y-8">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl lg:text-3xl font-black tracking-tighter uppercase text-foreground truncate">Projects</h1>
          <p className="text-[9px] lg:text-[10px] text-muted-foreground font-medium mt-0.5 lg:mt-1 tracking-wide">
            {projects.length} {projects.length === 1 ? "project" : "projects"}
          </p>
        </div>
        <button onClick={openNew} className="shrink-0 h-9 lg:h-10 px-4 lg:px-5 bg-primary text-primary-foreground text-[8px] lg:text-[9px] font-black uppercase tracking-[0.25em] hover:brightness-110 transition-all flex items-center gap-1.5 lg:gap-2">
          <Plus className="h-3 w-3 lg:h-3.5 lg:w-3.5" /> <span className="hidden sm:inline">New Project</span><span className="sm:hidden">New</span>
        </button>
      </div>

      {showForm && (
        <div className="border border-border/60 bg-card p-4 lg:p-6 space-y-4 lg:space-y-5 relative">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] lg:text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {editing ? "Edit Project" : "New Project"}
            </h2>
            <button onClick={closeForm} className="text-muted-foreground hover:text-foreground transition-colors"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
            <div className="space-y-1 lg:space-y-1.5">
              <label className="text-[8px] lg:text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Title</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={input} placeholder="Project name" />
            </div>
            <div className="space-y-1 lg:space-y-1.5">
              <label className="text-[8px] lg:text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full h-10 bg-background border border-border px-3 text-sm text-foreground outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all appearance-none cursor-pointer">
                <option value="" disabled className="text-muted-foreground">Select category</option>
                <option value="Tools" className="text-foreground">Tools</option>
                <option value="Web Fullstack" className="text-foreground">Web Fullstack</option>
                <option value="Front End Web" className="text-foreground">Front End Web</option>
              </select>
            </div>
            <div className="space-y-1 lg:space-y-1.5">
              <ImageUpload value={form.image} onChange={(v) => setForm({ ...form, image: v })} />
            </div>
            <div className="space-y-1 lg:space-y-1.5">
              <label className="text-[8px] lg:text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Year</label>
              <input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className={input} placeholder="2024" />
            </div>
            <div className="space-y-1 lg:space-y-1.5">
              <label className="text-[8px] lg:text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Order</label>
              <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: +e.target.value })} className={input} />
            </div>
            <div className="space-y-1 lg:space-y-1.5">
              <label className="text-[8px] lg:text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Repo URL</label>
              <input value={form.repo_url} onChange={(e) => setForm({ ...form, repo_url: e.target.value })} className={input} placeholder="https://github.com/..." />
            </div>
            <div className="space-y-1 lg:space-y-1.5">
              <label className="text-[8px] lg:text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Demo URL</label>
              <input value={form.demo_url} onChange={(e) => setForm({ ...form, demo_url: e.target.value })} className={input} placeholder="https://..." />
            </div>
            <div className="md:col-span-2 space-y-1 lg:space-y-1.5">
              <label className="text-[8px] lg:text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full h-20 lg:h-24 bg-background border border-border px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground resize-none" placeholder="Describe the project..." />
            </div>
            <div className="md:col-span-2 space-y-1 lg:space-y-1.5">
              <label className="text-[8px] lg:text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Tech Stack (comma separated)</label>
              <input value={form.tech_stack} onChange={(e) => setForm({ ...form, tech_stack: e.target.value })} className={input} placeholder="React, Node.js, Tailwind CSS" />
            </div>
          </div>
          <div className="flex gap-3 pt-1 lg:pt-2">
            <button onClick={save} disabled={saving} className={btn}>{saving ? "Saving..." : editing ? "Update" : "Create"}</button>
            <button onClick={closeForm} className="h-9 px-5 border border-border text-[9px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all">Cancel</button>
          </div>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="border border-border/50 p-8 lg:p-12 text-center">
          <div className="w-10 h-10 lg:w-12 lg:h-12 mx-auto mb-3 lg:mb-4 border border-border flex items-center justify-center">
            <FolderKanban className="h-4 w-4 lg:h-5 lg:w-5 text-muted-foreground" />
          </div>
          <p className="text-xs lg:text-sm font-bold text-muted-foreground">No projects yet</p>
          <p className="text-[9px] lg:text-[10px] text-muted-foreground mt-1 mb-5">Create your first project to get started</p>
          <button onClick={openNew} className="h-9 px-5 bg-primary text-primary-foreground text-[9px] font-black uppercase tracking-[0.25em] hover:brightness-110 transition-all">+ Create Project</button>
        </div>
      ) : (
        <div className="space-y-1.5 lg:space-y-2">
          {projects.map((p) => (
            <div key={p.id} className="flex items-center justify-between bg-card border border-border/40 px-3 lg:px-5 py-3 lg:py-4 hover:border-border/60 transition-all gap-2">
              <div className="flex items-center gap-3 lg:gap-4 min-w-0">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-muted border border-border/30 flex items-center justify-center shrink-0">
                  {p.image ? <img src={p.image} alt="" className="w-full h-full object-cover" /> : <FolderKanban className="h-3 w-3 lg:h-4 lg:w-4 text-muted-foreground" />}
                </div>
                <div className="min-w-0">
                  <p className="text-xs lg:text-sm font-bold text-foreground truncate">{p.title}</p>
                  <div className="flex items-center gap-2 lg:gap-3 mt-0.5 flex-wrap">
                    <span className="text-[7px] lg:text-[8px] uppercase tracking-widest text-primary bg-primary/10 px-1 lg:px-1.5 py-0.5">{p.category || "General"}</span>
                    {p.year && <span className="text-[8px] lg:text-[9px] font-mono text-muted-foreground">{p.year}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 lg:gap-2 transition-opacity shrink-0">
                <button onClick={() => openEdit(p)} className="p-1.5 lg:p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"><Pencil className="h-3 w-3 lg:h-3.5 lg:w-3.5" /></button>
                <button onClick={() => remove(p.id)} className="p-1.5 lg:p-2 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 className="h-3 w-3 lg:h-3.5 lg:w-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
