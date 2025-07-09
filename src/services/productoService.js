import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where
} from "firebase/firestore";

const productosRef = collection(db, "producto");

const productoService = {
  async obtenerProductosPorEmpresa(nombreEmpresa) {
    const q = query(productosRef, where("empresaId", "==", nombreEmpresa));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async crearProducto(producto) {
    await addDoc(productosRef, producto);
  },

  async actualizarProducto(producto) {
    const productoRef = doc(db, "producto", producto.id);
    const { id, ...datosActualizados } = producto;
    await updateDoc(productoRef, datosActualizados);
  },

  async eliminarProducto(id) {
    const productoRef = doc(db, "producto", id);
    await deleteDoc(productoRef);
  },
};

export default productoService;
