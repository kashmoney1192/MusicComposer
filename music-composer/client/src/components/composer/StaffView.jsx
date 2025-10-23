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
  const renderSingleStaffMeasure = (context, measureNum, x, y, baseWidth) => {
    // Get notes for this measure to calculate dynamic width
    const measureNotes = notes.filter(note => note.measure === measureNum);

    // Calculate dynamic width based on note count
    // Add ~8px per note to keep eighth notes tightly spaced
    const dynamicWidth = baseWidth + (Math.max(0, measureNotes.length - 4) * 8);

    const stave = new Stave(x, y, dynamicWidth);

    // Add clef to first measure
    if (measureNum === 1) {
      stave.addClef(clef);
      stave.addTimeSignature(`${timeSignature.beats}/${timeSignature.beatType}`);
      if (keySignature !== 'C') {
        stave.addKeySignature(keySignature);
      }
    }

    stave.setContext(context).draw();

    // Add measure number above staff for every measure
    const textX = x + dynamicWidth / 2;
    const textY = y - 25; // Position above the staff to avoid overlap
    context.save();
    context.setFont('Arial', 9, 'bold');
    context.setFillStyle('#999999');
    context.fillText(`${measureNum}`, textX, textY);
    context.restore();

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

      // Format first
      const formatWidth = measureNum === 1 ? dynamicWidth - 80 : dynamicWidth - 20;
      const formatter = new Formatter();
      formatter.joinVoices([voice]);
      formatter.format([voice], formatWidth);

      // Create and draw beams for eighth and smaller notes
      // Collect all groups of consecutive beamable notes and beam them together
      const beams = [];
      let currentBeamGroup = [];

      vexflowNotes.forEach((note) => {
        const isBeamable = note.duration === '8' || note.duration === '16' || note.duration === '32';

        if (isBeamable) {
          currentBeamGroup.push(note);
        } else {
          // Non-beamable note breaks the beam group
          // Create a beam for this group (even if only 1 note - it will get a flag)
          if (currentBeamGroup.length >= 1) {
            if (currentBeamGroup.length === 1) {
              // Single note - just give it a flag, don't beam
              // VexFlow will handle this automatically
            } else {
              // Multiple notes - beam them together
              beams.push(new Beam(currentBeamGroup));
            }
          }
          currentBeamGroup = [];
        }
      });

      // Handle last group
      if (currentBeamGroup.length >= 1) {
        if (currentBeamGroup.length === 1) {
          // Single note - will get a flag automatically
        } else {
          // Multiple notes - beam them together
          beams.push(new Beam(currentBeamGroup));
        }
      }

      // Draw beams - they will automatically draw stems and connecting lines
      beams.forEach(beam => {
        beam.setContext(context).draw();
      });

      // Draw the voice (notes) - this draws note heads, flags (for non-beamed notes), and accidentals
      voice.draw(context, stave);
    }

    return stave;
  };

  /**
   * Render a dual-staff measure (grand staff with treble and bass)
   */
  const renderDualStaffMeasure = (context, measureNum, x, y, baseWidth) => {
    // Get notes for both staves to calculate dynamic width
    const trebleNotes = notes.filter(n => n.measure === measureNum && n.staff === 'treble');
    const bassNotes = notes.filter(n => n.measure === measureNum && n.staff === 'bass');
    const totalNotes = trebleNotes.length + bassNotes.length;

    // Calculate dynamic width based on total note count
    // Add ~8px per note to keep eighth notes tightly spaced
    const dynamicWidth = baseWidth + (Math.max(0, totalNotes - 4) * 8);

    // Create treble staff
    const trebleStave = new Stave(x, y, dynamicWidth);
    trebleStave.addClef('treble');

    if (measureNum === 1) {
      trebleStave.addTimeSignature(`${timeSignature.beats}/${timeSignature.beatType}`);
      if (keySignature !== 'C') {
        trebleStave.addKeySignature(keySignature);
      }
    }

    trebleStave.setContext(context).draw();

    // Add measure number above treble staff
    const textX = x + dynamicWidth / 2;
    const textY = y - 25; // Position above the staff to avoid overlap
    context.save();
    context.setFont('Arial', 9, 'bold');
    context.setFillStyle('#999999');
    context.fillText(`${measureNum}`, textX, textY);
    context.restore();

    // Create bass staff
    const bassStave = new Stave(x, y + 120, dynamicWidth);
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

      // Format first
      const trebleFormatWidth = measureNum === 1 ? dynamicWidth - 80 : dynamicWidth - 20;
      new Formatter().joinVoices([voice]).format([voice], trebleFormatWidth);

      // Create and draw beams for eighth and smaller notes
      const beams = [];
      let currentBeamGroup = [];

      vexflowNotes.forEach((vexflowNote) => {
        const isBeamable = vexflowNote.duration === '8' || vexflowNote.duration === '16' || vexflowNote.duration === '32';

        if (isBeamable) {
          currentBeamGroup.push(vexflowNote);
        } else {
          if (currentBeamGroup.length > 1) {
            beams.push(new Beam(currentBeamGroup));
          }
          currentBeamGroup = [];
        }
      });

      if (currentBeamGroup.length > 1) {
        beams.push(new Beam(currentBeamGroup));
      }

      // Draw beams with proper context
      beams.forEach(beam => {
        beam.setContext(context).draw();
      });

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

      // Format first
      const bassFormatWidth = measureNum === 1 ? dynamicWidth - 80 : dynamicWidth - 20;
      new Formatter().joinVoices([voice]).format([voice], bassFormatWidth);

      // Create and draw beams for eighth and smaller notes
      const beams = [];
      let currentBeamGroup = [];

      vexflowNotes.forEach((vexflowNote) => {
        const isBeamable = vexflowNote.duration === '8' || vexflowNote.duration === '16' || vexflowNote.duration === '32';

        if (isBeamable) {
          currentBeamGroup.push(vexflowNote);
        } else {
          if (currentBeamGroup.length > 1) {
            beams.push(new Beam(currentBeamGroup));
          }
          currentBeamGroup = [];
        }
      });

      if (currentBeamGroup.length > 1) {
        beams.push(new Beam(currentBeamGroup));
      }

      // Draw beams with proper context
      beams.forEach(beam => {
        beam.setContext(context).draw();
      });

      voice.draw(context, bassStave);
    }

    return { trebleStave, bassStave };
  };

  /**
   * Calculate the dynamic width for a specific measure
   */
  const getMeasureWidth = (measureNum) => {
    const baseWidth = Math.floor(staffWidth / getMeasuresPerSystem()) - 20;

    if (dualStaffMode) {
      const trebleNotes = notes.filter(n => n.measure === measureNum && n.staff === 'treble');
      const bassNotes = notes.filter(n => n.measure === measureNum && n.staff === 'bass');
      const totalNotes = trebleNotes.length + bassNotes.length;
      // Use less width per note to keep eighth notes tighter (8px instead of 15px)
      return baseWidth + (Math.max(0, totalNotes - 4) * 8);
    } else {
      const measureNotes = notes.filter(note => note.measure === measureNum);
      // Use less width per note to keep eighth notes tighter (8px instead of 15px)
      return baseWidth + (Math.max(0, measureNotes.length - 4) * 8);
    }
  };

  /**
   * Main rendering function
   * Handles multi-system layout with automatic line wrapping
   */
  useEffect(() => {
    if (!containerRef.current || staffWidth === 0) return;

    // Clear previous rendering
    containerRef.current.innerHTML = '';

    const baseWidth = 120; // Base width for each measure
    const spacing = 20; // Space between measures
    const padding = 10; // Left/right padding
    const availableWidth = staffWidth - (padding * 2);
    const systemHeight = dualStaffMode ? 300 : 180; // Increased for measure numbers

    // Calculate how many measures fit per line
    const getMeasuresPerLine = () => {
      let count = 0;
      let currentX = padding;

      for (let m = 1; m <= measureCount; m++) {
        const measureWidth = getMeasureWidth(m);
        if (currentX + measureWidth + spacing > availableWidth && count > 0) {
          break;
        }
        currentX += measureWidth + spacing;
        count++;
      }
      return Math.max(1, count); // At least 1 measure per line
    };

    // First pass: figure out which measures go on which line
    const lines = [];
    let currentLine = [];
    let currentLineWidth = padding;

    for (let m = 1; m <= measureCount; m++) {
      const measureWidth = getMeasureWidth(m);
      const neededWidth = measureWidth + spacing;

      // Check if measure fits on current line
      if (currentLineWidth + neededWidth <= availableWidth) {
        currentLine.push(m);
        currentLineWidth += neededWidth;
      } else {
        // Start new line if current line has measures
        if (currentLine.length > 0) {
          lines.push(currentLine);
          currentLine = [m];
          currentLineWidth = padding + measureWidth + spacing;
        } else {
          // Force measure on this line if it's the only one
          currentLine.push(m);
          currentLineWidth += neededWidth;
        }
      }
    }

    // Add last line
    if (currentLine.length > 0) {
      lines.push(currentLine);
    }

    const totalHeight = lines.length * systemHeight + 40;

    // Create renderer
    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
    renderer.resize(staffWidth, totalHeight);
    const context = renderer.getContext();

    // Render each line of measures
    lines.forEach((line, lineIndex) => {
      let currentX = padding;
      const y = lineIndex * systemHeight + 40;

      line.forEach((m) => {
        const measureWidth = getMeasureWidth(m);

        if (dualStaffMode) {
          renderDualStaffMeasure(context, m, currentX, y, measureWidth);
        } else {
          renderSingleStaffMeasure(context, m, currentX, y, measureWidth);
        }

        currentX += measureWidth + spacing;
      });
    });

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
