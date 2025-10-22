import React, { useState, useEffect, useRef } from 'react';
import { useMusicContext } from '../../contexts/MusicContext';
import * as Tone from 'tone';

/**
 * Metronome Component
 * Provides visual and audio metronome functionality
 *
 * Features:
 * - Adjustable tempo (40-240 BPM)
 * - Visual beat indicator
 * - High/low pitch for downbeat
 * - Start/Stop controls
 * - Synchronized with composition tempo
 */
const Metronome = () => {
  const { tempo, setTempo, timeSignature } = useMusicContext();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [volume, setVolume] = useState(-10); // dB

  const synthRef = useRef(null);
  const sequenceRef = useRef(null);

  // Initialize Tone.js synth
  useEffect(() => {
    synthRef.current = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.001,
        decay: 0.1,
        sustain: 0,
        release: 0.1
      }
    }).toDestination();

    return () => {
      if (sequenceRef.current) {
        sequenceRef.current.stop();
        sequenceRef.current.dispose();
      }
      if (synthRef.current) {
        synthRef.current.dispose();
      }
    };
  }, []);

  // Update synth volume
  useEffect(() => {
    if (synthRef.current) {
      synthRef.current.volume.value = volume;
    }
  }, [volume]);

  // Handle metronome playback
  useEffect(() => {
    const startMetronome = async () => {
      if (!isPlaying) {
        if (sequenceRef.current) {
          sequenceRef.current.stop();
        }
        return;
      }

      await Tone.start();
      Tone.Transport.bpm.value = tempo;

      let beat = 0;
      sequenceRef.current = new Tone.Sequence(
        (time) => {
          // Play higher pitch on beat 1 (downbeat)
          const pitch = beat === 0 ? 'C5' : 'C4';
          synthRef.current.triggerAttackRelease(pitch, '16n', time);

          // Update visual beat indicator
          Tone.Draw.schedule(() => {
            setCurrentBeat(beat);
          }, time);

          beat = (beat + 1) % timeSignature.beats;
        },
        [...Array(timeSignature.beats)].map((_, i) => i),
        `${timeSignature.beats}n`
      );

      sequenceRef.current.start(0);
      Tone.Transport.start();
    };

    startMetronome();

    return () => {
      if (sequenceRef.current) {
        sequenceRef.current.stop();
      }
      Tone.Transport.stop();
    };
  }, [isPlaying, tempo, timeSignature.beats]);

  const toggleMetronome = async () => {
    setIsPlaying(!isPlaying);
  };

  const handleTempoChange = (newTempo) => {
    const tempoValue = parseInt(newTempo);
    if (tempoValue >= 40 && tempoValue <= 240) {
      setTempo(tempoValue);
    }
  };

  return (
    <div className="metronome bg-white rounded-lg shadow-md border border-gray-200 p-4">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-2xl">⏱️</span>
        Metronome
      </h3>

      {/* Tempo Control */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Tempo: {tempo} BPM
        </label>
        <input
          type="range"
          min="40"
          max="240"
          value={tempo}
          onChange={(e) => handleTempoChange(e.target.value)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Largo (40)</span>
          <span>Andante (80)</span>
          <span>Allegro (120)</span>
          <span>Presto (180)</span>
          <span>Prestissimo (240)</span>
        </div>
      </div>

      {/* Quick Tempo Buttons */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[60, 80, 120, 140].map((t) => (
          <button
            key={t}
            onClick={() => handleTempoChange(t)}
            className={`px-3 py-2 rounded text-sm font-semibold transition-all ${
              tempo === t
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Number Input */}
      <div className="mb-4">
        <input
          type="number"
          min="40"
          max="240"
          value={tempo}
          onChange={(e) => handleTempoChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Volume Control */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Volume: {Math.round((volume + 40) / 40 * 100)}%
        </label>
        <input
          type="range"
          min="-40"
          max="0"
          value={volume}
          onChange={(e) => setVolume(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
        />
      </div>

      {/* Visual Beat Indicator */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-xs font-semibold text-gray-600 mb-2 text-center">
          Beat Indicator
        </div>
        <div className="flex justify-center gap-2">
          {[...Array(timeSignature.beats)].map((_, i) => (
            <div
              key={i}
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-100 ${
                isPlaying && currentBeat === i
                  ? i === 0
                    ? 'bg-red-500 text-white scale-125 shadow-lg'
                    : 'bg-blue-500 text-white scale-125 shadow-lg'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-2">
        <button
          onClick={toggleMetronome}
          className={`flex-1 py-3 rounded-lg font-bold text-white transition-all shadow-md hover:shadow-lg ${
            isPlaying
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isPlaying ? '⏸️ Stop' : '▶️ Start'}
        </button>
        <button
          onClick={() => setCurrentBeat(0)}
          disabled={isPlaying}
          className="px-4 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Reset
        </button>
      </div>

      {/* Tempo Guide */}
      <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
        <p className="text-xs text-blue-800 font-semibold mb-1">Tempo Guide:</p>
        <div className="text-xs text-blue-700 space-y-1">
          <div>40-60 BPM: Largo (slow)</div>
          <div>66-76 BPM: Adagio (leisurely)</div>
          <div>76-108 BPM: Andante (walking)</div>
          <div>108-120 BPM: Moderato (moderate)</div>
          <div>120-168 BPM: Allegro (fast)</div>
          <div>168-200 BPM: Presto (very fast)</div>
        </div>
      </div>
    </div>
  );
};

export default Metronome;
