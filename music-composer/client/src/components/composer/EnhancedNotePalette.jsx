import React, { useState } from 'react';
import { Music, Hand } from 'lucide-react';
import { useMusicContext } from '../../contexts/MusicContext';

/**
 * EnhancedNotePalette Component
 * Drag-and-drop note palette with visual preview
 *
 * Features:
 * - Click to select note type, then click staff to place
 * - Drag notes from palette and drop onto staff
 * - Visual feedback showing selected note
 * - Large, easy-to-click note buttons
 * - Organized by duration and accidental
 */
const EnhancedNotePalette = () => {
  const { selectedTool, setSelectedTool } = useMusicContext();
  const [draggedNote, setDraggedNote] = useState(null);

  // Note configurations with visual symbols
  const noteTypes = [
    {
      category: 'Notes',
      items: [
        { duration: 'w', symbol: '𝅝', name: 'Whole Note', color: 'blue' },
        { duration: 'h', symbol: '𝅗𝅥', name: 'Half Note', color: 'blue' },
        { duration: 'q', symbol: '♩', name: 'Quarter Note', color: 'blue' },
        { duration: '8', symbol: '♪', name: 'Eighth Note', color: 'blue' },
        { duration: '16', symbol: '𝅘𝅥𝅯', name: '16th Note', color: 'blue' },
      ]
    },
    {
      category: 'Rests',
      items: [
        { duration: 'w', symbol: '𝄻', name: 'Whole Rest', isRest: true, color: 'purple' },
        { duration: 'h', symbol: '𝄼', name: 'Half Rest', isRest: true, color: 'purple' },
        { duration: 'q', symbol: '𝄽', name: 'Quarter Rest', isRest: true, color: 'purple' },
        { duration: '8', symbol: '𝄾', name: 'Eighth Rest', isRest: true, color: 'purple' },
      ]
    },
    {
      category: 'Accidentals',
      items: [
        { accidental: '#', symbol: '♯', name: 'Sharp', color: 'green' },
        { accidental: 'b', symbol: '♭', name: 'Flat', color: 'green' },
        { accidental: 'n', symbol: '♮', name: 'Natural', color: 'green' },
        { accidental: null, symbol: 'None', name: 'No Accidental', color: 'gray' },
      ]
    }
  ];

  /**
   * Handle note selection (click mode)
   */
  const handleNoteClick = (item) => {
    const newTool = {
      ...selectedTool,
      type: item.isRest ? 'rest' : 'note'
    };

    if (item.duration) {
      newTool.duration = item.duration;
    }

    if ('accidental' in item) {
      newTool.accidental = item.accidental;
    }

    setSelectedTool(newTool);
  };

  /**
   * Handle drag start
   */
  const handleDragStart = (e, item) => {
    setDraggedNote(item);

    // Set drag data for staff to receive
    const dragData = {
      duration: item.duration || selectedTool.duration,
      accidental: item.accidental !== undefined ? item.accidental : selectedTool.accidental,
      isRest: item.isRest || false,
      type: item.isRest ? 'rest' : 'note'
    };

    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'copy';

    // Create custom drag image
    const dragImage = e.currentTarget.cloneNode(true);
    dragImage.style.opacity = '0.8';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 25, 25);
    setTimeout(() => document.body.removeChild(dragImage), 0);
  };

  /**
   * Handle drag end
   */
  const handleDragEnd = () => {
    setDraggedNote(null);
  };

  /**
   * Check if item is currently selected
   */
  const isSelected = (item) => {
    if (item.duration) {
      return selectedTool.duration === item.duration &&
             selectedTool.type === (item.isRest ? 'rest' : 'note');
    }
    if ('accidental' in item) {
      return selectedTool.accidental === item.accidental;
    }
    return false;
  };

  /**
   * Get color classes based on item type
   */
  const getColorClasses = (item) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
      green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      gray: 'from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600'
    };
    return colors[item.color] || colors.blue;
  };

  return (
    <div className="enhanced-note-palette bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2 mb-2">
          <Music size={24} />
          Note Palette
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
          <Hand size={16} />
          Click to select • Drag to place on staff
        </p>
      </div>

      {/* Current Selection Display */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-700">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Currently Selected:
        </p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-4xl">
              {selectedTool.type === 'rest'
                ? (selectedTool.duration === 'w' ? '𝄻' :
                   selectedTool.duration === 'h' ? '𝄼' :
                   selectedTool.duration === 'q' ? '𝄽' : '𝄾')
                : (selectedTool.duration === 'w' ? '𝅝' :
                   selectedTool.duration === 'h' ? '𝅗𝅥' :
                   selectedTool.duration === 'q' ? '♩' :
                   selectedTool.duration === '8' ? '♪' : '𝅘𝅥𝅯')
              }
            </span>
            <div>
              <p className="font-bold text-gray-800 dark:text-gray-200">
                {selectedTool.type === 'rest' ? 'Rest' : 'Note'}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {selectedTool.duration === 'w' ? 'Whole' :
                 selectedTool.duration === 'h' ? 'Half' :
                 selectedTool.duration === 'q' ? 'Quarter' :
                 selectedTool.duration === '8' ? 'Eighth' : 'Sixteenth'}
              </p>
            </div>
          </div>
          {selectedTool.accidental && (
            <div className="flex items-center gap-2 ml-4 pl-4 border-l-2 border-gray-300 dark:border-gray-600">
              <span className="text-3xl">
                {selectedTool.accidental === '#' ? '♯' :
                 selectedTool.accidental === 'b' ? '♭' : '♮'}
              </span>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                {selectedTool.accidental === '#' ? 'Sharp' :
                 selectedTool.accidental === 'b' ? 'Flat' : 'Natural'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Note Categories */}
      {noteTypes.map((category) => (
        <div key={category.category} className="mb-8">
          <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
            {category.category}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {category.items.map((item, index) => (
              <button
                key={index}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                onDragEnd={handleDragEnd}
                onClick={() => handleNoteClick(item)}
                className={`
                  relative group
                  flex flex-col items-center justify-center
                  p-4 rounded-xl
                  transition-all duration-200
                  cursor-grab active:cursor-grabbing
                  ${isSelected(item)
                    ? `bg-gradient-to-br ${getColorClasses(item)} text-white shadow-xl scale-110 ring-4 ring-offset-2 ring-${item.color}-300 dark:ring-offset-gray-800`
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 shadow-md hover:shadow-lg hover:scale-105'
                  }
                `}
                title={`${item.name} - Click to select or drag to staff`}
              >
                {/* Drag indicator */}
                <div className={`absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-opacity ${
                  isSelected(item) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}>
                  <Hand size={14} />
                </div>

                {/* Note Symbol */}
                <div className="text-5xl mb-2 font-bold">
                  {item.symbol}
                </div>

                {/* Note Name */}
                <div className={`text-xs font-semibold text-center ${
                  isSelected(item) ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {item.name.split(' ').map((word, i) => (
                    <div key={i}>{word}</div>
                  ))}
                </div>

                {/* Selection indicator */}
                {isSelected(item) && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-white dark:bg-gray-800 rounded-full border-2 border-current flex items-center justify-center">
                    <div className="w-2 h-2 bg-current rounded-full"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Usage Instructions */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <h5 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
          💡 How to Use:
        </h5>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li>• <strong>Click</strong> a note to select it, then click on the staff to place</li>
          <li>• <strong>Drag</strong> a note from the palette and drop it onto the staff</li>
          <li>• <strong>Keyboard shortcuts:</strong> 1-5 for durations, S/F/N for accidentals</li>
          <li>• <strong>Delete key</strong> removes selected notes from staff</li>
          <li>• Selected note shows with blue highlight and ring</li>
        </ul>
      </div>

      {/* Drag Feedback */}
      {draggedNote && (
        <div className="fixed bottom-8 right-8 bg-blue-500 text-white px-6 py-3 rounded-full shadow-2xl animate-pulse z-50">
          <p className="text-sm font-bold">
            Dragging: {draggedNote.name}
          </p>
        </div>
      )}
    </div>
  );
};

export default EnhancedNotePalette;
