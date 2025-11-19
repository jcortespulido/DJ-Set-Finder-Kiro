import { useMemo, useState } from 'react';
import type { SetData } from '../types';
import { SetCard } from './SetCard';
import { SetTable } from './SetTable';
import { LoadingSpinner } from './LoadingSpinner';
import { SearchIcon } from './icons';

interface SetBrowserProps {
  mode: 'home' | 'explore';
  sets: SetData[];
  isLoading: boolean;
  onSelectSet: (setId: string) => void;
  showAsTable?: boolean;
}

export function SetBrowser({ 
  mode, 
  sets, 
  isLoading, 
  onSelectSet,
  showAsTable = false 
}: SetBrowserProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrar sets por búsqueda (solo en modo explore)
  const filteredSets = useMemo(() => {
    if (mode === 'home' || !searchQuery.trim()) {
      return sets;
    }

    const query = searchQuery.toLowerCase();
    return sets.filter((set) => {
      return (
        set.artist.toLowerCase().includes(query) ||
        set.event.toLowerCase().includes(query) ||
        set.location?.toLowerCase().includes(query) ||
        set.date.toLowerCase().includes(query)
      );
    });
  }, [mode, sets, searchQuery]);

  // En modo home, mostrar solo los últimos 4 sets
  const displayedSets = useMemo(() => {
    if (mode === 'home') {
      return filteredSets.slice(0, 4);
    }
    return filteredSets;
  }, [mode, filteredSets]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Mensaje cuando no hay resultados
  const noResultsMessage = searchQuery.trim() 
    ? 'No se encontraron sets que coincidan con tu búsqueda.'
    : 'No hay sets disponibles en este momento.';

  if (displayedSets.length === 0 && !isLoading) {
    return (
      <div>
        {/* Search Bar (solo en modo explore) */}
        {mode === 'explore' && (
          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por artista, evento, lugar o fecha..."
                className="w-full pl-12 pr-4 py-3 bg-[#1a1a2e] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors text-base"
                style={{ fontSize: '16px' }}
              />
            </div>
          </div>
        )}

        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">{noResultsMessage}</p>
          {!searchQuery.trim() && (
            <p className="text-gray-500 text-sm mt-2">
              Los sets aparecerán aquí cuando se agreguen a la base de datos.
            </p>
          )}
          {searchQuery.trim() && (
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 btn-neon"
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Search Bar (solo en modo explore) */}
      {mode === 'explore' && (
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por artista, evento, lugar o fecha..."
              className="w-full pl-12 pr-4 py-3 bg-[#1a1a2e] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>
          {searchQuery.trim() && (
            <p className="text-center text-sm text-gray-400 mt-2">
              Mostrando {displayedSets.length} resultado{displayedSets.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      )}

      {/* Grid de tarjetas o Tabla */}
      {showAsTable ? (
        <SetTable sets={displayedSets} onSelectSet={onSelectSet} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayedSets.map((set) => (
            <SetCard key={set.id} set={set} onClick={onSelectSet} />
          ))}
        </div>
      )}

      {/* Mensaje en modo home */}
      {mode === 'home' && sets.length > 4 && (
        <div className="text-center mt-8">
          <p className="text-gray-400">
            Mostrando {displayedSets.length} de {sets.length} sets.{' '}
            <span className="text-cyan-400">
              Ve a "Explorar" para ver todos.
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
