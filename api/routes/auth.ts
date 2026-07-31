import { Router } from "express";
import bcrypt from "bcryptjs";
import { getSupabase } from "../_lib/supabase";
import { generateToken } from "../_lib/auth";

const router = Router();

router.get("/ping", (_req, res) => {
  res.json({ ok: true });
});

router.post("/login", async (req, res) => {
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

export default router;
