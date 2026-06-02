import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router";
import { CartProvider } from "./context/CartContext";
import { SettingsProvider } from "./context/SettingsContext";
import { AdminAuthProvider, useAdminAuth } from "./admin/context/AdminAuth";
import Navbar from "./components/Navbar";
import CartDrawer from "./components/CartDrawer";
import Footer from "./components/Footer";
import Home from "./pages/Home";

// Code-split: público (Catalogo) y todo el panel admin se cargan on-demand,
// así el visitante de la home no descarga el JS del catálogo ni del admin.
const Catalogo = lazy(() => import("./pages/Catalogo"));
const AdminLogin = lazy(() => import("./admin/pages/AdminLogin"));
const AdminLayout = lazy(() => import("./admin/components/AdminLayout"));
const AdminDashboard = lazy(() => import("./admin/pages/AdminDashboard"));
const AdminProducts = lazy(() => import("./admin/pages/AdminProducts"));
const AdminOrders = lazy(() => import("./admin/pages/AdminOrders"));
const AdminConfig = lazy(() => import("./admin/pages/AdminConfig"));

function PageFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-[#FFF8F0]">
      <div className="w-8 h-8 border-2 border-[#D4A5A5] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

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
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<PublicLayout><><Home /><Footer /></></PublicLayout>} />
              <Route path="/catalogo" element={<PublicLayout><><Catalogo /><Footer /></></PublicLayout>} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
              <Route path="/admin/productos" element={<AdminGuard><AdminProducts /></AdminGuard>} />
              <Route path="/admin/ordenes" element={<AdminGuard><AdminOrders /></AdminGuard>} />
              <Route path="/admin/configuracion" element={<AdminGuard><AdminConfig /></AdminGuard>} />
            </Routes>
          </Suspense>
        </CartProvider>
      </AdminAuthProvider>
    </SettingsProvider>
  );
}
