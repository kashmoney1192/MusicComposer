const express = require('express');
const PDFDocument = require('pdfkit');
const MidiWriter = require('midi-writer-js');
const xml2js = require('xml2js');
const { authMiddleware, optionalAuth } = require('../middleware/auth');
const Composition = require('../models/Composition');

const router = express.Router();

// Export as PDF
router.get('/:id/pdf', optionalAuth, async (req, res) => {
  try {
    const composition = await Composition.findById(req.params.id)
      .populate('composer', 'name');

    if (!composition) {
      return res.status(404).json({ message: 'Composition not found' });
    }

    // Check permissions
    const hasAccess = composition.isPublic || 
      (req.user && (
        composition.composer._id.toString() === req.user._id.toString() ||
        composition.collaborators.some(collab => 
          collab.user.toString() === req.user._id.toString()
        )
      ));

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Create PDF
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${composition.title}.pdf"`);
    
    doc.pipe(res);

    // Add title and composer
    doc.fontSize(20).text(composition.title, 50, 50);
    doc.fontSize(12).text(`Composer: ${composition.composer.name}`, 50, 80);
    doc.text(`Key: ${composition.metadata.keySignature} | Time: ${composition.metadata.timeSignature} | Tempo: ${composition.metadata.tempo} BPM`, 50, 100);

    // Add a simple text representation of notes
    doc.fontSize(10).text('Musical Content:', 50, 140);
    let y = 160;
    
    composition.notes.forEach((note, index) => {
      if (y > 750) {
        doc.addPage();
        y = 50;
      }
      
      const noteText = `${note.pitch}${note.accidental} (${note.duration}) - Measure ${note.measure}, Beat ${note.beat}`;
      doc.text(noteText, 50, y);
      y += 15;
    });

    doc.end();

    // Update download count
    await Composition.findByIdAndUpdate(req.params.id, 
      { $inc: { 'stats.downloads': 1 } }
    );

  } catch (error) {
    res.status(500).json({ message: 'PDF export failed', error: error.message });
  }
});

// Export as MIDI
router.get('/:id/midi', optionalAuth, async (req, res) => {
  try {
    const composition = await Composition.findById(req.params.id);

    if (!composition) {
      return res.status(404).json({ message: 'Composition not found' });
    }

    // Check permissions (same as PDF)
    const hasAccess = composition.isPublic || 
      (req.user && (
        composition.composer._id.toString() === req.user._id.toString() ||
        composition.collaborators.some(collab => 
          collab.user.toString() === req.user._id.toString()
        )
      ));

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Create MIDI track
    const track = new MidiWriter.Track();
    
    // Convert duration strings to MIDI durations
    const durationMap = {
      'w': '1',
      'h': '2', 
      'q': '4',
      '8': '8',
      '16': '16',
      '32': '32'
    };

    // Group notes by measure and beat for proper timing
    const sortedNotes = composition.notes.sort((a, b) => {
      if (a.measure !== b.measure) return a.measure - b.measure;
      return a.beat - b.beat;
    });

    sortedNotes.forEach(note => {
      const midiNote = convertPitchToMidi(note.pitch);
      const duration = durationMap[note.duration] || '4';
      
      track.addEvent(new MidiWriter.NoteEvent({
        pitch: [midiNote],
        duration: duration,
        velocity: 64
      }));
    });

    // Create MIDI writer
    const write = new MidiWriter.Writer(track);
    const midiData = write.buildFile();

    res.setHeader('Content-Type', 'audio/midi');
    res.setHeader('Content-Disposition', `attachment; filename="${composition.title}.mid"`);
    res.send(Buffer.from(midiData));

    // Update download count
    await Composition.findByIdAndUpdate(req.params.id, 
      { $inc: { 'stats.downloads': 1 } }
    );

  } catch (error) {
    res.status(500).json({ message: 'MIDI export failed', error: error.message });
  }
});

// Export as MusicXML
router.get('/:id/musicxml', optionalAuth, async (req, res) => {
  try {
    const composition = await Composition.findById(req.params.id)
      .populate('composer', 'name');

    if (!composition) {
      return res.status(404).json({ message: 'Composition not found' });
    }

    // Check permissions (same as PDF)
    const hasAccess = composition.isPublic || 
      (req.user && (
        composition.composer._id.toString() === req.user._id.toString() ||
        composition.collaborators.some(collab => 
          collab.user.toString() === req.user._id.toString()
        )
      ));

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Create MusicXML structure
    const musicXml = {
      'score-partwise': {
        $: { version: '3.1' },
        'work': {
          'work-title': composition.title
        },
        'identification': {
          'creator': {
            $: { type: 'composer' },
            _: composition.composer.name
          }
        },
        'part-list': {
          'score-part': {
            $: { id: 'P1' },
            'part-name': composition.metadata.instrument || 'Piano'
          }
        },
        'part': {
          $: { id: 'P1' },
          'measure': []
        }
      }
    };

    // Group notes by measure
    const measures = {};
    composition.notes.forEach(note => {
      if (!measures[note.measure]) {
        measures[note.measure] = [];
      }
      measures[note.measure].push(note);
    });

    // Convert measures to MusicXML
    Object.keys(measures).sort((a, b) => parseInt(a) - parseInt(b)).forEach(measureNum => {
      const measureNotes = measures[measureNum].sort((a, b) => a.beat - b.beat);
      
      const measureXml = {
        $: { number: measureNum },
        'note': measureNotes.map(note => ({
          'pitch': {
            'step': note.pitch.charAt(0).toUpperCase(),
            'octave': note.pitch.split('/')[1] || '4'
          },
          'duration': getDurationValue(note.duration),
          'type': getDurationType(note.duration)
        }))
      };

      musicXml['score-partwise']['part']['measure'].push(measureXml);
    });

    // Convert to XML string
    const builder = new xml2js.Builder();
    const xmlString = builder.buildObject(musicXml);

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Content-Disposition', `attachment; filename="${composition.title}.musicxml"`);
    res.send(xmlString);

    // Update download count
    await Composition.findByIdAndUpdate(req.params.id, 
      { $inc: { 'stats.downloads': 1 } }
    );

  } catch (error) {
    res.status(500).json({ message: 'MusicXML export failed', error: error.message });
  }
});

// Helper functions
function convertPitchToMidi(pitch) {
  const noteMap = { 'c': 0, 'd': 2, 'e': 4, 'f': 5, 'g': 7, 'a': 9, 'b': 11 };
  const [note, octave] = pitch.toLowerCase().split('/');
  const noteValue = noteMap[note.charAt(0)];
  const octaveValue = parseInt(octave) || 4;
  return (octaveValue + 1) * 12 + noteValue;
}

function getDurationValue(duration) {
  const values = { 'w': 4, 'h': 2, 'q': 1, '8': 0.5, '16': 0.25, '32': 0.125 };
  return values[duration] || 1;
}

function getDurationType(duration) {
  const types = { 'w': 'whole', 'h': 'half', 'q': 'quarter', '8': 'eighth', '16': '16th', '32': '32nd' };
  return types[duration] || 'quarter';
}

module.exports = router;