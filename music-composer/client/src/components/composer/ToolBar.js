import React from 'react';
import { Music, Circle } from 'lucide-react';
import { useMusicContext } from '../../contexts/MusicContext';

/**
 * ToolBar Component - Interface for selecting notes, rests, accidentals, and durations
 * Provides a user-friendly interface with large, colorful buttons
 */
const ToolBar = () => {
  const {
    selectedTool,
    setSelectedTool,
    timeSignature,
    setTimeSignature,
    keySignature,
    setKeySignature,
    clef,
    setClef,
    tempo,
    setTempo,
    dualStaffMode,
    setDualStaffMode,
    currentStaff,
    setCurrentStaff
  } = useMusicContext();

  /**
   * Note duration options with visual symbols
   */
  const durations = [
    { value: 'w', label: 'Whole', symbol: '𝅝', beats: 4 },
    { value: 'h', label: 'Half', symbol: '𝅗𝅥', beats: 2 },
    { value: 'q', label: 'Quarter', symbol: '𝅘𝅥', beats: 1 },
    { value: '8', label: 'Eighth', symbol: '𝅘𝅥𝅮', beats: 0.5 },
    { value: '16', label: '16th', symbol: '𝅘𝅥𝅯', beats: 0.25 }
  ];

  /**
   * Accidental options
   */
  const accidentals = [
    { value: null, label: 'None', symbol: '-' },
    { value: '#', label: 'Sharp', symbol: '♯' },
    { value: 'b', label: 'Flat', symbol: '♭' },
    { value: 'n', label: 'Natural', symbol: '♮' }
  ];

  /**
   * Time signature presets
   */
  const timeSignatures = [
    { beats: 4, beatType: 4, label: '4/4' },
    { beats: 3, beatType: 4, label: '3/4' },
    { beats: 6, beatType: 8, label: '6/8' },
    { beats: 2, beatType: 4, label: '2/4' },
    { beats: 5, beatType: 4, label: '5/4' }
  ];

  /**
   * Key signature options
   */
  const keySignatures = [
    'C', 'G', 'D', 'A', 'E', 'F', 'Bb', 'Eb', 'Ab',
    'Am', 'Em', 'Dm', 'Bm'
  ];

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      {/* Main toolbar */}
      <div className="px-6 py-4">
        {/* Tool Type Selection - Note vs Rest */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Tool Type
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => setSelectedTool({ ...selectedTool, type: 'note' })}
              className={`flex-1 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 ${
                selectedTool.type === 'note'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Music className="inline-block mr-2" size={24} />
              Note
            </button>
            <button
              onClick={() => setSelectedTool({ ...selectedTool, type: 'rest' })}
              className={`flex-1 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 ${
                selectedTool.type === 'rest'
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Circle className="inline-block mr-2" size={24} />
              Rest
            </button>
          </div>
        </div>

        {/* Duration Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Duration
          </label>
          <div className="grid grid-cols-5 gap-3">
            {durations.map(duration => (
              <button
                key={duration.value}
                onClick={() => setSelectedTool({ ...selectedTool, duration: duration.value })}
                className={`py-4 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                  selectedTool.duration === duration.value
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="text-3xl mb-1">{duration.symbol}</div>
                <div className="text-xs">{duration.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Accidental Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Accidental
          </label>
          <div className="grid grid-cols-4 gap-3">
            {accidentals.map(accidental => (
              <button
                key={accidental.label}
                onClick={() => setSelectedTool({ ...selectedTool, accidental: accidental.value })}
                className={`py-4 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                  selectedTool.accidental === accidental.value
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="text-2xl mb-1">{accidental.symbol}</div>
                <div className="text-xs">{accidental.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Musical Settings */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Time Signature */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Time Signature
            </label>
            <select
              value={`${timeSignature.beats}/${timeSignature.beatType}`}
              onChange={(e) => {
                const selected = timeSignatures.find(ts => ts.label === e.target.value);
                if (selected) {
                  setTimeSignature({ beats: selected.beats, beatType: selected.beatType });
                }
              }}
              className="w-full py-3 px-4 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-lg font-semibold"
            >
              {timeSignatures.map(ts => (
                <option key={ts.label} value={ts.label}>
                  {ts.label}
                </option>
              ))}
            </select>
          </div>

          {/* Key Signature */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Key Signature
            </label>
            <select
              value={keySignature}
              onChange={(e) => setKeySignature(e.target.value)}
              className="w-full py-3 px-4 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-lg font-semibold"
            >
              {keySignatures.map(key => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>

          {/* Clef */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Clef
            </label>
            <select
              value={clef}
              onChange={(e) => setClef(e.target.value)}
              className="w-full py-3 px-4 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-lg font-semibold"
            >
              <option value="treble">Treble</option>
              <option value="bass">Bass</option>
              <option value="alto">Alto</option>
              <option value="tenor">Tenor</option>
            </select>
          </div>

          {/* Tempo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tempo (BPM)
            </label>
            <input
              type="number"
              value={tempo}
              onChange={(e) => setTempo(parseInt(e.target.value) || 120)}
              min="40"
              max="240"
              className="w-full py-3 px-4 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-lg font-semibold"
            />
          </div>
        </div>

        {/* Dual Staff Mode (Piano Mode) */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="mb-4">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={dualStaffMode}
                  onChange={(e) => {
                    setDualStaffMode(e.target.checked);
                    if (e.target.checked) {
                      setCurrentStaff('treble');
                    }
                  }}
                  className="sr-only"
                />
                <div className={`block w-14 h-8 rounded-full transition-colors ${dualStaffMode ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${dualStaffMode ? 'transform translate-x-6' : ''}`}></div>
              </div>
              <div className="ml-3">
                <span className="text-sm font-semibold text-gray-700">Piano Mode (Dual Staff)</span>
                <p className="text-xs text-gray-500">Show both treble and bass clefs together</p>
              </div>
            </label>
          </div>

          {/* Staff Selector (only shown in dual mode) */}
          {dualStaffMode && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Active Staff (Where notes will be added)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setCurrentStaff('treble')}
                  className={`py-4 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                    currentStaff === 'treble'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-3xl mb-1">𝄞</div>
                  <div className="text-sm">Treble (Right Hand)</div>
                </button>
                <button
                  onClick={() => setCurrentStaff('bass')}
                  className={`py-4 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                    currentStaff === 'bass'
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-3xl mb-1">𝄢</div>
                  <div className="text-sm">Bass (Left Hand)</div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Current Selection Display */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="font-semibold text-gray-700">
            Current Tool:
            <span className="ml-2 text-blue-600">
              {selectedTool.type === 'note' ? 'Note' : 'Rest'}
            </span>
            <span className="ml-2 text-gray-500">|</span>
            <span className="ml-2 text-green-600">
              {durations.find(d => d.value === selectedTool.duration)?.label}
            </span>
            {selectedTool.accidental && (
              <>
                <span className="ml-2 text-gray-500">|</span>
                <span className="ml-2 text-orange-600">
                  {accidentals.find(a => a.value === selectedTool.accidental)?.label}
                </span>
              </>
            )}
          </div>
          <div className="text-gray-600">
            Click on the staff to add notes
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolBar;
