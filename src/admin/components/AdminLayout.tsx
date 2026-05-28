import { Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard, Package, ShoppingBag, LogOut,
  ChevronRight, Heart, ArrowLeft
} from "lucide-react";
import { useAdminAuth } from "@/admin/context/AdminAuth";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/productos", label: "Productos", icon: Package },
  { to: "/admin/ordenes", label: "Órdenes", icon: ShoppingBag },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAdminAuth();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#F5F0EB] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#2D2D2D] text-white flex flex-col fixed h-full">
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2 mb-1">
            <Heart size={16} className="text-[#F8E1E4]" fill="#F8E1E4" />
            <span className="font-accent text-xl font-bold text-[#F8E1E4]">Melli Melos</span>
          </Link>
          <p className="font-body text-xs text-white/40 mt-1">Panel de Administración</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm transition-all ${
                  isActive
                    ? "bg-[#F8E1E4] text-[#2D2D2D] font-medium"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={18} />
                {item.label}
                {isActive && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all"
          >
            <ArrowLeft size={18} />
            Volver a la tienda
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm text-white/60 hover:text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
