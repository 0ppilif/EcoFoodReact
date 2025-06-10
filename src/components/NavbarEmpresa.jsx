import React from "react";
import { useNavigate } from "react-router-dom";

export default function NavbarEmpresa({ nombre }) {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success px-4">
      <div className="container-fluid">
        <span className="navbar-brand">
          EcoFood - {nombre}
        </span>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item mx-2">
              <button
                className="btn btn-outline-light"
                onClick={() => navigate("/empresa")}
              >
                Inicio
              </button>
            </li>
            <li className="nav-item mx-2">
              <button
                className="btn btn-outline-light"
                onClick={() => navigate("/empresa/perfil")}
              >
                Perfil Empresarial
              </button>
            </li>
            <li className="nav-item mx-2">
              <button
                className="btn btn-outline-light"
                onClick={() => navigate("/empresa/productos")}
              >
                Productos
              </button>
            </li>
            <li className="nav-item mx-2">
              <button className="btn btn-danger" onClick={cerrarSesion}>
                Cerrar sesión
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
