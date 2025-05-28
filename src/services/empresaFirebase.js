import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";
import { db } from "./firebase";

const empresasRef = collection(db, "empresas");

export const obtenerEmpresas = async () => {
  const snapshot = await getDocs(empresasRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const crearEmpresa = async (data) => {
  await addDoc(empresasRef, { ...data, productos: [] });
};

export const eliminarEmpresa = async (id) => {
  await deleteDoc(doc(db, "empresas", id));
};

export const editarEmpresa = async (id, data) => {
  const ref = doc(db, "empresas", id);
  await updateDoc(ref, data);
};
