// src/firebase/config.js
// Rellena con tus credenciales de Firebase Console
// (Configuración del proyecto > Tus apps > SDK de Firebase)

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);       // Firestore (base de datos)
export const storage = getStorage(app);    // Storage (imágenes de coches)
export const auth = getAuth(app);          // Auth (panel de admin futuro)

export default app;
