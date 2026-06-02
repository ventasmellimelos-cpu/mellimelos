import { useState } from "react";
import { MessageCircle, Mail } from "lucide-react";
import LegalLayout, { LegalSection } from "@/components/LegalLayout";
import { useSettings } from "@/context/SettingsContext";

const fieldClass =
  "w-full px-4 py-2.5 rounded-xl border border-[#E0D5CC] bg-white font-body text-sm text-[#2D2D2D] placeholder:text-[#9A8F8A] focus:outline-none focus:ring-2 focus:ring-[#F8E1E4] focus:border-transparent transition";

export default function Arrepentimiento() {
  const { get } = useSettings();
  const [form, setForm] = useState({ name: "", contact: "", order: "", product: "", reason: "" });

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const message =
    `Hola Melli Melos, quiero ejercer mi derecho de arrepentimiento (Ley 24.240).\n\n` +
    `Nombre: ${form.name}\n` +
    `Contacto: ${form.contact}\n` +
    `Pedido / fecha de compra: ${form.order}\n` +
    `Producto: ${form.product}\n` +
    (form.reason ? `Comentario: ${form.reason}\n` : "");

  const whatsappUrl = `https://wa.me/${get("whatsapp")}?text=${encodeURIComponent(message)}`;
  const mailtoUrl = `mailto:${get("email")}?subject=${encodeURIComponent("Solicitud de arrepentimiento")}&body=${encodeURIComponent(message)}`;

  const valid = form.name.trim() && form.contact.trim() && form.order.trim() && form.product.trim();

  return (
    <LegalLayout
      title="Botón de Arrepentimiento"
      updated="Junio 2026"
      path="/arrepentimiento"
      seoDescription="Ejercé tu derecho de arrepentimiento de compra dentro de los 10 días, conforme la Ley 24.240."
    >
      <LegalSection heading="Tu derecho de arrepentimiento">
        <p>
          Si compraste a distancia, tenés derecho a arrepentirte dentro de los 10 días corridos desde que
          recibís el producto, sin costo ni necesidad de justificar el motivo (art. 34, Ley 24.240). El
          producto debe estar sin uso, con su etiqueta y empaque original. Los costos de devolución corren por
          nuestra cuenta.
        </p>
        <p>Completá el formulario y te respondemos con los pasos para la devolución y el reintegro.</p>
      </LegalSection>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="rounded-2xl bg-white border border-[#F3E9E5] p-6 space-y-4 not-prose"
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="ar-name" className="font-body text-sm font-medium text-[#2D2D2D]">Nombre y apellido</label>
            <input id="ar-name" value={form.name} onChange={update("name")} className={fieldClass} placeholder="Tu nombre" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="ar-contact" className="font-body text-sm font-medium text-[#2D2D2D]">Email o teléfono</label>
            <input id="ar-contact" value={form.contact} onChange={update("contact")} className={fieldClass} placeholder="Para contactarte" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="ar-order" className="font-body text-sm font-medium text-[#2D2D2D]">N.º de pedido o fecha de compra</label>
            <input id="ar-order" value={form.order} onChange={update("order")} className={fieldClass} placeholder="Ej: pedido del 12/06" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="ar-product" className="font-body text-sm font-medium text-[#2D2D2D]">Producto a devolver</label>
            <input id="ar-product" value={form.product} onChange={update("product")} className={fieldClass} placeholder="Nombre del producto" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="ar-reason" className="font-body text-sm font-medium text-[#2D2D2D]">Comentario (opcional)</label>
          <textarea id="ar-reason" value={form.reason} onChange={update("reason")} rows={3} className={fieldClass} placeholder="Si querés, contanos algo más" />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <a
            href={valid ? whatsappUrl : undefined}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!valid}
            onClick={(e) => { if (!valid) e.preventDefault(); }}
            className={`flex-1 inline-flex items-center justify-center gap-2 font-body font-medium text-sm py-3.5 rounded-xl transition-transform duration-150 ease-out ${
              valid ? "bg-[#25D366] text-white hover:scale-[1.01] active:scale-[0.98]" : "bg-[#E8DDD8] text-[#9A8F8A] cursor-not-allowed"
            }`}
          >
            <MessageCircle size={18} /> Enviar por WhatsApp
          </a>
          <a
            href={valid ? mailtoUrl : undefined}
            aria-disabled={!valid}
            onClick={(e) => { if (!valid) e.preventDefault(); }}
            className={`flex-1 inline-flex items-center justify-center gap-2 font-body font-medium text-sm py-3.5 rounded-xl border transition-transform duration-150 ease-out ${
              valid ? "border-[#E0D5CC] text-[#2D2D2D] hover:scale-[1.01] active:scale-[0.98]" : "border-[#E8DDD8] text-[#9A8F8A] cursor-not-allowed"
            }`}
          >
            <Mail size={17} /> Enviar por email
          </a>
        </div>
        {!valid && (
          <p className="font-body text-xs text-[#6B6B6B]">Completá nombre, contacto, pedido y producto para continuar.</p>
        )}
      </form>
    </LegalLayout>
  );
}
