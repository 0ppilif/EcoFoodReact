import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";
import { auth } from "../services/firebase";
import Swal from "sweetalert2";
import { getUserData } from "../services/userService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await setPersistence(auth, browserLocalPersistence);
      const cred = await signInWithEmailAndPassword(auth, email, password);

      if (!cred.user.emailVerified) {
        Swal.fire(
          "Correo no verificado",
          "Debes verificar tu correo electrónico antes de iniciar sesión.",
          "warning"
        );
        return;
      }

      const datos = await getUserData(cred.user.uid);

      Swal.fire("Bienvenido", `Hola ${datos.nombre} (${datos.tipo})`, "success");

      if (datos.tipo === "admin") {
        navigate("/admin/dashboard");
      } else if (datos.tipo === "cliente") {
        navigate("/cliente/dashboard");
      } else if (datos.tipo === "empresa") {
        navigate("/empresa/perfil");
      } else {
        navigate("/home");
      }

    } catch (error) {
      console.error("Login error:", error);
      Swal.fire("Error", "Credenciales incorrectas o fallo de red", "error");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">Correo Electrónico</label>
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
        </div>

        <div className="d-flex">
          <button type="submit" className="btn btn-primary">
            Iniciar Sesión
          </button>
          <Link to="/registro" className="btn btn-primary ms-2">
            Registrarse
          </Link>
        </div>

        <div className="mt-3">
          <Link to="/recuperar" className="btn btn-link">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </form>
    </div>
  );
}
