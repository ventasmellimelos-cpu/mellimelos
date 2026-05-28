import { useState, useRef } from "react";
import { ShoppingBag, Check, Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string;
  salePrice: string | null;
  imageUrl: string | null;
  category: string;
  sizes: string[] | null;
  isFeatured: boolean | null;
  isNew: boolean | null;
  isBestseller: boolean | null;
  stock: number | null;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showSizes, setShowSizes] = useState(false);
  const [added, setAdded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const price = parseFloat(product.price);
  const salePrice = product.salePrice ? parseFloat(product.salePrice) : null;
  const sizes = product.sizes ?? ["0-3m", "3-6m", "6-9m"];
  const imageUrl = product.imageUrl ?? "/images/products/product-1.jpg";

  const handleAdd = () => {
    if (!selectedSize) { setShowSizes(true); return; }
    addItem({ productId: product.id, name: product.name, price: salePrice ?? price, imageUrl, size: selectedSize });
    setAdded(true); setTimeout(() => setAdded(false), 1500); setShowSizes(false);
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size); setShowSizes(false);
    addItem({ productId: product.id, name: product.name, price: salePrice ?? price, imageUrl, size });
    setAdded(true); setTimeout(() => setAdded(false), 1500);
  };

  const getBadge = () => {
    if (product.isNew) return { text: "Nuevo", bg: "bg-[#E8F5E9]", textColor: "text-[#4a7c59]" };
    if (salePrice) return { text: "Oferta", bg: "bg-[#F8E1E4]", textColor: "text-[#8b5a5a]" };
    if (product.isBestseller) return { text: "Top", bg: "bg-[#FAD4C0]", textColor: "text-[#8b6914]" };
    return null;
  };
  const badge = getBadge();

  return (
    <div ref={cardRef} className="group bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_12px_40px_rgba(45,45,45,0.12)] border border-transparent hover:border-[#F8E1E4]/50">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-[#F8F8F8]">
        {!imgLoaded && <div className="absolute inset-0 bg-[#F0EDE8] animate-pulse" />}
        <img
          src={imageUrl}
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badge */}
        {badge && (
          <span className={`absolute top-3 left-3 ${badge.bg} ${badge.textColor} text-[0.7rem] font-body font-semibold px-3 py-1 rounded-full tracking-wide uppercase`}>
            {badge.text}
          </span>
        )}
        {salePrice && (
          <span className="absolute top-3 right-3 bg-[#2D2D2D] text-white text-[0.7rem] font-body font-bold px-2.5 py-1 rounded-full">
            -{Math.round((1 - salePrice / price) * 100)}%
          </span>
        )}

        {/* Quick wishlist heart */}
        <button className="absolute top-3 right-3 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white hover:scale-110">
          <Heart size={16} className="text-[#D4A5A5]" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 pt-3">
        <p className="font-body text-[0.7rem] text-[#D4A5A5] uppercase tracking-[2px] font-medium mb-1">
          {product.category}
        </p>
        <h3 className="font-display font-semibold text-[1.05rem] text-[#2D2D2D] leading-tight mb-2 line-clamp-1">
          {product.name}
        </h3>

        <div className="flex items-center gap-2.5 mb-3">
          <span className="font-body font-bold text-lg text-[#2D2D2D]">
            ${(salePrice ?? price).toLocaleString("es-AR")}
          </span>
          {salePrice && (
            <span className="font-body text-sm text-[#B0A8A0] line-through">
              ${price.toLocaleString("es-AR")}
            </span>
          )}
        </div>

        {/* Size selector or Add button */}
        {showSizes ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
            <p className="font-body text-[0.7rem] text-[#6B6B6B] mb-2 uppercase tracking-wider">Seleccioná talle</p>
            <div className="flex flex-wrap gap-1.5">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeSelect(size)}
                  className="px-3 py-1.5 text-xs font-body font-medium rounded-lg border border-[#E8E0D8] hover:bg-[#F8E1E4] hover:border-[#F8E1E4] transition-all duration-200"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <button
            onClick={handleAdd}
            disabled={added}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-body text-sm font-medium transition-all duration-300 ${
              added
                ? "bg-[#E8F5E9] text-[#4a7c59]"
                : "bg-[#2D2D2D] text-white hover:bg-[#F8E1E4] hover:text-[#2D2D2D] active:scale-[0.97]"
            }`}
          >
            {added ? <><Check size={15} /> Agregado</> : <><ShoppingBag size={15} /> Agregar al carrito</>}
          </button>
        )}
      </div>
    </div>
  );
}
