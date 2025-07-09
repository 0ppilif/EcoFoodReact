import React, { useEffect, useState } from "react";
import { getAuth, updatePassword } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import Swal from "sweetalert2";
import { useOutletContext } from "react-router-dom";
import "../../styles/empresadashboard.css";

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

export default function EditarPerfil() {
  const auth = getAuth();
  const user = auth.currentUser;
  const { actualizarNombreCliente } = useOutletContext();

  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [comuna, setComuna] = useState("");
  const [nuevaContrasena, setNuevaContrasena] = useState("");

  useEffect(() => {
    const obtenerDatos = async () => {
      const ref = doc(db, "usuarios", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setNombre(data.nombre || "");
        setDireccion(data.direccion || "");
        setComuna(data.comuna || "");
      }
    };
    obtenerDatos();
  }, [user]);

  const validarFormulario = () => {
    if (nombre.length > 50) {
      Swal.fire("Error", "El nombre no debe exceder los 50 caracteres", "error");
      return false;
    }
    if (direccion.length > 50) {
      Swal.fire("Error", "La dirección no debe exceder los 50 caracteres", "error");
      return false;
    }
    if (
      nuevaContrasena &&
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\s]).{6,}$/.test(nuevaContrasena)
    ) {
      Swal.fire(
        "Error",
        "La contraseña debe tener al menos 6 caracteres, incluyendo mayúscula, minúscula y un símbolo",
        "error"
      );
      return false;
    }
    return true;
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    try {
      const ref = doc(db, "usuarios", user.uid);
      await updateDoc(ref, {
        nombre,
        direccion,
        comuna,
      });

      if (nuevaContrasena) {
        await updatePassword(user, nuevaContrasena);
      }

      actualizarNombreCliente();
      Swal.fire("Actualizado", "Tu perfil ha sido actualizado", "success");
    } catch (error) {
      Swal.fire("Error", "No se pudo actualizar tu perfil", "error");
    }
  };

  const comunasDisponibles = regiones.flatMap((r) => r.comunas);

  return (
    <div className="empresa-background">
      <div className="empresa-overlay">
        <div className="empresa-card">
          <h2 className="mb-4">Editar Perfil</h2>
          <form onSubmit={manejarEnvio}>
            <div className="mb-3">
              <label className="form-label">Correo Electrónico</label>
              <input type="email" className="form-control" value={user.email} disabled />
            </div>
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                maxLength={50}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Dirección</label>
              <input
                type="text"
                className="form-control"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                maxLength={50}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Comuna</label>
              <select
                className="form-select"
                value={comuna}
                onChange={(e) => setComuna(e.target.value)}
                required
              >
                <option value="">Selecciona una comuna</option>
                {comunasDisponibles.map((c, i) => (
                  <option key={i} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Nueva Contraseña (opcional)</label>
              <input
                type="password"
                className="form-control"
                value={nuevaContrasena}
                onChange={(e) => setNuevaContrasena(e.target.value)}
              />
            </div>
            <div className="text-end">
              <button type="submit" className="btn btn-success">
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
