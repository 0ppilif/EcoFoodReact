import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../services/firebase";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function RecuperarContraseña() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      Swal.fire(
        "Correo enviado",
        "Hemos enviado un correo para restablecer tu contraseña.",
        "success"
      );
      navigate("/login");
    } catch (error) {
      console.error("Error al enviar correo:", error);
      Swal.fire("Error", "No se pudo enviar el correo", "error");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Recuperar Contraseña</h2>
      <form onSubmit={handleReset}>
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
        <button type="submit" className="btn btn-warning">
          Enviar correo de recuperación
        </button>
      </form>
    </div>
  );
}
