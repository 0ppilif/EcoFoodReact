import React, { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Swal from "sweetalert2";
import EmpresaNavbar from "../../components/empresa/EmpresaNavbar";
import "../../styles/empresadashboard.css";

export default function SolicitudesEmpresa() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [empresaNombre, setEmpresaNombre] = useState("");
  const auth = getAuth();
  const empresaId = auth.currentUser?.uid;

  const obtenerDatosEmpresa = async () => {
    if (!empresaId) return;
    const ref = doc(db, "usuarios", empresaId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data();
      setEmpresaNombre(data.nombre || "Empresa");
    }
  };

  const obtenerSolicitudes = async () => {
    if (!empresaId) return;
    const q = query(collection(db, "solicitudes"), where("empresaId", "==", empresaId));
    const snapshot = await getDocs(q);
    const lista = [];

    for (const docSnap of snapshot.docs) {
      const solicitud = docSnap.data();
      const productoRef = doc(db, "producto", solicitud.productoId);
      const productoSnap = await getDoc(productoRef);
      const productoData = productoSnap.exists() ? productoSnap.data() : {};

      const clienteRef = doc(db, "usuarios", solicitud.clienteId);
      const clienteSnap = await getDoc(clienteRef);
      const clienteData = clienteSnap.exists() ? clienteSnap.data() : {};

      lista.push({
        id: docSnap.id,
        ...solicitud,
        productoNombre: productoData.nombre || "Producto",
        clienteNombre: clienteData.nombre || "Cliente",
        productoCantidad: productoData.cantidad || 0,
      });
    }

    setSolicitudes(lista);
  };

  const cambiarEstadoSolicitud = async (solicitud, nuevoEstado) => {
    const solicitudRef = doc(db, "solicitudes", solicitud.id);

    if (nuevoEstado === "entregado") {
      const productoRef = doc(db, "producto", solicitud.productoId);
      const productoSnap = await getDoc(productoRef);
      if (productoSnap.exists()) {
        const producto = productoSnap.data();
        const nuevoStock = producto.cantidad - solicitud.cantidadSolicitada;

        if (nuevoStock < 0) {
          Swal.fire("Error", "No hay suficiente stock", "error");
          return;
        }

        await updateDoc(productoRef, { cantidad: nuevoStock });
      }
    }

    await updateDoc(solicitudRef, { estado: nuevoEstado });
    Swal.fire("Actualizado", "Estado actualizado correctamente", "success");
    obtenerSolicitudes();
  };

  useEffect(() => {
    obtenerDatosEmpresa();
    obtenerSolicitudes();
  }, []);

  return (
    <div className="empresa-background">
      <EmpresaNavbar nombre={empresaNombre} />
      <div className="empresa-overlay">
        <div className="empresa-card">
          <h2 className="mb-4">Solicitudes de Productos</h2>

          {solicitudes.length === 0 ? (
            <p>No hay solicitudes aún.</p>
          ) : (
            <div className="productos-scroll table-responsive">
              <table className="table table-bordered align-middle text-center">
                <thead className="table-light">
                  <tr>
                    <th>Producto</th>
                    <th>Cliente</th>
                    <th>Cantidad</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {solicitudes.map((s) => (
                    <tr key={s.id}>
                      <td className="text-truncate max-width-td" title={s.productoNombre}>{s.productoNombre}</td>
                      <td>{s.clienteNombre}</td>
                      <td>{s.cantidadSolicitada}</td>
                      <td>
                        {s.estado === "pendiente" && <span className="text-warning">Pendiente</span>}
                        {s.estado === "entregado" && <span className="text-success">Entregado</span>}
                        {s.estado === "rechazado" && <span className="text-danger">Rechazado</span>}
                      </td>
                      <td>{s.fecha}</td>
                      <td>
                        {s.estado === "pendiente" ? (
                          <>
                            <button
                              className="btn btn-success btn-sm me-2"
                              onClick={() => cambiarEstadoSolicitud(s, "entregado")}
                            >
                              Aprobar
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => cambiarEstadoSolicitud(s, "rechazado")}
                            >
                              Rechazar
                            </button>
                          </>
                        ) : (
                          <span className="text-muted">Ya respondido</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
