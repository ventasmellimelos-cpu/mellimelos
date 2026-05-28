import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { uploads } from "../db/schema";
import { eq } from "drizzle-orm";

export const uploadRouter = createRouter({
  create: publicQuery
    .input(
      z.object({
        filename: z.string().min(1),
        mimeType: z.string().min(1),
        data: z.string().min(1), // base64 encoded image
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const [upload] = await db
        .insert(uploads)
        .values({
          filename: input.filename,
          mimeType: input.mimeType,
          data: input.data,
        })
        .returning();

      return {
        id: upload.id,
        url: `/uploads/${upload.id}`,
        filename: upload.filename,
        mimeType: upload.mimeType,
      };
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [upload] = await db
        .select()
        .from(uploads)
        .where(eq(uploads.id, input.id))
        .limit(1);

      if (!upload) throw new Error("Upload not found");

      return upload;
    }),
});
