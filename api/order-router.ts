import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { orders } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const orderRouter = createRouter({
  create: publicQuery
    .input(
      z.object({
        customerName: z.string().min(1),
        customerPhone: z.string().min(1),
        customerEmail: z.string().email().optional(),
        items: z.array(
          z.object({
            productId: z.number(),
            name: z.string(),
            size: z.string(),
            price: z.number(),
            quantity: z.number().min(1),
          })
        ),
        totalAmount: z.number().positive(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(orders).values({
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        customerEmail: input.customerEmail,
        items: input.items,
        totalAmount: String(input.totalAmount),
        status: "pending",
        notes: input.notes,
      }).returning({ id: orders.id });
      return { success: true, orderId: result[0]?.id ?? 0 };
    }),

  getByPhone: publicQuery
    .input(z.object({ phone: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(orders)
        .where(eq(orders.customerPhone, input.phone))
        .orderBy(desc(orders.createdAt));
    }),

  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(orders).orderBy(desc(orders.createdAt));
  }),

  updateStatus: publicQuery
    .input(z.object({
      id: z.number(),
      status: z.enum(["pending", "confirmed", "shipped", "delivered"]),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(orders).set({ status: input.status }).where(eq(orders.id, input.id));
      return { success: true };
    }),
});
