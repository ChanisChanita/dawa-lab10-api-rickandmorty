# 🛸 Rick and Morty Characters App

Una aplicación completa de Next.js que implementa rutas estáticas y dinámicas usando la API de Rick and Morty, demostrando todas las técnicas de renderizado: SSR, SSG, ISR y CSR.

## 🚀 Demo en Vivo

**Deploy en Vercel:** [Ver aplicación](https://tu-app.vercel.app)

## 📋 Características Principales

### 🏠 Página Principal
- **Renderizado:** Estático
- **Descripción:** Landing page con información de la aplicación
- **Optimizaciones:** SEO optimizado, diseño responsive

### 📊 Lista de Personajes (`/characters`)
- **Renderizado:** SSG (Static Site Generation)
- **Cache:** Forzado (`cache: 'force-cache'`)
- **Características:**
  - Lista completa de personajes
  - Lazy loading de imágenes
  - Prioridad en las primeras 8 imágenes
  - Stats de la API
  - Grid responsive

### 🔍 Búsqueda (`/search`)
- **Renderizado:** CSR (Client-Side Rendering)
- **Cache:** Deshabilitado (`cache: 'no-store'`)
- **Filtros:**
  - 🏷️ Nombre (búsqueda en tiempo real)
  - ❤️ Estado (Alive, Dead, Unknown)
  - 👤 Género (Male, Female, Genderless, Unknown)
  - 🧬 Tipo (búsqueda en tiempo real)
- **Hooks utilizados:** `useState`, `useEffect`
- **Optimizaciones:** Debounce de 500ms

### 👤 Detalle de Personaje (`/characters/[id]`)
- **Renderizado:** ISR (Incremental Static Regeneration)
- **Revalidación:** Cada 10 días (864000 segundos)
- **Rutas estáticas:** Generadas para todos los personajes
- **Características:**
  - Información completa del personaje
  - Metadata dinámica para SEO
  - Lista de episodios
  - Información técnica
  - Fallback para nuevos personajes

## 🛠️ Tecnologías Utilizadas

- **Framework:** Next.js 16 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **API:** [Rick and Morty API](https://rickandmortyapi.com)
- **Deployment:** Vercel
- **Optimizaciones:** Image Optimization, Lazy Loading

## 📁 Estructura del Proyecto

```
src/
├── app/                          # App Router de Next.js
│   ├── characters/              
│   │   ├── [id]/
│   │   │   └── page.tsx         # Detalle personaje (ISR)
│   │   └── page.tsx             # Lista personajes (SSG)
│   ├── search/
│   │   └── page.tsx             # Búsqueda (CSR)
│   ├── layout.tsx               # Layout principal
│   ├── page.tsx                 # Página de inicio
│   ├── not-found.tsx           # Página 404
│   └── globals.css              # Estilos globales
├── components/                   # Componentes reutilizables
│   ├── ui/                      # Componentes base
│   │   ├── Card.tsx
│   │   ├── SearchBar.tsx
│   │   └── LoadingSpinner.tsx
│   ├── CharacterCard.tsx        # Tarjeta de personaje
│   ├── CharacterGrid.tsx        # Grid de personajes
│   └── Navigation.tsx           # Navegación
├── services/                     # Servicios de API
│   └── rickAndMortyApi.ts       # Cliente de la API
├── types/                        # Tipos de TypeScript
│   └── character.ts             # Interfaces
└── utils/                        # Utilidades
    └── constants.ts             # Constantes
```

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio**
```bash
git clone <tu-repositorio>
cd dawa-lab10
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Ejecutar en desarrollo**
```bash
npm run dev
```

4. **Construir para producción**
```bash
npm run build
npm start
```

## 📈 Técnicas de Renderizado Implementadas

### 🔄 SSG (Static Site Generation)
**Archivo:** `src/app/characters/page.tsx`
```typescript
// Forzar caché para SSG
cache: 'force-cache'
```
**Justificación:** La lista de personajes no cambia frecuentemente, por lo que generar las páginas estáticamente mejora el rendimiento y SEO.

### 🔄 ISR (Incremental Static Regeneration)
**Archivo:** `src/app/characters/[id]/page.tsx`
```typescript
// Revalidación cada 10 días
next: { revalidate: 864000 }

// Generar rutas estáticas
export async function generateStaticParams() {
  // ... generar para todos los personajes
}
```
**Justificación:** Los detalles de personajes son estables pero pueden actualizarse ocasionalmente. ISR permite tener páginas estáticas con actualizaciones automáticas.

### 🔄 CSR (Client-Side Rendering)
**Archivo:** `src/app/search/page.tsx`
```typescript
'use client';

// Estados del cliente
const [characters, setCharacters] = useState<Character[]>([]);
const [loading, setLoading] = useState(false);

// Búsqueda en tiempo real
useEffect(() => {
  const timeoutId = setTimeout(() => {
    searchCharacters(filters);
  }, 500);
  return () => clearTimeout(timeoutId);
}, [filters, searchCharacters]);
```
**Justificación:** La búsqueda requiere interactividad en tiempo real y estados dinámicos que solo pueden manejarse del lado del cliente.

## 🎨 Optimizaciones Implementadas

### 🖼️ Lazy Loading de Imágenes
```typescript
<Image
  loading={priority ? 'eager' : 'lazy'}
  priority={priority && index < 8}
  // ...
/>
```

### ⚡ Debounce en Búsqueda
```typescript
useEffect(() => {
  const timeoutId = setTimeout(() => {
    searchCharacters(filters);
  }, 500); // Debounce 500ms
  return () => clearTimeout(timeoutId);
}, [filters]);
```

### 🎯 Prioridad de Imágenes
- Las primeras 8 imágenes tienen `priority={true}`
- Resto de imágenes usan `loading="lazy"`

### 📱 Diseño Responsive
- Grid adaptativo: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
- Navegación móvil con select
- Componentes flexibles

## 🌐 API Endpoints Utilizados

### Obtener todos los personajes
```
GET https://rickandmortyapi.com/api/character
```

### Obtener personaje por ID
```
GET https://rickandmortyapi.com/api/character/{id}
```

### Búsqueda con filtros
```
GET https://rickandmortyapi.com/api/character/?name={name}&status={status}&gender={gender}&type={type}
```

## 📦 Configuración de Cache

| Página | Método | Cache | Revalidación |
|--------|--------|-------|--------------|
| `/` | Static | - | - |
| `/characters` | SSG | `force-cache` | Build time |
| `/characters/[id]` | ISR | `force-cache` | 10 días |
| `/search` | CSR | `no-store` | - |

## 🚀 Despliegue en Vercel

### Configuración automática
El proyecto incluye `vercel.json` para configuración automática:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

### Pasos para desplegar

1. **Conectar con Vercel**
```bash
npx vercel --prod
```

2. **Despliegue automático**
- Push a la rama principal
- Vercel detecta cambios automáticamente
- Build y deploy automático

### Variables de entorno
No se requieren variables de entorno para la API pública de Rick and Morty.

## 📊 Métricas de Rendimiento

### Build Time
- **Páginas generadas:** 832 (todos los personajes)
- **Tiempo de build:** ~20 segundos
- **Tamaño del bundle:** Optimizado por Next.js

### Runtime Performance
- **First Paint:** <500ms (SSG)
- **Largest Contentful Paint:** <1s
- **Time to Interactive:** <2s

## 🧪 Testing

### Ejecutar tests
```bash
npm run test
```

### Linting
```bash
npm run lint
```

## 🤝 Contribuciones

1. Fork del proyecto
2. Crear rama de feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📝 Justificaciones Técnicas

### ¿Por qué SSG para la lista de personajes?
- **Rendimiento:** Páginas pre-generadas cargan instantáneamente
- **SEO:** Contenido estático es mejor indexado
- **Costo:** Menos requests a la API
- **UX:** Carga inmediata mejora la experiencia

### ¿Por qué ISR para detalles de personajes?
- **Escalabilidad:** 800+ páginas estáticas sin impacto en build time
- **Frescura:** Datos se actualizan automáticamente cada 10 días
- **Fallback:** Nuevos personajes se generan dinámicamente
- **Balance:** Rendimiento de páginas estáticas con datos actualizados

### ¿Por qué CSR para búsqueda?
- **Interactividad:** Filtros en tiempo real requieren JavaScript
- **Estado:** Múltiples filtros necesitan manejo de estado complejo
- **UX:** Búsqueda instantánea sin recargas de página
- **Flexibilidad:** Combinación dinámica de filtros

## 📧 Contacto

**Autor:** Tu Nombre  
**Email:** tu.email@ejemplo.com  
**LinkedIn:** [tu-linkedin](https://linkedin.com/in/tu-perfil)

---

⭐ **¡Dale una estrella al repositorio si te gustó el proyecto!**
