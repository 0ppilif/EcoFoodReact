import { db } from "../firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const empresaService = {
  obtenerPerfil: async (uid) => {
    const docRef = doc(db, "usuarios", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw new Error("No se encontró el perfil");
    }
  },

  actualizarPerfil: async (uid, nuevosDatos) => {
    const docRef = doc(db, "usuarios", uid);
    await updateDoc(docRef, nuevosDatos);
  }
};

export default empresaService;
