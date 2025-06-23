import React, { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import "./clienteDashboard.css";

export default function ClienteDashboard() {
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;
  const [nombreCliente, setNombreCliente] = useState("");

  const cerrarSesion = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const obtenerNombreCliente = async () => {
    if (!user) return;
    const ref = doc(db, "usuarios", user.uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data();
      setNombreCliente(data.nombre || user.email);
    }
  };

  useEffect(() => {
    obtenerNombreCliente();
  }, [user]);

  return (
    <div className="cliente-dashboard">
      <nav className="navbar navbar-expand-lg navbar-dark bg-success">
        <div className="container">
          <span className="navbar-brand">EcoFood Cliente</span>
          <div className="d-flex flex-wrap gap-2">
            <button className="btn btn-outline-light" onClick={() => navigate("/cliente/productos")}>
              Productos
            </button>
            <button className="btn btn-outline-light" onClick={() => navigate("/cliente/pedidos")}>
              Mis Pedidos
            </button>
            <button className="btn btn-outline-light" onClick={() => navigate("/cliente/perfil")}>
              Editar Perfil
            </button>
            <button className="btn btn-danger" onClick={cerrarSesion}>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      <div className="overlay">
        <div className="welcome-card">
          <h2 className="mb-4">Bienvenido, {nombreCliente}</h2>
          <p>Puedes ver y pedir los productos que necesites</p>
        </div>
      </div>
    </div>
  );
}
