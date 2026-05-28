import { createRouter, publicQuery } from "./middleware";
import { productRouter } from "./product-router";
import { orderRouter } from "./order-router";
import { settingsRouter } from "./settings-router";
import { uploadRouter } from "./upload-router";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  product: productRouter,
  order: orderRouter,
  settings: settingsRouter,
  upload: uploadRouter,
});

export type AppRouter = typeof appRouter;
