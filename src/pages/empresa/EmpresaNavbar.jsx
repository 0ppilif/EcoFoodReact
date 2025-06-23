import React from "react";

const EmpresaNavbar = ({ nombre }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success px-4">
      <span className="navbar-brand fs-5">
        EcoFood - <strong>{nombre || "Empresa"}</strong>
      </span>
      <div className="collapse navbar-collapse justify-content-end">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" href="/empresa/perfil">Perfil</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/empresa/productos">Productos</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/empresa/solicitudes">Solicitudes</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default EmpresaNavbar;
