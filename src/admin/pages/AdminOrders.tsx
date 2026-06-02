import { useState, useEffect } from "react";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";

const statusLabels: Record<string, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  shipped: "Enviado",
  delivered: "Entregado",
};

const statusColors: Record<string, string> = {
  pending: "bg-[#FAD4C0] text-[#8b6914]",
  confirmed: "bg-[#F8E1E4] text-[#8b5a5a]",
  shipped: "bg-[#E8E0F0] text-[#5a4a8b]",
  delivered: "bg-[#E8F5E9] text-[#4a7c59]",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const loadOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const json = await res.json();
      setOrders(json.items ?? []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { loadOrders(); }, []);

  const filteredOrders = statusFilter === "all"
    ? orders
    : orders.filter((o: any) => o.status === statusFilter);

  const totalAmount = filteredOrders.reduce((sum: number, o: any) => sum + parseFloat(String(o.totalAmount)), 0);

  const updateStatus = async (id: number, status: string) => {
    setUpdatingId(id);
    try {
      await fetch(`/api/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      await loadOrders();
    } catch (e) { console.error(e); }
    setUpdatingId(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#2D2D2D]">Ordenes</h1>
          <p className="font-body text-[#6B6B6B] mt-1">{orders.length} ordenes | Total: ${totalAmount.toLocaleString("es-AR")}</p>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "all", label: "Todas", icon: Package },
          { key: "pending", label: "Pendientes", icon: Clock },
          { key: "confirmed", label: "Confirmadas", icon: CheckCircle },
          { key: "shipped", label: "Enviadas", icon: Truck },
          { key: "delivered", label: "Entregadas", icon: CheckCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.key} onClick={() => setStatusFilter(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-body text-sm transition-all ${
                statusFilter === tab.key ? "bg-[#2D2D2D] text-white" : "bg-white border border-[#E0D5CC] text-[#6B6B6B] hover:bg-[#F5F0EB]"
              }`}>
              <Icon size={16} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Orders list */}
      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        {loading ? (
          <div className="p-12 text-center font-body text-[#6B6B6B]">Cargando...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <Package size={48} className="text-[#D4A5A5] mx-auto mb-3" />
            <p className="font-body text-[#6B6B6B]">No hay ordenes</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F5F0EB]">
                <tr>
                  <th className="text-left font-body text-xs font-semibold text-[#6B6B6B] uppercase px-4 py-3">ID</th>
                  <th className="text-left font-body text-xs font-semibold text-[#6B6B6B] uppercase px-4 py-3">Cliente</th>
                  <th className="text-left font-body text-xs font-semibold text-[#6B6B6B] uppercase px-4 py-3">Productos</th>
                  <th className="text-left font-body text-xs font-semibold text-[#6B6B6B] uppercase px-4 py-3">Total</th>
                  <th className="text-left font-body text-xs font-semibold text-[#6B6B6B] uppercase px-4 py-3">Estado</th>
                  <th className="text-right font-body text-xs font-semibold text-[#6B6B6B] uppercase px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EBE5]">
                {filteredOrders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-[#FFF8F0] transition-colors">
                    <td className="px-4 py-3 font-body text-sm text-[#2D2D2D]">#{order.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-body text-sm text-[#2D2D2D] font-medium">{order.customerName}</p>
                      <p className="font-body text-xs text-[#6B6B6B]">{order.customerPhone}</p>
                    </td>
                    <td className="px-4 py-3 font-body text-xs text-[#6B6B6B]">
                      {(order.items ?? []).length} items
                    </td>
                    <td className="px-4 py-3 font-body text-sm text-[#2D2D2D] font-semibold">
                      ${parseFloat(String(order.totalAmount)).toLocaleString("es-AR")}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-body font-medium ${statusColors[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {order.status === "pending" && (
                          <button onClick={() => updateStatus(order.id, "confirmed")} disabled={updatingId === order.id}
                            className="px-3 py-1.5 bg-[#E8F5E9] text-[#4a7c59] rounded-lg font-body text-xs hover:bg-[#d4edda] transition-colors disabled:opacity-50">
                            {updatingId === order.id ? "..." : "Confirmar"}
                          </button>
                        )}
                        {order.status === "confirmed" && (
                          <button onClick={() => updateStatus(order.id, "shipped")} disabled={updatingId === order.id}
                            className="px-3 py-1.5 bg-[#E8E0F0] text-[#5a4a8b] rounded-lg font-body text-xs hover:bg-[#ddd4f0] transition-colors disabled:opacity-50">
                            {updatingId === order.id ? "..." : "Enviar"}
                          </button>
                        )}
                        {order.status === "shipped" && (
                          <button onClick={() => updateStatus(order.id, "delivered")} disabled={updatingId === order.id}
                            className="px-3 py-1.5 bg-[#FAD4C0] text-[#8b6914] rounded-lg font-body text-xs hover:bg-[#f5c9a8] transition-colors disabled:opacity-50">
                            {updatingId === order.id ? "..." : "Entregar"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
