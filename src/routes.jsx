import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import PerfilEmpresa from "./pages/empresa/PerfilEmpresa";
import ProductosEmpresa from "./pages/empresa/ProductosEmpresa";
import EmpresaDashboard from "./pages/empresa/EmpresaDashboard";
import DashboardEmpresa from "./pages/empresa/DashboardEmpresa";
import PanelAdmin from "./pages/admin/PanelAdmin";
import Login from "./pages/Login";

const user = JSON.parse(localStorage.getItem("user"));

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />

      {user?.tipo === "empresa" && (
        <>
          <Route path="/empresa" element={<EmpresaDashboard />} />
          <Route path="/empresa/perfil" element={<PerfilEmpresa />} />
          <Route path="/empresa/productos" element={<ProductosEmpresa />} />
        </>
      )}

      {user?.tipo === "admin" && (
        <Route path="/admin" element={<PanelAdmin />} />
      )}

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </Router>
);

export default AppRoutes;
