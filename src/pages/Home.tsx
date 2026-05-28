import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Heart,
  ShoppingBag,
  Truck,
  Search,
  MessageCircle,
  Phone,
  Mail,
  Instagram,
  Facebook,
  MapPin,
  Check,
  Baby,
  Leaf,
  Package,
} from "lucide-react";
import { trpc } from "@/providers/trpc";
import ProductCard from "@/components/ProductCard";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    name: "Bodies \u0026 Enteritos",
    slug: "bodies",
    image: "/images/categories/bodies.jpg",
    color: "#C5D5C0",
  },
  {
    name: "Conjuntos",
    slug: "conjuntos",
    image: "/images/categories/conjuntos.jpg",
    color: "#F8E1E4",
  },
  {
    name: "Accesorios",
    slug: "accesorios",
    image: "/images/categories/accesorios.jpg",
    color: "#FAD4C0",
  },
  {
    name: "Para Regalo",
    slug: "regalo",
    image: "/images/categories/regalo.jpg",
    color: "#E8F5E9",
  },
];

const steps = [
  {
    icon: Search,
    title: "Elegí",
    desc: "Seleccioná las prendas que te gusten de nuestro catálogo",
  },
  {
    icon: ShoppingBag,
    title: "Agregá al carrito",
    desc: "Sumá los productos y envianos tu pedido por WhatsApp",
  },
  {
    icon: Truck,
    title: "Recibí en casa",
    desc: "Coordinamos el envío y te llega a la puerta de tu casa",
  },
];

