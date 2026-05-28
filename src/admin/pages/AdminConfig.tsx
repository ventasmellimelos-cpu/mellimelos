import { useState } from "react";
import { Settings, Save, RotateCcw, Globe, Phone, Mail, MapPin, FileText, Tag, Truck, Sparkles } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

type TabId = "general" | "contact" | "hero" | "trust" | "content" | "seo";

interface Tab {
  id: TabId;
  label: string;
  icon: typeof Settings;
}

const tabs: Tab[] = [
  { id: "general", label: "General", icon: Settings },
  { id: "contact", label: "Contacto", icon: Phone },
  { id: "hero", label: "Hero / Banner", icon: Sparkles },
  { id: "trust", label: "Trust Badges", icon: Truck },
  { id: "content", label: "Contenido", icon: FileText },
  { id: "seo", label: "SEO", icon: Globe },
];

export default function AdminConfig() {
  const { settings, set, save, isSaving } = useSettings();
  const [activeTab, setActiveTab] = useState<TabId>("general");
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = async () => {
    const ok = await save();
    if (ok) {
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 3000);
    }
  };

  const Field = ({ label, settingKey, placeholder, type = "text", rows }: {
    label: string; settingKey: string; placeholder?: string; type?: string; rows?: number;
  }) => (
    <div className="mb-4">
      <label className="font-body text-sm font-medium text-[#2D2D2D] mb-1.5 block">{label}</label>
      {rows ? (
        <textarea
          value={settings[settingKey] ?? ""}
          onChange={(e) => set(settingKey, e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full px-4 py-2.5 rounded-xl border border-[#E0D5CC] bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#F8E1E4] resize-none"
        />
      ) : (
        <input
          type={type}
          value={settings[settingKey] ?? ""}
          onChange={(e) => set(settingKey, e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 rounded-xl border border-[#E0D5CC] bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#F8E1E4]"
        />
      )}
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#2D2D2D]">Configuración</h1>
          <p className="font-body text-[#6B6B6B] mt-1">Modificá toda la web desde acá</p>
        </div>
        <div className="flex gap-3">
          {savedMsg && (
            <span className="flex items-center gap-1.5 px-4 py-2.5 bg-[#E8F5E9] text-[#4a7c59] rounded-xl font-body text-sm font-medium">
              <Save size={16} /> Guardado
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-[#2D2D2D] text-white font-body font-medium px-6 py-2.5 rounded-xl hover:bg-[#F8E1E4] hover:text-[#2D2D2D] transition-all disabled:opacity-50"
          >
            <Save size={18} /> {isSaving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-body text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-[#2D2D2D] text-white"
                  : "bg-white text-[#6B6B6B] border border-[#E0D5CC] hover:border-[#F8E1E4]"
              }`}
            >
              <Icon size={16} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-soft p-8">
        {/* GENERAL */}
        {activeTab === "general" && (
          <div>
            <h2 className="font-display text-xl font-semibold text-[#2D2D2D] mb-1">General</h2>
            <p className="font-body text-sm text-[#6B6B6B] mb-6">Información principal de la tienda</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
              <Field label="Nombre de la tienda" settingKey="store_name" placeholder="Melli Melos" />
              <Field label="Tagline" settingKey="store_tagline" placeholder="La ropa más suave para tu bebé" />
              <div className="sm:col-span-2">
                <Field label="Descripción" settingKey="store_description" placeholder="Descripción corta..." rows={3} />
              </div>
              <div className="sm:col-span-2">
                <Field label="Texto de la barra superior" settingKey="badge_text" placeholder="🏆 Mercado Líder Platinum..." />
              </div>
              <Field label="Color del tema (hex)" settingKey="theme_color" placeholder="#F8E1E4" />
              <Field label="Moneda" settingKey="currency" placeholder="ARS" />
              <Field label="Envío gratis desde ($)" settingKey="free_shipping_threshold" placeholder="25000" type="number" />
            </div>
          </div>
        )}

        {/* CONTACT */}
        {activeTab === "contact" && (
          <div>
            <h2 className="font-display text-xl font-semibold text-[#2D2D2D] mb-1">Contacto</h2>
            <p className="font-body text-sm text-[#6B6B6B] mb-6">Datos de contacto que se muestran en toda la web</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
              <Field label="Dirección" settingKey="address" placeholder="Constancio Vigil 150..." />
              <Field label="Teléfono" settingKey="phone" placeholder="+54 9 11 3484-8466" />
              <Field label="WhatsApp (número solo)" settingKey="whatsapp" placeholder="5491134848466" />
              <Field label="Email" settingKey="email" placeholder="ventasmellimelos@gmail.com" type="email" />
              <Field label="Instagram URL" settingKey="instagram" placeholder="https://instagram.com/..." />
              <Field label="Facebook URL" settingKey="facebook" placeholder="https://facebook.com/..." />
              <Field label="TikTok URL" settingKey="tiktok" placeholder="https://tiktok.com/..." />
            </div>
          </div>
        )}

        {/* HERO */}
        {activeTab === "hero" && (
          <div>
            <h2 className="font-display text-xl font-semibold text-[#2D2D2D] mb-1">Hero / Banner principal</h2>
            <p className="font-body text-sm text-[#6B6B6B] mb-6">Texto del banner principal de la home</p>
            <div className="grid grid-cols-1 gap-x-6">
              <Field label="Título del Hero" settingKey="hero_title" placeholder="La ropa más suave para tu bebé" />
              <Field label="Subtítulo del Hero" settingKey="hero_subtitle" placeholder="Descripción..." rows={3} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                <Field label="Texto botón principal" settingKey="hero_cta_primary" placeholder="Ver colección" />
                <Field label="Texto botón secundario" settingKey="hero_cta_secondary" placeholder="Escribinos por WhatsApp" />
              </div>
            </div>
          </div>
        )}

        {/* TRUST */}
        {activeTab === "trust" && (
          <div>
            <h2 className="font-display text-xl font-semibold text-[#2D2D2D] mb-1">Trust Badges</h2>
            <p className="font-body text-sm text-[#6B6B6B] mb-6">Las 4 tarjetas de confianza debajo del hero</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
              <Field label="Badge 1 - Título" settingKey="trust_badge_1_title" placeholder="Mercado Líder Platinum" />
              <Field label="Badge 1 - Descripción" settingKey="trust_badge_1_desc" placeholder="Máxima confianza" />
              <Field label="Badge 2 - Título" settingKey="trust_badge_2_title" placeholder="Envío gratis" />
              <Field label="Badge 2 - Descripción" settingKey="trust_badge_2_desc" placeholder="En compras +$25.000" />
              <Field label="Badge 3 - Título" settingKey="trust_badge_3_title" placeholder="Hecho con amor" />
              <Field label="Badge 3 - Descripción" settingKey="trust_badge_3_desc" placeholder="Cada prenda especial" />
              <Field label="Badge 4 - Título" settingKey="trust_badge_4_title" placeholder="Entrega rápida" />
              <Field label="Badge 4 - Descripción" settingKey="trust_badge_4_desc" placeholder="2-5 días hábiles" />
            </div>
          </div>
        )}

        {/* CONTENT */}
        {activeTab === "content" && (
          <div>
            <h2 className="font-display text-xl font-semibold text-[#2D2D2D] mb-1">Contenido de secciones</h2>
            <p className="font-body text-sm text-[#6B6B6B] mb-6">Textos de cada sección de la web</p>
            <div className="grid grid-cols-1 gap-x-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                <Field label="Título - Productos destacados" settingKey="featured_title" placeholder="Productos destacados" />
                <Field label="Subtítulo - Productos destacados" settingKey="featured_subtitle" placeholder="Nuestros favoritos" />
              </div>
              <Field label="Título - Nosotros" settingKey="about_title" placeholder="Conocé Melli Melos" />
              <Field label="Historia (Nosotros)" settingKey="about_story" placeholder="Somos una tienda familiar..." rows={3} />
              <Field label="Características (separadas por coma)" settingKey="about_features" placeholder="Ropa de 0 a 24 meses,Materiales hipoalergénicos..." />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                <Field label="Título - Contacto" settingKey="contact_title" placeholder="Contactanos" />
                <Field label="Subtítulo - Contacto" settingKey="contact_subtitle" placeholder="Estamos para ayudarte" />
              </div>
              <Field label="Footer CTA Título" settingKey="footer_cta_title" placeholder="¿Listo para consentir a tu bebé?" />
              <Field label="Footer CTA Subtítulo" settingKey="footer_cta_subtitle" placeholder="Escribinos por WhatsApp..." rows={2} />
              <Field label="Footer CTA Botón" settingKey="footer_cta_button" placeholder="Escribir por WhatsApp" />
            </div>
          </div>
        )}

        {/* SEO */}
        {activeTab === "seo" && (
          <div>
            <h2 className="font-display text-xl font-semibold text-[#2D2D2D] mb-1">SEO</h2>
            <p className="font-body text-sm text-[#6B6B6B] mb-6">Optimización para buscadores</p>
            <div className="grid grid-cols-1 gap-x-6">
              <Field label="Título del sitio (SEO)" settingKey="seo_title" placeholder="Melli Melos | Ropa de Bebé..." />
              <Field label="Descripción (SEO)" settingKey="seo_description" placeholder="Descripción para Google..." rows={3} />
              <Field label="Google Analytics ID" settingKey="analytics_id" placeholder="G-XXXXXXXXXX (opcional)" />
            </div>
          </div>
        )}
      </div>

      {/* Save button at bottom */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-[#2D2D2D] text-white font-body font-medium px-8 py-3 rounded-xl hover:bg-[#F8E1E4] hover:text-[#2D2D2D] transition-all disabled:opacity-50"
        >
          <Save size={18} /> {isSaving ? "Guardando..." : "Guardar todos los cambios"}
        </button>
      </div>
    </div>
  );
}
