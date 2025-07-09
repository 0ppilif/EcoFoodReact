import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { Dropdown } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import Swal from "sweetalert2";

export default function ClienteLayout() {
  const [nombreCliente, setNombreCliente] = useState("");
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

  const obtenerNombreCliente = async () => {
    if (!user) return;
    const ref = doc(db, "usuarios", user.uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data();
      setNombreCliente(data.nombre || user.email);
    }
  };

  const cerrarSesion = async () => {
    const confirmar = await Swal.fire({
      title: "¿Cerrar sesión?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    });

    if (confirmar.isConfirmed) {
      await signOut(auth);
      navigate("/login");
    }
  };

  const nombreCorto = (nombre) => {
    if (!nombre) return "";
    return nombre.length > 15 ? nombre.split(" ")[0] : nombre;
  };

  useEffect(() => {
    obtenerNombreCliente();
  }, [user]);

  return (
    <div className="d-flex min-vh-100">
      {/* Sidebar */}
      <div className="bg-success text-white p-3" style={{ width: "220px" }}>
        <h4 className="fw-bold mb-4">ECOFOOD</h4>
        <nav className="nav flex-column">
          <Link to="/cliente/dashboard" className="nav-link text-white">
            Inicio
          </Link>
          <Link to="/cliente/productos" className="nav-link text-white">
            Productos
          </Link>
          <Link to="/cliente/pedidos" className="nav-link text-white">
            Solicitudes
          </Link>
        </nav>
      </div>

      <div className="flex-grow-1 d-flex flex-column">
        <header className="bg-light d-flex justify-content-between align-items-center px-4 py-2 border-bottom">
          <span className="fw-bold fs-5 text-secondary">Bienvenido a EcoFood</span>
          <Dropdown align="end">
            <Dropdown.Toggle variant="light" className="d-flex align-items-center">
              <span className="me-2">{nombreCorto(nombreCliente)}</span>
              <FaUserCircle size={24} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item as={Link} to="/cliente/perfil">Editar perfil</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={cerrarSesion}>Cerrar sesión</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </header>

        <main className="p-4" style={{ flex: 1, overflowY: "auto" }}>
          <Outlet context={{ actualizarNombreCliente: obtenerNombreCliente }} />
        </main>
      </div>
    </div>
  );
}
