import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { ShoppingBag, Menu, X, Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { to: "/", label: "Inicio" },
  { to: "/catalogo", label: "Catálogo" },
  { to: "/#nosotros", label: "Nosotros" },
  { to: "/#contacto", label: "Contacto" },
];

export default function Navbar() {
  const { totalItems, setIsOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  const isActive = (to: string) => {
    if (to.startsWith("/#")) return location.pathname === "/";
    return location.pathname === to;
  };

  return (
    <>
      {/* Top announcement bar */}
      <div className={`fixed top-0 left-0 right-0 z-[60] bg-[#2D2D2D] text-white text-center py-1.5 transition-transform duration-300 ${scrolled ? '-translate-y-full' : 'translate-y-0'}`}>
        <p className="font-body text-xs tracking-wide">
          🏆 Mercado Líder Platinum | Envíos gratis en compras +$25.000 🚚💕
        </p>
      </div>

      <nav
        className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "top-0 bg-white/95 backdrop-blur-xl shadow-[0_1px_20px_rgba(0,0,0,0.06)]"
            : "top-[30px] bg-transparent"
        }`}
        style={{ height: 72 }}
      >
        <div className="mx-auto flex h-full items-center justify-between px-6" style={{ maxWidth: 1280 }}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Heart size={20} className="text-[#D4A5A5] group-hover:scale-110 transition-transform" fill="#F8E1E4" />
            <span className="font-accent text-2xl font-bold text-[#D4A5A5] group-hover:text-[#c98e8e] transition-colors">
              Melli Melos
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) =>
              link.to.startsWith("/#") ? (
                <Link
                  key={link.to}
                  to={link.to === "/#nosotros" ? "/" : link.to}
                  onClick={() => {
                    if (link.to.startsWith("/#") && location.pathname === "/") {
                      document.getElementById(link.to.replace("/#", ""))?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className={`font-body text-sm font-medium tracking-wide transition-colors relative group ${
                    isActive(link.to) ? "text-[#2D2D2D]" : "text-[#6B6B6B] hover:text-[#2D2D2D]"
                  }`}
                >
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 h-[2px] bg-[#F8E1E4] rounded-full transition-all duration-300 ${isActive(link.to) ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                </Link>
              ) : (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`font-body text-sm font-medium tracking-wide transition-colors relative group ${
                    isActive(link.to) ? "text-[#2D2D2D]" : "text-[#6B6B6B] hover:text-[#2D2D2D]"
                  }`}
                >
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 h-[2px] bg-[#F8E1E4] rounded-full transition-all duration-300 ${isActive(link.to) ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                </Link>
              )
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsOpen(true)}
              className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-[#F8E1E4]/60 hover:bg-[#F8E1E4] text-[#2D2D2D] transition-all duration-300 hover:scale-[1.02]"
              aria-label="Abrir carrito"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              <span className="hidden sm:inline font-body text-sm font-medium">Carrito</span>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#2D2D2D] text-white text-[0.65rem] font-bold animate-bounce">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-full hover:bg-[#F5F0EB] transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[70] bg-[#FFF8F0] flex flex-col items-center justify-center gap-8 animate-in fade-in duration-300">
          <button onClick={() => setMobileOpen(false)} className="absolute top-6 right-6 p-2">
            <X size={28} />
          </button>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to.startsWith("/#") ? "/" : link.to}
              onClick={() => setMobileOpen(false)}
              className="font-display text-3xl font-semibold text-[#2D2D2D] hover:text-[#D4A5A5] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => { setIsOpen(true); setMobileOpen(false); }}
            className="mt-4 flex items-center gap-2 bg-[#F8E1E4] px-8 py-3 rounded-full font-body font-medium"
          >
            <ShoppingBag size={18} />
            Ver carrito {totalItems > 0 && `(${totalItems})`}
          </button>
        </div>
      )}
    </>
  );
}
