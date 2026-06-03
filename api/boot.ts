import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync, existsSync } from "fs";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { ensureSchema, getUploadById, createUpload, seedIfEmpty } from "./json-store";
import { checkPassword, issueToken, verifyToken, getBearer } from "./lib/auth";
import restApi from "./rest-router";

// Initialize DB schema and seed on startup (idempotent, persistent in Postgres)
(async () => {
  try {
    await ensureSchema();
    await seedIfEmpty();
  } catch (e) {
    console.error("[db] init failed:", e);
  }
})();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = join(__dirname, "..", "dist", "public");
const indexPath = join(publicDir, "index.html");

const app = new Hono();
const port = parseInt(process.env.PORT || "3000");

// Canonical host. Redirect page views on the old *.railway.app domain to the
// custom domain (301) so Google consolidates ranking on one URL and visitors
// land on the branded domain. Only HTML page navigations are redirected —
// health checks, API, assets and uploads are never touched, so Railway's
// internal checks and same-origin asset loads keep working.
const CANONICAL_HOST = "www.mellimelos.site";
app.use("*", async (c, next) => {
  const host = c.req.header("host") ?? "";
  if (host.endsWith(".railway.app")) {
    const accept = c.req.header("accept") ?? "";
    const path = c.req.path;
    const isHtmlNav = c.req.method === "GET" && accept.includes("text/html") && !path.startsWith("/api");
    if (isHtmlNav) {
      const url = new URL(c.req.url);
      return c.redirect(`https://${CANONICAL_HOST}${url.pathname}${url.search}`, 301);
    }
  }
  await next();
});

// Admin guard for write/PII endpoints (catalog reads stay public).
const requireAdmin = async (c: any, next: () => Promise<void>) => {
  if (!verifyToken(getBearer(c))) return c.json({ error: "Unauthorized" }, 401);
  await next();
};

// Health check
app.get("/api/trpc/ping", (c) => c.json({ ok: true, ts: Date.now() }));
app.get("/api/ping", (c) => c.json({ ok: true, ts: Date.now() }));
app.get("/health", (c) => c.json({ ok: true }));

// Admin login: validates the server-side password, returns a signed token.
app.post("/api/admin/login", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const password = String((body as { password?: unknown })?.password ?? "");
  if (!checkPassword(password)) {
    return c.json({ error: "Credenciales inválidas" }, 401);
  }
  return c.json({ token: issueToken() });
});

// Serve uploaded images directly from db
app.get("/uploads/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid upload ID", 400);

    const upload = await getUploadById(id);
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

// Fast upload endpoint - accepts FormData directly (admin only)
app.post("/api/upload", requireAdmin, async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file") as File | null;

    if (!file) return c.json({ error: "No file provided" }, 400);

    const validTypes = ["image/png", "image/jpeg", "image/webp", "video/mp4", "video/webm", "video/quicktime"];
    if (!validTypes.includes(file.type)) {
      return c.json({ error: "Invalid file type. Use PNG, JPG, WEBP, MP4, WEBM, MOV" }, 400);
    }

    const maxSize = file.type.startsWith("video/") ? 20 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return c.json({ error: `File too large. Max ${maxSize / 1024 / 1024}MB` }, 400);
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    const upload = await createUpload({
      filename: file.name,
      mimeType: file.type,
      data: base64,
    });

    return c.json({
      id: upload.id,
      url: `/uploads/${upload.id}`,
      filename: upload.filename,
      mimeType: upload.mimeType,
    });
  } catch (e) {
    console.error("Upload error:", e);
    return c.json({ error: e instanceof Error ? e.message : "Upload failed" }, 500);
  }
});

// Serve static files
app.use("/assets/*", serveStatic({ root: publicDir }));
app.use("/images/*", serveStatic({ root: publicDir }));
app.use("/icons/*", serveStatic({ root: publicDir }));
app.use("/manifest.json", serveStatic({ root: publicDir }));
app.use("/robots.txt", serveStatic({ root: publicDir }));
app.use("/sitemap.xml", serveStatic({ root: publicDir }));
app.use("/sw.js", serveStatic({ root: publicDir }));

// Google Search Console verification (HTML file method). The SPA fallback would
// otherwise serve index.html for this path; we return the exact content Google
// expects so the file-based verification passes.
app.get("/googlef1998b4e5cab36b9.html", (c) =>
  c.text("google-site-verification: googlef1998b4e5cab36b9.html")
);

// REST API
app.route("/api", restApi);

// Seed endpoint - force re-seed (no-op if already populated) — admin only
app.get("/api/seed", requireAdmin, async (c) => {
  try {
    await seedIfEmpty();
    return c.json({ ok: true, message: "Seed checked" });
  } catch (e) {
    return c.json({ ok: false, error: e instanceof Error ? e.message : String(e) }, 500);
  }
});

// Migration endpoint — admin only
app.get("/api/migrate", requireAdmin, async (c) => {
  try {
    await ensureSchema();
    return c.json({ ok: true, message: "Schema ensured" });
  } catch (e) {
    return c.json({ ok: false, error: e instanceof Error ? e.message : String(e) }, 500);
  }
});

// tRPC API handler
app.all("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
    allowBatching: true,
    allowMethodOverride: true,
  });
});

// SPA fallback
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
