import React from 'react';
import {
  Undo2,
  Redo2,
  Save,
  FolderOpen,
  FileText,
  Music,
  Clock,
  Key,
  Plus,
  Minus
} from 'lucide-react';
import { useMusicContext } from '../../contexts/MusicContext';

/**
 * ComposerToolbar Component
 * MuseScore-style toolbar with note values, accidentals, key/time signatures, and undo/redo
 *
 * This is the main toolbar that provides quick access to:
 * - Note durations (whole, half, quarter, eighth, sixteenth notes)
 * - Rests
 * - Accidentals (sharp, flat, natural)
 * - Undo/Redo functionality
 * - File operations (New, Save, Load)
 * - Key and time signatures
 *
 * The toolbar connects to MusicContext to update the selected tool
 * which determines what will be placed when clicking on the staff
 */
const ComposerToolbar = ({ onNewComposition, onSave, onLoad, onExport }) => {
  const {
    selectedTool,
    setSelectedTool,
    undo,
    redo,
    canUndo,
    canRedo,
    measureCount,
    setMeasureCount
  } = useMusicContext();

  // Note duration options with their display values
  const noteDurations = [
    { value: 'w', label: '𝅝', name: 'Whole Note', beats: 4 },
    { value: 'h', label: '𝅗𝅥', name: 'Half Note', beats: 2 },
    { value: 'q', label: '♩', name: 'Quarter Note', beats: 1 },
    { value: '8', label: '♪', name: 'Eighth Note', beats: 0.5 },
    { value: '16', label: '𝅘𝅥𝅯', name: 'Sixteenth Note', beats: 0.25 }
  ];

  // Accidental options
  const accidentals = [
    { value: '#', label: '♯', name: 'Sharp' },
    { value: 'b', label: '♭', name: 'Flat' },
    { value: 'n', label: '♮', name: 'Natural' },
    { value: null, label: 'None', name: 'No Accidental' }
  ];

  /**
   * Handle note duration selection
   * Updates the selected tool to use the chosen duration
   */
  const handleDurationChange = (duration) => {
    setSelectedTool(prev => ({ ...prev, duration, type: 'note' }));
  };

  /**
   * Handle rest selection
   * Updates the selected tool to rest mode with chosen duration
   */
  const handleRestChange = (duration) => {
    setSelectedTool(prev => ({ ...prev, duration, type: 'rest' }));
  };

  /**
   * Handle accidental selection
   * Updates the selected tool to apply the chosen accidental
   */
  const handleAccidentalChange = (accidental) => {
    setSelectedTool(prev => ({ ...prev, accidental }));
  };

  /**
   * Add a new measure to the composition
   */
  const handleAddMeasure = () => {
    setMeasureCount(prev => prev + 1);
  };

  /**
   * Remove the last measure from the composition
   */
  const handleRemoveMeasure = () => {
    if (measureCount > 1) {
      setMeasureCount(prev => prev - 1);
    }
  };

  return (
    <div className="composer-toolbar bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-md">
      {/* Main Toolbar Container */}
      <div className="px-4 py-2">
        {/* Top Row: File Operations and Undo/Redo */}
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
          {/* File Operations */}
          <div className="flex items-center gap-2">
            <button
              onClick={onNewComposition}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title="New Composition"
            >
              <FileText size={18} />
              <span className="hidden sm:inline">New</span>
            </button>
            <button
              onClick={onSave}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title="Save Composition"
            >
              <Save size={18} />
              <span className="hidden sm:inline">Save</span>
            </button>
            <button
              onClick={onLoad}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title="Load Composition"
            >
              <FolderOpen size={18} />
              <span className="hidden sm:inline">Load</span>
            </button>

            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />

            {/* Undo/Redo */}
            <button
              onClick={undo}
              disabled={!canUndo}
              className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                canUndo
                  ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
              }`}
              title="Undo (Ctrl+Z)"
            >
              <Undo2 size={18} />
              <span className="hidden sm:inline">Undo</span>
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                canRedo
                  ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
              }`}
              title="Redo (Ctrl+Y)"
            >
              <Redo2 size={18} />
              <span className="hidden sm:inline">Redo</span>
            </button>
          </div>

          {/* Measure Controls */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Measures: {measureCount}
            </span>
            <button
              onClick={handleRemoveMeasure}
              disabled={measureCount <= 1}
              className={`p-1.5 rounded transition-colors ${
                measureCount > 1
                  ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
              }`}
              title="Remove Measure"
            >
              <Minus size={16} />
            </button>
            <button
              onClick={handleAddMeasure}
              className="p-1.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title="Add Measure"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Bottom Row: Note Input Tools */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Note Durations */}
          <div className="flex items-center gap-1">
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 mr-2">
              <Music size={14} className="inline-block mr-1" />
              Notes:
            </span>
            <div className="flex gap-1">
              {noteDurations.map((note) => (
                <button
                  key={note.value}
                  onClick={() => handleDurationChange(note.value)}
                  className={`w-10 h-10 flex items-center justify-center text-2xl rounded transition-all ${
                    selectedTool.type === 'note' && selectedTool.duration === note.value
                      ? 'bg-blue-500 text-white shadow-lg scale-110'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  title={`${note.name} (${note.beats} beat${note.beats !== 1 ? 's' : ''})`}
                >
                  {note.label}
                </button>
              ))}
            </div>
          </div>

          <div className="w-px h-8 bg-gray-300 dark:bg-gray-600" />

          {/* Rests */}
          <div className="flex items-center gap-1">
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 mr-2">
              Rests:
            </span>
            <div className="flex gap-1">
              {noteDurations.slice(0, 4).map((rest) => (
                <button
                  key={`rest-${rest.value}`}
                  onClick={() => handleRestChange(rest.value)}
                  className={`w-10 h-10 flex items-center justify-center text-xl rounded transition-all ${
                    selectedTool.type === 'rest' && selectedTool.duration === rest.value
                      ? 'bg-purple-500 text-white shadow-lg scale-110'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  title={`${rest.name} Rest`}
                >
                  {rest.value === 'w' ? '𝄻' : rest.value === 'h' ? '𝄼' : rest.value === 'q' ? '𝄽' : '𝄾'}
                </button>
              ))}
            </div>
          </div>

          <div className="w-px h-8 bg-gray-300 dark:bg-gray-600" />

          {/* Accidentals */}
          <div className="flex items-center gap-1">
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 mr-2">
              <Key size={14} className="inline-block mr-1" />
              Accidentals:
            </span>
            <div className="flex gap-1">
              {accidentals.map((acc) => (
                <button
                  key={acc.value || 'none'}
                  onClick={() => handleAccidentalChange(acc.value)}
                  className={`w-10 h-10 flex items-center justify-center text-xl font-bold rounded transition-all ${
                    selectedTool.accidental === acc.value
                      ? 'bg-green-500 text-white shadow-lg scale-110'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  title={acc.name}
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tool Info Display */}
      <div className="px-4 py-1.5 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <div>
            <span className="font-semibold">Current Tool:</span>{' '}
            {selectedTool.type === 'rest' ? 'Rest' : 'Note'} -{' '}
            {noteDurations.find(n => n.duration === selectedTool.duration)?.name || 'Quarter'}{' '}
            {selectedTool.accidental && (
              <>({accidentals.find(a => a.value === selectedTool.accidental)?.name})</>
            )}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500">
            Click on staff to place notes • Use keyboard shortcuts for quick input
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComposerToolbar;
