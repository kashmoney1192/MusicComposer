import React, { useRef, useEffect, useState } from 'react';
import { Renderer, Stave, StaveNote, Voice, Formatter, Accidental, StaveConnector, Beam } from 'vexflow';
import { useMusicContext } from '../../contexts/MusicContext';
import KeyboardWithControls from './KeyboardWithControls';
import QuickNoteToolbar from './QuickNoteToolbar';

/**
 * StaffView Component
 * Advanced multi-measure, multi-system staff rendering using VexFlow
 *
 * This component handles:
 * - Multiple measures per system (row)
 * - Multiple systems (rows) on the page
 * - Dual-staff mode for piano (treble and bass clefs)
 * - Interactive note placement by clicking on the staff
 * - Note selection and highlighting
 * - Automatic beaming of eighth and sixteenth notes
 *
 * Architecture:
 * - Uses VexFlow for professional music notation rendering
 * - Connects to MusicContext for note data and editing operations
 * - Supports both treble and bass clefs
 * - Automatically calculates layout based on window size
 * - Provides click handlers for interactive note input
 */
const StaffView = () => {
  const containerRef = useRef(null);
  const [staffWidth, setStaffWidth] = useState(0);

  const {
    notes,
    measureCount,
    timeSignature,
    keySignature,
    clef,
    dualStaffMode,
    currentStaff,
    selectedTool,
    addNote,
    selectedNoteId,
    setSelectedNoteId,
    removeNote
  } = useMusicContext();

  /**
   * Calculate responsive staff dimensions
   * Adjusts measures per system based on window width
   */
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        setStaffWidth(containerWidth);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  /**
   * Calculate how many measures fit per system based on window width
   */
  const getMeasuresPerSystem = () => {
    if (staffWidth < 600) return 2;
    if (staffWidth < 900) return 3;
    if (staffWidth < 1200) return 4;
    return 4;
  };

  /**
   * Convert VexFlow note key to pitch for MusicContext
   * VexFlow format: 'c/4' -> MusicContext format: 'C/4'
   */
  const vexflowKeyToPitch = (key) => {
    return key.toUpperCase();
  };

  /**
   * Convert MusicContext pitch to VexFlow key
   * MusicContext format: 'C/4' -> VexFlow format: 'c/4'
   */
  const pitchToVexflowKey = (pitch) => {
    return pitch.toLowerCase();
  };

  /**
   * Handle click on staff to place a note
   * Calculates the pitch based on vertical position within the staff
   */
  const handleStaffClick = (event, measureNum, staffType = 'treble') => {
    const rect = event.currentTarget.getBoundingClientRect();
    const y = event.clientY - rect.top;

    // Calculate which line/space was clicked
    // Staff has 5 lines with 4 spaces between them
    // Each line/space represents a note in the scale
    const staffHeight = 80; // Approximate height of staff
    const lineSpacing = staffHeight / 8; // Space between lines
    const linePosition = Math.round(y / lineSpacing);

    // Map line positions to notes for treble clef
    // Lines (from bottom to top): E4, G4, B4, D5, F5
    // Spaces (from bottom to top): F4, A4, C5, E5
    const trebleNotes = [
      'F/5', 'E/5', 'D/5', 'C/5', 'B/4', 'A/4', 'G/4', 'F/4', 'E/4', 'D/4', 'C/4'
    ];

    // Map line positions to notes for bass clef
    // Lines (from bottom to top): G2, B2, D3, F3, A3
    // Spaces (from bottom to top): A2, C3, E3, G3
    const bassNotes = [
      'A/3', 'G/3', 'F/3', 'E/3', 'D/3', 'C/3', 'B/2', 'A/2', 'G/2', 'F/2', 'E/2'
    ];

    const noteArray = staffType === 'bass' ? bassNotes : trebleNotes;
    const pitch = noteArray[Math.min(linePosition, noteArray.length - 1)];

    // Add note to context
    addNote({
      pitch,
      measure: measureNum,
      beat: 0, // We'll calculate proper beat position later
      position: linePosition,
      duration: selectedTool.duration,
      accidental: selectedTool.accidental,
      staff: dualStaffMode ? staffType : clef
    });
  };

  /**
   * Handle click on a note to select it
   */
  const handleNoteClick = (noteId, event) => {
    event.stopPropagation();
    setSelectedNoteId(noteId);
  };

  /**
   * Render a single-staff measure (treble or bass)
   */
  const renderSingleStaffMeasure = (context, measureNum, x, y, width) => {
    const stave = new Stave(x, y, width);

    // Add clef to first measure
    if (measureNum === 1) {
      stave.addClef(clef);
      stave.addTimeSignature(`${timeSignature.beats}/${timeSignature.beatType}`);
      if (keySignature !== 'C') {
        stave.addKeySignature(keySignature);
      }
    }

    stave.setContext(context).draw();

    // Get notes for this measure
    const measureNotes = notes.filter(note => note.measure === measureNum);

    if (measureNotes.length > 0) {
      // Convert notes to VexFlow format
      const vexflowNotes = measureNotes.map(note => {
        const keys = note.isRest ? ['b/4'] : [pitchToVexflowKey(note.pitch)];

        const staveNote = new StaveNote({
          keys,
          duration: note.duration + (note.isRest ? 'r' : ''),
          clef: clef
        });

        // Add accidentals if present
        if (!note.isRest && note.accidental) {
          staveNote.addModifier(new Accidental(note.accidental), 0);
        }

        // Highlight selected note
        if (note.id === selectedNoteId) {
          staveNote.setStyle({ fillStyle: 'blue', strokeStyle: 'blue' });
        }

        return staveNote;
      });

      // Create voice and format
      const voice = new Voice({
        num_beats: timeSignature.beats,
        beat_value: timeSignature.beatType
      });

      voice.setStrict(false);
      voice.addTickables(vexflowNotes);

      // Format and draw
      new Formatter()
        .joinVoices([voice])
        .format([voice], width - 20);

      voice.draw(context, stave);

      // Auto-beam eighth and sixteenth notes
      const beamableNotes = vexflowNotes.filter(n =>
        n.duration === '8' || n.duration === '16'
      );
      if (beamableNotes.length > 1) {
        const beam = new Beam(beamableNotes);
        beam.setContext(context).draw();
      }
    }

    return stave;
  };

  /**
   * Render a dual-staff measure (grand staff with treble and bass)
   */
  const renderDualStaffMeasure = (context, measureNum, x, y, width) => {
    // Create treble staff
    const trebleStave = new Stave(x, y, width);
    trebleStave.addClef('treble');

    if (measureNum === 1) {
      trebleStave.addTimeSignature(`${timeSignature.beats}/${timeSignature.beatType}`);
      if (keySignature !== 'C') {
        trebleStave.addKeySignature(keySignature);
      }
    }

    trebleStave.setContext(context).draw();

    // Create bass staff
    const bassStave = new Stave(x, y + 120, width);
    bassStave.addClef('bass');

    if (measureNum === 1) {
      bassStave.addTimeSignature(`${timeSignature.beats}/${timeSignature.beatType}`);
      if (keySignature !== 'C') {
        bassStave.addKeySignature(keySignature);
      }
    }

    bassStave.setContext(context).draw();

    // Draw brace and bar line connecting staves
    const connector = new StaveConnector(trebleStave, bassStave);
    connector.setType(StaveConnector.type.BRACE);
    connector.setContext(context).draw();

    const barline = new StaveConnector(trebleStave, bassStave);
    barline.setType(StaveConnector.type.SINGLE_LEFT);
    barline.setContext(context).draw();

    // Render notes for each staff
    const trebleNotes = notes.filter(n => n.measure === measureNum && n.staff === 'treble');
    const bassNotes = notes.filter(n => n.measure === measureNum && n.staff === 'bass');

    // Render treble notes
    if (trebleNotes.length > 0) {
      const vexflowNotes = trebleNotes.map(note => {
        const keys = note.isRest ? ['b/4'] : [pitchToVexflowKey(note.pitch)];
        const staveNote = new StaveNote({
          keys,
          duration: note.duration + (note.isRest ? 'r' : ''),
          clef: 'treble'
        });

        if (!note.isRest && note.accidental) {
          staveNote.addModifier(new Accidental(note.accidental), 0);
        }

        if (note.id === selectedNoteId) {
          staveNote.setStyle({ fillStyle: 'blue', strokeStyle: 'blue' });
        }

        return staveNote;
      });

      const voice = new Voice({ num_beats: timeSignature.beats, beat_value: timeSignature.beatType });
      voice.setStrict(false);
      voice.addTickables(vexflowNotes);

      new Formatter().joinVoices([voice]).format([voice], width - 20);
      voice.draw(context, trebleStave);
    }

    // Render bass notes
    if (bassNotes.length > 0) {
      const vexflowNotes = bassNotes.map(note => {
        const keys = note.isRest ? ['d/3'] : [pitchToVexflowKey(note.pitch)];
        const staveNote = new StaveNote({
          keys,
          duration: note.duration + (note.isRest ? 'r' : ''),
          clef: 'bass'
        });

        if (!note.isRest && note.accidental) {
          staveNote.addModifier(new Accidental(note.accidental), 0);
        }

        if (note.id === selectedNoteId) {
          staveNote.setStyle({ fillStyle: 'blue', strokeStyle: 'blue' });
        }

        return staveNote;
      });

      const voice = new Voice({ num_beats: timeSignature.beats, beat_value: timeSignature.beatType });
      voice.setStrict(false);
      voice.addTickables(vexflowNotes);

      new Formatter().joinVoices([voice]).format([voice], width - 20);
      voice.draw(context, bassStave);
    }

    return { trebleStave, bassStave };
  };

  /**
   * Main rendering function
   * Handles multi-system layout and calls measure rendering functions
   */
  useEffect(() => {
    if (!containerRef.current || staffWidth === 0) return;

    // Clear previous rendering
    containerRef.current.innerHTML = '';

    const measuresPerSystem = getMeasuresPerSystem();
    const systemCount = Math.ceil(measureCount / measuresPerSystem);

    const measureWidth = Math.floor(staffWidth / measuresPerSystem) - 20;
    const systemHeight = dualStaffMode ? 280 : 160;

    const totalHeight = systemCount * systemHeight + 40;

    // Create renderer
    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
    renderer.resize(staffWidth, totalHeight);
    const context = renderer.getContext();

    // Render each system
    for (let system = 0; system < systemCount; system++) {
      const startMeasure = system * measuresPerSystem + 1;
      const endMeasure = Math.min(startMeasure + measuresPerSystem - 1, measureCount);

      // Render measures in this system
      for (let m = startMeasure; m <= endMeasure; m++) {
        const col = (m - startMeasure);
        const x = col * (measureWidth + 20) + 10;
        const y = system * systemHeight + 40;

        if (dualStaffMode) {
          renderDualStaffMeasure(context, m, x, y, measureWidth);
        } else {
          renderSingleStaffMeasure(context, m, x, y, measureWidth);
        }
      }
    }

  }, [notes, measureCount, staffWidth, dualStaffMode, clef, timeSignature, keySignature, selectedNoteId]);

  /**
   * Handle keyboard delete for selected note
   */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Delete' && selectedNoteId) {
        removeNote(selectedNoteId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNoteId, removeNote]);

  return (
    <div className="staff-view bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* Quick Note Toolbar */}
      <QuickNoteToolbar />

      <div className="p-6">
        {/* Staff Title */}
        <div className="mb-4 text-center">
          <h2 className="text-xl font-bold text-gray-800">
            {dualStaffMode ? 'Piano Score (Grand Staff)' : `${clef.charAt(0).toUpperCase() + clef.slice(1)} Clef`}
          </h2>
          <p className="text-sm text-gray-600">
            Click the keyboard keys below OR press the letters on your computer keyboard
          </p>
        </div>

        {/* Visual Keyboard with Input Controls */}
        <KeyboardWithControls />

        {/* Staff Container - Keyboard input only, NO drag and drop */}
        <div
          ref={containerRef}
          className="staff-container overflow-x-auto border-2 border-gray-300 rounded-lg p-4 bg-white"
          style={{ minHeight: '200px' }}
        />

        {/* Info Panel */}
        {notes.length === 0 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 text-center font-medium">
              🎹 Use keyboard shortcuts to compose: Press 1-6 for duration, A-G for notes, S/F/N for accidentals
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffView;
