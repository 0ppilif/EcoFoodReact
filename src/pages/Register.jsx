import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../services/firebase";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { saveUserData } from "../services/userService";

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

    if (password.length < 6) {
      Swal.fire("Contraseña débil", "Debe tener al menos 6 caracteres", "warning");
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
        "Te hemos enviado un enlace para verificar tu cuenta. Por favor verifica antes de iniciar sesión.",
        "info"
      );

      navigate("/login");
    } catch (error) {
      console.error("Error al registrar:", error);
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Registro de Cliente</h2>
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label className="form-label">Nombre completo</label>
          <input
            type="text"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="form-text">
            Mínimo 6 caracteres. Se recomienda combinar letras y números.
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Dirección</label>
          <input
            type="text"
            className="form-control"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Comuna</label>
          <input
            type="text"
            className="form-control"
            value={comuna}
            onChange={(e) => setComuna(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Teléfono (opcional)</label>
          <input
            type="tel"
            className="form-control"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Tipo de usuario</label>
          <input
            type="text"
            className="form-control"
            value="cliente"
            disabled
            readOnly
          />
        </div>

        <button type="submit" className="btn btn-success">
          Registrar
        </button>
      </form>
    </div>
  );
}
