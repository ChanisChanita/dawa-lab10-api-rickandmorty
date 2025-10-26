import { Character, CharacterResponse, SearchFilters } from '@/types/character';

const BASE_URL = 'https://rickandmortyapi.com/api';

export class RickAndMortyAPI {
  /**
   * Obtiene todos los personajes con caché forzado (SSG)
   */
  static async getAllCharacters(): Promise<CharacterResponse> {
    try {
      const response = await fetch(`${BASE_URL}/character`, {
        // Forzar caché para SSG
        cache: 'force-cache'
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching all characters:', error);
      throw error;
    }
  }

  /**
   * Obtiene un personaje por ID con revalidación cada 10 días (ISR)
   */
  static async getCharacterById(id: string): Promise<Character> {
    try {
      const response = await fetch(`${BASE_URL}/character/${id}`, {
        // Revalidación cada 10 días (864000 segundos)
        next: { revalidate: 864000 }
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching character ${id}:`, error);
      throw error;
    }
  }

  /**
   * Busca personajes por filtros (CSR)
   */
  static async searchCharacters(filters: SearchFilters): Promise<CharacterResponse> {
    try {
      const params = new URLSearchParams();
      
      if (filters.name) params.append('name', filters.name);
      if (filters.status) params.append('status', filters.status);
      if (filters.type) params.append('type', filters.type);
      if (filters.gender) params.append('gender', filters.gender);

      const response = await fetch(`${BASE_URL}/character?${params.toString()}`, {
        // No cache para CSR
        cache: 'no-store'
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return {
            info: { count: 0, pages: 0, next: null, prev: null },
            results: []
          };
        }
        throw new Error(`Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error searching characters:', error);
      throw error;
    }
  }

  /**
   * Obtiene múltiples personajes por IDs
   */
  static async getCharactersByIds(ids: number[]): Promise<Character[]> {
    try {
      const idsString = ids.join(',');
      const response = await fetch(`${BASE_URL}/character/${idsString}`, {
        next: { revalidate: 864000 }
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      // Si es un solo personaje, lo devolvemos como array
      return Array.isArray(data) ? data : [data];
    } catch (error) {
      console.error('Error fetching characters by IDs:', error);
      throw error;
    }
  }

  /**
   * Obtiene un personaje por nombre exacto
   */
  static async getCharacterByName(name: string): Promise<Character | null> {
    try {
      const response = await fetch(`${BASE_URL}/character/?name=${encodeURIComponent(name)}`, {
        next: { revalidate: 864000 }
      });
      
      if (!response.ok) {
        return null;
      }
      
      const data: CharacterResponse = await response.json();
      return data.results.length > 0 ? data.results[0] : null;
    } catch (error) {
      console.error(`Error fetching character by name ${name}:`, error);
      return null;
    }
  }

  /**
   * Obtiene el total de personajes para generateStaticParams
   */
  static async getTotalCharacters(): Promise<number> {
    try {
      const response = await fetch(`${BASE_URL}/character`, {
        cache: 'force-cache'
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data: CharacterResponse = await response.json();
      return data.info.count;
    } catch (error) {
      console.error('Error fetching total characters:', error);
      return 826; // Valor por defecto conocido
    }
  }

  /**
   * Obtiene todos los nombres de personajes para rutas estáticas
   */
  static async getAllCharacterNames(): Promise<string[]> {
    try {
      const names: string[] = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const response = await fetch(`${BASE_URL}/character?page=${page}`, {
          cache: 'force-cache'
        });
        
        if (!response.ok) break;
        
        const data: CharacterResponse = await response.json();
        names.push(...data.results.map(char => this.slugify(char.name)));
        
        hasMore = !!data.info.next;
        page++;
      }
      
      return names;
    } catch (error) {
      console.error('Error fetching character names:', error);
      return [];
    }
  }

  /**
   * Convierte un nombre a slug URL-friendly
   */
  static slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remover caracteres especiales
      .replace(/[\s_-]+/g, '-') // Reemplazar espacios y guiones con un solo guión
      .replace(/^-+|-+$/g, ''); // Remover guiones al inicio y final
  }

  /**
   * Convierte un slug de vuelta a nombre para búsqueda
   */
  static unslugify(slug: string): string {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}