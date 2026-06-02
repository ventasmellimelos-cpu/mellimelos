import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const createRouter = t.router;

/** Public procedure: open to anyone (catalog reads, checkout). */
export const publicQuery = t.procedure;

/** Admin-only: requires a valid Bearer token (verified in context). */
export const adminProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.isAdmin) throw new TRPCError({ code: "UNAUTHORIZED" });
  return next();
});
