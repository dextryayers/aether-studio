import { Router } from "express";
import { getSupabase } from "../_lib/supabase";
import { authenticateToken } from "../_lib/auth";

const router = Router();

router.get("/", async (_req, res) => {
  const { data, error } = await getSupabase()
    .from("contact_info")
    .select("*")
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json(data || { email: "", phone: "", address: "", social_links: {} });
});

router.put("/", authenticateToken, async (req, res) => {
  const { email, phone, address, social_links } = req.body;
  const { data: existing } = await getSupabase()
    .from("contact_info")
    .select("id")
    .limit(1);

  let result;
  if (existing && existing.length > 0) {
    result = await getSupabase()
      .from("contact_info")
      .update({ email, phone, address, social_links, updated_at: new Date().toISOString() })
      .eq("id", existing[0].id)
      .select()
      .single();
  } else {
    result = await getSupabase()
      .from("contact_info")
      .insert({ email, phone, address, social_links })
      .select()
      .single();
  }

  if (result.error) {
    res.status(500).json({ error: result.error.message });
    return;
  }
  res.json(result.data);
});

router.post("/submit", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    res.status(400).json({ error: "Name, email, and message are required" });
    return;
  }

  const { data, error } = await getSupabase()
    .from("contact_messages")
    .insert({ name, email, subject: subject || "", message })
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.status(201).json({ success: true, id: data.id });
});

router.get("/messages", authenticateToken, async (req, res) => {
  const { data, error } = await getSupabase()
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json(data);
});

router.put("/messages/:id/read", authenticateToken, async (req, res) => {
  const { data, error } = await getSupabase()
    .from("contact_messages")
    .update({ is_read: true })
    .eq("id", req.params.id)
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json(data);
});

router.delete("/messages/:id", authenticateToken, async (req, res) => {
  const { error } = await getSupabase()
    .from("contact_messages")
    .delete()
    .eq("id", req.params.id);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json({ success: true });
});

export default router;
