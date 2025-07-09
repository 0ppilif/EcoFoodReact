import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import RecuperarContraseña from "../pages/RecuperarContraseña";
import Home from "../pages/Home";
import ProtectedRoute from "./ProtectedRoute";
import ProtectedByRole from "./ProtectedByRole";

// Cliente
import ClienteLayout from "../components/cliente/ClienteLayout";
import ClienteDashboard from "../pages/cliente/ClienteDashboard";
import VerProductos from "../pages/cliente/VerProductos";
import MisPedidos from "../pages/cliente/MisPedidos";
import EditarPerfil from "../pages/cliente/EditarPerfil";

// Admin
import AdminLayout from "../components/admin/layout/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminClientes from "../pages/admin/AdminClientes";
import AdminEmpresas from "../pages/admin/AdminEmpresas";
import AdminAdministradores from "../pages/admin/AdminAdministradores";
import AdminProductos from "../pages/admin/AdminProductos";

// Empresa
import EmpresaLayout from "../components/empresa/EmpresaLayout";
import DashboardEmpresa from "../pages/empresa/DashboardEmpresa";
import PerfilEmpresa from "../pages/empresa/PerfilEmpresa";
import ProductosEmpresa from "../pages/empresa/ProductosEmpresa";
import SolicitudesEmpresa from "../pages/empresa/SolicitudesEmpresa";

export default function AppRouter() {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/recuperar" element={<RecuperarContraseña />} />

      {/* Protegida general */}
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
        path="/cliente"
        element={
          <ProtectedByRole allowed={["cliente"]}>
            <ClienteLayout />
          </ProtectedByRole>
        }
      >
        <Route path="dashboard" element={<ClienteDashboard />} />
        <Route path="productos" element={<VerProductos />} />
        <Route path="pedidos" element={<MisPedidos />} />
        <Route path="perfil" element={<EditarPerfil />} />
      </Route>

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
        path="/empresa"
        element={
          <ProtectedByRole allowed={["empresa"]}>
            <EmpresaLayout />
          </ProtectedByRole>
        }
      >
        <Route path="dashboard" element={<DashboardEmpresa />} />
        <Route path="perfil" element={<PerfilEmpresa />} />
        <Route path="productos" element={<ProductosEmpresa />} />
        <Route path="solicitudes" element={<SolicitudesEmpresa />} />
      </Route>

      {/* Página no encontrada */}
      <Route path="*" element={<h2>Página no encontrada</h2>} />
    </Routes>
  );
}
