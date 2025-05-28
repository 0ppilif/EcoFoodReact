import { useAuth } from "../../context/AuthContext";
import CerrarSesion from "../../components/CerrarSesion";

export default function AdminDashboard() {
  const { userData } = useAuth();

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Panel Administrador</h2>
        <CerrarSesion />
      </div>
      <p>Bienvenido, {userData?.nombre}</p>
    </div>
  );
}
