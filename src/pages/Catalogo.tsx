import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Search, SlidersHorizontal } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { useSeo } from "@/hooks/useSeo";

const categoryTitles: Record<string, string> = {
  bodies: "Bodies para Bebé",
  conjuntos: "Conjuntos para Bebé",
  accesorios: "Accesorios para Bebé",
  regalo: "Sets de Regalo para Bebé",
};

gsap.registerPlugin(ScrollTrigger);

const categoryOptions = [
  { value: "", label: "Todas" },
  { value: "bodies", label: "Bodies" },
  { value: "conjuntos", label: "Conjuntos" },
  { value: "accesorios", label: "Accesorios" },
  { value: "regalo", label: "Regalo" },
];

const sortOptions = [
  { value: "newest", label: "Más recientes" },
  { value: "price_asc", label: "Precio: menor a mayor" },
  { value: "price_desc", label: "Precio: mayor a menor" },
  { value: "bestseller", label: "Más vendidos" },
];

export default function Catalogo() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("categoria") ?? undefined;

  const [category, setCategory] = useState<string | undefined>(
    initialCategory && categoryOptions.some((c) => c.value === initialCategory)
      ? initialCategory
      : undefined
  );
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"newest" | "price_asc" | "price_desc" | "bestseller">("newest");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const gridRef = useRef<HTMLDivElement>(null);

  const catLabel = category ? categoryTitles[category] : null;
  useSeo({
    title: catLabel
      ? `${catLabel} | Melli Melos | Envíos a Todo Argentina`
      : "Catálogo de Ropa de Bebé | Melli Melos | Envíos a Todo Argentina",
    description: catLabel
      ? `${catLabel} de 0 a 24 meses. Materiales hipoalergénicos y envíos a toda Argentina. Comprá en Melli Melos.`
      : "Explorá el catálogo completo de ropa de bebé Melli Melos: bodies, conjuntos, accesorios y sets de regalo de 0 a 24 meses. Envíos a toda Argentina.",
    path: category ? `/catalogo?categoria=${category}` : "/catalogo",
  });

  // Load products via REST API
  useEffect(() => {
    setIsLoading(true);
    const url = category
      ? `/api/products?category=${encodeURIComponent(category)}`
      : "/api/products";
    fetch(url)
      .then((r) => r.json())
      .then((json) => setProducts(json.items ?? []))
      .catch(() => setProducts([]))
      .finally(() => setIsLoading(false));
  }, [category]);

  // Update URL when category changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (category) {
      params.set("categoria", category);
    } else {
      params.delete("categoria");
    }
    setSearchParams(params, { replace: true });
  }, [category]);

  // Animate products on load
  useEffect(() => {
    if (gridRef.current && filteredProducts.length > 0) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          gridRef.current!.querySelectorAll(".catalog-product"),
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.06,
            duration: 0.4,
            ease: "power2.out",
          }
        );
      });
      return () => ctx.revert();
    }
  }, [products, sort, search]);

  // Filter and sort products client-side
  const filteredProducts = products
    .filter((p) => {
      if (!search) return true;
      return p.name.toLowerCase().includes(search.toLowerCase());
    })
    .sort((a, b) => {
      switch (sort) {
        case "price_asc": return parseFloat(a.price) - parseFloat(b.price);
        case "price_desc": return parseFloat(b.price) - parseFloat(a.price);
        case "bestseller": return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
        default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const totalPages = Math.ceil(filteredProducts.length / 12);
  const paginatedProducts = filteredProducts.slice((page - 1) * 12, page * 12);

  const handleCategoryChange = (cat: string) => {
    setCategory(cat || undefined);
    setPage(1);
  };

  return (
    <div className="min-h-screen pt-[72px] bg-[#FFF8F0]">
      <div className="mx-auto px-6 py-10" style={{ maxWidth: 1280 }}>
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 font-body text-sm text-[#6B6B6B] mb-4">
          <a href="/" className="hover:text-[#2D2D2D] transition-colors">Inicio</a>
          <span>/</span>
          <span className="text-[#2D2D2D]">Catálogo</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#2D2D2D]">
              Nuestro Catálogo
            </h1>
            <p className="font-body text-[#6B6B6B] mt-1">
              {filteredProducts.length} productos disponibles
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#E0D5CC] bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#F8E1E4] focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Filters bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategoryChange(cat.value)}
                className={`px-4 py-2 rounded-full font-body text-sm font-medium transition-all ${
                  category === cat.value || (!category && !cat.value)
                    ? "bg-[#F8E1E4] text-[#2D2D2D]"
                    : "bg-white text-[#6B6B6B] border border-[#E0D5CC] hover:border-[#F8E1E4]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E0D5CC] font-body text-sm"
            >
              <SlidersHorizontal size={16} />
              Filtros
            </button>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as typeof sort);
                setPage(1);
              }}
              className="px-4 py-2.5 rounded-full border border-[#E0D5CC] bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#F8E1E4] cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-[380px] animate-pulse" />
            ))}
          </div>
        ) : paginatedProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display text-2xl text-[#2D2D2D] mb-2">
              No encontramos productos
            </p>
            <p className="font-body text-[#6B6B6B]">
              Probá con otra búsqueda o categoría
            </p>
          </div>
        ) : (
          <>
            <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedProducts.map((product) => (
                <div key={product.id} className="catalog-product">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-full font-body text-sm border border-[#E0D5CC] disabled:opacity-40 hover:bg-[#F8E1E4] transition-colors"
                >
                  Anterior
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-10 h-10 rounded-full font-body text-sm font-medium transition-colors ${
                      page === p
                        ? "bg-[#F8E1E4] text-[#2D2D2D]"
                        : "text-[#6B6B6B] hover:bg-[#F5F0EB]"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-full font-body text-sm border border-[#E0D5CC] disabled:opacity-40 hover:bg-[#F8E1E4] transition-colors"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
