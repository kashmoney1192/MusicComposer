/**
 * Music Generator Utility
 * Generates random sheet music based on user-selected parameters
 */

/**
 * Define scales for different key signatures
 * Each scale contains the notes that can be used in that key
 */
const SCALES = {
  'C': ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
  'G': ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
  'D': ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
  'A': ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
  'E': ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'],
  'F': ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],
  'Bb': ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'],
  'Eb': ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D'],
  'Ab': ['Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G'],
};

/**
 * Define octave ranges for different difficulty levels
 * Treble clef: Higher octaves (3-8)
 * Bass clef: Lower octaves (1-4)
 */
const OCTAVE_RANGES = {
  treble: {
    Beginner: [4, 4],      // C4 to B4 (1 octave)
    Easy: [4, 5],          // C4 to B5 (2 octaves)
    Medium: [3, 5],        // C3 to B5 (3 octaves)
    Intermediate: [3, 6],  // C3 to B6 (4 octaves)
    Hard: [2, 6],          // C2 to B6 (5 octaves)
    Advanced: [2, 7],      // C2 to B7 (6 octaves)
    Expert: [1, 7],        // C1 to B7 (7 octaves)
    Master: [1, 8],        // C1 to B8 (8 octaves - full range)
  },
  bass: {
    Beginner: [3, 3],      // C3 to B3 (1 octave)
    Easy: [2, 3],          // C2 to B3 (2 octaves)
    Medium: [2, 4],        // C2 to B4 (3 octaves)
    Intermediate: [1, 4],  // C1 to B4 (4 octaves)
    Hard: [1, 5],          // C1 to B5 (5 octaves)
    Advanced: [0, 5],      // C0 to B5 (6 octaves)
    Expert: [0, 6],        // C0 to B6 (7 octaves)
    Master: [0, 7],        // C0 to B7 (8 octaves)
  }
};

/**
 * Define rhythm patterns for different difficulty levels
 * Durations: w = whole, h = half, q = quarter, 8 = eighth, 16 = sixteenth
 */
const RHYTHM_PATTERNS = {
  Beginner: {
    patterns: [
      ['w'],                          // Whole notes only
      ['h', 'h'],                     // Half notes
      ['q', 'q', 'q', 'q'],          // Quarter notes
    ],
    rests: 0.05, // 5% chance of rest
  },
  Easy: {
    patterns: [
      ['q', 'q', 'q', 'q'],           // All quarter notes
      ['h', 'h'],                      // Half notes
      ['h', 'q', 'q'],                 // Half + two quarters
      ['q', 'q', 'h'],                 // Two quarters + half
    ],
    rests: 0.1, // 10% chance of rest
  },
  Medium: {
    patterns: [
      ['q', 'q', 'q', 'q'],           // Quarter notes
      ['8', '8', '8', '8', '8', '8', '8', '8'], // Eighth notes
      ['q', '8', '8', 'q'],           // Mixed
      ['8', '8', 'q', '8', '8'],      // Mixed
      ['h', 'q', 'q'],                 // Half + quarters
    ],
    rests: 0.15, // 15% chance of rest
  },
  Intermediate: {
    patterns: [
      ['8', '8', '8', '8', '8', '8', '8', '8'], // Eighth notes
      ['16', '16', '16', '16', '8', '8', 'q'], // Sixteenth notes mixed
      ['q', '8', '16', '16', '8'],    // Complex rhythms
      ['8', '16', '16', '8', '8', 'q'], // Complex rhythms
      ['h', '8', '8', '8', '8'],      // Mixed durations
    ],
    rests: 0.18, // 18% chance of rest
  },
  Hard: {
    patterns: [
      ['16', '16', '16', '16', '16', '16', '16', '16', '8', '8'], // More sixteenths
      ['8', '16', '16', '16', '16', '8', 'q'], // Complex
      ['q', '16', '16', '16', '16', '8', '8'], // Complex
      ['16', '16', '8', '16', '16', '8', '8', '8'], // Syncopated
    ],
    rests: 0.2, // 20% chance of rest
  },
  Advanced: {
    patterns: [
      ['16', '16', '16', '16', '16', '16', '16', '16', '16', '16', '16', '16', '16', '16', '16', '16'], // All sixteenths
      ['8', '16', '16', '16', '16', '16', '16', '8', '8'], // Very complex
      ['16', '16', '16', '16', '8', '16', '16', '16', '16', '8'], // Irregular groupings
      ['q', '16', '16', '16', '16', '16', '16', '16', '16'], // Mixed complex
    ],
    rests: 0.22, // 22% chance of rest
  },
  Expert: {
    patterns: [
      ['16', '16', '16', '16', '16', '16', '16', '16', '16', '16', '16', '16', '16', '16', '16', '16'], // Dense sixteenths
      ['8', '16', '16', '8', '16', '16', '16', '16', '16', '16'], // Complex syncopation
      ['16', '16', '8', '8', '16', '16', '16', '16', '8'], // Irregular
      ['q', '16', '16', '8', '16', '16', '16', '16', '8'], // Very complex
    ],
    rests: 0.25, // 25% chance of rest
  },
  Master: {
    patterns: [
      ['16', '16', '16', '16', '16', '16', '16', '16', '16', '16', '16', '16', '16', '16', '16', '16'], // All sixteenths
      ['16', '16', '16', '16', '16', '16', '16', '16', '8', '16', '16', '8'], // Extremely complex
      ['8', '16', '16', '16', '16', '16', '16', '16', '16', '16', '16'], // Challenging patterns
      ['16', '16', '8', '16', '16', '16', '16', '8', '16', '16'], // Professional level
    ],
    rests: 0.3, // 30% chance of rest
  },
};

