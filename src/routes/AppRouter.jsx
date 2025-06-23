import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import RecuperarContraseña from "../pages/RecuperarContraseña";
import Home from "../pages/Home";
import ProtectedRoute from "./ProtectedRoute";
import ProtectedByRole from "./ProtectedByRole";

import ClienteDashboard from "../pages/cliente/ClienteDashboard";
import VerProductos from "../pages/cliente/VerProductos";
import MisPedidos from "../pages/cliente/MisPedidos";
import EditarPerfil from "../pages/cliente/EditarPerfil";

import AdminLayout from "../components/admin/layout/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminClientes from "../pages/admin/AdminClientes";
import AdminEmpresas from "../pages/admin/AdminEmpresas";
import AdminAdministradores from "../pages/admin/AdminAdministradores";
import AdminProductos from "../pages/admin/AdminProductos";

import DashboardEmpresa from "../pages/empresa/DashboardEmpresa";
import PerfilEmpresa from "../pages/empresa/PerfilEmpresa";
import ProductosEmpresa from "../pages/empresa/ProductosEmpresa";
import SolicitudesEmpresa from "../pages/empresa/SolicitudesEmpresa"; // NUEVA

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/recuperar" element={<RecuperarContraseña />} />

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* Cliente */}
      <Route
        path="/cliente/dashboard"
        element={
          <ProtectedByRole allowed={["cliente"]}>
            <ClienteDashboard />
          </ProtectedByRole>
        }
      />
      <Route
        path="/cliente/productos"
        element={
          <ProtectedByRole allowed={["cliente"]}>
            <VerProductos />
          </ProtectedByRole>
        }
      />
      <Route
        path="/cliente/pedidos"
        element={
          <ProtectedByRole allowed={["cliente"]}>
            <MisPedidos />
          </ProtectedByRole>
        }
      />
      <Route
        path="/cliente/perfil"
        element={
          <ProtectedByRole allowed={["cliente"]}>
            <EditarPerfil />
          </ProtectedByRole>
        }
      />

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedByRole allowed={["admin"]}>
            <AdminLayout />
          </ProtectedByRole>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="clientes" element={<AdminClientes />} />
        <Route path="empresas" element={<AdminEmpresas />} />
        <Route path="administradores" element={<AdminAdministradores />} />
        <Route path="empresas/productos/:id" element={<AdminProductos />} />
      </Route>

      {/* Empresa */}
      <Route
        path="/empresa/dashboard"
        element={
          <ProtectedByRole allowed={["empresa"]}>
            <DashboardEmpresa />
          </ProtectedByRole>
        }
      />
      <Route
        path="/empresa/perfil"
        element={
          <ProtectedByRole allowed={["empresa"]}>
            <PerfilEmpresa />
          </ProtectedByRole>
        }
      />
      <Route
        path="/empresa/productos"
        element={
          <ProtectedByRole allowed={["empresa"]}>
            <ProductosEmpresa />
          </ProtectedByRole>
        }
      />
      <Route
        path="/empresa/solicitudes"
        element={
          <ProtectedByRole allowed={["empresa"]}>
            <SolicitudesEmpresa />
          </ProtectedByRole>
        }
      />

      <Route path="*" element={<h2>Página no encontrada</h2>} />
    </Routes>
  );
}
