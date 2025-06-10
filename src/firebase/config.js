import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCGlfqSsaa1sej6g131L_AIKabWA4eOFRU",
  authDomain: "proyectoecofood-3ab45.firebaseapp.com",
  projectId: "proyectoecofood-3ab45",
  storageBucket: "proyectoecofood-3ab45.firebasestorage.app",
  messagingSenderId: "77168198682",
  appId: "1:77168198682:web:519302475734e374a67da3"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
