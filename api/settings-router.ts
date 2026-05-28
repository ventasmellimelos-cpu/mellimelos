import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getSettings, getSettingByKey, setSetting } from "./json-store";

export const settingsRouter = createRouter({
  getAll: publicQuery.query(async () => {
    return getSettings();
  }),

  get: publicQuery
    .input(z.object({ key: z.string() }))
    .query(async ({ input }) => {
      return getSettingByKey(input.key);
    }),

  set: publicQuery
    .input(z.object({ key: z.string(), value: z.string() }))
    .mutation(async ({ input }) => {
      setSetting(input.key, input.value);
      return { success: true };
    }),

  setMany: publicQuery
    .input(z.record(z.string(), z.string()))
    .mutation(async ({ input }) => {
      for (const [key, value] of Object.entries(input)) {
        setSetting(key, String(value));
      }
      return { success: true };
    }),
});
