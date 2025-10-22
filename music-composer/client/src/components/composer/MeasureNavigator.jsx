import React from 'react';
import { useMusicContext } from '../../contexts/MusicContext';
import { ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react';

/**
 * MeasureNavigator Component
 * Navigate between measures and manage measure count
 *
 * Features:
 * - Current measure display
 * - Previous/Next measure navigation
 * - Add/Remove measures
 * - Jump to specific measure
 * - Visual progress indicator
 */
const MeasureNavigator = () => {
  const {
    cursorPosition,
    setCursorPosition,
    measureCount,
    setMeasureCount,
    notes
  } = useMusicContext();

  const goToPreviousMeasure = () => {
    if (cursorPosition.measure > 1) {
      setCursorPosition(prev => ({
        ...prev,
        measure: prev.measure - 1,
        beat: 0
      }));
    }
  };

  const goToNextMeasure = () => {
    if (cursorPosition.measure < measureCount) {
      setCursorPosition(prev => ({
        ...prev,
        measure: prev.measure + 1,
        beat: 0
      }));
    } else {
      // Add a new measure if at the end
      setMeasureCount(measureCount + 1);
      setCursorPosition(prev => ({
        ...prev,
        measure: measureCount + 1,
        beat: 0
      }));
    }
  };

  const addMeasure = () => {
    setMeasureCount(measureCount + 1);
  };

  const removeMeasure = () => {
    if (measureCount > 1) {
      setMeasureCount(measureCount - 1);
      if (cursorPosition.measure > measureCount - 1) {
        setCursorPosition(prev => ({
          ...prev,
          measure: measureCount - 1
        }));
      }
    }
  };

  const jumpToMeasure = (measure) => {
    if (measure >= 1 && measure <= measureCount) {
      setCursorPosition(prev => ({
        ...prev,
        measure,
        beat: 0
      }));
    }
  };

  // Count notes in each measure
  const getNotesInMeasure = (measure) => {
    return notes.filter(n => n.measure === measure).length;
  };

  return (
    <div className="measure-navigator bg-white rounded-lg shadow-md border border-gray-200 p-4">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-2xl">📊</span>
        Measure Navigator
      </h3>

      {/* Current Measure Display */}
      <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <div className="text-center">
          <div className="text-sm font-semibold text-gray-600 mb-1">Current Measure</div>
          <div className="text-4xl font-bold text-blue-600">
            {cursorPosition.measure}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            of {measureCount} measures
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={goToPreviousMeasure}
          disabled={cursorPosition.measure === 1}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft size={20} />
          Previous
        </button>
        <button
          onClick={goToNextMeasure}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all"
        >
          Next
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Measure Count Controls */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={removeMeasure}
          disabled={measureCount <= 1}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Minus size={16} />
          Remove
        </button>
        <button
          onClick={addMeasure}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all"
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      {/* Measure Grid */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Jump to Measure:
        </label>
        <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 bg-gray-50 rounded-lg">
          {[...Array(measureCount)].map((_, idx) => {
            const measure = idx + 1;
            const noteCount = getNotesInMeasure(measure);
            const isCurrent = measure === cursorPosition.measure;

            return (
              <button
                key={measure}
                onClick={() => jumpToMeasure(measure)}
                className={`relative px-3 py-2 rounded-lg font-bold text-sm transition-all ${
                  isCurrent
                    ? 'bg-blue-500 text-white shadow-lg scale-110'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                <div>{measure}</div>
                {noteCount > 0 && (
                  <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    isCurrent ? 'bg-white text-blue-500' : 'bg-blue-500 text-white'
                  }`}>
                    {noteCount}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-2">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Progress</span>
          <span>{Math.round((cursorPosition.measure / measureCount) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(cursorPosition.measure / measureCount) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default MeasureNavigator;
