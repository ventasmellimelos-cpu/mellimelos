import { createHmac, timingSafeEqual, randomBytes } from "node:crypto";
import { env } from "./env";

// Stateless admin auth: an HMAC-signed token with an expiry. No session store,
// no extra dependencies. The signing key is APP_SECRET (server-only).

const TTL_MS = 1000 * 60 * 60 * 8; // 8 hours

function sign(payload: string): string {
  return createHmac("sha256", env.appSecret).update(payload).digest("base64url");
}

/** token = base64url(json{exp,nonce}).hmacSignature */
export function issueToken(): string {
  const body = { exp: Date.now() + TTL_MS, nonce: randomBytes(12).toString("hex") };
  const payload = Buffer.from(JSON.stringify(body)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifyToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;

  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

  try {
    const body = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof body.exp === "number" && body.exp > Date.now();
  } catch {
    return false;
  }
}

/** Timing-safe password comparison against the server-side ADMIN_PASSWORD. */
export function checkPassword(input: string): boolean {
  const a = Buffer.from(input);
  const b = Buffer.from(env.adminPassword);
  if (a.length !== b.length) {
    // compare equal-length buffers anyway to avoid leaking length via timing
    timingSafeEqual(b, b);
    return false;
  }
  return timingSafeEqual(a, b);
}

/** Extract a Bearer token from a Hono context's Authorization header. */
export function getBearer(c: { req: { header: (k: string) => string | undefined } }): string | undefined {
  const h = c.req.header("authorization");
  return h?.startsWith("Bearer ") ? h.slice(7) : undefined;
}
