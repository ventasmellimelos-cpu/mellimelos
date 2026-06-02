import { z } from "zod";
import { createRouter, publicQuery, adminProcedure } from "./middleware";
import {
  getProducts, getProductById, createProduct, updateProduct, deleteProduct,
  getVariantsByProductId, createVariants, deleteVariantsByProductId,
} from "./json-store";

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
      let items = await getProducts();

      if (input?.category) {
        items = items.filter((p) => p.category === input.category);
      }
      if (input?.search) {
        const search = input.search;
        items = items.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
      }

      switch (input?.sort) {
        case "price_asc":
          items.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
          break;
        case "price_desc":
          items.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
          break;
        case "bestseller":
          items.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
          break;
        default:
          items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }

      const total = items.length;
      const offset = ((input?.page ?? 1) - 1) * (input?.limit ?? 12);
      const paginated = items.slice(offset, offset + (input?.limit ?? 12));

      const itemsWithVariants = await Promise.all(
        paginated.map(async (p) => ({ ...p, variants: await getVariantsByProductId(p.id) }))
      );

      return {
        items: itemsWithVariants,
        total,
        page: input?.page ?? 1,
        totalPages: Math.ceil(total / (input?.limit ?? 12)),
      };
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const product = await getProductById(input.id);
      if (!product) return null;
      return { ...product, variants: await getVariantsByProductId(input.id) };
    }),

  featured: publicQuery.query(async () => {
    const all = await getProducts();
    const items = all.filter((p) => p.isFeatured);
    return await Promise.all(
      items.map(async (p) => ({ ...p, variants: await getVariantsByProductId(p.id) }))
    );
  }),

  create: adminProcedure
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
      const product = await createProduct({
        name: input.name,
        description: input.description,
        price: String(input.price),
        salePrice: input.salePrice ? String(input.salePrice) : null,
        images: input.images ?? [],
        videoUrl: input.videoUrl ?? null,
        category: input.category,
        sizes: input.sizes ?? ["0-3m", "3-6m", "6-9m"],
        colors: input.colors ?? [],
        isFeatured: input.isFeatured ?? false,
        isNew: input.isNew ?? false,
        isBestseller: input.isBestseller ?? false,
        stock: input.stock ?? 0,
      });

      if (input.variants && input.variants.length > 0) {
        await createVariants(input.variants.map((v) => ({ ...v, productId: product.id })));
      }

      return { success: true, id: product.id };
    }),

  update: adminProcedure
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
      const { id, variants, ...data } = input;

      await updateProduct(id, {
        name: data.name,
        description: data.description,
        price: String(data.price),
        salePrice: data.salePrice ? String(data.salePrice) : null,
        images: data.images ?? [],
        videoUrl: data.videoUrl ?? null,
        category: data.category,
        sizes: data.sizes ?? ["0-3m", "3-6m", "6-9m"],
        colors: data.colors ?? [],
        isFeatured: data.isFeatured ?? false,
        isNew: data.isNew ?? false,
        isBestseller: data.isBestseller ?? false,
        stock: data.stock ?? 0,
      });

      if (variants !== undefined) {
        await deleteVariantsByProductId(id);
        if (variants.length > 0) {
          await createVariants(variants.map((v) => ({ ...v, productId: id })));
        }
      }

      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deleteProduct(input.id);
      return { success: true };
    }),
});
