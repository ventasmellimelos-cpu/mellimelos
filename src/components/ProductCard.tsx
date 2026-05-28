import { useState, useRef } from "react";
import { ShoppingBag, Check, Heart, ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface ProductVariant {
  id?: number;
  productId?: number;
  color: string;
  colorHex: string | null;
  size: string;
  stock: number | null;
}

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string;
  salePrice: string | null;
  imageUrl?: string | null;
  images: string[] | null;
  videoUrl?: string | null;
  category: string;
  sizes: string[] | null;
  colors: string[] | null;
  isFeatured: boolean | null;
  isNew: boolean | null;
  isBestseller: boolean | null;
  stock: number | null;
  variants?: ProductVariant[];
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showSelectors, setShowSelectors] = useState(false);
  const [added, setAdded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const price = parseFloat(product.price);
  const salePrice = product.salePrice ? parseFloat(product.salePrice) : null;

  // Build images array (prefer 'images', fallback to 'imageUrl')
  const allImages: string[] = product.images && product.images.length > 0
    ? product.images
    : product.imageUrl
      ? [product.imageUrl]
      : ["/images/products/product-1.jpg"];

  // Extract unique colors and sizes from variants
  const colorMap = new Map<string, string>();
  (product.variants ?? []).forEach((v) => {
    if (!colorMap.has(v.color)) colorMap.set(v.color, v.colorHex ?? "#E8E8E8");
  });
  const availableColors = Array.from(colorMap.entries());

  const sizeSet = new Set<string>();
  (product.variants ?? []).forEach((v) => {
    if (!selectedColor || v.color === selectedColor) sizeSet.add(v.size);
  });
  const availableSizes = Array.from(sizeSet);

  const hasVideo = !!product.videoUrl;

  const handleAdd = () => {
    if (!selectedColor || !selectedSize) { setShowSelectors(true); return; }
    const imageUrl = allImages[0] ?? "/images/products/product-1.jpg";
    addItem({ productId: product.id, name: product.name, price: salePrice ?? price, imageUrl, color: selectedColor, size: selectedSize });
    setAdded(true); setTimeout(() => setAdded(false), 1500);
  };

  const handleCompleteAdd = () => {
    if (!selectedColor || !selectedSize) return;
    const imageUrl = allImages[0] ?? "/images/products/product-1.jpg";
    addItem({ productId: product.id, name: product.name, price: salePrice ?? price, imageUrl, color: selectedColor, size: selectedSize });
    setAdded(true); setTimeout(() => setAdded(false), 1500); setShowSelectors(false);
  };

  const getBadge = () => {
    if (product.isNew) return { text: "Nuevo", bg: "bg-[#E8F5E9]", textColor: "text-[#4a7c59]" };
    if (salePrice) return { text: "Oferta", bg: "bg-[#F8E1E4]", textColor: "text-[#8b5a5a]" };
    if (product.isBestseller) return { text: "Top", bg: "bg-[#FAD4C0]", textColor: "text-[#8b6914]" };
    return null;
  };
  const badge = getBadge();

  // Gallery media (images + video)
  const galleryMedia = [...allImages];
  if (hasVideo && product.videoUrl) galleryMedia.push(product.videoUrl);

  return (
    <>
      <div ref={cardRef} className="group bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_12px_40px_rgba(45,45,45,0.12)] border border-transparent hover:border-[#F8E1E4]/50">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-[#F8F8F8]">
          {!imgLoaded && <div className="absolute inset-0 bg-[#F0EDE8] animate-pulse" />}
          <img
            src={allImages[currentImgIdx] ?? allImages[0]}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Multiple images dots */}
          {allImages.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {allImages.map((_, i) => (
                <button key={i} onClick={() => setCurrentImgIdx(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentImgIdx ? "bg-white w-4" : "bg-white/50"}`} />
              ))}
            </div>
          )}

          {/* Video indicator */}
          {hasVideo && (
            <button onClick={() => { setGalleryIdx(allImages.length); setShowGallery(true); }}
              className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white hover:scale-110 transition-all shadow-sm">
              <Play size={14} className="text-[#2D2D2D] fill-current" />
            </button>
          )}

          {/* Gallery expand */}
          {allImages.length > 1 && (
            <button onClick={() => { setGalleryIdx(0); setShowGallery(true); }}
              className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
              <ChevronRight size={14} className="text-[#2D2D2D]" />
            </button>
          )}

          {/* Badges */}
          {badge && (
            <span className={`absolute top-3 left-3 ${badge.bg} ${badge.textColor} text-[0.7rem] font-body font-semibold px-3 py-1 rounded-full tracking-wide uppercase`}>
              {badge.text}
            </span>
          )}
          {salePrice && (
            <span className="absolute top-3 left-3 mt-7 bg-[#2D2D2D] text-white text-[0.7rem] font-body font-bold px-2.5 py-1 rounded-full">
              -{Math.round((1 - salePrice / price) * 100)}%
            </span>
          )}

          <button className="absolute top-3 right-3 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white hover:scale-110">
            <Heart size={16} className="text-[#D4A5A5]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 pt-3">
          <p className="font-body text-[0.7rem] text-[#D4A5A5] uppercase tracking-[2px] font-medium mb-1">{product.category}</p>
          <h3 className="font-display font-semibold text-[1.05rem] text-[#2D2D2D] leading-tight mb-2 line-clamp-1">{product.name}</h3>

          <div className="flex items-center gap-2.5 mb-3">
            <span className="font-body font-bold text-lg text-[#2D2D2D]">${(salePrice ?? price).toLocaleString("es-AR")}</span>
            {salePrice && <span className="font-body text-sm text-[#B0A8A0] line-through">${price.toLocaleString("es-AR")}</span>}
          </div>

          {/* Color selector */}
          {availableColors.length > 0 && (
            <div className="mb-2">
              <p className="font-body text-[0.65rem] text-[#6B6B6B] uppercase tracking-wider mb-1.5">Color{selectedColor ? `: ${selectedColor}` : ""}</p>
              <div className="flex gap-2">
                {availableColors.map(([color, hex]) => (
                  <button key={color} onClick={() => { setSelectedColor(color); setSelectedSize(null); }}
                    className={`w-6 h-6 rounded-full border-2 transition-all ${selectedColor === color ? "border-[#2D2D2D] scale-110" : "border-transparent hover:scale-105"}`}
                    style={{ backgroundColor: hex }} title={color} />
                ))}
              </div>
            </div>
          )}

          {/* Size + Add button */}
          {showSelectors ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-200 space-y-2">
              {availableSizes.length > 0 && (
                <div>
                  <p className="font-body text-[0.65rem] text-[#6B6B6B] uppercase tracking-wider mb-1.5">Talle</p>
                  <div className="flex flex-wrap gap-1.5">
                    {availableSizes.map((size) => (
                      <button key={size} onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 text-xs font-body font-medium rounded-lg border transition-all duration-200 ${
                          selectedSize === size ? "bg-[#F8E1E4] border-[#F8E1E4] text-[#2D2D2D]" : "border-[#E8E0D8] hover:bg-[#F8E1E4] hover:border-[#F8E1E4]"
                        }`}>
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <button onClick={handleCompleteAdd} disabled={!selectedColor || !selectedSize || added}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-body text-sm font-medium transition-all duration-300 ${
                  added ? "bg-[#E8F5E9] text-[#4a7c59]" : "bg-[#2D2D2D] text-white hover:bg-[#F8E1E4] hover:text-[#2D2D2D] active:scale-[0.97]"
                } ${(!selectedColor || !selectedSize) ? "opacity-60" : ""}`}>
                {added ? <><Check size={15} /> Agregado</> : <><ShoppingBag size={15} /> Agregar al carrito</>}
              </button>
            </div>
          ) : (
            <button onClick={handleAdd} disabled={added}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-body text-sm font-medium transition-all duration-300 ${
                added ? "bg-[#E8F5E9] text-[#4a7c59]" : "bg-[#2D2D2D] text-white hover:bg-[#F8E1E4] hover:text-[#2D2D2D] active:scale-[0.97]"
              }`}>
              {added ? <><Check size={15} /> Agregado</> : <><ShoppingBag size={15} /> Agregar al carrito</>}
            </button>
          )}
        </div>
      </div>

      {/* Fullscreen Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center" onClick={() => setShowGallery(false)}>
          <button className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full z-10" onClick={() => setShowGallery(false)}>
            <X size={24} />
          </button>

          {galleryIdx < allImages.length ? (
            <img src={galleryMedia[galleryIdx]} alt="" className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
          ) : (
            <video src={product.videoUrl ?? ""} className="max-w-[90vw] max-h-[85vh] rounded-lg" controls autoPlay onClick={(e) => e.stopPropagation()} />
          )}

          {/* Gallery nav */}
          {galleryMedia.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); setGalleryIdx((i) => Math.max(0, i - 1)); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-3 hover:bg-white/10 rounded-full"><ChevronLeft size={24} /></button>
              <button onClick={(e) => { e.stopPropagation(); setGalleryIdx((i) => Math.min(galleryMedia.length - 1, i + 1)); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-3 hover:bg-white/10 rounded-full"><ChevronRight size={24} /></button>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {galleryMedia.map((_, i) => (
                  <button key={i} onClick={(e) => { e.stopPropagation(); setGalleryIdx(i); }}
                    className={`w-2 h-2 rounded-full ${i === galleryIdx ? "bg-white w-5" : "bg-white/40"}`} />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
