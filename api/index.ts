import express from "express";
import cors from "cors";
import { getSupabase } from "./_lib/supabase";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "30mb" }));

app.get("/api/health", async (_req, res) => {
  try {
    const sb = getSupabase();
    res.json({ status: "ok", sb: true });
  } catch (e: any) {
    res.json({ status: "ok", error: e.message });
  }
});

app.get("/api/xyz", (_req, res) => {
  res.json({ ok: true, path: "xyz" });
});

app.use("/api/*", (_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err: any, _req: any, res: any, _next: any) => {
  res.status(500).json({ error: err?.message || "Internal error" });
});

export default function handler(req: any, res: any) {
  return app(req, res);
}
