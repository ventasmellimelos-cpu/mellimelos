import { Link } from "react-router";
import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#2D2D2D] text-white">
      <div className="mx-auto px-6 py-16" style={{ maxWidth: 1280 }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="font-accent text-3xl font-bold text-[#F8E1E4]">
              Melli Melos
            </Link>
            <p className="font-body text-sm text-white/60 mt-3 leading-relaxed">
              Ropa de bebé con amor desde Ituzaingó, Buenos Aires. Cada prenda está pensada para el confort de los más pequeños.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Enlaces</h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="font-body text-sm text-white/60 hover:text-[#F8E1E4] transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/catalogo" className="font-body text-sm text-white/60 hover:text-[#F8E1E4] transition-colors">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link to="/#nosotros" className="font-body text-sm text-white/60 hover:text-[#F8E1E4] transition-colors">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link to="/#contacto" className="font-body text-sm text-white/60 hover:text-[#F8E1E4] transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://wa.me/5491134848466"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 font-body text-sm text-white/60 hover:text-[#F8E1E4] transition-colors"
                >
                  <Phone size={15} />
                  +54 9 11 3484-8466
                </a>
              </li>
              <li>
                <a
                  href="mailto:ventasmellimelos@gmail.com"
                  className="flex items-center gap-2.5 font-body text-sm text-white/60 hover:text-[#F8E1E4] transition-colors"
                >
                  <Mail size={15} />
                  ventasmellimelos@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/melli_melos/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 font-body text-sm text-white/60 hover:text-[#F8E1E4] transition-colors"
                >
                  <Instagram size={15} />
                  @melli_melos
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/mellimelosropadebebes/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 font-body text-sm text-white/60 hover:text-[#F8E1E4] transition-colors"
                >
                  <Facebook size={15} />
                  Melli Melos Ropa de Bebes
                </a>
              </li>
            </ul>
          </div>

          {/* Address */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Ubicación</h4>
            <div className="flex items-start gap-2.5">
              <MapPin size={15} className="text-white/60 mt-0.5 flex-shrink-0" />
              <p className="font-body text-sm text-white/60 leading-relaxed">
                Calle Francisco Emperanza 2700<br />
                Ituzaingó, Buenos Aires<br />
                Argentina
              </p>
            </div>
            <div className="mt-4">
              <p className="font-body text-sm text-white/60">
                <span className="text-white/40">Horario:</span> Lun a Sáb
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 text-center">
          <p className="font-body text-xs text-white/40">
            © {new Date().getFullYear()} Melli Melos. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
