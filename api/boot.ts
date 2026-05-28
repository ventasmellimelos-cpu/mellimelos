import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";

const app = new Hono();
const port = parseInt(process.env.PORT || "3000");

// Health check - Railway needs this
app.get("/api/trpc/ping", (c) => c.json({ ok: true, ts: Date.now() }));
app.get("/api/ping", (c) => c.json({ ok: true, ts: Date.now() }));
app.get("/health", (c) => c.json({ ok: true }));

// Serve static files from dist/public (where Vite builds to)
app.use("/*", serveStatic({ root: "./dist/public" }));

// Fallback to index.html for SPA routing
app.get("/*", serveStatic({ path: "./dist/public/index.html" }));

serve({ fetch: app.fetch, port }, () => {
  console.log(`Melli Melos running on po// Melli Melos - Thu May 28 22:22:25 CST 2026
