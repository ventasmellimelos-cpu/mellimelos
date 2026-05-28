import { X, Minus, Plus, Trash2, ShoppingBag, MessageCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router";

const WHATSAPP_NUMBER = "5491134848466";

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalPrice, clearCart } = useCart();

  const generateWhatsAppMessage = () => {
    const lines = items.map(
      (i) => `• ${i.name} (Color: ${i.color}, Talle: ${i.size}) x${i.quantity} — $${(i.price * i.quantity).toLocaleString("es-AR")}`
    );
    const message = `Hola Melli Melos! Quiero hacer un pedido:\n\n${lines.join("\n")}\n\n*Total: $${totalPrice.toLocaleString("es-AR")}*\n\nAguardo confirmación, gracias!`;
    return encodeURIComponent(message);
  };

  const handleCheckout = () => {
    const message = generateWhatsAppMessage();
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-[#2D2D2D]/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 z-[70] w-full max-w-[420px] bg-white shadow-2xl flex flex-col"
        style={{ borderRadius: "24px 0 0 24px" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#F5F0EB]">
          <div className="flex items-center gap-3">
            <ShoppingBag size={22} strokeWidth={1.5} className="text-[#2D2D2D]" />
            <h2 className="font-display text-xl font-semibold text-[#2D2D2D]">Tu Carrito</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full hover:bg-[#F5F0EB] transition-colors"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={48} strokeWidth={1} className="text-[#D4A5A5] mb-4" />
              <p className="font-display text-lg text-[#2D2D2D] mb-2">Tu carrito está vacío</p>
              <p className="font-body text-sm text-[#6B6B6B] mb-6">Agregá productos para empezar tu pedido</p>
              <Link
                to="/catalogo"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-2 bg-[#F8E1E4] text-[#2D2D2D] font-body font-medium text-sm px-6 py-3 rounded-full hover:scale-[1.02] transition-transform"
              >
                Ver catálogo
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.color}-${item.size}`}
                  className="flex gap-4 p-3 rounded-2xl bg-[#F5F0EB]/50"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold text-[#2D2D2D] text-sm truncate">
                      {item.name}
                    </p>
                    <p className="font-body text-xs text-[#6B6B6B] mt-0.5">
                      Color: <span className="font-medium">{item.color}</span> · Talle: <span className="font-medium">{item.size}</span>
                    </p>
                    <p className="font-body font-semibold text-sm text-[#2D2D2D] mt-1">
                      ${item.price.toLocaleString("es-AR")}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.color, item.size, item.quantity - 1)
                          }
                          className="w-7 h-7 flex items-center justify-center rounded-full bg-white hover:bg-[#F8E1E4] transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-body text-sm font-medium w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.color, item.size, item.quantity + 1)
                          }
                          className="w-7 h-7 flex items-center justify-center rounded-full bg-white hover:bg-[#F8E1E4] transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId, item.color, item.size)}
                        className="p-1.5 rounded-full hover:bg-red-50 text-[#6B6B6B] hover:text-red-500 transition-colors"
                        aria-label="Eliminar"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-[#F5F0EB] bg-white">
            <div className="flex items-center justify-between mb-4">
              <span className="font-body text-[#6B6B6B]">Subtotal</span>
              <span className="font-body font-semibold text-lg text-[#2D2D2D]">
                ${totalPrice.toLocaleString("es-AR")}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-2 bg-[#F8E1E4] text-[#2D2D2D] font-body font-medium py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              <MessageCircle size={18} />
              Enviar pedido por WhatsApp
            </button>
            <p className="font-body text-xs text-[#6B6B6B] text-center mt-3">
              Te redireccionaremos a WhatsApp para coordinar el pago y envío
            </p>
            <button
              onClick={clearCart}
              className="w-full mt-2 py-2 text-sm font-body text-[#6B6B6B] hover:text-red-500 transition-colors"
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </>
  );
}
