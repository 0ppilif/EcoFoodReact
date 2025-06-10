import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore";
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
  const [filtro, setFiltro] = useState("");

  const auth = getAuth();
  const user = auth.currentUser;

  const obtenerProductos = async () => {
    if (!user || !empresaNombre) return;
    const q = query(collection(db, "producto"), where("empresaId", "==", empresaNombre));
    const querySnapshot = await getDocs(q);
    const productosData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProductos(productosData);
  };

  const obtenerNombreEmpresa = async () => {
    const querySnapshot = await getDocs(query(collection(db, "usuarios"), where("email", "==", user.email)));
    const data = querySnapshot.docs[0]?.data();
    if (data) setEmpresaNombre(data.nombre);
  };

  useEffect(() => {
    if (user) {
      obtenerNombreEmpresa();
    }
  }, [user]);

  useEffect(() => {
    if (empresaNombre) {
      obtenerProductos();
    }
  }, [empresaNombre]);

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

  const abrirModal = (producto = null) => {
    setProductoActual(producto);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setProductoActual(null);
    setMostrarModal(false);
    obtenerProductos();
  };

  const productosFiltrados = productos.filter(prod =>
    prod.nombre.toLowerCase().includes(filtro.toLowerCase())
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
          <div className="d-flex justify-content-between mb-3">
            <button className="btn btn-success" onClick={() => abrirModal()}>
              Agregar Producto
            </button>
            <input
              type="text"
              className="form-control w-50"
              placeholder="Buscar por nombre..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
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
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productosFiltrados.map((prod) => {
                    const diasRestantes = calcularDiasRestantes(prod.vencimiento);
                    const estaVencido = diasRestantes < 0;
                    const filaClase = diasRestantes <= 3 ? "table-warning" : "";

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
                            <span className="ms-2 text-danger fw-bold">
                              🕒 ¡Vence pronto!
                            </span>
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
                          <button className="btn btn-primary btn-sm me-2" onClick={() => abrirModal(prod)}>
                            Editar
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => eliminarProducto(prod.id)}>
                            Eliminar
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
              empresaId={empresaNombre}
              onClose={cerrarModal}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductosEmpresa;
