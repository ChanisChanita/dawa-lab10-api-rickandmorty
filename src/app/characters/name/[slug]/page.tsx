import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { RickAndMortyAPI } from '@/services/rickAndMortyApi';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { STATUS_COLORS, GENDER_ICONS, ROUTES } from '@/utils/constants';

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * Genera rutas estáticas para todos los nombres de personajes
 */
export async function generateStaticParams() {
  try {
    const characterNames = await RickAndMortyAPI.getAllCharacterNames();
    
    return characterNames.map((name) => ({
      slug: name,
    }));
  } catch (error) {
    console.error('Error generating static params for names:', error);
    return [];
  }
}

/**
 * Genera metadata dinámica para SEO
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const searchName = RickAndMortyAPI.unslugify(slug);
    const character = await RickAndMortyAPI.getCharacterByName(searchName);
    
    if (!character) {
      return {
        title: 'Personaje no encontrado',
        description: 'El personaje solicitado no existe',
      };
    }
    
    return {
      title: `${character.name} - Rick and Morty`,
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
 * Página de detalle de personaje por nombre (ISR)
 * URL: /characters/name/rick-sanchez
 */
export default async function CharacterByNamePage({ params }: Props) {
  try {
    const { slug } = await params;
    const searchName = RickAndMortyAPI.unslugify(slug);
    const character = await RickAndMortyAPI.getCharacterByName(searchName);

    if (!character) {
      notFound();
    }

    return (
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm space-x-2">
          <Link 
            href={ROUTES.CHARACTERS}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
          >
            ← Personajes
          </Link>
          <span className="text-gray-500">/</span>
          <span className="text-gray-600 dark:text-gray-400">Búsqueda por nombre</span>
          <span className="text-gray-500">/</span>
          <span className="font-medium text-gray-900 dark:text-white">{character.name}</span>
        </nav>

        {/* Alert de búsqueda por nombre */}
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-2">
            <span className="text-blue-600 dark:text-blue-400">🔍</span>
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Búsqueda por nombre: <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">{searchName}</code>
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                URL amigable: /characters/name/{slug}
              </p>
            </div>
          </div>
        </div>

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

                {/* Enlaces alternativos */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Enlaces alternativos:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={ROUTES.CHARACTER_DETAIL(character.id)}
                      className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      Por ID: /characters/{character.id}
                    </Link>
                    <span className="text-xs bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">
                      Por nombre: /characters/name/{slug}
                    </span>
                  </div>
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

          {/* Info sobre búsqueda por nombre */}
          <div className="mt-8 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
              🔗 Búsqueda por Nombre (ISR)
            </h3>
            <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
              <li>• <strong>URL amigable:</strong> /characters/name/{slug}</li>
              <li>• <strong>Slug generado:</strong> "{searchName}" → "{slug}"</li>
              <li>• <strong>Rutas estáticas:</strong> Generadas para todos los nombres</li>
              <li>• <strong>SEO optimizado:</strong> URLs legibles y descriptivas</li>
              <li>• <strong>Revalidación:</strong> Cada 10 días como las páginas por ID</li>
            </ul>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading character by name:', error);
    notFound();
  }
}