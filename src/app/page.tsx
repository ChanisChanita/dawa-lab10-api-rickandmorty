import Link from "next/link";
import { ROUTES } from "@/utils/constants";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white">
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-pulse">
              🛸 Rick & Morty 🛸
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Explora el multiverso y descubre todos los personajes de la serie
            </p>
            <p className="text-lg mb-12 opacity-80 max-w-2xl mx-auto">
              Una aplicación completa con rutas estáticas y dinámicas, búsqueda en tiempo real,
              y todas las técnicas de renderizado de Next.js.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link
              href={ROUTES.CHARACTERS}
              className="
                bg-white text-gray-900 px-8 py-4 rounded-full font-semibold text-lg
                hover:bg-gray-100 transition-all duration-300 hover:scale-105
                shadow-lg hover:shadow-xl
              "
            >
              Ver Todos los Personajes
            </Link>
            
            <Link
              href={ROUTES.SEARCH}
              className="
                border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg
                hover:bg-white hover:text-gray-900 transition-all duration-300 hover:scale-105
                shadow-lg hover:shadow-xl
              "
            >
              Buscar Personajes
            </Link>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Server-Side Rendering</h3>
              <p className="opacity-90">
                Lista de personajes con SSR y caché forzado para máximo rendimiento
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">Búsqueda en Tiempo Real</h3>
              <p className="opacity-90">
                Filtros por nombre, estado, tipo y género con Client-Side Rendering
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-semibold mb-2">Incremental Static Regeneration</h3>
              <p className="opacity-90">
                Páginas de detalle con ISR y revalidación cada 10 días
              </p>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mt-16 pt-16 border-t border-white/20">
            <h2 className="text-2xl font-semibold mb-8">Tecnologías Utilizadas</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                'Next.js 16', 'TypeScript', 'Tailwind CSS', 'Rick and Morty API',
                'SSR', 'SSG', 'ISR', 'CSR', 'Lazy Loading'
              ].map((tech) => (
                <span 
                  key={tech}
                  className="
                    bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm
                    border border-white/30 hover:bg-white/30 transition-colors
                  "
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
