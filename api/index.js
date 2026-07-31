import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "30mb" }));

function sb() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) throw new Error("Missing env vars");
  return createClient(url, key);
}

function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    req.adminId = jwt.verify(token, process.env.JWT_SECRET || "fallback").id;
    next();
  } catch {
    res.status(403).json({ error: "Invalid token" });
  }
}

// Health
const SUBDOMAIN_SOURCES = [
  {
    name: "crt.sh",
    fetch: async (domain) => {
      const r = await fetch(`https://crt.sh/?q=%25.${domain}&output=json`, {
        signal: AbortSignal.timeout(15000),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      const subs = new Set();
      for (const entry of data) {
        (entry.name_value || "")
          .split("\n")
          .forEach((n) => {
            const clean = n.trim().toLowerCase().replace(/\.$/, "");
            if (clean.endsWith(`.${domain}`) || clean === domain) subs.add(clean);
          });
      }
      return [...subs];
    },
  },
  {
    name: "rapiddns.io",
    fetch: async (domain) => {
      const r = await fetch(`https://rapiddns.io/subdomain/${domain}?full=1`, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        },
        signal: AbortSignal.timeout(15000),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const html = await r.text();
      const subs = new Set();
      const re = /<td>([a-zA-Z0-9._*-]+)<\/td>/g;
      let m;
      while ((m = re.exec(html)) !== null) {
        const clean = m[1].trim().toLowerCase().replace(/\*$/, "").replace(/\.$/, "");
        if ((clean.endsWith(`.${domain}`) || clean === domain) && clean.includes(".")) subs.add(clean);
      }
      return [...subs];
    },
  },
  {
    name: "certspotter",
    fetch: async (domain) => {
      const r = await fetch(
        `https://api.certspotter.com/v1/issuances?domain=${domain}&include_subdomains=true&expand=dns_names&limit=1000`,
        { signal: AbortSignal.timeout(15000) }
      );
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      const subs = new Set();
      for (const cert of data) {
        for (const name of cert.dns_names || []) {
          const clean = name.trim().toLowerCase().replace(/^\*\./, "").replace(/\.$/, "");
          if (clean.endsWith(`.${domain}`) || clean === domain) subs.add(clean);
        }
      }
      return [...subs];
    },
  },
];

app.get("/api/subdomain-finder", async (req, res) => {
  let domain = String(req.query.domain || "").trim().toLowerCase();
  domain = domain.replace(/^https?:\/\//, "").split("/")[0].split(":")[0];
  if (!domain || !/^[a-z0-9.-]+\.[a-z]{2,}$/.test(domain)) {
    return res.status(400).json({ error: "Invalid domain" });
  }
  const settled = await Promise.allSettled(SUBDOMAIN_SOURCES.map((s) => s.fetch(domain)));
  const subs = new Set();
  const used = [];
  const details = [];
  SUBDOMAIN_SOURCES.forEach((s, i) => {
    const r = settled[i];
    if (r.status === "fulfilled" && r.value.length > 0) {
      r.value.forEach((v) => subs.add(v));
      used.push(s.name);
    } else {
      details.push(`${s.name}: ${r.status === "rejected" ? r.reason.message : "empty"}`);
    }
  });
  if (subs.size === 0) {
    return res.status(502).json({ error: "All sources failed. Try again later.", details });
  }
  res.json({ subdomains: [...subs].sort(), sources: used });
});

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Auth
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Username and password required" });
    const { data: admin, error } = await sb().from("admins").select("*").eq("username", username).single();
    if (error || !admin) return res.status(401).json({ error: "Invalid credentials" });
    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET || "fallback", { expiresIn: "7d" });
    res.json({ token, admin: { id: admin.id, username: admin.username } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Projects
app.get("/api/projects", async (req, res) => {
  try {
    const { data, error } = await sb().from("projects").select("*").order("order", { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/projects/:id", async (req, res) => {
  try {
    const { data, error } = await sb().from("projects").select("*").eq("id", req.params.id).single();
    if (error) return res.status(404).json({ error: "Not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/projects", auth, async (req, res) => {
  try {
    const { title, category, description, image, year, order, repo_url, demo_url, tech_stack } = req.body;
    const techStack = Array.isArray(tech_stack) ? tech_stack : (typeof tech_stack === "string" ? tech_stack.split(",").map(s => s.trim()).filter(Boolean) : []);
    const { data, error } = await sb().from("projects").insert({ title, category, description, image, year, order, repo_url, demo_url, tech_stack: techStack }).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/projects/:id", auth, async (req, res) => {
  try {
    const { title, category, description, image, year, order, repo_url, demo_url, tech_stack } = req.body;
    const techStack = Array.isArray(tech_stack) ? tech_stack : (typeof tech_stack === "string" ? tech_stack.split(",").map(s => s.trim()).filter(Boolean) : []);
    const { data, error } = await sb().from("projects").update({ title, category, description, image, year, order, repo_url, demo_url, tech_stack: techStack, updated_at: new Date().toISOString() }).eq("id", req.params.id).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/projects/:id", auth, async (req, res) => {
  try {
    const { error } = await sb().from("projects").delete().eq("id", req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Services
app.get("/api/services", async (req, res) => {
  try {
    const { data, error } = await sb().from("services").select("*").order("order", { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/services", auth, async (req, res) => {
  try {
    const { data, error } = await sb().from("services").insert(req.body).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/services/:id", auth, async (req, res) => {
  try {
    req.body.updated_at = new Date().toISOString();
    const { data, error } = await sb().from("services").update(req.body).eq("id", req.params.id).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/services/:id", auth, async (req, res) => {
  try {
    const { error } = await sb().from("services").delete().eq("id", req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Timeline
app.get("/api/timeline", async (req, res) => {
  try {
    const { data, error } = await sb().from("timeline_events").select("*").order("order", { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/timeline", auth, async (req, res) => {
  try {
    const { data, error } = await sb().from("timeline_events").insert(req.body).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/timeline/:id", auth, async (req, res) => {
  try {
    req.body.updated_at = new Date().toISOString();
    const { data, error } = await sb().from("timeline_events").update(req.body).eq("id", req.params.id).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/timeline/:id", auth, async (req, res) => {
  try {
    const { error } = await sb().from("timeline_events").delete().eq("id", req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// About
app.get("/api/about", async (req, res) => {
  try {
    const { data, error } = await sb().from("about_content").select("*").limit(1).single();
    if (error && error.code !== "PGRST116") return res.status(500).json({ error: error.message });
    res.json(data || { content_en: "", content_id: "" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/about", auth, async (req, res) => {
  try {
    const { content_en, content_id } = req.body;
    const { data: existing } = await sb().from("about_content").select("id").limit(1);
    let result;
    if (existing && existing.length > 0) {
      result = await sb().from("about_content").update({ content_en, content_id, updated_at: new Date().toISOString() }).eq("id", existing[0].id).select().single();
    } else {
      result = await sb().from("about_content").insert({ content_en, content_id }).select().single();
    }
    if (result.error) return res.status(500).json({ error: result.error.message });
    res.json(result.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Contact
app.get("/api/contact", async (req, res) => {
  try {
    const { data, error } = await sb().from("contact_info").select("*").limit(1).single();
    if (error && error.code !== "PGRST116") return res.status(500).json({ error: error.message });
    res.json(data || { email: "", phone: "", address: "", social_links: {} });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/contact", auth, async (req, res) => {
  try {
    const { email, phone, address, social_links } = req.body;
    const { data: existing } = await sb().from("contact_info").select("id").limit(1);
    let result;
    if (existing && existing.length > 0) {
      result = await sb().from("contact_info").update({ email, phone, address, social_links, updated_at: new Date().toISOString() }).eq("id", existing[0].id).select().single();
    } else {
      result = await sb().from("contact_info").insert({ email, phone, address, social_links }).select().single();
    }
    if (result.error) return res.status(500).json({ error: result.error.message });
    res.json(result.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/contact/submit", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ error: "Name, email, and message required" });
    const { data, error } = await sb().from("contact_messages").insert({ name, email, subject: subject || "", message }).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json({ success: true, id: data.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/contact/messages", auth, async (req, res) => {
  try {
    const { data, error } = await sb().from("contact_messages").select("*").order("created_at", { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/contact/messages/:id/read", auth, async (req, res) => {
  try {
    const { data, error } = await sb().from("contact_messages").update({ is_read: true }).eq("id", req.params.id).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/contact/messages/:id", auth, async (req, res) => {
  try {
    const { error } = await sb().from("contact_messages").delete().eq("id", req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message || "Internal error" });
});

export default function handler(req, res) {
  return app(req, res);
}
