import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { db } from "../../services/firebase";
import { doc, getDoc } from "firebase/firestore";

const EmpresaNavbar = () => {
  const [nombreEmpresa, setNombreEmpresa] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const obtenerNombre = async () => {
      if (!user) return;
      const docRef = doc(db, "usuarios", user.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        setNombreEmpresa(data.nombre || "Empresa");
      }
    };
    obtenerNombre();
  }, [user]);

  const cerrarSesion = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success">
      <div className="container-fluid">
        <span className="navbar-brand">EcoFood - {nombreEmpresa}</span>
        <div>
          <button className="btn btn-outline-light me-2" onClick={() => navigate("/empresa/perfil")}>
            Perfil
          </button>
          <button className="btn btn-outline-light me-2" onClick={() => navigate("/empresa/productos")}>
            Productos
          </button>
          <button className="btn btn-outline-light me-2" onClick={() => navigate("/empresa/solicitudes")}>
            Solicitudes
          </button>
          <button className="btn btn-danger" onClick={cerrarSesion}>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
};

export default EmpresaNavbar;
