import { Router } from "express";
import { getSupabase } from "../_lib/supabase";
import { authenticateToken } from "../_lib/auth";

const router = Router();

router.get("/", async (_req, res) => {
  const { data, error } = await getSupabase()
    .from("about_content")
    .select("*")
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json(data || { content_en: "", content_id: "" });
});

router.put("/", authenticateToken, async (req, res) => {
  const { content_en, content_id } = req.body;
  const { data: existing } = await getSupabase()
    .from("about_content")
    .select("id")
    .limit(1);

  let result;
  if (existing && existing.length > 0) {
    result = await getSupabase()
      .from("about_content")
      .update({ content_en, content_id, updated_at: new Date().toISOString() })
      .eq("id", existing[0].id)
      .select()
      .single();
  } else {
    result = await getSupabase()
      .from("about_content")
      .insert({ content_en, content_id })
      .select()
      .single();
  }

  if (result.error) {
    res.status(500).json({ error: result.error.message });
    return;
  }
  res.json(result.data);
});

export default router;
