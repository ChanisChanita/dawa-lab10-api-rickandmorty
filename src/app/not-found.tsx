import Link from 'next/link';
import { ROUTES } from '@/utils/constants';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-lg mx-auto text-center">
        <div className="mb-8">
          <div className="text-8xl mb-4">🛸</div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            404 - Portal Perdido
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Parece que este personaje se perdió en el multiverso...
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href={ROUTES.CHARACTERS}
            className="
              inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium
              hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 
              focus:ring-blue-500 focus:ring-offset-2
            "
          >
            Ver Todos los Personajes
          </Link>
          
          <div className="text-center">
            <Link
              href={ROUTES.HOME}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>

        <div className="mt-12 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            💡 <strong>Tip:</strong> Si buscas un personaje específico, 
            usa la <Link href={ROUTES.SEARCH} className="underline">página de búsqueda</Link>
          </p>
        </div>
      </div>
    </div>
  );
}