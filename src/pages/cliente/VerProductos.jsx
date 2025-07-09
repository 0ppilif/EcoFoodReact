import React, { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import {
  collection,
  getDocs,
  query,
  doc,
  getDoc,
  addDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Swal from "sweetalert2";
import "../../styles/empresadashboard.css";

export default function VerProductos() {
  const [productos, setProductos] = useState([]);
  const [filtroEmpresa, setFiltroEmpresa] = useState("");
  const [filtroComuna, setFiltroComuna] = useState("");
  const [filtroPrecio, setFiltroPrecio] = useState("");
  const [orden, setOrden] = useState("");

  useEffect(() => {
    const obtenerProductos = async () => {
      const q = query(collection(db, "producto"));
      const querySnapshot = await getDocs(q);
      const lista = [];

      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();

        if (data.visible !== false && data.cantidad > 0 && data.empresaId) {
          try {
            const empresaRef = doc(db, "usuarios", data.empresaId);
            const empresaSnap = await getDoc(empresaRef);
            const empresaData = empresaSnap.exists() ? empresaSnap.data() : {};

            lista.push({
              id: docSnap.id,
              ...data,
              empresaNombre: empresaData.nombre || "Empresa",
              empresaComuna: empresaData.comuna || "-",
            });
          } catch (error) {
            console.error("Error al obtener empresa:", error);
          }
        }
      }

      setProductos(lista);
    };

    obtenerProductos();
  }, []);

  const aplicarFiltrosYOrden = () => {
    let resultado = [...productos];
    if (filtroEmpresa) resultado = resultado.filter((p) => p.empresaNombre === filtroEmpresa);
    if (filtroComuna) resultado = resultado.filter((p) => p.empresaComuna === filtroComuna);
    if (filtroPrecio) resultado = resultado.filter((p) =>
      filtroPrecio === "gratuito" ? p.precio === 0 : p.precio > 0
    );
    if (orden === "nombre") resultado.sort((a, b) => a.nombre.localeCompare(b.nombre));
    if (orden === "precio") resultado.sort((a, b) => a.precio - b.precio);
    return resultado;
  };

  const manejarSolicitud = (producto) => {
    Swal.fire({
      title: "Solicitar producto",
      text: `¿Cuántas unidades de "${producto.nombre}" deseas solicitar? (Máximo ${producto.cantidad})`,
      input: "number",
      inputAttributes: {
        min: 1,
        max: producto.cantidad,
        step: 1,
      },
      showCancelButton: true,
      confirmButtonText: "Solicitar",
    }).then(async (resultado) => {
      if (resultado.isConfirmed) {
        const cantidadSolicitada = parseInt(resultado.value);
        if (!cantidadSolicitada || cantidadSolicitada <= 0 || cantidadSolicitada > producto.cantidad) {
          Swal.fire("Error", "Cantidad inválida", "error");
          return;
        }
        try {
          const auth = getAuth();
          const user = auth.currentUser;
          await addDoc(collection(db, "solicitudes"), {
            clienteId: user.uid,
            productoId: producto.id,
            empresaId: producto.empresaId,
            cantidadSolicitada,
            fecha: new Date().toISOString().split("T")[0],
            estado: "pendiente",
          });
          Swal.fire("Enviado", "Tu solicitud ha sido enviada", "success");
        } catch (error) {
          Swal.fire("Error", "No se pudo enviar la solicitud", "error");
        }
      }
    });
  };

  const empresasUnicas = [...new Set(productos.map((p) => p.empresaNombre))];
  const comunasUnicas = [...new Set(productos.map((p) => p.empresaComuna))];

  return (
    <div className="empresa-background">
      <div className="empresa-overlay">
        <div className="empresa-card">
          <h2 className="mb-4 text-center">Productos Disponibles</h2>

          {/* Filtros */}
          <div className="row mb-3">
            <div className="col-md-3">
              <label className="form-label">Empresa:</label>
              <select className="form-select" value={filtroEmpresa} onChange={(e) => setFiltroEmpresa(e.target.value)}>
                <option value="">Todas</option>
                {empresasUnicas.map((empresa, i) => (
                  <option key={i} value={empresa}>{empresa}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Comuna:</label>
              <select className="form-select" value={filtroComuna} onChange={(e) => setFiltroComuna(e.target.value)}>
                <option value="">Todas</option>
                {comunasUnicas.map((comuna, i) => (
                  <option key={i} value={comuna}>{comuna}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Tipo:</label>
              <select className="form-select" value={filtroPrecio} onChange={(e) => setFiltroPrecio(e.target.value)}>
                <option value="">Todos</option>
                <option value="gratuito">Gratuitos</option>
                <option value="pago">Con precio</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Ordenar por:</label>
              <select className="form-select" value={orden} onChange={(e) => setOrden(e.target.value)}>
                <option value="">Sin orden</option>
                <option value="nombre">Nombre</option>
                <option value="precio">Precio</option>
              </select>
            </div>
          </div>

          {/* Tabla de productos */}
          <div className="productos-scroll table-responsive">
            <table className="table table-bordered align-middle text-center">
              <thead className="table-light">
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Empresa</th>
                  <th>Comuna</th>
                  <th>Precio</th>
                  <th>Vencimiento</th>
                  <th>Stock</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {aplicarFiltrosYOrden().length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">No hay productos disponibles</td>
                  </tr>
                ) : (
                  aplicarFiltrosYOrden().map((producto) => (
                    <tr key={producto.id}>
                      <td className="text-truncate max-width-td" title={producto.nombre}>{producto.nombre}</td>
                      <td className="text-truncate max-width-td" title={producto.descripcion}>{producto.descripcion}</td>
                      <td>{producto.empresaNombre}</td>
                      <td>{producto.empresaComuna}</td>
                      <td>{producto.precio === 0 ? "Gratuito" : `$${producto.precio}`}</td>
                      <td>{producto.vencimiento}</td>
                      <td>{producto.cantidad}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => manejarSolicitud(producto)}
                        >
                          Solicitar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
