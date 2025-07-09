import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import Swal from "sweetalert2";
import { auth, db } from "../../../services/firebase";
import { doc, setDoc } from "firebase/firestore";
import { updatePassword } from "firebase/auth";
import { getUserData } from "../../../services/userService";

export default function AdminLayout() {
  const { userData, logout, setUserData } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [editForm, setEditForm] = useState(null);

  useEffect(() => {
    if (userData) {
      setEditForm({ ...userData, password: "" });
    }
  }, [userData]);

  const cerrarSesion = async () => {
    const confirmar = await Swal.fire({
      title: "¿Cerrar sesión?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    });

    if (confirmar.isConfirmed) {
      await logout();
      navigate("/login");
    }
  };

  const nombreCorto = (nombre) => {
    if (!nombre) return "";
    return nombre.length > 15 ? nombre.split(" ")[0] : nombre;
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleGuardarEdicion = async () => {
    try {
      const { nombre, email, password } = editForm;

      if (nombre.trim().length < 3 || nombre.trim().length > 50) {
        return Swal.fire("Nombre inválido", "Debe tener entre 3 y 50 caracteres", "warning");
      }

      if (password) {
        const regexRobusta = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{6,}$/;
        if (!regexRobusta.test(password)) {
          return Swal.fire("Contraseña insegura", "Debe tener mayúscula, minúscula, número y símbolo", "warning");
        }
        await updatePassword(auth.currentUser, password);
      }

      const ref = doc(db, "usuarios", auth.currentUser.uid);
      await setDoc(ref, { nombre, email, tipo: "admin" });

      const datosActualizados = await getUserData(auth.currentUser.uid);
      setUserData(datosActualizados); // ✅ Refresca el nombre mostrado

      Swal.fire("Actualizado", "Perfil actualizado correctamente", "success");
      setShowModal(false);
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <div className="d-flex min-vh-100">
      {/* Sidebar */}
      <div className="bg-dark text-white p-3" style={{ width: "220px" }}>
        <h4 className="fw-bold mb-4">ECOFOOD</h4>
        <nav className="nav flex-column">
          <Link to="/admin/dashboard" className="nav-link text-white">Inicio</Link>
          <Link to="/admin/clientes" className="nav-link text-white">Clientes</Link>
          <Link to="/admin/empresas" className="nav-link text-white">Empresas</Link>
          <Link to="/admin/administradores" className="nav-link text-white">Administradores</Link>
        </nav>
      </div>

      {/* Contenido principal */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* Header */}
        <header className="bg-light d-flex justify-content-between align-items-center px-4 py-2 border-bottom">
          <span className="fw-bold fs-5 text-secondary">Panel de Administración</span>
          <Dropdown align="end">
            <Dropdown.Toggle variant="light" className="d-flex align-items-center">
              <span className="me-2">{nombreCorto(userData?.nombre)}</span>
              <FaUserCircle size={24} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setShowModal(true)}>Editar perfil</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={cerrarSesion}>Cerrar sesión</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </header>

        {/* Vista de la ruta actual */}
        <main className="p-4" style={{ flex: 1, overflowY: "auto" }}>
          <Outlet />
        </main>
      </div>

      {/* Modal de edición */}
      {showModal && editForm && (
        <div className="modal d-block" tabIndex="-1" style={{ background: "#00000080" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Perfil</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body row g-2">
                <div className="col-md-6">
                  <label className="form-label">Nombre</label>
                  <input
                    name="nombre"
                    className="form-control"
                    minLength={3}
                    maxLength={50}
                    value={editForm.nombre}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input
                    name="email"
                    className="form-control"
                    value={editForm.email}
                    disabled
                  />
                </div>
                <div className="col-md-12">
                  <label className="form-label">Nueva contraseña</label>
                  <input
                    name="password"
                    type="password"
                    minLength={6}
                    maxLength={30}
                    className="form-control"
                    value={editForm.password}
                    onChange={handleEditChange}
                    placeholder="Dejar en blanco para no cambiar"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={handleGuardarEdicion}>
                  Guardar Cambios
                </button>
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
