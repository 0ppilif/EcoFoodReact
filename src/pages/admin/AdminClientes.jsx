import { useEffect, useState } from "react";
import {
  getDocs,
  deleteDoc,
  doc,
  collection,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { db, secondaryAuth } from "../../services/firebase";
import Swal from "sweetalert2";
import "../../styles/adminBackground.css";

const regiones = [
  {
    nombre: "Región de Coquimbo",
    comunas: ["La Serena", "Coquimbo", "Vicuña", "Ovalle"],
  },
  {
    nombre: "Región Metropolitana",
    comunas: ["Santiago", "Puente Alto", "Maipú", "Las Condes"],
  },
];

export default function AdminClientes() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    comuna: "",
    telefono: "",
    email: "",
    password: "",
  });
  const [editForm, setEditForm] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const cargarClientes = async () => {
    const snapshot = await getDocs(collection(db, "usuarios"));
    const filtrados = snapshot.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((d) => d.tipo === "cliente");
    setClientes(filtrados);
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCrearCliente = async (e) => {
    e.preventDefault();
    const { nombre, direccion, comuna, telefono, email, password } = form;

    try {
      const cred = await createUserWithEmailAndPassword(
        secondaryAuth,
        email,
        password
      );
      await sendEmailVerification(cred.user);
      await setDoc(doc(db, "usuarios", cred.user.uid), {
        nombre,
        direccion,
        comuna,
        telefono,
        email,
        tipo: "cliente",
      });

      Swal.fire("Cliente creado", "Correo de verificación enviado", "success");
      setForm({
        nombre: "",
        direccion: "",
        comuna: "",
        telefono: "",
        email: "",
        password: "",
      });
      cargarClientes();
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        Swal.fire(
          "Error",
          "El correo ya está registrado",
          "error"
        );
      } else {
        Swal.fire("Error", error.message, "error");
      }
    }
  };

  const handleEditar = (cliente) => {
    setEditForm({ ...cliente });
    setShowModal(true);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleGuardarEdicion = async () => {
    try {
      const ref = doc(db, "usuarios", editForm.id);
      const docSnap = await getDoc(ref);
      if (!docSnap.exists()) throw new Error("Cliente no encontrado");
      await updateDoc(ref, {
        nombre: editForm.nombre,
        direccion: editForm.direccion,
        comuna: editForm.comuna,
        telefono: editForm.telefono,
      });
      Swal.fire("Actualizado", "Cliente actualizado correctamente", "success");
      setShowModal(false);
      setEditForm(null);
      cargarClientes();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const eliminarCliente = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar cliente?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí",
    });
    if (confirm.isConfirmed) {
      await deleteDoc(doc(db, "usuarios", id));
      cargarClientes();
    }
  };
  
  return (
    <div className="admin-background">
      <div className="admin-overlay">
        <div className="admin-card">
          <h3>Registrar Cliente</h3>
          <form onSubmit={handleCrearCliente} className="row g-2 mb-4">
            {[
              { name: "nombre", type: "text", max: 50 },
              { name: "direccion", type: "text", max: 100 },
              { name: "comuna", type: "select" },
              { name: "telefono", type: "number", max: 15 },
              { name: "email", type: "email", max: 100 },
              { name: "password", type: "password", max: 20 },
            ].map((campo, i) => (
              <div className="col-md-6" key={i}>
                {campo.type === "select" ? (
                  <select
                    name="comuna"
                    required
                    className="form-control"
                    value={form.comuna}
                    onChange={handleChange}
                  >
                    <option value="">Seleccione Comuna</option>
                    {regiones.map((region, idx) => (
                      <optgroup key={idx} label={region.nombre}>
                        {region.comunas.map((comuna, j) => (
                          <option key={j} value={comuna}>
                            {comuna}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                ) : (
                  <input
                    name={campo.name}
                    type={campo.type}
                    maxLength={campo.max}
                    minLength={campo.name === "password" ? 6 : undefined}
                    required={campo.name !== "telefono"}
                    className="form-control"
                    value={form[campo.name]}
                    onChange={handleChange}
                    placeholder={
                      campo.name === "password"
                        ? "Contraseña"
                        : campo.name.charAt(0).toUpperCase() +
                          campo.name.slice(1)
                    }
                  />
                )}
              </div>
            ))}
            <div className="col-md-12">
              <button className="btn btn-success">Crear Cliente</button>
            </div>
          </form>

          <h4>Clientes Registrados</h4>
          <div className="table-responsive" style={{ maxHeight: "400px", overflowY: "auto" }}>
            <table className="table table-bordered bg-white mb-0">
              <thead className="table-light" style={{ position: "sticky", top: 0, zIndex: 2 }}>
                <tr>
                  <th style={{ backgroundColor: "#f8f9fa" }}>Nombre</th>
                  <th style={{ backgroundColor: "#f8f9fa" }}>Email</th>
                  <th style={{ backgroundColor: "#f8f9fa" }}>Comuna</th>
                  <th style={{ backgroundColor: "#f8f9fa" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((c) => (
                  <tr key={c.id}>
                    <td>{c.nombre}</td>
                    <td>{c.email}</td>
                    <td>{c.comuna}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEditar(c)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => eliminarCliente(c.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && editForm && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ background: "#00000080" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Cliente</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
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
                <div className="col-md-6">
                  <label className="form-label">Dirección</label>
                  <input
                    name="direccion"
                    className="form-control"
                    value={editForm.direccion}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Teléfono</label>
                  <input
                    name="telefono"
                    type="number"
                    className="form-control"
                    value={editForm.telefono}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="col-md-12">
                  <label className="form-label">Comuna</label>
                  <select
                    name="comuna"
                    className="form-control"
                    value={editForm.comuna}
                    onChange={handleEditChange}
                  >
                    <option value="">Seleccione Comuna</option>
                    {regiones.map((region, idx) => (
                      <optgroup key={idx} label={region.nombre}>
                        {region.comunas.map((comuna, j) => (
                          <option key={j} value={comuna}>
                            {comuna}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-primary"
                  onClick={handleGuardarEdicion}
                >
                  Guardar Cambios
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
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
