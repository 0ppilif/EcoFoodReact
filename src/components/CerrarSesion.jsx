import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";
import { signOut } from "firebase/auth";
import Swal from "sweetalert2";

export default function CerrarSesion() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    Swal.fire("Sesión cerrada", "Hasta pronto", "success");
    navigate("/login");
  };

  return (
    <button className="btn btn-outline-light" onClick={handleLogout}>
      Cerrar sesión
    </button>
  );
}
