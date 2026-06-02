import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { verifyToken } from "./lib/auth";

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  isAdmin: boolean;
};

export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<TrpcContext> {
  const auth = opts.req.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  return { req: opts.req, resHeaders: opts.resHeaders, isAdmin: verifyToken(token) };
}
