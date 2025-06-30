import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import "./clienteLayout.css";

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
    await signOut(auth);
    navigate("/login");
  };

  useEffect(() => {
    obtenerNombreCliente();
  }, [user]);

  return (
    <div className="fondo-cliente">
      <nav className="navbar navbar-expand-lg navbar-dark bg-success">
        <div className="container">
          <span className="navbar-brand">EcoFood - {nombreCliente}</span>
          <div className="ms-auto d-flex gap-2">
            <button className="btn btn-outline-light" onClick={() => navigate("/cliente/dashboard")}>Inicio</button>
            <button className="btn btn-outline-light" onClick={() => navigate("/cliente/productos")}>Productos</button>
            <button className="btn btn-outline-light" onClick={() => navigate("/cliente/pedidos")}>Mis Pedidos</button>
            <button className="btn btn-outline-light" onClick={() => navigate("/cliente/perfil")}>Editar Perfil</button>
            <button className="btn btn-danger" onClick={cerrarSesion}>Cerrar Sesión</button>
          </div>
        </div>
      </nav>

      <main className="container">
        <div className="contenedor-blanco">
          <Outlet context={{ actualizarNombreCliente: obtenerNombreCliente }} />
        </div>
      </main>
    </div>
  );
}