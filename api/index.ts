import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "30mb" }));

app.get("/api/health", (_req, res) => {
  const hasUrl = !!process.env.SUPABASE_URL;
  res.json({ status: "ok", supabase: typeof createClient, env: hasUrl });
});

export default function handler(req: any, res: any) {
  return app(req, res);
}
