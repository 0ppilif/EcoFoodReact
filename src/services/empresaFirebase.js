import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where
} from "firebase/firestore";
import { db } from "./firebase";

const usuariosRef = collection(db, "usuarios");

export const obtenerEmpresas = async () => {
  const q = query(usuariosRef, where("tipo", "==", "empresa"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const eliminarEmpresa = async (id) => {
  await deleteDoc(doc(db, "usuarios", id));
};
