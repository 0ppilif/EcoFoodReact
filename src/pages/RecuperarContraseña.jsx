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
  <div className="container d-flex justify-content-center align-items-center vh-100">
    <div className="card p-4 shadow" style={{ maxWidth: "400px", width: "100%" }}>
      <h3 className="text-center mb-3">Recuperar Contraseña</h3>
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
        <button type="submit" className="btn btn-warning w-100">
          Enviar correo de recuperación
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
)
}
