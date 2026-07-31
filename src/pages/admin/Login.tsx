import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/src/context/AdminContext";
import { Eye, EyeOff, LogIn } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const { login } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setShake(false);
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
      setShake(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin relative min-h-screen bg-[#050505] flex items-center justify-center overflow-hidden">
      {/* Ambient gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/[0.06] via-transparent to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-3/4 h-3/4 bg-gradient-to-tl from-white/[0.04] via-transparent to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative w-full max-w-md px-6">
        {/* Logo / Brand */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 border border-white/20 bg-white/5">
            <LogIn className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-black tracking-[0.15em] uppercase text-white">
            Haniplabs
          </h1>
          <p className="mt-2 text-[10px] font-semibold tracking-[0.4em] uppercase text-zinc-500">
            Content Studio
          </p>
          <div className="mx-auto mt-6 w-12 h-[1px] bg-white/40" />
        </div>

        {/* Card */}
        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-sm bg-gradient-to-b from-white/10 to-transparent opacity-50 blur-sm" />
          <div className="relative bg-[#0a0a0a] border border-zinc-800/80 rounded-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-400">
                  Email
                </label>
                <div className="relative group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full h-12 bg-[#050505] border px-4 text-sm text-white outline-none transition-all duration-200
                      placeholder:text-zinc-700
                      ${error ? "border-red-500/50" : "border-zinc-800 group-focus-within:border-white/50"}
                      focus:border-white/60 focus:ring-1 focus:ring-white/20`}
                    placeholder="you@example.com"
                    autoFocus
                    required
                  />
                  <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-400">
                  Password
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full h-12 bg-[#050505] border px-4 pr-12 text-sm text-white outline-none transition-all duration-200
                      placeholder:text-zinc-700
                      ${error ? "border-red-500/50" : "border-zinc-800 group-focus-within:border-white/50"}
                      focus:border-white/60 focus:ring-1 focus:ring-white/20`}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                </div>
              </div>

              {/* Error */}
              <div className={`overflow-hidden transition-all duration-300 ${error ? "h-6 opacity-100" : "h-0 opacity-0"}`}>
                {error && (
                  <p
                    className={`text-[11px] text-red-400 font-medium ${shake ? "animate-[shake_0.4s_ease-in-out]" : ""}`}
                  >
                    {error}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="relative w-full h-12 overflow-hidden bg-white text-black font-black text-[10px] uppercase tracking-[0.3em] transition-all duration-300 hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed group"
              >
                <span className="absolute inset-0 bg-black/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                      <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                      <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                    </span>
                  ) : (
                    "Enter"
                  )}
                </span>
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-[9px] tracking-[0.3em] uppercase text-zinc-700">
          Haniplabs &copy; {new Date().getFullYear()}
        </p>
      </div>

      {/* Shake keyframes */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}
