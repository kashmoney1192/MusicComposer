import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Square, SkipBack, Volume2, VolumeX } from 'lucide-react';
import * as Tone from 'tone';
import { useMusicContext } from '../../contexts/MusicContext';

/**
 * PlaybackControls Component - MIDI playback using Tone.js
 * Provides Play, Pause, Stop controls with visual feedback
 */
const PlaybackControls = () => {
  const {
    notes,
    tempo,
    getSortedNotes,
    isPlaying,
    setIsPlaying
  } = useMusicContext();

  const [currentNoteIndex, setCurrentNoteIndex] = useState(-1);
  const [volume, setVolume] = useState(-10); // dB
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Refs for Tone.js components
  const synthRef = useRef(null);
  const partRef = useRef(null);

  /**
   * Initialize synthesizer
   */
  useEffect(() => {
    // Create a polyphonic synth
    synthRef.current = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: 'triangle'
      },
      envelope: {
        attack: 0.005,
        decay: 0.1,
        sustain: 0.3,
        release: 1
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
  }, [volume]);

  /**
   * Update volume
   */
  useEffect(() => {
    if (synthRef.current) {
      synthRef.current.volume.value = isMuted ? -Infinity : volume;
    }
  }, [volume, isMuted]);

  /**
   * Convert note duration to seconds based on tempo
   */
  const durationToSeconds = useCallback((duration) => {
    const beatDuration = 60 / tempo; // Duration of one beat in seconds
    const durations = {
      'w': beatDuration * 4,
      'h': beatDuration * 2,
      'q': beatDuration,
      '8': beatDuration / 2,
      '16': beatDuration / 4
    };
    return durations[duration] || beatDuration;
  }, [tempo]);

  /**
   * Convert pitch from VexFlow format (C/4) to Tone.js format (C4)
   */
  const convertPitch = (pitch, accidental) => {
    if (!pitch) return 'C4';

    const [note, octave] = pitch.split('/');
    let noteName = note.toUpperCase();

    // Apply accidental
    if (accidental === '#') {
      noteName += '#';
    } else if (accidental === 'b') {
      noteName += 'b';
    }

    return `${noteName}${octave}`;
  };

  /**
   * Play the composition
   */
  const handlePlay = async () => {
    if (notes.length === 0) {
      alert('Add some notes to your composition first!');
      return;
    }

    setIsLoading(true);

    try {
      // Start Tone.js audio context
      await Tone.start();

      // Stop any existing playback
      if (partRef.current) {
        partRef.current.stop();
        partRef.current.dispose();
      }

      Tone.Transport.stop();
      Tone.Transport.cancel();

      // Set tempo
      Tone.Transport.bpm.value = tempo;

      // Get sorted notes
      const sortedNotes = getSortedNotes();

      // Create events for Tone.Part
      const events = [];
      let currentTime = 0;

      sortedNotes.forEach((note, index) => {
        if (!note.isRest) {
          const pitch = convertPitch(note.pitch, note.accidental);
          const duration = durationToSeconds(note.duration);

          events.push({
            time: currentTime,
            pitch: pitch,
            duration: duration,
            index: index
          });
        }

        currentTime += durationToSeconds(note.duration);
      });

      // Create a new Part for playback
      partRef.current = new Tone.Part((time, event) => {
        synthRef.current.triggerAttackRelease(event.pitch, event.duration, time);

        // Update current note index for visual feedback
        Tone.Draw.schedule(() => {
          setCurrentNoteIndex(event.index);
        }, time);
      }, events);

      // Set up callback for when playback ends
      partRef.current.loop = false;
      partRef.current.start(0);

      // Schedule stop at the end
      Tone.Transport.schedule(() => {
        handleStop();
      }, currentTime);

      // Start transport
      Tone.Transport.start();
      setIsPlaying(true);
      setIsLoading(false);

    } catch (error) {
      console.error('Error during playback:', error);
      alert('Error playing composition. Please try again.');
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  /**
   * Pause playback
   */
  const handlePause = () => {
    if (Tone.Transport.state === 'started') {
      Tone.Transport.pause();
      setIsPlaying(false);
    } else if (Tone.Transport.state === 'paused') {
      Tone.Transport.start();
      setIsPlaying(true);
    }
  };

  /**
   * Stop playback and reset
   */
  const handleStop = useCallback(() => {
    Tone.Transport.stop();
    Tone.Transport.cancel();

    if (partRef.current) {
      partRef.current.stop();
    }

    setIsPlaying(false);
    setCurrentNoteIndex(-1);
  }, [setIsPlaying]);

  /**
   * Restart from beginning
   */
  const handleRestart = () => {
    handleStop();
    setTimeout(handlePlay, 100);
  };

  /**
   * Toggle mute
   */
  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      handleStop();
    };
  }, []);

  return (
    <div className="playback-controls bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <Play className="mr-2" size={28} />
        Playback Controls
      </h2>

      {/* Main Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* Play Button */}
        <button
          onClick={handlePlay}
          disabled={isPlaying || isLoading || notes.length === 0}
          className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 ${
            isPlaying || isLoading || notes.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl'
          }`}
        >
          <Play className="inline-block mr-2" size={24} />
          {isLoading ? 'Loading...' : 'Play'}
        </button>

        {/* Pause Button */}
        <button
          onClick={handlePause}
          disabled={!isPlaying}
          className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 ${
            !isPlaying
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg hover:shadow-xl'
          }`}
        >
          <Pause className="inline-block mr-2" size={24} />
          Pause
        </button>

        {/* Stop Button */}
        <button
          onClick={handleStop}
          disabled={!isPlaying}
          className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 ${
            !isPlaying
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl'
          }`}
        >
          <Square className="inline-block mr-2" size={24} />
          Stop
        </button>

        {/* Restart Button */}
        <button
          onClick={handleRestart}
          disabled={notes.length === 0}
          className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 ${
            notes.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl'
          }`}
        >
          <SkipBack className="inline-block mr-2" size={24} />
          Restart
        </button>
      </div>

      {/* Volume Control */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center gap-4">
          <button
            onClick={handleToggleMute}
            className="p-3 rounded-lg bg-white hover:bg-gray-100 transition-colors shadow"
          >
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>

          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Volume: {isMuted ? 'Muted' : `${Math.round(((volume + 40) / 40) * 100)}%`}
            </label>
            <input
              type="range"
              min="-40"
              max="0"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              disabled={isMuted}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: isMuted
                  ? '#e5e7eb'
                  : `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((volume + 40) / 40) * 100}%, #e5e7eb ${((volume + 40) / 40) * 100}%, #e5e7eb 100%)`
              }}
            />
          </div>
        </div>
      </div>

      {/* Playback Status */}
      <div className="mt-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center justify-between text-sm">
          <div>
            <span className="font-semibold text-gray-700">Status:</span>
            <span className={`ml-2 font-bold ${isPlaying ? 'text-green-600' : 'text-gray-600'}`}>
              {isPlaying ? 'Playing' : 'Stopped'}
            </span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Tempo:</span>
            <span className="ml-2 font-bold text-blue-600">{tempo} BPM</span>
          </div>
          {currentNoteIndex >= 0 && (
            <div>
              <span className="font-semibold text-gray-700">Playing note:</span>
              <span className="ml-2 font-bold text-purple-600">{currentNoteIndex + 1} of {notes.length}</span>
            </div>
          )}
        </div>
      </div>

      {/* Help Text */}
      {notes.length === 0 && (
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            Add some notes to your composition to enable playback
          </p>
        </div>
      )}
    </div>
  );
};

export default PlaybackControls;
