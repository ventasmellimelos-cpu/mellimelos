import { useState } from "react";
import { Plus, MessageCircle } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

/**
 * Estas preguntas coinciden con el FAQPage (JSON-LD) de index.html.
 * Si editás una, actualizá también el structured data para que Google y los
 * motores de IA sigan mostrando la misma respuesta.
 */
const faqs = [
  {
    q: "¿Hacen envíos a todo Argentina?",
    a: "Sí. Enviamos a todo el país. Coordinamos el envío por WhatsApp después de tu compra y te llega a la puerta de tu casa.",
  },
  {
    q: "¿Qué talles de ropa de bebé tienen?",
    a: "Tenemos ropa desde recién nacido hasta 24 meses, en talles 0-3m, 3-6m, 6-9m, 9-12m y más, según el producto. Si tenés dudas con un talle, escribinos y te asesoramos.",
  },
  {
    q: "¿Cómo compro en Melli Melos?",
    a: "Elegí las prendas del catálogo, agregalas al carrito y envianos tu pedido por WhatsApp. Te confirmamos stock, forma de pago y coordinamos el envío.",
  },
  {
    q: "¿Qué formas de pago aceptan?",
    a: "Aceptamos efectivo, transferencia bancaria y Mercado Pago.",
  },
  {
    q: "¿La ropa es segura para la piel del bebé?",
    a: "Sí. Trabajamos con materiales suaves e hipoalergénicos, pensados para el confort y la piel delicada de los recién nacidos y bebés.",
  },
  {
    q: "¿Tienen envío gratis?",
    a: "Sí, ofrecemos envío gratis en compras superiores a $25.000.",
  },
];

export default function Faq() {
  const { get } = useSettings();
  const [open, setOpen] = useState<number | null>(0);
  const whatsappUrl = `https://wa.me/${get("whatsapp")}`;

  return (
    <section aria-labelledby="faq-heading" className="py-20 px-6 bg-white">
      <div className="mx-auto grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-16" style={{ maxWidth: 1280 }}>
        {/* Editorial left column */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 id="faq-heading" className="font-display text-4xl sm:text-5xl font-bold text-[#2D2D2D] text-balance">
            Preguntas frecuentes
          </h2>
          <p className="font-body text-[#6B6B6B] mt-4 leading-relaxed max-w-sm">
            Todo lo que necesitás saber antes de comprar. Si te queda alguna duda, escribinos y te respondemos al toque.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 font-body font-medium text-sm text-[#2D2D2D] bg-[#F8E1E4] px-5 py-3 rounded-full transition-transform duration-150 ease-out hover:scale-[1.02] active:scale-[0.98]"
          >
            <MessageCircle size={17} className="text-[#4a7c59]" />
            Hablar por WhatsApp
          </a>
        </div>

        {/* Accordion */}
        <div className="divide-y divide-[#F0EBE5]">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-trigger-${i}`}
                    className="group flex w-full items-center justify-between gap-4 py-5 text-left"
                  >
                    <span className="font-display text-lg sm:text-xl font-semibold text-[#2D2D2D]">
                      {item.q}
                    </span>
                    <span
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#F5F0EB] text-[#2D2D2D] transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:bg-[#F8E1E4]"
                      style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                      aria-hidden="true"
                    >
                      <Plus size={16} />
                    </span>
                  </button>
                </h3>
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${i}`}
                  className="grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="font-body text-[15px] text-[#6B6B6B] leading-relaxed pb-6 pr-12 max-w-[60ch]">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
