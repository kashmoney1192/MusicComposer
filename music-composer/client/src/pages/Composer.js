import React from 'react';
import { MusicProvider } from '../contexts/MusicContext';
import ToolBar from '../components/composer/ToolBar';
import NotePalette from '../components/composer/NotePalette';
import NoteEditor from '../components/composer/NoteEditor';
import PianoKeyboard from '../components/composer/PianoKeyboard';
import PlaybackControls from '../components/composer/PlaybackControls';
import ExportButtons from '../components/composer/ExportButtons';
import KeyboardLegend from '../components/composer/KeyboardLegend';

/**
 * Composer Page - Main composition interface
 * Integrates all music editor components with the MusicContext
 */
const Composer = () => {
  return (
    <MusicProvider>
      <div className="composer-page min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-3">
              Music Composer
            </h1>
            <p className="text-xl text-gray-600">
              Create beautiful sheet music with an intuitive click-to-compose interface
            </p>
          </div>

          {/* Tool Selection Bar */}
          <div className="mb-8">
            <ToolBar />
          </div>

          {/* Note Palette - Drag & Drop */}
          <div className="mb-8">
            <NotePalette />
          </div>

          {/* Piano Keyboard */}
          <div className="mb-8">
            <PianoKeyboard />
          </div>

          {/* Main Editor with Legend */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              {/* Legend on the left for large screens */}
              <div className="hidden lg:block">
                <KeyboardLegend />
              </div>

              {/* Note Editor */}
              <div className="flex-1">
                <NoteEditor />
              </div>

              {/* Legend on top for small/medium screens */}
              <div className="lg:hidden w-full">
                <KeyboardLegend />
              </div>
            </div>
          </div>

          {/* Playback and Export Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <PlaybackControls />
            <ExportButtons />
          </div>

          {/* Help Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Getting Started</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Three Ways to Compose</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li><strong>Drag & Drop:</strong> Drag notes from the palette onto the staff</li>
                  <li><strong>Keyboard:</strong> Press A-; keys to play and add notes</li>
                  <li><strong>Click:</strong> Click on the piano or staff to place notes</li>
                  <li>Customize with accidentals, time signatures, and more!</li>
                  <li>Play back your composition with MIDI playback</li>
                  <li>Export to PDF or MIDI when done</li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-purple-600 mb-2">Keyboard Shortcuts</h3>
                <ul className="space-y-2 text-gray-700">
                  <li><kbd className="px-2 py-1 bg-gray-200 rounded">A-;</kbd> - Play piano notes C4-E5</li>
                  <li><kbd className="px-2 py-1 bg-gray-200 rounded">Arrow Keys</kbd> - Navigate position</li>
                  <li><kbd className="px-2 py-1 bg-gray-200 rounded">Enter</kbd> - Next measure</li>
                  <li><kbd className="px-2 py-1 bg-gray-200 rounded">Delete</kbd> - Remove selected note</li>
                  <li><kbd className="px-2 py-1 bg-gray-200 rounded">+/-</kbd> - Add/remove measure</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
                <div>
                  <h4 className="font-semibold text-blue-600 mb-1">Editor</h4>
                  <ul className="space-y-1">
                    <li>• Drag & drop note placement</li>
                    <li>• Interactive piano keyboard</li>
                    <li>• Real-time keyboard input</li>
                    <li>• Multiple time signatures</li>
                    <li>• Key signature support</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-green-600 mb-1">Playback</h4>
                  <ul className="space-y-1">
                    <li>• Real-time MIDI playback</li>
                    <li>• Adjustable tempo</li>
                    <li>• Volume control</li>
                    <li>• Play/pause/stop controls</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-600 mb-1">Export</h4>
                  <ul className="space-y-1">
                    <li>• Export to PDF</li>
                    <li>• Export to MIDI</li>
                    <li>• Auto-save to browser</li>
                    <li>• JSON export for backup</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MusicProvider>
  );
};

export default Composer;
