import React, { useState, useEffect } from "react"; 
import Swal from "sweetalert2";
import { db } from "../../services/firebase";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";

const ProductoModal = ({ producto, empresaId, onClose }) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [vencimiento, setVencimiento] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [precio, setPrecio] = useState("");

  // 🗓️ Obtener fecha actual en formato YYYY-MM-DD
  const hoy = new Date();
  const fechaMinima = hoy.toISOString().split("T")[0];
  const fechaMaxima = "2030-12-31";

  useEffect(() => {
    if (producto) {
      setNombre(producto.nombre);
      setDescripcion(producto.descripcion || "");
      setVencimiento(producto.vencimiento);
      setCantidad(producto.cantidad);
      setPrecio(producto.precio);
    }
  }, [producto]);

  const validarCampos = () => {
    if (nombre.length < 3 || nombre.length > 20) {
      Swal.fire("Error", "El nombre debe tener entre 3 y 20 caracteres", "error");
      return false;
    }

    if (!vencimiento) {
      Swal.fire("Error", "La fecha de vencimiento es obligatoria", "error");
      return false;
    }

    const fecha = new Date(vencimiento);
    const fechaHoy = new Date(fechaMinima);
    const anio = fecha.getFullYear();

    if (fecha < fechaHoy) {
      Swal.fire("Error", "La fecha de vencimiento no puede ser anterior a hoy", "error");
      return false;
    }

    if (anio > 2030) {
      Swal.fire("Error", "La fecha de vencimiento debe ser como máximo en 2030", "error");
      return false;
    }

    const cant = parseInt(cantidad);
    if (isNaN(cant) || cant < 0 || cant > 500) {
      Swal.fire("Error", "La cantidad debe estar entre 0 y 500", "error");
      return false;
    }

    const prec = parseFloat(precio);
    if (isNaN(prec) || prec < 0 || prec > 10000) {
      Swal.fire("Error", "El precio debe estar entre 0 y 10000", "error");
      return false;
    }

    return true;
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();

    if (!validarCampos()) return;

    const fechaVencimiento = new Date(vencimiento);
    const estado =
      parseInt(cantidad) === 0 || fechaVencimiento < new Date(fechaMinima)
        ? "agotado"
        : "disponible";

    const nuevoProducto = {
      nombre,
      descripcion,
      vencimiento,
      cantidad: parseInt(cantidad),
      precio: parseFloat(precio),
      estado,
      empresaId,
    };

    try {
      if (producto) {
        const productoRef = doc(db, "producto", producto.id);
        await updateDoc(productoRef, nuevoProducto);
        Swal.fire("Actualizado", "Producto actualizado correctamente", "success");
      } else {
        await addDoc(collection(db, "producto"), nuevoProducto);
        Swal.fire("Creado", "Producto creado correctamente", "success");
      }
      onClose();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Hubo un problema al guardar el producto", "error");
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <form onSubmit={manejarEnvio}>
            <div className="modal-header">
              <h5 className="modal-title">{producto ? "Editar" : "Agregar"} Producto</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  maxLength={20}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-control"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows={2}
                  maxLength={100}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Vencimiento</label>
                <input
                  type="date"
                  className="form-control"
                  value={vencimiento}
                  onChange={(e) => setVencimiento(e.target.value)}
                  min={fechaMinima}
                  max={fechaMaxima}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Cantidad</label>
                <input
                  type="number"
                  className="form-control"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  min={0}
                  max={500}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Precio</label>
                <input
                  type="number"
                  className="form-control"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  min={0}
                  max={10000}
                  step="0.01"
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-primary">
                {producto ? "Actualizar" : "Crear"}
              </button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductoModal;
