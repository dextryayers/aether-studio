import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "30mb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    deps: {
      bcrypt: typeof bcrypt.hash,
      jwt: typeof jwt.sign,
      supabase: typeof createClient,
    },
  });
});

export default function handler(req: any, res: any) {
  return app(req, res);
}
