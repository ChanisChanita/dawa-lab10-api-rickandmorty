import { Metadata } from 'next';
import { RickAndMortyAPI } from '@/services/rickAndMortyApi';
import { CharacterGrid } from '@/components/CharacterGrid';

export const metadata: Metadata = {
  title: 'Personajes',
  description: 'Lista completa de personajes de Rick and Morty con Server-Side Generation',
};

/**
 * Página de lista de personajes implementada con SSG (Static Site Generation)
 * - Usa cache: 'force-cache' para forzar el caché
 * - Los datos se generan en build time
 * - Mejora el rendimiento y SEO
 */
export default async function CharactersPage() {
  try {
    const data = await RickAndMortyAPI.getAllCharacters();

    return (
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Personajes de Rick & Morty
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
            Explora todos los personajes del multiverso
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            📊 Renderizado: <span className="font-semibold text-blue-600">SSG</span> 
            • ⚡ Caché: <span className="font-semibold text-green-600">Forzado</span>
            • 📈 Total: <span className="font-semibold">{data.info.count} personajes</span>
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-blue-600">{data.info.count}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-green-600">{data.results.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Mostrados</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-purple-600">{data.info.pages}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Páginas</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-orange-600">SSG</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Método</div>
          </div>
        </div>

        {/* Characters Grid */}
        <CharacterGrid characters={data.results} priority />

        {/* Info Footer */}
        <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            ⚡ Optimización SSG (Static Site Generation)
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• <strong>Cache forzado:</strong> Los datos se obtienen en build time</li>
            <li>• <strong>Lazy loading:</strong> Las imágenes se cargan bajo demanda</li>
            <li>• <strong>Prioridad:</strong> Las primeras 8 imágenes tienen prioridad de carga</li>
            <li>• <strong>SEO optimizado:</strong> Contenido pre-renderizado para mejor indexación</li>
          </ul>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-6xl mb-4">😵</div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Error al cargar personajes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            No se pudieron obtener los datos de la API
          </p>
        </div>
      </div>
    );
  }
}