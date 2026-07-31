import express from "express";
import cors from "cors";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "30mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/ping", (_req, res) => {
  res.json({ pong: true });
});

app.post("/api/echo", (req, res) => {
  res.json({ body: req.body || {} });
});

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("Error:", err?.message || err);
  res.status(500).json({ error: err?.message || "Internal server error" });
});

export default function handler(req: any, res: any) {
  return app(req, res);
}
