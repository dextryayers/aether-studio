import { Router } from "express";
import { getSupabase } from "../_lib/supabase";
import { authenticateToken } from "../_lib/auth";

const router = Router();

router.get("/", async (_req, res) => {
  const { data, error } = await getSupabase()
    .from("timeline_events")
    .select("*")
    .order("order", { ascending: true });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json(data);
});

router.post("/", authenticateToken, async (req, res) => {
  const { year, title_en, title_id, event_en, event_id, order } = req.body;
  const { data, error } = await getSupabase()
    .from("timeline_events")
    .insert({ year, title_en, title_id, event_en, event_id, order })
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.status(201).json(data);
});

router.put("/:id", authenticateToken, async (req, res) => {
  const { year, title_en, title_id, event_en, event_id, order } = req.body;
  const { data, error } = await getSupabase()
    .from("timeline_events")
    .update({ year, title_en, title_id, event_en, event_id, order, updated_at: new Date().toISOString() })
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
    .from("timeline_events")
    .delete()
    .eq("id", req.params.id);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json({ success: true });
});

export default router;
