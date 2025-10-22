import React from 'react';
import { Settings, Music, Clock, BarChart3 } from 'lucide-react';
import { getKeySignatures, getTimeSignatures, getDifficulties } from '../../utils/musicGenerator';

/**
 * SettingsPanel Component
 * Allows users to configure the music generation parameters
 *
 * @param {Object} settings - Current settings object
 * @param {Function} onSettingsChange - Callback when settings change
 */
const SettingsPanel = ({ settings, onSettingsChange }) => {
  const keySignatures = getKeySignatures();
  const timeSignatures = getTimeSignatures();
  const difficulties = getDifficulties();

  /**
   * Handle change in any setting
   */
  const handleChange = (field, value) => {
    onSettingsChange({
      ...settings,
      [field]: value
    });
  };

  /**
   * Get difficulty color based on level
   */
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'from-sky-400 to-sky-500';
      case 'Easy':
        return 'from-green-500 to-green-600';
      case 'Medium':
        return 'from-lime-500 to-lime-600';
      case 'Intermediate':
        return 'from-yellow-500 to-yellow-600';
      case 'Hard':
        return 'from-orange-500 to-orange-600';
      case 'Advanced':
        return 'from-red-500 to-red-600';
      case 'Expert':
        return 'from-purple-500 to-purple-600';
      case 'Master':
        return 'from-pink-600 to-rose-700';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  /**
   * Get difficulty ring color
   */
  const getDifficultyRingColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'ring-sky-300';
      case 'Easy':
        return 'ring-green-300';
      case 'Medium':
        return 'ring-lime-300';
      case 'Intermediate':
        return 'ring-yellow-300';
      case 'Hard':
        return 'ring-orange-300';
      case 'Advanced':
        return 'ring-red-300';
      case 'Expert':
        return 'ring-purple-300';
      case 'Master':
        return 'ring-pink-300';
      default:
        return 'ring-gray-300';
    }
  };

  /**
   * Get difficulty description
   */
  const getDifficultyDescription = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return '1 octave, whole/half/quarter notes, 5% rests';
      case 'Easy':
        return '2 octaves, simple rhythms, 10% rests';
      case 'Medium':
        return '3 octaves, eighth notes, 15% rests';
      case 'Intermediate':
        return '4 octaves, sixteenth notes, 18% rests';
      case 'Hard':
        return '5 octaves, complex syncopation, 20% rests';
      case 'Advanced':
        return '6 octaves, dense patterns, 22% rests';
      case 'Expert':
        return '7 octaves, irregular groupings, 25% rests';
      case 'Master':
        return '8 octaves, professional level, 30% rests';
      default:
        return '';
    }
  };

  return (
    <div className="settings-panel bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="mb-6 flex items-center">
        <Settings className="text-blue-600 mr-3" size={28} />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Generator Settings</h2>
          <p className="text-sm text-gray-600">Customize your sight-reading practice</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Clef Selection */}
        <div className="setting-group">
          <label className="flex items-center text-lg font-semibold text-gray-700 mb-3">
            <Music className="mr-2 text-indigo-500" size={20} />
            Clef
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleChange('clef', 'treble')}
              className={`px-6 py-4 rounded-xl font-bold transition-all duration-200 ${
                settings.clef === 'treble' || !settings.clef
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105 ring-4 ring-blue-300 ring-opacity-50'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="text-4xl mb-1">𝄞</div>
              <div className="text-sm">Treble Clef</div>
            </button>
            <button
              onClick={() => handleChange('clef', 'bass')}
              className={`px-6 py-4 rounded-xl font-bold transition-all duration-200 ${
                settings.clef === 'bass'
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg scale-105 ring-4 ring-purple-300 ring-opacity-50'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="text-4xl mb-1">𝄢</div>
              <div className="text-sm">Bass Clef</div>
            </button>
            <button
              onClick={() => handleChange('clef', 'both')}
              className={`px-6 py-4 rounded-xl font-bold transition-all duration-200 ${
                settings.clef === 'both'
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg scale-105 ring-4 ring-indigo-300 ring-opacity-50'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="text-2xl mb-1">𝄞 𝄢</div>
              <div className="text-sm">Both (Piano)</div>
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            {settings.clef === 'bass' ? 'Lower range notes (C0-B7)' : settings.clef === 'both' ? 'Grand staff - both treble and bass clefs together (piano music)' : 'Higher range notes (C1-B8)'}
          </p>
        </div>

        {/* Key Signature Selection */}
        <div className="setting-group">
          <label className="flex items-center text-lg font-semibold text-gray-700 mb-3">
            <Music className="mr-2 text-blue-500" size={20} />
            Key Signature
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {keySignatures.map((key) => (
              <button
                key={key}
                onClick={() => handleChange('keySignature', key)}
                className={`px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  settings.keySignature === key
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {key}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Selected: <span className="font-semibold">{settings.keySignature} major</span>
          </p>
        </div>

        {/* Time Signature Selection */}
        <div className="setting-group">
          <label className="flex items-center text-lg font-semibold text-gray-700 mb-3">
            <Clock className="mr-2 text-purple-500" size={20} />
            Time Signature
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {timeSignatures.map((time) => (
              <button
                key={time}
                onClick={() => handleChange('timeSignature', time)}
                className={`px-4 py-3 rounded-lg font-bold transition-all duration-200 ${
                  settings.timeSignature === time
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-gray-500">
            {settings.timeSignature.split('/')[0]} beats per measure
          </p>
        </div>

        {/* Difficulty Selection */}
        <div className="setting-group">
          <label className="flex items-center text-lg font-semibold text-gray-700 mb-3">
            <BarChart3 className="mr-2 text-green-500" size={20} />
            Difficulty Level
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => handleChange('difficulty', difficulty)}
                className={`relative px-4 py-3 rounded-xl font-bold transition-all duration-200 overflow-hidden ${
                  settings.difficulty === difficulty
                    ? `bg-gradient-to-r ${getDifficultyColor(difficulty)} text-white shadow-lg scale-105 ring-4 ring-opacity-50 ${getDifficultyRingColor(difficulty)}`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="text-lg mb-1">{difficulty}</div>
                <div className="text-xs opacity-90 leading-tight">{getDifficultyDescription(difficulty)}</div>
                {settings.difficulty === difficulty && (
                  <div className="absolute top-2 right-2">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Number of Measures (Optional) */}
        <div className="setting-group">
          <label className="flex items-center justify-between text-lg font-semibold text-gray-700 mb-3">
            <span className="flex items-center">
              <Music className="mr-2 text-indigo-500" size={20} />
              Number of Measures
            </span>
            <span className="text-2xl font-bold text-indigo-600">{settings.measures || 'Auto'}</span>
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="4"
              max="16"
              value={settings.measures || (() => {
                const defaults = { Beginner: 4, Easy: 4, Medium: 8, Intermediate: 8, Hard: 12, Advanced: 12, Expert: 16, Master: 16 };
                return defaults[settings.difficulty] || 8;
              })()}
              onChange={(e) => handleChange('measures', parseInt(e.target.value))}
              className="flex-1 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <button
              onClick={() => handleChange('measures', null)}
              className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
            >
              Auto
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            {settings.measures
              ? `${settings.measures} measures will be generated`
              : 'Automatically determined by difficulty level'}
          </p>
        </div>
      </div>

      {/* Current Settings Summary */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-gray-800 mb-2">Current Configuration:</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Clef:</span>
            <span className="font-semibold text-gray-800">
              {settings.clef === 'bass' ? 'Bass (𝄢)' : settings.clef === 'both' ? 'Both (𝄞 𝄢)' : 'Treble (𝄞)'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Key:</span>
            <span className="font-semibold text-gray-800">{settings.keySignature} major</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Time:</span>
            <span className="font-semibold text-gray-800">{settings.timeSignature}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Difficulty:</span>
            <span className="font-semibold text-gray-800">{settings.difficulty}</span>
          </div>
          <div className="flex justify-between col-span-2">
            <span className="text-gray-600">Measures:</span>
            <span className="font-semibold text-gray-800">
              {settings.measures || (settings.difficulty === 'Easy' ? 4 : settings.difficulty === 'Medium' ? 8 : 12)}
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default SettingsPanel;
