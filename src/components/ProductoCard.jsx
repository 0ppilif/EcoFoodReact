import React from "react";
import Swal from "sweetalert2";

export default function ProductoCard({ producto, onSolicitar }) {
  const handleClick = () => {
    if (producto.cantidad <= 0) {
      Swal.fire("Sin stock", "Este producto ya no está disponible.", "info");
      return;
    }

    Swal.fire({
      title: `Solicitar ${producto.nombre}`,
      input: "number",
      inputAttributes: {
        min: 1,
        max: producto.cantidad,
      },
      inputValue: 1,
      showCancelButton: true,
      confirmButtonText: "Confirmar",
    }).then((result) => {
      if (result.isConfirmed && result.value > 0 && result.value <= producto.cantidad) {
        onSolicitar(producto, parseInt(result.value));
      }
    });
  };

  return (
    <div className="card m-2">
      <div className="card-body">
        <h5 className="card-title">{producto.nombre}</h5>
        <p className="card-text">{producto.descripcion}</p>
        <p>Empresa: {producto.empresaNombre}</p>
        <p>Precio: {producto.precio === 0 ? "Gratis" : `$${producto.precio}`}</p>
        <p>Disponible: {producto.cantidad}</p>
        <button className="btn btn-primary" onClick={handleClick}>
          Solicitar
        </button>
      </div>
    </div>
  );
}
