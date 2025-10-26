'use client';

import { useState, useEffect, useCallback } from 'react';
import { Metadata } from 'next';
import { Character, SearchFilters, CharacterStatus, CharacterGender } from '@/types/character';
import { RickAndMortyAPI } from '@/services/rickAndMortyApi';
import { CharacterGrid } from '@/components/CharacterGrid';
import { SearchBar } from '@/components/ui/SearchBar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { CHARACTER_STATUS, CHARACTER_GENDER } from '@/utils/constants';

/**
 * Página de búsqueda implementada con CSR (Client-Side Rendering)
 * - Búsqueda en tiempo real
 * - Filtros por nombre, estado, tipo y género
 * - Usa useState y useEffect
 * - No cache para datos siempre actualizados
 */
export default function SearchPage() {
  // Estados para los filtros
  const [filters, setFilters] = useState<SearchFilters>({
    name: '',
    status: '',
    type: '',
    gender: ''
  });

  // Estados para la UI
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  // Función para realizar la búsqueda
  const searchCharacters = useCallback(async (searchFilters: SearchFilters) => {
    // No buscar si todos los filtros están vacíos
    const hasFilters = Object.values(searchFilters).some(value => value.trim() !== '');
    if (!hasFilters) {
      setCharacters([]);
      setTotalResults(0);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const data = await RickAndMortyAPI.searchCharacters(searchFilters);
      setCharacters(data.results);
      setTotalResults(data.info.count);
    } catch (err) {
      setError('Error al buscar personajes. Intenta con otros términos.');
      setCharacters([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Efecto para búsqueda en tiempo real con debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchCharacters(filters);
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timeoutId);
  }, [filters, searchCharacters]);

  // Función para actualizar filtros
  const updateFilter = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Función para limpiar filtros
  const clearFilters = () => {
    setFilters({
      name: '',
      status: '',
      type: '',
      gender: ''
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Búsqueda de Personajes
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
          Encuentra personajes en tiempo real
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          🔍 Renderizado: <span className="font-semibold text-blue-600">CSR</span>
          • ⚡ Búsqueda: <span className="font-semibold text-green-600">Tiempo Real</span>
          • 🔄 Cache: <span className="font-semibold text-orange-600">Deshabilitado</span>
        </p>
      </div>

      {/* Filtros de búsqueda */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Filtros de Búsqueda
            </h2>
            <button
              onClick={clearFilters}
              className="
                px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300
                hover:text-gray-900 dark:hover:text-white transition-colors
                border border-gray-300 dark:border-gray-600 rounded-md
                hover:bg-gray-50 dark:hover:bg-gray-700
              "
            >
              Limpiar Filtros
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Búsqueda por nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre
              </label>
              <SearchBar
                value={filters.name || ''}
                onChange={(value) => updateFilter('name', value)}
                placeholder="Buscar por nombre..."
              />
            </div>

            {/* Filtro por estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Estado
              </label>
              <select
                value={filters.status || ''}
                onChange={(e) => updateFilter('status', e.target.value)}
                className="
                  w-full px-3 py-2 border border-gray-300 rounded-md
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  dark:bg-gray-700 dark:border-gray-600 dark:text-white
                  dark:focus:ring-blue-500 dark:focus:border-blue-500
                "
              >
                <option value="">Todos los estados</option>
                <option value={CHARACTER_STATUS.ALIVE}>Vivo</option>
                <option value={CHARACTER_STATUS.DEAD}>Muerto</option>
                <option value={CHARACTER_STATUS.UNKNOWN}>Desconocido</option>
              </select>
            </div>

            {/* Filtro por género */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Género
              </label>
              <select
                value={filters.gender || ''}
                onChange={(e) => updateFilter('gender', e.target.value)}
                className="
                  w-full px-3 py-2 border border-gray-300 rounded-md
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  dark:bg-gray-700 dark:border-gray-600 dark:text-white
                  dark:focus:ring-blue-500 dark:focus:border-blue-500
                "
              >
                <option value="">Todos los géneros</option>
                <option value={CHARACTER_GENDER.MALE}>Masculino</option>
                <option value={CHARACTER_GENDER.FEMALE}>Femenino</option>
                <option value={CHARACTER_GENDER.GENDERLESS}>Sin género</option>
                <option value={CHARACTER_GENDER.UNKNOWN}>Desconocido</option>
              </select>
            </div>

            {/* Búsqueda por tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo
              </label>
              <SearchBar
                value={filters.type || ''}
                onChange={(value) => updateFilter('type', value)}
                placeholder="Buscar por tipo..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Indicador de carga */}
      {loading && (
        <div className="text-center py-8">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Buscando en el multiverso...
          </p>
        </div>
      )}

      {/* Resultados */}
      {!loading && hasSearched && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Resultados de búsqueda
            </h3>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {totalResults > 0 ? `${totalResults} personajes encontrados` : 'Sin resultados'}
            </span>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">😵</div>
          <h3 className="text-xl font-semibold text-red-600 mb-2">
            {error}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Verifica tu conexión o intenta con otros filtros
          </p>
        </div>
      )}

      {/* Grid de personajes */}
      {!loading && !error && (
        <CharacterGrid characters={characters} />
      )}

      {/* Estado inicial */}
      {!loading && !hasSearched && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Comienza tu búsqueda
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Usa los filtros de arriba para encontrar personajes específicos
          </p>
        </div>
      )}

      {/* Info sobre CSR */}
      <div className="mt-12 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
        <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
          🔍 Optimización CSR (Client-Side Rendering)
        </h3>
        <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
          <li>• <strong>Búsqueda en tiempo real:</strong> Los resultados se actualizan automáticamente</li>
          <li>• <strong>Debounce:</strong> Optimización para evitar requests excesivos (500ms)</li>
          <li>• <strong>useState & useEffect:</strong> Manejo de estado del lado del cliente</li>
          <li>• <strong>Sin cache:</strong> Datos siempre actualizados desde la API</li>
          <li>• <strong>Filtros múltiples:</strong> Combinación de nombre, estado, tipo y género</li>
        </ul>
      </div>
    </div>
  );
}