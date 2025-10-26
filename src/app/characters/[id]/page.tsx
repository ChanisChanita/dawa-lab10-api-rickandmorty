import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { RickAndMortyAPI } from '@/services/rickAndMortyApi';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { STATUS_COLORS, GENDER_ICONS, ROUTES } from '@/utils/constants';

interface Props {
  params: Promise<{ id: string }>;
}

/**
 * Genera rutas estáticas para todos los personajes
 * Se ejecuta en build time para crear las páginas estáticas
 */
export async function generateStaticParams() {
  try {
    const totalCharacters = await RickAndMortyAPI.getTotalCharacters();
    
    // Generamos parámetros para todos los personajes conocidos
    const params = [];
    for (let i = 1; i <= totalCharacters; i++) {
      params.push({ id: i.toString() });
    }
    
    return params;
  } catch (error) {
    console.error('Error generating static params:', error);
    // Fallback: generar al menos las primeras páginas
    return Array.from({ length: 826 }, (_, i) => ({ id: (i + 1).toString() }));
  }
}

/**
 * Genera metadata dinámica para SEO
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params;
    const character = await RickAndMortyAPI.getCharacterById(id);
    
    return {
      title: character.name,
      description: `Conoce a ${character.name}, ${character.species} de ${character.origin.name}. Estado: ${character.status}`,
      openGraph: {
        title: character.name,
        description: `${character.species} - ${character.status}`,
        images: [{ url: character.image, alt: character.name }],
      },
    };
  } catch {
    return {
      title: 'Personaje no encontrado',
      description: 'El personaje solicitado no existe',
    };
  }
}

/**
 * Página de detalle de personaje implementada con ISR (Incremental Static Regeneration)
 * - Revalidación cada 10 días (864000 segundos)
 * - Rutas generadas estáticamente para todos los personajes
 * - Fallback para personajes nuevos
 */
export default async function CharacterDetailPage({ params }: Props) {
  try {
    const { id } = await params;
    const character = await RickAndMortyAPI.getCharacterById(id);

    return (
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <Link 
            href={ROUTES.CHARACTERS}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
          >
            ← Volver a personajes
          </Link>
        </nav>

        <div className="max-w-4xl mx-auto">
          {/* Header con imagen y info básica */}
          <Card className="mb-8 overflow-hidden">
            <div className="md:flex">
              {/* Imagen */}
              <div className="md:w-1/3">
                <div className="relative aspect-square">
                  <Image
                    src={character.image}
                    alt={character.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
              
              {/* Info principal */}
              <div className="md:w-2/3 p-6">
                <div className="flex items-start justify-between mb-4">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                    {character.name}
                  </h1>
                  <span 
                    className={`
                      inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white
                      ${STATUS_COLORS[character.status]}
                    `}
                  >
                    {character.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Especie:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {character.species}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Género:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white flex items-center">
                      {GENDER_ICONS[character.gender]} {character.gender}
                    </span>
                  </div>
                  
                  {character.type && (
                    <div className="md:col-span-2">
                      <span className="text-gray-600 dark:text-gray-400">Tipo:</span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">
                        {character.type}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Información detallada */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Origen */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  🌍 Origen
                </h2>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {character.origin.name}
                </p>
                {character.origin.url && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Dimensión de origen
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Ubicación actual */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  📍 Ubicación Actual
                </h2>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {character.location.name}
                </p>
                {character.location.url && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Última ubicación conocida
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Episodios */}
          <Card className="mb-8">
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                📺 Episodios ({character.episode.length})
              </h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {character.episode.map((episodeUrl, index) => {
                  const episodeNumber = episodeUrl.split('/').pop();
                  return (
                    <div
                      key={index}
                      className="
                        bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded text-center
                        text-sm font-medium text-gray-900 dark:text-white
                      "
                    >
                      E{episodeNumber}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Información técnica */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                ⚙️ Información Técnica
              </h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">ID:</span>
                  <span className="ml-2 font-mono text-gray-900 dark:text-white">
                    {character.id}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Creado:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">
                    {new Date(character.created).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-gray-600 dark:text-gray-400">URL API:</span>
                  <span className="ml-2 font-mono text-xs text-gray-900 dark:text-white break-all">
                    {character.url}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info sobre ISR */}
          <div className="mt-8 p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">
              🔄 Optimización ISR (Incremental Static Regeneration)
            </h3>
            <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
              <li>• <strong>Revalidación:</strong> Los datos se actualizan cada 10 días</li>
              <li>• <strong>Rutas estáticas:</strong> Generadas para todos los personajes en build time</li>
              <li>• <strong>Fallback:</strong> Soporte para nuevos personajes dinámicamente</li>
              <li>• <strong>SEO optimizado:</strong> Metadata dinámica para cada personaje</li>
            </ul>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading character:', error);
    notFound();
  }
}