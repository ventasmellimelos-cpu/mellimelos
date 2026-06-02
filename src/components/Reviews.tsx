import { Star, Quote } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";

/**
 * EDITABLE: reemplazá estas reseñas de ejemplo por reseñas REALES de tus
 * clientas (Mercado Libre, Instagram, WhatsApp). No publiques reseñas
 * inventadas en producción: además de ser desleal, infringe la Ley de Defensa
 * del Consumidor. Pedí permiso para usar el nombre + ciudad de cada clienta.
 */
const reviews = [
  {
    name: "Camila Ferreyra",
    city: "Morón, Bs. As.",
    product: "Body Manga Larga Premium",
    rating: 5,
    text: "La tela es divina, suavísima. Mi bebé tiene piel sensible y no le irritó nada. Llegó en dos días a Morón. Súper recomendable.",
  },
  {
    name: "Sofía Maidana",
    city: "Ezeiza, Bs. As.",
    product: "Conjunto Tejido Sage",
    rating: 5,
    text: "Compré el conjunto tejido para regalo y quedó hermoso. La terminación es de primera. La atención por WhatsApp fue rapidísima.",
  },
  {
    name: "Daniela Ríos",
    city: "Lomas de Zamora",
    product: "Set Gorro y Manoplas",
    rating: 5,
    text: "Ya es mi tercera compra. La calidad siempre impecable y los colores tal cual las fotos.",
  },
  {
    name: "Luciana Pérez",
    city: "CABA",
    product: "Buzo Polar con Pie",
    rating: 5,
    text: "El buzo polar abriga un montón y es re cómodo para cambiarlo. Mi nene lo usa todo el invierno. Volvería a comprar sin dudarlo.",
  },
  {
    name: "Agustina Coronel",
    city: "Carlos Spegazzini",
    product: "Manta Waffle Premium",
    rating: 5,
    text: "La manta waffle es un mimo. La uso para el cochecito y para casa. Excelente relación precio calidad.",
  },
  {
    name: "Romina Vega",
    city: "Cañuelas, Bs. As.",
    product: "Body Nubes Mint",
    rating: 4,
    text: "Muy lindos los bodies, tal cual la descripción. Tardó un día más de lo previsto pero la calidad lo valió.",
  },
];

// EDITABLE: promedio y total reales de tus reseñas (p. ej. de Mercado Libre).
const AGGREGATE = { average: 4.9, count: 1200 };

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`${rating} de 5 estrellas`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={size}
          className={i < rating ? "text-[#D4A5A5]" : "text-[#E8DDD8]"}
          fill={i < rating ? "#D4A5A5" : "#E8DDD8"}
          strokeWidth={0}
        />
      ))}
    </div>
  );
}

export default function Reviews() {
  const { ref, revealed } = useReveal<HTMLDivElement>();

  return (
    <section aria-labelledby="reviews-heading" className="py-20 px-6 bg-[#FDF4F1]">
      <div className="mx-auto" style={{ maxWidth: 1280 }}>
        {/* Section header with aggregate trust signal */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <h2 id="reviews-heading" className="font-display text-4xl sm:text-5xl font-bold text-[#2D2D2D] text-balance">
              Lo que dicen las mamás
            </h2>
            <p className="font-body text-[#6B6B6B] mt-3 leading-relaxed">
              Miles de familias ya eligieron Melli Melos para abrigar a sus bebés. Estas son algunas de sus experiencias.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white rounded-2xl px-5 py-4 shadow-[0_4px_20px_rgba(45,45,45,0.06)] self-start lg:self-auto">
            <div className="text-center">
              <div className="font-display text-4xl font-bold text-[#2D2D2D] leading-none">
                {AGGREGATE.average.toLocaleString("es-AR")}
              </div>
              <Stars rating={5} size={13} />
            </div>
            <div className="w-px h-10 bg-[#F0E6E2]" />
            <p className="font-body text-sm text-[#6B6B6B] leading-snug">
              Más de<br />
              <span className="font-semibold text-[#2D2D2D]">{AGGREGATE.count.toLocaleString("es-AR")} mamás</span><br />
              felices
            </p>
          </div>
        </div>

        {/* Masonry of reviews — varied heights avoid the identical-card-grid tell */}
        <div ref={ref} className="columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
          {reviews.map((r, i) => (
            <figure
              key={r.name}
              className="break-inside-avoid mb-5 rounded-2xl bg-white border border-[#F3E9E5] p-6 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] will-change-transform"
              style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? "translateY(0)" : "translateY(16px)",
                transitionDelay: `${Math.min(i, 6) * 60}ms`,
              }}
            >
              <Quote size={22} className="text-[#F0CDD2] mb-3" fill="#F8E1E4" strokeWidth={1} aria-hidden="true" />
              <blockquote className="font-body text-[15px] text-[#4A4A4A] leading-relaxed">
                {r.text}
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full font-display text-base font-bold text-[#8b5a5a]"
                  style={{ backgroundColor: "#F8E1E4" }}
                  aria-hidden="true"
                >
                  {r.name.charAt(0)}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-body text-sm font-semibold text-[#2D2D2D] truncate">{r.name}</span>
                    <Stars rating={r.rating} size={12} />
                  </div>
                  <p className="font-body text-xs text-[#6B6B6B] truncate">
                    {r.city} · {r.product}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
