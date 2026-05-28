import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { products, productVariants } from "@db/schema";
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

      // Fetch variants for all products
      const productIds = items.map((p) => p.id);
      let variants: typeof productVariants.$inferSelect[] = [];
      if (productIds.length > 0) {
        variants = await db
          .select()
          .from(productVariants)
          .where(sql`${productVariants.productId} IN (${sql.join(productIds.map(String))})`);
      }

      const itemsWithVariants = items.map((p) => ({
        ...p,
        variants: variants.filter((v) => v.productId === p.id),
      }));

      return {
        items: itemsWithVariants,
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
      const product = result[0] ?? null;

      if (!product) return null;

      const variants = await db
        .select()
        .from(productVariants)
        .where(eq(productVariants.productId, input.id));

      return { ...product, variants };
    }),

  featured: publicQuery.query(async () => {
    const db = getDb();
    const items = await db
      .select()
      .from(products)
      .where(eq(products.isFeatured, true))
      .limit(6);

    // Get variants
    const productIds = items.map((p) => p.id);
    let variants: typeof productVariants.$inferSelect[] = [];
    if (productIds.length > 0) {
      variants = await db
        .select()
        .from(productVariants)
        .where(sql`${productVariants.productId} IN (${sql.join(productIds.map(String))})`);
    }

    return items.map((p) => ({
      ...p,
      variants: variants.filter((v) => v.productId === p.id),
    }));
  }),

  create: publicQuery
    .input(z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      price: z.number().positive(),
      salePrice: z.number().positive().optional(),
      images: z.array(z.string()).max(10).optional(),
      videoUrl: z.string().optional(),
      category: z.enum(["bodies", "conjuntos", "accesorios", "regalo"]),
      sizes: z.array(z.string()).optional(),
      colors: z.array(z.string()).optional(),
      isFeatured: z.boolean().optional(),
      isNew: z.boolean().optional(),
      isBestseller: z.boolean().optional(),
      stock: z.number().int().min(0).optional(),
      variants: z.array(z.object({
        color: z.string(),
        colorHex: z.string().optional(),
        size: z.string(),
        stock: z.number().int().min(0),
      })).optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();

      // Insert product
      const [product] = await db.insert(products).values({
        name: input.name,
        description: input.description,
        price: String(input.price),
        salePrice: input.salePrice ? String(input.salePrice) : null,
        images: input.images ?? [],
        videoUrl: input.videoUrl,
        category: input.category,
        sizes: input.sizes ?? ["0-3m", "3-6m", "6-9m"],
        colors: input.colors ?? [],
        isFeatured: input.isFeatured ?? false,
        isNew: input.isNew ?? false,
        isBestseller: input.isBestseller ?? false,
        stock: input.stock ?? 0,
      }).returning({ id: products.id });

      const productId = product.id;

      // Insert variants if provided
      if (input.variants && input.variants.length > 0) {
        await db.insert(productVariants).values(
          input.variants.map((v) => ({
            productId,
            color: v.color,
            colorHex: v.colorHex,
            size: v.size,
            stock: v.stock,
          }))
        );
      }

      return { success: true, id: productId };
    }),

  update: publicQuery
    .input(z.object({
      id: z.number(),
      name: z.string().min(1),
      description: z.string().optional(),
      price: z.number().positive(),
      salePrice: z.number().positive().optional(),
      images: z.array(z.string()).max(10).optional(),
      videoUrl: z.string().optional(),
      category: z.enum(["bodies", "conjuntos", "accesorios", "regalo"]),
      sizes: z.array(z.string()).optional(),
      colors: z.array(z.string()).optional(),
      isFeatured: z.boolean().optional(),
      isNew: z.boolean().optional(),
      isBestseller: z.boolean().optional(),
      stock: z.number().int().min(0).optional(),
      variants: z.array(z.object({
        color: z.string(),
        colorHex: z.string().optional(),
        size: z.string(),
        stock: z.number().int().min(0),
      })).optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, variants, ...data } = input;

      await db.update(products).set({
        name: data.name,
        description: data.description,
        price: String(data.price),
        salePrice: data.salePrice ? String(data.salePrice) : null,
        images: data.images ?? [],
        videoUrl: data.videoUrl,
        category: data.category,
        sizes: data.sizes ?? ["0-3m", "3-6m", "6-9m"],
        colors: data.colors ?? [],
        isFeatured: data.isFeatured ?? false,
        isNew: data.isNew ?? false,
        isBestseller: data.isBestseller ?? false,
        stock: data.stock ?? 0,
      }).where(eq(products.id, id));

      // Update variants: delete old, insert new
      if (variants !== undefined) {
        await db.delete(productVariants).where(eq(productVariants.productId, id));
        if (variants.length > 0) {
          await db.insert(productVariants).values(
            variants.map((v) => ({
              productId: id,
              color: v.color,
              colorHex: v.colorHex,
              size: v.size,
              stock: v.stock,
            }))
          );
        }
      }

      return { success: true };
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      // Delete variants first (no FK cascade in this setup)
      await db.delete(productVariants).where(eq(productVariants.productId, input.id));
      await db.delete(products).where(eq(products.id, input.id));
      return { success: true };
    }),
});
