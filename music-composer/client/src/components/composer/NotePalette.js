import React from 'react';
import { Music2 } from 'lucide-react';
import { useMusicContext } from '../../contexts/MusicContext';

/**
 * NotePalette Component - Clickable note palette for adding notes to staff
 * Users can click to select a note, then click on the staff to place it
 */
const NotePalette = () => {
  const { selectedPaletteNote, setSelectedPaletteNote } = useMusicContext();
  const notes = [
    { duration: 'w', symbol: '𝅝', label: 'Whole Note', color: 'from-blue-500 to-blue-600' },
    { duration: 'h', symbol: '𝅗𝅥', label: 'Half Note', color: 'from-green-500 to-green-600' },
    { duration: 'q', symbol: '𝅘𝅥', label: 'Quarter Note', color: 'from-purple-500 to-purple-600' },
    { duration: '8', symbol: '𝅘𝅥𝅮', label: 'Eighth Note', color: 'from-orange-500 to-orange-600' },
    { duration: '16', symbol: '𝅘𝅥𝅯', label: '16th Note', color: 'from-pink-500 to-pink-600' },
  ];

  const rests = [
    { duration: 'w', symbol: '𝄻', label: 'Whole Rest', color: 'from-gray-600 to-gray-700' },
    { duration: 'h', symbol: '𝄼', label: 'Half Rest', color: 'from-gray-600 to-gray-700' },
    { duration: 'q', symbol: '𝄽', label: 'Quarter Rest', color: 'from-gray-600 to-gray-700' },
    { duration: '8', symbol: '𝄾', label: 'Eighth Rest', color: 'from-gray-600 to-gray-700' },
  ];

  /**
   * Handle note selection - store note data for placing on staff
   */
  const handleNoteClick = (noteData) => {
    setSelectedPaletteNote(noteData);
  };

  /**
   * Check if a note is currently selected
   */
  const isNoteSelected = (noteData) => {
    return selectedPaletteNote &&
           selectedPaletteNote.duration === noteData.duration &&
           selectedPaletteNote.isRest === noteData.isRest;
  };

  return (
    <div className="note-palette bg-white rounded-xl shadow-lg p-6">
      <div className="mb-4 flex items-center">
        <Music2 className="text-blue-600 mr-2" size={28} />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Note Palette</h2>
          <p className="text-sm text-gray-600">Click to select, then click on staff to place</p>
        </div>
      </div>

      {/* Notes Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Notes</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {notes.map((note) => {
            const noteData = { ...note, isRest: false };
            const isSelected = isNoteSelected(noteData);
            return (
              <div
                key={note.duration}
                onClick={() => handleNoteClick(noteData)}
                className={`clickable-note cursor-pointer p-4 rounded-xl bg-gradient-to-br ${note.color} text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ${
                  isSelected ? 'ring-4 ring-yellow-400 scale-110' : ''
                }`}
                title={`Click to select ${note.label}`}
              >
                <div className="text-5xl text-center mb-2">{note.symbol}</div>
                <div className="text-xs text-center font-semibold opacity-90">{note.label}</div>
                {isSelected && (
                  <div className="text-center text-xs mt-1 font-bold">✓ SELECTED</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Rests Section */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Rests</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {rests.map((rest) => {
            const restData = { ...rest, isRest: true };
            const isSelected = isNoteSelected(restData);
            return (
              <div
                key={rest.duration + '-rest'}
                onClick={() => handleNoteClick(restData)}
                className={`clickable-note cursor-pointer p-4 rounded-xl bg-gradient-to-br ${rest.color} text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ${
                  isSelected ? 'ring-4 ring-yellow-400 scale-110' : ''
                }`}
                title={`Click to select ${rest.label}`}
              >
                <div className="text-5xl text-center mb-2">{rest.symbol}</div>
                <div className="text-xs text-center font-semibold opacity-90">{rest.label}</div>
                {isSelected && (
                  <div className="text-center text-xs mt-1 font-bold">✓ SELECTED</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
        <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
          <span className="text-2xl mr-2">👆</span>
          How to use Click & Place:
        </h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>1. Click on a note or rest above to select it (it will show a yellow ring)</li>
          <li>2. Click anywhere on the staff below to place the selected note</li>
          <li>3. The note will be added at the clicked position</li>
          <li>4. You can place the same note multiple times without reselecting</li>
        </ul>
      </div>

      {/* Selected Note Indicator */}
      {selectedPaletteNote && (
        <div className="mt-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-3xl mr-3">{selectedPaletteNote.symbol}</span>
            <div>
              <div className="font-semibold text-gray-800">Selected: {selectedPaletteNote.label}</div>
              <div className="text-xs text-gray-600">Click on the staff to place this note</div>
            </div>
          </div>
          <button
            onClick={() => setSelectedPaletteNote(null)}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors"
          >
            Deselect
          </button>
        </div>
      )}

      <style jsx>{`
        .clickable-note {
          user-select: none;
        }

        .clickable-note:active {
          transform: scale(0.95);
        }
      `}</style>
    </div>
  );
};

export default NotePalette;
