import React from "react";
import { useNavigate } from "react-router-dom";

export default function EmpresaNavbar() {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success">
      <div className="container">
        <span className="navbar-brand">EcoFood Empresa</span>
        <div>
          <button
            className="btn btn-outline-light me-2"
            onClick={() => navigate("/empresa/perfil")}
          >
            Perfil
          </button>
          <button
            className="btn btn-outline-light me-2"
            onClick={() => navigate("/empresa/productos")}
          >
            Productos
          </button>
          <button
            className="btn btn-outline-light me-2"
            onClick={() => navigate("/empresa/solicitudes")}
          >
            Solicitudes
          </button>
          <button className="btn btn-danger" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
}
