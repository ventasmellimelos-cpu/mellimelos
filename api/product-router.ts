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

  create: publicQuery
    .input(z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      price: z.number().positive(),
      salePrice: z.number().positive().optional(),
      imageUrl: z.string().optional(),
      category: z.enum(["bodies", "conjuntos", "accesorios", "regalo"]),
      sizes: z.array(z.string()).optional(),
      isFeatured: z.boolean().optional(),
      isNew: z.boolean().optional(),
      isBestseller: z.boolean().optional(),
      stock: z.number().int().min(0).optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(products).values({
        name: input.name,
        description: input.description,
        price: String(input.price),
        salePrice: input.salePrice ? String(input.salePrice) : null,
        imageUrl: input.imageUrl,
        category: input.category,
        sizes: input.sizes ?? ["0-3m", "3-6m", "6-9m"],
        isFeatured: input.isFeatured ?? false,
        isNew: input.isNew ?? false,
        isBestseller: input.isBestseller ?? false,
        stock: input.stock ?? 0,
      }).returning({ id: products.id });
      return { success: true, id: result[0]?.id };
    }),

  update: publicQuery
    .input(z.object({
      id: z.number(),
      name: z.string().min(1),
      description: z.string().optional(),
      price: z.number().positive(),
      salePrice: z.number().positive().optional(),
      imageUrl: z.string().optional(),
      category: z.enum(["bodies", "conjuntos", "accesorios", "regalo"]),
      sizes: z.array(z.string()).optional(),
      isFeatured: z.boolean().optional(),
      isNew: z.boolean().optional(),
      isBestseller: z.boolean().optional(),
      stock: z.number().int().min(0).optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(products).set({
        name: data.name,
        description: data.description,
        price: String(data.price),
        salePrice: data.salePrice ? String(data.salePrice) : null,
        imageUrl: data.imageUrl,
        category: data.category,
        sizes: data.sizes ?? ["0-3m", "3-6m", "6-9m"],
        isFeatured: data.isFeatured ?? false,
        isNew: data.isNew ?? false,
        isBestseller: data.isBestseller ?? false,
        stock: data.stock ?? 0,
      }).where(eq(products.id, id));
      return { success: true };
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(products).where(eq(products.id, input.id));
      return { success: true };
    }),
});
