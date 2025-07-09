import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import "../../styles/empresadashboard.css";

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
    <div className="empresa-background">
      <div className="empresa-overlay">
        <div className="empresa-card text-center">
          <h2 className="mb-4">Bienvenido, {nombreCliente}</h2>
          <p className="fs-5">
            Puedes ver y pedir los productos que necesites desde el menú lateral.
          </p>
        </div>
      </div>
    </div>
  );
}
