import { useEffect, useState } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { useAdmin } from "@/src/context/AdminContext";
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  FolderKanban,
  Wrench,
  Clock,
  User,
  Phone,
  LogOut,
  ArrowLeft,
  Sparkles,
  Menu,
  X,
  Inbox,
  Sun,
  Moon,
} from "lucide-react";

const navItems = [
  { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/dashboard/projects", icon: FolderKanban, label: "Projects" },
  { to: "/admin/dashboard/services", icon: Wrench, label: "Services" },
  { to: "/admin/dashboard/timeline", icon: Clock, label: "Timeline" },
  { to: "/admin/dashboard/about", icon: User, label: "About" },
  { to: "/admin/dashboard/contact", icon: Phone, label: "Contact" },
  { to: "/admin/dashboard/messages", icon: Inbox, label: "Messages" },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      onClick={() => setTheme(next)}
      className="shrink-0 flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all rounded-sm"
      title={`Switch to ${next} mode`}
    >
      {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
    </button>
  );
}

export default function AdminLayout() {
  const { isAuthenticated, logout, admin } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) navigate("/admin");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Ambient bg */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/3 rounded-full blur-[120px]" />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - desktop: fixed, mobile: overlay drawer */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 shrink-0 border-r border-border/50 flex flex-col bg-card transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Brand */}
        <div className="p-4 lg:p-6 border-b border-border/30 flex items-center justify-between">
          <Link to="/admin/dashboard" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-black tracking-tight uppercase text-foreground">Haniplabs</p>
              <p className="text-[8px] tracking-[0.3em] uppercase text-muted-foreground hidden lg:block">Content Studio</p>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 lg:py-6 space-y-1 px-3 lg:px-4">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 group relative ${
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {active && (
                  <span className="absolute inset-0 bg-primary/10 border-l-2 border-primary" />
                )}
                <item.icon className={`h-3.5 w-3.5 relative z-10 transition-transform duration-200 ${
                  active ? "" : "group-hover:scale-110"
                }`} />
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User / Logout */}
        <div className="p-4 lg:p-5 border-t border-border/30 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">
                {admin?.username?.charAt(0) || "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-foreground uppercase tracking-wider truncate">
                {admin?.username}
              </p>
              <p className="text-[8px] text-muted-foreground uppercase tracking-wider hidden lg:block">Administrator</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-1.5 h-8 text-[9px] font-bold uppercase tracking-wider text-muted-foreground hover:text-red-400 hover:bg-red-500/5 transition-all rounded-sm"
            >
              <LogOut className="h-3 w-3" /> Logout
            </button>
            <Link
              to="/"
              className="flex-1 flex items-center justify-center gap-1.5 h-8 text-[9px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all rounded-sm"
            >
              <ArrowLeft className="h-3 w-3" /> Site
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto relative z-10 min-w-0">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-10 lg:hidden bg-background/90 backdrop-blur border-b border-border/30 px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-black tracking-tight uppercase text-foreground">Haniplabs</span>
          </div>
          <div className="w-5" />
        </div>

        <div className="p-4 lg:p-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
