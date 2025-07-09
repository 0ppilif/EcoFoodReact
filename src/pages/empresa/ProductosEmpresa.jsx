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
import ProductoModal from "../../components/empresa/ProductoModal";
import Swal from "sweetalert2";
import "../../styles/empresadashboard.css";

const ProductosEmpresa = () => {
  const [productos, setProductos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [productoActual, setProductoActual] = useState(null);
  const [empresaId, setEmpresaId] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [orden, setOrden] = useState("nombre_az");
  const [itemsPorPagina, setItemsPorPagina] = useState(10);
  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState("");

  const auth = getAuth();
  const user = auth.currentUser;

  const obtenerProductos = async () => {
    if (!user || !empresaId) return;
    const q = query(collection(db, "producto"), where("empresaId", "==", empresaId));
    const querySnapshot = await getDocs(q);
    const productosData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProductos(productosData);
  };

  useEffect(() => {
    if (user) setEmpresaId(user.uid);
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

  const calcularDiasRestantes = (fechaStr) => {
    const hoy = new Date();
    const vencimiento = new Date(fechaStr);
    const diferencia = vencimiento - hoy;
    return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
  };

  const productosFiltrados = productos
    .filter((prod) => prod.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    .filter((prod) => {
      const diasRestantes = calcularDiasRestantes(prod.vencimiento);
      if (filtroEstado === "disponibles") return prod.estado === "disponible";
      if (filtroEstado === "por_vencer") return diasRestantes <= 3 && diasRestantes >= 0;
      if (filtroEstado === "vencidos") return diasRestantes < 0;
      return true;
    })
    .sort((a, b) => {
      if (orden === "nombre_az") return a.nombre.localeCompare(b.nombre);
      if (orden === "nombre_za") return b.nombre.localeCompare(a.nombre);
      if (orden === "precio_asc") return a.precio - b.precio;
      if (orden === "precio_desc") return b.precio - a.precio;
      return 0;
    });

  const totalPaginas = Math.ceil(productosFiltrados.length / itemsPorPagina);
  const productosPaginados = productosFiltrados.slice(
    (paginaActual - 1) * itemsPorPagina,
    paginaActual * itemsPorPagina
  );

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  return (
    <div className="empresa-background">
      <div className="empresa-overlay">
        <div className="empresa-card">
          <h2 className="mb-4">Mis Productos</h2>

          <div className="d-flex flex-wrap gap-3 mb-3 align-items-center justify-content-between">
            <button className="btn btn-success" onClick={() => abrirModal()}>
              Agregar Producto
            </button>

            <input
              type="text"
              className="form-control w-auto"
              placeholder="Buscar por nombre..."
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPaginaActual(1);
              }}
            />

            <select
              className="form-select w-auto"
              value={filtroEstado}
              onChange={(e) => {
                setFiltroEstado(e.target.value);
                setPaginaActual(1);
              }}
            >
              <option value="todos">Todos</option>
              <option value="disponibles">Disponibles</option>
              <option value="por_vencer">Por vencer</option>
              <option value="vencidos">Vencidos</option>
            </select>

            <select
              className="form-select w-auto"
              value={orden}
              onChange={(e) => {
                setOrden(e.target.value);
                setPaginaActual(1);
              }}
            >
              <option value="nombre_az">Nombre A-Z</option>
              <option value="nombre_za">Nombre Z-A</option>
              <option value="precio_asc">Precio ascendente</option>
              <option value="precio_desc">Precio descendente</option>
            </select>

            <select
              className="form-select w-auto"
              value={itemsPorPagina}
              onChange={(e) => {
                setItemsPorPagina(Number(e.target.value));
                setPaginaActual(1);
              }}
            >
              <option value={5}>5 por página</option>
              <option value={10}>10 por página</option>
              <option value={20}>20 por página</option>
            </select>
          </div>

          {productosPaginados.length === 0 ? (
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
                  {productosPaginados.map((prod) => {
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
                        <td>{prod.nombre}</td>
                        <td>{prod.descripcion}</td>
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

          <div className="d-flex justify-content-between align-items-center mt-3">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => cambiarPagina(paginaActual - 1)}
              disabled={paginaActual === 1}
            >
              Anterior
            </button>
            <span>
              Página {paginaActual} de {totalPaginas}
            </span>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => cambiarPagina(paginaActual + 1)}
              disabled={paginaActual === totalPaginas}
            >
              Siguiente
            </button>
          </div>

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
