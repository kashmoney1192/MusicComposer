import React, { useEffect, useRef } from 'react';
import { Renderer, Stave, StaveNote, Voice, Formatter, Accidental, StaveConnector } from 'vexflow';
import { getKeySignatureNotation } from '../../utils/musicGenerator';

/**
 * MusicDisplay Component
 * Renders generated music using VexFlow
 *
 * @param {Array} notes - Array of note objects to display
 * @param {Object} settings - Music settings (key signature, time signature, etc.)
 */
const MusicDisplay = ({ notes, settings }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !notes || notes.length === 0) return;

    // Clear previous rendering
    containerRef.current.innerHTML = '';

    try {
      renderMusic();
    } catch (error) {
      console.error('Error rendering music:', error);
    }

    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [notes, settings]);

  /**
   * Render the music notation using VexFlow
   */
  const renderMusic = () => {
    const { keySignature, timeSignature, clef = 'treble' } = settings;
    const [beatsPerMeasure, beatValue] = timeSignature.split('/').map(Number);

    // Get unique measures from notes
    const measures = [...new Set(notes.map(note => note.measure))].sort((a, b) => a - b);

    // Calculate dimensions based on whether we're rendering dual staff or single staff
    const isDualStaff = clef === 'both';
    const measuresPerRow = window.innerWidth > 1024 ? (isDualStaff ? 2 : 4) : window.innerWidth > 768 ? (isDualStaff ? 2 : 3) : (isDualStaff ? 1 : 2);
    const measureWidth = isDualStaff ? 350 : 250;
    const measureHeight = isDualStaff ? 350 : 200;
    const rows = Math.ceil(measures.length / measuresPerRow);

    // Create VexFlow renderer
    const renderer = new Renderer(
      containerRef.current,
      Renderer.Backends.SVG
    );

    // Calculate total dimensions
    const totalWidth = measureWidth * Math.min(measuresPerRow, measures.length) + 50;
    const totalHeight = measureHeight * rows + 50;

    renderer.resize(totalWidth, totalHeight);
    const context = renderer.getContext();
    context.setFont('Arial', 10);

    // Render each measure
    measures.forEach((measureNum, index) => {
      const row = Math.floor(index / measuresPerRow);
      const col = index % measuresPerRow;

      const x = col * measureWidth + 10;
      const y = row * measureHeight + 40;

      if (isDualStaff) {
        renderDualStaffMeasure(context, measureNum, x, y, measureWidth - 20, keySignature, timeSignature, beatsPerMeasure, beatValue);
      } else {
        renderMeasure(context, measureNum, x, y, measureWidth - 20, keySignature, timeSignature, beatsPerMeasure, beatValue, clef);
      }
    });
  };

  /**
   * Render a single measure
   */
  const renderMeasure = (context, measureNum, x, y, width, keySignature, timeSignature, beatsPerMeasure, beatValue, clef = 'treble') => {
    // Create staff
    const stave = new Stave(x, y, width);

    // Add clef, time signature, and key signature to first measure
    if (measureNum === 1) {
      stave.addClef(clef);
      stave.addTimeSignature(timeSignature);

      // Add key signature
      const keyNotation = getKeySignatureNotation(keySignature);
      if (keyNotation !== 'C') {
        stave.addKeySignature(keyNotation);
      }
    }

    // Draw the staff
    stave.setContext(context).draw();

    // Get notes for this measure
    const measureNotes = notes.filter(note => note.measure === measureNum);

    if (measureNotes.length > 0) {
      // Convert notes to VexFlow format
      const vexflowNotes = measureNotes.map(note => {
        // For rests, use 'b' as the default pitch
        const keys = note.isRest ? [`b/4`] : [note.pitch.toLowerCase()];

        const staveNote = new StaveNote({
          keys: keys,
          duration: note.duration + (note.isRest ? 'r' : ''),
          clef: clef
        });

        // Add accidentals if present in the pitch (e.g., C#, Bb)
        if (!note.isRest && (note.pitch.includes('#') || note.pitch.includes('b'))) {
          const accidentalType = note.pitch.includes('#') ? '#' : 'b';
          staveNote.addModifier(new Accidental(accidentalType), 0);
        }

        return staveNote;
      });

      // Create voice
      const voice = new Voice({
        num_beats: beatsPerMeasure,
        beat_value: beatValue
      });

      // Allow incomplete measures
      voice.setStrict(false);
      voice.addTickables(vexflowNotes);

      // Format and draw
      new Formatter()
        .joinVoices([voice])
        .format([voice], width - 20);

      voice.draw(context, stave);
    }
  };

  /**
   * Render a dual staff measure (grand staff with both treble and bass)
   */
  const renderDualStaffMeasure = (context, measureNum, x, y, width, keySignature, timeSignature, beatsPerMeasure, beatValue) => {
    // Create treble staff
    const trebleStave = new Stave(x, y, width);
    trebleStave.addClef('treble');

    // Add time signature and key signature to first measure
    if (measureNum === 1) {
      trebleStave.addTimeSignature(timeSignature);
      const keyNotation = getKeySignatureNotation(keySignature);
      if (keyNotation !== 'C') {
        trebleStave.addKeySignature(keyNotation);
      }
    }

    trebleStave.setContext(context).draw();

    // Create bass staff (positioned below treble)
    const bassStave = new Stave(x, y + 120, width);
    bassStave.addClef('bass');

    if (measureNum === 1) {
      bassStave.addTimeSignature(timeSignature);
      const keyNotation = getKeySignatureNotation(keySignature);
      if (keyNotation !== 'C') {
        bassStave.addKeySignature(keyNotation);
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

    // Get notes for this measure separated by staff
    const trebleNotes = notes.filter(note => note.measure === measureNum && note.staff === 'treble');
    const bassNotes = notes.filter(note => note.measure === measureNum && note.staff === 'bass');

    // Render treble staff notes
    if (trebleNotes.length > 0) {
      const vexflowTrebleNotes = trebleNotes.map(note => {
        const keys = note.isRest ? [`b/4`] : [note.pitch.toLowerCase()];

        const staveNote = new StaveNote({
          keys: keys,
          duration: note.duration + (note.isRest ? 'r' : ''),
          clef: 'treble'
        });

        if (!note.isRest && (note.pitch.includes('#') || note.pitch.includes('b'))) {
          const accidentalType = note.pitch.includes('#') ? '#' : 'b';
          staveNote.addModifier(new Accidental(accidentalType), 0);
        }

        return staveNote;
      });

      const trebleVoice = new Voice({
        num_beats: beatsPerMeasure,
        beat_value: beatValue
      });

      trebleVoice.setStrict(false);
      trebleVoice.addTickables(vexflowTrebleNotes);

      new Formatter().joinVoices([trebleVoice]).format([trebleVoice], width - 20);
      trebleVoice.draw(context, trebleStave);
    }

    // Render bass staff notes
    if (bassNotes.length > 0) {
      const vexflowBassNotes = bassNotes.map(note => {
        const keys = note.isRest ? [`d/3`] : [note.pitch.toLowerCase()];

        const staveNote = new StaveNote({
          keys: keys,
          duration: note.duration + (note.isRest ? 'r' : ''),
          clef: 'bass'
        });

        if (!note.isRest && (note.pitch.includes('#') || note.pitch.includes('b'))) {
          const accidentalType = note.pitch.includes('#') ? '#' : 'b';
          staveNote.addModifier(new Accidental(accidentalType), 0);
        }

        return staveNote;
      });

      const bassVoice = new Voice({
        num_beats: beatsPerMeasure,
        beat_value: beatValue
      });

      bassVoice.setStrict(false);
      bassVoice.addTickables(vexflowBassNotes);

      new Formatter().joinVoices([bassVoice]).format([bassVoice], width - 20);
      bassVoice.draw(context, bassStave);
    }
  };

  return (
    <div className="music-display bg-white rounded-xl shadow-lg p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Generated Sheet Music</h2>
        <p className="text-sm text-gray-600">
          Practice sight-reading this piece at your own pace
        </p>
      </div>

      {/* Music Notation Container */}
      <div className="notation-container bg-gray-50 rounded-lg p-6 border-2 border-gray-200 overflow-x-auto">
        {notes && notes.length > 0 ? (
          <div ref={containerRef} className="vexflow-container" />
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <svg
              className="w-24 h-24 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
            <p className="text-lg font-semibold">No music generated yet</p>
            <p className="text-sm">Click "Generate" to create a new sight-reading piece</p>
          </div>
        )}
      </div>

      {/* Music Info */}
      {notes && notes.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-600">{[...new Set(notes.map(n => n.measure))].length}</div>
            <div className="text-xs text-gray-600">Measures</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-600">{notes.filter(n => !n.isRest).length}</div>
            <div className="text-xs text-gray-600">Notes</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-purple-600">{notes.filter(n => n.isRest).length}</div>
            <div className="text-xs text-gray-600">Rests</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-orange-600">{settings.keySignature}</div>
            <div className="text-xs text-gray-600">Key</div>
          </div>
        </div>
      )}

      <style jsx>{`
        .vexflow-container {
          min-height: 200px;
        }

        .notation-container {
          overflow-x: auto;
          overflow-y: hidden;
        }

        /* Scrollbar styling */
        .notation-container::-webkit-scrollbar {
          height: 8px;
        }

        .notation-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        .notation-container::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }

        .notation-container::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default MusicDisplay;
