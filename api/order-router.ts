import { z } from "zod";
import { createRouter, publicQuery, adminProcedure } from "./middleware";
import { getOrders, createOrder, updateOrderStatus } from "./json-store";

export const orderRouter = createRouter({
  list: adminProcedure
    .input(
      z.object({
        status: z.enum(["pending", "confirmed", "shipped", "delivered"]).optional(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(50).default(20),
      }).optional()
    )
    .query(async ({ input }) => {
      let items = await getOrders();
      if (input?.status) {
        items = items.filter((o) => o.status === input.status);
      }
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      const total = items.length;
      const offset = ((input?.page ?? 1) - 1) * (input?.limit ?? 20);
      return { items: items.slice(offset, offset + (input?.limit ?? 20)), total };
    }),

  create: publicQuery
    .input(
      z.object({
        customerName: z.string().min(1),
        customerPhone: z.string().min(1),
        customerEmail: z.string().optional(),
        items: z.array(
          z.object({
            productId: z.number(),
            name: z.string(),
            color: z.string(),
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
      const order = await createOrder({
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        customerEmail: input.customerEmail,
        items: input.items,
        totalAmount: String(input.totalAmount),
        status: "pending",
        notes: input.notes,
      });
      return order;
    }),

  updateStatus: adminProcedure
    .input(z.object({ id: z.number(), status: z.enum(["pending", "confirmed", "shipped", "delivered"]) }))
    .mutation(async ({ input }) => {
      await updateOrderStatus(input.id, input.status);
      return { success: true };
    }),
});
