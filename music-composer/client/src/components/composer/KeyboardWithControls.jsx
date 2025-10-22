import React from 'react';
import { useMusicContext } from '../../contexts/MusicContext';
import EnhancedPianoKeyboard from './EnhancedPianoKeyboard';

/**
 * KeyboardWithControls Component
 * Combines the enhanced piano keyboard with input controls (accidentals, durations)
 * Layout: Full-width piano keyboard at top, controls below
 */
const KeyboardWithControls = () => {
  const { selectedTool, setSelectedTool } = useMusicContext();

  return (
    <div className="keyboard-with-controls bg-white rounded-lg border border-gray-300 shadow-sm mb-6">
      {/* Enhanced Piano Keyboard - Full Width */}
      <EnhancedPianoKeyboard />

      {/* Input Controls Below Keyboard */}
      <div className="px-8 pb-8">
        <div className="flex gap-6 justify-center">
          {/* Accidentals Column */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-700 mb-3 text-center">Accidentals</h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSelectedTool(prev => ({ ...prev, accidental: '#' }))}
                className={`p-2 rounded-lg border-2 transition-all ${
                  selectedTool.accidental === '#'
                    ? 'bg-green-500 text-white border-green-600 shadow-md'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="text-2xl">♯</div>
                <div className="text-xs font-semibold">Sharp (S)</div>
              </button>

              <button
                onClick={() => setSelectedTool(prev => ({ ...prev, accidental: 'b' }))}
                className={`p-2 rounded-lg border-2 transition-all ${
                  selectedTool.accidental === 'b'
                    ? 'bg-green-500 text-white border-green-600 shadow-md'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="text-2xl">♭</div>
                <div className="text-xs font-semibold">Flat (F)</div>
              </button>

              <button
                onClick={() => setSelectedTool(prev => ({ ...prev, accidental: 'n' }))}
                className={`p-2 rounded-lg border-2 transition-all ${
                  selectedTool.accidental === 'n'
                    ? 'bg-green-500 text-white border-green-600 shadow-md'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="text-2xl">♮</div>
                <div className="text-xs font-semibold">Natural (N)</div>
              </button>

              <button
                onClick={() => setSelectedTool(prev => ({ ...prev, accidental: null }))}
                className={`p-2 rounded-lg border-2 transition-all ${
                  selectedTool.accidental === null
                    ? 'bg-gray-500 text-white border-gray-600 shadow-md'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="text-xl">✕</div>
                <div className="text-xs font-semibold">Clear (Shift+N)</div>
              </button>
            </div>
          </div>

          {/* Note Durations Column */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-700 mb-3 text-center">Note Durations</h4>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setSelectedTool(prev => ({ ...prev, duration: 'w', type: 'note' }))}
                className={`p-2 rounded border-2 text-center transition-all ${
                  selectedTool.duration === 'w'
                    ? 'bg-blue-500 text-white border-blue-600 shadow-md'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="text-2xl">𝅝</div>
                <div className="text-xs font-semibold">Whole (1)</div>
              </button>

              <button
                onClick={() => setSelectedTool(prev => ({ ...prev, duration: 'h', type: 'note' }))}
                className={`p-2 rounded border-2 text-center transition-all ${
                  selectedTool.duration === 'h'
                    ? 'bg-blue-500 text-white border-blue-600 shadow-md'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="text-2xl">𝅗𝅥</div>
                <div className="text-xs font-semibold">Half (2)</div>
              </button>

              <button
                onClick={() => setSelectedTool(prev => ({ ...prev, duration: 'q', type: 'note' }))}
                className={`p-2 rounded border-2 text-center transition-all ${
                  selectedTool.duration === 'q'
                    ? 'bg-blue-500 text-white border-blue-600 shadow-md'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="text-2xl">♩</div>
                <div className="text-xs font-semibold">Quarter (3)</div>
              </button>

              <button
                onClick={() => setSelectedTool(prev => ({ ...prev, duration: '8', type: 'note' }))}
                className={`p-2 rounded border-2 text-center transition-all ${
                  selectedTool.duration === '8'
                    ? 'bg-blue-500 text-white border-blue-600 shadow-md'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="text-2xl">♪</div>
                <div className="text-xs font-semibold">Eighth (4)</div>
              </button>

              <button
                onClick={() => setSelectedTool(prev => ({ ...prev, duration: '16', type: 'note' }))}
                className={`p-2 rounded border-2 text-center transition-all ${
                  selectedTool.duration === '16'
                    ? 'bg-blue-500 text-white border-blue-600 shadow-md'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="text-2xl">𝅘𝅥𝅯</div>
                <div className="text-xs font-semibold">16th (5)</div>
              </button>

              <button
                onClick={() => setSelectedTool(prev => ({ ...prev, duration: '32', type: 'note' }))}
                className={`p-2 rounded border-2 text-center transition-all ${
                  selectedTool.duration === '32'
                    ? 'bg-blue-500 text-white border-blue-600 shadow-md'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="text-xl">𝅘𝅥𝅰</div>
                <div className="text-xs font-semibold">32nd (6)</div>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
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

export default KeyboardWithControls;
