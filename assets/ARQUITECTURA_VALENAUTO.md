# ValenAuto — Arquitectura y plan de refactorización

> Documento de referencia del equipo. Actualizar ante cualquier decisión estructural nueva.
> Última revisión: mayo 2026

---

## 1. Stack tecnológico

| Capa | Tecnología | Decisión |
|---|---|---|
| UI | React 18 + Vite | ✅ Mantener |
| Routing | React Router v6 | ✅ Mantener |
| Estilos | SCSS Modules | 🔄 Migrar de CSS Modules |
| Backend / DB | Firebase (Firestore, Auth, Storage) | ✅ Mantener por ahora |
| Estado global | React Context (solo Auth) | ✅ Mantener |
| Estado servidor | Custom hooks | ✅ Mantener |

---

## 2. Estructura de carpetas objetivo

```
src/
├── main.jsx                        # Solo monta <App> y el AuthProvider
├── App.jsx                         # Solo renderiza <AppRouter>
│
├── router/
│   ├── AppRouter.jsx               # Definición centralizada de todas las rutas
│   └── PrivateRoute.jsx            # HOC: redirige a /admin/login si no autenticado
│
├── pages/                          # Composición únicamente. Sin lógica, sin Firebase
│   ├── HomePage.jsx
│   ├── CatalogPage.jsx
│   ├── CarDetailPage.jsx
│   ├── ContactPage.jsx
│   ├── AboutPage.jsx
│   ├── AdminLoginPage.jsx
│   └── AdminPage.jsx
│
├── components/
│   ├── layout/                     # Estructura de página, presentes en todas las vistas
│   │   ├── Navbar/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Navbar.module.scss
│   │   │   └── index.js
│   │   └── Footer/
│   │       ├── Footer.jsx
│   │       ├── Footer.module.scss
│   │       └── index.js
│   │
│   ├── home/                       # Secciones exclusivas de HomePage
│   │   ├── Hero/
│   │   ├── Features/
│   │   ├── FeaturedCars/
│   │   ├── Testimonials/
│   │   └── CtaBanner/
│   │
│   ├── cars/                       # Todo lo relacionado con coches
│   │   ├── CarCard/
│   │   ├── CarGrid/
│   │   ├── CarFilters/
│   │   └── CarDetail/
│   │
│   └── ui/                         # Átomos sin lógica de negocio
│       ├── Button/
│       ├── Badge/
│       ├── Spinner/
│       └── EmptyState/
│
├── hooks/                          # Lógica de negocio + estado servidor
│   ├── useCars.js
│   ├── useCarDetail.js
│   └── useAuth.js
│
├── context/
│   └── AuthContext.jsx             # Provider global de sesión
│
├── services/                       # ÚNICA capa que toca Firebase
│   ├── carsService.js
│   ├── authService.js
│   ├── storageService.js
│   └── contactService.js
│
├── firebase/
│   └── config.js                   # initializeApp + exports: db, auth, storage
│
├── constants/
│   ├── routes.js
│   ├── car.js                      # Tipos de combustible, carrocería, etc.
│   └── ui.js                       # Labels visuales, colores de badge
│
├── utils/
│   ├── formatters.js               # formatPrice, formatKm, formatDate
│   └── validators.js               # validateCarForm
│
└── styles/                         # SCSS global (no estilos de componentes)
    ├── _variables.scss
    ├── _mixins.scss
    ├── _reset.scss
    └── main.scss                   # @use de los tres anteriores, importado en main.jsx
```

---

## 3. Reglas de arquitectura — el contrato del equipo

### 3.1 Flujo de datos: una sola dirección

```
Page → Component → Hook → Service → Firebase
```

Cada capa solo habla con la inmediatamente inferior. Nunca saltarse niveles.

| Capa | Responsabilidad | Prohibido |
|---|---|---|
| **Pages** | Componer componentes y pasar props | Lógica, llamadas a Firebase, useState de servidor |
| **Components** | Renderizar UI, emitir eventos hacia arriba | Importar services o firebase directamente |
| **Hooks** | Lógica de negocio, estado derivado | Importar firebase directamente (solo services) |
| **Services** | Funciones async puras hacia Firebase | Estado React, imports de componentes |
| **Firebase/config** | Inicialización y exports | Cualquier lógica |

### 3.2 Constantes en lugar de strings literales

```js
// ❌
<NavLink to="/coches">
navigate('/admin')

// ✅
import { ROUTES } from '@/constants/routes'
<NavLink to={ROUTES.CATALOG}>
navigate(ROUTES.ADMIN)
```

