import { Link } from "react-router";
import { MapPin, Phone, Mail, Instagram, Facebook, Heart, ArrowUpRight } from "lucide-react";

const footerLinks = [
  { to: "/", label: "Inicio" },
  { to: "/catalogo", label: "Catálogo" },
  { to: "/#nosotros", label: "Nosotros" },
  { to: "/#contacto", label: "Contacto" },
];

const socialLinks = [
  { icon: Phone, label: "WhatsApp", href: "https://wa.me/5491134848466", value: "+54 9 11 3484-8466" },
  { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/melli_melos/", value: "@melli_melos" },
  { icon: Facebook, label: "Facebook", href: "https://www.facebook.com/mellimelosropadebebes/", value: "Melli Melos Ropa de Bebes" },
  { icon: Mail, label: "Email", href: "mailto:ventasmellimelos@gmail.com", value: "ventasmellimelos@gmail.com" },
];

export default function Footer() {
  return (
    <footer className="bg-[#2D2D2D] text-white">
      {/* CTA Banner */}
      <div className="border-b border-white/10">
        <div className="mx-auto px-6 py-12 text-center" style={{ maxWidth: 1280 }}>
          <h3 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            ¿Listo para consentir a tu <span className="text-[#F8E1E4]">bebé</span>?
          </h3>
          <p className="font-body text-white/60 mb-6 max-w-md mx-auto">
            Escribinos por WhatsApp y te ayudamos con tu pedido personalizado.
          </p>
          <a href="https://wa.me/5491134848466" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#F8E1E4] text-[#2D2D2D] font-body font-medium px-8 py-3.5 rounded-full hover:scale-[1.02] transition-transform"
          >
            <Phone size={18} /> Escribir por WhatsApp <ArrowUpRight size={16} />
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
              <span className="font-accent text-2xl font-bold text-[#F8E1E4]">Melli Melos</span>
            </Link>
            <p className="font-body text-sm text-white/50 leading-relaxed">
              Ropa de bebé con amor desde el Partido de 6 de Septiembre, Buenos Aires. Cada prenda está pensada para el confort de los más pequeños.
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
              {socialLinks.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 font-body text-sm text-white/50 hover:text-[#F8E1E4] transition-colors">
                    <s.icon size={15} /> {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Address */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-5">Ubicación</h4>
            <div className="flex items-start gap-2.5 mb-4">
              <MapPin size={15} className="text-white/40 mt-0.5 flex-shrink-0" />
              <p className="font-body text-sm text-white/50 leading-relaxed">
                Constancio Vigil 150<br />Partido de 6 de Septiembre, Buenos Aires<br />Argentina
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone size={15} className="text-white/40 flex-shrink-0" />
              <p className="font-body text-sm text-white/50">+54 9 11 3484-8466</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-white/30">
            © {new Date().getFullYear()} Melli Melos. Todos los derechos reservados.
          </p>
          <p className="font-body text-xs text-white/30 flex items-center gap-1">
            Hecho con <Heart size={12} className="text-[#F8E1E4]" fill="#F8E1E4" /> en Buenos Aires, Argentina
          </p>
        </div>
      </div>
    </footer>
  );
}
