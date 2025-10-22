import React from 'react';

/**
 * KeyboardLegend Component
 * Displays keyboard mapping for piano notes
 * Can be placed next to any component
 * Fully responsive for all screen sizes
 */
const KeyboardLegend = () => {
  return (
    <div className="keyboard-legend w-full lg:w-72 xl:w-80 flex-shrink-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 sm:p-4 md:p-5 border-2 border-blue-200 shadow-lg h-fit lg:sticky lg:top-4 max-h-screen lg:overflow-y-auto">
      <h3 className="font-bold text-gray-800 mb-2 sm:mb-3 text-base sm:text-lg flex items-center">
        <span className="text-xl sm:text-2xl mr-2">🎹</span>
        Keyboard Guide
      </h3>
      <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
        <div className="bg-white rounded-lg p-2 sm:p-3 shadow-sm">
          <div className="font-semibold text-blue-700 mb-1 sm:mb-2 text-xs sm:text-sm">White Keys</div>
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-1 sm:gap-2 text-[10px] sm:text-xs">
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

        <div className="bg-gray-800 text-white rounded-lg p-2 sm:p-3 shadow-sm">
          <div className="font-semibold text-purple-300 mb-1 sm:mb-2 text-xs sm:text-sm">Black Keys</div>
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-1 sm:gap-2 text-[10px] sm:text-xs">
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

        <div className="bg-white rounded-lg p-2 sm:p-3 shadow-sm">
          <div className="font-semibold text-green-700 mb-1 sm:mb-2 text-xs sm:text-sm">Navigation</div>
          <div className="space-y-0.5 sm:space-y-1 text-[10px] sm:text-xs">
            <div><kbd className="kbd-mini">← →</kbd> Beat</div>
            <div><kbd className="kbd-mini">↑ ↓</kbd> Measure</div>
            <div><kbd className="kbd-mini">Enter</kbd> Next</div>
            <div><kbd className="kbd-mini">Backspace</kbd> Prev</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-2 sm:p-3 shadow-sm">
          <div className="font-semibold text-orange-700 mb-1 sm:mb-2 text-xs sm:text-sm">Editing</div>
          <div className="space-y-0.5 sm:space-y-1 text-[10px] sm:text-xs">
            <div><kbd className="kbd-mini">Delete</kbd> Remove</div>
            <div><kbd className="kbd-mini">+</kbd> Add measure</div>
            <div><kbd className="kbd-mini">-</kbd> Remove measure</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .kbd-mini {
          display: inline-block;
          padding: 1px 4px;
          background: linear-gradient(to bottom, #ffffff, #e5e7eb);
          border: 1px solid #9ca3af;
          border-radius: 3px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          font-family: monospace;
          font-size: 9px;
          font-weight: 600;
          color: #1f2937;
          min-width: 16px;
          text-align: center;
        }

        @media (min-width: 640px) {
          .kbd-mini {
            padding: 2px 6px;
            font-size: 11px;
            min-width: 20px;
            border-radius: 4px;
          }
        }

        .kbd-mini-dark {
          display: inline-block;
          padding: 1px 4px;
          background: linear-gradient(to bottom, #4b5563, #1f2937);
          border: 1px solid #6b7280;
          border-radius: 3px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          font-family: monospace;
          font-size: 9px;
          font-weight: 600;
          color: #e5e7eb;
          min-width: 16px;
          text-align: center;
        }

        @media (min-width: 640px) {
          .kbd-mini-dark {
            padding: 2px 6px;
            font-size: 11px;
            min-width: 20px;
            border-radius: 4px;
          }
        }

        /* Scrollbar styling for the legend */
        .keyboard-legend::-webkit-scrollbar {
          width: 6px;
        }

        .keyboard-legend::-webkit-scrollbar-track {
          background: #e0e7ff;
          border-radius: 3px;
        }

        .keyboard-legend::-webkit-scrollbar-thumb {
          background: #818cf8;
          border-radius: 3px;
        }

        .keyboard-legend::-webkit-scrollbar-thumb:hover {
          background: #6366f1;
        }
      `}</style>
    </div>
  );
};

export default KeyboardLegend;
