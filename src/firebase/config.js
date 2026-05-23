import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA2D80fUgaP2R-3OKhO0N4C3E1KfmxYQno",
  authDomain: "chelombus-7aa48.firebaseapp.com",
  databaseURL: "https://chelombus-7aa48-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "chelombus-7aa48",
  storageBucket: "chelombus-7aa48.firebasestorage.app",
  messagingSenderId: "55600125583",
  appId: "1:55600125583:web:a785f59d73de5ea6f082fa",
  measurementId: "G-K6G24738WP",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
