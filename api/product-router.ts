import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { products } from "@db/schema";
import { eq, and, desc, asc, like, sql } from "drizzle-orm";

export const productRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        category: z.enum(["bodies", "conjuntos", "accesorios", "regalo"]).optional(),
        search: z.string().optional(),
        sort: z.enum(["price_asc", "price_desc", "newest", "bestseller"]).optional(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(50).default(12),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const filters = [];
      
      if (input?.category) {
        filters.push(eq(products.category, input.category));
      }
      
      if (input?.search) {
        filters.push(like(products.name, `%${input.search}%`));
      }

      const where = filters.length > 0 ? and(...filters) : undefined;

      let orderBy;
      switch (input?.sort) {
        case "price_asc":
          orderBy = asc(products.price);
          break;
        case "price_desc":
          orderBy = desc(products.price);
          break;
        case "bestseller":
          orderBy = desc(products.isBestseller);
          break;
        default:
          orderBy = desc(products.createdAt);
      }

      const offset = ((input?.page ?? 1) - 1) * (input?.limit ?? 12);

      const [items, countResult] = await Promise.all([
        db
          .select()
          .from(products)
          .where(where)
          .orderBy(orderBy)
          .limit(input?.limit ?? 12)
          .offset(offset),
        db
          .select({ count: sql<number>`count(*)` })
          .from(products)
          .where(where),
      ]);

      return {
        items,
        total: countResult[0]?.count ?? 0,
        page: input?.page ?? 1,
        totalPages: Math.ceil((countResult[0]?.count ?? 0) / (input?.limit ?? 12)),
      };
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(products)
        .where(eq(products.id, input.id));
      return result[0] ?? null;
    }),

  featured: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(products)
      .where(eq(products.isFeatured, true))
      .limit(6);
  }),
});
