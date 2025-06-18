import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import EmpresaNavbar from "../../components/empresa/EmpresaNavbar";
import "../../styles/empresadashboard.css";
import Swal from "sweetalert2";

const regiones = [
  {
    nombre: "Región de Coquimbo",
    comunas: ["La Serena", "Coquimbo", "Vicuña", "Ovalle"],
  },
  {
    nombre: "Región Metropolitana",
    comunas: ["Santiago", "Puente Alto", "Maipú", "Las Condes"],
  },
];

const PerfilEmpresa = () => {
  const auth = getAuth();
  const [empresa, setEmpresa] = useState(null);
  const [editando, setEditando] = useState(false);
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [comuna, setComuna] = useState("");

  useEffect(() => {
    const obtenerDatosEmpresa = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const datos = docSnap.data();
          setEmpresa(datos);
          setNombre(datos.nombre || "");
          setDireccion(datos.direccion || "");
          setComuna(datos.comuna || "");
        }
      }
    };
    obtenerDatosEmpresa();
  }, [auth]);

  const guardarCambios = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "usuarios", user.uid);
        await updateDoc(docRef, {
          nombre,
          direccion,
          comuna,
        });
        setEmpresa((prev) => ({ ...prev, nombre, direccion, comuna }));
        setEditando(false);
        Swal.fire("Actualizado", "Perfil actualizado correctamente", "success");
      }
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      Swal.fire("Error", "No se pudo actualizar el perfil", "error");
    }
  };

  if (!empresa) {
    return <p className="text-white text-center mt-5">Cargando...</p>;
  }

  return (
    <div className="empresa-background">
      <EmpresaNavbar nombre={empresa.nombre} />
      <div className="empresa-overlay">
        <div className="bg-white rounded-4 p-4 shadow-lg" style={{ maxWidth: "600px", width: "100%" }}>
          <h2 className="mb-4 text-center">Perfil de la Empresa</h2>

          <div className="mb-3">
            <strong>Nombre:</strong>{" "}
            {editando ? (
              <input
                className="form-control"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                maxLength={100}
              />
            ) : (
              empresa.nombre
            )}
          </div>
          <div className="mb-3">
            <strong>Email:</strong> {empresa.email}
          </div>
          <div className="mb-3">
            <strong>Tipo:</strong> {empresa.tipo}
          </div>
          <div className="mb-3">
            <strong>Dirección:</strong>{" "}
            {editando ? (
              <input
                className="form-control"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                maxLength={100}
              />
            ) : (
              empresa.direccion || "-"
            )}
          </div>
          <div className="mb-3">
            <strong>Comuna:</strong>{" "}
            {editando ? (
              <select
                className="form-select"
                value={comuna}
                onChange={(e) => setComuna(e.target.value)}
              >
                <option value="">Selecciona una comuna</option>
                {regiones.map((region, i) => (
                  <optgroup key={i} label={region.nombre}>
                    {region.comunas.map((comunaNombre, j) => (
                      <option key={j} value={comunaNombre}>
                        {comunaNombre}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            ) : (
              empresa.comuna || "-"
            )}
          </div>

          <div className="text-end">
            {editando ? (
              <>
                <button className="btn btn-success me-2" onClick={guardarCambios}>Guardar</button>
                <button className="btn btn-secondary" onClick={() => setEditando(false)}>Cancelar</button>
              </>
            ) : (
              <button className="btn btn-primary" onClick={() => setEditando(true)}>Editar perfil</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilEmpresa;
