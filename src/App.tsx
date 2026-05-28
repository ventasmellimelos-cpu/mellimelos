import { Routes, Route, Navigate } from "react-router";
import { CartProvider } from "./context/CartContext";
import { SettingsProvider } from "./context/SettingsContext";
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
import AdminConfig from "./admin/pages/AdminConfig";

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAdminAuth();
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return <AdminLayout>{children}</AdminLayout>;
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <CartDrawer />
      {children}
    </>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <AdminAuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<PublicLayout><><Home /><Footer /></></PublicLayout>} />
            <Route path="/catalogo" element={<PublicLayout><><Catalogo /><Footer /></></PublicLayout>} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
            <Route path="/admin/productos" element={<AdminGuard><AdminProducts /></AdminGuard>} />
            <Route path="/admin/ordenes" element={<AdminGuard><AdminOrders /></AdminGuard>} />
            <Route path="/admin/configuracion" element={<AdminGuard><AdminConfig /></AdminGuard>} />
          </Routes>
        </CartProvider>
      </AdminAuthProvider>
    </SettingsProvider>
  );
}
