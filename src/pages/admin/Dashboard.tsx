import { useEffect, useState } from "react";
import { useAdmin } from "@/src/context/AdminContext";
import { api } from "@/src/services/api";
import { FolderKanban, Wrench, Clock, User, Phone, ArrowRight, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const { admin } = useAdmin();
  const [stats, setStats] = useState<any>({});
  const [loaded, setLoaded] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    Promise.all([
      api.getProjects(),
      api.getServices(),
      api.getTimeline(),
    ])
      .then(([projects, services, timeline]) => {
        setStats({
          projects: projects.length,
          services: services.length,
          timeline: timeline.length,
        });
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const cards = [
    { label: "Projects", value: stats.projects ?? "-", icon: FolderKanban, href: "/admin/dashboard/projects", desc: "Manage portfolio work", addHref: "/admin/dashboard/projects#new" },
    { label: "Services", value: stats.services ?? "-", icon: Wrench, href: "/admin/dashboard/services", desc: "Manage offerings", addHref: "/admin/dashboard/services#new" },
    { label: "Timeline", value: stats.timeline ?? "-", icon: Clock, href: "/admin/dashboard/timeline", desc: "Manage journey events", addHref: "/admin/dashboard/timeline#new" },
    { label: "About", value: "Edit", icon: User, href: "/admin/dashboard/about", desc: "Update biography", addHref: "/admin/dashboard/about" },
    { label: "Contact", value: "Edit", icon: Phone, href: "/admin/dashboard/contact", desc: "Update contact info", addHref: "/admin/dashboard/contact" },
  ];

  return (
    <div className="space-y-6 lg:space-y-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-4xl font-black tracking-tighter uppercase text-foreground">Dashboard</h1>
          <p className="text-[10px] lg:text-xs text-muted-foreground font-medium mt-1 lg:mt-2 tracking-wide">
            Welcome back, <span className="text-foreground font-bold">Admin</span>
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-lg lg:text-2xl font-black tracking-tighter text-foreground tabular-nums">
            {time.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })}
          </p>
          <p className="text-[8px] lg:text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-0.5">
            {time.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4">
        {cards.map((card) => (
          <Link key={card.label} to={card.href}
            className="relative bg-card border border-border/60 p-4 lg:p-6 hover:border-primary/30 transition-all duration-300 group block">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative space-y-3 lg:space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 lg:w-9 lg:h-9 bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <card.icon className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-primary" />
                </div>
                <div className="flex items-center gap-2">
                  {loaded ? (
                    <span className="text-xl lg:text-2xl font-black tracking-tighter text-foreground tabular-nums">{card.value}</span>
                  ) : (
                    <span className="w-8 h-6 bg-muted animate-pulse" />
                  )}
                </div>
              </div>
              <div>
                <p className="text-[10px] lg:text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">{card.label}</p>
                <p className="text-[8px] lg:text-[9px] text-muted-foreground mt-0.5 lg:mt-1 font-medium">{card.desc}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[8px] lg:text-[9px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">
                  Manage <ArrowRight className="h-2.5 w-2.5 lg:h-3 lg:w-3 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                {card.addHref && (
                  <Link to={card.addHref} onClick={(e) => e.stopPropagation()}
                    className="ml-auto relative z-10 flex items-center gap-1 h-8 px-4 border border-border/60 text-[9px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all">
                    <Plus className="h-3.5 w-3.5" /> Add
                  </Link>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="border-t border-border/30 pt-6 lg:pt-8">
        <p className="text-[9px] lg:text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-3 lg:mb-4">Quick Actions</p>
        <div className="flex flex-nowrap lg:flex-wrap gap-2 lg:gap-3 overflow-x-auto pb-2 lg:pb-0 -mx-4 lg:mx-0 px-4 lg:px-0 scrollbar-none">
          {[
            { label: "Add Project", href: "/admin/dashboard/projects#new" },
            { label: "Add Service", href: "/admin/dashboard/services#new" },
            { label: "Add Event", href: "/admin/dashboard/timeline#new" },
          ].map((action) => (
            <Link key={action.label} to={action.href}
              className="shrink-0 h-9 px-4 lg:px-5 border border-border text-[9px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all flex items-center gap-2">
              + {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
