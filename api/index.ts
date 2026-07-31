export default function handler(req: any, res: any) {
  if (req.url === "/api/health" && req.method === "GET") {
    res.status(200).json({ status: "ok" });
    return;
  }
  res.status(404).json({ error: "Not found" });
}
