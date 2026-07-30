import { Router } from "express";
import { getSupabase } from "../_lib/supabase";
import { authenticateToken } from "../_lib/auth";

const router = Router();

router.get("/", async (_req, res) => {
  const { data, error } = await getSupabase()
    .from("services")
    .select("*")
    .order("order", { ascending: true });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json(data);
});

router.post("/", authenticateToken, async (req, res) => {
  const { title, description, icon, tags, order } = req.body;
  const { data, error } = await getSupabase()
    .from("services")
    .insert({ title, description, icon, tags, order })
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.status(201).json(data);
});

router.put("/:id", authenticateToken, async (req, res) => {
  const { title, description, icon, tags, order } = req.body;
  const { data, error } = await getSupabase()
    .from("services")
    .update({ title, description, icon, tags, order, updated_at: new Date().toISOString() })
    .eq("id", req.params.id)
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json(data);
});

router.delete("/:id", authenticateToken, async (req, res) => {
  const { error } = await getSupabase()
    .from("services")
    .delete()
    .eq("id", req.params.id);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json({ success: true });
});

export default router;
