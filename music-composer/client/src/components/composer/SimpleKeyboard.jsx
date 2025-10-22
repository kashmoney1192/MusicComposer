import React from 'react';
import { useMusicContext } from '../../contexts/MusicContext';

/**
 * SimpleKeyboard Component
 * Visual piano keyboard showing which computer keys (A-G) to press
 *
 * Features:
 * - Shows one octave of piano keys (C, D, E, F, G, A, B)
 * - Labels each key with the computer keyboard letter to press
 * - Clickable to add notes
 * - Visual feedback on hover
 */
const SimpleKeyboard = () => {
  const { addNoteAtCursor, selectedTool } = useMusicContext();

  // Define the piano keys with their computer keyboard mappings
  const pianoKeys = [
    { note: 'C', computerKey: 'C', isBlack: false },
    { note: 'C#', computerKey: '', isBlack: true },
    { note: 'D', computerKey: 'D', isBlack: false },
    { note: 'D#', computerKey: '', isBlack: true },
    { note: 'E', computerKey: 'E', isBlack: false },
    { note: 'F', computerKey: 'F', isBlack: false },
    { note: 'F#', computerKey: '', isBlack: true },
    { note: 'G', computerKey: 'G', isBlack: false },
    { note: 'G#', computerKey: '', isBlack: true },
    { note: 'A', computerKey: 'A', isBlack: false },
    { note: 'A#', computerKey: '', isBlack: true },
    { note: 'B', computerKey: 'B', isBlack: false },
  ];

  const handleKeyClick = (note) => {
    // Only allow clicking on white keys (ones with computer key labels)
    const noteLetter = note.replace('#', '').replace('b', '');
    if (note.includes('#')) return; // Skip black keys for now

    addNoteAtCursor(noteLetter);
  };

  return (
    <div className="simple-keyboard bg-white p-6 rounded-lg border border-gray-300 shadow-sm mb-6">
      <h3 className="text-center text-lg font-bold text-gray-800 mb-4">
        🎹 Press These Keys on Your Computer Keyboard to Add Notes
      </h3>

      <div className="keyboard-container flex justify-center items-end relative" style={{ height: '180px' }}>
        {pianoKeys.map((key, index) => (
          <div
            key={index}
            onClick={() => handleKeyClick(key.note)}
            className={`piano-key ${key.isBlack ? 'black-key' : 'white-key'} ${!key.isBlack ? 'cursor-pointer hover:bg-blue-100' : 'cursor-not-allowed'}`}
            style={key.isBlack ? blackKeyStyle : whiteKeyStyle}
          >
            {!key.isBlack && (
              <div className="key-content flex flex-col items-center justify-between h-full py-3">
                {/* Computer keyboard letter at top */}
                <div className="computer-key-label bg-blue-500 text-white font-bold text-xl px-3 py-1 rounded shadow">
                  {key.computerKey}
                </div>

                {/* Piano note name at bottom */}
                <div className="note-label text-gray-700 font-semibold text-sm">
                  {key.note}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="mt-4 text-center text-sm text-gray-600">
        <p className="mb-2">
          <strong>Selected Duration:</strong> {getDurationName(selectedTool.duration)}
        </p>
        <p className="text-xs">
          Press <kbd className="px-2 py-1 bg-gray-200 rounded">1-6</kbd> to change duration •
          Press <kbd className="px-2 py-1 bg-gray-200 rounded">S</kbd> for sharp,
          <kbd className="px-2 py-1 bg-gray-200 rounded ml-1">F</kbd> for flat
        </p>
      </div>
    </div>
  );
};

// Styles for white keys
const whiteKeyStyle = {
  width: '60px',
  height: '160px',
  backgroundColor: 'white',
  border: '2px solid #333',
  borderRadius: '0 0 4px 4px',
  marginRight: '-2px',
  position: 'relative',
  zIndex: 1,
  transition: 'all 0.2s ease'
};

// Styles for black keys
const blackKeyStyle = {
  width: '40px',
  height: '100px',
  backgroundColor: '#333',
  border: '2px solid #000',
  borderRadius: '0 0 3px 3px',
  position: 'absolute',
  zIndex: 2,
  marginLeft: '-20px',
  transition: 'all 0.2s ease'
};

// Helper to get duration name
const getDurationName = (duration) => {
  const names = {
    'w': 'Whole Note (𝅝)',
    'h': 'Half Note (𝅗𝅥)',
    'q': 'Quarter Note (♩)',
    '8': 'Eighth Note (♪)',
    '16': 'Sixteenth Note (𝅘𝅥𝅯)',
    '32': 'Thirty-second Note (𝅘𝅥𝅰)'
  };
  return names[duration] || 'Quarter Note';
};

export default SimpleKeyboard;
