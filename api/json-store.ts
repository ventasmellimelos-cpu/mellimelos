// Storage backed by Postgres (persistent on Railway).
// Same module name kept for backward compatibility with existing callers.
import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import * as schema from "@db/schema";
import { products, productVariants, orders, settings, uploads } from "@db/schema";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is required. Add a Postgres service in Railway and set DATABASE_URL env var."
  );
}

const sqlClient = postgres(DATABASE_URL, { max: 5, prepare: false });
const db = drizzle(sqlClient, { schema });

// Idempotent schema creation - safe to run on every boot.
let schemaReady: Promise<void> | null = null;
export function ensureSchema(): Promise<void> {
  if (schemaReady) return schemaReady;
  schemaReady = (async () => {
    await sqlClient.unsafe(`
      DO $$ BEGIN
        CREATE TYPE category AS ENUM ('bodies', 'conjuntos', 'accesorios', 'regalo');
      EXCEPTION WHEN duplicate_object THEN null; END $$;

      DO $$ BEGIN
        CREATE TYPE status AS ENUM ('pending', 'confirmed', 'shipped', 'delivered');
      EXCEPTION WHEN duplicate_object THEN null; END $$;

      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        sale_price DECIMAL(10, 2),
        image_url VARCHAR(500),
        images JSON,
        video_url VARCHAR(500),
        category category NOT NULL,
        sizes JSON,
        colors JSON,
        is_featured BOOLEAN DEFAULT false,
        is_new BOOLEAN DEFAULT false,
        is_bestseller BOOLEAN DEFAULT false,
        stock INTEGER DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS product_variants (
        id SERIAL PRIMARY KEY,
        product_id INTEGER NOT NULL,
        color VARCHAR(100) NOT NULL,
        color_hex VARCHAR(20),
        size VARCHAR(50) NOT NULL,
        stock INTEGER DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(50) NOT NULL,
        customer_email VARCHAR(255),
        items JSON NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        status status DEFAULT 'pending',
        notes TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        key VARCHAR(100) NOT NULL UNIQUE,
        value TEXT NOT NULL,
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS uploads (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        data TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    console.log("[db] schema ready");
  })();
  return schemaReady;
}

// Drizzle rows already use camelCase keys (mapped from snake_case columns via schema).
// Keep return shapes identical to the previous json-store implementation.

// ============ Products ============
export async function getProducts(): Promise<any[]> {
  await ensureSchema();
  return await db.select().from(products);
}

export async function getProductById(id: number): Promise<any | null> {
  await ensureSchema();
  const rows = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function createProduct(data: any): Promise<any> {
  await ensureSchema();
  const rows = await db
    .insert(products)
    .values({
      name: data.name,
      description: data.description ?? null,
      price: String(data.price),
      salePrice: data.salePrice ? String(data.salePrice) : null,
      imageUrl: data.imageUrl ?? null,
      images: data.images ?? [],
      videoUrl: data.videoUrl ?? null,
      category: data.category,
      sizes: data.sizes ?? ["0-3m", "3-6m", "6-9m"],
      colors: data.colors ?? [],
      isFeatured: data.isFeatured ?? false,
      isNew: data.isNew ?? false,
      isBestseller: data.isBestseller ?? false,
      stock: data.stock ?? 0,
    })
    .returning();
  return rows[0];
}

export async function updateProduct(id: number, data: any): Promise<boolean> {
  await ensureSchema();
  const result = await db
    .update(products)
    .set({
      name: data.name,
      description: data.description ?? null,
      price: String(data.price),
      salePrice: data.salePrice ? String(data.salePrice) : null,
      imageUrl: data.imageUrl ?? null,
      images: data.images ?? [],
      videoUrl: data.videoUrl ?? null,
      category: data.category,
      sizes: data.sizes ?? ["0-3m", "3-6m", "6-9m"],
      colors: data.colors ?? [],
      isFeatured: data.isFeatured ?? false,
      isNew: data.isNew ?? false,
      isBestseller: data.isBestseller ?? false,
      stock: data.stock ?? 0,
    })
    .where(eq(products.id, id))
    .returning({ id: products.id });
  return result.length > 0;
}

export async function deleteProduct(id: number): Promise<boolean> {
  await ensureSchema();
  await db.delete(productVariants).where(eq(productVariants.productId, id));
  const result = await db.delete(products).where(eq(products.id, id)).returning({ id: products.id });
  return result.length > 0;
}

// ============ Product Variants ============
export async function getVariantsByProductId(productId: number): Promise<any[]> {
  await ensureSchema();
  return await db.select().from(productVariants).where(eq(productVariants.productId, productId));
}

export async function createVariants(variants: any[]): Promise<any[]> {
  if (variants.length === 0) return [];
  await ensureSchema();
  return await db.insert(productVariants).values(
    variants.map((v) => ({
      productId: v.productId,
      color: v.color,
      colorHex: v.colorHex ?? null,
      size: v.size,
      stock: v.stock ?? 0,
    }))
  ).returning();
}

export async function deleteVariantsByProductId(productId: number): Promise<void> {
  await ensureSchema();
  await db.delete(productVariants).where(eq(productVariants.productId, productId));
}

// ============ Orders ============
export async function getOrders(): Promise<any[]> {
  await ensureSchema();
  return await db.select().from(orders);
}

export async function createOrder(data: any): Promise<any> {
  await ensureSchema();
  const rows = await db
    .insert(orders)
    .values({
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail ?? null,
      items: data.items,
      totalAmount: String(data.totalAmount),
      status: data.status ?? "pending",
      notes: data.notes ?? null,
    })
    .returning();
  return rows[0];
}

export async function updateOrderStatus(id: number, status: string): Promise<boolean> {
  await ensureSchema();
  const result = await db
    .update(orders)
    .set({ status: status as any, updatedAt: new Date() })
    .where(eq(orders.id, id))
    .returning({ id: orders.id });
  return result.length > 0;
}

// ============ Settings ============
export async function getSettings(): Promise<any[]> {
  await ensureSchema();
  return await db.select().from(settings);
}

export async function getSettingByKey(key: string): Promise<any | null> {
  await ensureSchema();
  const rows = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
  return rows[0] ?? null;
}

export async function setSetting(key: string, value: string): Promise<void> {
  await ensureSchema();
  const existing = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
  if (existing.length > 0) {
    await db.update(settings).set({ value, updatedAt: new Date() }).where(eq(settings.key, key));
  } else {
    await db.insert(settings).values({ key, value });
  }
}

// ============ Uploads ============
export async function createUpload(data: { filename: string; mimeType: string; data: string }): Promise<any> {
  await ensureSchema();
  const rows = await db
    .insert(uploads)
    .values({
      filename: data.filename,
      mimeType: data.mimeType,
      data: data.data,
    })
    .returning();
  return rows[0];
}

export async function getUploadById(id: number): Promise<any | null> {
  await ensureSchema();
  const rows = await db.select().from(uploads).where(eq(uploads.id, id)).limit(1);
  return rows[0] ?? null;
}

// ============ Seed ============
export async function seedIfEmpty(): Promise<void> {
  await ensureSchema();
  const existing = await db.select({ id: products.id }).from(products).limit(1);
  if (existing.length > 0) return;

  console.log("[db] seeding initial products...");
  const seedProducts = [
    { name: "Body Manga Larga Premium", description: "Body de algodón orgánico 100% con mangas largas.", price: "49990.00", salePrice: "39990.00", images: ["/images/products/product-1.jpg"], category: "bodies" as const, sizes: ["0-3m","3-6m","6-9m"], colors: ["Blanco","Rosa","Celeste"], isFeatured: true, isNew: true, isBestseller: true, stock: 25 },
    { name: "Buzo Polar con Pie", description: "Buzo polar ultra suave con pie integrado.", price: "69990.00", salePrice: "48990.00", images: ["/images/products/product-2.jpg"], category: "conjuntos" as const, sizes: ["0-3m","3-6m","6-9m"], colors: ["Blanco","Rosa","Gris"], isFeatured: true, isNew: false, isBestseller: true, stock: 18 },
    { name: "Conjunto Tejido Sage", description: "Saquito tejido a mano y pantalón.", price: "79990.00", salePrice: "55990.00", images: ["/images/products/product-3.jpg"], category: "conjuntos" as const, sizes: ["0-3m","3-6m","6-9m"], colors: ["Blanco","Celeste"], isFeatured: true, isNew: true, isBestseller: false, stock: 12 },
    { name: "Set Gorro y Manoplas", description: "Set en color peach.", price: "34990.00", salePrice: "27990.00", images: ["/images/products/product-4.jpg"], category: "accesorios" as const, sizes: ["0-3m","3-6m"], colors: ["Rosa","Celeste"], isFeatured: true, isNew: false, isBestseller: true, stock: 30 },
    { name: "Body Nubes Mint", description: "Body con estampado de nubes.", price: "49990.00", salePrice: "39990.00", images: ["/images/products/product-5.jpg"], category: "bodies" as const, sizes: ["0-3m","3-6m","6-9m"], colors: ["Celeste","Gris"], isFeatured: true, isNew: false, isBestseller: false, stock: 20 },
    { name: "Manta Waffle Premium", description: "Manta textura waffle crema.", price: "54990.00", salePrice: "38490.00", images: ["/images/products/product-6.jpg"], category: "accesorios" as const, sizes: ["UNICO"], colors: ["Blanco"], isFeatured: true, isNew: true, isBestseller: false, stock: 15 },
  ];

  const colorHexes: Record<string, string> = { "Blanco": "#FFFFFF", "Rosa": "#F8E1E4", "Celeste": "#B8D4E3", "Gris": "#D0D0D0" };
  for (const p of seedProducts) {
    const inserted = await createProduct(p);
    const variantRows: any[] = [];
    for (const color of p.colors) {
      for (const size of p.sizes) {
        variantRows.push({ productId: inserted.id, color, colorHex: colorHexes[color] || "#E8E8E8", size, stock: Math.floor(Math.random() * 15) + 5 });
      }
    }
    if (variantRows.length > 0) await createVariants(variantRows);
  }
  console.log(`[db] seeded ${seedProducts.length} products`);
}