### 3.3 Un componente = una carpeta

```
CarCard/
├── CarCard.jsx
├── CarCard.module.scss
└── index.js              ← export { default } from './CarCard'
```

El `index.js` permite importar limpiamente:
```js
import CarCard from '@/components/cars/CarCard'
// en vez de: import CarCard from '@/components/cars/CarCard/CarCard'
```

### 3.4 Alias `@` apuntando a `src/`

`vite.config.js`:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }
  }
})
```

`jsconfig.json` (para que el editor resuelva el alias):
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  }
}
```

### 3.5 Componentes `ui/` son agnósticos al negocio

Si un componente necesita importar algo de `services/`, `hooks/` o saber que existe
un "coche", no pertenece a `ui/`. Pertenece a `cars/` o a `home/`.

### 3.6 Admin = mismos services, no duplicar CRUD

`AdminPage` usa `carsService` igual que el catálogo público. No hay una API
separada para admin.

---

## 4. Modelo de datos — Firestore

### Colección `cars`

```js
{
  // ── Identificación ─────────────────────────────────────────
  id:            string,      // Auto Firestore
  createdAt:     Timestamp,
  updatedAt:     Timestamp,
  published:     boolean,     // false = borrador, no aparece en catálogo
  featured:      boolean,     // true = aparece en la HomePage
  sold:          boolean,     // true = vendido (se muestra como tal o se oculta)

  // ── Datos básicos ──────────────────────────────────────────
  brand:         string,      // "Nissan"
  model:         string,      // "Qashqai"
  version:       string,      // "2.0 dCi TEKNA PREMIUM 4x4"
  year:          number,      // 2011
  km:            number,      // 128000
  price:         number,      // 9990
  previousPrice: number|null, // Precio antes de rebaja, para mostrar tachado

  // ── Motor y mecánica ───────────────────────────────────────
  fuel:          'Gasolina'|'Diesel'|'Hibrido'|'Electrico'|'GLP',
  transmission:  'Manual'|'Automatico',
  power:         number,      // CV
  displacement:  number|null, // cc
  bodyType:      'Berlina'|'SUV'|'Familiar'|'Coupe'|'Cabrio'|'Monovolumen'|'Pickup',
  doors:         number,
  seats:         number,
  driveType:     '2WD'|'4WD'|null,

  // ── Etiquetas y emisiones ──────────────────────────────────
  envLabel:      '0'|'ECO'|'C'|'B'|null,  // Etiqueta DGT
  co2:           number|null,              // g/km
  color:         string,                   // "Negro"

  // ── Imágenes ───────────────────────────────────────────────
  images:        string[],    // URLs de Firebase Storage. images[0] = portada

  // ── Equipamiento estructurado ──────────────────────────────
  equipment: {
    comfort:    string[],   // "Climatizador bizona", "Asientos calefactados"
    safety:     string[],   // "Cámara aparcamiento", "Control crucero"
    multimedia: string[],   // "Pantalla táctil 10\"", "Audio BOSE"
    exterior:   string[],   // "Techo panorámico", "Llantas 18\""
    other:      string[],
  },

  // ── Garantía ───────────────────────────────────────────────
  warranty: {
    months:      number,    // 12
    included:    boolean,   // true = incluida en precio
    description: string,    // "Garantía Premium"
  } | null,

  // ── Badge visual en tarjeta ────────────────────────────────
  label:      'NOVEDAD'|'ECO'|'TOP VENTAS'|'OFERTA'|null,
  labelColor: 'green'|'orange'|'red',

  // ── Info extra ─────────────────────────────────────────────
  description:   string,      // Texto libre del anunciante
  transferCost:  number|null, // Coste cambio de nombre aparte (ej: 190)
  ivaIncluded:   boolean,

  // ── Metadatos internos (no visibles en web) ────────────────
  location:      string,      // "Madrid"
  notes:         string,      // Notas privadas del negocio
}
```

### Colección `contacts`

```js
{
  id:        string,
  name:      string,
  email:     string,
  phone:     string,
  message:   string,
  carId:     string|null,   // Si el mensaje viene de la ficha de un coche
  createdAt: Timestamp,
  read:      boolean,
}
```

---

## 5. API interna de servicios

Los services son la única interfaz entre React y Firebase. Cualquier cambio de
backend (Firebase → AWS) se hace aquí y solo aquí.

