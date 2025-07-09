import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../services/firebase";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { saveUserData } from "../services/userService";

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

const comunasDisponibles = regiones.flatMap((r) => r.comunas);

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [direccion, setDireccion] = useState("");
  const [comuna, setComuna] = useState("");
  const [telefono, setTelefono] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (nombre.trim().length < 3 || nombre.trim().length > 50) {
      Swal.fire("Nombre inválido", "Debe tener entre 3 y 50 caracteres", "warning");
      return;
    }

    if (direccion.trim().length < 5 || direccion.trim().length > 100) {
      Swal.fire("Dirección inválida", "Debe tener entre 5 y 100 caracteres", "warning");
      return;
    }

    if (!comunasDisponibles.includes(comuna)) {
      Swal.fire("Comuna inválida", "Selecciona una comuna válida", "warning");
      return;
    }

    const regexTelefono = /^[0-9]{8,15}$/;
    if (telefono && !regexTelefono.test(telefono)) {
      Swal.fire("Teléfono inválido", "Debe contener entre 8 y 15 dígitos numéricos", "warning");
      return;
    }

    const regexRobusta = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{6,}$/;
    if (!regexRobusta.test(password)) {
      Swal.fire(
        "Contraseña insegura",
        "Debe tener al menos 6 caracteres, incluyendo mayúscula, minúscula, número y símbolo.",
        "warning"
      );
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await saveUserData(cred.user.uid, {
        nombre,
        email,
        direccion,
        comuna,
        telefono,
        tipo: "cliente",
      });
      await sendEmailVerification(cred.user);
      Swal.fire(
        "Correo enviado",
        "Te hemos enviado un enlace para verificar tu cuenta.",
        "info"
      );
      navigate("/login");
    } catch (error) {
      console.error("Error al registrar:", error);
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ maxWidth: "500px", width: "100%" }}>
        <h3 className="text-center mb-3">Registro de Cliente</h3>
        <form onSubmit={handleRegister}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Nombre completo</label>
              <input
                type="text"
                className="form-control"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                minLength={3}
                maxLength={50}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Correo electrónico</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={100}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                maxLength={100}
                required
              />
              <div className="form-text">
                Minimo 6 caracteres, con mayuscula, minuscula, numero y simbolo.
              </div>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Direccion</label>
              <input
                type="text"
                className="form-control"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                minLength={5}
                maxLength={100}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Comuna</label>
              <select
                className="form-select"
                value={comuna}
                onChange={(e) => setComuna(e.target.value)}
                required
              >
                <option value="">Selecciona una comuna</option>
                {comunasDisponibles.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Teléfono (opcional)</label>
              <input
                type="tel"
                className="form-control"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                pattern="[0-9]{8,15}"
                maxLength={15}
              />
            </div>

            <div className="col-12 mb-3">
              <label className="form-label">Tipo de usuario</label>
              <input
                type="text"
                className="form-control"
                value="cliente"
                disabled
                readOnly
              />
            </div>
          </div>

          <button type="submit" className="btn btn-success w-100">
            Registrar
          </button>
        </form>

        <button
          className="btn btn-outline-secondary mt-3 w-100"
          onClick={() => navigate("/login")}
        >
          Volver
        </button>
      </div>
    </div>
  );
}
