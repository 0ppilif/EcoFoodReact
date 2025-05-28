import { Routes, Route } from "react-router-dom";

// Páginas generales
import Login from "../pages/Login";
import Register from "../pages/Register";
import RecuperarContraseña from "../pages/RecuperarContraseña";
import Home from "../pages/Home";

// Protecciones
import ProtectedRoute from "./ProtectedRoute";
import ProtectedByRole from "./ProtectedByRole";

// Cliente
import ClienteDashboard from "../pages/cliente/ClienteDashboard";

// Admin
import AdminLayout from "../components/admin/layout/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminClientes from "../pages/admin/AdminClientes";
import AdminEmpresas from "../pages/admin/AdminEmpresas";
import AdminAdministradores from "../pages/admin/AdminAdministradores";
import AdminProductos from "../pages/admin/AdminProductos";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/recuperar" element={<RecuperarContraseña />} />

      {/* Ruta común protegida */}
      <Route path="/home" element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      } />

      {/* Cliente */}
      <Route path="/cliente/dashboard" element={
        <ProtectedByRole allowed={["cliente"]}>
          <ClienteDashboard />
        </ProtectedByRole>
      } />

      {/* Admin con subrutas */}
      <Route path="/admin" element={
        <ProtectedByRole allowed={["admin"]}>
          <AdminLayout />
        </ProtectedByRole>
      }>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="clientes" element={<AdminClientes />} />
        <Route path="empresas" element={<AdminEmpresas />} />
        <Route path="administradores" element={<AdminAdministradores />} />
        <Route path="empresas/productos/:id" element={<AdminProductos />} />
      </Route>
    </Routes>
  );
}
