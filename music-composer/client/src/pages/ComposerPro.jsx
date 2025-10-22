import React, { useState } from 'react';
import { MusicProvider } from '../contexts/MusicContext';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { useDevice } from '../contexts/DeviceContext';
import StaffView from '../components/composer/StaffView';
import PlaybackControls from '../components/composer/PlaybackControls';
import ExportPanel from '../components/composer/ExportPanel';
import ScoreSettings from '../components/composer/ScoreSettings';
import Metronome from '../components/composer/Metronome';
import KeyboardShortcutsHelp from '../components/composer/KeyboardShortcutsHelp';
import AutoSave from '../components/composer/AutoSave';
import ChordLibrary from '../components/composer/ChordLibrary';
import MeasureNavigator from '../components/composer/MeasureNavigator';
import WelcomeTutorial from '../components/composer/WelcomeTutorial';
import { Settings, Play, Keyboard } from 'lucide-react';

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
  const [playbackOpen, setPlaybackOpen] = useState(true);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const { isMobile, isTablet } = useDevice();

  const handleNewComposition = () => {
    if (window.confirm('Start a new composition? Any unsaved changes will be lost.')) {
      // This would call newComposition from MusicContext
      window.location.reload();
    }
  };

  const handleSave = () => {
    alert('Composition saved to browser storage!');
    // Already handled by auto-save in MusicContext
  };

  const handleLoad = () => {
    // This would trigger load from MusicContext
    alert('Load functionality - check browser storage');
  };

  return (
    <div className="composer-pro h-screen flex flex-col bg-white">
      {/* Simple Header */}
      <div className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4">
        <div className={`flex ${isMobile ? 'flex-col gap-3' : 'items-center justify-between'}`}>
          <h1 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-gray-800`}>Music Composer</h1>
          <div className={`flex gap-2 ${isMobile ? 'flex-wrap' : ''}`}>
            <button
              onClick={() => setShortcutsOpen(true)}
              className={`${isMobile ? 'px-2 py-1 text-xs' : 'px-4 py-2'} bg-purple-500 text-white rounded hover:bg-purple-600 flex items-center gap-2 whitespace-nowrap`}
              title="Keyboard Shortcuts"
            >
              <Keyboard size={isMobile ? 14 : 18} />
              <span className={isMobile ? 'hidden' : ''}>Shortcuts</span>
            </button>
            <button
              onClick={handleNewComposition}
              className={`${isMobile ? 'px-2 py-1 text-xs' : 'px-4 py-2'} bg-blue-500 text-white rounded hover:bg-blue-600 whitespace-nowrap`}
            >
              {isMobile ? 'New' : 'New'}
            </button>
            <button
              onClick={handleSave}
              className={`${isMobile ? 'px-2 py-1 text-xs' : 'px-4 py-2'} bg-green-500 text-white rounded hover:bg-green-600 whitespace-nowrap`}
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 flex overflow-hidden bg-white ${isMobile || isTablet ? 'flex-col' : ''}`}>
        {/* Center - Staff View */}
        <div className={`${isMobile || isTablet ? 'flex-1' : 'flex-1'} overflow-y-auto ${isMobile ? 'p-2' : isTablet ? 'p-4' : 'p-8'} bg-white`}>
          <div className={`${isMobile ? 'max-w-full' : isTablet ? 'max-w-4xl' : 'max-w-6xl'} mx-auto`}>
            <StaffView />
          </div>
        </div>

        {/* Right Sidebar - Tools & Controls (Collapsible) - Hidden on mobile, overlay on tablet */}
        <div className={`transition-all duration-300 border-l border-gray-200 bg-white flex flex-col ${
          isMobile
            ? 'hidden'
            : isTablet
              ? (playbackOpen ? 'fixed bottom-0 right-0 left-0 h-64 border-t border-l-0 z-40' : 'hidden')
              : (playbackOpen ? 'w-96' : 'w-12')
        }`}>
          {playbackOpen ? (
            <>
              {/* Fixed Header */}
              <div className="flex-shrink-0 p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Play size={20} />
                    Tools & Controls
                  </h3>
                  <button
                    onClick={() => setPlaybackOpen(false)}
                    className="p-1 hover:bg-gray-100 rounded text-gray-600"
                    title="Hide Tools"
                  >
                    →
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-6">
                  {/* Measure Navigator */}
                  <MeasureNavigator />

                  {/* Metronome */}
                  <Metronome />

                  {/* Chord Library */}
                  <ChordLibrary />

                  {/* Playback */}
                  <PlaybackControls />

                  {/* Export */}
                  <ExportPanel />
                </div>
              </div>
            </>
          ) : (
            <button
              onClick={() => setPlaybackOpen(true)}
              className="w-full h-full flex items-center justify-center hover:bg-gray-100 transition-colors"
              title="Show Tools"
            >
              <Play size={20} className="text-gray-600 rotate-180" />
            </button>
          )}
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
