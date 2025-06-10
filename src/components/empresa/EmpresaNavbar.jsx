import React from "react";
import { useNavigate } from "react-router-dom";
import "./EmpresaNavbar.css";

const EmpresaNavbar = ({ nombre }) => {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header className="empresa-navbar">
      <h2>EcoFood - {nombre}</h2>
      <nav>
        <button onClick={() => navigate("/empresa/perfil")}>Perfil Empresarial</button>
        <button onClick={() => navigate("/empresa/productos")}>Productos</button>
        <button onClick={cerrarSesion}>Cerrar sesión</button>
      </nav>
    </header>
  );
};

export default EmpresaNavbar;
