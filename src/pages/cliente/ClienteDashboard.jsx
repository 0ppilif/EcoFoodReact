import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase";

export default function ClienteDashboard() {
  const auth = getAuth();
  const user = auth.currentUser;
  const [nombreCliente, setNombreCliente] = useState("");

  const obtenerNombreCliente = async () => {
    if (!user) return;
    const ref = doc(db, "usuarios", user.uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data();
      setNombreCliente(data.nombre || user.email);
    }
  };

  useEffect(() => {
    obtenerNombreCliente();
  }, [user]);

  return (
    <div
      className="cliente-dashboard"

    >
      <div className="overlay">
        <div className="welcome-card">
          <h2 className="mb-4">Bienvenido, {nombreCliente}</h2>
          <p>Puedes ver y pedir los productos que necesites</p>
        </div>
      </div>
      </div>
  );
}
