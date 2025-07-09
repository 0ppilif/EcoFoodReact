import { useState, useEffect } from "react";
import {
  obtenerEmpresas,
  eliminarEmpresa
} from "../../services/empresaFirebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification
} from "firebase/auth";
import { secondaryAuth, db } from "../../services/firebase";
import { setDoc, doc, updateDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import EmpresaModal from "../../components/EmpresaModal";
import "../../styles/adminBackground.css";

const regiones = [
  { nombre: "Región de Coquimbo", comunas: ["La Serena","Coquimbo","Vicuña","Ovalle"]},
  { nombre: "Región Metropolitana", comunas: ["Santiago","Puente Alto","Maipú","Las Condes"]},
];

const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{6,}$/;
const regexRut = /^\d{7,8}-[\dkK]$/;

export default function AdminEmpresas() {
  const [empresas, setEmpresas] = useState([]);
  const [form, setForm] = useState({
    nombre: "", rut: "", direccion: "", comuna: "",
    email: "", telefono: "", password: ""
  });
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => cargarEmpresas(), []);

  async function cargarEmpresas() {
    const data = await obtenerEmpresas();
    setEmpresas(data);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleCrearEmpresa(e) {
    e.preventDefault();
    const { nombre, rut, direccion, comuna, email, telefono, password } = form;

    if (nombre.trim().length < 3 || nombre.trim().length > 50)
      return Swal.fire("Nombre inválido","3 a 50 caracteres","warning");

    if (!regexRut.test(rut))
      return Swal.fire("RUT inválido","Formato 12345678-9","warning");

    if (direccion.trim().length < 5 || direccion.trim().length > 100)
      return Swal.fire("Dirección inválida","5 a 100 caracteres","warning");

    if (comuna === "")
      return Swal.fire("Seleccione comuna","Campo requerido","warning");

    if (!regexEmail.test(email))
      return Swal.fire("Email inválido","Introduce un email válido","warning");

    if (!/^\d{8,15}$/.test(telefono))
      return Swal.fire("Teléfono inválido","8 a 15 dígitos","warning");

    if (!regexPassword.test(password))
      return Swal.fire("Contraseña insegura",
        "Debe incluir mayúscula, minúscula, número y símbolo","warning");

    try {
      const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password);
      await sendEmailVerification(cred.user);
      await setDoc(doc(db, "usuarios", cred.user.uid), {
        nombre, rut, direccion, comuna, email, telefono, tipo: "empresa"
      });
      Swal.fire("Empresa creada","Correo de verificación enviado","success");
      setForm({ nombre:"", rut:"",direccion:"",comuna:"",email:"",telefono:"",password:"" });
      cargarEmpresas();
    } catch (err) {
      Swal.fire("Error",err.code==="auth/email-already-in-use"
        ? "Correo ya registrado":"hubo un error","error");
    }
  }

  function handleEliminar(id) {
    Swal.fire({
      title: "¿Eliminar empresa?", icon: "warning",
      showCancelButton:true, confirmButtonText:"Sí, eliminar"
    }).then(res => {
      if (res.isConfirmed) {
        eliminarEmpresa(id).then(cargarEmpresas);
      }
    });
  }

  function handleEditar(emp) {
    setEmpresaSeleccionada(emp);
    setShowModal(true);
  }

  async function guardarCambios(actualizada) {
    const { nombre, direccion, comuna, telefono, id } = actualizada;

    if (nombre.trim().length < 3 || nombre.trim(). length > 50)
      return Swal.fire("Nombre inválido","3 a 50 caracteres","warning");

    if (direccion.trim().length < 5 || direccion.trim().length > 100)
      return Swal.fire("Dirección inválida","5 a 100 caracteres","warning");

    if (comuna === "")
      return Swal.fire("Seleccione comuna","Campo requerido","warning");

    if (!/^\d{8,15}$/.test(telefono))
      return Swal.fire("Teléfono inválido","8 a 15 dígitos","warning");

    try {
      const ref = doc(db, "usuarios", id);
      await updateDoc(ref, { nombre, direccion, comuna, telefono });
      Swal.fire("Actualizado","Datos guardados","success");
      setShowModal(false);
      cargarEmpresas();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  }

  return (
    <div className="admin-background">
      <div className="admin-overlay">
        <div className="admin-card">
          <h3>Registrar Empresa</h3>
          <form onSubmit={handleCrearEmpresa} className="row g-2 mb-4">
            {[
              { name:"nombre", type:"text" },
              { name:"rut", type:"text" },
              { name:"direccion", type:"text" },
              { name:"comuna", type:"select" },
              { name:"email", type:"email" },
              { name:"telefono", type:"tel" },
              { name:"password", type:"password" }
            ].map((campo,i)=>(
              <div className="col-md-6" key={i}>
                {campo.name==="comuna" ? (
                  <select name="comuna" required className="form-control"
                    value={form.comuna} onChange={handleChange}>
                    <option value="">Seleccione Comuna</option>
                    {regiones.map((r,j)=>(
                      <optgroup key={j} label={r.nombre}>
                        {r.comunas.map(c=>(
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                ) : (
                  <input
                    name={campo.name}
                    type={campo.type}
                    className="form-control"
                    value={form[campo.name]}
                    onChange={handleChange}
                    required={campo.name !== "telefono"}
                    placeholder={campo.name.charAt(0).toUpperCase() + campo.name.slice(1)}
                    minLength={
                      campo.name === "nombre" ? 3 :
                      campo.name === "direccion" ? 5 :
                      campo.name === "rut" ? 9 :
                      campo.name === "password" ? 6 :
                      campo.name === "telefono" ? 8 :
                      undefined
                    }
                    maxLength={
                      campo.name === "nombre" ? 50 :
                      campo.name === "direccion" ? 100 :
                      campo.name === "rut" ? 10 :
                      campo.name === "email" ? 100 :
                      campo.name === "telefono" ? 15 :
                      campo.name === "password" ? 30 :
                      undefined
                    }
                  />
                )}
              </div>
            ))}
            <div className="col-12">
              <button className="btn btn-success">Crear Empresa</button>
            </div>
          </form>

          <h4>Empresas Registradas</h4>
          <div style={{maxHeight:"300px",overflowY:"auto"}}>
            <table className="table table-bordered bg-white">
              <thead><tr>
                <th>Nombre</th><th>Email</th><th>Comuna</th><th>Acciones</th>
              </tr></thead>
              <tbody>
                {empresas.map(e=>(
                  <tr key={e.id}>
                    <td>{e.nombre}</td>
                    <td>{e.email}</td>
                    <td>{e.comuna}</td>
                    <td>
                      <button className="btn btn-warning btn-sm me-1"
                        onClick={()=>handleEditar(e)}>Editar</button>
                      <button className="btn btn-danger btn-sm"
                        onClick={()=>handleEliminar(e.id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <EmpresaModal
            show={showModal}
            handleClose={()=>setShowModal(false)}
            empresa={empresaSeleccionada}
            onSave={guardarCambios}
          />
        </div>
      </div>
    </div>
  );
}
