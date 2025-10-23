import React, { useState } from 'react';
import { MusicProvider, useMusicContext } from '../contexts/MusicContext';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { useDevice } from '../contexts/DeviceContext';
import StaffView from '../components/composer/StaffView';
import ScoreSettings from '../components/composer/ScoreSettings';
import KeyboardShortcutsHelp from '../components/composer/KeyboardShortcutsHelp';
import AutoSave from '../components/composer/AutoSave';
import WelcomeTutorial from '../components/composer/WelcomeTutorial';
import { Settings, Keyboard, Plus, Minus } from 'lucide-react';

/**
 * ComposerPro Component
 * Professional MuseScore-style music composition interface
 *
 * Features:
 * - Clean, professional MuseScore-inspired UI
 * - Dark/light theme toggle
 * - Collapsible settings sidebar
 * - Comprehensive toolbar with all note input options
 * - Multi-measure, multi-system staff view
 * - MIDI input support
 * - Keyboard shortcuts
 * - Export to PDF, MIDI, MusicXML
 * - Undo/Redo functionality
 *
 * Architecture:
 * - Uses MusicContext for global state management
 * - ThemeProvider for dark/light mode
 * - Modular component structure
 * - VexFlow for notation rendering
 * - Tone.js for playback
 * - Web MIDI API for MIDI input
 */
const ComposerProContent = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const { isMobile, isTablet } = useDevice();
  const { addMeasure, removeMeasure, measureCount } = useMusicContext();

  return (
    <div className="composer-pro h-screen flex flex-col bg-white">
      {/* Simple Header */}
      <div className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4">
        <div className={`flex ${isMobile ? 'flex-col gap-3' : 'items-center justify-between'}`}>
          <h1 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-gray-800`}>Music Composer</h1>
          <div className={`flex gap-2 ${isMobile ? 'flex-wrap' : ''}`}>
            {/* Measure Controls */}
            <div className={`flex gap-2 items-center px-3 py-1 bg-gray-100 rounded-lg ${isMobile ? 'text-xs' : ''}`}>
              <button
                onClick={addMeasure}
                className={`${isMobile ? 'p-1' : 'px-2 py-1'} bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-1 transition-colors`}
                title="Add Measure"
              >
                <Plus size={isMobile ? 14 : 16} />
                <span className={isMobile ? 'hidden' : 'text-xs'}>Add</span>
              </button>
              <span className={`font-semibold text-gray-700 ${isMobile ? 'text-xs' : ''}`}>{measureCount}</span>
              <button
                onClick={removeMeasure}
                className={`${isMobile ? 'p-1' : 'px-2 py-1'} bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-1 transition-colors`}
                title="Remove Last Measure"
              >
                <Minus size={isMobile ? 14 : 16} />
                <span className={isMobile ? 'hidden' : 'text-xs'}>Remove</span>
              </button>
            </div>

            {/* Keyboard Shortcuts Button */}
            <button
              onClick={() => setShortcutsOpen(true)}
              className={`${isMobile ? 'px-2 py-1 text-xs' : 'px-4 py-2'} bg-purple-500 text-white rounded hover:bg-purple-600 flex items-center gap-2 whitespace-nowrap`}
              title="Keyboard Shortcuts"
            >
              <Keyboard size={isMobile ? 14 : 18} />
              <span className={isMobile ? 'hidden' : ''}>Shortcuts</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area - Clean Staff View Only */}
      <div className={`flex-1 overflow-y-auto ${isMobile ? 'p-2' : isTablet ? 'p-4' : 'p-8'} bg-white`}>
        <div className={`${isMobile ? 'max-w-full' : isTablet ? 'max-w-4xl' : 'max-w-6xl'} mx-auto`}>
          <StaffView />
        </div>
      </div>

      {/* Floating Settings Button */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => setSettingsOpen(true)}
          className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all transform hover:scale-110"
          title="Score Settings"
        >
          <Settings size={24} />
        </button>
      </div>

      {/* Settings Sidebar */}
      <ScoreSettings
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      {/* Overlay when settings open */}
      {settingsOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSettingsOpen(false)}
        />
      )}

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcutsHelp
        isOpen={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
      />

      {/* Auto-Save Status Bar */}
      <AutoSave />

      {/* Welcome Tutorial for first-time users */}
      <WelcomeTutorial />
    </div>
  );
};

/**
 * Main ComposerPro with Providers
 */
const ComposerPro = () => {
  return (
    <ThemeProvider>
      <MusicProvider>
        <ComposerProContent />
      </MusicProvider>
    </ThemeProvider>
  );
};

export default ComposerPro;
