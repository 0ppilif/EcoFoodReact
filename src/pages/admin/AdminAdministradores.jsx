import { useEffect, useState } from "react";
import { getDocs, deleteDoc, doc, setDoc, collection } from "firebase/firestore";
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
      if (data.tipo === "admin") filtrados.push({ id: docSnap.id, ...data });
    });
    setAdmins(filtrados);
  };

  useEffect(() => { cargarAdmins(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCrear = async (e) => {
    e.preventDefault();
    const { uid, nombre, email } = form;
    if (!uid || !nombre || !email) return Swal.fire("Completa todo", "", "warning");
    await setDoc(doc(db, "usuarios", uid), { nombre, email, tipo: "admin" });
    setForm({ nombre: "", email: "", uid: "" });
    cargarAdmins();
  };

  const handleEliminar = async (admin) => {
    if (admin.email === adminPrincipalEmail) return Swal.fire("No se puede eliminar al admin principal");
    const confirm = await Swal.fire({ title: "¿Eliminar?", showCancelButton: true });
    if (confirm.isConfirmed) {
      await deleteDoc(doc(db, "usuarios", admin.id));
      cargarAdmins();
    }
  };

  return (
    <div>
      <h3>Administradores</h3>
      <form onSubmit={handleCrear} className="row g-2 mb-3">
        {["uid", "nombre", "email"].map((campo, i) => (
          <div className="col-md-3" key={i}>
            <input name={campo} value={form[campo]} onChange={handleChange} placeholder={campo.toUpperCase()} className="form-control" />
          </div>
        ))}
        <div className="col-md-3"><button className="btn btn-success w-100">Crear Admin</button></div>
      </form>

      <table className="table">
        <thead><tr><th>Nombre</th><th>Email</th><th>Acciones</th></tr></thead>
        <tbody>
          {admins.map(a => (
            <tr key={a.id}>
              <td>{a.nombre}</td><td>{a.email}</td>
              <td><button className="btn btn-danger btn-sm" onClick={() => handleEliminar(a)}>Eliminar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
