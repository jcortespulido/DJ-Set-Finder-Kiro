import { useState } from 'react';
import { SetBrowser } from '../components/SetBrowser';
import { useSets } from '../hooks/useSets';
import { LayoutGridIcon } from '../components/icons';

interface ExploreViewProps {
  onSelectSet: (setId: string) => void;
}

export function ExploreView({ onSelectSet }: ExploreViewProps) {
  const { sets, isLoading, error } = useSets();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            Explorar Sets
          </h1>
          <p className="text-sm sm:text-base text-gray-400">
            Descubre todos los sets disponibles en la colección.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-[#1a1a2e] border border-gray-700 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center ${
              viewMode === 'grid'
                ? 'bg-cyan-500/20 text-cyan-400'
                : 'text-gray-400 hover:text-cyan-400'
            }`}
            title="Vista de cuadrícula"
          >
            <LayoutGridIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center ${
              viewMode === 'table'
                ? 'bg-cyan-500/20 text-cyan-400'
                : 'text-gray-400 hover:text-cyan-400'
            }`}
            title="Vista de tabla"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="divider-neon" />

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Sets Browser */}
      <SetBrowser
        mode="explore"
        sets={sets}
        isLoading={isLoading}
        onSelectSet={onSelectSet}
        showAsTable={viewMode === 'table'}
      />
    </div>
  );
}
