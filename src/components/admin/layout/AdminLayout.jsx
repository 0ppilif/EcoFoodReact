import { Outlet } from "react-router-dom";
import NavbarGeneral from "../../NavbarGeneral";

export default function AdminLayout() {
  return (
    <div>
      <NavbarGeneral tipo="admin" />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
