import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

/**
 * MusicContext - Manages the state of the music composition
 * Handles notes, time signature, key signature, and editing tools
 */

const MusicContext = createContext();

export const useMusicContext = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusicContext must be used within MusicProvider');
  }
  return context;
};

export const MusicProvider = ({ children }) => {
  // Composition metadata
  const [title, setTitle] = useState('Untitled Composition');
  const [composer, setComposer] = useState('');
  const [tempo, setTempo] = useState(120); // BPM

  // Musical properties
  const [timeSignature, setTimeSignature] = useState({ beats: 4, beatType: 4 }); // 4/4 time
  const [keySignature, setKeySignature] = useState('C'); // C major (no sharps/flats)
  const [clef, setClef] = useState('treble'); // treble or bass
  const [dualStaffMode, setDualStaffMode] = useState(false); // Enable both treble and bass clef (piano mode)
  const [currentStaff, setCurrentStaff] = useState('treble'); // Which staff to add notes to in dual mode

  // Notes array - each note has: { id, pitch, duration, accidental, measure, beat, position, staff }
  // pitch: string like 'C/4' (note/octave)
  // duration: 'w' (whole), 'h' (half), 'q' (quarter), '8' (eighth), '16' (sixteenth)
  // accidental: null, '#', 'b', 'n' (natural)
  // measure: measure number (1-indexed)
  // beat: beat position within measure (0-indexed)
  // position: vertical position for UI (staff line/space)
  // staff: 'treble' or 'bass' (which staff the note belongs to in dual mode)
  const [notes, setNotes] = useState([]);

  // Undo/Redo history management
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isUndoRedoing, setIsUndoRedoing] = useState(false);

  // Current editing tool
  const [selectedTool, setSelectedTool] = useState({
    type: 'note', // 'note' or 'rest'
    duration: 'q', // default quarter note
    accidental: null // null, '#', 'b', 'n'
  });

  // Selection and editing state
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [measureCount, setMeasureCount] = useState(4); // Number of measures to display

  // Palette note selection for click-to-place mode
  const [selectedPaletteNote, setSelectedPaletteNote] = useState(null);

  // Cursor position for MuseScore-style input
  const [cursorPosition, setCursorPosition] = useState({
    measure: 1,
    beat: 0,
    staff: 'treble' // 'treble' or 'bass'
  });

  // Input mode state
  const [inputMode, setInputMode] = useState('note'); // 'note', 'rest', 'chord'
  const [chordNotes, setChordNotes] = useState([]); // Temporary storage for chord building

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlaybackPosition, setCurrentPlaybackPosition] = useState(0);

  /**
   * Calculate the duration value in beats for a given note duration
   */
  const getDurationInBeats = (duration) => {
    const durationMap = {
      'w': 4,    // Whole note = 4 beats
      'h': 2,    // Half note = 2 beats
      'q': 1,    // Quarter note = 1 beat
      '8': 0.5,  // Eighth note = 0.5 beats
      '16': 0.25, // Sixteenth note = 0.25 beats
      '32': 0.125 // Thirty-second note = 0.125 beats
    };
    return durationMap[duration] || 1;
  };

  /**
   * Check if a measure is full and auto-create new measures if needed
   */
  const checkAndCreateMeasures = useCallback((measureNumber) => {
    const notesInMeasure = notes.filter(n => n.measure === measureNumber);

    // Calculate total beats in the measure
    let totalBeats = 0;
    notesInMeasure.forEach(note => {
      totalBeats += getDurationInBeats(note.duration);
    });

    // Get max beats allowed per measure from time signature
    const maxBeats = timeSignature.beats;

    // If measure is full or nearly full, and this is the last measure, create a new one
    if (totalBeats >= maxBeats && measureNumber === measureCount) {
      setMeasureCount(prev => prev + 1);
    }
  }, [notes, timeSignature, measureCount]);

  /**
   * Add a note to the composition
   */
  const addNote = useCallback((noteData) => {
    const newNote = {
      id: `note-${Date.now()}-${Math.random()}`,
      pitch: noteData.pitch,
      duration: noteData.duration || selectedTool.duration,
      accidental: noteData.accidental || selectedTool.accidental,
      measure: noteData.measure,
      beat: noteData.beat,
      position: noteData.position,
      isRest: selectedTool.type === 'rest',
      staff: noteData.staff || currentStaff // Assign to current staff in dual mode
    };

    setNotes(prevNotes => {
      const updatedNotes = [...prevNotes, newNote];

      // Check if we need to create a new measure after adding this note
      setTimeout(() => checkAndCreateMeasures(newNote.measure), 0);

      return updatedNotes;
    });

    return newNote.id;
  }, [selectedTool, currentStaff, checkAndCreateMeasures]);

  /**
   * Remove a note from the composition
   */
  const removeNote = useCallback((noteId) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
    if (selectedNoteId === noteId) {
      setSelectedNoteId(null);
    }
  }, [selectedNoteId]);

  /**
   * Update an existing note
   */
  const updateNote = useCallback((noteId, updates) => {
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === noteId ? { ...note, ...updates } : note
      )
    );
  }, []);

  /**
   * Clear all notes
   */
  const clearAllNotes = useCallback(() => {
    setNotes([]);
    setSelectedNoteId(null);
  }, []);

  /**
   * Sort notes by measure and beat position
   */
  const getSortedNotes = useCallback(() => {
    return [...notes].sort((a, b) => {
      if (a.measure !== b.measure) {
        return a.measure - b.measure;
      }
      return a.beat - b.beat;
    });
  }, [notes]);

  /**
   * Get notes for a specific measure
   */
  const getNotesForMeasure = useCallback((measureNumber) => {
    return notes.filter(note => note.measure === measureNumber);
  }, [notes]);

  /**
   * Delete all notes from a specific measure
   */
  const deleteMeasure = useCallback((measureNumber) => {
    setNotes(prevNotes => prevNotes.filter(note => note.measure !== measureNumber));
  }, []);

  /**
   * Move cursor to next position (advance by current note duration)
   */
  const moveCursorForward = useCallback(() => {
    const currentDuration = getDurationInBeats(selectedTool.duration);
    setCursorPosition(prev => {
      const newBeat = prev.beat + currentDuration;
      const maxBeats = timeSignature.beats;

      // Check if we need to move to next measure
      if (newBeat >= maxBeats) {
        const nextMeasure = prev.measure + 1;

        // Auto-create measure if advancing past the last measure
        if (nextMeasure > measureCount) {
          setMeasureCount(nextMeasure);
        }

        return {
          ...prev,
          measure: nextMeasure,
          beat: 0
        };
      }

      return {
        ...prev,
        beat: newBeat
      };
    });
  }, [selectedTool.duration, timeSignature, measureCount]);

  /**
   * Move cursor to previous position
   */
  const moveCursorBackward = useCallback(() => {
    const currentDuration = getDurationInBeats(selectedTool.duration);
    setCursorPosition(prev => {
      const newBeat = prev.beat - currentDuration;

      // Check if we need to move to previous measure
      if (newBeat < 0) {
        if (prev.measure > 1) {
          return {
            ...prev,
            measure: prev.measure - 1,
            beat: timeSignature.beats - currentDuration
          };
        }
        return prev; // Can't go before measure 1
      }

      return {
        ...prev,
        beat: newBeat
      };
    });
  }, [selectedTool.duration, timeSignature]);

  /**
   * Add note at cursor position using letter name (A-G)
   * This is the MuseScore-style input method
   */
  const addNoteAtCursor = useCallback((noteLetter) => {
    // Ensure we have enough measures before adding note
    if (cursorPosition.measure > measureCount) {
      setMeasureCount(cursorPosition.measure);
    }

    // Determine octave based on clef and current cursor staff
    const baseOctave = cursorPosition.staff === 'bass' ? 3 : 4;
    const pitch = `${noteLetter}/${baseOctave}`;

    const noteData = {
      pitch,
      measure: cursorPosition.measure,
      beat: cursorPosition.beat,
      position: 0, // Will be calculated by rendering engine
      duration: selectedTool.duration,
      accidental: selectedTool.accidental,
      staff: cursorPosition.staff
    };

    // Add the note
    const noteId = addNote(noteData);

    // Automatically advance cursor after adding note (MuseScore behavior)
    moveCursorForward();

    return noteId;
  }, [cursorPosition, selectedTool, addNote, moveCursorForward, measureCount]);

  /**
   * Add chord at cursor position
   */
  const addChordAtCursor = useCallback((noteLetters) => {
    // Ensure we have enough measures before adding chord
    if (cursorPosition.measure > measureCount) {
      setMeasureCount(cursorPosition.measure);
    }

    const baseOctave = cursorPosition.staff === 'bass' ? 3 : 4;
    const noteIds = [];

    noteLetters.forEach(noteLetter => {
      const pitch = `${noteLetter}/${baseOctave}`;
      const noteData = {
        pitch,
        measure: cursorPosition.measure,
        beat: cursorPosition.beat,
        position: 0,
        duration: selectedTool.duration,
        accidental: selectedTool.accidental,
        staff: cursorPosition.staff
      };

      noteIds.push(addNote(noteData));
    });

    // Advance cursor after chord input
    moveCursorForward();

    return noteIds;
  }, [cursorPosition, selectedTool, addNote, moveCursorForward, measureCount]);

  /**
   * Save composition to localStorage
   */
  const saveToLocalStorage = useCallback(() => {
    const composition = {
      title,
      composer,
      tempo,
      timeSignature,
      keySignature,
      clef,
      notes,
      measureCount,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem('currentComposition', JSON.stringify(composition));
    return composition;
  }, [title, composer, tempo, timeSignature, keySignature, clef, notes, measureCount]);

  /**
   * Load composition from localStorage
   */
  const loadFromLocalStorage = useCallback(() => {
    const saved = localStorage.getItem('currentComposition');
    if (saved) {
      try {
        const composition = JSON.parse(saved);
        setTitle(composition.title || 'Untitled Composition');
        setComposer(composition.composer || '');
        setTempo(composition.tempo || 120);
        setTimeSignature(composition.timeSignature || { beats: 4, beatType: 4 });
        setKeySignature(composition.keySignature || 'C');
        setClef(composition.clef || 'treble');
        setNotes(composition.notes || []);
        setMeasureCount(composition.measureCount || 4);
        return true;
      } catch (error) {
        console.error('Error loading composition:', error);
        return false;
      }
    }
    return false;
  }, []);

  /**
   * Create a new composition (reset to defaults)
   */
  const newComposition = useCallback(() => {
    setTitle('Untitled Composition');
    setComposer('');
    setTempo(120);
    setTimeSignature({ beats: 4, beatType: 4 });
    setKeySignature('C');
    setClef('treble');
    setNotes([]);
    setSelectedNoteId(null);
    setMeasureCount(4);
    setIsPlaying(false);
    setCurrentPlaybackPosition(0);
    setHistory([]);
    setHistoryIndex(-1);
  }, []);

  /**
   * Save current state to history for undo/redo
   * This creates a snapshot of the current notes state
   */
  const saveToHistory = useCallback((newNotes) => {
    if (isUndoRedoing) return; // Don't save to history during undo/redo operations

    setHistory(prevHistory => {
      // Remove any future history if we're not at the end
      const newHistory = prevHistory.slice(0, historyIndex + 1);
      // Add new state
      newHistory.push([...newNotes]);
      // Limit history to last 50 states to prevent memory issues
      if (newHistory.length > 50) {
        newHistory.shift();
        return newHistory;
      }
      return newHistory;
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [historyIndex, isUndoRedoing]);

  /**
   * Undo the last action
   */
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setIsUndoRedoing(true);
      setHistoryIndex(prev => prev - 1);
      setNotes(history[historyIndex - 1]);
      // Reset flag after state update
      setTimeout(() => setIsUndoRedoing(false), 0);
    }
  }, [historyIndex, history]);

  /**
   * Redo the last undone action
   */
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setIsUndoRedoing(true);
      setHistoryIndex(prev => prev + 1);
      setNotes(history[historyIndex + 1]);
      // Reset flag after state update
      setTimeout(() => setIsUndoRedoing(false), 0);
    }
  }, [historyIndex, history]);

  /**
   * Check if undo is available
   */
  const canUndo = historyIndex > 0;

  /**
   * Check if redo is available
   */
  const canRedo = historyIndex < history.length - 1;

  /**
   * Track changes to notes and save to history
   */
  useEffect(() => {
    if (!isUndoRedoing && notes.length >= 0) {
      saveToHistory(notes);
    }
  }, [notes, isUndoRedoing, saveToHistory]);

  /**
   * Auto-save to localStorage every 30 seconds
   */
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (notes.length > 0) {
        saveToLocalStorage();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [notes, saveToLocalStorage]);

  const value = {
    // Metadata
    title,
    setTitle,
    composer,
    setComposer,
    tempo,
    setTempo,

    // Musical properties
    timeSignature,
    setTimeSignature,
    keySignature,
    setKeySignature,
    clef,
    setClef,
    dualStaffMode,
    setDualStaffMode,
    currentStaff,
    setCurrentStaff,

    // Notes
    notes,
    setNotes,
    addNote,
    removeNote,
    updateNote,
    clearAllNotes,
    getSortedNotes,
    getNotesForMeasure,
    deleteMeasure,

    // Tool selection
    selectedTool,
    setSelectedTool,

    // Selection
    selectedNoteId,
    setSelectedNoteId,

    // Palette selection
    selectedPaletteNote,
    setSelectedPaletteNote,

    // Cursor position (MuseScore-style input)
    cursorPosition,
    setCursorPosition,
    moveCursorForward,
    moveCursorBackward,
    addNoteAtCursor,
    addChordAtCursor,

    // Input mode
    inputMode,
    setInputMode,
    chordNotes,
    setChordNotes,

    // Measures
    measureCount,
    setMeasureCount,

    // Playback
    isPlaying,
    setIsPlaying,
    currentPlaybackPosition,
    setCurrentPlaybackPosition,

    // Storage
    saveToLocalStorage,
    loadFromLocalStorage,
    newComposition,

    // Undo/Redo
    undo,
    redo,
    canUndo,
    canRedo
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};

export default MusicContext;
