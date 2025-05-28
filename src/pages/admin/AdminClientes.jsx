import { useEffect, useState } from "react";
import { getDocs, deleteDoc, doc, collection } from "firebase/firestore";
import { db } from "../../services/firebase";
import Swal from "sweetalert2";

export default function AdminClientes() {
  const [clientes, setClientes] = useState([]);

  const cargarClientes = async () => {
    const snapshot = await getDocs(collection(db, "usuarios"));
    const filtrados = [];
    snapshot.forEach(d => {
      const data = d.data();
      if (data.tipo === "cliente") filtrados.push({ id: d.id, ...data });
    });
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
    <div>
      <h3>Clientes Registrados</h3>
      <table className="table">
        <thead>
          <tr><th>Nombre</th><th>Email</th><th>Comuna</th><th>Teléfono</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {clientes.map(c => (
            <tr key={c.id}>
              <td>{c.nombre}</td><td>{c.email}</td><td>{c.comuna}</td><td>{c.telefono || "-"}</td>
              <td><button className="btn btn-danger btn-sm" onClick={() => eliminarCliente(c.id)}>Eliminar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