/**
 * Calculate total beats for a rhythm pattern
 */
const calculateBeats = (pattern) => {
  const beatValues = {
    'w': 4,
    'h': 2,
    'q': 1,
    '8': 0.5,
    '16': 0.25,
  };
  return pattern.reduce((sum, duration) => sum + beatValues[duration], 0);
};

/**
 * Generate a random note within the selected scale and octave range
 * @param {string} keySignature - The key signature (e.g., 'C', 'G', 'D')
 * @param {string} difficulty - Difficulty level ('Easy', 'Medium', 'Hard')
 * @param {string} clef - Clef type ('treble' or 'bass')
 * @returns {string} - A note in VexFlow format (e.g., 'C/4', 'F#/5')
 */
const generateRandomNote = (keySignature, difficulty, clef = 'treble') => {
  const scale = SCALES[keySignature];
  const [minOctave, maxOctave] = OCTAVE_RANGES[clef][difficulty];

  // Randomly select a note from the scale
  const note = scale[Math.floor(Math.random() * scale.length)];

  // Randomly select an octave within the range
  const octave = minOctave + Math.floor(Math.random() * (maxOctave - minOctave + 1));

  return `${note}/${octave}`;
};

/**
 * Generate a random rhythm pattern based on difficulty
 * @param {string} difficulty - Difficulty level
 * @param {number} beatsPerMeasure - Beats per measure from time signature
 * @returns {Array} - Array of duration strings
 */
const generateRandomRhythm = (difficulty, beatsPerMeasure) => {
  const rhythmData = RHYTHM_PATTERNS[difficulty];
  const availablePatterns = rhythmData.patterns.filter(
    pattern => calculateBeats(pattern) <= beatsPerMeasure
  );

  if (availablePatterns.length === 0) {
    // Fallback: generate simple quarter notes
    return Array(beatsPerMeasure).fill('q');
  }

  // Select a random pattern
  return availablePatterns[Math.floor(Math.random() * availablePatterns.length)];
};

/**
 * Fill a measure with notes, ensuring it matches the time signature
 * @param {number} beatsPerMeasure - Beats per measure
 * @param {Array} rhythm - Rhythm pattern for the measure
 * @returns {Array} - Complete rhythm pattern for one measure
 */
const fillMeasure = (beatsPerMeasure, rhythm) => {
  let currentBeats = calculateBeats(rhythm);
  const result = [...rhythm];

  // If the rhythm is shorter than the measure, pad with rests or notes
  while (currentBeats < beatsPerMeasure) {
    const remaining = beatsPerMeasure - currentBeats;

    if (remaining >= 4) {
      result.push('w');
      currentBeats += 4;
    } else if (remaining >= 2) {
      result.push('h');
      currentBeats += 2;
    } else if (remaining >= 1) {
      result.push('q');
      currentBeats += 1;
    } else if (remaining >= 0.5) {
      result.push('8');
      currentBeats += 0.5;
    } else {
      result.push('16');
      currentBeats += 0.25;
    }
  }

  return result;
};

/**
 * Generate a complete random music piece
 * @param {Object} settings - Generation settings
 * @param {string} settings.keySignature - Key signature (e.g., 'C', 'G')
 * @param {string} settings.timeSignature - Time signature (e.g., '4/4', '3/4')
 * @param {string} settings.difficulty - Difficulty level ('Easy', 'Medium', 'Hard')
 * @param {string} settings.clef - Clef type ('treble', 'bass', or 'both')
 * @param {number} settings.measures - Number of measures to generate (optional)
 * @returns {Array} - Array of note objects
 */
