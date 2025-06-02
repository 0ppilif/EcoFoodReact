import { useEffect, useState } from "react";
import { getDocs, deleteDoc, doc, collection } from "firebase/firestore";
import { db } from "../../services/firebase";
import Swal from "sweetalert2";
import "../../styles/adminBackground.css";

export default function AdminClientes() {
  const [clientes, setClientes] = useState([]);

  const cargarClientes = async () => {
    const snapshot = await getDocs(collection(db, "usuarios"));
    const filtrados = snapshot.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(d => d.tipo === "cliente");
    setClientes(filtrados);
  };

  const eliminarCliente = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar cliente?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí"
    });
    if (confirm.isConfirmed) {
      await deleteDoc(doc(db, "usuarios", id));
      cargarClientes();
    }
  };

  useEffect(() => { cargarClientes(); }, []);

  return (
    <div className="admin-background">
      <div className="admin-overlay">
        <div className="admin-card">
          <h3>Clientes Registrados</h3>
          <table className="table table-bordered bg-white">
            <thead>
              <tr><th>Nombre</th><th>Email</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {clientes.map(c => (
                <tr key={c.id}>
                  <td>{c.nombre}</td>
                  <td>{c.email}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => eliminarCliente(c.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
