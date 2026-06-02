import { z } from "zod";
import { createRouter, publicQuery, adminProcedure } from "./middleware";
import { getSettings, getSettingByKey, setSetting } from "./json-store";

export const settingsRouter = createRouter({
  getAll: publicQuery.query(async () => {
    return await getSettings();
  }),

  get: publicQuery
    .input(z.object({ key: z.string() }))
    .query(async ({ input }) => {
      return await getSettingByKey(input.key);
    }),

  set: adminProcedure
    .input(z.object({ key: z.string(), value: z.string() }))
    .mutation(async ({ input }) => {
      await setSetting(input.key, input.value);
      return { success: true };
    }),

  setMany: adminProcedure
    .input(z.record(z.string(), z.string()))
    .mutation(async ({ input }) => {
      for (const [key, value] of Object.entries(input)) {
        await setSetting(key, String(value));
      }
      return { success: true };
    }),
});
