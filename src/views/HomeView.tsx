import { SetBrowser } from '../components/SetBrowser';
import { useSets } from '../hooks/useSets';

interface HomeViewProps {
  onSelectSet: (setId: string) => void;
}

export function HomeView({ onSelectSet }: HomeViewProps) {
  const { sets, isLoading, error } = useSets();

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black neon-accent-cyan animate-pulse-neon">
          SET FINDER
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto px-4">
          Explora, analiza y descubre tracklists de sets de DJ de todo el mundo.
          Encuentra tu próximo set favorito.
        </p>
      </div>

      {/* Divider */}
      <div className="divider-neon" />

      {/* Latest Sets Section */}
      <div className="space-y-6 px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
            Últimos Sets Añadidos
          </h2>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Sets Grid */}
        <SetBrowser
          mode="home"
          sets={sets}
          isLoading={isLoading}
          onSelectSet={onSelectSet}
        />
      </div>
    </div>
  );
}