export const generateMusic = (settings) => {
  const {
    keySignature = 'C',
    timeSignature = '4/4',
    difficulty = 'Easy',
    clef = 'treble',
    measures: measureCount
  } = settings;

  // Parse time signature
  const [beatsPerMeasure, beatValue] = timeSignature.split('/').map(Number);

  // Determine number of measures based on difficulty if not specified
  const measureDefaults = {
    Beginner: 4,
    Easy: 4,
    Medium: 8,
    Intermediate: 8,
    Hard: 12,
    Advanced: 12,
    Expert: 16,
    Master: 16,
  };
  const numMeasures = measureCount || measureDefaults[difficulty] || 8;

  const generatedNotes = [];
  let noteId = 0;

  // If clef is 'both', generate notes for both treble and bass staves
  if (clef === 'both') {
    // Generate notes for each measure for both staves
    for (let measure = 1; measure <= numMeasures; measure++) {
      // Generate treble staff notes
      let trebleRhythm = generateRandomRhythm(difficulty, beatsPerMeasure);
      trebleRhythm = fillMeasure(beatsPerMeasure, trebleRhythm);

      let currentBeat = 0;
      trebleRhythm.forEach((duration) => {
        const isRest = Math.random() < RHYTHM_PATTERNS[difficulty].rests;

        const note = {
          id: `note-${noteId++}`,
          pitch: isRest ? 'B/4' : generateRandomNote(keySignature, difficulty, 'treble'),
          duration: duration,
          measure: measure,
          beat: currentBeat,
          isRest: isRest,
          accidental: null,
          staff: 'treble', // Mark as treble staff
        };

        generatedNotes.push(note);

        const beatValues = { 'w': 4, 'h': 2, 'q': 1, '8': 0.5, '16': 0.25 };
        currentBeat += beatValues[duration];
      });

      // Generate bass staff notes
      let bassRhythm = generateRandomRhythm(difficulty, beatsPerMeasure);
      bassRhythm = fillMeasure(beatsPerMeasure, bassRhythm);

      currentBeat = 0;
      bassRhythm.forEach((duration) => {
        const isRest = Math.random() < RHYTHM_PATTERNS[difficulty].rests;

        const note = {
          id: `note-${noteId++}`,
          pitch: isRest ? 'D/3' : generateRandomNote(keySignature, difficulty, 'bass'),
          duration: duration,
          measure: measure,
          beat: currentBeat,
          isRest: isRest,
          accidental: null,
          staff: 'bass', // Mark as bass staff
        };

        generatedNotes.push(note);

        const beatValues = { 'w': 4, 'h': 2, 'q': 1, '8': 0.5, '16': 0.25 };
        currentBeat += beatValues[duration];
      });
    }
  } else {
    // Generate notes for single staff (treble or bass)
    for (let measure = 1; measure <= numMeasures; measure++) {
      // Generate rhythm pattern for this measure
      let rhythm = generateRandomRhythm(difficulty, beatsPerMeasure);
      rhythm = fillMeasure(beatsPerMeasure, rhythm);

      let currentBeat = 0;

      // Generate notes for each rhythm in the measure
      rhythm.forEach((duration) => {
        const isRest = Math.random() < RHYTHM_PATTERNS[difficulty].rests;

        const note = {
          id: `note-${noteId++}`,
          pitch: isRest ? 'B/4' : generateRandomNote(keySignature, difficulty, clef),
          duration: duration,
          measure: measure,
          beat: currentBeat,
          isRest: isRest,
          accidental: null, // Accidentals are already included in the pitch (e.g., F#)
          staff: clef, // Mark which staff this note belongs to
        };

        generatedNotes.push(note);

        // Update beat position
        const beatValues = { 'w': 4, 'h': 2, 'q': 1, '8': 0.5, '16': 0.25 };
        currentBeat += beatValues[duration];
      });
    }
  }

  return generatedNotes;
};

/**
 * Get the key signature notation for VexFlow
 * @param {string} keySignature - Key signature (e.g., 'C', 'G', 'F')
 * @returns {string} - VexFlow key signature notation
 */
export const getKeySignatureNotation = (keySignature) => {
  const keyNotations = {
    'C': 'C',
    'G': 'G',
    'D': 'D',
    'A': 'A',
    'E': 'E',
    'F': 'F',
    'Bb': 'Bb',
    'Eb': 'Eb',
    'Ab': 'Ab',
  };
  return keyNotations[keySignature] || 'C';
};

/**
 * Get available key signatures
 * @returns {Array} - Array of key signature options
 */
export const getKeySignatures = () => {
  return Object.keys(SCALES);
};

/**
 * Get available time signatures
 * @returns {Array} - Array of time signature options
 */
export const getTimeSignatures = () => {
  return ['4/4', '3/4', '2/4', '6/8', '3/8'];
};

/**
 * Get available difficulty levels
 * @returns {Array} - Array of difficulty options
 */
export const getDifficulties = () => {
  return ['Beginner', 'Easy', 'Medium', 'Intermediate', 'Hard', 'Advanced', 'Expert', 'Master'];
};
