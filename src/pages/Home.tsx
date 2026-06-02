import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Heart, Truck, Search, MessageCircle, Check, Baby, Leaf, Package,
  Star, ArrowRight, Shield, Clock, Gift, ShoppingBag, Mail
} from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { useSettings } from "@/context/SettingsContext";
import { useSeo } from "@/hooks/useSeo";

gsap.registerPlugin(ScrollTrigger);

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

const featuredProducts = [
  { id: 1, name: "Body Manga Larga Premium", description: "Body de algodón orgánico", price: "49990.00", salePrice: "39990.00", images: ["/images/products/product-1.jpg"], category: "bodies", sizes: ["0-3m","3-6m","6-9m"], colors: ["Blanco","Rosa","Celeste"], variants: [{color:"Blanco",colorHex:"#FFFFFF",size:"0-3m",stock:10},{color:"Rosa",colorHex:"#F8E1E4",size:"3-6m",stock:12},{color:"Celeste",colorHex:"#B8D4E3",size:"6-9m",stock:8}], isFeatured: true, isNew: true, isBestseller: true, stock: 25 },
  { id: 2, name: "Buzo Polar con Pie", description: "Buzo polar ultra suave", price: "69990.00", salePrice: "48990.00", images: ["/images/products/product-2.jpg"], category: "conjuntos", sizes: ["0-3m","3-6m","6-9m"], colors: ["Blanco","Rosa","Gris"], variants: [{color:"Blanco",colorHex:"#FFFFFF",size:"0-3m",stock:10},{color:"Rosa",colorHex:"#F8E1E4",size:"3-6m",stock:12},{color:"Gris",colorHex:"#D0D0D0",size:"6-9m",stock:8}], isFeatured: true, isNew: false, isBestseller: true, stock: 18 },
  { id: 3, name: "Conjunto Tejido Sage", description: "Saquito tejido y pantalón", price: "79990.00", salePrice: "55990.00", images: ["/images/products/product-3.jpg"], category: "conjuntos", sizes: ["0-3m","3-6m","6-9m"], colors: ["Blanco","Celeste","Gris"], variants: [{color:"Blanco",colorHex:"#FFFFFF",size:"0-3m",stock:10},{color:"Celeste",colorHex:"#B8D4E3",size:"3-6m",stock:12},{color:"Gris",colorHex:"#D0D0D0",size:"6-9m",stock:8}], isFeatured: true, isNew: true, isBestseller: false, stock: 12 },
  { id: 4, name: "Set Gorro y Manoplas", description: "Set en color peach", price: "34990.00", salePrice: "27990.00", images: ["/images/products/product-4.jpg"], category: "accesorios", sizes: ["0-3m","3-6m"], colors: ["Rosa","Celeste"], variants: [{color:"Rosa",colorHex:"#F8E1E4",size:"0-3m",stock:15},{color:"Celeste",colorHex:"#B8D4E3",size:"3-6m",stock:10}], isFeatured: true, isNew: false, isBestseller: true, stock: 30 },
  { id: 5, name: "Body Nubes Mint", description: "Body con estampado de nubes", price: "49990.00", salePrice: "39990.00", images: ["/images/products/product-5.jpg"], category: "bodies", sizes: ["0-3m","3-6m","6-9m"], colors: ["Blanco","Celeste","Gris"], variants: [{color:"Blanco",colorHex:"#FFFFFF",size:"0-3m",stock:10},{color:"Celeste",colorHex:"#B8D4E3",size:"3-6m",stock:12},{color:"Gris",colorHex:"#D0D0D0",size:"6-9m",stock:8}], isFeatured: true, isNew: false, isBestseller: false, stock: 20 },
  { id: 6, name: "Manta Waffle Premium", description: "Manta textura waffle crema", price: "54990.00", salePrice: "38490.00", images: ["/images/products/product-6.jpg"], category: "accesorios", sizes: ["UNICO"], colors: ["Blanco","Rosa"], variants: [{color:"Blanco",colorHex:"#FFFFFF",size:"UNICO",stock:20},{color:"Rosa",colorHex:"#F8E1E4",size:"UNICO",stock:15}], isFeatured: true, isNew: true, isBestseller: false, stock: 15 },
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const { get } = useSettings();

  useSeo({
    title: "Melli Melos | Ropa de Bebé Premium en Argentina | Envíos a Todo el País",
    description: "Melli Melos: ropa de bebé premium en Buenos Aires. Bodies, conjuntos, accesorios y sets de regalo de 0 a 24 meses. Materiales hipoalergénicos y envíos a toda Argentina.",
    path: "/",
  });

  const trustBadges = [
    { icon: Shield, title: get("trust_badge_1_title"), desc: get("trust_badge_1_desc") },
    { icon: Truck, title: get("trust_badge_2_title"), desc: get("trust_badge_2_desc") },
    { icon: Heart, title: get("trust_badge_3_title"), desc: get("trust_badge_3_desc") },
    { icon: Clock, title: get("trust_badge_4_title"), desc: get("trust_badge_4_desc") },
  ];

  const aboutFeatures = get("about_features").split(",").map((f) => f.trim()).filter(Boolean);

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
  }, []);

  const whatsappUrl = `https://wa.me/${get("whatsapp")}`;

  return (
    <div className="bg-[#FFF8F0]">
      {/* ============ HERO ============ */}
      <section ref={heroRef} className="relative min-h-[100dvh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/hero-lifestyle.jpg" alt="Bebé con ropa premium de Melli Melos" className="w-full h-full object-cover" fetchPriority="high" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FFF8F0]/95 via-[#FFF8F0]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FFF8F0] via-transparent to-[#FFF8F0]/30" />
        </div>
        <div className="absolute top-[15%] right-[10%] w-[300px] h-[300px] rounded-full bg-[#F8E1E4]/30" style={{ filter: "blur(80px)" }} />
        <div className="absolute bottom-[20%] right-[20%] w-[200px] h-[200px] rounded-full bg-[#E8F5E9]/30" style={{ filter: "blur(60px)" }} />

        <div className="relative z-10 mx-auto px-6" style={{ maxWidth: 1280 }}>
          <div className="max-w-[600px]">
            <div className="hero-badge inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 shadow-sm">
              <Star size={14} className="text-[#FAD4C0]" fill="#FAD4C0" />
              <span className="font-body text-sm text-[#6B6B6B]">Más de 1.000 mamás felices</span>
            </div>

            <h1 className="hero-title font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-[#2D2D2D] leading-[1.05] mb-6">
              {get("hero_title")}
            </h1>

            <p className="hero-subtitle font-body text-lg text-[#6B6B6B] leading-relaxed mb-8 max-w-[480px] whitespace-pre-line">
              {get("hero_subtitle")}
            </p>

            <div className="hero-cta flex flex-col sm:flex-row items-start gap-4 mb-10">
              <Link to="/catalogo"
                className="group inline-flex items-center gap-3 bg-[#2D2D2D] text-white font-body font-medium px-8 py-4 rounded-full hover:bg-[#F8E1E4] hover:text-[#2D2D2D] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/10"
              >
                {get("hero_cta_primary")}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm text-[#2D2D2D] font-body font-medium px-8 py-4 rounded-full border border-[#E8E0D8] hover:border-[#F8E1E4] hover:bg-white transition-all duration-300"
              >
                <MessageCircle size={18} className="text-[#25D366]" />
                {get("hero_cta_secondary")}
              </a>
            </div>

            <div className="hero-trust flex flex-wrap gap-4">
              {[
                { icon: Baby, text: "Ropa de 0 a 24 meses" },
                { icon: Leaf, text: "Materiales hipoalergénicos" },
                { icon: Package, text: "Envíos a todo Argentina" },
              ].map((f) => {
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
                <img src={cat.image} alt={`Ropa de bebé: ${cat.name}`} loading="lazy" decoding="async" className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${activeCategory === i ? 'scale-110' : 'scale-100'}`} />
                <div className={`absolute inset-0 transition-opacity duration-500 ${activeCategory === i ? 'bg-black/40' : 'bg-black/20'}`} />
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center p-6">
                  <h3 className="font-display text-3xl font-bold text-white mb-2 drop-shadow-lg">{cat.name}</h3>
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
              <p className="font-body text-xs uppercase tracking-[3px] text-[#D4A5A5] mb-3">{get("featured_subtitle")}</p>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#2D2D2D]">
                {get("featured_title")}
              </h2>
            </div>
            <Link to="/catalogo" className="group mt-4 sm:mt-0 inline-flex items-center gap-2 font-body font-medium text-[#D4A5A5] hover:text-[#2D2D2D] transition-colors">
              Ver todo el catálogo <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 reveal-stagger">
            {featuredProducts.map((product) => (
              <div key={product.id} className="reveal-item">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ ABOUT ============ */}
      <section id="nosotros" className="py-20 px-6 bg-[#FFF8F0]">
        <div className="mx-auto" style={{ maxWidth: 1280 }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="reveal-up relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-[#D4A5A5]/10">
                <img src="/images/categories/bodies.jpg" alt="Ropa de bebé Melli Melos" loading="lazy" decoding="async" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-5 shadow-xl">
                <p className="font-display text-3xl font-bold text-[#D4A5A5]">+3</p>
                <p className="font-body text-sm text-[#6B6B6B]">años cuidando<br />a los más chiquitos</p>
              </div>
            </div>

            <div className="reveal-up">
              <p className="font-body text-xs uppercase tracking-[3px] text-[#D4A5A5] mb-3">Nuestra historia</p>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#2D2D2D] mb-6">
                {get("about_title")}
              </h2>
              <p className="font-body text-[#6B6B6B] leading-relaxed mb-5">
                {get("store_description")}
              </p>
              <p className="font-body text-[#6B6B6B] leading-relaxed mb-8">
                {get("store_story")}
              </p>

              <div className="space-y-3 mb-8">
                {aboutFeatures.map((f) => (
                  <div key={f} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#E8F5E9] flex items-center justify-center">
                      <Check size={14} className="text-[#4a7c59]" />
                    </div>
                    <span className="font-body text-[#2D2D2D]">{f}</span>
                  </div>
                ))}
              </div>

              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
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

      {/* ============ CONTACT ============ */}
      <section id="contacto" className="py-20 px-6 bg-[#FFF8F0]">
        <div className="mx-auto" style={{ maxWidth: 1280 }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="reveal-up">
              <p className="font-body text-xs uppercase tracking-[3px] text-[#D4A5A5] mb-3">{get("contact_subtitle")}</p>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#2D2D2D] mb-4">
                {get("contact_title")}
              </h2>
              <p className="font-body text-[#6B6B6B] mb-10">
                ¿Tenés dudas sobre talles, envíos o stock? Escribinos y te respondemos al toque.
              </p>

              <div className="space-y-5">
                {[
                  { icon: MessageCircle, label: "WhatsApp", value: get("phone"), href: `https://wa.me/${get("whatsapp")}`, color: "bg-[#E8F5E9]" },
                  { icon: Gift, label: "Instagram", value: "@melli_melos", href: get("instagram"), color: "bg-[#F8E1E4]" },
                  { icon: Mail, label: "Email", value: get("email"), href: `mailto:${get("email")}`, color: "bg-[#FAD4C0]" },
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

              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                className="mt-10 inline-flex items-center gap-2 bg-[#25D366] text-white font-body font-medium px-8 py-4 rounded-full hover:scale-[1.02] transition-transform shadow-lg shadow-green-500/20"
              >
                <MessageCircle size={20} /> Escribinos por WhatsApp
              </a>
            </div>

            <div className="reveal-up hidden lg:block">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-[#D4A5A5]/10">
                <img src="/images/categories/conjuntos.jpg" alt="Conjuntos de ropa para bebé Melli Melos" loading="lazy" decoding="async" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
