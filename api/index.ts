import "express-async-errors";
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth";
import projectsRouter from "./routes/projects";
import servicesRouter from "./routes/services";
import aboutRouter from "./routes/about";
import contactRouter from "./routes/contact";
import timelineRouter from "./routes/timeline";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "30mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", authRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/services", servicesRouter);
app.use("/api/about", aboutRouter);
app.use("/api/contact", contactRouter);
app.use("/api/timeline", timelineRouter);

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("Unhandled error:", err?.message || err);
  res.status(500).json({ error: err?.message || "Internal server error" });
});

export default function handler(req: any, res: any) {
  return app(req, res);
}
