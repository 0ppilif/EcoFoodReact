import { useAuth } from "../context/AuthContext";
import CerrarSesion from "./CerrarSesion";
import { Link } from "react-router-dom";
import "./navbarGeneral.css";

export default function NavbarGeneral({ tipo }) {
  const { userData } = useAuth();

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

  return (
    <nav className="navbar navbar-expand-lg navbar-eco px-4">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <span className="navbar-brand text-white fw-bold">EcoFood - {userData?.nombre}</span>
        <div className="d-flex gap-3 align-items-center">
          {tipo === "admin" ? rutasAdmin : rutasCliente}
          <CerrarSesion />
        </div>
      </div>
    </nav>
  );
}
