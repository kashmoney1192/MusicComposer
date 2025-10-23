import React, { useState } from 'react';
import { useMusicContext } from '../../contexts/MusicContext';

/**
 * EnhancedPianoKeyboard Component
 * Full 2-octave piano keyboard with computer key mappings
 *
 * Features:
 * - 2 complete octaves (C4-B5)
 * - White keys mapped to: Z X C V B N M , . / Q W E R T Y U I O P [ ]
 * - Black keys mapped to: S D G H J L ; A W E T Y U O P
 * - Visual feedback on hover and press
 * - Displays both computer key and piano note
 */
const EnhancedPianoKeyboard = () => {
  const { addNoteAtCursor, selectedTool, setSelectedTool } = useMusicContext();
  const [pressedKey, setPressedKey] = useState(null);

  // Complete 2-octave mapping
  const pianoKeys = [
    // Octave 1 (C4-B4)
    { note: 'C', octave: 4, computerKey: 'Z', isBlack: false, position: 0 },
    { note: 'C#', octave: 4, computerKey: 'S', isBlack: true, position: 0.7 },
    { note: 'D', octave: 4, computerKey: 'X', isBlack: false, position: 1 },
    { note: 'D#', octave: 4, computerKey: 'D', isBlack: true, position: 1.7 },
    { note: 'E', octave: 4, computerKey: 'C', isBlack: false, position: 2 },
    { note: 'F', octave: 4, computerKey: 'V', isBlack: false, position: 3 },
    { note: 'F#', octave: 4, computerKey: 'G', isBlack: true, position: 3.7 },
    { note: 'G', octave: 4, computerKey: 'B', isBlack: false, position: 4 },
    { note: 'G#', octave: 4, computerKey: 'H', isBlack: true, position: 4.7 },
    { note: 'A', octave: 4, computerKey: 'N', isBlack: false, position: 5 },
    { note: 'A#', octave: 4, computerKey: 'J', isBlack: true, position: 5.7 },
    { note: 'B', octave: 4, computerKey: 'M', isBlack: false, position: 6 },

    // Octave 2 (C5-B5)
    { note: 'C', octave: 5, computerKey: ',', isBlack: false, position: 7 },
    { note: 'C#', octave: 5, computerKey: 'L', isBlack: true, position: 7.7 },
    { note: 'D', octave: 5, computerKey: '.', isBlack: false, position: 8 },
    { note: 'D#', octave: 5, computerKey: ';', isBlack: true, position: 8.7 },
    { note: 'E', octave: 5, computerKey: '/', isBlack: false, position: 9 },
    { note: 'F', octave: 5, computerKey: 'Q', isBlack: false, position: 10 },
    { note: 'F#', octave: 5, computerKey: '2', isBlack: true, position: 10.7 },
    { note: 'G', octave: 5, computerKey: 'W', isBlack: false, position: 11 },
    { note: 'G#', octave: 5, computerKey: '3', isBlack: true, position: 11.7 },
    { note: 'A', octave: 5, computerKey: 'E', isBlack: false, position: 12 },
    { note: 'A#', octave: 5, computerKey: '4', isBlack: true, position: 12.7 },
    { note: 'B', octave: 5, computerKey: 'R', isBlack: false, position: 13 },
  ];

  const handleKeyClick = (key) => {
    const fullNote = key.note.replace('#', '');

    // Build the pitch with octave
    const pitch = `${fullNote}/${key.octave}`;

    // Add note with proper accidental
    let accidental = selectedTool.accidental;
    if (key.note.includes('#')) {
      accidental = '#';
    }

    addNoteAtCursor(fullNote);
    setPressedKey(key.note + key.octave);

    // Reset pressed state after a short delay
    setTimeout(() => setPressedKey(null), 200);
  };

  // Setup keyboard event listeners
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toUpperCase();
      const pianoKey = pianoKeys.find(k => k.computerKey === key);

      if (pianoKey && !e.repeat) {
        handleKeyClick(pianoKey);
        return;
      }

      // Handle duration shortcuts (1-6 keys)
      const durationMap = {
        '1': 'w', // Whole note
        '2': 'h', // Half note
        '3': 'q', // Quarter note
        '4': '8', // Eighth note
        '5': '16', // Sixteenth note
        '6': '32'  // Thirty-second note
      };

      if (durationMap[key]) {
        e.preventDefault();
        setSelectedTool(prev => ({ ...prev, duration: durationMap[key] }));
        return;
      }

      // Handle accidental shortcuts
      if (key === 'S') {
        e.preventDefault();
        setSelectedTool(prev => ({ ...prev, accidental: '#' }));
      } else if (key === 'F') {
        e.preventDefault();
        setSelectedTool(prev => ({ ...prev, accidental: 'b' }));
      } else if (key === 'N' && !e.shiftKey) {
        e.preventDefault();
        setSelectedTool(prev => ({ ...prev, accidental: 'n' }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTool, pianoKeys]);

  const whiteKeys = pianoKeys.filter(k => !k.isBlack);
  const blackKeys = pianoKeys.filter(k => k.isBlack);

  return (
    <div className="enhanced-piano-keyboard bg-gradient-to-b from-gray-100 to-gray-200 p-8 rounded-xl border-2 border-gray-400 shadow-2xl mb-6">
      <h3 className="text-center text-2xl font-bold text-gray-800 mb-6">
        🎹 Piano Keyboard - Press Keys to Play
      </h3>

      {/* Piano Keyboard */}
      <div className="relative mx-auto" style={{ width: 'fit-content' }}>
        <div className="keyboard-container relative" style={{ height: '240px' }}>
          {/* White Keys */}
          <div className="white-keys-container flex relative">
            {whiteKeys.map((key, index) => {
              const isPressed = pressedKey === (key.note + key.octave);
              return (
                <div
                  key={`white-${index}`}
                  onClick={() => handleKeyClick(key)}
                  className={`white-key cursor-pointer transform transition-all duration-100 ${
                    isPressed ? 'scale-95 bg-blue-300' : 'hover:bg-gray-100'
                  }`}
                  style={{
                    width: '70px',
                    height: '220px',
                    backgroundColor: isPressed ? '#93C5FD' : 'white',
                    border: '3px solid #1F2937',
                    borderRadius: '0 0 8px 8px',
                    marginRight: '-3px',
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 8px',
                    boxShadow: isPressed ? 'inset 0 4px 8px rgba(0,0,0,0.3)' : '0 4px 8px rgba(0,0,0,0.2)'
                  }}
                >
                  {/* Computer keyboard label at top */}
                  <div
                    className="computer-key-label font-bold text-2xl px-4 py-2 rounded-lg shadow-md"
                    style={{
                      backgroundColor: '#3B82F6',
                      color: 'white',
                      minWidth: '48px',
                      textAlign: 'center'
                    }}
                  >
                    {key.computerKey}
                  </div>

                  {/* Piano note label at bottom */}
                  <div className="note-label text-gray-800 font-bold text-lg">
                    {key.note}{key.octave}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Black Keys */}
          <div className="black-keys-container absolute top-0 left-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
            {blackKeys.map((key, index) => {
              const isPressed = pressedKey === (key.note + key.octave);
              const leftPosition = key.position * 67; // Position calculation for black keys

              return (
                <div
                  key={`black-${index}`}
                  onClick={() => handleKeyClick(key)}
                  className={`black-key cursor-pointer transform transition-all duration-100 pointer-events-auto ${
                    isPressed ? 'scale-95 bg-gray-600' : 'hover:bg-gray-600'
                  }`}
                  style={{
                    position: 'absolute',
                    left: `${leftPosition}px`,
                    width: '48px',
                    height: '140px',
                    backgroundColor: isPressed ? '#4B5563' : '#1F2937',
                    border: '3px solid #000',
                    borderRadius: '0 0 6px 6px',
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 4px',
                    boxShadow: isPressed ? 'inset 0 4px 8px rgba(0,0,0,0.5)' : '0 6px 12px rgba(0,0,0,0.4)'
                  }}
                >
                  {/* Computer keyboard label */}
                  <div
                    className="computer-key-label font-bold text-lg px-2 py-1 rounded shadow-sm"
                    style={{
                      backgroundColor: '#EF4444',
                      color: 'white',
                      fontSize: '16px',
                      minWidth: '32px',
                      textAlign: 'center'
                    }}
                  >
                    {key.computerKey}
                  </div>

                  {/* Piano note label */}
                  <div className="note-label text-white font-semibold text-xs">
                    {key.note}{key.octave}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend and Instructions */}
      <div className="mt-8 space-y-4">
        <div className="flex justify-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-blue-500 rounded shadow flex items-center justify-center text-white font-bold">
              Z
            </div>
            <span className="text-gray-700">White Keys (Natural Notes)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-red-500 rounded shadow flex items-center justify-center text-white font-bold">
              S
            </div>
            <span className="text-gray-700">Black Keys (Sharps/Flats)</span>
          </div>
        </div>

        {/* Current Selection */}
        <div className="p-4 bg-white rounded-lg border-2 border-gray-300 shadow-inner">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-2">Current Settings:</div>
            <div className="flex justify-center gap-6 items-center flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-500">Duration:</span>
                <span className="text-lg font-bold text-blue-600">{getDurationName(selectedTool.duration)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-500">Accidental:</span>
                <span className="text-lg font-bold text-green-600">
                  {selectedTool.accidental === '#' ? '♯ Sharp' :
                   selectedTool.accidental === 'b' ? '♭ Flat' :
                   selectedTool.accidental === 'n' ? '♮ Natural' :
                   'None'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Instructions */}
        <div className="text-center text-sm text-gray-600 space-y-1">
          <p className="font-semibold text-gray-700">Quick Guide:</p>
          <p>
            <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">Z-M</kbd> = First octave white keys •
            <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono mx-1">,-/</kbd> = Second octave white keys •
            <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono mx-1">Q-R</kbd> = Third octave start
          </p>
          <p>
            <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">S D G H J</kbd> = First octave black keys •
            <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono mx-1">L ; 2 3 4</kbd> = Second octave black keys
          </p>
        </div>
      </div>
    </div>
  );
};

// Helper to get duration name
const getDurationName = (duration) => {
  const names = {
    'w': 'Whole (𝅝)',
    'h': 'Half (𝅗𝅥)',
    'q': 'Quarter (♩)',
    '8': 'Eighth (♪)',
    '16': '16th (𝅘𝅥𝅯)',
    '32': '32nd (𝅘𝅥𝅰)'
  };
  return names[duration] || 'Quarter';
};

export default EnhancedPianoKeyboard;
