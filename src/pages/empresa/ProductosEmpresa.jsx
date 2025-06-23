import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../services/firebase";
import { getAuth } from "firebase/auth";
import EmpresaNavbar from "../../components/empresa/EmpresaNavbar";
import ProductoModal from "../../components/empresa/ProductoModal";
import Swal from "sweetalert2";
import "../../styles/empresadashboard.css";

const ProductosEmpresa = () => {
  const [productos, setProductos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [productoActual, setProductoActual] = useState(null);
  const [empresaNombre, setEmpresaNombre] = useState("");
  const [empresaId, setEmpresaId] = useState("");
  const [filtro, setFiltro] = useState("");
  const [ordenAZ, setOrdenAZ] = useState("az");
  const [soloDisponibles, setSoloDisponibles] = useState(false);
  const [soloVisibles, setSoloVisibles] = useState(false);
  const [soloNoVisibles, setSoloNoVisibles] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;

  const obtenerProductos = async () => {
    if (!user || !empresaId) return;
    const q = query(
      collection(db, "producto"),
      where("empresaId", "==", empresaId)
    );
    const querySnapshot = await getDocs(q);
    const productosData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProductos(productosData);
  };

  const obtenerDatosEmpresa = async () => {
    if (!user) return;
    setEmpresaId(user.uid);

    const ref = doc(db, "usuarios", user.uid);
    const snapshot = await getDocs(
      query(collection(db, "usuarios"), where("uid", "==", user.uid))
    );
    const data = snapshot.docs[0]?.data();
    if (data?.nombre) setEmpresaNombre(data.nombre);
  };

  useEffect(() => {
    if (user) obtenerDatosEmpresa();
  }, [user]);

  useEffect(() => {
    if (empresaId) obtenerProductos();
  }, [empresaId]);

  const eliminarProducto = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar producto?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
    });

    if (confirm.isConfirmed) {
      await deleteDoc(doc(db, "producto", id));
      Swal.fire("Eliminado", "Producto eliminado correctamente", "success");
      obtenerProductos();
    }
  };

  const cambiarVisibilidad = async (producto) => {
    try {
      const ref = doc(db, "producto", producto.id);
      await updateDoc(ref, { visible: !producto.visible });
      Swal.fire(
        "Actualizado",
        `El producto ahora está ${!producto.visible ? "visible" : "oculto"}`,
        "success"
      );
      obtenerProductos();
    } catch (error) {
      console.error("Error al actualizar visibilidad:", error);
      Swal.fire("Error", "No se pudo cambiar la visibilidad", "error");
    }
  };

  const abrirModal = (producto = null) => {
    setProductoActual(producto);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setProductoActual(null);
    setMostrarModal(false);
    obtenerProductos();
  };

  const resetFiltros = () => {
    setFiltro("");
    setOrdenAZ("az");
    setSoloDisponibles(false);
    setSoloVisibles(false);
    setSoloNoVisibles(false);
  };

  const productosFiltrados = productos
    .filter((prod) =>
      prod.nombre.toLowerCase().includes(filtro.toLowerCase())
    )
    .filter((prod) => (soloDisponibles ? prod.estado === "disponible" : true))
    .filter((prod) => (soloVisibles ? prod.visible === true : true))
    .filter((prod) => (soloNoVisibles ? prod.visible === false : true))
    .sort((a, b) =>
      ordenAZ === "az"
        ? a.nombre.localeCompare(b.nombre)
        : b.nombre.localeCompare(a.nombre)
    );

  const calcularDiasRestantes = (fechaStr) => {
    const hoy = new Date();
    const vencimiento = new Date(fechaStr);
    const diferencia = vencimiento - hoy;
    return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="empresa-background">
      <EmpresaNavbar nombre={empresaNombre} />
      <div className="empresa-overlay">
        <div className="empresa-card">
          <h2 className="mb-4">Mis Productos</h2>

          <div className="d-flex flex-wrap gap-2 justify-content-between mb-3 align-items-center">
            <button className="btn btn-success" onClick={() => abrirModal()}>
              Agregar Producto
            </button>

            <input
              type="text"
              className="form-control w-25"
              placeholder="Buscar por nombre..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />

            <select
              className="form-select w-auto"
              value={ordenAZ}
              onChange={(e) => setOrdenAZ(e.target.value)}
            >
              <option value="az">Orden A-Z</option>
              <option value="za">Orden Z-A</option>
            </select>

            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="checkDisponibles"
                checked={soloDisponibles}
                onChange={() => setSoloDisponibles(!soloDisponibles)}
              />
              <label className="form-check-label" htmlFor="checkDisponibles">
                Solo disponibles
              </label>
            </div>

            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="checkVisibles"
                checked={soloVisibles}
                onChange={() => setSoloVisibles(!soloVisibles)}
              />
              <label className="form-check-label" htmlFor="checkVisibles">
                Solo visibles
              </label>
            </div>

            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="checkNoVisibles"
                checked={soloNoVisibles}
                onChange={() => setSoloNoVisibles(!soloNoVisibles)}
              />
              <label className="form-check-label" htmlFor="checkNoVisibles">
                Solo no visibles
              </label>
            </div>

            <button className="btn btn-secondary" onClick={resetFiltros}>
              Quitar Filtros
            </button>
          </div>

          {productosFiltrados.length === 0 ? (
            <p>No hay productos registrados.</p>
          ) : (
            <div className="productos-scroll table-responsive">
              <table className="table table-bordered align-middle text-center">
                <thead className="table-light">
                  <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Vencimiento</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Estado</th>
                    <th>Visible</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productosFiltrados.map((prod) => {
                    const diasRestantes = calcularDiasRestantes(prod.vencimiento);
                    const estaVencido = diasRestantes < 0;
                    const filaClase =
                      diasRestantes <= 3
                        ? "table-warning"
                        : prod.visible === false
                        ? "table-secondary"
                        : "";

                    return (
                      <tr key={prod.id} className={filaClase}>
                        <td className="text-truncate max-width-td" title={prod.nombre}>
                          {prod.nombre}
                        </td>
                        <td className="text-truncate max-width-td" title={prod.descripcion}>
                          {prod.descripcion}
                        </td>
                        <td>
                          {prod.vencimiento}
                          {diasRestantes <= 3 && diasRestantes >= 0 && (
                            <span className="ms-2 text-danger fw-bold">🕒 ¡Vence pronto!</span>
                          )}
                          {estaVencido && (
                            <span className="ms-2 text-muted fst-italic">(vencido)</span>
                          )}
                        </td>
                        <td>{prod.cantidad}</td>
                        <td>
                          {prod.precio === 0 ? (
                            <span className="text-success fw-bold">Gratis</span>
                          ) : (
                            `$${prod.precio}`
                          )}
                        </td>
                        <td>{estaVencido ? "agotado" : prod.estado}</td>
                        <td>
                          {prod.visible ? (
                            <span className="text-success">Sí</span>
                          ) : (
                            <span className="text-danger">No</span>
                          )}
                        </td>
                        <td>
                          <button
                            className="btn btn-primary btn-sm me-1"
                            onClick={() => abrirModal(prod)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn-danger btn-sm me-1"
                            onClick={() => eliminarProducto(prod.id)}
                          >
                            Eliminar
                          </button>
                          <button
                            className={`btn btn-sm ${
                              prod.visible ? "btn-warning" : "btn-success"
                            }`}
                            onClick={() => cambiarVisibilidad(prod)}
                          >
                            {prod.visible ? "Ocultar" : "Mostrar"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {mostrarModal && (
            <ProductoModal
              producto={productoActual}
              empresaId={empresaId}
              onClose={cerrarModal}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductosEmpresa;
