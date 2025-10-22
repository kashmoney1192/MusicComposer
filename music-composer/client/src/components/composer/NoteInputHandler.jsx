import React, { useEffect, useState, useCallback } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useMusicContext } from '../../contexts/MusicContext';
import { Music2, Keyboard, AlertCircle } from 'lucide-react';

/**
 * NoteInputHandler Component
 * Handles keyboard shortcuts and MIDI input for note entry
 *
 * Features:
 * - Keyboard shortcuts for note durations (1-6 keys)
 * - Keyboard shortcuts for accidentals (S, F, N keys)
 * - Keyboard shortcuts for note names (A-G keys)
 * - Arrow keys for pitch transposition (up/down)
 * - Backspace/Delete for removing selected notes
 * - Space bar for playback toggle
 * - Keyboard shortcuts for undo/redo (Ctrl+Z, Ctrl+Y)
 * - MIDI input support for playing notes from external keyboard
 * - Real-time feedback of MIDI connection status
 * - Note velocity mapping from MIDI
 *
 * MIDI Integration:
 * - Uses Web MIDI API to connect to MIDI devices
 * - Automatically detects and connects to first available MIDI input
 * - Maps MIDI note numbers to pitch notation
 * - Handles note-on and note-off events
 */
const NoteInputHandler = () => {
  const {
    setSelectedTool,
    selectedTool,
    undo,
    redo,
    addNote,
    removeNote,
    updateNote,
    selectedNoteId,
    notes,
    isPlaying,
    setIsPlaying,
    clef,
    measureCount,
    addNoteAtCursor,
    addChordAtCursor,
    moveCursorForward,
    moveCursorBackward,
    inputMode,
    setInputMode,
    chordNotes,
    setChordNotes
  } = useMusicContext();

  const [midiAccess, setMidiAccess] = useState(null);
  const [midiInputs, setMidiInputs] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [lastMidiNote, setLastMidiNote] = useState(null);
  const [currentOctave, setCurrentOctave] = useState(4); // Default to octave 4 (middle C)

  /**
   * Map MIDI note number to pitch notation
   * Middle C (C4) = MIDI note 60
   */
  const midiNoteToPitch = (midiNote) => {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(midiNote / 12) - 1;
    const noteName = noteNames[midiNote % 12];
    return `${noteName}/${octave}`;
  };

  /**
   * Add a note with given letter name using MuseScore-style cursor input
   * This replaces the old Shift+letter approach
   */
  const addNoteByLetter = useCallback((noteLetter) => {
    if (inputMode === 'chord') {
      // In chord mode, accumulate notes
      setChordNotes(prev => {
        if (!prev.includes(noteLetter)) {
          return [...prev, noteLetter];
        }
        return prev;
      });
    } else {
      // Regular note input - add at cursor and advance
      addNoteAtCursor(noteLetter);
    }
  }, [addNoteAtCursor, inputMode, setChordNotes]);

  /**
   * Finalize chord input (called when Shift is released or Space is pressed)
   */
  const finalizeChord = useCallback(() => {
    if (chordNotes.length > 0) {
      addChordAtCursor(chordNotes);
      setChordNotes([]);
      setInputMode('note');
    }
  }, [chordNotes, addChordAtCursor, setChordNotes, setInputMode]);

  /**
   * Transpose selected note up or down by one semitone
   */
  const transposeSelectedNote = useCallback((direction) => {
    if (!selectedNoteId) return;

    const selectedNote = notes.find(n => n.id === selectedNoteId);
    if (!selectedNote) return;

    // Parse current pitch (e.g., "C/4" -> note: C, octave: 4)
    const [noteName, octaveStr] = selectedNote.pitch.split('/');
    let octave = parseInt(octaveStr);

    // Note sequence with semitones
    const chromaticScale = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const diatonicScale = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

    // Find current position in diatonic scale
    let currentIndex = diatonicScale.indexOf(noteName.replace(/[#b]/, ''));

    // Move up or down the diatonic scale
    if (direction === 'up') {
      currentIndex++;
      if (currentIndex >= diatonicScale.length) {
        currentIndex = 0;
        octave++;
      }
    } else {
      currentIndex--;
      if (currentIndex < 0) {
        currentIndex = diatonicScale.length - 1;
        octave--;
      }
    }

    const newNoteName = diatonicScale[currentIndex];
    const newPitch = `${newNoteName}/${octave}`;

    updateNote(selectedNoteId, { pitch: newPitch });
  }, [selectedNoteId, notes, updateNote]);

  /**
   * Delete the currently selected note
   */
  const deleteSelectedNote = useCallback(() => {
    if (selectedNoteId) {
      removeNote(selectedNoteId);
    }
  }, [selectedNoteId, removeNote]);

  /**
   * Initialize MIDI access
   * Request permission to access MIDI devices
   */
  useEffect(() => {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess()
        .then(access => {
          setMidiAccess(access);

          // Get all MIDI inputs
          const inputs = Array.from(access.inputs.values());
          setMidiInputs(inputs);

          // Auto-connect to first available input
          if (inputs.length > 0) {
            connectToMidiDevice(inputs[0]);
          }

          // Listen for device connection changes
          access.onstatechange = (e) => {
            if (e.port.type === 'input') {
              const inputs = Array.from(access.inputs.values());
              setMidiInputs(inputs);
            }
          };
        })
        .catch(err => {
          console.warn('MIDI Access not available:', err);
        });
    }
  }, []);

  /**
   * Connect to a specific MIDI device
   */
  const connectToMidiDevice = useCallback((device) => {
    if (connectedDevice) {
      connectedDevice.onmidimessage = null;
    }

    device.onmidimessage = handleMIDIMessage;
    setConnectedDevice(device);
  }, [connectedDevice]);

  /**
   * Handle incoming MIDI messages
   * Processes note-on and note-off events
   */
  const handleMIDIMessage = useCallback((message) => {
    const [command, note, velocity] = message.data;

    // Note-on event (command 144-159, velocity > 0)
    if (command >= 144 && command <= 159 && velocity > 0) {
      const pitch = midiNoteToPitch(note);
      setLastMidiNote({ pitch, velocity, note });

      // Add note to composition
      // We'll add to the first measure for now - can be enhanced to track current position
      addNote({
        pitch,
        measure: 1,
        beat: 0,
        position: 0
      });
    }

    // Note-off event (command 128-143 or note-on with velocity 0)
    if ((command >= 128 && command <= 143) || (command >= 144 && command <= 159 && velocity === 0)) {
      setLastMidiNote(null);
    }
  }, [addNote]);

  /**
   * Keyboard shortcuts for note durations
   */
  useHotkeys('1', () => setSelectedTool(prev => ({ ...prev, duration: 'w', type: 'note' })), []);
  useHotkeys('2', () => setSelectedTool(prev => ({ ...prev, duration: 'h', type: 'note' })), []);
  useHotkeys('3', () => setSelectedTool(prev => ({ ...prev, duration: 'q', type: 'note' })), []);
  useHotkeys('4', () => setSelectedTool(prev => ({ ...prev, duration: '8', type: 'note' })), []);
  useHotkeys('5', () => setSelectedTool(prev => ({ ...prev, duration: '16', type: 'note' })), []);
  useHotkeys('6', () => setSelectedTool(prev => ({ ...prev, duration: '32', type: 'note' })), []);

  /**
   * Keyboard shortcuts for rests
   */
  useHotkeys('shift+1', () => setSelectedTool(prev => ({ ...prev, duration: 'w', type: 'rest' })), []);
  useHotkeys('shift+2', () => setSelectedTool(prev => ({ ...prev, duration: 'h', type: 'rest' })), []);
  useHotkeys('shift+3', () => setSelectedTool(prev => ({ ...prev, duration: 'q', type: 'rest' })), []);
  useHotkeys('shift+4', () => setSelectedTool(prev => ({ ...prev, duration: '8', type: 'rest' })), []);
  useHotkeys('shift+5', () => setSelectedTool(prev => ({ ...prev, duration: '16', type: 'rest' })), []);
  useHotkeys('shift+6', () => setSelectedTool(prev => ({ ...prev, duration: '32', type: 'rest' })), []);

  /**
   * Keyboard shortcuts for accidentals
   */
  useHotkeys('s', () => setSelectedTool(prev => ({ ...prev, accidental: '#' })), []);
  useHotkeys('f', () => setSelectedTool(prev => ({ ...prev, accidental: 'b' })), []);
  useHotkeys('n', () => setSelectedTool(prev => ({ ...prev, accidental: 'n' })), []);
  useHotkeys('shift+n', () => setSelectedTool(prev => ({ ...prev, accidental: null })), []);

  /**
   * Keyboard shortcuts for note letters (A-G) - MuseScore style
   * Directly add notes at cursor position
   */
  useHotkeys('a', () => addNoteByLetter('A'), [addNoteByLetter]);
  useHotkeys('b', () => addNoteByLetter('B'), [addNoteByLetter]);
  useHotkeys('c', () => addNoteByLetter('C'), [addNoteByLetter]);
  useHotkeys('d', () => addNoteByLetter('D'), [addNoteByLetter]);
  useHotkeys('e', () => addNoteByLetter('E'), [addNoteByLetter]);
  useHotkeys('g', () => addNoteByLetter('G'), [addNoteByLetter]);

  /**
   * Chord mode toggle - Hold Shift to enter chord mode
   */
  useHotkeys('shift', () => {
    setInputMode('chord');
  }, { keydown: true, keyup: false }, [setInputMode]);

  /**
   * Finalize chord on Shift release
   */
  useEffect(() => {
    const handleKeyUp = (e) => {
      if (e.key === 'Shift' && inputMode === 'chord') {
        finalizeChord();
      }
    };
    window.addEventListener('keyup', handleKeyUp);
    return () => window.removeEventListener('keyup', handleKeyUp);
  }, [inputMode, finalizeChord]);

  /**
   * Keyboard shortcuts for pitch adjustment (Up/Down arrow keys)
   */
  useHotkeys('up', (e) => {
    e.preventDefault();
    transposeSelectedNote('up');
  }, [transposeSelectedNote]);

  useHotkeys('down', (e) => {
    e.preventDefault();
    transposeSelectedNote('down');
  }, [transposeSelectedNote]);

  /**
   * Keyboard shortcuts for cursor navigation (Left/Right arrow keys)
   */
  useHotkeys('left', (e) => {
    e.preventDefault();
    moveCursorBackward();
  }, [moveCursorBackward]);

  useHotkeys('right', (e) => {
    e.preventDefault();
    moveCursorForward();
  }, [moveCursorForward]);

  /**
   * Keyboard shortcut for deleting selected note
   */
  useHotkeys('backspace, delete', (e) => {
    e.preventDefault();
    deleteSelectedNote();
  }, [deleteSelectedNote]);

  /**
   * Keyboard shortcut for playback toggle
   */
  useHotkeys('space', (e) => {
    e.preventDefault();
    setIsPlaying(prev => !prev);
  }, [setIsPlaying]);

  /**
   * Keyboard shortcuts for undo/redo
   */
  useHotkeys('ctrl+z, cmd+z', (e) => {
    e.preventDefault();
    undo();
  }, [undo]);

  useHotkeys('ctrl+y, cmd+y, ctrl+shift+z, cmd+shift+z', (e) => {
    e.preventDefault();
    redo();
  }, [redo]);

  return (
    <div className="note-input-handler bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <Keyboard size={20} />
          Input Methods
        </h3>
      </div>

      {/* Keyboard Shortcuts Section */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
          <Keyboard size={16} />
          Keyboard Shortcuts
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          {/* Note Durations */}
          <div className="space-y-2">
            <p className="font-semibold text-gray-600 dark:text-gray-400">Note Durations:</p>
            <div className="space-y-1 text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span><kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">1</kbd></span>
                <span>Whole (𝅝)</span>
              </div>
              <div className="flex justify-between">
                <span><kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">2</kbd></span>
                <span>Half (𝅗𝅥)</span>
              </div>
              <div className="flex justify-between">
                <span><kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">3</kbd></span>
                <span>Quarter (♩)</span>
              </div>
              <div className="flex justify-between">
                <span><kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">4</kbd></span>
                <span>Eighth (♪)</span>
              </div>
              <div className="flex justify-between">
                <span><kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">5</kbd></span>
                <span>16th (𝅘𝅥𝅯)</span>
              </div>
              <div className="flex justify-between">
                <span><kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">6</kbd></span>
                <span>32nd</span>
              </div>
            </div>
          </div>

          {/* Note Letters & Accidentals */}
          <div className="space-y-2">
            <p className="font-semibold text-gray-600 dark:text-gray-400">Note Input:</p>
            <div className="space-y-1 text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span><kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">A-G</kbd></span>
                <span>Add Note</span>
              </div>
              <div className="flex justify-between">
                <span><kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">Shift+A-G</kbd></span>
                <span>Add Chord</span>
              </div>
              <div className="flex justify-between">
                <span><kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">←/→</kbd></span>
                <span>Navigate</span>
              </div>
              <div className="flex justify-between">
                <span><kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">↑/↓</kbd></span>
                <span>Transpose</span>
              </div>
              <div className="flex justify-between">
                <span><kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">S</kbd></span>
                <span>Sharp (♯)</span>
              </div>
              <div className="flex justify-between">
                <span><kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">F</kbd></span>
                <span>Flat (♭)</span>
              </div>
              <div className="flex justify-between">
                <span><kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">N</kbd></span>
                <span>Natural (♮)</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <p className="font-semibold text-gray-600 dark:text-gray-400">Actions:</p>
            <div className="space-y-1 text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span><kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">Space</kbd></span>
                <span>Play/Pause</span>
              </div>
              <div className="flex justify-between">
                <span><kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">Delete</kbd></span>
                <span>Remove Note</span>
              </div>
              <div className="flex justify-between">
                <span><kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">Ctrl+Z</kbd></span>
                <span>Undo</span>
              </div>
              <div className="flex justify-between">
                <span><kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">Ctrl+Y</kbd></span>
                <span>Redo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Input Mode Status Display */}
        <div className="mt-4 space-y-2">
          {/* Input Mode Indicator */}
          <div className={`p-3 border rounded ${
            inputMode === 'chord'
              ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700'
              : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                Input Mode:
              </span>
              <span className={`text-sm font-bold ${
                inputMode === 'chord'
                  ? 'text-purple-800 dark:text-purple-300'
                  : 'text-blue-800 dark:text-blue-300'
              }`}>
                {inputMode === 'chord' ? '🎵 CHORD MODE' : '🎼 NOTE MODE'}
              </span>
            </div>
            {inputMode === 'chord' && chordNotes.length > 0 && (
              <div className="mt-2 pt-2 border-t border-purple-200 dark:border-purple-700">
                <p className="text-xs text-purple-700 dark:text-purple-300">
                  Building chord: <span className="font-bold">{chordNotes.join(' + ')}</span>
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                  Release Shift to finalize
                </p>
              </div>
            )}
          </div>

          {/* Current Octave Display */}
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-800 dark:text-green-300">Current Octave:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentOctave(prev => Math.max(0, prev - 1))}
                  className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs"
                >
                  -
                </button>
                <span className="text-lg font-bold text-green-800 dark:text-green-300 min-w-[24px] text-center">
                  {currentOctave}
                </span>
                <button
                  onClick={() => setCurrentOctave(prev => Math.min(8, prev + 1))}
                  className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MIDI Input Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
          <Music2 size={16} />
          MIDI Input
        </h4>

        {midiAccess ? (
          <div className="space-y-3">
            {/* Connection Status */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${connectedDevice ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {connectedDevice ? `Connected: ${connectedDevice.name}` : 'No device connected'}
              </span>
            </div>

            {/* Available Devices */}
            {midiInputs.length > 0 && (
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                  Available Devices:
                </label>
                <select
                  onChange={(e) => {
                    const device = midiInputs[parseInt(e.target.value)];
                    if (device) connectToMidiDevice(device);
                  }}
                  value={connectedDevice ? midiInputs.indexOf(connectedDevice) : -1}
                  className="w-full px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={-1}>Select a device...</option>
                  {midiInputs.map((device, index) => (
                    <option key={device.id} value={index}>
                      {device.name || `MIDI Device ${index + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Last Note Played */}
            {lastMidiNote && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded p-2">
                <p className="text-xs text-blue-800 dark:text-blue-300">
                  Last Note: <span className="font-bold">{lastMidiNote.pitch}</span>
                  {' '}(Velocity: {lastMidiNote.velocity})
                </p>
              </div>
            )}

            {midiInputs.length === 0 && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded p-3 flex items-start gap-2">
                <AlertCircle size={16} className="text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-yellow-800 dark:text-yellow-300">
                  No MIDI devices detected. Connect a MIDI keyboard and refresh the page.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded p-3 flex items-start gap-2">
            <AlertCircle size={16} className="text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-red-800 dark:text-red-300">
              MIDI is not supported in your browser. Try using Chrome, Edge, or Opera for MIDI support.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteInputHandler;