### `carsService.js`

```js
getCars(filters?)           → Promise<Car[]>
  // filters: { fuel, featured, published, sold, bodyType }
getCarById(id)              → Promise<Car>
addCar(carData)             → Promise<string>   // retorna el nuevo id
updateCar(id, carData)      → Promise<void>
deleteCar(id)               → Promise<void>
getFeaturedCars()           → Promise<Car[]>    // shortcut: published=true, featured=true
```

### `authService.js`

```js
login(email, password)      → Promise<UserCredential>
logout()                    → Promise<void>
getCurrentUser()            → User | null
```

### `storageService.js`

```js
uploadCarImage(file, carId) → Promise<string>   // retorna la URL pública
deleteCarImage(imageUrl)    → Promise<void>
```

### `contactService.js`

```js
sendContact(formData)       → Promise<void>
getContacts()               → Promise<Contact[]>
markAsRead(id)              → Promise<void>
```

---

## 6. Hooks

```js
// useCars.js
const { cars, loading, error } = useCars(filters)
// filters es opcional. Si cambia, re-fetcha automáticamente.

// useCarDetail.js
const { car, loading, error } = useCarDetail(carId)

// useAuth.js
const { user, loading } = useAuth()
// Solo lee AuthContext. Login/logout se llaman desde las páginas directamente.
```

---

## 7. Rutas

```js
// constants/routes.js
export const ROUTES = {
  HOME:        '/',
  CATALOG:     '/coches',
  CAR_DETAIL:  '/coches/:id',
  CONTACT:     '/contacto',
  ABOUT:       '/nosotros',
  ADMIN_LOGIN: '/admin/login',
  ADMIN:       '/admin',
}
```

```jsx
// router/AppRouter.jsx
<Routes>
  <Route path={ROUTES.HOME}        element={<HomePage />} />
  <Route path={ROUTES.CATALOG}     element={<CatalogPage />} />
  <Route path={ROUTES.CAR_DETAIL}  element={<CarDetailPage />} />
  <Route path={ROUTES.CONTACT}     element={<ContactPage />} />
  <Route path={ROUTES.ABOUT}       element={<AboutPage />} />
  <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLoginPage />} />
  <Route path={ROUTES.ADMIN}       element={
    <PrivateRoute><AdminPage /></PrivateRoute>
  } />
</Routes>
```

---

## 8. SCSS — configuración

### Instalación

```bash
npm install -D sass
```

No hace falta ningún plugin adicional en Vite.

### `styles/_variables.scss`

```scss
// Colores
$color-primary:      #E8711A;
$color-primary-dark: #C45E12;
$color-dark:         #1A1A1A;
$color-white:        #FFFFFF;
$color-gray-100:     #F4F4F4;
$color-gray-200:     #E5E5E5;
$color-gray-500:     #9E9E9E;
$color-gray-800:     #333333;

// Tipografía
$font-base:     'Inter', sans-serif;
$font-size-sm:  0.875rem;   // 14px
$font-size-md:  1rem;       // 16px
$font-size-lg:  1.125rem;   // 18px
$font-size-xl:  1.5rem;     // 24px
$font-size-2xl: 2rem;       // 32px

// Espaciado
$sp-xs:  4px;   $sp-sm: 8px;   $sp-md: 16px;
$sp-lg: 24px;   $sp-xl: 40px;  $sp-2xl: 64px;

// Bordes y sombras
$radius-sm:   6px;
$radius-md:   10px;
$radius-lg:   16px;
$shadow-card: 0 2px 8px rgba(0,0,0,.08);
$shadow-hover:0 4px 16px rgba(0,0,0,.14);

// Breakpoints
$bp-sm: 576px;   $bp-md: 768px;
$bp-lg: 1024px;  $bp-xl: 1280px;
```

### `styles/_mixins.scss`

```scss
@use 'variables' as *;

@mixin sm { @media (min-width: $bp-sm) { @content; } }
@mixin md { @media (min-width: $bp-md) { @content; } }
@mixin lg { @media (min-width: $bp-lg) { @content; } }
@mixin xl { @media (min-width: $bp-xl) { @content; } }

@mixin flex-center  { display:flex; align-items:center; justify-content:center; }
@mixin flex-between { display:flex; align-items:center; justify-content:space-between; }

@mixin truncate($lines: 1) {
  @if $lines == 1 {
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
  } @else {
    display:-webkit-box; -webkit-line-clamp:$lines;
    -webkit-box-orient:vertical; overflow:hidden;
  }
}

@mixin card {
  background:$color-white; border-radius:$radius-lg;
  box-shadow:$shadow-card; transition:box-shadow .2s, transform .2s;
  &:hover { box-shadow:$shadow-hover; transform:translateY(-2px); }
}
```

