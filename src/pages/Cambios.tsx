import LegalLayout, { LegalSection } from "@/components/LegalLayout";
import { useSettings } from "@/context/SettingsContext";

export default function Cambios() {
  const { get } = useSettings();
  const whatsappUrl = `https://wa.me/${get("whatsapp")}`;

  return (
    <LegalLayout
      title="Cambios y Devoluciones"
      updated="Junio 2026"
      path="/cambios-y-devoluciones"
      seoDescription="Política de cambios y devoluciones de Melli Melos. Plazos, condiciones y cómo solicitarlos."
    >
      <p>
        Queremos que estés feliz con tu compra. Si algo no salió como esperabas, te ayudamos a cambiarlo o
        devolverlo según las condiciones de esta política y la Ley de Defensa del Consumidor (Ley 24.240).
      </p>

      <LegalSection heading="Arrepentimiento (10 días)">
        <p>
          Tenés derecho a arrepentirte de tu compra dentro de los 10 días corridos desde que recibís el
          producto, sin necesidad de justificar el motivo. El producto debe estar sin uso, con su etiqueta y
          empaque original. Los costos de devolución en caso de arrepentimiento corren por nuestra cuenta.
          Podés iniciar el trámite desde el{" "}
          <a href="/arrepentimiento" className="text-[#2D2D2D] underline underline-offset-2 hover:text-[#D4A5A5]">Botón de Arrepentimiento</a>.
        </p>
      </LegalSection>

      <LegalSection heading="Cambios por talle o color">
        <p>
          Si necesitás cambiar un talle o color, escribinos dentro de los 30 días de recibida tu compra. El
          producto debe estar sin uso, en perfecto estado, con etiqueta y empaque original. El cambio queda
          sujeto a disponibilidad de stock.
        </p>
      </LegalSection>

      <LegalSection heading="Productos con falla">
        <p>
          Si recibís un producto con una falla de fábrica, contactanos lo antes posible. Te ofrecemos el
          cambio por uno equivalente o, si no hay stock, la devolución del importe abonado.
        </p>
      </LegalSection>

      <LegalSection heading="Cómo solicitar un cambio o devolución">
        <p>
          Escribinos por{" "}
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-[#2D2D2D] underline underline-offset-2 hover:text-[#D4A5A5]">WhatsApp</a>{" "}
          o a {get("email")} indicando tu nombre, número de pedido y el motivo. Te respondemos con los pasos a
          seguir y la dirección de envío para la devolución.
        </p>
      </LegalSection>

      <LegalSection heading="Reintegros">
        <p>
          Una vez recibido y revisado el producto, procesamos el reintegro por el mismo medio de pago
          utilizado, dentro de los plazos que correspondan según el medio.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
