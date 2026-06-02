import { useState, useEffect, useMemo } from "react";
import { Package, DollarSign, TrendingUp, Star } from "lucide-react";

export default function AdminDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/trpc/product.list")
      .then((r) => r.json())
      .then((json) => {
        const items = json?.result?.data?.json?.items ?? [];
        setProducts(items);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const featuredProducts = products.filter((p) => p.isFeatured).length;
    const totalValue = products.reduce((sum, p) => sum + parseFloat(p.price || 0), 0);
    const topProduct = [...products].sort((a, b) => parseFloat(b.price || 0) - parseFloat(a.price || 0))[0];
    return { totalProducts, featuredProducts, totalValue, topProduct };
  }, [products]);

  const recentProducts = products.slice(0, 5);

  if (loading) {
    return (
      <div>
        <h1 className="font-display text-3xl font-bold text-[#2D2D2D] mb-2">Dashboard</h1>
        <p className="font-body text-[#6B6B6B] mb-8">Cargando...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-[#2D2D2D] mb-2">Dashboard</h1>
      <p className="font-body text-[#6B6B6B] mb-8">Resumen de tu tienda Melli Melos</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { label: "Total productos", value: stats.totalProducts, icon: Package, color: "bg-[#F8E1E4]", iconColor: "text-[#D4A5A5]" },
          { label: "Destacados", value: stats.featuredProducts, icon: Star, color: "bg-[#E8F5E9]", iconColor: "text-[#C5D5C0]" },
          { label: "Valor inventario", value: `$${(stats.totalValue / 1000).toFixed(0)}k`, icon: DollarSign, color: "bg-[#FAD4C0]", iconColor: "text-[#D4A5A5]" },
          { label: "Producto mas caro", value: stats.topProduct?.name?.slice(0, 15) + "..." || "-", icon: TrendingUp, color: "bg-[#E8E0F0]", iconColor: "text-[#B8A8D8]" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-soft">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <Icon size={20} className={stat.iconColor} />
                </div>
                <span className="font-body text-xs text-[#6B6B6B] uppercase tracking-wider">{stat.label}</span>
              </div>
              <p className="font-display text-2xl font-bold text-[#2D2D2D]">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <div className="p-6 border-b border-[#F0EBE5] flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-[#2D2D2D]">Productos recientes</h2>
          <span className="font-body text-xs text-[#6B6B6B]">{stats.totalProducts} total</span>
        </div>
        {recentProducts.length === 0 ? (
          <div className="p-8 text-center">
            <Package size={40} className="text-[#D4A5A5] mx-auto mb-3" />
            <p className="font-body text-[#6B6B6B]">No hay productos todavia</p>
          </div>
        ) : (
          <div className="divide-y divide-[#F0EBE5]">
            {recentProducts.map((p) => (
              <div key={p.id} className="flex items-center gap-4 p-4 hover:bg-[#FFF8F0] transition-colors">
                <div className="w-12 h-12 rounded-lg bg-[#F5F0EB] flex items-center justify-center overflow-hidden">
                  {p.images?.[0] || p.imageUrl ? (
                    <img src={p.images?.[0] ?? p.imageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Package size={16} className="text-[#D4A5A5]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body font-medium text-sm text-[#2D2D2D] truncate">{p.name}</p>
                  <p className="font-body text-xs text-[#6B6B6B]">{p.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-body font-semibold text-sm text-[#2D2D2D]">${parseFloat(p.price).toLocaleString("es-AR")}</p>
                  {p.salePrice && <p className="font-body text-xs text-[#D4A5A5]">${parseFloat(p.salePrice).toLocaleString("es-AR")}</p>}
                </div>
                <div className="flex gap-1">
                  {p.isNew && <span className="px-2 py-0.5 bg-[#E8F5E9] text-[#4a7c59] text-[10px] rounded-full font-body">Nuevo</span>}
                  {p.isFeatured && <span className="px-2 py-0.5 bg-[#F8E1E4] text-[#8b5a5a] text-[10px] rounded-full font-body">Dest</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
