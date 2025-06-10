import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const EmpresaNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success">
      <div className="container-fluid">
        <span className="navbar-brand">EcoFood Empresa</span>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarEmpresa" aria-controls="navbarEmpresa" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarEmpresa">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink to="/empresa/inicio" className="nav-link">Inicio</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/empresa/perfil" className="nav-link">Perfil Empresarial</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/empresa/productos" className="nav-link">Productos</NavLink>
            </li>
          </ul>
          <button className="btn btn-outline-light" onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </div>
    </nav>
  );
};

export default EmpresaNavbar;
