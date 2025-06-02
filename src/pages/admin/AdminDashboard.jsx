import { useAuth } from "../../context/AuthContext";
import "../../styles/adminBackground.css";

export default function AdminDashboard() {
  const { userData } = useAuth();

  return (
    <div className="admin-background">
      <div className="admin-overlay">
        <div className="admin-card">
          <h2>Perfil del Administrador</h2>
          <p><strong>Nombre:</strong> {userData?.nombre}</p>
          <p><strong>Email:</strong> {userData?.email}</p>
          <p><strong>Rol:</strong> {userData?.tipo}</p>
        </div>
      </div>
    </div>
  );
}
