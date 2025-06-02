import { useState, useEffect } from "react";
import {
  obtenerEmpresas,
  eliminarEmpresa
} from "../../services/empresaFirebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth, db } from "../../services/firebase";
import { setDoc, doc } from "firebase/firestore";
import Swal from "sweetalert2";
import "../../styles/adminBackground.css";

export default function AdminEmpresas() {
  const [empresas, setEmpresas] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    rut: "",
    direccion: "",
    comuna: "",
    email: "",
    telefono: "",
    password: ""
  });

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

  const handleCrearEmpresa = async (e) => {
    e.preventDefault();
    const { nombre, rut, direccion, comuna, email, telefono, password } = form;

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(cred.user);

      await setDoc(doc(db, "usuarios", cred.user.uid), {
        nombre,
        rut,
        direccion,
        comuna,
        email,
        telefono,
        tipo: "empresa"
      });

      Swal.fire("Empresa creada", "Se envió un correo de verificación", "success");
      setForm({
        nombre: "", rut: "", direccion: "", comuna: "",
        email: "", telefono: "", password: ""
      });
      cargarEmpresas();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleEliminar = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar empresa?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar"
    });

    if (confirm.isConfirmed) {
      await eliminarEmpresa(id);
      cargarEmpresas();
    }
  };

  return (
    <div className="admin-background">
      <div className="admin-overlay">
        <div className="admin-card">
          <h3>Registrar Empresa</h3>
          <form onSubmit={handleCrearEmpresa} className="row g-2 mb-4">
            {[
              { name: "nombre", type: "text", max: 50 },
              { name: "rut", type: "text", max: 12 },
              { name: "direccion", type: "text", max: 100 },
              { name: "comuna", type: "text", max: 50 },
              { name: "email", type: "email", max: 100 },
              { name: "telefono", type: "text", max: 15 },
              { name: "password", type: "password", max: 20 }
            ].map((campo, i) => (
              <div className="col-md-6" key={i}>
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
                      : campo.name.charAt(0).toUpperCase() + campo.name.slice(1)
                  }
                />
              </div>
            ))}
            <div className="col-md-12">
              <button className="btn btn-success">Crear Empresa</button>
            </div>
          </form>

          <h4>Empresas Registradas</h4>
          <table className="table table-bordered bg-white">
            <thead>
              <tr><th>Nombre</th><th>Email</th><th>Comuna</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {empresas.map(e => (
                <tr key={e.id}>
                  <td>{e.nombre}</td>
                  <td>{e.email}</td>
                  <td>{e.comuna}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(e.id)}>
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
  );
}
