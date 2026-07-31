import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/ping", (_req, res) => {
  res.json({ pong: true });
});

app.post("/api/echo", (req, res) => {
  res.json({ body: req.body || {} });
});

export default function handler(req: any, res: any) {
  return app(req, res);
}
