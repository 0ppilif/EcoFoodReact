import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth"; // <- IMPORTANTE
import { auth } from "../services/firebase";
import { AuthContext } from "./AuthContext";
import { getUserData } from "../services/userService";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const data = await getUserData(firebaseUser.uid);
          setUserData(data);
        } catch (e) {
          console.error("Error cargando datos de Firestore:", e);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, userData, loading, logout, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
};
