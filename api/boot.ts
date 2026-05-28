import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync, existsSync } from "fs";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { getUploadById } from "./json-store";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = join(__dirname, "..", "dist", "public");
const indexPath = join(publicDir, "index.html");

const app = new Hono();
const port = parseInt(process.env.PORT || "3000");
// Railway deploy timestamp: 2026-05-29-v2

// Health check
app.get("/api/trpc/ping", (c) => c.json({ ok: true, ts: Date.now() }));
app.get("/api/ping", (c) => c.json({ ok: true, ts: Date.now() }));
app.get("/health", (c) => c.json({ ok: true }));

// Serve uploaded images directly from json-store
app.get("/uploads/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid upload ID", 400);

    const upload = getUploadById(id);
    if (!upload) return c.text("Image not found", 404);

    const buffer = Buffer.from(upload.data, "base64");
    c.header("Content-Type", upload.mimeType);
    c.header("Cache-Control", "public, max-age=31536000");
    return c.body(buffer);
  } catch (e) {
    console.error("Error serving upload:", e);
    return c.text(`Error: ${e instanceof Error ? e.message : "unknown"}`, 500);
  }
});

// Serve static files (JS, CSS, images, etc.)
app.use("/assets/*", serveStatic({ root: publicDir }));
app.use("/images/*", serveStatic({ root: publicDir }));
app.use("/icons/*", serveStatic({ root: publicDir }));
app.use("/manifest.json", serveStatic({ root: publicDir }));
app.use("/robots.txt", serveStatic({ root: publicDir }));
app.use("/sitemap.xml", serveStatic({ root: publicDir }));
app.use("/sw.js", serveStatic({ root: publicDir }));

// Migration endpoint - no-op with json-store
app.get("/api/migrate", async (c) => {
  return c.json({ ok: true, message: "Using json-store, no migration needed" });
});

// tRPC API handler
app.all("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});

// SPA fallback: serve index.html for ALL other routes
app.get("/*", (c) => {
  try {
    if (existsSync(indexPath)) {
      const html = readFileSync(indexPath, "utf-8");
      return c.html(html);
    }
    return c.text("Melli Melos - index.html not found", 500);
  } catch (e) {
    return c.text(`Error: ${e instanceof Error ? e.message : "unknown"}`, 500);
  }
});

serve({ fetch: app.fetch, port }, () => {
  console.log(`Melli Melos running on port ${port}, serving from ${publicDir}`);
});

export default app;
