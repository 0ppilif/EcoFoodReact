import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export const getUsuarioPorId = async (id) => {
  const docRef = doc(db, "usuarios", id);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return { id: snap.id, ...snap.data() };
  }
  return null;
};

export const actualizarUsuario = async (id, datos) => {
  const ref = doc(db, "usuarios", id);
  await updateDoc(ref, datos);
};
