import React, { useState } from 'react';
import { Download, FileText, Music2, Save, Upload } from 'lucide-react';
import { jsPDF } from 'jspdf';
import MidiWriter from 'midi-writer-js';
import html2canvas from 'html2canvas';
import { useMusicContext } from '../../contexts/MusicContext';

/**
 * ExportButtons Component - Export composition to PDF, MIDI, or save to localStorage
 * Provides user-friendly export options with visual feedback
 */
const ExportButtons = ({ onClose }) => {
  const {
    title,
    composer,
    tempo,
    notes,
    getSortedNotes,
    saveToLocalStorage,
    loadFromLocalStorage
  } = useMusicContext();

  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState('');

  /**
   * Show temporary message
   */
  const showMessage = (message, duration = 3000) => {
    setExportMessage(message);
    setTimeout(() => setExportMessage(''), duration);
  };

  /**
   * Convert duration to MIDI ticks (128 = quarter note)
   */
  const durationToTicks = (duration) => {
    const tickMap = {
      'w': 512,  // whole note
      'h': 256,  // half note
      'q': 128,  // quarter note
      '8': 64,   // eighth note
      '16': 32   // sixteenth note
    };
    return tickMap[duration] || 128;
  };

  /**
   * Convert pitch from VexFlow format (C/4) to MIDI note name (C4)
   */
  const convertPitchToMidi = (pitch, accidental) => {
    if (!pitch) return 'C4';

    const [note, octave] = pitch.split('/');
    let noteName = note.toUpperCase();

    // Apply accidental
    if (accidental === '#') {
      noteName += '#';
    } else if (accidental === 'b') {
      noteName += 'b';
    }

    return `${noteName}${octave}`;
  };

  /**
   * Export composition as MIDI file
   */
  const handleExportMIDI = () => {
    if (notes.length === 0) {
      alert('Add some notes to your composition first!');
      return;
    }

    try {
      setIsExporting(true);

      // Create a new MIDI track
      const track = new MidiWriter.Track();

      // Set tempo
      track.setTempo(tempo);

      // Get sorted notes
      const sortedNotes = getSortedNotes();

      // Add notes to track
      sortedNotes.forEach(note => {
        if (note.isRest) {
          // Add rest
          track.addEvent(
            new MidiWriter.NoteEvent({
              pitch: ['C4'], // Dummy pitch for rest
              duration: `T${durationToTicks(note.duration)}`,
              wait: `T${durationToTicks(note.duration)}`,
              velocity: 0 // Velocity 0 = rest
            })
          );
        } else {
          // Add note
          const midiPitch = convertPitchToMidi(note.pitch, note.accidental);
          track.addEvent(
            new MidiWriter.NoteEvent({
              pitch: [midiPitch],
              duration: `T${durationToTicks(note.duration)}`,
              velocity: 100
            })
          );
        }
      });

      // Create MIDI file
      const write = new MidiWriter.Writer(track);
      const midiData = write.buildFile();

      // Convert to blob and download
      const blob = new Blob([midiData], { type: 'audio/midi' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mid`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showMessage('MIDI file exported successfully!');
      setIsExporting(false);

    } catch (error) {
      console.error('Error exporting MIDI:', error);
      alert('Error exporting MIDI file. Please try again.');
      setIsExporting(false);
    }
  };

  /**
   * Export composition as PDF
   */
  const handleExportPDF = async () => {
    if (notes.length === 0) {
      alert('Add some notes to your composition first!');
      return;
    }

    try {
      setIsExporting(true);
      showMessage('Generating PDF... This may take a moment.');

      // Find all staff containers
      const staffContainers = document.querySelectorAll('.staff-container');

      if (staffContainers.length === 0) {
        throw new Error('No staff elements found');
      }

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;

      // Add title
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text(title, pageWidth / 2, margin, { align: 'center' });

      // Add composer if present
      if (composer) {
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Composer: ${composer}`, pageWidth / 2, margin + 8, { align: 'center' });
      }

      // Add tempo
      pdf.setFontSize(10);
      pdf.text(`Tempo: ${tempo} BPM`, margin, margin + 15);

      let yPosition = margin + 25;

      // Capture and add each staff
      for (let i = 0; i < staffContainers.length; i++) {
        const canvas = await html2canvas(staffContainers[i], {
          backgroundColor: '#ffffff',
          scale: 2
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth - (2 * margin);
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Check if we need a new page
        if (yPosition + imgHeight > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }

        // Add measure number
        pdf.setFontSize(8);
        pdf.setTextColor(100);
        pdf.text(`Measure ${i + 1}`, margin, yPosition);
        yPosition += 5;

        // Add staff image
        pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + 10;
      }

      // Save PDF
      pdf.save(`${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);

      showMessage('PDF exported successfully!');
      setIsExporting(false);

      // Close modal after successful export
      if (onClose) {
        setTimeout(() => onClose(), 1500);
      }

    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Error exporting PDF. Please try again.');
      setIsExporting(false);
    }
  };

  /**
   * Save composition to localStorage
   */
  const handleSave = () => {
    try {
      const saved = saveToLocalStorage();
      showMessage('Composition saved to browser storage!');
      console.log('Saved composition:', saved);
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error saving composition. Please try again.');
    }
  };

  /**
   * Load composition from localStorage
   */
  const handleLoad = () => {
    try {
      const loaded = loadFromLocalStorage();
      if (loaded) {
        showMessage('Composition loaded successfully!');
      } else {
        alert('No saved composition found.');
      }
    } catch (error) {
      console.error('Error loading:', error);
      alert('Error loading composition. Please try again.');
    }
  };

  /**
   * Export composition as JSON
   */
  const handleExportJSON = () => {
    try {
      const composition = {
        title,
        composer,
        tempo,
        notes: getSortedNotes(),
        exportedAt: new Date().toISOString()
      };

      const json = JSON.stringify(composition, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showMessage('JSON file exported successfully!');

    } catch (error) {
      console.error('Error exporting JSON:', error);
      alert('Error exporting JSON. Please try again.');
    }
  };

  return (
    <div className="export-buttons bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <Download className="mr-2" size={28} />
        Save & Export
      </h2>

      {/* Export Message */}
      {exportMessage && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-green-800">{exportMessage}</p>
        </div>
      )}

      {/* Save/Load Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Local Storage</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={handleSave}
            className="px-8 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <Save className="inline-block mr-2" size={24} />
            Save to Browser
          </button>

          <button
            onClick={handleLoad}
            className="px-8 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <Upload className="inline-block mr-2" size={24} />
            Load from Browser
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Compositions are auto-saved every 30 seconds
        </p>
      </div>

      {/* Export Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Export Files</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={handleExportPDF}
            disabled={isExporting || notes.length === 0}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 ${
              isExporting || notes.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            <FileText className="inline-block mr-2" size={24} />
            Export PDF
          </button>

          <button
            onClick={handleExportMIDI}
            disabled={isExporting || notes.length === 0}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 ${
              isExporting || notes.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            <Music2 className="inline-block mr-2" size={24} />
            Export MIDI
          </button>

          <button
            onClick={handleExportJSON}
            disabled={notes.length === 0}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 ${
              notes.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            <Download className="inline-block mr-2" size={24} />
            Export JSON
          </button>
        </div>
      </div>

      {/* Information Box */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
        <h4 className="font-semibold text-gray-800 mb-2">Export Information:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>PDF:</strong> Creates a printable sheet music document</li>
          <li>• <strong>MIDI:</strong> Standard MIDI file that can be imported into DAWs</li>
          <li>• <strong>JSON:</strong> Raw composition data for backup or sharing</li>
          <li>• <strong>Browser Storage:</strong> Saves your work locally (auto-saves every 30s)</li>
        </ul>
      </div>

      {/* Disabled Message */}
      {notes.length === 0 && (
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            Add some notes to your composition to enable export options
          </p>
        </div>
      )}
    </div>
  );
};

export default ExportButtons;
