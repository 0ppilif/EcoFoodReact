import React from "react";
import { useNavigate } from "react-router-dom";

const HomeCliente = () => {
  const navigate = useNavigate();

  return (
    <div className="empresa-background">
      <div className="empresa-overlay d-flex flex-column align-items-center justify-content-center vh-100">
        <h1 className="mb-4 text-white">Bienvenido a EcoFood</h1>
        <div className="d-flex gap-3">
          <button className="btn btn-success" onClick={() => navigate("/cliente/productos")}>
            Ver Productos
          </button>
          <button className="btn btn-info" onClick={() => navigate("/cliente/pedidos")}>
            Mis Pedidos
          </button>
          <button className="btn btn-secondary" onClick={() => navigate("/cliente/perfil")}>
            Editar Perfil
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeCliente;
