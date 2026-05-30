# AutoSelect — React + Firebase

Landing page para concesionario de coches de segunda mano.  
Diseño fiel al mockup original, con datos de muestra listos para conectar a Firebase.

## Estructura del proyecto

```
autoselect/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx / .css
│   │   ├── Hero.jsx / .css
│   │   ├── Features.jsx / .css
│   │   ├── FeaturedCars.jsx / .css
│   │   ├── CarCard.jsx / .css
│   │   ├── WhyUs.jsx / .css
│   │   ├── SellCar.jsx / .css
│   │   └── Footer.jsx / .css
│   ├── data/
│   │   └── carsData.js          ← datos de muestra
│   ├── firebase/
│   │   ├── config.js            ← credenciales Firebase
│   │   └── carsService.js       ← funciones Firestore/Storage
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## Instalación y arranque

```bash
npm install
npm run dev
```

## Conectar a Firebase

### 1. Crear proyecto en Firebase Console
- Ir a https://console.firebase.google.com
- Crear proyecto → Habilitar **Firestore** y **Storage**

### 2. Añadir credenciales
Edita `src/firebase/config.js` con los datos de tu proyecto.

### 3. Estructura de la colección `coches` en Firestore

Cada documento debe tener estos campos:

| Campo       | Tipo      | Ejemplo               |
|-------------|-----------|----------------------|
| brand       | string    | "BMW"                |
| model       | string    | "Serie 1"            |
| year        | number    | 2018                 |
| km          | number    | 78000                |
| fuel        | string    | "Diésel"             |
| price       | number    | 16900                |
| badge       | string?   | "TOP VENTAS"         |
| environmentalBadge  | string?   | "orange"             |
| imageUrl    | string    | (Firebase Storage URL)|
| featured    | boolean   | true                 |
| createdAt   | timestamp | serverTimestamp()    |

### 4. Activar Firebase en FeaturedCars

En `src/components/FeaturedCars.jsx`, sustituir los datos de muestra:

```js
// Antes (datos de muestra):
import { carsData } from "../data/carsData";

// Después (Firebase):
import { useEffect, useState } from "react";
import { getFeaturedCars } from "../firebase/carsService";

// En el componente:
const [cars, setFeaturedCars] = useState([]);
useEffect(() => {
  getFeaturedCars().then(setFeaturedCars);
}, []);
```

## Stack

- **React 18** + Vite
- **Firebase 10** (Firestore + Storage + Auth)
- CSS Modules por componente (sin dependencias de UI externas)
- Fuente: [Barlow](https://fonts.google.com/specimen/Barlow) (Google Fonts)


Cosas que faltan
-Arreglar error CORS
-Añadir ruta protegida
-Sticky whatsapp
-Añadir el Logo
-Pasar a Next.js
~~-Mirar tema responsive~~
-Cambiar contenido/descripciones... poner algo más legit
-Pagina de Contacto
-Pagina de Nosotros
-En "Publicar coche" la marca deberia ser un dropdown
-Añadir página individual de cada coche
~~-Quitar "top ventas" y "eco"~~
(-Paginación de reviews)
-Conectar con bbdd Firebase
-AWS (despliegue y bbdd)
-Preguntar a tu padre cuánto paga su amigo por la web
-Decir a tu padre que pida reseñas de wallapop
-en la pantalla de catalogo hay que añadir esqueleto mientras cargan los coches
~~-etiqueta medioambiental en la imagen del coche arriba a la dercha~~
-mirar diseño de las cards
-carrousel imagenes en cada card de coche
-Añadir modal panel admin
-refactorizar/revisar codigo porque los componentes dan SIDA (VIH)
-preguntar IA como gestinoar cards de Reseñas (poner solo 4 en version movil +paginador?)
-quitar frase del logo