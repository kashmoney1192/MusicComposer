import React from 'react';
import { useMusicContext } from '../../contexts/MusicContext';

/**
 * QuickNoteToolbar Component
 * Quick access toolbar for common note durations and accidentals
 * Sticky toolbar that floats above the piano keyboard
 */
const QuickNoteToolbar = () => {
  const { selectedTool, setSelectedTool } = useMusicContext();

  const durations = [
    { value: 'w', symbol: '𝅝', name: 'Whole', key: '1' },
    { value: 'h', symbol: '𝅗𝅥', name: 'Half', key: '2' },
    { value: 'q', symbol: '♩', name: 'Quarter', key: '3' },
    { value: '8', symbol: '♪', name: 'Eighth', key: '4' },
    { value: '16', symbol: '𝅘𝅥𝅯', name: '16th', key: '5' },
    { value: '32', symbol: '𝅘𝅥𝅰', name: '32nd', key: '6' }
  ];

  const accidentals = [
    { value: '#', symbol: '♯', name: 'Sharp', key: 'S', color: 'bg-green-500' },
    { value: 'b', symbol: '♭', name: 'Flat', key: 'F', color: 'bg-blue-500' },
    { value: 'n', symbol: '♮', name: 'Natural', key: 'N', color: 'bg-purple-500' },
    { value: null, symbol: '✕', name: 'None', key: 'Shift+N', color: 'bg-gray-500' }
  ];

  const tools = [
    { value: 'note', symbol: '♪', name: 'Note', key: 'N' },
    { value: 'rest', symbol: '𝄽', name: 'Rest', key: 'R' }
  ];

  return (
    <div className="quick-note-toolbar sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between gap-6">
          {/* Note/Rest Toggle */}
          <div className="flex items-center gap-2">
            {tools.map((tool) => (
              <button
                key={tool.value}
                onClick={() => setSelectedTool(prev => ({ ...prev, type: tool.value }))}
                className={`px-3 py-2 rounded-lg font-bold text-xl transition-all ${
                  selectedTool.type === tool.value
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'bg-blue-500 bg-opacity-30 text-white hover:bg-opacity-50'
                }`}
                title={`${tool.name} (${tool.key})`}
              >
                {tool.symbol}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="w-px h-12 bg-white bg-opacity-30"></div>

          {/* Durations */}
          <div className="flex items-center gap-3">
            <span className="text-white font-bold text-sm">Duration:</span>
            <div className="flex gap-2">
              {durations.map((dur) => (
                <button
                  key={dur.value}
                  onClick={() => setSelectedTool(prev => ({ ...prev, duration: dur.value }))}
                  className={`relative group px-4 py-3 rounded-lg font-bold text-2xl transition-all transform hover:scale-110 ${
                    selectedTool.duration === dur.value
                      ? 'bg-white text-blue-600 shadow-xl scale-110'
                      : 'bg-blue-500 bg-opacity-50 text-white hover:bg-opacity-100'
                  }`}
                  title={`${dur.name} Note (${dur.key})`}
                >
                  {dur.symbol}
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-blue-900 text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {dur.key}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-12 bg-white bg-opacity-30"></div>

          {/* Accidentals - Only show for notes, not rests */}
          {selectedTool.type === 'note' && (
            <>
              <div className="w-px h-12 bg-white bg-opacity-30"></div>
              <div className="flex items-center gap-3">
                <span className="text-white font-bold text-sm">Accidental:</span>
                <div className="flex gap-2">
                  {accidentals.map((acc) => (
                    <button
                      key={acc.name}
                      onClick={() => setSelectedTool(prev => ({ ...prev, accidental: acc.value }))}
                      className={`relative group px-4 py-3 rounded-lg font-bold text-2xl transition-all transform hover:scale-110 ${
                        selectedTool.accidental === acc.value
                          ? `${acc.color} text-white shadow-xl scale-110`
                          : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                      }`}
                      title={`${acc.name} (${acc.key})`}
                    >
                      {acc.symbol}
                      <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-blue-900 text-xs font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        {acc.key}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Current Selection Display */}
          <div className="flex items-center gap-3 bg-white bg-opacity-20 px-4 py-2 rounded-lg">
            <div className="text-white text-sm">
              <div className="font-bold">Current:</div>
              <div className="flex items-center gap-2">
                <span className="text-3xl">{durations.find(d => d.value === selectedTool.duration)?.symbol}</span>
                {selectedTool.accidental && (
                  <span className="text-2xl">{accidentals.find(a => a.value === selectedTool.accidental)?.symbol}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickNoteToolbar;
