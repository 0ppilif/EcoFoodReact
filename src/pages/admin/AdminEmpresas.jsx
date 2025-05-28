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
  const [form, setForm] = useState({ nombre: "", rut: "", direccion: "", comuna: "", email: "", telefono: "" });
  const [modoEditar, setModoEditar] = useState(false);
  const [idActual, setIdActual] = useState(null);

  const cargarEmpresas = async () => {
    const data = await obtenerEmpresas();
    setEmpresas(data);
  };

  useEffect(() => { cargarEmpresas(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm({ nombre: "", rut: "", direccion: "", comuna: "", email: "", telefono: "" });
    setModoEditar(false);
    setIdActual(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modoEditar) {
        await editarEmpresa(idActual, form);
        Swal.fire("Editado", "Empresa actualizada", "success");
      } else {
        await crearEmpresa(form);
        Swal.fire("Creada", "Empresa registrada", "success");
      }
      cargarEmpresas(); resetForm();
    } catch {
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
      title: "¿Eliminar?",
      text: "No se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí"
    });
    if (confirm.isConfirmed) {
      await eliminarEmpresa(id);
      Swal.fire("Eliminado", "Empresa eliminada", "success");
      cargarEmpresas();
    }
  };

  return (
    <div>
      <h3>{modoEditar ? "Editar Empresa" : "Crear Empresa"}</h3>
      <form onSubmit={handleSubmit} className="mb-3 row g-2">
        {["nombre", "rut", "direccion", "comuna", "email", "telefono"].map((campo, i) => (
          <div className="col-md-4" key={i}>
            <input
              name={campo}
              value={form[campo]}
              onChange={handleChange}
              placeholder={campo.charAt(0).toUpperCase() + campo.slice(1)}
              className="form-control"
              required={campo !== "telefono"}
            />
          </div>
        ))}
        <div className="col-md-12">
          <button className="btn btn-success me-2">{modoEditar ? "Guardar Cambios" : "Crear"}</button>
          {modoEditar && <button className="btn btn-secondary" onClick={resetForm} type="button">Cancelar</button>}
        </div>
      </form>

      <h4>Empresas</h4>
      <table className="table">
        <thead>
          <tr><th>Nombre</th><th>RUT</th><th>Comuna</th><th>Teléfono</th><th>Email</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {empresas.map((e) => (
            <tr key={e.id}>
              <td>{e.nombre}</td><td>{e.rut}</td><td>{e.comuna}</td><td>{e.telefono}</td><td>{e.email}</td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditar(e)}>Editar</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(e.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
