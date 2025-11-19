import type { SetData } from '../types';

interface SetTableProps {
  sets: SetData[];
  onSelectSet: (setId: string) => void;
}

export function SetTable({ sets, onSelectSet }: SetTableProps) {
  const handleRowClick = (setId: string | undefined) => {
    if (setId) {
      onSelectSet(setId);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="table-header">
          <tr>
            <th className="table-cell text-left">Artista</th>
            <th className="table-cell text-left">Evento</th>
            <th className="table-cell text-left hidden md:table-cell">Fecha</th>
            <th className="table-cell text-left hidden md:table-cell">Lugar</th>
          </tr>
        </thead>
        <tbody>
          {sets.map((set) => (
            <tr
              key={set.id}
              onClick={() => handleRowClick(set.id)}
              className="table-row cursor-pointer"
            >
              <td className="table-cell">
                <span
                  className="font-semibold"
                  style={{ color: set.theme.primary }}
                >
                  {set.artist}
                </span>
              </td>
              <td className="table-cell text-gray-300">{set.event}</td>
              <td className="table-cell text-gray-400 hidden md:table-cell">
                {set.date}
              </td>
              <td className="table-cell text-gray-400 hidden md:table-cell">
                {set.location || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
