import { createContext, useContext, useState, useEffect } from "react";
import { api } from "@/src/services/api";

interface AdminUser {
  id: string;
  username: string;
}

interface AdminContextType {
  token: string | null;
  admin: AdminUser | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("admin_token"));
  const [admin, setAdmin] = useState<AdminUser | null>(() => {
    const stored = localStorage.getItem("admin_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);
    localStorage.setItem("admin_token", res.token);
    localStorage.setItem("admin_user", JSON.stringify(res.admin));
    setToken(res.token);
    setAdmin(res.admin);
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    setToken(null);
    setAdmin(null);
  };

  return (
    <AdminContext.Provider value={{ token, admin, login, logout, isAuthenticated: !!token }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
