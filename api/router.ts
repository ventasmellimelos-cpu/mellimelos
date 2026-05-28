import { createRouter, publicQuery } from "./middleware";
import { productRouter } from "./product-router";
import { orderRouter } from "./order-router";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  product: productRouter,
  order: orderRouter,
});

export type AppRouter = typeof appRouter;
