import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import type { HttpBindings } from "@hono/node-server";
import { env } from "./lib/env";

const app = new Hono<{ Bindings: HttpBindings }>();

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));

// Health check - always responds, even without database
app.get("/api/trpc/ping", (c) => c.json({ ok: true, ts: Date.now() }));
app.get("/api/ping", (c) => c.json({ ok: true, ts: Date.now() }));

// Only load backend if DATABASE_URL is available
if (env.databaseUrl && env.databaseUrl !== "placeholder") {
  try {
    const { fetchRequestHandler } = await import("@trpc/server/adapters/fetch");
    const { appRouter } = await import("./router");
    const { createContext } = await import("./context");

    app.use("/api/trpc/*", async (c) => {
      return fetchRequestHandler({
        endpoint: "/api/trpc",
        req: c.req.raw,
        router: appRouter,
        createContext,
      });
    });
    console.log("Backend loaded with database support");
  } catch (e) {
    console.warn("Backend failed to load, serving static only:", e);
  }
}

app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

export default app;

if (env.isProduction) {
  const { serve } = await import("@hono/node-server");
  const { serveStaticFiles } = await import("./lib/vite");
  serveStaticFiles(app);

  const port = parseInt(process.env.PORT || "3000");
  serve({ fetch: app.fetch, port }, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
