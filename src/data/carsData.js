// DATOS DE MUESTRA — reemplazar con llamadas a Firebase Firestore
// Estructura pensada para mapear directamente documentos de la colección "coches"

export const carsData = [
  {
    id: "bmw-serie1-2018",
    brand: "BMW",
    model: "Serie 1",
    year: 2018,
    km: 78000,
    fuel: "Diésel",
    price: 16900,
    badge: "TOP VENTAS",
    environmentalBadge: "orange",
    // En producción: imageUrl vendrá de Firebase Storage
    imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&q=80",
    featured: true,
  },
  {
    id: "audi-a3-2019",
    brand: "Audi",
    model: "A3",
    year: 2019,
    km: 65000,
    fuel: "Gasolina",
    price: 17900,
    badge: null,
    environmentalBadge: null,
    imageUrl: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&q=80",
    featured: true,
  },
  {
    id: "bmw-serie1-2018",
    brand: "BMW",
    model: "Serie 1",
    year: 2018,
    km: 78000,
    fuel: "Diésel",
    price: 16900,
    badge: "TOP VENTAS",
    environmentalBadge: "orange",
    // En producción: imageUrl vendrá de Firebase Storage
    imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&q=80",
    featured: true,
  },
  {
    id: "audi-a3-2019",
    brand: "Audi",
    model: "A3",
    year: 2019,
    km: 65000,
    fuel: "Gasolina",
    price: 17900,
    badge: null,
    environmentalBadge: null,
    imageUrl: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&q=80",
    featured: true,
  },
  {
    id: "volkswagen-golf-2017",
    brand: "Volkswagen",
    model: "Golf",
    year: 2017,
    km: 90000,
    fuel: "Diésel",
    price: 13900,
    badge: null,
    environmentalBadge: null,
    imageUrl: "https://images.unsplash.com/photo-1471079485136-a8f30e2f4651?w=400&q=80",
    featured: true,
  },
  {
    id: "nissan-qashqai-2019",
    brand: "Nissan",
    model: "Qashqai",
    year: 2019,
    km: 55000,
    fuel: "Diésel",
    price: 18900,
    badge: "NOVEDAD",
    environmentalBadge: "green",
    imageUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&q=80",
    featured: true,
  },
];

// Ejemplo de cómo quedaría la llamada a Firebase cuando se integre:
//
// import { collection, getDocs, query, where } from "firebase/firestore";
// import { db } from "../firebase/config";
//
// export async function getFeaturedCars() {
//   const q = query(collection(db, "coches"), where("featured", "==", true));
//   const snapshot = await getDocs(q);
//   return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// }
