'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Character } from '@/types/character';
import { Card, CardContent } from '@/components/ui/Card';
import { STATUS_COLORS, GENDER_ICONS, ROUTES } from '@/utils/constants';
import { useState } from 'react';

interface CharacterCardProps {
  character: Character;
  priority?: boolean;
}

export function CharacterCard({ character, priority = false }: CharacterCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Link href={ROUTES.CHARACTER_DETAIL(character.id)}>
      <Card hover className="overflow-hidden h-full">
        <div className="relative aspect-square bg-gray-200 dark:bg-gray-700">
          {/* Placeholder mientras carga la imagen */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
            </div>
          )}
          
          <Image
            src={character.image}
            alt={character.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`
              object-cover transition-opacity duration-300
              ${imageLoaded ? 'opacity-100' : 'opacity-0'}
            `}
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Badge de estado */}
          <div className="absolute top-2 right-2">
            <span 
              className={`
                inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white
                ${STATUS_COLORS[character.status]}
              `}
            >
              {character.status}
            </span>
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-1">
            {character.name}
          </h3>
          
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center justify-between">
              <span>Especie:</span>
              <span className="font-medium">{character.species}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Género:</span>
              <span className="flex items-center space-x-1">
                <span>{GENDER_ICONS[character.gender]}</span>
                <span className="font-medium">{character.gender}</span>
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Origen:</span>
              <span className="font-medium line-clamp-1" title={character.origin.name}>
                {character.origin.name}
              </span>
            </div>
            
            {character.type && (
              <div className="flex items-center justify-between">
                <span>Tipo:</span>
                <span className="font-medium line-clamp-1" title={character.type}>
                  {character.type}
                </span>
              </div>
            )}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Episodios: {character.episode.length}
              </p>
              <div className="flex space-x-1">
                <Link
                  href={ROUTES.CHARACTER_BY_NAME(character.name)}
                  className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  Por nombre
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}