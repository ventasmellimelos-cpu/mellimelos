import { useState } from "react";
import { Plus, Pencil, Trash2, Search, Package, X } from "lucide-react";
import { trpc } from "@/providers/trpc";

const categories = ["bodies", "conjuntos", "accesorios", "regalo"] as const;

export default function AdminProducts() {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.product.list.useQuery({ search: search || undefined, limit: 100 });

  const createMutation = trpc.product.create.useMutation({
    onSuccess: () => { utils.product.list.invalidate(); setShowForm(false); resetForm(); },
  });
  const updateMutation = trpc.product.update.useMutation({
    onSuccess: () => { utils.product.list.invalidate(); setShowForm(false); setEditingId(null); resetForm(); },
  });
  const deleteMutation = trpc.product.delete.useMutation({
    onSuccess: () => { utils.product.list.invalidate(); setDeleteId(null); },
  });

  const [form, setForm] = useState({
    name: "", description: "", price: "", salePrice: "",
    imageUrl: "", category: "bodies" as typeof categories[number],
    sizes: "", isFeatured: false, isNew: false, isBestseller: false, stock: "",
  });

  const resetForm = () => setForm({
    name: "", description: "", price: "", salePrice: "",
    imageUrl: "", category: "bodies", sizes: "",
    isFeatured: false, isNew: false, isBestseller: false, stock: "",
  });

  const openEdit = (product: any) => {
    setEditingId(product.id);
    setForm({
      name: product.name, description: product.description ?? "",
      price: product.price, salePrice: product.salePrice ?? "",
      imageUrl: product.imageUrl ?? "", category: product.category,
      sizes: (product.sizes ?? []).join(","),
      isFeatured: product.isFeatured ?? false,
      isNew: product.isNew ?? false,
      isBestseller: product.isBestseller ?? false,
      stock: String(product.stock ?? 0),
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sizes = form.sizes.split(",").map((s) => s.trim()).filter(Boolean);
    const data = {
      name: form.name, description: form.description || undefined,
      price: parseFloat(form.price), salePrice: form.salePrice ? parseFloat(form.salePrice) : undefined,
      imageUrl: form.imageUrl || undefined, category: form.category,
      sizes: sizes.length ? sizes : undefined,
      isFeatured: form.isFeatured, isNew: form.isNew,
      isBestseller: form.isBestseller, stock: parseInt(form.stock) || 0,
    };
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#2D2D2D]">Productos</h1>
          <p className="font-body text-[#6B6B6B] mt-1">{data?.items.length ?? 0} productos en tu tienda</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); resetForm(); }}
          className="flex items-center gap-2 bg-[#2D2D2D] text-white font-body font-medium px-5 py-2.5 rounded-xl hover:bg-[#F8E1E4] hover:text-[#2D2D2D] transition-all"
        >
          <Plus size={18} /> Nuevo producto
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
        <input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#E0D5CC] bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#F8E1E4]"
        />
      </div>

      {/* Products table */}
      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center font-body text-[#6B6B6B]">Cargando...</div>
        ) : data?.items.length === 0 ? (
          <div className="p-12 text-center">
            <Package size={48} className="text-[#D4A5A5] mx-auto mb-3" />
            <p className="font-body text-[#6B6B6B]">No hay productos</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F5F0EB]">
                <tr>
                  <th className="text-left font-body text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider px-4 py-3">Producto</th>
                  <th className="text-left font-body text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider px-4 py-3">Categoría</th>
                  <th className="text-left font-body text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider px-4 py-3">Precio</th>
                  <th className="text-left font-body text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider px-4 py-3">Oferta</th>
                  <th className="text-left font-body text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider px-4 py-3">Estado</th>
                  <th className="text-right font-body text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EBE5]">
                {data?.items.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FFF8F0] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.imageUrl ?? ""} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-[#F5F0EB]" />
                        <span className="font-body text-sm text-[#2D2D2D] font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-body text-xs text-[#6B6B6B] capitalize">{p.category}</span>
                    </td>
                    <td className="px-4 py-3 font-body text-sm text-[#2D2D2D]">${parseFloat(p.price).toLocaleString("es-AR")}</td>
                    <td className="px-4 py-3">
                      {p.salePrice ? (
                        <span className="font-body text-sm text-[#D4A5A5]">${parseFloat(p.salePrice).toLocaleString("es-AR")}</span>
                      ) : (
                        <span className="font-body text-xs text-[#B0A8A0]">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {p.isNew && <span className="px-2 py-0.5 bg-[#E8F5E9] text-[#4a7c59] text-[10px] rounded-full font-body">Nuevo</span>}
                        {p.isFeatured && <span className="px-2 py-0.5 bg-[#F8E1E4] text-[#8b5a5a] text-[10px] rounded-full font-body">Dest</span>}
                        {p.isBestseller && <span className="px-2 py-0.5 bg-[#FAD4C0] text-[#8b6914] text-[10px] rounded-full font-body">Top</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-[#F8E1E4] transition-colors">
                          <Pencil size={16} className="text-[#6B6B6B]" />
                        </button>
                        <button onClick={() => setDeleteId(p.id)} className="p-2 rounded-lg hover:bg-red-100 transition-colors">
                          <Trash2 size={16} className="text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-[#F0EBE5] flex items-center justify-between z-10">
              <h2 className="font-display text-xl font-semibold text-[#2D2D2D]">
                {editingId ? "Editar producto" : "Nuevo producto"}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-full hover:bg-[#F5F0EB]">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="font-body text-sm font-medium text-[#2D2D2D] mb-1 block">Nombre</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E0D5CC] font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#F8E1E4]" />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-body text-sm font-medium text-[#2D2D2D] mb-1 block">Descripción</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={3} className="w-full px-4 py-2.5 rounded-xl border border-[#E0D5CC] font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#F8E1E4]" />
                </div>
                <div>
                  <label className="font-body text-sm font-medium text-[#2D2D2D] mb-1 block">Precio ($)</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E0D5CC] font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#F8E1E4]" />
                </div>
                <div>
                  <label className="font-body text-sm font-medium text-[#2D2D2D] mb-1 block">Precio oferta ($)</label>
                  <input type="number" value={form.salePrice} onChange={(e) => setForm({ ...form, salePrice: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E0D5CC] font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#F8E1E4]" />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-body text-sm font-medium text-[#2D2D2D] mb-1 block">URL de imagen</label>
                  <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    placeholder="/images/products/product-1.jpg"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E0D5CC] font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#F8E1E4]" />
                </div>
                <div>
                  <label className="font-body text-sm font-medium text-[#2D2D2D] mb-1 block">Categoría</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as typeof categories[number] })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E0D5CC] font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#F8E1E4]">
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-body text-sm font-medium text-[#2D2D2D] mb-1 block">Talles (separados por coma)</label>
                  <input value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                    placeholder="0-3m, 3-6m, 6-9m"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E0D5CC] font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#F8E1E4]" />
                </div>
                <div>
                  <label className="font-body text-sm font-medium text-[#2D2D2D] mb-1 block">Stock</label>
                  <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E0D5CC] font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#F8E1E4]" />
                </div>
                <div className="flex gap-4 items-center">
                  <label className="flex items-center gap-2 font-body text-sm">
                    <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
                    Destacado
                  </label>
                  <label className="flex items-center gap-2 font-body text-sm">
                    <input type="checkbox" checked={form.isNew} onChange={(e) => setForm({ ...form, isNew: e.target.checked })} />
                    Nuevo
                  </label>
                  <label className="flex items-center gap-2 font-body text-sm">
                    <input type="checkbox" checked={form.isBestseller} onChange={(e) => setForm({ ...form, isBestseller: e.target.checked })} />
                    Top
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-[#E0D5CC] font-body font-medium text-sm hover:bg-[#F5F0EB] transition-all">
                  Cancelar
                </button>
                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 bg-[#2D2D2D] text-white px-4 py-3 rounded-xl font-body font-medium text-sm hover:bg-[#F8E1E4] hover:text-[#2D2D2D] transition-all disabled:opacity-50">
                  {editingId ? "Guardar cambios" : "Crear producto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <h3 className="font-display text-lg font-semibold text-[#2D2D2D] mb-2">Eliminar producto</h3>
            <p className="font-body text-sm text-[#6B6B6B] mb-6">¿Estás seguro? Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#E0D5CC] font-body text-sm hover:bg-[#F5F0EB]">
                Cancelar
              </button>
              <button onClick={() => deleteMutation.mutate({ id: deleteId })}
                className="flex-1 bg-red-500 text-white px-4 py-2.5 rounded-xl font-body text-sm hover:bg-red-600 transition-all">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
