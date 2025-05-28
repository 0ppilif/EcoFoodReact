import { useParams } from "react-router-dom";

export default function AdminProductos() {
  const { id } = useParams();

  return (
    <div>
      <h3>Gestión de Productos para la empresa: {id}</h3>
      <p>Aquí podrás asociar productos a la empresa seleccionada.</p>
      <p>Este módulo está en desarrollo.</p>
    </div>
  );
}
