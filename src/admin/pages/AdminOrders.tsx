import { useState } from "react";
import { ShoppingBag, Package, MessageCircle, Clock, CheckCircle, Truck } from "lucide-react";
import { trpc } from "@/providers/trpc";

const statusConfig = {
  pending: { label: "Pendiente", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  confirmed: { label: "Confirmado", color: "bg-blue-100 text-blue-700", icon: CheckCircle },
  shipped: { label: "Enviado", color: "bg-purple-100 text-purple-700", icon: Truck },
  delivered: { label: "Entregado", color: "bg-green-100 text-green-700", icon: CheckCircle },
};

export default function AdminOrders() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const utils = trpc.useUtils();
  const { data: orders, isLoading } = trpc.order.list.useQuery();

  const updateStatus = trpc.order.updateStatus.useMutation({
    onSuccess: () => utils.order.list.invalidate(),
  });

  const filteredOrders = statusFilter === "all"
    ? orders
    : orders?.filter((o) => o.status === statusFilter);

  const totalAmount = filteredOrders?.reduce((sum, o) => sum + parseFloat(String(o.totalAmount)), 0) ?? 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#2D2D2D]">Órdenes</h1>
          <p className="font-body text-[#6B6B6B] mt-1">{orders?.length ?? 0} órdenes | Total: ${totalAmount.toLocaleString("es-AR")}</p>
        </div>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(["all", "pending", "confirmed", "shipped", "delivered"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-full font-body text-sm transition-all ${
              statusFilter === s
                ? "bg-[#2D2D2D] text-white"
                : "bg-white text-[#6B6B6B] border border-[#E0D5CC] hover:border-[#F8E1E4]"
            }`}
          >
            {s === "all" ? "Todas" : statusConfig[s]?.label}
          </button>
        ))}
      </div>

      {/* Orders */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-white rounded-2xl p-12 text-center font-body text-[#6B6B6B]">Cargando...</div>
        ) : filteredOrders?.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <ShoppingBag size={48} className="text-[#D4A5A5] mx-auto mb-3" />
            <p className="font-body text-[#6B6B6B]">No hay órdenes</p>
          </div>
        ) : (
          filteredOrders?.map((order) => {
            const status = statusConfig[order.status as keyof typeof statusConfig];
            const StatusIcon = status?.icon ?? Clock;
            const items = order.items as Array<{ name: string; size: string; price: number; quantity: number }>;

            return (
              <div key={order.id} className="bg-white rounded-2xl shadow-soft p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${status?.color.split(" ")[0]}`}>
                      <StatusIcon size={18} className={status?.color.split(" ")[1]} />
                    </div>
                    <div>
                      <p className="font-body font-semibold text-sm text-[#2D2D2D]">
                        Orden #{order.id}
                      </p>
                      <p className="font-body text-xs text-[#6B6B6B]">
                        {new Date(order.createdAt).toLocaleDateString("es-AR")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-body font-medium ${status?.color}`}>
                      {status?.label}
                    </span>
                    <select
                      value={order.status ?? ""}
                      onChange={(e) => updateStatus.mutate({ id: order.id, status: e.target.value as "pending" | "confirmed" | "shipped" | "delivered" })}
                      className="px-3 py-1.5 rounded-lg border border-[#E0D5CC] font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#F8E1E4]"
                    >
                      <option value="pending">Pendiente</option>
                      <option value="confirmed">Confirmado</option>
                      <option value="shipped">Enviado</option>
                      <option value="delivered">Entregado</option>
                    </select>
                  </div>
                </div>

                {/* Customer info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 p-3 bg-[#F8F8F8] rounded-xl">
                  <div>
                    <p className="font-body text-[10px] text-[#6B6B6B] uppercase tracking-wider">Cliente</p>
                    <p className="font-body text-sm text-[#2D2D2D] font-medium">{order.customerName}</p>
                  </div>
                  <div>
                    <p className="font-body text-[10px] text-[#6B6B6B] uppercase tracking-wider">Teléfono</p>
                    <p className="font-body text-sm text-[#2D2D2D]">{order.customerPhone}</p>
                  </div>
                  <div>
                    <p className="font-body text-[10px] text-[#6B6B6B] uppercase tracking-wider">Total</p>
                    <p className="font-body text-sm text-[#2D2D2D] font-semibold">${parseFloat(String(order.totalAmount)).toLocaleString("es-AR")}</p>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2">
                      <Package size={16} className="text-[#D4A5A5]" />
                      <span className="font-body text-sm text-[#2D2D2D] flex-1">{item.name}</span>
                      <span className="font-body text-xs text-[#6B6B6B]">Talle: {item.size}</span>
                      <span className="font-body text-xs text-[#6B6B6B]">x{item.quantity}</span>
                      <span className="font-body text-sm text-[#2D2D2D] font-medium">${(item.price * item.quantity).toLocaleString("es-AR")}</span>
                    </div>
                  ))}
                </div>

                {order.notes && (
                  <div className="mt-3 p-3 bg-[#FFF8F0] rounded-lg">
                    <p className="font-body text-xs text-[#6B6B6B]">{order.notes}</p>
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-[#F0EBE5] flex justify-end">
                  <a
                    href={`https://wa.me/${order.customerPhone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#25D366] font-body text-sm font-medium hover:underline"
                  >
                    <MessageCircle size={16} /> Contactar por WhatsApp
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
