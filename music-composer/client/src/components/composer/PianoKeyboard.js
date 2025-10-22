import React, { useEffect, useCallback, useState, useRef } from 'react';
import * as Tone from 'tone';
import { useMusicContext } from '../../contexts/MusicContext';

/**
 * PianoKeyboard Component - Interactive piano keyboard for note entry
 * Press computer keyboard keys or click to add notes to the composition
 */
const PianoKeyboard = () => {
  const {
    addNote,
    selectedTool,
    measureCount,
    notes,
    tempo
  } = useMusicContext();

  const [activeKeys, setActiveKeys] = useState(new Set());
  const [currentMeasure, setCurrentMeasure] = useState(1);
  const [currentBeat, setCurrentBeat] = useState(0);
  const synthRef = useRef(null);

  // Piano keys configuration - 2 octaves (C4 to C6)
  // Each white key has a position index (0-14), black keys positioned relative to white keys
  const pianoKeys = [
    // Octave 4
    { note: 'C', octave: 4, pitch: 'C/4', isBlack: false, whiteKeyIndex: 0, key: 'a', keyDisplay: 'A' },
    { note: 'C#', octave: 4, pitch: 'C#/4', isBlack: true, blackKeyPosition: 0.7, key: 'w', keyDisplay: 'W' },
    { note: 'D', octave: 4, pitch: 'D/4', isBlack: false, whiteKeyIndex: 1, key: 's', keyDisplay: 'S' },
    { note: 'D#', octave: 4, pitch: 'D#/4', isBlack: true, blackKeyPosition: 1.7, key: 'e', keyDisplay: 'E' },
    { note: 'E', octave: 4, pitch: 'E/4', isBlack: false, whiteKeyIndex: 2, key: 'd', keyDisplay: 'D' },
    { note: 'F', octave: 4, pitch: 'F/4', isBlack: false, whiteKeyIndex: 3, key: 'f', keyDisplay: 'F' },
    { note: 'F#', octave: 4, pitch: 'F#/4', isBlack: true, blackKeyPosition: 3.75, key: 't', keyDisplay: 'T' },
    { note: 'G', octave: 4, pitch: 'G/4', isBlack: false, whiteKeyIndex: 4, key: 'g', keyDisplay: 'G' },
    { note: 'G#', octave: 4, pitch: 'G#/4', isBlack: true, blackKeyPosition: 4.7, key: 'y', keyDisplay: 'Y' },
    { note: 'A', octave: 4, pitch: 'A/4', isBlack: false, whiteKeyIndex: 5, key: 'h', keyDisplay: 'H' },
    { note: 'A#', octave: 4, pitch: 'A#/4', isBlack: true, blackKeyPosition: 5.7, key: 'u', keyDisplay: 'U' },
    { note: 'B', octave: 4, pitch: 'B/4', isBlack: false, whiteKeyIndex: 6, key: 'j', keyDisplay: 'J' },

    // Octave 5
    { note: 'C', octave: 5, pitch: 'C/5', isBlack: false, whiteKeyIndex: 7, key: 'k', keyDisplay: 'K' },
    { note: 'C#', octave: 5, pitch: 'C#/5', isBlack: true, blackKeyPosition: 7.7, key: 'o', keyDisplay: 'O' },
    { note: 'D', octave: 5, pitch: 'D/5', isBlack: false, whiteKeyIndex: 8, key: 'l', keyDisplay: 'L' },
    { note: 'D#', octave: 5, pitch: 'D#/5', isBlack: true, blackKeyPosition: 8.7, key: 'p', keyDisplay: 'P' },
    { note: 'E', octave: 5, pitch: 'E/5', isBlack: false, whiteKeyIndex: 9, key: ';', keyDisplay: ';' },
    { note: 'F', octave: 5, pitch: 'F/5', isBlack: false, whiteKeyIndex: 10, key: "'", keyDisplay: "'" },
    { note: 'F#', octave: 5, pitch: 'F#/5', isBlack: true, blackKeyPosition: 10.75, key: ']', keyDisplay: ']' },
    { note: 'G', octave: 5, pitch: 'G/5', isBlack: false, whiteKeyIndex: 11, key: 'z', keyDisplay: 'Z' },
    { note: 'G#', octave: 5, pitch: 'G#/5', isBlack: true, blackKeyPosition: 11.7, key: 'x', keyDisplay: 'X' },
    { note: 'A', octave: 5, pitch: 'A/5', isBlack: false, whiteKeyIndex: 12, key: 'c', keyDisplay: 'C' },
    { note: 'A#', octave: 5, pitch: 'A#/5', isBlack: true, blackKeyPosition: 12.7, key: 'v', keyDisplay: 'V' },
    { note: 'B', octave: 5, pitch: 'B/5', isBlack: false, whiteKeyIndex: 13, key: 'b', keyDisplay: 'B' },
    { note: 'C', octave: 6, pitch: 'C/6', isBlack: false, whiteKeyIndex: 14, key: 'n', keyDisplay: 'N' },
  ];

  /**
   * Initialize synthesizer for key preview
   */
  useEffect(() => {
    synthRef.current = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.005,
        decay: 0.1,
        sustain: 0.3,
        release: 0.4
      }
    }).toDestination();

    synthRef.current.volume.value = -10;

    return () => {
      if (synthRef.current) {
        synthRef.current.dispose();
      }
    };
  }, []);

  /**
   * Convert pitch format for Tone.js (C/4 -> C4)
   */
  const convertPitchForTone = (pitch) => {
    return pitch.replace('/', '');
  };

  /**
   * Play note sound preview
   */
  const playNotePreview = useCallback(async (pitch) => {
    if (synthRef.current) {
      await Tone.start();
      const tonePitch = convertPitchForTone(pitch);
      synthRef.current.triggerAttackRelease(tonePitch, '8n');
    }
  }, []);

  /**
   * Add note to composition
   */
  const addNoteToStaff = useCallback((pitch) => {
    // Calculate position (approximate)
    const position = 5; // Middle of staff

    addNote({
      pitch: pitch,
      measure: currentMeasure,
      beat: currentBeat,
      position: position,
      accidental: selectedTool.accidental
    });

    // Move to next beat
    setCurrentBeat(prev => {
      const nextBeat = prev + 1;
      // If we exceed the measure, move to next measure
      if (nextBeat >= 4) { // Assuming 4/4 time
        setCurrentMeasure(m => Math.min(m + 1, measureCount));
        return 0;
      }
      return nextBeat;
    });
  }, [addNote, currentMeasure, currentBeat, selectedTool, measureCount]);

  /**
   * Handle keyboard key press
   */
  const handleKeyDown = useCallback(async (event) => {
    // Ignore if typing in an input
    if (event.target.matches('input, textarea')) return;

    const key = event.key.toLowerCase();

    // Find matching piano key
    const pianoKey = pianoKeys.find(k => k.key === key);

    if (pianoKey && !activeKeys.has(key)) {
      event.preventDefault();

      // Add to active keys
      setActiveKeys(prev => new Set([...prev, key]));

      // Play sound
      await playNotePreview(pianoKey.pitch);

      // Add note to staff if not a rest
      if (selectedTool.type === 'note') {
        addNoteToStaff(pianoKey.pitch);
      }
    }

    // Special keys
    if (key === 'arrowleft') {
      event.preventDefault();
      setCurrentBeat(prev => Math.max(0, prev - 1));
    } else if (key === 'arrowright') {
      event.preventDefault();
      setCurrentBeat(prev => prev + 1);
    } else if (key === 'arrowup') {
      event.preventDefault();
      setCurrentMeasure(prev => Math.max(1, prev - 1));
    } else if (key === 'arrowdown') {
      event.preventDefault();
      setCurrentMeasure(prev => Math.min(measureCount, prev + 1));
    } else if (key === 'enter') {
      event.preventDefault();
      setCurrentMeasure(prev => Math.min(prev + 1, measureCount));
      setCurrentBeat(0);
    } else if (key === 'backspace' && !event.target.matches('input, textarea')) {
      event.preventDefault();
      setCurrentBeat(prev => Math.max(0, prev - 1));
    }
  }, [activeKeys, pianoKeys, playNotePreview, addNoteToStaff, selectedTool, measureCount]);

  /**
   * Handle keyboard key release
   */
  const handleKeyUp = useCallback((event) => {
    const key = event.key.toLowerCase();
    setActiveKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(key);
      return newSet;
    });
  }, []);

  /**
   * Handle mouse click on piano key
   */
  const handlePianoKeyClick = async (pianoKey) => {
    await playNotePreview(pianoKey.pitch);

    if (selectedTool.type === 'note') {
      addNoteToStaff(pianoKey.pitch);
    }

    // Visual feedback
    setActiveKeys(prev => new Set([...prev, pianoKey.key]));
    setTimeout(() => {
      setActiveKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(pianoKey.key);
        return newSet;
      });
    }, 200);
  };

  /**
   * Set up keyboard listeners
   */
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const whiteKeyWidth = 50;
  const blackKeyWidth = 30;
  const whiteKeyHeight = 180;
  const blackKeyHeight = 110;

  return (
    <div className="piano-keyboard bg-white rounded-xl shadow-lg p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Piano Keyboard</h2>
        <p className="text-sm text-gray-600">
          Press the keys on your keyboard or click the piano keys to add notes!
        </p>
      </div>

      {/* Current Position Display */}
      <div className="mb-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-semibold text-gray-700">Current Position:</span>
            <span className="ml-2 text-blue-600 font-bold">
              Measure {currentMeasure}, Beat {currentBeat + 1}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setCurrentMeasure(1);
                setCurrentBeat(0);
              }}
              className="px-4 py-2 bg-white hover:bg-gray-100 rounded-lg font-semibold text-sm border border-gray-300 transition-colors"
            >
              Reset Position
            </button>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-600">
          Use Arrow Keys: ← → (beat), ↑ ↓ (measure), Enter (next measure)
        </div>
      </div>

      {/* Piano Keys with Legend */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Legend - Now beside the piano */}
        <div className="lg:order-1 order-2 flex-shrink-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5 border-2 border-blue-200 shadow-lg">
          <h3 className="font-bold text-gray-800 mb-3 text-lg flex items-center">
            <span className="text-2xl mr-2">🎹</span>
            Keyboard Guide
          </h3>
          <div className="space-y-3 text-sm">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="font-semibold text-blue-700 mb-2">White Keys (Natural Notes)</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><kbd className="kbd-mini">A</kbd> → C4</div>
                <div><kbd className="kbd-mini">S</kbd> → D4</div>
                <div><kbd className="kbd-mini">D</kbd> → E4</div>
                <div><kbd className="kbd-mini">F</kbd> → F4</div>
                <div><kbd className="kbd-mini">G</kbd> → G4</div>
                <div><kbd className="kbd-mini">H</kbd> → A4</div>
                <div><kbd className="kbd-mini">J</kbd> → B4</div>
                <div><kbd className="kbd-mini">K</kbd> → C5</div>
                <div><kbd className="kbd-mini">L</kbd> → D5</div>
                <div><kbd className="kbd-mini">;</kbd> → E5</div>
                <div><kbd className="kbd-mini">'</kbd> → F5</div>
                <div><kbd className="kbd-mini">Z</kbd> → G5</div>
                <div><kbd className="kbd-mini">C</kbd> → A5</div>
                <div><kbd className="kbd-mini">B</kbd> → B5</div>
                <div><kbd className="kbd-mini">N</kbd> → C6</div>
              </div>
            </div>

            <div className="bg-gray-800 text-white rounded-lg p-3 shadow-sm">
              <div className="font-semibold text-purple-300 mb-2">Black Keys (Sharps)</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><kbd className="kbd-mini-dark">W</kbd> → C#4</div>
                <div><kbd className="kbd-mini-dark">E</kbd> → D#4</div>
                <div><kbd className="kbd-mini-dark">T</kbd> → F#4</div>
                <div><kbd className="kbd-mini-dark">Y</kbd> → G#4</div>
                <div><kbd className="kbd-mini-dark">U</kbd> → A#4</div>
                <div><kbd className="kbd-mini-dark">O</kbd> → C#5</div>
                <div><kbd className="kbd-mini-dark">P</kbd> → D#5</div>
                <div><kbd className="kbd-mini-dark">]</kbd> → F#5</div>
                <div><kbd className="kbd-mini-dark">X</kbd> → G#5</div>
                <div><kbd className="kbd-mini-dark">V</kbd> → A#5</div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="font-semibold text-green-700 mb-2">Navigation</div>
              <div className="space-y-1 text-xs">
                <div><kbd className="kbd-mini">← →</kbd> Move beat</div>
                <div><kbd className="kbd-mini">↑ ↓</kbd> Change measure</div>
                <div><kbd className="kbd-mini">Enter</kbd> Next measure</div>
                <div><kbd className="kbd-mini">Backspace</kbd> Previous beat</div>
              </div>
            </div>
          </div>
        </div>

        {/* Piano Keys */}
        <div className="lg:order-2 order-1 flex-1 piano-keys-container bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg p-8 border-4 border-gray-700 shadow-2xl">
          <div
            className="relative mx-auto"
            style={{
              width: `${15 * whiteKeyWidth}px`,
              height: `${whiteKeyHeight}px`
            }}
          >
            {/* White Keys */}
            {pianoKeys.filter(k => !k.isBlack).map((pianoKey) => {
              const isActive = activeKeys.has(pianoKey.key);
              return (
                <button
                  key={`white-${pianoKey.whiteKeyIndex}`}
                  onClick={() => handlePianoKeyClick(pianoKey)}
                  className={`piano-key white-key ${isActive ? 'active' : ''}`}
                  style={{
                    position: 'absolute',
                    left: `${pianoKey.whiteKeyIndex * whiteKeyWidth}px`,
                    width: `${whiteKeyWidth}px`,
                    height: `${whiteKeyHeight}px`,
                    bottom: 0,
                    zIndex: 1
                  }}
                  title={`${pianoKey.note}${pianoKey.octave} (${pianoKey.keyDisplay})`}
                >
                  <div className="key-info">
                    <span className="note-name">{pianoKey.note}{pianoKey.octave}</span>
                    <span className="key-label">{pianoKey.keyDisplay}</span>
                  </div>
                </button>
              );
            })}

            {/* Black Keys */}
            {pianoKeys.filter(k => k.isBlack).map((pianoKey, index) => {
              const isActive = activeKeys.has(pianoKey.key);
              return (
                <button
                  key={`black-${index}`}
                  onClick={() => handlePianoKeyClick(pianoKey)}
                  className={`piano-key black-key ${isActive ? 'active' : ''}`}
                  style={{
                    position: 'absolute',
                    left: `${pianoKey.blackKeyPosition * whiteKeyWidth - blackKeyWidth / 2}px`,
                    width: `${blackKeyWidth}px`,
                    height: `${blackKeyHeight}px`,
                    top: 0,
                    zIndex: 2
                  }}
                  title={`${pianoKey.note}${pianoKey.octave} (${pianoKey.keyDisplay})`}
                >
                  <span className="key-label">{pianoKey.keyDisplay}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <div>
          <span className="font-semibold">Total Notes:</span>
          <span className="ml-2 text-blue-600 font-bold">{notes.length}</span>
        </div>
        <div>
          <span className="font-semibold">Tempo:</span>
          <span className="ml-2 text-purple-600 font-bold">{tempo} BPM</span>
        </div>
      </div>

      <style jsx>{`
        .piano-keys-container {
          position: relative;
          overflow-x: auto;
          overflow-y: visible;
        }

        .piano-key {
          border: none;
          cursor: pointer;
          transition: all 0.05s ease;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 12px;
          font-weight: bold;
          user-select: none;
        }

        .white-key {
          background: linear-gradient(to bottom, #ffffff 0%, #f8f8f8 70%, #e8e8e8 100%);
          border: 1px solid #888;
          border-bottom: 3px solid #666;
          border-radius: 0 0 5px 5px;
          box-shadow:
            0 0 0 1px #ccc inset,
            0 4px 6px rgba(0, 0, 0, 0.2),
            0 1px 0 rgba(255, 255, 255, 0.8) inset;
        }

        .white-key:hover {
          background: linear-gradient(to bottom, #f0f0f0 0%, #e8e8e8 70%, #d8d8d8 100%);
          transform: translateY(1px);
        }

        .white-key.active {
          background: linear-gradient(to bottom, #3b82f6 0%, #2563eb 70%, #1d4ed8 100%);
          color: white;
          transform: translateY(3px);
          box-shadow:
            0 0 0 1px #1e40af inset,
            0 1px 3px rgba(0, 0, 0, 0.3);
        }

        .black-key {
          background: linear-gradient(to bottom, #2a2a2a 0%, #1a1a1a 70%, #000000 100%);
          border: 1px solid #000;
          border-bottom: 2px solid #000;
          border-radius: 0 0 4px 4px;
          color: white;
          box-shadow:
            0 0 0 1px #444 inset,
            0 4px 8px rgba(0, 0, 0, 0.5),
            0 1px 0 rgba(255, 255, 255, 0.1) inset;
          padding-top: 8px;
          padding-bottom: 8px;
          align-items: center;
        }

        .black-key:hover {
          background: linear-gradient(to bottom, #3a3a3a 0%, #2a2a2a 70%, #1a1a1a 100%);
          transform: translateY(1px);
        }

        .black-key.active {
          background: linear-gradient(to bottom, #8b5cf6 0%, #7c3aed 70%, #6d28d9 100%);
          transform: translateY(2px);
          box-shadow:
            0 0 0 1px #5b21b6 inset,
            0 1px 3px rgba(0, 0, 0, 0.4);
        }

        .key-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .note-name {
          font-size: 10px;
          color: #888;
          font-weight: 600;
        }

        .white-key.active .note-name {
          color: rgba(255, 255, 255, 0.9);
        }

        .key-label {
          font-size: 11px;
          font-weight: bold;
          padding: 3px 8px;
          background: rgba(0, 0, 0, 0.08);
          border-radius: 4px;
          border: 1px solid rgba(0, 0, 0, 0.1);
        }

        .black-key .key-label {
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 10px;
          padding: 2px 6px;
        }

        .white-key.active .key-label {
          background: rgba(255, 255, 255, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .black-key.active .key-label {
          background: rgba(255, 255, 255, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        kbd {
          font-family: monospace;
          font-size: 12px;
        }

        .kbd-mini {
          display: inline-block;
          padding: 2px 6px;
          background: linear-gradient(to bottom, #ffffff, #e5e7eb);
          border: 1px solid #9ca3af;
          border-radius: 4px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          font-family: monospace;
          font-size: 11px;
          font-weight: 600;
          color: #1f2937;
          min-width: 20px;
          text-align: center;
        }

        .kbd-mini-dark {
          display: inline-block;
          padding: 2px 6px;
          background: linear-gradient(to bottom, #4b5563, #1f2937);
          border: 1px solid #6b7280;
          border-radius: 4px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          font-family: monospace;
          font-size: 11px;
          font-weight: 600;
          color: #e5e7eb;
          min-width: 20px;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default PianoKeyboard;
