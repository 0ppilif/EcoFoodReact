import Swal from 'sweetalert2';

export const handleEliminar = async (id, eliminarCallback) => {
  const res = await Swal.fire({
    title: "¿Estás seguro?",
    text: "No podrás deshacer esta acción.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar"
  });
  
  if (res.isConfirmed) {
    await eliminarCallback(id);
    Swal.fire("Eliminado", "El producto ha sido eliminado.", "success");
  }
};
