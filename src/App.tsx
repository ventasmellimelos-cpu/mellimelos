import { Routes, Route, Navigate } from "react-router";
import { CartProvider } from "./context/CartContext";
import { AdminAuthProvider, useAdminAuth } from "./admin/context/AdminAuth";
import Navbar from "./components/Navbar";
import CartDrawer from "./components/CartDrawer";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminLayout from "./admin/components/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminProducts from "./admin/pages/AdminProducts";
import AdminOrders from "./admin/pages/AdminOrders";

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAdminAuth();
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return <AdminLayout>{children}</AdminLayout>;
}

export default function App() {
  return (
    <AdminAuthProvider>
      <CartProvider>
        <Navbar />
        <CartDrawer />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<><Home /><Footer /></>} />
          <Route path="/catalogo" element={<><Catalogo /><Footer /></>} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
          <Route path="/admin/productos" element={<AdminGuard><AdminProducts /></AdminGuard>} />
          <Route path="/admin/ordenes" element={<AdminGuard><AdminOrders /></AdminGuard>} />
        </Routes>
      </CartProvider>
    </AdminAuthProvider>
  );
}
