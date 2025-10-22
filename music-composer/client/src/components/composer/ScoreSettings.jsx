import React from 'react';
import { Settings, Music, Clock, Key, Type, User } from 'lucide-react';
import { useMusicContext } from '../../contexts/MusicContext';

/**
 * ScoreSettings Component
 * Collapsible sidebar for score configuration
 *
 * Provides controls for:
 * - Title and composer metadata
 * - Tempo (BPM)
 * - Time signature
 * - Key signature
 * - Clef selection
 * - Dual staff mode (piano)
 */
const ScoreSettings = ({ isOpen, onClose }) => {
  const {
    title,
    setTitle,
    composer,
    setComposer,
    tempo,
    setTempo,
    timeSignature,
    setTimeSignature,
    keySignature,
    setKeySignature,
    clef,
    setClef,
    dualStaffMode,
    setDualStaffMode
  } = useMusicContext();

  const keySignatures = ['C', 'G', 'D', 'A', 'E', 'F', 'Bb', 'Eb', 'Ab'];
  const timeSignatures = [
    { beats: 2, beatType: 4, label: '2/4' },
    { beats: 3, beatType: 4, label: '3/4' },
    { beats: 4, beatType: 4, label: '4/4' },
    { beats: 6, beatType: 8, label: '6/8' },
    { beats: 3, beatType: 8, label: '3/8' }
  ];

  return (
    <div className={`score-settings fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-xl transform transition-transform duration-300 z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="h-full overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <Settings size={24} />
            Score Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Settings Content */}
        <div className="p-4 space-y-6">
          {/* Metadata */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <Type size={16} />
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Composition Title"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <User size={16} />
              Composer
            </label>
            <input
              type="text"
              value={composer}
              onChange={(e) => setComposer(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Composer Name"
            />
          </div>

          {/* Tempo */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <Clock size={16} />
              Tempo (BPM): {tempo}
            </label>
            <input
              type="range"
              min="40"
              max="240"
              value={tempo}
              onChange={(e) => setTempo(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>Slow</span>
              <span>Fast</span>
            </div>
          </div>

          {/* Time Signature */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <Music size={16} />
              Time Signature
            </label>
            <div className="grid grid-cols-3 gap-2">
              {timeSignatures.map((ts) => (
                <button
                  key={ts.label}
                  onClick={() => setTimeSignature({ beats: ts.beats, beatType: ts.beatType })}
                  className={`px-3 py-2 rounded font-bold transition-all ${
                    timeSignature.beats === ts.beats && timeSignature.beatType === ts.beatType
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {ts.label}
                </button>
              ))}
            </div>
          </div>

          {/* Key Signature */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <Key size={16} />
              Key Signature
            </label>
            <div className="grid grid-cols-3 gap-2">
              {keySignatures.map((key) => (
                <button
                  key={key}
                  onClick={() => setKeySignature(key)}
                  className={`px-3 py-2 rounded font-semibold transition-all ${
                    keySignature === key
                      ? 'bg-green-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>

          {/* Clef */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              <Music size={16} />
              Clef
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
                <input
                  type="radio"
                  checked={!dualStaffMode && clef === 'treble'}
                  onChange={() => {
                    setDualStaffMode(false);
                    setClef('treble');
                  }}
                  className="w-4 h-4"
                />
                <span className="text-gray-700 dark:text-gray-300">𝄞 Treble Clef</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
                <input
                  type="radio"
                  checked={!dualStaffMode && clef === 'bass'}
                  onChange={() => {
                    setDualStaffMode(false);
                    setClef('bass');
                  }}
                  className="w-4 h-4"
                />
                <span className="text-gray-700 dark:text-gray-300">𝄢 Bass Clef</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
                <input
                  type="radio"
                  checked={dualStaffMode}
                  onChange={() => setDualStaffMode(true)}
                  className="w-4 h-4"
                />
                <span className="text-gray-700 dark:text-gray-300">𝄞 𝄢 Piano (Grand Staff)</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreSettings;
