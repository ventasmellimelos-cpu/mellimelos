import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Heart, ShoppingBag, Truck, Search, MessageCircle,
  Check, Baby, Leaf, Package, Star, ArrowRight, Shield,
  Clock, Gift
} from "lucide-react";
import ProductCard from "@/components/ProductCard";

gsap.registerPlugin(ScrollTrigger);

// Hardcoded featured products for static deployment (no backend needed)
const featuredProducts = [
  { id: 1, name: "Body Manga Larga Premium", description: "Body de algodón orgánico", price: "4999.00", salePrice: "3999.00", imageUrl: "/images/products/product-1.jpg", category: "bodies", sizes: ["0-3m","3-6m","6-9m"], isFeatured: true, isNew: true, isBestseller: true, stock: 25 },
  { id: 2, name: "Buzo Polar con Pie", description: "Buzo polar ultra suave", price: "6999.00", salePrice: "4899.00", imageUrl: "/images/products/product-2.jpg", category: "conjuntos", sizes: ["0-3m","3-6m","6-9m"], isFeatured: true, isNew: false, isBestseller: true, stock: 18 },
  { id: 3, name: "Conjunto Tejido Sage", description: "Saquito tejido y pantalón", price: "7999.00", salePrice: "5599.00", imageUrl: "/images/products/product-3.jpg", category: "conjuntos", sizes: ["0-3m","3-6m","6-9m"], isFeatured: true, isNew: true, isBestseller: false, stock: 12 },
  { id: 4, name: "Set Gorro y Manoplas", description: "Set en color peach", price: "3499.00", salePrice: "2799.00", imageUrl: "/images/products/product-4.jpg", category: "accesorios", sizes: ["0-3m","3-6m"], isFeatured: true, isNew: false, isBestseller: true, stock: 30 },
  { id: 5, name: "Body Nubes Mint", description: "Body con estampado de nubes", price: "4999.00", salePrice: "3999.00", imageUrl: "/images/products/product-5.jpg", category: "bodies", sizes: ["0-3m","3-6m","6-9m"], isFeatured: true, isNew: false, isBestseller: false, stock: 20 },
  { id: 6, name: "Manta Waffle Premium", description: "Manta textura waffle crema", price: "5499.00", salePrice: "3849.00", imageUrl: "/images/products/product-6.jpg", category: "accesorios", sizes: ["UNICO"], isFeatured: true, isNew: true, isBestseller: false, stock: 15 },
];

const categories = [
  { name: "Bodies", slug: "bodies", image: "/images/categories/bodies.jpg", color: "#C5D5C0", count: "8 productos" },
  { name: "Conjuntos", slug: "conjuntos", image: "/images/categories/conjuntos.jpg", color: "#F8E1E4", count: "7 productos" },
  { name: "Accesorios", slug: "accesorios", image: "/images/categories/accesorios.jpg", color: "#FAD4C0", count: "5 productos" },
  { name: "Para Regalo", slug: "regalo", image: "/images/categories/regalo.jpg", color: "#E8F5E9", count: "4 productos" },
];

const steps = [
  { icon: Search, title: "Elegí", desc: "Seleccioná las prendas que te gusten de nuestro catálogo" },
  { icon: ShoppingBag, title: "Agregá al carrito", desc: "Sumá los productos y envianos tu pedido por WhatsApp" },
  { icon: Truck, title: "Recibí en casa", desc: "Coordinamos el envío y te llega a la puerta de tu casa" },
];

const features = [
  { icon: Baby, text: "Ropa de 0 a 24 meses" },
  { icon: Leaf, text: "Materiales hipoalergénicos" },
  { icon: Package, text: "Envíos a todo Argentina" },
];

const trustBadges = [
  { icon: Shield, title: "Mercado Líder Platinum", desc: "Máxima confianza" },
  { icon: Truck, title: "Envío gratis", desc: "En compras +$25.000" },
  { icon: Heart, title: "Hecho con amor", desc: "Cada prenda especial" },
  { icon: Clock, title: "Entrega rápida", desc: "2-5 días hábiles" },
];

