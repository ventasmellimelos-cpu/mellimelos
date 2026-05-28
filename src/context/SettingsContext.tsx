import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { trpc } from "@/providers/trpc";

const STORAGE_KEY = "mm_settings";
const STORAGE_TS_KEY = "mm_settings_ts";

const DEFAULTS: Record<string, string> = {
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

interface SettingsCtx {
  settings: Record<string, string>;
  get: (key: string) => string;
  set: (key: string, value: string) => void;
  setMany: (data: Record<string, string>) => void;
  save: () => Promise<boolean>;
  isSaving: boolean;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsCtx | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettingsState] = useState<Record<string, string>>(() => {
    // Load from localStorage first
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return { ...DEFAULTS, ...JSON.parse(stored) };
    } catch { /* ignore */ }
    return { ...DEFAULTS };
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const utils = trpc.useUtils();
  const { data: serverSettings } = trpc.settings.getAll.useQuery();
  const setMutation = trpc.settings.setMany.useMutation();

  // Sync from server when available
  useEffect(() => {
    // Convert array to record if needed (json-store returns array)
    const settingsRecord: Record<string, string> = {};
    if (Array.isArray(serverSettings)) {
      for (const s of serverSettings) {
        if (s && s.key) settingsRecord[s.key] = s.value;
      }
    } else if (serverSettings && typeof serverSettings === "object") {
      Object.assign(settingsRecord, serverSettings as Record<string, string>);
    }
    if (Object.keys(settingsRecord).length > 0) {
      setSettingsState((prev) => {
        const merged = { ...prev, ...settingsRecord };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        localStorage.setItem(STORAGE_TS_KEY, Date.now().toString());
        return merged;
      });
      setIsLoading(false);
    }
  }, [serverSettings]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const get = useCallback((key: string) => settings[key] ?? DEFAULTS[key] ?? "", [settings]);

  const set = useCallback((key: string, value: string) => {
    setSettingsState((prev) => {
      const next = { ...prev, [key]: value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const setMany = useCallback((data: Record<string, string>) => {
    setSettingsState((prev) => {
      const next = { ...prev, ...data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const save = useCallback(async () => {
    setIsSaving(true);
    try {
      await setMutation.mutateAsync(settings);
      utils.settings.getAll.invalidate();
      return true;
    } catch {
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [settings, setMutation, utils]);

  return (
    <SettingsContext.Provider value={{ settings, get, set, setMany, save, isSaving, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be inside SettingsProvider");
  return ctx;
}
