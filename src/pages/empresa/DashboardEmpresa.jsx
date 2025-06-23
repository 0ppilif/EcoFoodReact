import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardEmpresa = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="container mt-5 text-center">
      <div className="card shadow p-4">
        <h2 className="mb-4">Bienvenido, {user?.nombre}</h2>
        <h5 className="text-muted mb-4">Tipo de usuario: Empresa</h5>

        <div className="d-grid gap-3 col-6 mx-auto">
          <button className="btn btn-primary" onClick={() => navigate('/empresa/perfil')}>
            Perfil Empresarial
          </button>
          <button className="btn btn-success" onClick={() => navigate('/empresa/productos')}>
            Productos
          </button>
          <button className="btn btn-warning" onClick={() => navigate('/empresa/solicitudes')}>
            Solicitudes
          </button>
          <button className="btn btn-danger" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardEmpresa;
