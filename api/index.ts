import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import { getSupabase } from "./_lib/supabase";
import { generateToken } from "./_lib/auth";

import projectRoutes from "./routes/projects";
import serviceRoutes from "./routes/services";
import timelineRoutes from "./routes/timeline";
import aboutRoutes from "./routes/about";
import contactRoutes from "./routes/contact";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "30mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", version: 3 });
});

app.get("/api/xyz", (_req, res) => {
  res.json({ ok: true, path: "xyz" });
});

app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ error: "Username and password required" });
      return;
    }
    const { data: admin, error } = await getSupabase()
      .from("admins")
      .select("*")
      .eq("username", username)
      .single();
    if (error || !admin) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const token = generateToken(admin.id);
    res.json({ token, admin: { id: admin.id, username: admin.username } });
  } catch (err: any) {
    console.error("Login error:", err?.message || err);
    res.status(500).json({ error: err?.message || "Internal server error" });
  }
});

app.use("/api/projects", projectRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/timeline", timelineRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/contact", contactRoutes);

app.use("/api/*", (_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("Handler error:", err?.message || err);
  res.status(500).json({ error: err?.message || "Internal error" });
});

export default function handler(req: any, res: any) {
  return app(req, res);
}
