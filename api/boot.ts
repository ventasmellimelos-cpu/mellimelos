import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync, existsSync } from "fs";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { getDb } from "./queries/connection";
import { uploads } from "../db/schema";
import { eq, sql } from "drizzle-orm";
import postgres from "postgres";
import { env } from "./lib/env";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = join(__dirname, "..", "dist", "public");
const indexPath = join(publicDir, "index.html");

const app = new Hono();
const port = parseInt(process.env.PORT || "3000");

// Health check
app.get("/api/trpc/ping", (c) => c.json({ ok: true, ts: Date.now() }));
app.get("/api/ping", (c) => c.json({ ok: true, ts: Date.now() }));
app.get("/health", (c) => c.json({ ok: true }));

// Serve uploaded images directly from database
app.get("/uploads/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid upload ID", 400);

    const db = getDb();
    const [upload] = await db
      .select()
      .from(uploads)
      .where(eq(uploads.id, id))
      .limit(1);

    if (!upload) return c.text("Image not found", 404);

    // Decode base64 to binary
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

// Auto-migration: ensure schema is up to date
async function runMigrations() {
  try {
    const client = postgres(env.databaseUrl);
    // Add new columns to products if they don't exist
    await client`ALTER TABLE products ADD COLUMN IF NOT EXISTS images json`.catch(() => null);
    await client`ALTER TABLE products ADD COLUMN IF NOT EXISTS video_url varchar(500)`.catch(() => null);
    await client`ALTER TABLE products ADD COLUMN IF NOT EXISTS colors json`.catch(() => null);
    // Create product_variants table if it doesn't exist
    await client`
      CREATE TABLE IF NOT EXISTS product_variants (
        id SERIAL PRIMARY KEY,
        product_id INTEGER NOT NULL,
        color VARCHAR(100) NOT NULL,
        color_hex VARCHAR(20),
        size VARCHAR(50) NOT NULL,
        stock INTEGER DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `.catch(() => null);
    // Create uploads table if it doesn't exist
    await client`
      CREATE TABLE IF NOT EXISTS uploads (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        data TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `.catch(() => null);
    await client.end();
    console.log("Migrations completed");
  } catch (e) {
    console.error("Migration error:", e);
  }
}

runMigrations().then(() => {
  serve({ fetch: app.fetch, port }, () => {
    console.log(`Melli Melos running on port ${port}, serving from ${publicDir}`);
  });
});

export default app;
