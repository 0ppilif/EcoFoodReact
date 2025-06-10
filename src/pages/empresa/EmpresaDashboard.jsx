import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import EmpresaNavbar from "../../components/empresa/EmpresaNavbar";

const EmpresaDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const irA = (ruta) => navigate(ruta);

  return (
    <>
      <EmpresaNavbar />
      <div className="container text-center mt-5">
        <h2 className="mb-4">
          Bienvenido, {user?.nombre} ({user?.tipo})
        </h2>
        <div className="d-flex justify-content-center gap-4">
          <button className="btn btn-outline-primary" onClick={() => irA("/empresa/perfil")}>
            Perfil Empresarial
          </button>
          <button className="btn btn-outline-success" onClick={() => irA("/empresa/productos")}>
            Productos
          </button>
          <button className="btn btn-outline-danger" onClick={() => {
            localStorage.removeItem("user");
            navigate("/login");
          }}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </>
  );
};

export default EmpresaDashboard;