const features = [
  { icon: Baby, text: "Ropa de 0 a 24 meses" },
  { icon: Leaf, text: "Materiales hipoalergénicos" },
  { icon: Package, text: "Envíos a todo Argentina" },
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  const { data: featuredProducts } = trpc.product.featured.useQuery();

  // Hero entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      tl.fromTo(".hero-eyebrow", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, 0.1)
        .fromTo(".hero-title", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.2)
        .fromTo(".hero-subtitle", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.4)
        .fromTo(".hero-cta", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.6);
    }, heroRef);
    return () => ctx.revert();
  }, []);

  // Scroll-triggered animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Categories
      if (categoriesRef.current) {
        gsap.fromTo(
          categoriesRef.current.querySelectorAll(".category-card"),
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: categoriesRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Featured products
      if (featuredRef.current) {
        gsap.fromTo(
          featuredRef.current.querySelectorAll(".product-card"),
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: featuredRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // About section
      if (aboutRef.current) {
        gsap.fromTo(
          aboutRef.current.querySelector(".about-image"),
          { x: -40, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: aboutRef.current,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          }
        );
        gsap.fromTo(
          aboutRef.current.querySelector(".about-text"),
          { x: 40, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            delay: 0.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: aboutRef.current,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Steps
      if (stepsRef.current) {
        gsap.fromTo(
          stepsRef.current.querySelectorAll(".step-item"),
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.15,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: stepsRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Contact
      if (contactRef.current) {
        gsap.fromTo(
          contactRef.current.querySelector(".contact-info"),
          { x: -20, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: contactRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
        gsap.fromTo(
          contactRef.current.querySelector(".contact-image"),
          { x: 20, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.5,
            delay: 0.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: contactRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, [featuredProducts]);

  return (
    <div>
      {/* ============ HERO ============ */}
      <section
        ref={heroRef}
        className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-[#FFF8F0]"
      >
        {/* Decorative blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#F8E1E4] opacity-40" style={{ filter: "blur(100px)" }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#E8F5E9] opacity-40" style={{ filter: "blur(100px)" }} />
        <div className="absolute top-[30%] right-[10%] w-[30vw] h-[30vw] rounded-full bg-[#FAD4C0] opacity-30" style={{ filter: "blur(80px)" }} />

        <div className="relative z-10 text-center px-6" style={{ maxWidth: 700 }}>
          <p className="hero-eyebrow font-body text-sm uppercase tracking-[3px] text-[#6B6B6B] mb-4">
            Ropa de bebé · Ituzaingó, Buenos Aires
          </p>
          <h1 className="hero-title font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-[#2D2D2D] leading-[1.1]">
            Bienvenidos a <span className="text-[#F8E1E4]">Melli Melos</span>
          </h1>
          <p className="hero-subtitle font-body text-lg text-[#2D2D2D]/80 mt-6 mx-auto" style={{ maxWidth: 520, lineHeight: 1.7 }}>
            La ropa más suave y hermosa para los más pequeños. Desde recién nacidos hasta 24 meses, cada prenda está pensada con amor.
          </p>
          <div className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link
              to="/catalogo"
              className="inline-flex items-center gap-2 bg-[#F8E1E4] text-[#2D2D2D] font-body font-medium px-8 py-3.5 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              <Heart size={18} />
              Ver colección
            </Link>
            <a
              href="https://wa.me/5491134848466"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-[#2D2D2D] text-[#2D2D2D] font-body font-medium px-8 py-3.5 rounded-full hover:bg-[#2D2D2D] hover:text-white transition-colors"
            >
              <MessageCircle size={18} />
              Contactar por WhatsApp
            </a>
          </div>
        </div>

        {/* Floating badge */}
        <div className="absolute bottom-8 right-6 z-10 bg-[#E8F5E9] text-[#2D2D2D] font-body text-sm font-medium px-4 py-2 rounded-full animate-pulse">
          Envíos a todo el país 🇦🇷
        </div>
      </section>

      {/* ============ CATEGORIES ============ */}
      <section ref={categoriesRef} className="py-20 px-6">
        <div className="mx-auto" style={{ maxWidth: 1280 }}>
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-semibold text-[#2D2D2D]">
              Nuestras Categorías
            </h2>
            <p className="font-body text-[#6B6B6B] mt-2">
              Encontrá lo que buscás para tu bebé
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <Link
                key={cat.slug}
                to={`/catalogo?categoria=${cat.slug}`}
                className="category-card group relative h-[280px] rounded-2xl overflow-hidden bg-[#F5F0EB] cursor-pointer"
                onMouseEnter={() => setActiveCategory(i)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
                    activeCategory === i ? "opacity-100 scale-105" : "opacity-0 scale-100"
                  }`}
                />
                <div
                  className={`absolute inset-0 transition-opacity duration-400 ${
                    activeCategory === i ? "opacity-60" : "opacity-0"
                  }`}
                  style={{ backgroundColor: cat.color }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                  <h3 className="font-display text-2xl font-semibold text-[#2D2D2D] text-center px-4">
                    {cat.name}
                  </h3>
                  <div
                    className="w-12 h-1 mt-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURED PRODUCTS ============ */}
      <section ref={featuredRef} className="py-20 px-6 bg-[#F5F0EB]/30">
        <div className="mx-auto" style={{ maxWidth: 1280 }}>
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display text-4xl font-semibold text-[#2D2D2D]">
                Destacados
              </h2>
              <p className="font-body text-[#6B6B6B] mt-1">
                Nuestras prendas más elegidas
              </p>
            </div>
            <Link
              to="/catalogo"
              className="hidden sm:inline-flex items-center gap-1 font-body font-medium text-sm text-[#D4A5A5] hover:text-[#2D2D2D] transition-colors"
            >
              Ver todos <span className="text-lg">→</span>
            </Link>
          </div>

          {featuredProducts && featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl h-[400px] animate-pulse" />
              ))}
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link
              to="/catalogo"
              className="inline-flex items-center gap-1 font-body font-medium text-sm text-[#D4A5A5]"
            >
              Ver todos <span className="text-lg">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ ABOUT ============ */}
      <section ref={aboutRef} id="nosotros" className="py-20 px-6">
        <div className="mx-auto" style={{ maxWidth: 1280 }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="about-image">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
                <img
                  src="/images/categories/bodies.jpg"
                  alt="Ropa de bebé Melli Melos"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D2D2D]/10 to-transparent" />
              </div>
            </div>

            {/* Text */}
            <div className="about-text">
              <p className="font-body text-sm uppercase tracking-[2px] text-[#6B6B6B] mb-3">
                Nuestra historia
              </p>
              <h2 className="font-display text-4xl font-semibold text-[#2D2D2D] mb-6">
                Conocé Melli Melos
              </h2>
              <p className="font-body text-[#2D2D2D]/80 leading-relaxed mb-6">
                Somos una tienda familiar dedicada a la ropa de bebé. Cada prenda que elegimos está pensada para el confort y la delicadeza que los más chiquitos merecen. Trabajamos con materiales suaves, diseños prácticos y mucho amor.
              </p>
              <p className="font-body text-[#2D2D2D]/80 leading-relaxed mb-8">
                Estamos en Ituzaingó, Buenos Aires, y hacemos envíos a todo el país. Nuestro objetivo es que cada bebé esté cómodo, abrigado y adorable.
              </p>

              <div className="space-y-3 mb-8">
                {features.map((f) => (
                  <div key={f.text} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#E8F5E9] flex items-center justify-center">
                      <Check size={14} className="text-[#2D2D2D]" />
                    </div>
                    <span className="font-body text-[#2D2D2D]">{f.text}</span>
                  </div>
                ))}
              </div>

              <a
                href="https://wa.me/5491134848466"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#F8E1E4] text-[#2D2D2D] font-body font-medium px-8 py-3.5 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                <MessageCircle size={18} />
                Contactanos
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============ HOW TO ORDER ============ */}
      <section ref={stepsRef} className="py-20 px-6 bg-[#F5F0EB]">
        <div className="mx-auto" style={{ maxWidth: 1280 }}>
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-semibold text-[#2D2D2D]">
              Cómo Comprar
            </h2>
            <p className="font-body text-[#6B6B6B] mt-2">
              Es muy fácil tener la ropita de tu bebé
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="step-item flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-[#F8E1E4] flex items-center justify-center mb-4">
                    <span className="font-display text-xl font-semibold text-[#2D2D2D]">
                      {i + 1}
                    </span>
                  </div>
                  <Icon size={28} strokeWidth={1.5} className="text-[#D4A5A5] mb-3" />
                  <h3 className="font-display text-xl font-semibold text-[#2D2D2D] mb-2">
                    {step.title}
                  </h3>
                  <p className="font-body text-sm text-[#6B6B6B]" style={{ maxWidth: 280 }}>
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ CONTACT ============ */}
      <section ref={contactRef} id="contacto" className="py-20 px-6">
        <div className="mx-auto" style={{ maxWidth: 1280 }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Contact info */}
            <div className="contact-info">
              <h2 className="font-display text-4xl font-semibold text-[#2D2D2D] mb-4">
                Contacto
              </h2>
              <p className="font-body text-[#6B6B6B] mb-8">
                Estamos acá para ayudarte con tu consulta o pedido.
              </p>

              <div className="space-y-5">
                <a
                  href="https://wa.me/5491134848466"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-11 h-11 rounded-full bg-[#E8F5E9] flex items-center justify-center group-hover:bg-[#C5D5C0] transition-colors">
                    <Phone size={18} className="text-[#2D2D2D]" />
                  </div>
                  <div>
                    <p className="font-body text-xs text-[#6B6B6B]">WhatsApp</p>
                    <p className="font-body font-medium text-[#2D2D2D]">+54 9 11 3484-8466</p>
                  </div>
                </a>

                <a href="mailto:ventasmellimelos@gmail.com" className="flex items-center gap-4 group">
                  <div className="w-11 h-11 rounded-full bg-[#F8E1E4] flex items-center justify-center group-hover:bg-[#D4A5A5] transition-colors">
                    <Mail size={18} className="text-[#2D2D2D]" />
                  </div>
                  <div>
                    <p className="font-body text-xs text-[#6B6B6B]">Email</p>
                    <p className="font-body font-medium text-[#2D2D2D]">ventasmellimelos@gmail.com</p>
                  </div>
                </a>

                <a
                  href="https://www.instagram.com/melli_melos/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-11 h-11 rounded-full bg-[#FAD4C0] flex items-center justify-center group-hover:bg-[#F8E1E4] transition-colors">
                    <Instagram size={18} className="text-[#2D2D2D]" />
                  </div>
                  <div>
                    <p className="font-body text-xs text-[#6B6B6B]">Instagram</p>
                    <p className="font-body font-medium text-[#2D2D2D]">@melli_melos</p>
                  </div>
                </a>

                <a
                  href="https://www.facebook.com/mellimelosropadebebes/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-11 h-11 rounded-full bg-[#E8F5E9] flex items-center justify-center group-hover:bg-[#C5D5C0] transition-colors">
                    <Facebook size={18} className="text-[#2D2D2D]" />
                  </div>
                  <div>
                    <p className="font-body text-xs text-[#6B6B6B]">Facebook</p>
                    <p className="font-body font-medium text-[#2D2D2D]">Melli Melos Ropa de Bebes</p>
                  </div>
                </a>

                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#F5F0EB] flex items-center justify-center">
                    <MapPin size={18} className="text-[#2D2D2D]" />
                  </div>
                  <div>
                    <p className="font-body text-xs text-[#6B6B6B]">Dirección</p>
                    <p className="font-body font-medium text-[#2D2D2D]">
                      Calle Francisco Emperanza 2700, Ituzaingó
                    </p>
                  </div>
                </div>
              </div>

              <a
                href="https://wa.me/5491134848466"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#F8E1E4] text-[#2D2D2D] font-body font-medium px-8 py-3.5 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-transform mt-8"
              >
                <MessageCircle size={18} />
                Escribinos por WhatsApp
              </a>
            </div>

            {/* Image */}
            <div className="contact-image hidden lg:block">
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden">
                <img
                  src="/images/categories/conjuntos.jpg"
                  alt="Contacto Melli Melos"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D2D2D]/10 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
