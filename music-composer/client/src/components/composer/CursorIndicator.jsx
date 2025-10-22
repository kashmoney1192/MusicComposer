import React, { useEffect, useRef } from 'react';
import { useMusicContext } from '../../contexts/MusicContext';

/**
 * CursorIndicator Component
 * Displays a visual cursor on the staff showing where the next note will be placed
 * MuseScore-style blue vertical line with pulsing animation
 *
 * Features:
 * - Real-time cursor positioning based on cursorPosition state
 * - Pulsing animation for visibility
 * - Shows current duration/note type preview
 * - Moves with cursor navigation
 */
const CursorIndicator = ({ measureRef, measureNumber, staffType = 'treble' }) => {
  const cursorRef = useRef(null);
  const {
    cursorPosition,
    selectedTool,
    inputMode,
    chordNotes
  } = useMusicContext();

  // Only show cursor if this is the active measure and staff
  const isActiveMeasure = cursorPosition.measure === measureNumber &&
                         cursorPosition.staff === staffType;

  useEffect(() => {
    if (isActiveMeasure && cursorRef.current && measureRef.current) {
      // Calculate cursor position based on beat within measure
      // This is a simplified version - in production, would need precise VexFlow calculations
      const measureWidth = measureRef.current.offsetWidth;
      const beatPosition = cursorPosition.beat;
      const timeSignature = 4; // Get from context in production

      const xPosition = (beatPosition / timeSignature) * measureWidth;
      cursorRef.current.style.left = `${xPosition}px`;
    }
  }, [cursorPosition, isActiveMeasure, measureRef]);

  if (!isActiveMeasure) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      className="absolute top-0 h-full pointer-events-none z-10 transition-all duration-200"
      style={{
        left: 0,
        width: '2px'
      }}
    >
      {/* Cursor line */}
      <div className="relative h-full">
        <div className={`absolute w-0.5 h-full animate-pulse ${
          inputMode === 'chord'
            ? 'bg-purple-500'
            : 'bg-blue-500'
        }`} />

        {/* Duration indicator at top */}
        <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded text-xs font-bold shadow-lg ${
          inputMode === 'chord'
            ? 'bg-purple-500 text-white'
            : 'bg-blue-500 text-white'
        }`}>
          {inputMode === 'chord' ? (
            <div className="flex flex-col items-center">
              <span>CHORD</span>
              {chordNotes.length > 0 && (
                <span className="text-[10px]">{chordNotes.join('+')}</span>
              )}
            </div>
          ) : (
            <span>{getDurationSymbol(selectedTool.duration)}</span>
          )}
        </div>

        {/* Beat marker at bottom */}
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400 font-mono">
          {cursorPosition.beat.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

/**
 * Get musical symbol for duration
 */
const getDurationSymbol = (duration) => {
  const symbols = {
    'w': '𝅝',      // Whole note
    'h': '𝅗𝅥',     // Half note
    'q': '♩',      // Quarter note
    '8': '♪',      // Eighth note
    '16': '𝅘𝅥𝅯',   // Sixteenth note
    '32': '𝅘𝅥𝅰'    // Thirty-second note
  };
  return symbols[duration] || '♩';
};

export default CursorIndicator;
