import React, { useState } from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';
import { useDevice } from '../../contexts/DeviceContext';
import { generateMusic } from '../../utils/musicGenerator';
import SettingsPanel from './SettingsPanel';
import MusicDisplay from './MusicDisplay';
import PlaybackControls from './PlaybackControls';

/**
 * SightReadingGenerator Component
 * Main component that orchestrates the sight-reading music generation
 * Combines settings, music display, and playback controls
 */
const SightReadingGenerator = () => {
  const { isMobile, isTablet } = useDevice();

  // Default settings
  const [settings, setSettings] = useState({
    clef: 'treble',
    keySignature: 'C',
    timeSignature: '4/4',
    difficulty: 'Easy',
    measures: null, // null = auto-determine based on difficulty
  });

  // Generated music notes
  const [generatedNotes, setGeneratedNotes] = useState([]);

  // Generation counter for tracking regenerations
  const [generationCount, setGenerationCount] = useState(0);

  /**
   * Handle settings change from SettingsPanel
   */
  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
  };

  /**
   * Generate new random music based on current settings
   */
  const handleGenerate = () => {
    console.log('Generating music with settings:', settings);

    // Generate random music using the utility function
    const notes = generateMusic(settings);

    console.log('Generated notes:', notes);

    // Update state
    setGeneratedNotes(notes);
    setGenerationCount(prev => prev + 1);
  };

  /**
   * Regenerate music (same as generate, but with visual feedback)
   */
  const handleRegenerate = () => {
    handleGenerate();
  };

  return (
    <div className={`sight-reading-generator ${isMobile ? 'max-w-full p-3' : isTablet ? 'max-w-5xl p-4' : 'max-w-7xl p-6'} mx-auto space-y-6`}>
      {/* Header */}
      <div className={`text-center ${isMobile ? 'mb-4' : 'mb-8'}`}>
        <h1 className={`${isMobile ? 'text-2xl' : isTablet ? 'text-3xl' : 'text-4xl'} font-bold text-gray-800 ${isMobile ? 'mb-2' : 'mb-3'}`}>
          Sight Reading Practice Generator
        </h1>
        <p className={`${isMobile ? 'text-sm' : isTablet ? 'text-base' : 'text-lg'} text-gray-600`}>
          Generate random sheet music to improve your sight-reading skills
        </p>
      </div>

      {/* Settings Panel */}
      <SettingsPanel
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />

      {/* Generate Button */}
      <div className={`flex ${isMobile ? 'flex-col' : 'items-center justify-center'} gap-4`}>
        <button
          onClick={handleGenerate}
          className={`generate-button flex items-center justify-center gap-3 ${isMobile ? 'w-full px-4 py-3 text-sm' : isTablet ? 'px-6 py-3 text-base' : 'px-8 py-4 text-lg'} bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl shadow-xl hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 whitespace-nowrap`}
        >
          <Sparkles size={isMobile ? 18 : 24} />
          {generationCount === 0 ? 'Generate Music' : 'Generate New Music'}
        </button>

        {generationCount > 0 && (
          <button
            onClick={handleRegenerate}
            className={`regenerate-button flex items-center justify-center gap-2 ${isMobile ? 'w-full px-4 py-3 text-sm' : isTablet ? 'px-6 py-3 text-base' : 'px-6 py-4 text-lg'} bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold rounded-xl shadow-xl hover:from-blue-600 hover:to-cyan-700 transform hover:scale-105 transition-all duration-200 whitespace-nowrap`}
          >
            <RotateCcw size={isMobile ? 16 : 20} />
            Regenerate
          </button>
        )}
      </div>

      {/* Generation Counter */}
      {generationCount > 0 && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full border-2 border-purple-300">
            <span className="text-sm font-semibold text-purple-700">
              Generation #{generationCount}
            </span>
          </div>
        </div>
      )}

      {/* Music Display */}
      <MusicDisplay
        notes={generatedNotes}
        settings={settings}
      />

      {/* Playback Controls */}
      <PlaybackControls
        notes={generatedNotes}
        tempo={120}
      />

      {/* Practice Tips */}
      <div className={`practice-tips bg-gradient-to-br from-green-50 to-teal-50 rounded-xl ${isMobile ? 'p-4' : 'p-6'} border-2 border-green-200 shadow-lg`}>
        <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-gray-800 ${isMobile ? 'mb-3' : 'mb-4'} flex items-center`}>
          <span className={`${isMobile ? 'text-xl' : 'text-2xl'} mr-2`}>💡</span>
          Sight-Reading Practice Tips
        </h3>
        <div className={`grid grid-cols-1 ${isTablet ? 'md:grid-cols-2' : 'md:grid-cols-2'} gap-4 text-sm text-gray-700`}>
          <div className="tip-card bg-white rounded-lg p-4 shadow">
            <div className="font-semibold text-green-700 mb-1">1. Scan First</div>
            <p>Before playing, quickly scan the entire piece to identify key signature, time signature, and difficult passages.</p>
          </div>
          <div className="tip-card bg-white rounded-lg p-4 shadow">
            <div className="font-semibold text-blue-700 mb-1">2. Keep Going</div>
            <p>Don't stop if you make a mistake. Keep the rhythm steady and maintain forward momentum.</p>
          </div>
          <div className="tip-card bg-white rounded-lg p-4 shadow">
            <div className="font-semibold text-purple-700 mb-1">3. Look Ahead</div>
            <p>Train your eyes to read 1-2 measures ahead of what you're currently playing.</p>
          </div>
          <div className="tip-card bg-white rounded-lg p-4 shadow">
            <div className="font-semibold text-orange-700 mb-1">4. Practice Daily</div>
            <p>Consistent daily practice is more effective than long, infrequent sessions. Generate new pieces regularly!</p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="how-it-works bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="text-2xl mr-2">⚙️</span>
          How It Works
        </h3>
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <div className="font-semibold mb-1">Scale Selection</div>
              <p>The generator uses the selected key signature to choose notes from the appropriate scale (e.g., C major scale for key of C).</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <div className="font-semibold mb-1">Rhythm Patterns</div>
              <p>Random rhythm patterns are selected based on difficulty. Easy uses simple rhythms (quarters/halves), while Hard includes complex patterns with sixteenth notes.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <div className="font-semibold mb-1">Note Range</div>
              <p>The difficulty level controls the octave range: Easy (2 octaves), Medium (3 octaves), Hard (4 octaves).</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
              4
            </div>
            <div>
              <div className="font-semibold mb-1">Rest Probability</div>
              <p>Rests are randomly inserted based on difficulty: Easy (10%), Medium (15%), Hard (20%) to add reading complexity.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
              5
            </div>
            <div>
              <div className="font-semibold mb-1">Measure Filling</div>
              <p>Each measure is automatically filled to match the time signature, ensuring proper rhythmic notation.</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .generate-button,
        .regenerate-button {
          animation: pulse-subtle 2s ease-in-out infinite;
        }

        @keyframes pulse-subtle {
          0%, 100% {
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
          }
          50% {
            box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.3);
          }
        }

        .tip-card {
          transition: all 0.2s ease;
        }

        .tip-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default SightReadingGenerator;
