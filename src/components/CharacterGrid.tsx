import { Character } from '@/types/character';
import { CharacterCard } from './CharacterCard';

interface CharacterGridProps {
  characters: Character[];
  priority?: boolean;
}

export function CharacterGrid({ characters, priority = false }: CharacterGridProps) {
  if (characters.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No se encontraron personajes
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Intenta con otros términos de búsqueda
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {characters.map((character, index) => (
        <CharacterCard
          key={character.id}
          character={character}
          priority={priority && index < 8} // Prioridad para las primeras 8 imágenes
        />
      ))}
    </div>
  );
}