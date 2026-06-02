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
import { db } from "../firebase/config";

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

function normalizeTimestamp(value) {
  if (!value) return 0;
  if (typeof value?.toMillis === "function") return value.toMillis();
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

function sortCarsByDateDesc(cars) {
  return [...cars].sort((a, b) => {
    const bDate = normalizeTimestamp(b.createdAt) || normalizeTimestamp(b.updatedAt);
    const aDate = normalizeTimestamp(a.createdAt) || normalizeTimestamp(a.updatedAt);
    return bDate - aDate;
  });
}

export async function getFeaturedCars() {
  const cars = await getCars();
  return cars
    .filter((car) => car.featured === true || String(car.featured).toLowerCase() === "true")
    .slice(0, 8);
}

export async function getCars(filters = {}) {
  try {
    const q = buildCarsQuery(filters);
    const snapshot = await getDocs(q);
    return snapshot.docs.map((snapshotDoc) => ({ id: snapshotDoc.id, ...snapshotDoc.data() }));
  } catch (error) {
    // Fallback for legacy docs that do not have createdAt or mixed field types.
    const snapshot = await getDocs(collection(db, COLLECTION));
    const allCars = snapshot.docs.map((snapshotDoc) => ({ id: snapshotDoc.id, ...snapshotDoc.data() }));

    let filtered = allCars;
    if (filters.featuredOnly) {
      filtered = filtered.filter(
        (car) => car.featured === true || String(car.featured).toLowerCase() === "true"
      );
    }
    if (filters.fuel) {
      filtered = filtered.filter((car) => car.fuel === filters.fuel);
    }
    if (filters.maxPrice) {
      filtered = filtered.filter((car) => Number(car.price) <= Number(filters.maxPrice));
    }
    if (filters.minYear) {
      filtered = filtered.filter((car) => Number(car.year) >= Number(filters.minYear));
    }
    if (filters.pageSize) {
      filtered = filtered.slice(0, filters.pageSize);
    }

    return sortCarsByDateDesc(filtered);
  }
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
