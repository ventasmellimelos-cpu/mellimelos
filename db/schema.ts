import {
  mysqlTable,
  serial,
  varchar,
  text,
  timestamp,
  decimal,
  json,
  boolean,
  int,
  mysqlEnum,
} from "drizzle-orm/mysql-core";

export const products = mysqlTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  salePrice: decimal("sale_price", { precision: 10, scale: 2 }),
  imageUrl: varchar("image_url", { length: 500 }),
  category: mysqlEnum("category", ["bodies", "conjuntos", "accesorios", "regalo"]).notNull(),
  sizes: json("sizes").$type<string[]>(),
  isFeatured: boolean("is_featured").default(false),
  isNew: boolean("is_new").default(false),
  isBestseller: boolean("is_bestseller").default(false),
  stock: int("stock").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orders = mysqlTable("orders", {
  id: serial("id").primaryKey(),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 50 }).notNull(),
  customerEmail: varchar("customer_email", { length: 255 }),
  items: json("items").$type<{ productId: number; name: string; size: string; price: number; quantity: number }[]>().notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["pending", "confirmed", "shipped", "delivered"]).default("pending"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
