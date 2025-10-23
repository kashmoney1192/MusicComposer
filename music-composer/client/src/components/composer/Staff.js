import React, { useEffect, useRef, useState } from 'react';
import { Renderer, Stave, StaveNote, Voice, Formatter, Accidental } from 'vexflow';
import { useMusicContext } from '../../contexts/MusicContext';

/**
 * Staff Component - Renders musical notation using VexFlow
 * Displays the staff lines, clef, time signature, and notes
 * Supports click-to-place for note placement
 */
const Staff = ({ measureNumber, width = 400, onNoteClick }) => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  const {
    notes,
    timeSignature,
    keySignature,
    clef,
    getNotesForMeasure,
    getSortedNotesForMeasure,
    selectedNoteId,
    addNote,
    selectedPaletteNote,
    canAddNoteToMeasure
  } = useMusicContext();

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous rendering
    containerRef.current.innerHTML = '';

    try {
      // Create VexFlow renderer
      const renderer = new Renderer(
        containerRef.current,
        Renderer.Backends.SVG
      );
      rendererRef.current = renderer;

      // Configure renderer size
      renderer.resize(width, 200);
      const context = renderer.getContext();
      context.setFont('Arial', 10);

      // Create staff
      const stave = new Stave(10, 40, width - 20);

      // Add clef, time signature for first measure
      if (measureNumber === 1) {
        stave.addClef(clef);
        stave.addTimeSignature(`${timeSignature.beats}/${timeSignature.beatType}`);

        // Add key signature if not C major
        if (keySignature !== 'C' && keySignature !== 'Am') {
          stave.addKeySignature(keySignature);
        }
      }

      // Draw the staff
      stave.setContext(context).draw();

      // Get notes for this measure, sorted by beat position
      const measureNotes = getSortedNotesForMeasure(measureNumber);
      console.log(`Measure ${measureNumber} has ${measureNotes.length} notes:`, measureNotes);

      if (measureNotes.length > 0) {
        // Convert our note data to VexFlow StaveNote format
        const vexflowNotes = measureNotes.map(note => {
          const keys = note.isRest ? [`b/${note.pitch.split('/')[1] || 4}`] : [note.pitch.toLowerCase()];

          console.log('Creating VexFlow note:', {
            keys,
            duration: note.duration + (note.isRest ? 'r' : ''),
            clef,
            isRest: note.isRest
          });

          const staveNote = new StaveNote({
            keys: keys,
            duration: note.duration + (note.isRest ? 'r' : ''),
            clef: clef
          });

          // Add accidentals
          if (note.accidental && !note.isRest) {
            staveNote.addModifier(new Accidental(note.accidental), 0);
          }

          // Highlight selected note
          if (note.id === selectedNoteId) {
            staveNote.setStyle({ fillStyle: '#3b82f6', strokeStyle: '#3b82f6' });
          }

          // Store note ID for click handling
          staveNote.attrs = { ...staveNote.attrs, noteId: note.id };

          return staveNote;
        });

        // Create voice and add notes (don't require strict timing)
        const voice = new Voice({
          num_beats: timeSignature.beats,
          beat_value: timeSignature.beatType
        });
        voice.setStrict(false); // Allow incomplete measures
        voice.addTickables(vexflowNotes);

        // Format and draw
        new Formatter()
          .joinVoices([voice])
          .format([voice], width - 50);

        voice.draw(context, stave);
      }

    } catch (error) {
      console.error('Error rendering staff:', error);
    }

    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [
    measureNumber,
    notes,
    timeSignature,
    keySignature,
    clef,
    width,
    getNotesForMeasure,
    selectedNoteId
  ]);

  /**
   * Handle click on staff - place selected palette note with beat validation
   */
  const handleStaffClick = (event) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Staff position calculation
    // Staff lines are at approximately y: 40-140
    const staffTop = 40;
    const staffBottom = 140;
    const staffHeight = staffBottom - staffTop;
    const lineSpacing = staffHeight / 8; // 5 lines create 4 spaces, plus ledger lines

    // Calculate which line/space was clicked
    const relativeY = y - staffTop;
    const position = Math.round(relativeY / (lineSpacing / 2));

    // Map position to pitch (for treble clef)
    const treblePitches = [
      'F/5', 'E/5', 'D/5', 'C/5', 'B/4', 'A/4', 'G/4', 'F/4', 'E/4', 'D/4', 'C/4'
    ];
    const bassPitches = [
      'A/3', 'G/3', 'F/3', 'E/3', 'D/3', 'C/3', 'B/2', 'A/2', 'G/2', 'F/2', 'E/2'
    ];

    const pitches = clef === 'treble' ? treblePitches : bassPitches;
    const pitchIndex = Math.max(0, Math.min(position, pitches.length - 1));
    const pitch = pitches[pitchIndex];

    // Calculate approximate beat position within measure
    const relativeX = x - 10;
    const measureWidth = width - 20;
    const beat = Math.floor((relativeX / measureWidth) * timeSignature.beats);

    // Check if click is on the staff
    if (y >= staffTop - 20 && y <= staffBottom + 20) {
      // Use selected palette note if available, otherwise use default quarter note
      const noteToPlace = selectedPaletteNote || {
        duration: 'q',
        isRest: false,
        label: 'Quarter Note'
      };

      // Validate that note fits in the measure
      const validation = canAddNoteToMeasure(measureNumber, noteToPlace.duration);

      if (!validation.canAdd) {
        console.warn(validation.message);
        // Show visual feedback - flash the staff red
        containerRef.current.style.backgroundColor = '#fee2e2';
        setTimeout(() => {
          if (containerRef.current) {
            containerRef.current.style.backgroundColor = '';
          }
        }, 500);
        return; // Don't add the note
      }

      console.log('Placing note:', {
        pitch,
        duration: noteToPlace.duration,
        measure: measureNumber,
        beat: Math.max(0, beat),
        position,
        isRest: noteToPlace.isRest || false,
        validation: validation.message
      });

      const noteId = addNote({
        pitch: pitch,
        duration: noteToPlace.duration,
        measure: measureNumber,
        beat: Math.max(0, beat),
        position: position,
        isRest: noteToPlace.isRest || false,
        accidental: null
      });

      console.log('Note added with ID:', noteId);

      // Don't call onNoteClick since we're already adding the note here
      // This prevents duplicate note addition
    }
  };

  return (
    <div
      ref={containerRef}
      className={`staff-container cursor-crosshair rounded transition-all ${
        selectedPaletteNote
          ? 'bg-blue-50 border-4 border-blue-400 border-dashed shadow-lg'
          : isHovering
          ? 'bg-gray-50 border-2 border-gray-300 border-dashed'
          : 'border-2 border-transparent'
      }`}
      onClick={handleStaffClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{ width: `${width}px`, minHeight: '200px' }}
    />
  );
};

export default Staff;
