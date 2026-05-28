import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = join(__dirname, "..", "dist", "public");

const app = new Hono();
const port = parseInt(process.env.PORT || "3000");

// Health check
app.get("/api/trpc/ping", (c) => c.json({ ok: true, ts: Date.now() }));
app.get("/api/ping", (c) => c.json({ ok: true, ts: Date.now() }));
app.get("/health", (c) => c.json({ ok: true }));

// Serve static files
app.use("/*", serveStatic({ root: publicDir }));

// Fallback for SPA
app.get("/*", (c) => {
  try {
    const html = readFileSync(join(publicDir, "index.html"), "utf-8");
    return c.html(html);
  } catch {
    return c.text("Melli Melos", 200);
  }
});

serve({ fetch: app.fetch, port }, () => {
  console.log(`Melli Melos running on port ${port}`);
});

export default app;
