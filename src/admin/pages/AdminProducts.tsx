import { useState, useRef, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, Package, X, ImageIcon, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { getAdminToken } from "@/admin/context/AdminAuth";

const authHeaders = (json = false): Record<string, string> => {
  const token = getAdminToken();
  const h: Record<string, string> = {};
  if (json) h["Content-Type"] = "application/json";
  if (token) h["Authorization"] = `Bearer ${token}`;
  return h;
};

const categories = ["bodies", "conjuntos", "accesorios", "regalo"] as const;

interface ProductVariant { color: string; colorHex: string; size: string; stock: number; }

export default function AdminProducts() {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "", description: "", price: "", salePrice: "",
    images: [] as string[], videoUrl: "",
    category: "bodies" as typeof categories[number],
    colors: [] as string[],
    isFeatured: false, isNew: false, isBestseller: false,
    variants: [] as ProductVariant[],
  });

  const [newColor, setNewColor] = useState("");
  const [newColorHex, setNewColorHex] = useState("#F8E1E4");
  const [newSize, setNewSize] = useState("");
  const [uploadingCount, setUploadingCount] = useState(0);

  // Load products via REST API
  const loadProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const json = await res.json();
      setProducts(json.items ?? []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { loadProducts(); }, []);

  const filteredProducts = search
    ? products.filter((p: any) => p.name.toLowerCase().includes(search.toLowerCase()))
    : products;

  const resetForm = () => {
    setForm({ name: "", description: "", price: "", salePrice: "", images: [], videoUrl: "", category: "bodies", colors: [], isFeatured: false, isNew: false, isBestseller: false, variants: [] });
    setNewColor(""); setNewColorHex("#F8E1E4"); setNewSize(""); setImagePreviewUrl(null);
  };

  const openEdit = (product: any) => {
    setEditingId(product.id);
    setForm({
      name: product.name, description: product.description ?? "",
      price: product.price, salePrice: product.salePrice ?? "",
      images: product.images ?? (product.imageUrl ? [product.imageUrl] : []),
      videoUrl: product.videoUrl ?? "",
      category: product.category,
      colors: product.colors ?? [],
      isFeatured: product.isFeatured ?? false,
      isNew: product.isNew ?? false,
      isBestseller: product.isBestseller ?? false,
      variants: (product.variants ?? []).map((v: any) => ({ color: v.color, colorHex: v.colorHex ?? "#E8E8E8", size: v.size, stock: v.stock ?? 0 })),
    });
    setImagePreviewUrl(product.images?.[0] ?? product.imageUrl ?? null);
    setShowForm(true);
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const data = new FormData();
    data.append("file", file);
    console.log(`[Upload] Sending file: ${file.name}, type: ${file.type}, size: ${file.size}`);
    const res = await fetch("/api/upload", { method: "POST", body: data, headers: authHeaders() });
    if (!res.ok) {
      const errText = await res.text();
      console.error(`[Upload] Server error ${res.status}:`, errText);
      return null;
    }
    const json = await res.json();
    console.log(`[Upload] Success:`, json);
    return json.url ?? null;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 10 - form.images.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);
    if (filesToProcess.length === 0) { alert("Máximo 10 imágenes."); e.target.value = ""; return; }

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    setUploadingCount(filesToProcess.length);
    let done = 0;

    for (const file of filesToProcess) {
      if (!validTypes.includes(file.type)) {
        console.warn(`[Upload] Invalid type: ${file.name} -> ${file.type}`);
        done++; setUploadingCount(filesToProcess.length - done); continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        console.warn(`[Upload] Too large: ${file.name} -> ${(file.size / 1024 / 1024).toFixed(1)}MB`);
        done++; setUploadingCount(filesToProcess.length - done); continue;
      }
      try {
        const url = await uploadFile(file);
        if (url) {
          // Update form images AND preview to show the just-uploaded image
          setForm((prev) => {
            const newImages = [...prev.images, url];
            return { ...prev, images: newImages };
          });
          setImagePreviewUrl(url);
        }
      } catch (err) { console.error(`[Upload] Error for ${file.name}:`, err); }
      done++;
      setUploadingCount(filesToProcess.length - done);
    }

    // CRITICAL: Reset the file input so the same file can be selected again
    e.target.value = "";
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) { e.target.value = ""; return; }
    const validTypes = ["video/mp4", "video/webm", "video/quicktime"];
    if (!validTypes.includes(file.type)) { alert("Solo MP4, WEBM o MOV."); e.target.value = ""; return; }
    if (file.size > 20 * 1024 * 1024) { alert("El video no debe superar 20MB."); e.target.value = ""; return; }
    setUploadingCount(1);
    try {
      const url = await uploadFile(file);
      if (url) setForm((prev) => ({ ...prev, videoUrl: url }));
    } catch (err) { console.error(err); alert("Error al subir el video."); }
    setUploadingCount(0);
    e.target.value = "";
  };

  const addColor = () => {
    const color = newColor.trim();
    if (!color) return;
    if (form.colors.includes(color)) { alert("Ese color ya existe."); return; }
    setForm((prev) => ({ ...prev, colors: [...prev.colors, color] }));
    if (form.variants.length > 0) {
      const sizes = [...new Set(form.variants.map((v) => v.size))];
      const newVars = sizes.map((s) => ({ color, colorHex: newColorHex, size: s, stock: 10 }));
      setForm((prev) => ({ ...prev, variants: [...prev.variants, ...newVars] }));
    }
    setNewColor(""); setNewColorHex("#F8E1E4");
  };

  const removeColor = (color: string) => {
    setForm((prev) => ({ ...prev, colors: prev.colors.filter((c) => c !== color), variants: prev.variants.filter((v) => v.color !== color) }));
  };

  const addSize = () => {
    const size = newSize.trim();
    if (!size) return;
    const sizes = [...new Set(form.variants.map((v) => v.size))];
    if (sizes.includes(size)) { alert("Ese talle ya existe."); return; }
    const colors = form.colors.length > 0 ? form.colors : ["Único"];
    const hexMap: Record<string, string> = {};
    form.variants.forEach((v) => { hexMap[v.color] = v.colorHex; });
    const newVars = colors.map((c) => ({ color: c, colorHex: hexMap[c] ?? "#E8E8E8", size, stock: 10 }));
    setForm((prev) => ({ ...prev, variants: [...prev.variants, ...newVars] }));
    setNewSize("");
  };

  const removeSize = (size: string) => {
    setForm((prev) => ({ ...prev, variants: prev.variants.filter((v) => v.size !== size) }));
  };

  const updateVariantStock = (color: string, size: string, stock: number) => {
    setForm((prev) => ({ ...prev, variants: prev.variants.map((v) => v.color === color && v.size === size ? { ...v, stock: Math.max(0, stock) } : v) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name, description: form.description || undefined,
      price: parseFloat(form.price), salePrice: form.salePrice ? parseFloat(form.salePrice) : undefined,
      images: form.images.length > 0 ? form.images : undefined,
      videoUrl: form.videoUrl || undefined,
      category: form.category,
      colors: form.colors.length > 0 ? form.colors : undefined,
      isFeatured: form.isFeatured, isNew: form.isNew, isBestseller: form.isBestseller,
      variants: form.variants.length > 0 ? form.variants : undefined,
    };

    try {
      if (editingId) {
        await fetch(`/api/products/${editingId}`, {
          method: "PUT",
          headers: authHeaders(true),
          body: JSON.stringify(payload),
        });
      } else {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: authHeaders(true),
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        console.log("Product created:", data);
      }
      setShowForm(false); setEditingId(null); resetForm(); loadProducts();
    } catch (err) { console.error(err); alert("Error al guardar el producto."); }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE", headers: authHeaders() });
      setDeleteId(null); loadProducts();
    } catch (err) { console.error(err); }
  };

  const uniqueSizes = [...new Set(form.variants.map((v) => v.size))];
  const isSubmitting = uploadingCount > 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#2D2D2D]">Productos</h1>
          <p className="font-body text-[#6B6B6B] mt-1">{products.length} productos en tu tienda</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditingId(null); resetForm(); }}
          className="flex items-center gap-2 bg-[#2D2D2D] text-white font-body font-medium px-5 py-2.5 rounded-xl hover:bg-[#F8E1E4] hover:text-[#2D2D2D] transition-all">
          <Plus size={18} /> Crear producto
        </button>
      </div>

      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
        <input type="text" placeholder="Buscar productos..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#E0D5CC] bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#F8E1E4]" />
      </div>

      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        {loading ? (
          <div className="p-12 text-center font-body text-[#6B6B6B]">Cargando...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <Package size={48} className="text-[#D4A5A5] mx-auto mb-3" />
            <p className="font-body text-[#6B6B6B]">{search ? "No se encontraron productos" : "No hay productos"}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F5F0EB]">
                <tr>
                  <th className="text-left font-body text-xs font-semibold text-[#6B6B6B] uppercase px-4 py-3">Producto</th>
                  <th className="text-left font-body text-xs font-semibold text-[#6B6B6B] uppercase px-4 py-3">Cat.</th>
                  <th className="text-left font-body text-xs font-semibold text-[#6B6B6B] uppercase px-4 py-3">Precio</th>
                  <th className="text-left font-body text-xs font-semibold text-[#6B6B6B] uppercase px-4 py-3">Colores</th>
                  <th className="text-left font-body text-xs font-semibold text-[#6B6B6B] uppercase px-4 py-3">Talles</th>
                  <th className="text-right font-body text-xs font-semibold text-[#6B6B6B] uppercase px-4 py-3">Acc.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EBE5]">
                {filteredProducts.map((p: any) => (
                  <tr key={p.id} className="hover:bg-[#FFF8F0] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#F5F0EB] flex items-center justify-center overflow-hidden">
                          {p.images?.[0] || p.imageUrl ? (
                            <img src={p.images?.[0] ?? p.imageUrl} alt="" className="w-full h-full object-cover" />
                          ) : (<Package size={16} className="text-[#D4A5A5]" />)}
                        </div>
                        <div>
                          <span className="font-body text-sm text-[#2D2D2D] font-medium block truncate max-w-[200px]">{p.name}</span>
                          {p.videoUrl && <span className="text-[10px] text-[#4a7c59] font-body bg-[#E8F5E9] px-1.5 rounded">VIDEO</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-body text-xs text-[#6B6B6B] capitalize">{p.category}</td>
                    <td className="px-4 py-3 font-body text-sm text-[#2D2D2D]">${parseFloat(p.price).toLocaleString("es-AR")}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {(p.colors ?? []).slice(0, 3).map((c: string) => (
                          <span key={c} className="px-1.5 py-0.5 bg-[#F8E1E4] text-[#8b5a5a] text-[10px] rounded-full font-body">{c}</span>
                        ))}
                        {(p.variants ?? []).length > 0 && (
                          <span className="text-[10px] text-[#B0A8A0] font-body">{(p.variants ?? []).length} var.</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-body text-xs text-[#6B6B6B]">{[...new Set((p.variants ?? []).map((v: any) => v.size))].join(", ") || "-"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-[#F8E1E4] transition-colors"><Pencil size={16} className="text-[#6B6B6B]" /></button>
                        <button onClick={() => setDeleteId(p.id)} className="p-2 rounded-lg hover:bg-red-100 transition-colors"><Trash2 size={16} className="text-red-400" /></button>
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
        <div className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl my-8">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-[#F0EBE5] flex items-center justify-between z-10 rounded-t-3xl">
              <h2 className="font-display text-xl font-semibold text-[#2D2D2D]">{editingId ? "Editar producto" : "Nuevo producto"}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-full hover:bg-[#F5F0EB]"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="font-body text-sm font-medium text-[#2D2D2D] mb-1 block">Nombre *</label>
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E0D5CC] font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#F8E1E4]" />
                  </div>
                  <div>
                    <label className="font-body text-sm font-medium text-[#2D2D2D] mb-1 block">Descripción</label>
                    <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={3} className="w-full px-4 py-2.5 rounded-xl border border-[#E0D5CC] font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#F8E1E4]" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-body text-sm font-medium text-[#2D2D2D] mb-1 block">Precio ($) *</label>
                      <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E0D5CC] font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#F8E1E4]" />
                    </div>
                    <div>
                      <label className="font-body text-sm font-medium text-[#2D2D2D] mb-1 block">Precio oferta ($)</label>
                      <input type="number" value={form.salePrice} onChange={(e) => setForm({ ...form, salePrice: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E0D5CC] font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#F8E1E4]" />
                    </div>
                  </div>
                  <div>
                    <label className="font-body text-sm font-medium text-[#2D2D2D] mb-1 block">Categoría *</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as typeof categories[number] })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E0D5CC] font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#F8E1E4]">
                      {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="flex gap-4 items-center pt-2">
                    <label className="flex items-center gap-2 font-body text-sm"><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} /> Destacado</label>
                    <label className="flex items-center gap-2 font-body text-sm"><input type="checkbox" checked={form.isNew} onChange={(e) => setForm({ ...form, isNew: e.target.checked })} /> Nuevo</label>
                    <label className="flex items-center gap-2 font-body text-sm"><input type="checkbox" checked={form.isBestseller} onChange={(e) => setForm({ ...form, isBestseller: e.target.checked })} /> Top</label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="font-body text-sm font-medium text-[#2D2D2D] mb-1 block">Imágenes ({form.images.length}/10)</label>
                    <input ref={imageInputRef} type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={handleImageUpload} className="hidden" />
                    {form.images.length > 0 ? (
                      <div className="space-y-2">
                        <div className="relative w-full h-44 rounded-xl border border-[#E0D5CC] overflow-hidden bg-[#F5F0EB]">
                          <img src={imagePreviewUrl ?? form.images[0]} alt="" className="w-full h-full object-contain" />
                          {uploadingCount > 0 && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <div className="flex items-center gap-2 text-white font-body text-sm">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Subiendo {uploadingCount}...
                              </div>
                            </div>
                          )}
                          {form.images.length > 1 && (
                            <>
                              <button type="button" onClick={() => { const idx = form.images.indexOf(imagePreviewUrl ?? form.images[0]); setImagePreviewUrl(form.images[Math.max(0, idx - 1)]); }} className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 rounded-full hover:bg-white"><ChevronLeft size={16} /></button>
                              <button type="button" onClick={() => { const idx = form.images.indexOf(imagePreviewUrl ?? form.images[0]); setImagePreviewUrl(form.images[Math.min(form.images.length - 1, idx + 1)]); }} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 rounded-full hover:bg-white"><ChevronRight size={16} /></button>
                            </>
                          )}
                          <button type="button" onClick={() => { const remaining = form.images.filter((u) => u !== (imagePreviewUrl ?? form.images[0])); setForm((p) => ({ ...p, images: remaining })); setImagePreviewUrl(remaining[0] ?? null); }} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"><X size={12} /></button>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {form.images.map((img, idx) => (
                            <button key={img + idx} type="button" onClick={() => setImagePreviewUrl(img)} className={`w-12 h-12 rounded-lg border-2 overflow-hidden ${img === (imagePreviewUrl ?? form.images[0]) ? "border-[#D4A5A5]" : "border-transparent"}`}><img src={img} alt="" className="w-full h-full object-cover" /></button>
                          ))}
                          {form.images.length < 10 && (
                            <button type="button" onClick={() => imageInputRef.current?.click()} className="w-12 h-12 rounded-lg border-2 border-dashed border-[#E0D5CC] flex items-center justify-center hover:border-[#D4A5A5] transition-colors"><Plus size={16} className="text-[#B0A8A0]" /></button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <button type="button" onClick={() => imageInputRef.current?.click()}
                        className="w-full h-32 rounded-xl border-2 border-dashed border-[#E0D5CC] bg-[#F5F0EB] flex flex-col items-center justify-center gap-2 hover:border-[#D4A5A5] transition-colors cursor-pointer">
                        <ImageIcon size={28} className="text-[#D4A5A5]" />
                        <span className="font-body text-sm text-[#6B6B6B]">Hacé clic para subir imágenes (PNG, JPG, WEBP)</span>
                        <span className="font-body text-xs text-[#B0A8A0]">Max. 10 imágenes · 5MB cada una</span>
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="font-body text-sm font-medium text-[#2D2D2D] mb-1 block">Video del producto</label>
                    <input ref={videoInputRef} type="file" accept="video/mp4,video/webm,video/quicktime" onChange={handleVideoUpload} className="hidden" />
                    {form.videoUrl ? (
                      <div className="relative w-full h-32 rounded-xl border border-[#E0D5CC] overflow-hidden bg-[#F5F0EB] flex items-center justify-center">
                        <video src={form.videoUrl} className="w-full h-full object-contain" controls />
                        <button type="button" onClick={() => setForm((p) => ({ ...p, videoUrl: "" }))} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"><X size={12} /></button>
                      </div>
                    ) : (
                      <button type="button" onClick={() => videoInputRef.current?.click()}
                        className="w-full h-20 rounded-xl border-2 border-dashed border-[#E0D5CC] bg-[#F5F0EB] flex flex-col items-center justify-center gap-1 hover:border-[#D4A5A5] transition-colors cursor-pointer">
                        <div className="flex items-center gap-2"><Play size={18} className="text-[#D4A5A5]" /><span className="font-body text-sm text-[#6B6B6B]">Subir video (MP4, WEBM, MOV)</span></div>
                        <span className="font-body text-xs text-[#B0A8A0]">Max. 20MB</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-[#F0EBE5] pt-6">
                <h3 className="font-display text-lg font-semibold text-[#2D2D2D] mb-4">Variantes de Color y Talle</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="font-body text-sm font-medium text-[#2D2D2D] mb-2 block">Colores disponibles</label>
                    <div className="flex gap-2 mb-3">
                      <input value={newColor} onChange={(e) => setNewColor(e.target.value)} placeholder="Ej: Rosa, Celeste..."
                        className="flex-1 px-3 py-2 rounded-xl border border-[#E0D5CC] font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#F8E1E4]" />
                      <input type="color" value={newColorHex} onChange={(e) => setNewColorHex(e.target.value)} className="w-10 h-10 rounded-xl border border-[#E0D5CC] cursor-pointer" />
                      <button type="button" onClick={addColor} className="px-4 py-2 bg-[#F8E1E4] text-[#2D2D2D] rounded-xl font-body text-sm hover:bg-[#F5D0D5] transition-colors">Agregar</button>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {form.colors.map((c) => {
                        const v = form.variants.find((v2) => v2.color === c);
                        return (
                          <span key={c} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-body"
                            style={{ backgroundColor: (v?.colorHex ?? "#F8E1E4") + "30", border: "1px solid " + (v?.colorHex ?? "#F8E1E4") }}>
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: v?.colorHex ?? "#E8E8E8" }} />{c}
                            <button type="button" onClick={() => removeColor(c)} className="ml-1 hover:text-red-500"><X size={12} /></button>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <label className="font-body text-sm font-medium text-[#2D2D2D] mb-2 block">Talles disponibles</label>
                    <div className="flex gap-2 mb-3">
                      <input value={newSize} onChange={(e) => setNewSize(e.target.value)} placeholder="Ej: 0-3m, 3-6m..."
                        className="flex-1 px-3 py-2 rounded-xl border border-[#E0D5CC] font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#F8E1E4]" />
                      <button type="button" onClick={addSize} className="px-4 py-2 bg-[#F8E1E4] text-[#2D2D2D] rounded-xl font-body text-sm hover:bg-[#F5D0D5] transition-colors">Agregar</button>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {[...new Set(form.variants.map((v) => v.size))].map((s) => (
                        <span key={s} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#F5F0EB] text-sm font-body">{s}<button type="button" onClick={() => removeSize(s)} className="ml-1 hover:text-red-500"><X size={12} /></button></span>
                      ))}
                    </div>
                  </div>
                </div>

                {form.colors.length > 0 && uniqueSizes.length > 0 && (
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr className="border-b border-[#F0EBE5]">
                        <th className="text-left py-2 px-3 font-body font-medium text-[#6B6B6B]">Color \ Talle</th>
                        {uniqueSizes.map((s) => <th key={s} className="text-center py-2 px-3 font-body font-medium text-[#6B6B6B]">{s}</th>)}
                      </tr></thead>
                      <tbody>
                        {[...new Set(form.variants.map((v) => v.color))].map((c) => {
                          const v = form.variants.find((v2) => v2.color === c);
                          return (
                            <tr key={c} className="border-b border-[#F0EBE5]/50">
                              <td className="py-2 px-3 font-body flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: v?.colorHex ?? "#E8E8E8" }} />{c}
                              </td>
                              {uniqueSizes.map((s) => {
                                const variant = form.variants.find((v2) => v2.color === c && v2.size === s);
                                return (<td key={s} className="py-2 px-1 text-center">
                                  <input type="number" min={0} value={variant?.stock ?? 0} onChange={(e) => updateVariantStock(c, s, parseInt(e.target.value) || 0)}
                                    className="w-14 py-1 px-1 text-center rounded-lg border border-[#E0D5CC] font-body text-xs focus:outline-none focus:ring-1 focus:ring-[#F8E1E4]" />
                                </td>);
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#F0EBE5]">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-[#E0D5CC] font-body font-medium text-sm hover:bg-[#F5F0EB] transition-all">Cancelar</button>
                <button type="submit" disabled={isSubmitting}
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
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"><Trash2 size={24} className="text-red-500" /></div>
            <h3 className="font-display text-lg font-semibold text-[#2D2D2D] mb-2">Eliminar producto</h3>
            <p className="font-body text-sm text-[#6B6B6B] mb-6">¿Estás seguro? Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-[#E0D5CC] font-body text-sm hover:bg-[#F5F0EB]">Cancelar</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-500 text-white px-4 py-2.5 rounded-xl font-body text-sm hover:bg-red-600 transition-all">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
