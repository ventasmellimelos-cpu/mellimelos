import { Link } from "react-router";
import { ChevronLeft } from "lucide-react";
import { useSeo } from "@/hooks/useSeo";

interface LegalLayoutProps {
  title: string;
  updated: string;
  seoDescription: string;
  path: string;
  children: React.ReactNode;
}

/**
 * Shared shell for legal pages (terms, privacy, returns, withdrawal).
 * Readable measure (~68ch), brand typography, generous vertical rhythm.
 */
export default function LegalLayout({ title, updated, seoDescription, path, children }: LegalLayoutProps) {
  useSeo({ title: `${title} | Melli Melos`, description: seoDescription, path });

  return (
    <div className="min-h-screen pt-[88px] pb-24 bg-[#FFF8F0]">
      <div className="mx-auto px-6" style={{ maxWidth: 760 }}>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 font-body text-sm text-[#6B6B6B] hover:text-[#2D2D2D] transition-colors mb-8"
        >
          <ChevronLeft size={16} /> Volver al inicio
        </Link>

        <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#2D2D2D] text-balance">
          {title}
        </h1>
        <p className="font-body text-sm text-[#6B6B6B] mt-3">Última actualización: {updated}</p>

        <div className="legal-prose mt-10 space-y-7">{children}</div>

        {/* Internal links: keep all legal pages + catalog reachable from each other */}
        <nav aria-label="Más información" className="mt-16 pt-8 border-t border-[#E8DDD8]">
          <p className="font-body text-sm font-medium text-[#2D2D2D] mb-4">Más información</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2.5">
            {relatedLinks
              .filter((l) => l.to !== path)
              .map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="font-body text-sm text-[#6B6B6B] hover:text-[#D4A5A5] underline-offset-2 hover:underline transition-colors"
                >
                  {l.label}
                </Link>
              ))}
          </div>
        </nav>
      </div>
    </div>
  );
}

const relatedLinks = [
  { to: "/catalogo", label: "Catálogo" },
  { to: "/terminos", label: "Términos y Condiciones" },
  { to: "/privacidad", label: "Política de Privacidad" },
  { to: "/cambios-y-devoluciones", label: "Cambios y Devoluciones" },
  { to: "/arrepentimiento", label: "Botón de Arrepentimiento" },
];

/** A titled block inside a legal page. */
export function LegalSection({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#2D2D2D]">{heading}</h2>
      <div className="font-body text-[15px] text-[#4A4A4A] leading-relaxed space-y-3">{children}</div>
    </section>
  );
}
