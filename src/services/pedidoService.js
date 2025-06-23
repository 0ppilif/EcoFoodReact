import { db } from "../services/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export const obtenerPedidosCliente = async (uid) => {
  const q = query(collection(db, "pedidos"), where("clienteId", "==", uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
