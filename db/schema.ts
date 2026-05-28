import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  decimal,
  json,
  boolean,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";

export const categoryEnum = pgEnum("category", ["bodies", "conjuntos", "accesorios", "regalo"]);
export const statusEnum = pgEnum("status", ["pending", "confirmed", "shipped", "delivered"]);

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  salePrice: decimal("sale_price", { precision: 10, scale: 2 }),
  // Legacy: keep for backward compat, new products use 'images' array
  imageUrl: varchar("image_url", { length: 500 }),
  // New: array of image URLs (up to 10)
  images: json("images").$type<string[]>(),
  // New: video URL
  videoUrl: varchar("video_url", { length: 500 }),
  category: categoryEnum("category").notNull(),
  sizes: json("sizes").$type<string[]>(),
  // New: available colors
  colors: json("colors").$type<string[]>(),
  isFeatured: boolean("is_featured").default(false),
  isNew: boolean("is_new").default(false),
  isBestseller: boolean("is_bestseller").default(false),
  stock: integer("stock").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// New: product variants (color + size combinations with individual stock)
export const productVariants = pgTable("product_variants", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  color: varchar("color", { length: 100 }).notNull(),
  colorHex: varchar("color_hex", { length: 20 }),
  size: varchar("size", { length: 50 }).notNull(),
  stock: integer("stock").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 50 }).notNull(),
  customerEmail: varchar("customer_email", { length: 255 }),
  items: json("items").$type<{
    productId: number;
    name: string;
    color: string;
    size: string;
    price: number;
    quantity: number;
  }[]>().notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: statusEnum("status").default("pending"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const uploads = pgTable("uploads", {
  id: serial("id").primaryKey(),
  filename: varchar("filename", { length: 255 }).notNull(),
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  data: text("data").notNull(), // base64 encoded data
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
