import { useEffect, useState } from "react";
import { getDocs, collection, deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import Swal from "sweetalert2";

const adminPrincipalEmail = "corxea.wan@gmail.com"; 

export default function AdminAdministradores() {
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState({ nombre: "", email: "", uid: "" });

  const cargarAdmins = async () => {
    const snapshot = await getDocs(collection(db, "usuarios"));
    const filtrados = [];
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      if (data.tipo === "admin") {
        filtrados.push({ id: docSnap.id, ...data });
      }
    });
    setAdmins(filtrados);
  };

  useEffect(() => {
    cargarAdmins();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    if (!form.uid || !form.email || !form.nombre) {
      return Swal.fire("Error", "Todos los campos son obligatorios", "warning");
    }
    try {
      await setDoc(doc(db, "usuarios", form.uid), {
        email: form.email,
        nombre: form.nombre,
        tipo: "admin"
      });
      Swal.fire("Listo", "Administrador creado correctamente", "success");
      setForm({ nombre: "", email: "", uid: "" });
      cargarAdmins();
    } catch (error) {
      Swal.fire("Error", "No se pudo crear", "error");
    }
  };

  const handleEliminar = async (admin) => {
    if (admin.email === adminPrincipalEmail) {
      return Swal.fire("Prohibido", "No puedes eliminar al administrador principal", "error");
    }if (admin.email === "corxea.wan@gmail.com") {
    return Swal.fire("Prohibido", "No puedes eliminar al administrador principal", "error");
    }



    const confirm = await Swal.fire({
      title: "¿Eliminar administrador?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (confirm.isConfirmed) {
      try {
        await deleteDoc(doc(db, "usuarios", admin.id));
        Swal.fire("Eliminado", "Administrador eliminado", "success");
        cargarAdmins();
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar", "error");
      }
    }
  };

  return (
    <div>
      <h3>Administradores</h3>

      <form onSubmit={handleCrear} className="row g-2 mb-3">
        <div className="col-md-3">
          <input name="uid" value={form.uid} onChange={handleChange} className="form-control" placeholder="UID del usuario" />
        </div>
        <div className="col-md-3">
          <input name="nombre" value={form.nombre} onChange={handleChange} className="form-control" placeholder="Nombre" />
        </div>
        <div className="col-md-3">
          <input name="email" value={form.email} onChange={handleChange} className="form-control" placeholder="Correo" />
        </div>
        <div className="col-md-3">
          <button className="btn btn-success w-100">Crear Admin</button>
        </div>
      </form>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {admins.length === 0 ? (
            <tr><td colSpan="3">No hay administradores registrados.</td></tr>
          ) : (
            admins.map((admin) => (
              <tr key={admin.id}>
                <td>{admin.nombre}</td>
                <td>{admin.email}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(admin)}>
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
