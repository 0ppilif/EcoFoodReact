import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { db } from "../../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Dropdown } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import Swal from "sweetalert2";

export default function EmpresaLayout() {
  const [nombreEmpresa, setNombreEmpresa] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const ref = doc(db, "usuarios", firebaseUser.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setNombreEmpresa(data.nombre || "Empresa");
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const cerrarSesion = async () => {
    const confirmar = await Swal.fire({
      title: "¿Cerrar sesión?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    });

    if (confirmar.isConfirmed) {
      const auth = getAuth();
      await signOut(auth);
      navigate("/login");
    }
  };

  const nombreCorto = (nombre) => {
    return nombre.length > 15 ? nombre.split(" ")[0] : nombre;
  };

  return (
    <div className="d-flex min-vh-100">
      <div className="bg-success text-white p-3" style={{ width: "220px" }}>
        <h4 className="fw-bold mb-4">ECOFOOD</h4>
        <nav className="nav flex-column">
          <Link to="/empresa/productos" className="nav-link text-white">Productos</Link>
          <Link to="/empresa/solicitudes" className="nav-link text-white">Solicitudes</Link>
        </nav>
      </div>

      <div className="flex-grow-1 d-flex flex-column">
        <header className="bg-light d-flex justify-content-between align-items-center px-4 py-2 border-bottom">
          <span className="fw-bold fs-5 text-secondary">Panel Empresa</span>
          <Dropdown align="end">
            <Dropdown.Toggle variant="light" className="d-flex align-items-center">
              <span className="me-2">{nombreCorto(nombreEmpresa)}</span>
              <FaUserCircle size={24} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item as={Link} to="/empresa/perfil">Editar perfil</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={cerrarSesion}>Cerrar sesión</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </header>

        <main className="p-4" style={{ flex: 1, overflowY: "auto" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
