import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "30mb" }));

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY");
  return createClient(url, key);
}

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
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
    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET || "fallback", { expiresIn: "7d" });
    res.json({ token, admin: { id: admin.id, username: admin.username } });
  } catch (err: any) {
    console.error("Login error:", err?.message || err);
    res.status(500).json({ error: err?.message || "Internal server error" });
  }
});

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("Error:", err?.message || err);
  res.status(500).json({ error: err?.message || "Internal server error" });
});

export default function handler(req: any, res: any) {
  return app(req, res);
}
