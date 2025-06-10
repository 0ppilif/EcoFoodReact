import React from 'react';

const ProductoCard = ({ producto, onEditar, onEliminar }) => {
  return (
    <div className="card col-md-4 mb-3">
      <div className="card-body">
        <h5>{producto.nombre}</h5>
        <p>{producto.descripcion}</p>
        <p><strong>Vence:</strong> {producto.vencimiento}</p>
        <p><strong>Cantidad:</strong> {producto.cantidad}</p>
        <p><strong>Precio:</strong> ${producto.precio}</p>
        <p><strong>Estado:</strong> {producto.estado}</p>
        <button className="btn btn-primary me-2" onClick={onEditar}>Editar</button>
        <button className="btn btn-danger" onClick={onEliminar}>Eliminar</button>
      </div>
    </div>
  );
};

export default ProductoCard;
