// src/firebase/carsService.js
// Funciones listas para reemplazar los datos de muestra de carsData.js

import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./config";

const COLLECTION = "coches";

/** Obtener coches destacados (para la sección principal) */
export async function getFeaturedCars() {
  const q = query(
    collection(db, COLLECTION),
    where("featured", "==", true),
    orderBy("createdAt", "desc"),
    limit(8)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

/** Obtener todos los coches con filtros opcionales */
export async function getCars({ fuel, maxPrice, minYear } = {}) {
  let q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
  if (fuel) q = query(q, where("fuel", "==", fuel));
  if (maxPrice) q = query(q, where("price", "<=", maxPrice));
  if (minYear) q = query(q, where("year", ">=", minYear));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

/** Obtener un coche por ID */
export async function getCarById(id) {
  const docRef = doc(db, COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) throw new Error("Coche no encontrado");
  return { id: docSnap.id, ...docSnap.data() };
}

/** Añadir un nuevo coche (para el panel de admin) */
export async function addCar(carData, imageFile) {
  let imageUrl = null;
  if (imageFile) {
    const storageRef = ref(storage, `coches/${Date.now()}_${imageFile.name}`);
    const snapshot = await uploadBytes(storageRef, imageFile);
    imageUrl = await getDownloadURL(snapshot.ref);
  }
  return addDoc(collection(db, COLLECTION), {
    ...carData,
    imageUrl,
    createdAt: serverTimestamp(),
  });
}

/** Actualizar un coche */
export async function updateCar(id, data) {
  const docRef = doc(db, COLLECTION, id);
  return updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
}

/** Eliminar un coche */
export async function deleteCar(id) {
  return deleteDoc(doc(db, COLLECTION, id));
}
