import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs, doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import Swal from "sweetalert2";

export default function MisPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;

  const obtenerPedidos = async () => {
    if (!user) return;
    const pedidosRef = collection(db, "solicitudes");
    const q = query(pedidosRef, where("clienteId", "==", user.uid));
    const snapshot = await getDocs(q);

    const pedidosConInfo = await Promise.all(snapshot.docs.map(async (docu) => {
      const data = docu.data();
      const productoSnap = await getDoc(doc(db, "producto", data.productoId));
      const empresaSnap = await getDoc(doc(db, "usuarios", data.empresaId));
      return {
        id: docu.id,
        ...data,
        nombreProducto: productoSnap.exists() ? productoSnap.data().nombre : "Producto eliminado",
        nombreEmpresa: empresaSnap.exists() ? empresaSnap.data().nombre : "Empresa eliminada",
      };
    }));

    setPedidos(pedidosConInfo);
  };

  const cancelarPedido = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Cancelar solicitud?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No",
    });

    if (confirm.isConfirmed) {
      await deleteDoc(doc(db, "solicitudes", id));
      Swal.fire("Cancelado", "La solicitud fue eliminada.", "success");
      obtenerPedidos();
    }
  };

  useEffect(() => {
    obtenerPedidos();
  }, [user]);

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <h2 className="mb-4 text-center">Mis Solicitudes</h2>
        {pedidos.length === 0 ? (
          <p className="text-center">No tienes solicitudes registradas.</p>
        ) : (
          <div className="table-responsive" style={{ maxHeight: "60vh", overflowY: "auto" }}>
            <table className="table table-bordered align-middle">
              <thead className="table-success sticky-top">
                <tr>
                  <th>Producto</th>
                  <th>Empresa</th>
                  <th>Cantidad</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((pedido) => (
                  <tr key={pedido.id}>
                    <td>{pedido.nombreProducto}</td>
                    <td>{pedido.nombreEmpresa}</td>
                    <td>{pedido.cantidadSolicitada}</td>
                    <td>{pedido.fecha}</td>
                    <td>{pedido.estado}</td>
                    <td>
                      {pedido.estado === "pendiente" && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => cancelarPedido(pedido.id)}
                        >
                          Cancelar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
