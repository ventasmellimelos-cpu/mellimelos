import { Link } from "react-router";
import { MapPin, Phone, Mail, Instagram, Facebook, Heart, ArrowUpRight, Truck, ShieldCheck } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

const paymentMethods = ["Mercado Pago", "Efectivo", "Transferencia"];

const footerLinks = [
  { to: "/", label: "Inicio" },
  { to: "/catalogo", label: "Catálogo" },
  { to: "/#nosotros", label: "Nosotros" },
  { to: "/#contacto", label: "Contacto" },
];

export default function Footer() {
  const { get } = useSettings();
  const whatsappUrl = `https://wa.me/${get("whatsapp")}`;

  return (
    <footer className="bg-[#2D2D2D] text-white">
      {/* CTA Banner */}
      <div className="border-b border-white/10">
        <div className="mx-auto px-6 py-12 text-center" style={{ maxWidth: 1280 }}>
          <h3 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            {get("footer_cta_title").split("tu ")[0]}tu <span className="text-[#F8E1E4]">{get("footer_cta_title").includes("bebé") ? "bebé" : "bebe"}</span>
          </h3>
          <p className="font-body text-white/60 mb-6 max-w-md mx-auto">
            {get("footer_cta_subtitle")}
          </p>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#F8E1E4] text-[#2D2D2D] font-body font-medium px-8 py-3.5 rounded-full hover:scale-[1.02] transition-transform"
          >
            <Phone size={18} /> {get("footer_cta_button")} <ArrowUpRight size={16} />
          </a>
        </div>
      </div>

      {/* Main Footer */}
      <div className="mx-auto px-6 py-14" style={{ maxWidth: 1280 }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Heart size={18} className="text-[#F8E1E4]" fill="#F8E1E4" />
              <span className="font-accent text-2xl font-bold text-[#F8E1E4]">{get("store_name")}</span>
            </Link>
            <p className="font-body text-sm text-white/50 leading-relaxed">
              {get("store_description")}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-5">Enlaces</h4>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="font-body text-sm text-white/50 hover:text-[#F8E1E4] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-5">Seguinos</h4>
            <ul className="space-y-3">
              <li>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 font-body text-sm text-white/50 hover:text-[#F8E1E4] transition-colors">
                  <Phone size={15} /> WhatsApp
                </a>
              </li>
              <li>
                <a href={get("instagram")} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 font-body text-sm text-white/50 hover:text-[#F8E1E4] transition-colors">
                  <Instagram size={15} /> Instagram
                </a>
              </li>
              <li>
                <a href={get("facebook")} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 font-body text-sm text-white/50 hover:text-[#F8E1E4] transition-colors">
                  <Facebook size={15} /> Facebook
                </a>
              </li>
              <li>
                <a href={`mailto:${get("email")}`} className="flex items-center gap-2.5 font-body text-sm text-white/50 hover:text-[#F8E1E4] transition-colors">
                  <Mail size={15} /> Email
                </a>
              </li>
            </ul>
          </div>

          {/* Address */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-5">Ubicación</h4>
            <div className="flex items-start gap-2.5 mb-4">
              <MapPin size={15} className="text-white/40 mt-0.5 flex-shrink-0" />
              <p className="font-body text-sm text-white/50 leading-relaxed">
                {get("address")}
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone size={15} className="text-white/40 flex-shrink-0" />
              <p className="font-body text-sm text-white/50">{get("phone")}</p>
            </div>
          </div>
        </div>

        {/* Payment methods + shipping trust */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-body text-[11px] text-white/40 uppercase tracking-wider">Medios de pago</span>
            {paymentMethods.map((m) => (
              <span key={m} className="font-body text-xs text-white/75 bg-white/[0.06] border border-white/10 rounded-lg px-3 py-1.5">
                {m}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-2 font-body text-xs text-white/55">
              <Truck size={15} className="text-[#F8E1E4]" /> Envíos a todo el país
            </span>
            <span className="flex items-center gap-2 font-body text-xs text-white/55">
              <ShieldCheck size={15} className="text-[#F8E1E4]" /> Compra protegida
            </span>
          </div>
        </div>

        {/* Legal links */}
        <nav aria-label="Enlaces legales" className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
          <Link to="/terminos" className="font-body text-xs text-white/50 hover:text-[#F8E1E4] transition-colors">Términos y Condiciones</Link>
          <Link to="/privacidad" className="font-body text-xs text-white/50 hover:text-[#F8E1E4] transition-colors">Política de Privacidad</Link>
          <Link to="/cambios-y-devoluciones" className="font-body text-xs text-white/50 hover:text-[#F8E1E4] transition-colors">Cambios y Devoluciones</Link>
          <Link to="/arrepentimiento" className="font-body text-xs text-white/50 hover:text-[#F8E1E4] transition-colors">Botón de Arrepentimiento</Link>
        </nav>

        {/* Bottom bar */}
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-white/30">
            © {new Date().getFullYear()} {get("store_name")}. Todos los derechos reservados.
          </p>
          <p className="font-body text-xs text-white/30 flex items-center gap-1">
            Hecho con <Heart size={12} className="text-[#F8E1E4]" fill="#F8E1E4" /> en Buenos Aires, Argentina
          </p>
        </div>
      </div>
    </footer>
  );
}
