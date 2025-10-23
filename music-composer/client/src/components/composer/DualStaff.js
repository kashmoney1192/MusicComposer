import React, { useEffect, useRef, useCallback } from 'react';
import { Renderer, Stave, StaveNote, Voice, Formatter, StaveConnector, Accidental } from 'vexflow';
import { useMusicContext } from '../../contexts/MusicContext';

/**
 * DualStaff Component - Renders both treble and bass clef staves together (piano/grand staff)
 * Used for compositions that need both right hand (treble) and left hand (bass)
 */
const DualStaff = ({ measureNumber, width, onNoteClick }) => {
  const { notes, timeSignature, keySignature, selectedNoteId, currentStaff, getSortedNotesForMeasure } = useMusicContext();
  const containerRef = useRef(null);

  /**
   * Calculate vertical position from mouse Y coordinate
   */
  const calculatePosition = (y, staffType, staffTop) => {
    const lineHeight = 10; // Approximate height between staff lines
    const relativeY = y - staffTop;
    const position = Math.round(relativeY / (lineHeight / 2));
    return position;
  };

  /**
   * Calculate pitch from vertical position
   */
  const calculatePitchFromPosition = (position, staffType) => {
    // Treble clef staff lines (from bottom to top): E4, G4, B4, D5, F5
    // Spaces: F4, A4, C5, E5
    const treblePitches = ['E/5', 'D/5', 'C/5', 'B/4', 'A/4', 'G/4', 'F/4', 'E/4', 'D/4', 'C/4', 'B/3', 'A/3'];

    // Bass clef staff lines (from bottom to top): G2, B2, D3, F3, A3
    // Spaces: A2, C3, E3, G3
    const bassPitches = ['A/3', 'G/3', 'F/3', 'E/3', 'D/3', 'C/3', 'B/2', 'A/2', 'G/2', 'F/2', 'E/2', 'D/2'];

    const pitches = staffType === 'treble' ? treblePitches : bassPitches;
    const index = Math.max(0, Math.min(position, pitches.length - 1));
    return pitches[index];
  };

  /**
   * Handle click on staff to add a note
   */
  const handleStaffClick = useCallback((e, staffType) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Determine which staff was clicked
    const trebleStaffTop = 40;
    const bassStaffTop = 180;
    const staffHeight = 80;

    let clickedStaff = staffType;
    let staffTop = staffType === 'treble' ? trebleStaffTop : bassStaffTop;

    // Calculate position and pitch
    const position = calculatePosition(y, clickedStaff, staffTop);
    const pitch = calculatePitchFromPosition(position, clickedStaff);

    // Calculate beat position (rough estimation)
    const measureWidth = width - 100;
    const beatWidth = measureWidth / timeSignature.beats;
    const beat = Math.floor((x - 50) / beatWidth);

    if (onNoteClick && beat >= 0 && beat < timeSignature.beats) {
      onNoteClick({
        pitch,
        measure: measureNumber,
        beat,
        position,
        staff: clickedStaff
      });
    }
  }, [measureNumber, timeSignature, width, onNoteClick]);

  /**
   * Render the dual staff using VexFlow
   */
  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous rendering
    containerRef.current.innerHTML = '';

    try {
      // Create renderer
      const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
      renderer.resize(width, 300);
      const context = renderer.getContext();

      // Get notes for this measure, sorted by beat position
      const allNotesInMeasure = getSortedNotesForMeasure(measureNumber);
      const trebleNotes = allNotesInMeasure.filter(n => n.staff === 'treble');
      const bassNotes = allNotesInMeasure.filter(n => n.staff === 'bass');

      // Create treble staff
      const trebleStave = new Stave(10, 40, width - 20);
      trebleStave.addClef('treble');
      if (measureNumber === 1) {
        trebleStave.addTimeSignature(`${timeSignature.beats}/${timeSignature.beatType}`);
        if (keySignature !== 'C') {
          trebleStave.addKeySignature(keySignature);
        }
      }
      trebleStave.setContext(context).draw();

      // Create bass staff
      const bassStave = new Stave(10, 180, width - 20);
      bassStave.addClef('bass');
      if (measureNumber === 1) {
        bassStave.addTimeSignature(`${timeSignature.beats}/${timeSignature.beatType}`);
        if (keySignature !== 'C') {
          bassStave.addKeySignature(keySignature);
        }
      }
      bassStave.setContext(context).draw();

      // Draw brace connecting the staves
      const connector = new StaveConnector(trebleStave, bassStave);
      connector.setType(StaveConnector.type.BRACE);
      connector.setContext(context).draw();

      // Draw bar line connecting the staves
      const barline = new StaveConnector(trebleStave, bassStave);
      barline.setType(StaveConnector.type.SINGLE_LEFT);
      barline.setContext(context).draw();

      // Render treble notes
      if (trebleNotes.length > 0) {
        const vexflowTrebleNotes = trebleNotes.map(note => {
          const keys = note.isRest ? ['b/4'] : [note.pitch.toLowerCase()];
          const staveNote = new StaveNote({
            keys,
            duration: note.duration + (note.isRest ? 'r' : ''),
            clef: 'treble'
          });

          if (!note.isRest && (note.pitch.includes('#') || note.pitch.includes('b'))) {
            const accidentalType = note.pitch.includes('#') ? '#' : 'b';
            staveNote.addModifier(new Accidental(accidentalType), 0);
          }

          // Highlight selected note
          if (note.id === selectedNoteId) {
            staveNote.setStyle({ fillStyle: 'blue', strokeStyle: 'blue' });
          }

          return staveNote;
        });

        const trebleVoice = new Voice({
          num_beats: timeSignature.beats,
          beat_value: timeSignature.beatType
        });
        trebleVoice.setStrict(false);
        trebleVoice.addTickables(vexflowTrebleNotes);

        new Formatter().joinVoices([trebleVoice]).format([trebleVoice], width - 100);
        trebleVoice.draw(context, trebleStave);
      }

      // Render bass notes
      if (bassNotes.length > 0) {
        const vexflowBassNotes = bassNotes.map(note => {
          const keys = note.isRest ? ['d/3'] : [note.pitch.toLowerCase()];
          const staveNote = new StaveNote({
            keys,
            duration: note.duration + (note.isRest ? 'r' : ''),
            clef: 'bass'
          });

          if (!note.isRest && (note.pitch.includes('#') || note.pitch.includes('b'))) {
            const accidentalType = note.pitch.includes('#') ? '#' : 'b';
            staveNote.addModifier(new Accidental(accidentalType), 0);
          }

          // Highlight selected note
          if (note.id === selectedNoteId) {
            staveNote.setStyle({ fillStyle: 'blue', strokeStyle: 'blue' });
          }

          return staveNote;
        });

        const bassVoice = new Voice({
          num_beats: timeSignature.beats,
          beat_value: timeSignature.beatType
        });
        bassVoice.setStrict(false);
        bassVoice.addTickables(vexflowBassNotes);

        new Formatter().joinVoices([bassVoice]).format([bassVoice], width - 100);
        bassVoice.draw(context, bassStave);
      }

    } catch (error) {
      console.error('Error rendering dual staff:', error);
    }
  }, [notes, measureNumber, timeSignature, keySignature, selectedNoteId, width]);

  return (
    <div className="dual-staff-container relative">
      {/* Clickable overlays for each staff */}
      <div
        className="absolute top-[40px] left-0 right-0 h-[100px] cursor-crosshair"
        onClick={(e) => handleStaffClick(e, 'treble')}
        style={{ zIndex: currentStaff === 'treble' ? 10 : 5, opacity: currentStaff === 'treble' ? 1 : 0.5 }}
        title="Click to add notes to treble clef (right hand)"
      />
      <div
        className="absolute top-[180px] left-0 right-0 h-[100px] cursor-crosshair"
        onClick={(e) => handleStaffClick(e, 'bass')}
        style={{ zIndex: currentStaff === 'bass' ? 10 : 5, opacity: currentStaff === 'bass' ? 1 : 0.5 }}
        title="Click to add notes to bass clef (left hand)"
      />

      {/* VexFlow rendering container */}
      <div ref={containerRef} />

      {/* Staff indicator */}
      <div className="mt-2 text-center text-sm">
        <span className={`px-3 py-1 rounded-lg font-semibold ${currentStaff === 'treble' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
          Treble (Right Hand)
        </span>
        <span className="mx-2">•</span>
        <span className={`px-3 py-1 rounded-lg font-semibold ${currentStaff === 'bass' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
          Bass (Left Hand)
        </span>
      </div>
    </div>
  );
};

export default DualStaff;
