import { useEffect, useState } from "react";
import {
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  collection
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updatePassword
} from "firebase/auth";
import { auth, db, secondaryAuth } from "../../services/firebase";
import Swal from "sweetalert2";
import { useAuthState } from "react-firebase-hooks/auth";
import "../../styles/adminBackground.css";

const adminPrincipalEmail = "elvisteck.wan@gmail.com";

export default function AdminAdministradores() {
  const [user] = useAuthState(auth);
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState({ nombre: "", email: "", password: "" });
  const [editForm, setEditForm] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
      const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password);
      await sendEmailVerification(cred.user);
      await setDoc(doc(db, "usuarios", cred.user.uid), { nombre, email, tipo: "admin" });
      Swal.fire("Admin creado", "Correo de verificación enviado", "success");
      setForm({ nombre: "", email: "", password: "" });
      cargarAdmins();
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        Swal.fire("Error", "El correo ya está registrado como administrador", "error");
      } else {
        Swal.fire("Error", error.message, "error");
      }
    }
  };

  const handleEliminar = async (admin) => {
    if (admin.email === adminPrincipalEmail || admin.email === user.email) {
      return Swal.fire("Prohibido", "No puedes eliminar esta cuenta", "error");
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

  const handleEditar = (admin) => {
    if (admin.email === adminPrincipalEmail && admin.email !== user.email) {
      return Swal.fire("Prohibido", "No puedes editar el perfil del administrador principal", "error");
    }
    setEditForm({ ...admin, password: "" });
    setShowModal(true);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleGuardarEdicion = async () => {
    try {
      const { id, nombre, email, password } = editForm;

      await setDoc(doc(db, "usuarios", id), {
        nombre,
        email,
        tipo: "admin"
      });

      if (user.email === email && password) {
        await updatePassword(auth.currentUser, password);
        Swal.fire("Actualizado", "Perfil y contraseña actualizados", "success");
      } else {
        Swal.fire("Actualizado", "Perfil actualizado", "success");
      }

      setShowModal(false);
      setEditForm(null);
      cargarAdmins();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
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


          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            <table className="table table-bordered bg-white">
              <thead className="sticky-top bg-light">
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {admins.map(a => (
                  <tr key={a.id}>
                    <td>{a.nombre}</td>
                    <td>{a.email}</td>
                    <td>
                      {(a.email !== adminPrincipalEmail || a.email === user.email) ? (
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => handleEditar(a)}
                        >
                          Editar
                        </button>
                      ) : (
                        <button
                          className="btn btn-warning btn-sm me-2"
                          disabled
                          title="Solo el admin principal puede editar este perfil"
                        >
                          Editar
                        </button>
                      )}
                      {a.email !== adminPrincipalEmail && a.email !== user.email && (
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


      {showModal && editForm && (
        <div className="modal d-block" tabIndex="-1" style={{ background: "#00000080" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Administrador</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body row g-2">
                <div className="col-md-6">
                  <label className="form-label">Nombre</label>
                  <input
                    name="nombre"
                    className="form-control"
                    value={editForm.nombre}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input
                    name="email"
                    className="form-control"
                    value={editForm.email}
                    disabled
                  />
                </div>
                {editForm.email === user.email && (
                  <div className="col-md-12">
                    <label className="form-label">Nueva contraseña</label>
                    <input
                      name="password"
                      type="password"
                      className="form-control"
                      value={editForm.password}
                      onChange={handleEditChange}
                      placeholder="Dejar en blanco para no cambiar"
                    />
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={handleGuardarEdicion}>
                  Guardar Cambios
                </button>
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
