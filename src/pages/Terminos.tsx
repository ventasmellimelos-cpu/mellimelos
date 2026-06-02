import LegalLayout, { LegalSection } from "@/components/LegalLayout";
import { useSettings } from "@/context/SettingsContext";

export default function Terminos() {
  const { get } = useSettings();

  return (
    <LegalLayout
      title="Términos y Condiciones"
      updated="Junio 2026"
      path="/terminos"
      seoDescription="Términos y condiciones de uso y compra en la tienda online Melli Melos."
    >
      <p>
        Estos Términos y Condiciones regulan el uso del sitio y la compra de productos en Melli Melos.
        Al navegar el sitio o realizar un pedido, aceptás estas condiciones. Te recomendamos leerlas antes
        de comprar.
      </p>

      <LegalSection heading="1. Datos del titular">
        <p>
          {/* COMPLETAR con los datos reales del negocio antes de publicar. */}
          Titular: [RAZÓN SOCIAL O NOMBRE Y APELLIDO]. CUIT/CUIL: [CUIT]. Domicilio: {get("address")}.
          Contacto: {get("email")} · {get("phone")}.
        </p>
      </LegalSection>

      <LegalSection heading="2. Productos, precios y stock">
        <p>
          Los precios se expresan en pesos argentinos (ARS) e incluyen impuestos cuando corresponde. Los
          precios y el stock pueden modificarse sin previo aviso. Hacemos lo posible por mostrar la
          disponibilidad real, pero la confirmación final del stock se realiza al coordinar tu pedido.
        </p>
        <p>
          Las fotos de los productos son ilustrativas. Pueden existir leves diferencias de color según la
          pantalla de tu dispositivo.
        </p>
      </LegalSection>

      <LegalSection heading="3. Proceso de compra">
        <p>
          La compra se inicia agregando productos al carrito y enviándonos el pedido por WhatsApp. Allí
          confirmamos disponibilidad, forma de pago y costo de envío. El pedido se considera concretado una
          vez acordado el pago.
        </p>
      </LegalSection>

      <LegalSection heading="4. Medios de pago">
        <p>Aceptamos efectivo, transferencia bancaria y Mercado Pago. Las condiciones de cada medio se informan al momento de coordinar el pedido.</p>
      </LegalSection>

      <LegalSection heading="5. Envíos">
        <p>
          Realizamos envíos a todo el país. Los plazos y costos dependen del destino y se informan antes de
          confirmar la compra. Los plazos son estimados y pueden variar por factores ajenos a nosotros (la
          empresa de correo, condiciones climáticas, etc.).
        </p>
      </LegalSection>

      <LegalSection heading="6. Cambios, devoluciones y arrepentimiento">
        <p>
          Podés solicitar cambios y devoluciones según nuestra Política de Cambios y Devoluciones. Además,
          como consumidor tenés derecho a arrepentirte de tu compra dentro de los 10 días corridos, conforme
          la Ley de Defensa del Consumidor (Ley 24.240). Más información en la sección Botón de Arrepentimiento.
        </p>
      </LegalSection>

      <LegalSection heading="7. Defensa del consumidor">
        <p>
          Ante cualquier inconveniente podés contactarnos a {get("email")}. También podés acudir a la
          autoridad de aplicación de Defensa del Consumidor de tu jurisdicción. Más información en{" "}
          <a href="https://www.argentina.gob.ar/produccion/defensadelconsumidor" target="_blank" rel="noopener noreferrer" className="text-[#2D2D2D] underline underline-offset-2 hover:text-[#D4A5A5]">
            argentina.gob.ar/defensadelconsumidor
          </a>.
        </p>
      </LegalSection>

      <LegalSection heading="8. Propiedad intelectual">
        <p>
          Las imágenes, textos, logos y contenidos del sitio pertenecen a Melli Melos o a sus titulares y no
          pueden reproducirse sin autorización.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