### Uso en un módulo de componente

```scss
// CarCard.module.scss
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.card   { @include card; overflow:hidden; }
.image  { width:100%; aspect-ratio:16/9; object-fit:cover; }
.body   { padding:$sp-md; }
.price  { color:$color-primary; font-size:$font-size-xl; font-weight:700; }
.meta   { @include flex-between; font-size:$font-size-sm; color:$color-gray-500; }
```

---

## 9. Seguridad Firebase

### Firestore Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /cars/{carId} {
      allow read:  if true;
      allow write: if request.auth != null;
    }
    match /contacts/{contactId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

### Storage Rules

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /cars/{imageFile} {
      allow read:  if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 10. Gestión de estado — cuándo usar qué

| Situación | Solución |
|---|---|
| Lista de coches, detalle de coche | Custom hook (`useCars`, `useCarDetail`) |
| Sesión del admin | `AuthContext` |
| Filtros activos en el catálogo | `useState` en `CatalogPage`, pasado a `useCars` |
| Estado de formulario | `useState` local en el componente |
| Cache / evitar refetch innecesario | No por ahora — añadir si aparece el problema real |

No introducir Redux, Zustand ni React Query hasta que el estado local + context
sea claramente insuficiente. Para este proyecto probablemente nunca haga falta.

---

## 11. Convenciones de código

- **Archivos**: PascalCase para componentes (`CarCard.jsx`), camelCase para el resto.
- **Exports**: `default` para componentes, named para hooks/services/utils/constants.
- **Comentarios**: solo para explicar el "por qué", nunca el "qué".
- **Sin `console.log`** en código que llega a producción.
- **Sin estilos inline** salvo casos muy puntuales y justificados.

---

## 12. Plan de refactorización paso a paso

### Antes de empezar

- Aseguraos de que todo el código actual funciona y está commiteado.
- Crear rama `refactor/arquitectura` en git. Hacer PR al terminar cada fase.
- Trabajar una fase cada vez. No mezclar fases en el mismo commit.

---

### FASE 1 — Configuración base (1-2h)
*Sin tocar ningún componente. Riesgo: ninguno.*

**Paso 1.1 — Instalar SCSS**
```bash
npm install -D sass
```

**Paso 1.2 — Alias `@` en Vite**
```js
// vite.config.js
import path from 'path'
resolve: { alias: { '@': path.resolve(__dirname, './src') } }
```
```json
// jsconfig.json
{ "compilerOptions": { "baseUrl": ".", "paths": { "@/*": ["src/*"] } } }
```

**Paso 1.3 — Crear carpetas vacías**
```bash
mkdir -p src/router
mkdir -p src/hooks
mkdir -p src/context
mkdir -p src/services
mkdir -p src/firebase
mkdir -p src/constants
mkdir -p src/utils
mkdir -p src/styles
mkdir -p src/components/layout
mkdir -p src/components/home
mkdir -p src/components/cars
mkdir -p src/components/ui
```

**Paso 1.4 — Crear archivos SCSS base**

Crear `src/styles/_variables.scss`, `_mixins.scss`, `_reset.scss` y `main.scss`
con el contenido de la sección 8 de este documento.

Añadir en `main.jsx`:
```js
import './styles/main.scss'
```

✅ **Verificar**: la app arranca igual que antes.

---

### FASE 2 — Constantes (1h)
*Solo crear archivos nuevos. Riesgo: ninguno.*

**Paso 2.1 — `constants/routes.js`**
```js
export const ROUTES = {
  HOME: '/', CATALOG: '/coches', CAR_DETAIL: '/coches/:id',
  CONTACT: '/contacto', ABOUT: '/nosotros',
  ADMIN_LOGIN: '/admin/login', ADMIN: '/admin',
}
```

**Paso 2.2 — `constants/car.js`**
```js
export const FUEL_TYPES = ['Gasolina','Diesel','Hibrido','Electrico','GLP']
export const BODY_TYPES  = ['Berlina','SUV','Familiar','Coupe','Cabrio','Monovolumen','Pickup']
export const TRANSMISSIONS = ['Manual','Automatico']
export const ENV_LABELS  = ['0','ECO','C','B']
```

**Paso 2.3 — `constants/ui.js`**
```js
export const CAR_LABELS = ['NOVEDAD','ECO','TOP VENTAS','OFERTA']
export const LABEL_COLORS = { NOVEDAD:'orange', ECO:'green', 'TOP VENTAS':'red', OFERTA:'orange' }
```

**Paso 2.4 — `utils/formatters.js`**
```js
export const formatPrice = (n) => `${n.toLocaleString('es-ES')} EUR`
export const formatKm    = (n) => `${n.toLocaleString('es-ES')} km`
export const formatYear  = (n) => String(n)
```

✅ **Verificar**: ningún cambio visual, solo archivos nuevos creados.

---

### FASE 3 — Firebase y Services (2-3h)
*Mover código existente sin cambiar lógica. Riesgo: bajo.*

**Paso 3.1 — `firebase/config.js`**

Aseguraos de que hay un único archivo de inicialización. Si tenéis la config
en varios sitios, consolidarla aquí. Exportar solo `db`, `auth`, `storage`.

```js
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const firebaseConfig = { /* vuestras credenciales */ }
const app = initializeApp(firebaseConfig)

export const db      = getFirestore(app)
export const auth    = getAuth(app)
export const storage = getStorage(app)
```

**Paso 3.2 — `services/carsService.js`**

Mover aquí toda la lógica de Firestore relacionada con coches. Las funciones
deben recibir datos planos y devolver Promises. Sin useState, sin useEffect.

**Paso 3.3 — `services/authService.js`**

Mover `login`, `logout`, `getCurrentUser`. Nada más.

**Paso 3.4 — `services/storageService.js`**

Mover `uploadCarImage`, `deleteCarImage`.

**Paso 3.5 — Eliminar `carsData.js`**

Si aún se usa en algún componente, reemplazar esa llamada por el service real
antes de borrar el archivo.

✅ **Verificar**: la app funciona igual. El catálogo carga coches. El admin puede
añadir y borrar. El login funciona.

---

### FASE 4 — Context y Hooks (2-3h)
*Extraer lógica de componentes/páginas. Riesgo: medio.*

**Paso 4.1 — `context/AuthContext.jsx`**

Si no existe ya, crear el Provider que escucha `onAuthStateChanged` y expone
`{ user, loading }`. Envolver `<App>` con él en `main.jsx`.

**Paso 4.2 — `hooks/useAuth.js`**
```js
import { useContext } from 'react'
import { AuthContext } from '@/context/AuthContext'
export const useAuth = () => useContext(AuthContext)
```

**Paso 4.3 — `hooks/useCars.js`**

Mover fuera de los componentes la lógica de:
```js
const [cars, setCars] = useState([])
const [loading, setLoading] = useState(true)
useEffect(() => { carsService.getCars(filters).then(...) }, [filters])
```

**Paso 4.4 — `hooks/useCarDetail.js`**

Igual que el anterior pero para un solo coche por `id`.

**Paso 4.5 — Actualizar páginas**

Sustituir en `CatalogPage`, `HomePage`, `CarDetailPage` la lógica interna por:
```js
const { cars, loading, error } = useCars(filters)
```

✅ **Verificar**: catálogo filtra bien, detalle de coche carga, admin funciona.

---

### FASE 5 — Router centralizado (1h)
*Mover las rutas a su propia carpeta. Riesgo: bajo.*

**Paso 5.1 — `router/AppRouter.jsx`**

Mover la definición de `<Routes>` desde `App.jsx` a `AppRouter.jsx`.
Usar `ROUTES` de constants. `App.jsx` queda en dos líneas:
```jsx
import AppRouter from '@/router/AppRouter'
export default function App() { return <AppRouter /> }
```

**Paso 5.2 — `router/PrivateRoute.jsx`**

Mover desde `components/` si ya existe. Si no:
```jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/constants/routes'

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? children : <Navigate to={ROUTES.ADMIN_LOGIN} replace />
}
```

**Paso 5.3 — Reemplazar strings de rutas**

Buscar en todo el proyecto `/coches`, `'/admin'`, `'/contacto'` etc. y
sustituirlos por `ROUTES.CATALOG`, `ROUTES.ADMIN`, etc.

✅ **Verificar**: navegación completa funciona, ruta admin protegida.

---

### FASE 6 — Reorganizar componentes (2-3h)
*La fase más mecánica. Mover archivos y actualizar imports. Riesgo: medio.*

**Orden sugerido:**
1. Crear subcarpeta con `index.js` para cada componente.
2. Mover el `.jsx` y `.css` a su subcarpeta.
3. Renombrar `.css` → `.scss`.
4. Actualizar el import en el archivo `.scss` para usar `@use`.
5. Actualizar el import en el componente padre.

Hacerlo componente a componente, verificando en el navegador tras cada uno.
No mover diez componentes de golpe.

**Prioridad de orden:**
1. Componentes `ui/` (Button, Badge, Spinner) — los más simples
2. Componentes `cars/` (CarCard, CarGrid, CarFilters)
3. Componentes `layout/` (Navbar, Footer)
4. Componentes `home/` (Hero, Features, FeaturedCars)

✅ **Verificar al terminar**: toda la app visual está igual. Ningún import roto.

---

### FASE 7 — Limpieza final (1h)

- Eliminar imports no usados en todas las páginas.
- Eliminar archivos que hayan quedado vacíos o duplicados.
- Revisar que ningún componente importa directamente de `firebase/` o `firestore`.
- Verificar las Firestore Rules y Storage Rules en la consola de Firebase.
- Confirmar que `carsData.js` (datos de ejemplo) está eliminado.
- Hacer un último repaso visual completo: home, catálogo, ficha, contacto, admin.

✅ **Verificar**: `npm run build` sin errores ni warnings críticos.

---

### Resumen de fases

| Fase | Qué se hace | Tiempo estimado | Riesgo |
|---|---|---|---|
| 1 — Config base | SCSS, alias @, carpetas | 1-2h | Ninguno |
| 2 — Constantes | routes, car, ui, formatters | 1h | Ninguno |
| 3 — Firebase + Services | Consolidar config, mover lógica Firebase | 2-3h | Bajo |
| 4 — Context + Hooks | Extraer fetching de componentes | 2-3h | Medio |
| 5 — Router | Centralizar rutas, ROUTES en vez de strings | 1h | Bajo |
| 6 — Componentes | Subcarpetas + renombrar a SCSS | 2-3h | Medio |
| 7 — Limpieza | Eliminar residuos, build limpio | 1h | Ninguno |
| **Total** | | **~11-16h** | |

---

## 13. Sobre la futura migración a AWS

**Respuesta corta**: si la arquitectura de servicios está bien hecha, la migración
es un trabajo de 1-2 semanas, no meses. Si está mal hecha, puede ser un infierno.

**Por qué es manejable con esta arquitectura:**

Toda la dependencia de Firebase vive en tres lugares:
- `firebase/config.js` — inicialización
- `services/*.js` — las llamadas reales
- `context/AuthContext.jsx` — escucha de sesión

El resto de la app (pages, components, hooks) no sabe que existe Firebase.
Solo sabe que `carsService.getCars()` devuelve una Promise con coches.

Cuando llegue el momento, la migración sería:
```
services/carsService.js     → llamadas a API Gateway / Lambda en vez de Firestore
services/authService.js     → Cognito en vez de Firebase Auth
services/storageService.js  → S3 en vez de Firebase Storage
firebase/config.js          → se elimina o queda vacío
context/AuthContext.jsx     → adaptar onAuthStateChanged a Cognito
```

Los componentes, hooks y páginas no se tocan.

**Equivalencias Firebase → AWS:**

| Firebase | AWS equivalente |
|---|---|
| Firestore | DynamoDB (o RDS si queréis SQL) |
| Firebase Auth | Cognito |
| Firebase Storage | S3 + CloudFront |
| Firebase Hosting | Amplify / CloudFront + S3 |
| Firebase Functions | Lambda + API Gateway |

**Cuándo tiene sentido migrar:**

Firebase es perfectamente válido para este proyecto y para los siguientes 5-10 clientes de coches. El momento para plantearse AWS es cuando necesitéis lógica de servidor compleja (procesamiento de imágenes, integraciones con ERPs del concesionario, búsquedas avanzadas con Elasticsearch) o cuando el coste de Firebase empiece a ser relevante por volumen de datos/lecturas.

Para un catálogo de segunda mano con 50-200 coches y tráfico moderado, Firebase en plan Spark (gratuito) o Blaze con gasto mínimo es más que suficiente durante años.

**Lo más importante**: no cambiéis de backend por razones técnicas abstractas. Cambiadlo cuando tengáis un problema concreto que Firebase no resuelve.

---

*Documento único de referencia — reemplaza versiones anteriores*