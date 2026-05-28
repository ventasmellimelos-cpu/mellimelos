import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { settings } from "@db/schema";
import { eq } from "drizzle-orm";

// Default settings - used when DB is not available
const DEFAULT_SETTINGS: Record<string, string> = {
  store_name: "Melli Melos",
  store_tagline: "La ropa más suave para tu bebé",
  store_description: "Somos una tienda familiar dedicada a la ropa de bebé. Cada prenda que elegimos está pensada para el confort y la delicadeza que los más chiquitos merecen.",
  store_story: "Trabajamos con materiales suaves, diseños prácticos y mucho amor. Estamos en Constancio Vigil 150, Carlos Spegazzini, Partido de Ezeiza, Buenos Aires. Hacemos envíos a todo el país. ¡Somos Mercado Líder Platinum y también vendemos en Max Gise!",
  address: "Constancio Vigil 150, Carlos Spegazzini, Partido de Ezeiza, Buenos Aires",
  phone: "+54 9 11 3484-8466",
  whatsapp: "5491134848466",
  email: "ventasmellimelos@gmail.com",
  instagram: "https://www.instagram.com/melli_melos/",
  facebook: "https://www.facebook.com/mellimelosropadebebes/",
  tiktok: "https://www.tiktok.com/@melli_melos",
  badge_text: "🏆 Mercado Líder Platinum | Envíos gratis en compras +$25.000 🚚💕",
  hero_title: "La ropa más suave para tu bebé",
  hero_subtitle: "Cada prenda está pensada con amor. Desde recién nacidos hasta 24 meses, en Carlos Spegazzini, Buenos Aires. Envíos a todo el país.",
  hero_cta_primary: "Ver colección",
  hero_cta_secondary: "Escribinos por WhatsApp",
  trust_badge_1_title: "Mercado Líder Platinum",
  trust_badge_1_desc: "Máxima confianza",
  trust_badge_2_title: "Envío gratis",
  trust_badge_2_desc: "En compras +$25.000",
  trust_badge_3_title: "Hecho con amor",
  trust_badge_3_desc: "Cada prenda especial",
  trust_badge_4_title: "Entrega rápida",
  trust_badge_4_desc: "2-5 días hábiles",
  featured_title: "Productos destacados",
  featured_subtitle: "Nuestros favoritos",
  about_title: "Conocé Melli Melos",
  about_story: "Somos una tienda familiar dedicada a la ropa de bebé. Cada prenda que elegimos está pensada para el confort y la delicadeza que los más chiquitos merecen.",
  about_features: "Ropa de 0 a 24 meses,Materiales hipoalergénicos,Envíos a todo Argentina",
  contact_title: "Contactanos",
  contact_subtitle: "Estamos para ayudarte",
  footer_cta_title: "¿Listo para consentir a tu bebé?",
  footer_cta_subtitle: "Escribinos por WhatsApp y te ayudamos con tu pedido personalizado.",
  footer_cta_button: "Escribir por WhatsApp",
  seo_title: "Melli Melos | Ropa de Bebé Premium | Envíos a Todo Argentina",
  seo_description: "Melli Melos - Tienda de ropa de bebé premium en Buenos Aires. Bodies, conjuntos, accesorios y sets de regalo. Envíos a todo el país. Mercado Líder Platinum.",
  analytics_id: "",
  theme_color: "#F8E1E4",
  free_shipping_threshold: "25000",
  currency: "ARS",
};

export const settingsRouter = createRouter({
  getAll: publicQuery.query(async () => {
    try {
      const db = getDb();
      const rows = await db.select().from(settings);
      const result: Record<string, string> = { ...DEFAULT_SETTINGS };
      for (const row of rows) {
        result[row.key] = row.value;
      }
      return result;
    } catch {
      return DEFAULT_SETTINGS;
    }
  }),

  get: publicQuery
    .input(z.object({ key: z.string() }))
    .query(async ({ input }) => {
      try {
        const db = getDb();
        const rows = await db.select().from(settings).where(eq(settings.key, input.key));
        return rows[0]?.value ?? DEFAULT_SETTINGS[input.key] ?? "";
      } catch {
        return DEFAULT_SETTINGS[input.key] ?? "";
      }
    }),

  set: publicQuery
    .input(z.object({ key: z.string(), value: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const db = getDb();
        const existing = await db.select().from(settings).where(eq(settings.key, input.key));
        if (existing.length > 0) {
          await db.update(settings).set({ value: input.value, updatedAt: new Date() }).where(eq(settings.key, input.key));
        } else {
          await db.insert(settings).values({ key: input.key, value: input.value });
        }
        return { success: true };
      } catch {
        return { success: false };
      }
    }),

  setMany: publicQuery
    .input(z.record(z.string(), z.string()))
    .mutation(async ({ input }) => {
      try {
        const db = getDb();
        for (const [key, value] of Object.entries(input)) {
          const existing = await db.select().from(settings).where(eq(settings.key, key));
          if (existing.length > 0) {
            await db.update(settings).set({ value, updatedAt: new Date() }).where(eq(settings.key, key));
          } else {
            await db.insert(settings).values({ key, value });
          }
        }
        return { success: true };
      } catch {
        return { success: false };
      }
    }),

  reset: publicQuery.mutation(async () => {
    try {
      const db = getDb();
      await db.delete(settings);
      for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
        await db.insert(settings).values({ key, value });
      }
      return { success: true };
    } catch {
      return { success: false };
    }
  }),
});
