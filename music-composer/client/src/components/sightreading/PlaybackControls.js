import React, { useState, useRef, useEffect } from 'react';
import * as Tone from 'tone';
import { Play, Pause, Square, Volume2, VolumeX } from 'lucide-react';

/**
 * PlaybackControls Component
 * Controls playback of generated music using Tone.js
 *
 * @param {Array} notes - Array of note objects to play
 * @param {number} tempo - Playback tempo in BPM (default: 120)
 */
const PlaybackControls = ({ notes, tempo = 120 }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(-10);
  const [isMuted, setIsMuted] = useState(false);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(-1);

  const synthRef = useRef(null);
  const partRef = useRef(null);

  /**
   * Initialize synthesizer
   */
  useEffect(() => {
    synthRef.current = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: {
        attack: 0.02,
        decay: 0.1,
        sustain: 0.3,
        release: 0.8
      }
    }).toDestination();

    synthRef.current.volume.value = volume;

    return () => {
      if (synthRef.current) {
        synthRef.current.dispose();
      }
      if (partRef.current) {
        partRef.current.dispose();
      }
    };
  }, []);

  /**
   * Update volume when changed
   */
  useEffect(() => {
    if (synthRef.current) {
      synthRef.current.volume.value = isMuted ? -Infinity : volume;
    }
  }, [volume, isMuted]);

  /**
   * Convert note duration to Tone.js time notation
   */
  const durationToTime = (duration) => {
    const durations = {
      'w': '1n',    // whole note
      'h': '2n',    // half note
      'q': '4n',    // quarter note
      '8': '8n',    // eighth note
      '16': '16n',  // sixteenth note
    };
    return durations[duration] || '4n';
  };

  /**
   * Convert VexFlow pitch format to Tone.js format
   * VexFlow: 'C/4' or 'C#/4'
   * Tone.js: 'C4' or 'C#4'
   */
  const convertPitchForTone = (pitch) => {
    return pitch.replace('/', '');
  };

  /**
   * Handle play button
   */
  const handlePlay = async () => {
    if (!notes || notes.length === 0) return;

    await Tone.start();

    // If already playing, resume
    if (Tone.Transport.state === 'paused') {
      Tone.Transport.start();
      setIsPlaying(true);
      return;
    }

    // Stop any existing playback
    if (partRef.current) {
      partRef.current.stop();
      partRef.current.dispose();
    }

    // Set tempo
    Tone.Transport.bpm.value = tempo;

    // Prepare note events for Tone.js Part
    const events = [];
    let currentTime = 0;

    notes.forEach((note, index) => {
      if (!note.isRest) {
        events.push({
          time: currentTime,
          pitch: convertPitchForTone(note.pitch),
          duration: durationToTime(note.duration),
          index: index
        });
      }

      // Calculate next time position
      const durationValues = { 'w': 4, 'h': 2, 'q': 1, '8': 0.5, '16': 0.25 };
      const beats = durationValues[note.duration] || 1;
      currentTime += beats;
    });

    // Create Part for scheduled playback
    partRef.current = new Tone.Part((time, event) => {
      // Play the note
      synthRef.current.triggerAttackRelease(event.pitch, event.duration, time);

      // Update current note index for visual feedback
      Tone.Draw.schedule(() => {
        setCurrentNoteIndex(event.index);
      }, time);
    }, events);

    // Schedule end of playback
    Tone.Transport.schedule(() => {
      handleStop();
    }, currentTime);

    // Start playback
    partRef.current.start(0);
    Tone.Transport.start();
    setIsPlaying(true);
  };

  /**
   * Handle pause button
   */
  const handlePause = () => {
    Tone.Transport.pause();
    setIsPlaying(false);
  };

  /**
   * Handle stop button
   */
  const handleStop = () => {
    Tone.Transport.stop();
    Tone.Transport.cancel();

    if (partRef.current) {
      partRef.current.stop();
      partRef.current.dispose();
      partRef.current = null;
    }

    setIsPlaying(false);
    setCurrentNoteIndex(-1);
  };

  /**
   * Handle volume change
   */
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (isMuted) {
      setIsMuted(false);
    }
  };

  /**
   * Toggle mute
   */
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const hasNotes = notes && notes.length > 0;

  return (
    <div className="playback-controls bg-white rounded-xl shadow-lg p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Playback Controls</h2>
        <p className="text-sm text-gray-600">
          Listen to the generated music
        </p>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-4 mb-6">
        {/* Play/Pause Button */}
        <button
          onClick={isPlaying ? handlePause : handlePlay}
          disabled={!hasNotes}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
            hasNotes
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:scale-105'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause size={20} />
              Pause
            </>
          ) : (
            <>
              <Play size={20} />
              Play
            </>
          )}
        </button>

        {/* Stop Button */}
        <button
          onClick={handleStop}
          disabled={!isPlaying}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
            isPlaying
              ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transform hover:scale-105'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Square size={20} />
          Stop
        </button>

        {/* Tempo Display */}
        <div className="ml-auto flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-xl">
          <span className="text-sm text-gray-600">Tempo:</span>
          <span className="text-lg font-bold text-gray-800">{tempo}</span>
          <span className="text-sm text-gray-600">BPM</span>
        </div>
      </div>

      {/* Volume Control */}
      <div className="volume-control bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center gap-4">
          {/* Mute Button */}
          <button
            onClick={toggleMute}
            className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <VolumeX size={24} className="text-red-500" />
            ) : (
              <Volume2 size={24} className="text-gray-700" />
            )}
          </button>

          {/* Volume Slider */}
          <div className="flex-1 flex items-center gap-3">
            <span className="text-sm text-gray-600 min-w-[60px]">Volume:</span>
            <input
              type="range"
              min="-40"
              max="0"
              step="1"
              value={volume}
              onChange={handleVolumeChange}
              className="flex-1 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer volume-slider"
              disabled={isMuted}
            />
            <span className="text-sm font-semibold text-gray-700 min-w-[40px] text-right">
              {isMuted ? 'Muted' : `${Math.round(((volume + 40) / 40) * 100)}%`}
            </span>
          </div>
        </div>
      </div>

      {/* Playback Status */}
      {hasNotes && (
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700">
              Status: <span className="font-semibold">{isPlaying ? 'Playing' : 'Stopped'}</span>
            </span>
            {isPlaying && currentNoteIndex >= 0 && (
              <span className="text-gray-700">
                Note: <span className="font-semibold">{currentNoteIndex + 1} / {notes.length}</span>
              </span>
            )}
          </div>
        </div>
      )}

      {!hasNotes && (
        <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800">
            Generate music first to enable playback controls
          </p>
        </div>
      )}

      <style jsx>{`
        .volume-slider::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .volume-slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .volume-slider:disabled::-webkit-slider-thumb {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .volume-slider:disabled::-moz-range-thumb {
          background: #9ca3af;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default PlaybackControls;
