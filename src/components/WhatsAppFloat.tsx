import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { useLocation } from "react-router";

/**
 * Floating WhatsApp button — visible en todas las páginas públicas.
 * Se oculta en /admin para no interferir con el panel.
 * Aparece después de 2 segundos para no competir con el LCP.
 */
export default function WhatsAppFloat() {
  const { get } = useSettings();
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [tooltip, setTooltip] = useState(true);

  // No mostrar en admin
  if (location.pathname.startsWith("/admin")) return null;

  // Aparece después de 2 s para no bloquear el LCP
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // Ocultar tooltip después de 6 s
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setTooltip(false), 6000);
    return () => clearTimeout(t);
  }, [visible]);

  const message = encodeURIComponent(
    "¡Hola Melli Melos! Me interesa saber más sobre sus productos de ropa de bebé."
  );
  const href = `https://wa.me/${get("whatsapp")}?text=${message}`;

  return (
    <div
      className="fixed bottom-6 right-6 z-[80] flex flex-col items-end gap-2 transition-all duration-500 ease-out"
      style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", pointerEvents: visible ? "auto" : "none" }}
    >
      {/* Tooltip */}
      {tooltip && (
        <div className="flex items-center gap-2 bg-white rounded-2xl shadow-[0_4px_20px_rgba(45,45,45,0.12)] px-4 py-2.5 max-w-[200px] animate-in fade-in slide-in-from-bottom-2 duration-300">
          <p className="font-body text-xs text-[#2D2D2D] leading-snug">
            ¿Necesitás ayuda? Escribinos
          </p>
          <button
            onClick={() => setTooltip(false)}
            className="flex-shrink-0 text-[#B0A8A0] hover:text-[#6B6B6B] transition-colors"
            aria-label="Cerrar"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Button */}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chatear por WhatsApp"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full shadow-[0_4px_24px_rgba(37,211,102,0.35)] transition-all duration-200 ease-out hover:scale-110 active:scale-95"
        style={{ backgroundColor: "#25D366" }}
        onClick={() => setTooltip(false)}
      >
        {/* Ping animation */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25" />
        <MessageCircle size={26} className="text-white fill-white relative z-10" strokeWidth={1.5} />
      </a>
    </div>
  );
}
