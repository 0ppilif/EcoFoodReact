import { useEffect, useState } from "react";
import { getDocs, deleteDoc, doc, setDoc, collection } from "firebase/firestore";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth, db } from "../../services/firebase";
import Swal from "sweetalert2";
import "../../styles/adminBackground.css";

const adminPrincipalEmail = "admin@ecofood.cl";

export default function AdminAdministradores() {
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState({ nombre: "", email: "", password: "" });

  const cargarAdmins = async () => {
    const snapshot = await getDocs(collection(db, "usuarios"));
    const filtrados = snapshot.docs
      .map(docSnap => ({ id: docSnap.id, ...docSnap.data() }))
      .filter(data => data.tipo === "admin");
    setAdmins(filtrados);
  };

  useEffect(() => {
    cargarAdmins();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCrear = async (e) => {
    e.preventDefault();
    const { nombre, email, password } = form;
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(cred.user);
      await setDoc(doc(db, "usuarios", cred.user.uid), { nombre, email, tipo: "admin" });
      Swal.fire("Admin creado", "Correo de verificación enviado", "success");
      setForm({ nombre: "", email: "", password: "" });
      cargarAdmins();
    } catch {
      Swal.fire("Error", "No se pudo crear", "error");
    }
  };

  const handleEliminar = async (admin) => {
    if (admin.email === adminPrincipalEmail) {
      return Swal.fire("Prohibido", "No puedes eliminar al administrador principal", "error");
    }

    const confirm = await Swal.fire({
      title: "¿Eliminar administrador?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí"
    });

    if (confirm.isConfirmed) {
      await deleteDoc(doc(db, "usuarios", admin.id));
      cargarAdmins();
    }
  };

  return (
    <div className="admin-background">
      <div className="admin-overlay">
        <div className="admin-card">
          <h3>Administradores</h3>
          <form onSubmit={handleCrear} className="row g-2 mb-3">
            {[
              { name: "nombre", type: "text", max: 50 },
              { name: "email", type: "email", max: 100 },
              { name: "password", type: "password", max: 20 }
            ].map((campo, i) => (
              <div className="col-md-4" key={i}>
                <input
                  name={campo.name}
                  type={campo.type}
                  maxLength={campo.max}
                  minLength={campo.name === "password" ? 6 : undefined}
                  required
                  className="form-control"
                  value={form[campo.name]}
                  onChange={handleChange}
                  placeholder={
                    campo.name === "password"
                      ? "Contraseña"
                      : campo.name.charAt(0).toUpperCase() + campo.name.slice(1)
                  }
                />
              </div>
            ))}
            <div className="col-md-12">
              <button className="btn btn-success">Crear Admin</button>
            </div>
          </form>

          <table className="table table-bordered bg-white">
            <thead>
              <tr><th>Nombre</th><th>Email</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {admins.map(a => (
                <tr key={a.id}>
                  <td>{a.nombre}</td>
                  <td>{a.email}</td>
                  <td>
                    {a.email !== adminPrincipalEmail && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleEliminar(a)}
                      >
                        Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
