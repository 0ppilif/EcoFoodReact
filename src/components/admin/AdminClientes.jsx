import { useEffect, useState } from "react";
import { obtenerClientes, eliminarCliente } from "../../services/clienteFirebase";
import Swal from "sweetalert2";

export default function AdminClientes() {
  const [clientes, setClientes] = useState([]);

  const cargarClientes = async () => {
    try {
      const datos = await obtenerClientes();
      setClientes(datos);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los clientes", "error");
    }
  };

  const handleEliminar = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (confirm.isConfirmed) {
      try {
        await eliminarCliente(id);
        Swal.fire("Eliminado", "Cliente eliminado correctamente", "success");
        cargarClientes(); // refrescar
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar", "error");
      }
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  return (
    <div>
      <h3>Gestión de Clientes</h3>
      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Comuna</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.length === 0 ? (
            <tr><td colSpan="5">No hay clientes registrados.</td></tr>
          ) : (
            clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.nombre}</td>
                <td>{cliente.email}</td>
                <td>{cliente.comuna}</td>
                <td>{cliente.telefono || "-"}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleEliminar(cliente.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