const testimonials = [
  { name: "Mariana G.", text: "La calidad de la ropa es increíble. Mi bebé está súper cómodo y se ve divino. ¡Voy a volver a comprar!", stars: 5 },
  { name: "Carolina R.", text: "Pedí un set de regalo para mi sobrina y llegó perfecto, en una caja hermosa. Melli Melos es mi tienda de confianza.", stars: 5 },
  { name: "Lucía M.", text: "El buzo polar es una ternura. Mantiene calentito a mi hijo y la tela es suavísima. Recomiendo 100%.", stars: 5 },
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  // Hero entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(".hero-badge", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, 0.2)
        .fromTo(".hero-title", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.3)
        .fromTo(".hero-subtitle", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.5)
        .fromTo(".hero-cta", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.7)
        .fromTo(".hero-trust", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, 0.9);
    }, heroRef);
    return () => ctx.revert();
  }, []);

  // Scroll reveals
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".reveal-up").forEach((el) => {
        gsap.fromTo(el, { y: 40, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.6, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" }
        });
      });
      gsap.utils.toArray<HTMLElement>(".reveal-stagger").forEach((el) => {
        const items = el.querySelectorAll(".reveal-item");
        gsap.fromTo(items, { y: 30, opacity: 0 }, {
          y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" }
        });
      });
    });
    return () => ctx.revert();
  }, [featuredProducts]);

  return (
    <div className="bg-[#FFF8F0]">
      {/* ============ HERO ============ */}
      <section ref={heroRef} className="relative min-h-[100dvh] flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img src="/images/hero-lifestyle.jpg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FFF8F0]/95 via-[#FFF8F0]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FFF8F0] via-transparent to-[#FFF8F0]/30" />
        </div>

        {/* Floating decorative elements */}
        <div className="absolute top-[15%] right-[10%] w-[300px] h-[300px] rounded-full bg-[#F8E1E4]/30" style={{ filter: "blur(80px)" }} />
        <div className="absolute bottom-[20%] right-[20%] w-[200px] h-[200px] rounded-full bg-[#E8F5E9]/30" style={{ filter: "blur(60px)" }} />

        <div className="relative z-10 mx-auto px-6" style={{ maxWidth: 1280 }}>
          <div className="max-w-[600px]">
            <div className="hero-badge inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 shadow-sm">
              <Star size={14} className="text-[#FAD4C0]" fill="#FAD4C0" />
              <span className="font-body text-sm text-[#6B6B6B]">Más de 1.000 mamás felices</span>
            </div>

            <h1 className="hero-title font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-[#2D2D2D] leading-[1.05] mb-6">
              La ropa más<br />
              <span className="text-[#D4A5A5]">suave</span> para tu<br />
              bebé
            </h1>

            <p className="hero-subtitle font-body text-lg text-[#6B6B6B] leading-relaxed mb-8 max-w-[480px]">
              Cada prenda está pensada con amor. Desde recién nacidos hasta 24 meses, 
              en Carlos Spegazzini, Partido de Ezeiza, Buenos Aires. Envíos a todo el país.
            </p>

            <div className="hero-cta flex flex-col sm:flex-row items-start gap-4 mb-10">
              <Link
                to="/catalogo"
                className="group inline-flex items-center gap-3 bg-[#2D2D2D] text-white font-body font-medium px-8 py-4 rounded-full hover:bg-[#F8E1E4] hover:text-[#2D2D2D] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/10"
              >
                Ver colección
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="https://wa.me/5491134848466"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm text-[#2D2D2D] font-body font-medium px-8 py-4 rounded-full border border-[#E8E0D8] hover:border-[#F8E1E4] hover:bg-white transition-all duration-300"
              >
                <MessageCircle size={18} className="text-[#25D366]" />
                Escribinos por WhatsApp
              </a>
            </div>

            {/* Trust mini-badges */}
            <div className="hero-trust flex flex-wrap gap-4">
              {features.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.text} className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2">
                    <Icon size={16} className="text-[#D4A5A5]" />
                    <span className="font-body text-xs text-[#6B6B6B]">{f.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Floating badge */}
        <div className="absolute bottom-8 right-6 z-10 bg-[#E8F5E9] text-[#2D2D2D] font-body text-sm font-medium px-5 py-2.5 rounded-full shadow-lg animate-pulse">
          Envíos a todo el país 🇦🇷
        </div>
      </section>

      {/* ============ TRUST BAR ============ */}
      <section className="py-8 bg-white border-y border-[#F0EBE5]">
        <div className="mx-auto px-6 reveal-stagger" style={{ maxWidth: 1280 }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustBadges.map((t) => {
              const Icon = t.icon;
              return (
                <div key={t.title} className="reveal-item flex items-center gap-3 justify-center">
                  <div className="w-10 h-10 rounded-full bg-[#F8E1E4]/40 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-[#D4A5A5]" />
                  </div>
                  <div>
                    <p className="font-body text-sm font-semibold text-[#2D2D2D]">{t.title}</p>
                    <p className="font-body text-xs text-[#6B6B6B]">{t.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ CATEGORIES ============ */}
      <section className="py-20 px-6">
        <div className="mx-auto" style={{ maxWidth: 1280 }}>
          <div className="text-center mb-14 reveal-up">
            <p className="font-body text-xs uppercase tracking-[3px] text-[#D4A5A5] mb-3">Explorá por categoría</p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#2D2D2D]">
              ¿Qué estás buscando?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 reveal-stagger">
            {categories.map((cat, i) => (
              <Link
                key={cat.slug}
                to={`/catalogo?categoria=${cat.slug}`}
                className="reveal-item group relative h-[320px] rounded-3xl overflow-hidden cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-500"
                onMouseEnter={() => setActiveCategory(i)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${activeCategory === i ? 'scale-110' : 'scale-100'}`}
                />
                <div className={`absolute inset-0 transition-opacity duration-500 ${activeCategory === i ? 'bg-black/40' : 'bg-black/20'}`} />
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center p-6">
                  <h3 className="font-display text-3xl font-bold text-white mb-2 drop-shadow-lg">
                    {cat.name}
                  </h3>
                  <p className="font-body text-sm text-white/80 mb-4">{cat.count}</p>
                  <span className="inline-flex items-center gap-1 font-body text-sm text-white bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    Ver productos <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURED PRODUCTS ============ */}
      <section className="py-20 px-6 bg-white">
        <div className="mx-auto" style={{ maxWidth: 1280 }}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 reveal-up">
            <div>
              <p className="font-body text-xs uppercase tracking-[3px] text-[#D4A5A5] mb-3">Nuestros favoritos</p>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#2D2D2D]">
                Productos destacados
              </h2>
            </div>
            <Link to="/catalogo" className="group mt-4 sm:mt-0 inline-flex items-center gap-2 font-body font-medium text-[#D4A5A5] hover:text-[#2D2D2D] transition-colors">
              Ver todo el catálogo <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {featuredProducts && featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 reveal-stagger">
              {featuredProducts.map((product) => (
                <div key={product.id} className="reveal-item">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => <div key={i} className="bg-[#F5F0EB] rounded-2xl h-[400px] animate-pulse" />)}
            </div>
          )}
        </div>
      </section>

      {/* ============ ABOUT ============ */}
      <section id="nosotros" className="py-20 px-6 bg-[#FFF8F0]">
        <div className="mx-auto" style={{ maxWidth: 1280 }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="reveal-up relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-[#D4A5A5]/10">
                <img src="/images/categories/bodies.jpg" alt="Ropa de bebé Melli Melos" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-5 shadow-xl">
                <p className="font-display text-3xl font-bold text-[#D4A5A5]">+3</p>
                <p className="font-body text-sm text-[#6B6B6B]">años cuidando<br />a los más chiquitos</p>
              </div>
            </div>

            <div className="reveal-up">
              <p className="font-body text-xs uppercase tracking-[3px] text-[#D4A5A5] mb-3">Nuestra historia</p>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#2D2D2D] mb-6">
                Conocé Melli Melos
              </h2>
              <p className="font-body text-[#6B6B6B] leading-relaxed mb-5">
                Somos una tienda familiar dedicada a la ropa de bebé. Cada prenda que elegimos está pensada para el confort y la delicadeza que los más chiquitos merecen.
              </p>
              <p className="font-body text-[#6B6B6B] leading-relaxed mb-8">
                Trabajamos con materiales suaves, diseños prácticos y mucho amor. Estamos en Constancio Vigil 150, Carlos Spegazzini, Partido de Ezeiza, Buenos Aires. Hacemos envíos a todo el país. ¡Somos Mercado Líder Platinum y también vendemos en Max Gise!
              </p>
              <div className="space-y-3 mb-8">
                {features.map((f) => (
                  <div key={f.text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#E8F5E9] flex items-center justify-center">
                      <Check size={14} className="text-[#4a7c59]" />
                    </div>
                    <span className="font-body text-[#2D2D2D]">{f.text}</span>
                  </div>
                ))}
              </div>
              <a href="https://wa.me/5491134848466" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#F8E1E4] text-[#2D2D2D] font-body font-medium px-8 py-3.5 rounded-full hover:scale-[1.02] transition-transform"
              >
                <MessageCircle size={18} /> Contactanos
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============ HOW TO ORDER ============ */}
      <section className="py-20 px-6 bg-[#2D2D2D]">
        <div className="mx-auto" style={{ maxWidth: 1280 }}>
          <div className="text-center mb-14 reveal-up">
            <p className="font-body text-xs uppercase tracking-[3px] text-[#D4A5A5] mb-3">Simple y rápido</p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white">
              ¿Cómo comprar?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 reveal-stagger">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="reveal-item text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#F8E1E4] flex items-center justify-center mx-auto mb-5 rotate-3 hover:rotate-0 transition-transform duration-300">
                    <span className="font-display text-2xl font-bold text-[#2D2D2D]">{i + 1}</span>
                  </div>
                  <Icon size={28} strokeWidth={1.5} className="text-[#D4A5A5] mx-auto mb-3" />
                  <h3 className="font-display text-xl font-semibold text-white mb-2">{step.title}</h3>
                  <p className="font-body text-sm text-white/50 max-w-[280px] mx-auto">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="py-20 px-6 bg-white">
        <div className="mx-auto" style={{ maxWidth: 1280 }}>
          <div className="text-center mb-14 reveal-up">
            <p className="font-body text-xs uppercase tracking-[3px] text-[#D4A5A5] mb-3">Testimonios</p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#2D2D2D]">
              Lo que dicen las mamás
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal-stagger">
            {testimonials.map((t) => (
              <div key={t.name} className="reveal-item bg-[#FFF8F0] rounded-3xl p-8 relative">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} size={16} className="text-[#FAD4C0]" fill="#FAD4C0" />
                  ))}
                </div>
                <p className="font-body text-[#2D2D2D] leading-relaxed mb-6 italic">
                  "{t.text}"
                </p>
                <p className="font-body text-sm font-semibold text-[#D4A5A5]">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CONTACT ============ */}
      <section id="contacto" className="py-20 px-6 bg-[#FFF8F0]">
        <div className="mx-auto" style={{ maxWidth: 1280 }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="reveal-up">
              <p className="font-body text-xs uppercase tracking-[3px] text-[#D4A5A5] mb-3">Estamos para ayudarte</p>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#2D2D2D] mb-4">
                Contactanos
              </h2>
              <p className="font-body text-[#6B6B6B] mb-10">
                ¿Tenés dudas sobre talles, envíos o stock? Escribinos y te respondemos al toque.
              </p>

              <div className="space-y-5">
                {[
                  { icon: MessageCircle, label: "WhatsApp", value: "+54 9 11 3484-8466", href: "https://wa.me/5491134848466", color: "bg-[#E8F5E9]" },
                  { icon: ShoppingBag, label: "Instagram", value: "@melli_melos", href: "https://www.instagram.com/melli_melos/", color: "bg-[#F8E1E4]" },
                  { icon: Gift, label: "Email", value: "ventasmellimelos@gmail.com", href: "mailto:ventasmellimelos@gmail.com", color: "bg-[#FAD4C0]" },
                ].map((item) => (
                  <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                    <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <item.icon size={20} className="text-[#2D2D2D]" />
                    </div>
                    <div>
                      <p className="font-body text-xs text-[#6B6B6B] uppercase tracking-wider">{item.label}</p>
                      <p className="font-body font-medium text-[#2D2D2D]">{item.value}</p>
                    </div>
                  </a>
                ))}
              </div>

              <a href="https://wa.me/5491134848466" target="_blank" rel="noopener noreferrer"
                className="mt-10 inline-flex items-center gap-2 bg-[#25D366] text-white font-body font-medium px-8 py-4 rounded-full hover:scale-[1.02] transition-transform shadow-lg shadow-green-500/20"
              >
                <MessageCircle size={20} /> Escribinos por WhatsApp
              </a>
            </div>

            <div className="reveal-up hidden lg:block">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-[#D4A5A5]/10">
                <img src="/images/categories/conjuntos.jpg" alt="Contacto" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
