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
~~-Arreglar error CORS~~
~~-Añadir ruta protegida~~
~~-Sticky whatsapp~~
~~-Añadir el Logo~~
-Pasar a Next.js
~~Mirar tema responsive~~
-Cambiar contenido/descripciones... poner algo más legit
~~-Pagina de Contacto~~
-Pagina de Nosotros
-En "Publicar coche" la marca deberia ser un dropdown
~~-Añadir página individual de cada coche~~
~~-Quitar "top ventas" y "eco"~~
(-Paginación de reviews)
~~-Conectar con bbdd Firebase~~
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
-Etiqueta medioambiental en pagina individual de coche
-Hacer que se puedan subir imagenes del coche en lugar de solo url?
-Para el form quizas se puede hacer un .map tipo {label: Marca, key: marca, inputType: text/number, constants: ENVIRONMENTAL_BADGE tal} y en funcion de eso renderizamos un inputteext o select o lo que sea
-Pasar proyecto a Typescript
-en el display de consumo(L/100 km) falta montar lo de medio/ciudad/carretera
-pasar de css a scss
-añadir modelo de datos en firebase y conectar a la bbdd en CarDetailPage


Pasos hasta desplegar:
1.~~~~ C - Añadir campos al formulario (falta el textarea también)~~
2. D - Página de "Nosotros"
3. Acabar página detalle individual coche 
C - ---carrousel imagenes coche
C - ---arreglar responsive
D - ~~---cambiar estilos formulario contacto~~
C - ---parte de especificaciones mismos tamaños y formato correcto
4.~~ D - Boton inicio "Ver coches disponibles" debe dirigir a catalogo~~
5. D - Cambiar los gatos de formulario de contacto
D - ---Añadir funcionalidad de enviar consulta al mail del propietario del negosio
6. C - Cambiar info del Pieses
7.~~ D - Quitar funcionalidad telefono Header y ponerlo en naranja o algo~~
8.~~ D - Falta Favicon (crear un iconito de una ruedecita :) ~~
9. C - Cambiar titulo de cada pagina segun el coche que visites (lo que aparece en la pestaña jeje uwu ;)
10. C - Añadir cuentita de instagram abajo!!
11.~~~ D - Recortar logo (ya está hecho)~~
12. BALOO - Mirar cómo desplegar en AWS



Post despliegue:
1. Rediseño de la pagina de admin
---añadir radiobutton/desplegable para "Vendido/Publicado/Sin Publicar"
2. Mirar como usar BBDD en AWS
---También autenticación
---Tambien enviar mail al correo que toca del propietario
3. Migrar a Next.js/Typescript/SCSS
4. Mirar accesibilidad/SEO
6. Chequear lista "cosas que faltan" más arriba
