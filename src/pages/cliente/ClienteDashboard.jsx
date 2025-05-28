import NavbarGeneral from "../../components/NavbarGeneral";
import "./clienteDashboard.css";

export default function ClienteDashboard() {
  return (
    <div className="cliente-dashboard">
      <NavbarGeneral tipo="cliente" />
      <div className="overlay">
        <div className="welcome-card">
          <h2>Bienvenido a EcoFood</h2>
          <p>Explora nuestros productos y novedades.</p>
        </div>
      </div>
    </div>
  );
}
