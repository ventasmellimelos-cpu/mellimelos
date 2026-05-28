import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
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
  const [showSizePicker, setShowSizePicker] = useState(false);
  const [added, setAdded] = useState(false);

  const price = parseFloat(product.price);
  const salePrice = product.salePrice ? parseFloat(product.salePrice) : null;
  const sizes = product.sizes ?? ["0-3m", "3-6m", "6-9m"];
  const imageUrl = product.imageUrl ?? "/images/products/product-1.jpg";

  const handleAddToCart = () => {
    if (!selectedSize) {
      setShowSizePicker(true);
      return;
    }
    addItem({
      productId: product.id,
      name: product.name,
      price: salePrice ?? price,
      imageUrl,
      size: selectedSize,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
    setShowSizePicker(false);
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    setShowSizePicker(false);
    addItem({
      productId: product.id,
      name: product.name,
      price: salePrice ?? price,
      imageUrl,
      size,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const getBadge = () => {
    if (product.isNew) return { text: "Nuevo", className: "bg-[#E8F5E9] text-[#2D2D2D]" };
    if (product.salePrice) return { text: "Oferta", className: "bg-[#F8E1E4] text-[#2D2D2D]" };
    if (product.isBestseller) return { text: "Más vendido", className: "bg-[#FAD4C0] text-[#2D2D2D]" };
    return null;
  };

  const badge = getBadge();

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(45,45,45,0.08)] hover:shadow-[0_8px_32px_rgba(45,45,45,0.12)] transition-shadow duration-300">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-[#F5F0EB]">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          loading="lazy"
        />
        {badge && (
          <span
            className={`absolute top-3 left-3 text-xs font-body font-medium px-3 py-1 rounded-full ${badge.className}`}
          >
            {badge.text}
          </span>
        )}
        {salePrice && (
          <span className="absolute top-3 right-3 bg-[#2D2D2D] text-white text-xs font-body font-medium px-2 py-1 rounded-full">
            -{Math.round((1 - salePrice / price) * 100)}%
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display font-semibold text-[1.125rem] text-[#2D2D2D] truncate">
          {product.name}
        </h3>

        <div className="flex items-center gap-2 mt-1">
          <span className="font-body font-semibold text-[1.25rem] text-[#2D2D2D]">
            ${(salePrice ?? price).toLocaleString("es-AR")}
          </span>
          {salePrice && (
            <span className="font-body text-sm text-[#6B6B6B] line-through">
              ${price.toLocaleString("es-AR")}
            </span>
          )}
        </div>

        {/* Size picker or Add button */}
        {showSizePicker ? (
          <div className="mt-3">
            <p className="font-body text-xs text-[#6B6B6B] mb-2">Seleccioná el talle:</p>
            <div className="flex flex-wrap gap-1.5">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeSelect(size)}
                  className="px-3 py-1.5 text-xs font-body font-medium rounded-full border border-[#E0D5CC] hover:bg-[#F8E1E4] hover:border-[#F8E1E4] transition-colors"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={added}
            className={`w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-lg font-body font-medium text-sm transition-all duration-200 ${
              added
                ? "bg-[#E8F5E9] text-[#2D2D2D]"
                : "bg-[#F8E1E4] text-[#2D2D2D] hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            {added ? (
              <>
                <Check size={16} />
                Agregado
              </>
            ) : (
              <>
                <ShoppingBag size={16} />
                Agregar al carrito
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
