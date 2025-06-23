import { db } from "../services/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export const obtenerProductosDisponibles = async () => {
  const q = query(
    collection(db, "producto"),
    where("estado", "==", "disponible"),
    where("visible", "==", true)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
