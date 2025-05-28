import { auth } from "../../services/firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import {
  obtenerEmpresas,
  crearEmpresa,
  eliminarEmpresa,
  editarEmpresa
} from "../../services/empresaFirebase";
import Swal from "sweetalert2";

export default function AdminEmpresas() {
  const [empresas, setEmpresas] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    rut: "",
    direccion: "",
    comuna: "",
    email: "",
    telefono: ""
  });
  const [modoEditar, setModoEditar] = useState(false);
  const [idActual, setIdActual] = useState(null);

  const cargarEmpresas = async () => {
    const data = await obtenerEmpresas();
    setEmpresas(data);
  };

  useEffect(() => {
    cargarEmpresas();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      nombre: "",
      rut: "",
      direccion: "",
      comuna: "",
      email: "",
      telefono: ""
    });
    setModoEditar(false);
    setIdActual(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modoEditar) {
        await editarEmpresa(idActual, form);
        Swal.fire("Editado", "Empresa actualizada correctamente", "success");
      } else {
        await crearEmpresa(form);
        Swal.fire("Creado", "Empresa creada correctamente", "success");
      }
      cargarEmpresas();
      resetForm();
    } catch (error) {
      Swal.fire("Error", "No se pudo guardar", "error");
    }
  };

  const handleEditar = (empresa) => {
    setForm(empresa);
    setModoEditar(true);
    setIdActual(empresa.id);
  };

  const handleEliminar = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar empresa?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (confirm.isConfirmed) {
      try {
        await eliminarEmpresa(id);
        Swal.fire("Eliminado", "Empresa eliminada correctamente", "success");
        cargarEmpresas();
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar", "error");
      }
    }
  };

  return (
    <div>
      <h3>{modoEditar ? "Editar Empresa" : "Crear Empresa"}</h3>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-2">
          <div className="col-md-4">
            <input name="nombre" value={form.nombre} onChange={handleChange} required placeholder="Nombre" className="form-control" />
          </div>
          <div className="col-md-4">
            <input name="rut" value={form.rut} onChange={handleChange} required placeholder="RUT" className="form-control" />
          </div>
          <div className="col-md-4">
            <input name="direccion" value={form.direccion} onChange={handleChange} required placeholder="Dirección" className="form-control" />
          </div>
          <div className="col-md-4">
            <input name="comuna" value={form.comuna} onChange={handleChange} required placeholder="Comuna" className="form-control" />
          </div>
          <div className="col-md-4">
            <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Correo" className="form-control" />
          </div>
          <div className="col-md-4">
            <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" className="form-control" />
          </div>
        </div>

        <div className="mt-3">
          <button className="btn btn-success me-2" type="submit">
            {modoEditar ? "Guardar Cambios" : "Crear Empresa"}
          </button>
          {modoEditar && (
            <button className="btn btn-secondary" onClick={resetForm} type="button">
              Cancelar
            </button>
          )}
        </div>
      </form>

      <h3>Empresas Registradas</h3>
      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>RUT</th>
            <th>Comuna</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empresas.length === 0 ? (
            <tr><td colSpan="6">No hay empresas registradas.</td></tr>
          ) : (
            empresas.map((empresa) => (
              <tr key={empresa.id}>
                <td>{empresa.nombre}</td>
                <td>{empresa.rut}</td>
                <td>{empresa.comuna}</td>
                <td>{empresa.telefono}</td>
                <td>{empresa.email}</td>
                <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditar(empresa)}>
                    Editar
                </button>
                <button className="btn btn-danger btn-sm me-2" onClick={() => handleEliminar(empresa.id)}>
                    Eliminar
                </button>
                <a href={`/admin/empresas/productos/${empresa.id}`} className="btn btn-secondary btn-sm">
                    Ver Productos
                </a>
                </td>

              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
