import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { ShoppingBag, Menu, X } from "lucide-react";
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
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (to: string) => {
    if (to.startsWith("/#")) {
      return location.pathname === "/";
    }
    return location.pathname === to;
  };

  const handleNavClick = (to: string) => {
    if (to.startsWith("/#")) {
      const id = to.replace("/#", "");
      if (location.pathname === "/") {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
    setMobileOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl shadow-sm"
            : "bg-transparent"
        }`}
        style={{ height: 72 }}
      >
        <div className="mx-auto flex h-full items-center justify-between px-6" style={{ maxWidth: 1280 }}>
          {/* Logo */}
          <Link to="/" className="font-accent text-2xl font-bold text-[#D4A5A5] hover:opacity-80 transition-opacity">
            Melli Melos
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) =>
              link.to.startsWith("/#") ? (
                <Link
                  key={link.to}
                  to={link.to === "/#nosotros" ? "/" : link.to}
                  onClick={() => handleNavClick(link.to)}
                  className={`font-body text-[0.9375rem] font-medium transition-colors relative ${
                    isActive(link.to)
                      ? "text-[#2D2D2D]"
                      : "text-[#6B6B6B] hover:text-[#2D2D2D]"
                  }`}
                >
                  {link.label}
                  {isActive(link.to) && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#F8E1E4] rounded-full" />
                  )}
                </Link>
              ) : (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`font-body text-[0.9375rem] font-medium transition-colors relative ${
                    isActive(link.to)
                      ? "text-[#2D2D2D]"
                      : "text-[#6B6B6B] hover:text-[#2D2D2D]"
                  }`}
                >
                  {link.label}
                  {isActive(link.to) && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#F8E1E4] rounded-full" />
                  )}
                </Link>
              )
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsOpen(true)}
              className="relative flex items-center gap-2 text-[#2D2D2D] hover:text-[#D4A5A5] transition-colors"
              aria-label="Abrir carrito"
            >
              <ShoppingBag size={22} strokeWidth={1.5} />
              <span className="hidden sm:inline font-body text-[0.9375rem] font-medium">Carrito</span>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#F8E1E4] text-[0.6875rem] font-semibold text-[#2D2D2D]">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-[#2D2D2D]"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-[#FFF8F0] flex flex-col items-center justify-center gap-8">
          {navLinks.map((link) =>
            link.to.startsWith("/#") ? (
              <Link
                key={link.to}
                to="/"
                onClick={() => handleNavClick(link.to)}
                className="font-display text-3xl font-semibold text-[#2D2D2D] hover:text-[#D4A5A5] transition-colors"
              >
                {link.label}
              </Link>
            ) : (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="font-display text-3xl font-semibold text-[#2D2D2D] hover:text-[#D4A5A5] transition-colors"
              >
                {link.label}
              </Link>
            )
          )}
        </div>
      )}
    </>
  );
}
