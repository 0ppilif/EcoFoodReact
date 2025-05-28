import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Trae todos los usuarios con tipo "cliente"
 */
export const obtenerClientes = async () => {
  try {
    const snapshot = await getDocs(collection(db, "usuarios"));
    const clientes = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.tipo === "cliente") {
        clientes.push({ id: docSnap.id, ...data });
      }
    });
    return clientes;
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    throw error;
  }
};

/**
 * Elimina un cliente por su UID
 */
export const eliminarCliente = async (id) => {
  try {
    await deleteDoc(doc(db, "usuarios", id));
  } catch (error) {
    console.error("Error al eliminar cliente:", error);
    throw error;
  }
};
