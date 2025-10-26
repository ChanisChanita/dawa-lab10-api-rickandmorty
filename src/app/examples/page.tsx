import Link from 'next/link';
import { ROUTES } from '@/utils/constants';

export default function ExampleUrlsPage() {
  const examples = [
    {
      title: 'Rick Sanchez',
      byId: '/characters/1',
      byName: '/characters/name/rick-sanchez',
      description: 'El científico loco principal'
    },
    {
      title: 'Morty Smith',
      byId: '/characters/2',
      byName: '/characters/name/morty-smith',
      description: 'El nieto aventurero'
    },
    {
      title: 'Summer Smith',
      byId: '/characters/3',
      byName: '/characters/name/summer-smith',
      description: 'La hermana mayor'
    },
    {
      title: 'Beth Smith',
      byId: '/characters/4',
      byName: '/characters/name/beth-smith',
      description: 'La madre de la familia'
    },
    {
      title: 'Jerry Smith',
      byId: '/characters/5',
      byName: '/characters/name/jerry-smith',
      description: 'El padre de la familia'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          🔗 Ejemplos de URLs de Personajes
        </h1>

        <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
            📋 Dos formas de acceder a los personajes:
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Por ID (numérico):</h3>
              <code className="text-sm bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded block">
                /characters/[id]
              </code>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                Ejemplo: /characters/1
              </p>
            </div>
            <div>
              <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Por nombre (slug):</h3>
              <code className="text-sm bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded block">
                /characters/name/[slug]
              </code>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                Ejemplo: /characters/name/rick-sanchez
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {examples.map((example, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {example.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {example.description}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    🔢 Por ID:
                  </p>
                  <div className="flex items-center space-x-2">
                    <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm flex-1">
                      {example.byId}
                    </code>
                    <Link
                      href={example.byId}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      Visitar
                    </Link>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    📝 Por nombre:
                  </p>
                  <div className="flex items-center space-x-2">
                    <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm flex-1">
                      {example.byName}
                    </code>
                    <Link
                      href={example.byName}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                    >
                      Visitar
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            ⚙️ Características Técnicas:
          </h2>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li>• <strong>Ambas rutas usan ISR</strong> con revalidación cada 10 días</li>
            <li>• <strong>Rutas estáticas generadas</strong> para todos los personajes en build time</li>
            <li>• <strong>SEO optimizado</strong> con metadata dinámica para cada URL</li>
            <li>• <strong>Slugs automáticos:</strong> "Rick Sanchez" → "rick-sanchez"</li>
            <li>• <strong>Caracteres especiales manejados:</strong> "C-137 Rick" → "c-137-rick"</li>
            <li>• <strong>Fallback automático:</strong> Si no se encuentra por nombre, muestra 404</li>
          </ul>
        </div>

        <div className="mt-8 text-center">
          <Link
            href={ROUTES.CHARACTERS}
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            ← Volver a la lista de personajes
          </Link>
        </div>
      </div>
    </div>
  );
}