import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./config";

const COLLECTION = "coches";

function buildCarsQuery({ fuel, maxPrice, minYear, featuredOnly, pageSize } = {}) {
  let q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));

  if (featuredOnly) q = query(q, where("featured", "==", true));
  if (fuel) q = query(q, where("fuel", "==", fuel));
  if (maxPrice) q = query(q, where("price", "<=", maxPrice));
  if (minYear) q = query(q, where("year", ">=", minYear));
  if (pageSize) q = query(q, limit(pageSize));

  return q;
}

export async function getFeaturedCars() {
  const q = buildCarsQuery({ featuredOnly: true, pageSize: 8 });
  const snapshot = await getDocs(q);
  return snapshot.docs.map((snapshotDoc) => ({ id: snapshotDoc.id, ...snapshotDoc.data() }));
}

export async function getCars(filters = {}) {
  const q = buildCarsQuery(filters);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((snapshotDoc) => ({ id: snapshotDoc.id, ...snapshotDoc.data() }));
}

export async function getCarById(id) {
  const docRef = doc(db, COLLECTION, id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error("Coche no encontrado");
  }

  return { id: docSnap.id, ...docSnap.data() };
}

export async function addCar(carData) {
  return addDoc(collection(db, COLLECTION), {
    ...carData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateCar(id, data) {
  const docRef = doc(db, COLLECTION, id);

  return updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteCar(id) {
  return deleteDoc(doc(db, COLLECTION, id));
}
