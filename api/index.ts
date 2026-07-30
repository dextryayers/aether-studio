import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth";
import projectRoutes from "./routes/projects";
import serviceRoutes from "./routes/services";
import timelineRoutes from "./routes/timeline";
import aboutRoutes from "./routes/about";
import contactRoutes from "./routes/contact";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "30mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/timeline", timelineRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/contact", contactRoutes);

app.use("/api/*", (_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("Unhandled error:", err?.message || err);
  res.status(500).json({ error: err?.message || "Internal error" });
});

export default function handler(req: any, res: any) {
  return app(req, res);
}
