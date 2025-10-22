import React, { useState } from 'react';
import { useMusicContext } from '../../contexts/MusicContext';
import { Music, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * ChordLibrary Component
 * Provides common chord suggestions and quick insertion
 *
 * Features:
 * - Common chord types (Major, Minor, Diminished, Augmented, 7th, etc.)
 * - Click to insert chord at cursor
 * - Chord inversions
 * - Visual chord diagrams
 */
const ChordLibrary = () => {
  const { addChordAtCursor, cursorPosition } = useMusicContext();
  const [selectedRoot, setSelectedRoot] = useState('C');
  const [isExpanded, setIsExpanded] = useState(true);

  // Chord definitions (intervals from root)
  const chordTypes = [
    { name: 'Major', symbol: '', intervals: [0, 4, 7], color: 'bg-blue-500' },
    { name: 'Minor', symbol: 'm', intervals: [0, 3, 7], color: 'bg-purple-500' },
    { name: 'Diminished', symbol: 'dim', intervals: [0, 3, 6], color: 'bg-red-500' },
    { name: 'Augmented', symbol: 'aug', intervals: [0, 4, 8], color: 'bg-orange-500' },
    { name: 'Major 7th', symbol: 'maj7', intervals: [0, 4, 7, 11], color: 'bg-green-500' },
    { name: 'Dominant 7th', symbol: '7', intervals: [0, 4, 7, 10], color: 'bg-yellow-500' },
    { name: 'Minor 7th', symbol: 'm7', intervals: [0, 3, 7, 10], color: 'bg-indigo-500' },
    { name: 'Sus2', symbol: 'sus2', intervals: [0, 2, 7], color: 'bg-pink-500' },
    { name: 'Sus4', symbol: 'sus4', intervals: [0, 5, 7], color: 'bg-teal-500' }
  ];

  const noteNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const chromaticScale = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  // Get note at interval from root
  const getNoteAtInterval = (root, interval) => {
    const rootIndex = chromaticScale.indexOf(root);
    const targetIndex = (rootIndex + interval) % 12;
    return chromaticScale[targetIndex];
  };

  // Insert chord at cursor position
  const insertChord = (chordType) => {
    const chordNotes = chordType.intervals.map(interval => {
      const note = getNoteAtInterval(selectedRoot, interval);
      return note.replace('#', ''); // Remove sharp for now, will be handled by accidental
    });

    addChordAtCursor(chordNotes);
  };

  return (
    <div className="chord-library bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      {/* Header */}
      <div
        className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Music size={20} />
            <h3 className="text-lg font-bold">Chord Library</h3>
          </div>
          {isExpanded ? (
            <ChevronUp size={20} className="text-white" />
          ) : (
            <ChevronDown size={20} className="text-white" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Root Note Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Root Note:
            </label>
            <div className="grid grid-cols-7 gap-2">
              {noteNames.map(note => (
                <button
                  key={note}
                  onClick={() => setSelectedRoot(note)}
                  className={`px-3 py-2 rounded-lg font-bold text-sm transition-all ${
                    selectedRoot === note
                      ? 'bg-purple-500 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {note}
                </button>
              ))}
            </div>
          </div>

          {/* Chord Types */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Chord Type:
            </label>
            <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
              {chordTypes.map((chord, idx) => {
                const chordNotes = chord.intervals.map(interval =>
                  getNoteAtInterval(selectedRoot, interval)
                );

                return (
                  <button
                    key={idx}
                    onClick={() => insertChord(chord)}
                    className={`p-3 rounded-lg text-white font-semibold transition-all hover:shadow-lg hover:scale-105 ${chord.color}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <div className="text-lg font-bold">
                          {selectedRoot}{chord.symbol}
                        </div>
                        <div className="text-xs opacity-90">
                          {chord.name}
                        </div>
                      </div>
                      <div className="text-xs opacity-90 font-mono">
                        {chordNotes.join(' - ')}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Info */}
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-800">
              <span className="font-bold">💡 Tip:</span> Click any chord to insert it at the cursor position.
              Use the root note selector to change the key.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChordLibrary;
