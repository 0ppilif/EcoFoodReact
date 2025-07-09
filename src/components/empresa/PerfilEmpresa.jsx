import React, { useEffect, useState } from "react";
import empresaService from "../../services/empresaService";
import EmpresaNavbar from "../../components/empresa/EmpresaNavbar";
import "../../styles/empresaDashboard.css";

const PerfilEmpresa = () => {
  const [empresa, setEmpresa] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      empresaService.obtenerEmpresa(user.uid).then(data => setEmpresa(data));
    }
  }, []);

  if (!empresa) return null;

  return (
    <div className="empresa-background">
      <EmpresaNavbar nombre={empresa.nombre} />
      <div className="empresa-overlay">
        <div className="empresa-card">
          <h2>Perfil de la Empresa</h2>
          <p><strong>Nombre:</strong> {empresa.nombre}</p>
          <p><strong>Email:</strong> {empresa.email}</p>
          <p><strong>Rol:</strong> {empresa.tipo}</p>
        </div>
      </div>
    </div>
  );
};

export default PerfilEmpresa;
