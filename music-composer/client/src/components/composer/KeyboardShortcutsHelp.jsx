import React from 'react';
import { X } from 'lucide-react';

/**
 * KeyboardShortcutsHelp Component
 * Displays a comprehensive help overlay for all keyboard shortcuts
 */
const KeyboardShortcutsHelp = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    {
      category: 'Note Input',
      items: [
        { keys: 'A-G', description: 'Add note at cursor position' },
        { keys: 'Z-M, ,-/', description: 'Piano keyboard (first octave)' },
        { keys: 'Q-R', description: 'Piano keyboard (second octave)' },
        { keys: 'S, D, G, H, J', description: 'Black keys (first octave)' },
        { keys: 'L, ;, 2, 3, 4', description: 'Black keys (second octave)' },
        { keys: 'Shift + A-G', description: 'Add chord (hold Shift + press notes)' }
      ]
    },
    {
      category: 'Note Duration',
      items: [
        { keys: '1', description: 'Whole note (𝅝)' },
        { keys: '2', description: 'Half note (𝅗𝅥)' },
        { keys: '3', description: 'Quarter note (♩)' },
        { keys: '4', description: 'Eighth note (♪)' },
        { keys: '5', description: '16th note (𝅘𝅥𝅯)' },
        { keys: '6', description: '32nd note (𝅘𝅥𝅰)' }
      ]
    },
    {
      category: 'Accidentals',
      items: [
        { keys: 'S', description: 'Sharp (♯)' },
        { keys: 'F', description: 'Flat (♭)' },
        { keys: 'N', description: 'Natural (♮)' },
        { keys: 'Shift + N', description: 'Clear accidental' }
      ]
    },
    {
      category: 'Navigation',
      items: [
        { keys: '← →', description: 'Move cursor left/right' },
        { keys: '↑ ↓', description: 'Transpose selected note' },
        { keys: 'Space', description: 'Play/Pause' },
        { keys: 'Delete/Backspace', description: 'Delete selected note' }
      ]
    },
    {
      category: 'Editing',
      items: [
        { keys: 'Ctrl/Cmd + Z', description: 'Undo' },
        { keys: 'Ctrl/Cmd + Y', description: 'Redo' },
        { keys: 'Ctrl/Cmd + S', description: 'Save composition' },
        { keys: 'Esc', description: 'Deselect/Cancel' }
      ]
    }
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-xl flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                ⌨️ Keyboard Shortcuts
              </h2>
              <p className="text-blue-100 text-sm mt-1">Master these shortcuts to compose faster!</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {shortcuts.map((category, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    {category.category}
                  </h3>
                  <div className="space-y-3">
                    {category.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex items-center justify-between gap-4">
                        <kbd className="px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm font-mono text-sm font-semibold text-gray-700 min-w-[120px] text-center">
                          {item.keys}
                        </kbd>
                        <span className="text-sm text-gray-600 flex-1">{item.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Tips Section */}
            <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
              <h3 className="text-lg font-bold text-yellow-900 mb-2 flex items-center gap-2">
                💡 Pro Tips
              </h3>
              <ul className="text-sm text-yellow-800 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold">•</span>
                  <span>Click on piano keys or use keyboard shortcuts for faster input</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold">•</span>
                  <span>Hold Shift and press multiple note keys to create chords instantly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold">•</span>
                  <span>Use arrow keys to navigate and transpose without reaching for the mouse</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold">•</span>
                  <span>Press numbers 1-6 before adding notes to set the duration</span>
                </li>
              </ul>
            </div>

            {/* Close Button */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                Got it! Let's compose 🎵
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default KeyboardShortcutsHelp;
