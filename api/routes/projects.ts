import { Router } from "express";
import { getSupabase } from "../_lib/supabase";
import { authenticateToken } from "../_lib/auth";

const router = Router();

router.get("/", async (_req, res) => {
  const { data, error } = await getSupabase()
    .from("projects")
    .select("*")
    .order("order", { ascending: true });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json(data);
});

router.get("/:id", async (req, res) => {
  const { data, error } = await getSupabase()
    .from("projects")
    .select("*")
    .eq("id", req.params.id)
    .single();

  if (error) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  res.json(data);
});

router.post("/", authenticateToken, async (req, res) => {
  const { title, category, description, image, year, order, repo_url, demo_url, tech_stack } = req.body;
  const techStack = typeof tech_stack === "string" ? tech_stack.split(",").map((s: string) => s.trim()).filter(Boolean) : tech_stack || [];
  const { data, error } = await getSupabase()
    .from("projects")
    .insert({ title, category, description, image, year, order, repo_url, demo_url, tech_stack: techStack })
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.status(201).json(data);
});

router.put("/:id", authenticateToken, async (req, res) => {
  const { title, category, description, image, year, order, repo_url, demo_url, tech_stack } = req.body;
  const techStack = typeof tech_stack === "string" ? tech_stack.split(",").map((s: string) => s.trim()).filter(Boolean) : tech_stack || [];
  const { data, error } = await getSupabase()
    .from("projects")
    .update({ title, category, description, image, year, order, repo_url, demo_url, tech_stack: techStack, updated_at: new Date().toISOString() })
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
    .from("projects")
    .delete()
    .eq("id", req.params.id);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json({ success: true });
});

export default router;
