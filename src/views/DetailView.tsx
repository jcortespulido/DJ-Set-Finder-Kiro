import { TracklistDetail } from '../components/TracklistDetail';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useSetDetail } from '../hooks/useSetDetail';

interface DetailViewProps {
  setId: string;
  onBack: () => void;
}

export function DetailView({ setId, onBack }: DetailViewProps) {
  const { set, isLoading, error } = useSetDetail(setId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !set) {
    return (
      <div className="text-center py-20">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-red-400 text-lg mb-4">
            {error || 'Set no encontrado'}
          </p>
          <button onClick={onBack} className="btn-neon">
            Volver
          </button>
        </div>
      </div>
    );
  }

  return <TracklistDetail set={set} onBack={onBack} />;
}
