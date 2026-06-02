import LegalLayout, { LegalSection } from "@/components/LegalLayout";
import { useSettings } from "@/context/SettingsContext";

export default function Privacidad() {
  const { get } = useSettings();

  return (
    <LegalLayout
      title="Política de Privacidad"
      updated="Junio 2026"
      path="/privacidad"
      seoDescription="Cómo Melli Melos protege y trata tus datos personales conforme la Ley 25.326."
    >
      <p>
        En Melli Melos cuidamos tus datos personales. Esta política explica qué información recopilamos, con
        qué fin y cuáles son tus derechos, conforme a la Ley 25.326 de Protección de Datos Personales de la
        República Argentina.
      </p>

      <LegalSection heading="1. Qué datos recopilamos">
        <p>
          Recopilamos solo los datos necesarios para gestionar tu pedido: nombre, teléfono, dirección de
          envío y, si nos lo facilitás, tu correo electrónico. No solicitamos ni almacenamos datos de
          tarjetas: los pagos se coordinan por los medios informados (transferencia, efectivo o Mercado Pago).
        </p>
      </LegalSection>

      <LegalSection heading="2. Para qué los usamos">
        <p>Usamos tus datos para procesar y enviar tu pedido, coordinar el pago, brindarte soporte y, si lo autorizás, enviarte novedades. No usamos tus datos para otros fines sin tu consentimiento.</p>
      </LegalSection>

      <LegalSection heading="3. Con quién los compartimos">
        <p>
          Compartimos los datos mínimos necesarios con la empresa de correo o mensajería para concretar el
          envío. No vendemos ni cedemos tus datos personales a terceros con fines comerciales.
        </p>
      </LegalSection>

      <LegalSection heading="4. Tus derechos">
        <p>
          Tenés derecho a acceder, rectificar, actualizar y suprimir tus datos personales en cualquier
          momento. Para ejercerlos, escribinos a {get("email")}.
        </p>
        <p>
          La Agencia de Acceso a la Información Pública, órgano de control de la Ley 25.326, tiene la
          atribución de atender denuncias y reclamos respecto del incumplimiento de las normas de protección
          de datos personales.
        </p>
      </LegalSection>

      <LegalSection heading="5. Conservación y seguridad">
        <p>
          Conservamos tus datos solo el tiempo necesario para cumplir con las finalidades descriptas y con
          las obligaciones legales. Aplicamos medidas razonables para proteger tu información.
        </p>
      </LegalSection>

      <LegalSection heading="6. Contacto">
        <p>Por cualquier consulta sobre esta política escribinos a {get("email")} o al {get("phone")}.</p>
      </LegalSection>
    </LegalLayout>
  );
}
