import React, { useCallback, useEffect, useState } from 'react';
import { Trash2, Plus, Minus, XCircle, AlertTriangle } from 'lucide-react';
import { useMusicContext } from '../../contexts/MusicContext';
import Staff from './Staff';
import DualStaff from './DualStaff';

/**
 * NoteEditor Component - Main editing interface for the musical composition
 * Displays multiple measures and handles note placement/deletion
 */
const NoteEditor = () => {
  const {
    measureCount,
    setMeasureCount,
    addNote,
    removeNote,
    selectedNoteId,
    setSelectedNoteId,
    notes,
    title,
    setTitle,
    clearAllNotes,
    deleteMeasure,
    newComposition,
    dualStaffMode,
    selectedTool,
    canAddNoteToMeasure,
    getTotalBeatsInMeasure,
    timeSignature
  } = useMusicContext();

  const [selectedMeasureToDelete, setSelectedMeasureToDelete] = useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [validationError, setValidationError] = useState('');

  /**
   * Handle clicking on staff to add a note
   */
  const handleNoteClick = useCallback((clickData) => {
    // Check if there's already a note at this position
    const existingNote = notes.find(
      note => note.measure === clickData.measure &&
              note.beat === clickData.beat &&
              note.pitch === clickData.pitch
    );

    if (existingNote) {
      // If clicking an existing note, select it
      setSelectedNoteId(existingNote.id);
      setValidationError('');
    } else {
      // Validate that note fits in the measure
      const validation = canAddNoteToMeasure(clickData.measure, selectedTool.duration);

      if (!validation.canAdd) {
        setValidationError(validation.message);
        // Clear error message after 3 seconds
        setTimeout(() => setValidationError(''), 3000);
        return;
      }

      // Add new note
      addNote({
        pitch: clickData.pitch,
        measure: clickData.measure,
        beat: clickData.beat,
        position: clickData.position,
        duration: selectedTool.duration
      });

      setValidationError('');
    }
  }, [notes, addNote, setSelectedNoteId, selectedTool, canAddNoteToMeasure]);

  /**
   * Handle keyboard shortcuts
   */
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Delete selected note with Delete or Backspace
      if ((event.key === 'Delete' || event.key === 'Backspace') && selectedNoteId) {
        event.preventDefault();
        removeNote(selectedNoteId);
      }

      // Add measure with +
      if (event.key === '+' && !event.target.matches('input')) {
        event.preventDefault();
        setMeasureCount(prev => Math.min(prev + 1, 16));
      }

      // Remove measure with -
      if (event.key === '-' && !event.target.matches('input')) {
        event.preventDefault();
        setMeasureCount(prev => Math.max(prev - 1, 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNoteId, removeNote, setMeasureCount]);

  /**
   * Delete selected note
   */
  const handleDeleteSelected = () => {
    if (selectedNoteId) {
      removeNote(selectedNoteId);
    }
  };

  /**
   * Add a measure
   */
  const handleAddMeasure = () => {
    setMeasureCount(prev => Math.min(prev + 1, 16));
  };

  /**
   * Remove a measure
   */
  const handleRemoveMeasure = () => {
    setMeasureCount(prev => Math.max(prev - 1, 1));
  };

  /**
   * Delete a specific measure's notes
   */
  const handleDeleteMeasureNotes = () => {
    if (selectedMeasureToDelete) {
      deleteMeasure(parseInt(selectedMeasureToDelete));
      setSelectedMeasureToDelete('');
    }
  };

  /**
   * Delete entire composition
   */
  const handleDeleteAllSong = () => {
    if (window.confirm('Are you sure you want to delete the entire composition? This cannot be undone.')) {
      newComposition();
      setShowDeleteConfirmation(false);
    }
  };

  // Calculate responsive staff width based on screen size
  const staffWidth = window.innerWidth > 1280 ? 500 : window.innerWidth > 768 ? 400 : 350;

  return (
    <div className="note-editor bg-white rounded-xl shadow-lg p-6">
      {/* Header with title and controls */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-3xl font-bold text-gray-800 border-b-2 border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none transition-colors px-2 py-1 w-full"
              placeholder="Composition Title"
            />
          </div>

          <div className="flex gap-3">
          {/* Delete Note Button */}
          <button
            onClick={handleDeleteSelected}
            disabled={!selectedNoteId}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
              selectedNoteId
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            title="Delete selected note (Delete/Backspace)"
          >
            <Trash2 className="inline-block mr-2" size={20} />
            Delete Note
          </button>

          {/* Measure Controls */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-2 py-1">
            <button
              onClick={handleRemoveMeasure}
              disabled={measureCount <= 1}
              className={`p-3 rounded-lg font-semibold transition-all duration-200 ${
                measureCount > 1
                  ? 'bg-white hover:bg-gray-200 text-gray-700 shadow'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
              title="Remove measure (-)"
            >
              <Minus size={20} />
            </button>

            <span className="px-4 font-bold text-gray-700 text-lg">
              {measureCount} {measureCount === 1 ? 'Measure' : 'Measures'}
            </span>

            <button
              onClick={handleAddMeasure}
              disabled={measureCount >= 16}
              className={`p-3 rounded-lg font-semibold transition-all duration-200 ${
                measureCount < 16
                  ? 'bg-white hover:bg-gray-200 text-gray-700 shadow'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
              title="Add measure (+)"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
        </div>

        {/* Delete Measure / Delete All Controls */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-lg p-4">
          {/* Delete Specific Measure */}
          <div className="flex-1 flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
            <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
              Delete Measure:
            </label>
            <select
              value={selectedMeasureToDelete}
              onChange={(e) => setSelectedMeasureToDelete(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-sm"
            >
              <option value="">Select a measure...</option>
              {Array.from({ length: measureCount }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Measure {i + 1}
                </option>
              ))}
            </select>
            <button
              onClick={handleDeleteMeasureNotes}
              disabled={!selectedMeasureToDelete}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap ${
                selectedMeasureToDelete
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg hover:shadow-xl hover:scale-105'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              title="Delete all notes from selected measure"
            >
              <XCircle className="inline-block mr-1" size={16} />
              Delete Measure Notes
            </button>
          </div>

          {/* Delete Entire Song */}
          <button
            onClick={handleDeleteAllSong}
            className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 whitespace-nowrap"
            title="Delete entire composition"
          >
            <AlertTriangle className="inline-block mr-2" size={18} />
            Delete Entire Song
          </button>
        </div>
      </div>

      {/* Information Banner */}
      <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 p-4 rounded-lg">
        <div className="flex items-start">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 mb-1">How to use:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Click on the staff to add notes at different positions</li>
              <li>• Use the toolbar above to select note duration, type, and accidentals</li>
              <li>• Click a note to select it, then press Delete/Backspace to remove it</li>
              <li>• Use the + and - buttons or keyboard shortcuts to add/remove measures</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Validation Error Message */}
      {validationError && (
        <div className="mb-4 bg-red-50 border border-red-300 rounded-lg p-3">
          <p className="text-sm font-semibold text-red-700">
            {validationError}
          </p>
        </div>
      )}

      {/* Selected Note Info */}
      {selectedNoteId && (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm font-semibold text-blue-800">
            Note selected - Press Delete or click the Delete Note button to remove
          </p>
        </div>
      )}

      {/* Staff Container - Scrollable for many measures */}
      <div className="staff-container-wrapper bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: measureCount }, (_, index) => {
            const measureNum = index + 1;
            const beatCount = getTotalBeatsInMeasure(measureNum);
            const maxBeats = timeSignature.beats;
            const isFull = beatCount >= maxBeats;

            return (
            <div key={measureNum} className="measure-container">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-600">
                  Measure {measureNum}
                </span>
                <div className="text-xs text-gray-500 space-y-0.5">
                  <div>
                    {notes.filter(n => n.measure === measureNum).length} note{notes.filter(n => n.measure === measureNum).length !== 1 ? 's' : ''}
                  </div>
                  <div className={`font-semibold ${isFull ? 'text-red-600' : beatCount > 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                    {beatCount.toFixed(2)}/{maxBeats} beats
                  </div>
                </div>
              </div>
              {dualStaffMode ? (
                <DualStaff
                  measureNumber={index + 1}
                  width={staffWidth}
                  onNoteClick={handleNoteClick}
                />
              ) : (
                <Staff
                  measureNumber={index + 1}
                  width={staffWidth}
                  onNoteClick={handleNoteClick}
                />
              )}
            </div>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{notes.length}</div>
            <div className="text-sm text-gray-600">Total Notes</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{measureCount}</div>
            <div className="text-sm text-gray-600">Measures</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {notes.filter(n => !n.isRest).length}
            </div>
            <div className="text-sm text-gray-600">Notes</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {notes.filter(n => n.isRest).length}
            </div>
            <div className="text-sm text-gray-600">Rests</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;
