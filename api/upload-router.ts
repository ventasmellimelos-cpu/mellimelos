import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { createUpload, getUploadById } from "./json-store";

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
      const upload = createUpload({
        filename: input.filename,
        mimeType: input.mimeType,
        data: input.data,
      });

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
      const upload = getUploadById(input.id);
      if (!upload) throw new Error("Upload not found");
      return upload;
    }),
});
