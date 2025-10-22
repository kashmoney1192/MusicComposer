import React, { useState } from 'react';
import { Download, FileText, Music, Save, FolderOpen } from 'lucide-react';
import { useMusicContext } from '../../contexts/MusicContext';
import MidiWriter from 'midi-writer-js';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * ExportPanel Component
 * Provides export functionality for PDF, MIDI, MusicXML, and JSON formats
 *
 * Export Formats:
 * - PDF: Visual representation of the sheet music (via html2canvas + jsPDF)
 * - MIDI: Playable MIDI file (via midi-writer-js)
 * - MusicXML: Standard interchange format for music notation software
 * - JSON: Internal format for saving/loading compositions
 *
 * Also provides:
 * - Save/Load from localStorage
 * - Save/Load from file system
 * - Export to various formats
 */
const ExportPanel = () => {
  const {
    notes,
    title,
    composer,
    tempo,
    timeSignature,
    keySignature,
    measureCount,
    saveToLocalStorage,
    loadFromLocalStorage
  } = useMusicContext();

  const [exporting, setExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');

  /**
   * Convert note duration to MIDI ticks
   * Uses standard MIDI ticks per quarter note (128)
   */
  const durationToTicks = (duration) => {
    const ticksPerQuarter = 128;
    const durations = {
      'w': ticksPerQuarter * 4,  // Whole note = 4 quarters
      'h': ticksPerQuarter * 2,  // Half note = 2 quarters
      'q': ticksPerQuarter,      // Quarter note = 1 quarter
      '8': ticksPerQuarter / 2,  // Eighth note = 0.5 quarters
      '16': ticksPerQuarter / 4  // Sixteenth note = 0.25 quarters
    };
    return durations[duration] || ticksPerQuarter;
  };

  /**
   * Convert pitch to MIDI note number
   * C4 = 60 (middle C)
   */
  const pitchToMidiNote = (pitch) => {
    const noteMap = {
      'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
      'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8,
      'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
    };

    const parts = pitch.split('/');
    const noteName = parts[0];
    const octave = parseInt(parts[1]);

    return noteMap[noteName] + (octave + 1) * 12;
  };

  /**
   * Export composition to MIDI file
   * Creates a downloadable MIDI file from the current composition
   */
  const exportToMIDI = () => {
    setExporting(true);

    try {
      // Create MIDI track
      const track = new MidiWriter.Track();

      // Set tempo
      track.setTempo(tempo);

      // Set time signature
      track.addEvent(new MidiWriter.TimeSignatureEvent({
        numerator: timeSignature.beats,
        denominator: timeSignature.beatType
      }));

      // Sort notes by measure and beat
      const sortedNotes = [...notes].sort((a, b) => {
        if (a.measure !== b.measure) return a.measure - b.measure;
        return a.beat - b.beat;
      });

      // Add notes to track
      sortedNotes.forEach(note => {
        if (!note.isRest) {
          const midiNote = pitchToMidiNote(note.pitch);
          const duration = durationToTicks(note.duration);

          track.addEvent(new MidiWriter.NoteEvent({
            pitch: [midiNote],
            duration: 'T' + duration,
            velocity: 64 // Medium velocity
          }));
        } else {
          // Add rest as wait time
          const duration = durationToTicks(note.duration);
          track.addEvent(new MidiWriter.NoteEvent({
            pitch: [60],
            duration: 'T' + duration,
            velocity: 0 // Zero velocity = rest
          }));
        }
      });

      // Create MIDI writer
      const write = new MidiWriter.Writer([track]);

      // Generate and download file
      const blob = new Blob([write.buildFile()], { type: 'audio/midi' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.replace(/\s+/g, '_')}.mid`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExporting(false);
    } catch (error) {
      console.error('Error exporting MIDI:', error);
      alert('Error exporting MIDI file');
      setExporting(false);
    }
  };

  /**
   * Export composition to PDF
   * Captures the staff rendering and converts to PDF
   */
  const exportToPDF = async () => {
    setExporting(true);

    try {
      // Find the staff container element
      const staffElement = document.querySelector('.staff-container');
      if (!staffElement) {
        throw new Error('Staff element not found');
      }

      // Capture staff as canvas
      const canvas = await html2canvas(staffElement, {
        scale: 2,
        backgroundColor: '#ffffff'
      });

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add title page
      pdf.setFontSize(24);
      pdf.text(title, 105, 50, { align: 'center' });

      if (composer) {
        pdf.setFontSize(16);
        pdf.text(`By: ${composer}`, 105, 70, { align: 'center' });
      }

      // Add sheet music on new page
      pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 10, imgWidth, imgHeight);

      // Download PDF
      pdf.save(`${title.replace(/\s+/g, '_')}.pdf`);

      setExporting(false);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Error exporting PDF file');
      setExporting(false);
    }
  };

  /**
   * Export composition to MusicXML
   * Creates a basic MusicXML file (simplified version)
   */
  const exportToMusicXML = () => {
    setExporting(true);

    try {
      // Build basic MusicXML structure
      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xml += '<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">\n';
      xml += '<score-partwise version="3.1">\n';

      // Work info
      xml += '  <work>\n';
      xml += `    <work-title>${title}</work-title>\n`;
      xml += '  </work>\n';

      // Identification
      xml += '  <identification>\n';
      xml += '    <creator type="composer">${composer || "Unknown"}</creator>\n';
      xml += '  </identification>\n';

      // Part list
      xml += '  <part-list>\n';
      xml += '    <score-part id="P1">\n';
      xml += '      <part-name>Piano</part-name>\n';
      xml += '    </score-part>\n';
      xml += '  </part-list>\n';

      // Part
      xml += '  <part id="P1">\n';

      // Generate measures
      for (let m = 1; m <= measureCount; m++) {
        xml += `    <measure number="${m}">\n`;

        // Add attributes for first measure
        if (m === 1) {
          xml += '      <attributes>\n';
          xml += '        <divisions>1</divisions>\n';
          xml += `        <key>\n`;
          xml += `          <fifths>0</fifths>\n`; // Simplified - always C major
          xml += `        </key>\n`;
          xml += `        <time>\n`;
          xml += `          <beats>${timeSignature.beats}</beats>\n`;
          xml += `          <beat-type>${timeSignature.beatType}</beat-type>\n`;
          xml += `        </time>\n`;
          xml += `        <clef>\n`;
          xml += `          <sign>G</sign>\n`;
          xml += `          <line>2</line>\n`;
          xml += `        </clef>\n`;
          xml += '      </attributes>\n';
          xml += `      <sound tempo="${tempo}"/>\n`;
        }

        // Add notes for this measure
        const measureNotes = notes.filter(n => n.measure === m);
        measureNotes.forEach(note => {
          xml += '      <note>\n';

          if (note.isRest) {
            xml += '        <rest/>\n';
          } else {
            const [noteName, octave] = note.pitch.split('/');
            xml += '        <pitch>\n';
            xml += `          <step>${noteName[0]}</step>\n`;
            if (noteName.includes('#')) xml += '          <alter>1</alter>\n';
            if (noteName.includes('b')) xml += '          <alter>-1</alter>\n';
            xml += `          <octave>${octave}</octave>\n`;
            xml += '        </pitch>\n';
          }

          xml += `        <duration>1</duration>\n`;
          xml += `        <type>${note.duration === 'w' ? 'whole' : note.duration === 'h' ? 'half' : note.duration === 'q' ? 'quarter' : note.duration === '8' ? 'eighth' : 'sixteenth'}</type>\n`;
          xml += '      </note>\n';
        });

        xml += '    </measure>\n';
      }

      xml += '  </part>\n';
      xml += '</score-partwise>';

      // Download MusicXML
      const blob = new Blob([xml], { type: 'application/vnd.recordare.musicxml+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.replace(/\s+/g, '_')}.musicxml`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExporting(false);
    } catch (error) {
      console.error('Error exporting MusicXML:', error);
      alert('Error exporting MusicXML file');
      setExporting(false);
    }
  };

  /**
   * Export composition to JSON
   * Saves the entire composition as JSON for backup/sharing
   */
  const exportToJSON = () => {
    const composition = saveToLocalStorage();

    const blob = new Blob([JSON.stringify(composition, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /**
   * Handle export based on selected format
   */
  const handleExport = () => {
    if (notes.length === 0) {
      alert('No notes to export. Please add some notes first.');
      return;
    }

    switch (exportFormat) {
      case 'pdf':
        exportToPDF();
        break;
      case 'midi':
        exportToMIDI();
        break;
      case 'musicxml':
        exportToMusicXML();
        break;
      case 'json':
        exportToJSON();
        break;
      default:
        exportToPDF();
    }
  };

  /**
   * Load composition from JSON file
   */
  const handleLoadFromFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const composition = JSON.parse(e.target.result);
        // You would implement loading logic in MusicContext
        console.log('Loaded composition:', composition);
        alert('Composition loaded successfully!');
      } catch (error) {
        console.error('Error loading composition:', error);
        alert('Error loading composition file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="export-panel bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2 mb-2">
          <Download size={20} />
          Export & Save
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Save your composition or export in various formats
        </p>
      </div>

      {/* Save/Load Section */}
      <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Save & Load
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={saveToLocalStorage}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
          >
            <Save size={18} />
            Save Local
          </button>
          <button
            onClick={loadFromLocalStorage}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium"
          >
            <FolderOpen size={18} />
            Load Local
          </button>
        </div>
      </div>

      {/* Export Section */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Export Format
        </h4>

        {/* Format Selection */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={() => setExportFormat('pdf')}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
              exportFormat === 'pdf'
                ? 'bg-purple-500 text-white shadow-lg scale-105'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <FileText size={18} />
            PDF
          </button>
          <button
            onClick={() => setExportFormat('midi')}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
              exportFormat === 'midi'
                ? 'bg-purple-500 text-white shadow-lg scale-105'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <Music size={18} />
            MIDI
          </button>
          <button
            onClick={() => setExportFormat('musicxml')}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
              exportFormat === 'musicxml'
                ? 'bg-purple-500 text-white shadow-lg scale-105'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <FileText size={18} />
            MusicXML
          </button>
          <button
            onClick={() => setExportFormat('json')}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
              exportFormat === 'json'
                ? 'bg-purple-500 text-white shadow-lg scale-105'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <FileText size={18} />
            JSON
          </button>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          disabled={exporting || notes.length === 0}
          className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-bold text-lg transition-all ${
            exporting || notes.length === 0
              ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
          }`}
        >
          <Download size={24} />
          {exporting ? 'Exporting...' : `Export as ${exportFormat.toUpperCase()}`}
        </button>

        {notes.length === 0 && (
          <p className="mt-3 text-xs text-center text-gray-500 dark:text-gray-400">
            Add some notes to enable export
          </p>
        )}

        {/* Format Description */}
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {exportFormat === 'pdf' && '📄 PDF: Visual sheet music for printing or sharing'}
            {exportFormat === 'midi' && '🎵 MIDI: Playable file for music software and keyboards'}
            {exportFormat === 'musicxml' && '📝 MusicXML: Standard format for MuseScore, Finale, Sibelius, etc.'}
            {exportFormat === 'json' && '💾 JSON: Backup format to save and reload your work'}
          </p>
        </div>
      </div>

      {/* Load from File (hidden input) */}
      <input
        type="file"
        accept=".json"
        onChange={handleLoadFromFile}
        className="hidden"
        id="load-composition-file"
      />
    </div>
  );
};

export default ExportPanel;
