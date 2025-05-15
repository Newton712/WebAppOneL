// components/PlayersList.jsx
import ColorDropdown from './ColorDropdown';
import jaune from '../assets/colors/jaune.png';
import mauve from '../assets/colors/mauve.png';
import vert from '../assets/colors/vert.png';
import rouge from '../assets/colors/rouge.png';
import bleu from '../assets/colors/bleu.png';
import gris from '../assets/colors/gris.png';

const colorImages = { jaune, mauve, vert, rouge, bleu, gris };

export default function PlayersList({ players, editPlayer, setEditPlayer, savePlayer }) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3 text-white">Joueurs du tournoi</h3>
      <table className="w-full text-sm text-left text-gray-300 bg-[#1e1e1e] border border-gray-700 rounded overflow-hidden">
        <thead className="bg-[#2a2a2a] text-gray-100 uppercase text-xs tracking-wider">
          <tr>
            <th className="px-4 py-3 border-b border-gray-700">Nom</th>
            <th className="px-4 py-3 border-b border-gray-700">Description</th>
            <th className="px-4 py-3 border-b border-gray-700 text-center">Couleur 1</th>
            <th className="px-4 py-3 border-b border-gray-700 text-center">Couleur 2</th>
            <th className="px-4 py-3 border-b border-gray-700 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p, idx) => {
            const isEditing = editPlayer?.id === p.id;
            return (
              <tr key={p.id} className={idx % 2 === 0 ? 'bg-[#1e1e1e]' : 'bg-[#2a2a2a]'}>
                <td className="px-4 py-2 border-b border-gray-700">
                  {isEditing ? (
                    <input
                      className="w-full bg-[#1e1e1e] text-white border border-gray-600 rounded px-2 py-1"
                      value={editPlayer.name}
                      onChange={(e) => setEditPlayer({ ...editPlayer, name: e.target.value })}
                    />
                  ) : (
                    p.name
                  )}
                </td>
                <td className="px-4 py-2 border-b border-gray-700">
                  {isEditing ? (
                    <input
                      className="w-full bg-[#1e1e1e] text-white border border-gray-600 rounded px-2 py-1"
                      value={editPlayer.comments || ''}
                      onChange={(e) => setEditPlayer({ ...editPlayer, comments: e.target.value })}
                    />
                  ) : (
                    p.comments
                  )}
                </td>
                <td className="px-4 py-2 border-b border-gray-700 text-center">
                  {isEditing ? (
                    <select
                      className="bg-[#1e1e1e] text-white border border-gray-600 rounded px-2 py-1"
                      value={editPlayer.deckcolor1 || ''}
                      onChange={(e) => setEditPlayer({ ...editPlayer, deckcolor1: e.target.value })}
                    >
                      <option value="">--</option>
                      {Object.keys(colorImages).map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  ) : (
                    p.deckcolor1 && <img src={colorImages[p.deckcolor1]} alt={p.deckcolor1} className="w-5 h-5 inline-block rounded" />
                  )}
                </td>
                <td className="px-4 py-2 border-b border-gray-700 text-center">
                  {isEditing ? (
                    <select
                      className="bg-[#1e1e1e] text-white border border-gray-600 rounded px-2 py-1"
                      value={editPlayer.deckcolor2 || ''}
                      onChange={(e) => setEditPlayer({ ...editPlayer, deckcolor2: e.target.value })}
                    >
                      <option value="">--</option>
                      {Object.keys(colorImages).map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  ) : (
                    p.deckcolor2 && <img src={colorImages[p.deckcolor2]} alt={p.deckcolor2} className="w-5 h-5 inline-block rounded" />
                  )}
                </td>
                <td className="px-4 py-2 border-b border-gray-700 text-center">
                  {isEditing ? (
                    <button
                      className="bg-green-600 text-white px-2 py-1 rounded"
                      onClick={() => savePlayer(p.id)}
                    >
                      💾
                    </button>
                  ) : (
                    <button
                      className="text-blue-400 underline"
                      onClick={() => setEditPlayer(p)}
                    >
                      Modifier
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
