import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import "./navbarGeneral.css";

export default function NavbarGeneral({ tipo }) {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const auth = getAuth();

  const cerrarSesion = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const rutasAdmin = (
    <>
      <Link to="/admin/dashboard" className="btn btn-outline-light">Inicio</Link>
      <Link to="/admin/clientes" className="btn btn-outline-light">Clientes</Link>
      <Link to="/admin/empresas" className="btn btn-outline-light">Empresas</Link>
      <Link to="/admin/administradores" className="btn btn-outline-light">Administradores</Link>
    </>
  );

  const rutasCliente = (
    <>
      <Link to="/cliente/dashboard" className="btn btn-outline-light">Inicio</Link>
      <Link to="/cliente/contacto" className="btn btn-outline-light">Contacto</Link>
    </>
  );

  const nombreCorto = userData?.nombre?.split(" ")[0] || "Usuario";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success px-3">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Logo */}
        <span className="navbar-brand fw-bold">EcoFood</span>

        {/* Menú lateral (admin o cliente) */}
        <div className="d-flex gap-3 align-items-center flex-wrap">
          {tipo === "admin" ? rutasAdmin : rutasCliente}

          {/* Nombre + Dropdown usuario */}
          <div className="dropdown">
            <button
              className="btn btn-light d-flex align-items-center"
              onClick={() => setShowMenu(!showMenu)}
            >
              <span className="me-2">{nombreCorto.length > 12 ? nombreCorto.slice(0, 12) + "..." : nombreCorto}</span>
              <FaUserCircle size={24} />
            </button>

            {showMenu && (
              <ul className="dropdown-menu dropdown-menu-end show mt-2">
                <li>
                  <button className="dropdown-item" onClick={() => navigate(tipo === "admin" ? "/admin/perfil" : "/cliente/perfil")}>
                    Editar perfil
                  </button>
                </li>
                <li>
                  <button className="dropdown-item text-danger" onClick={cerrarSesion}>
                    Cerrar sesión
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
