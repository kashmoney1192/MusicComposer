const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  pitch: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true,
    enum: ['w', 'h', 'q', '8', '16', '32']
  },
  clef: {
    type: String,
    required: true,
    enum: ['treble', 'bass', 'alto', 'tenor']
  },
  measure: {
    type: Number,
    required: true
  },
  beat: {
    type: Number,
    required: true
  },
  accidental: {
    type: String,
    enum: ['#', 'b', 'n', ''],
    default: ''
  },
  tie: {
    type: Boolean,
    default: false
  },
  dot: {
    type: Boolean,
    default: false
  },
  articulation: {
    type: String,
    enum: ['staccato', 'accent', 'tenuto', 'marcato', ''],
    default: ''
  }
});

const CompositionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  composer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collaborators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['editor', 'viewer'],
      default: 'viewer'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  isTemplate: {
    type: Boolean,
    default: false
  },
  metadata: {
    timeSignature: {
      type: String,
      default: '4/4'
    },
    keySignature: {
      type: String,
      default: 'C'
    },
    tempo: {
      type: Number,
      default: 120,
      min: 40,
      max: 300
    },
    genre: {
      type: String,
      trim: true
    },
    instrument: {
      type: String,
      default: 'Piano'
    }
  },
  structure: {
    measures: {
      type: Number,
      default: 8,
      min: 1,
      max: 1000
    },
    staves: [{
      clef: {
        type: String,
        required: true,
        enum: ['treble', 'bass', 'alto', 'tenor']
      },
      instrument: {
        type: String,
        default: 'Piano'
      }
    }]
  },
  notes: [NoteSchema],
  version: {
    type: Number,
    default: 1
  },
  history: [{
    version: Number,
    notes: [NoteSchema],
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    changes: String
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  stats: {
    views: {
      type: Number,
      default: 0
    },
    downloads: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    forks: {
      type: Number,
      default: 0
    }
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Indexes for better performance
CompositionSchema.index({ composer: 1, createdAt: -1 });
CompositionSchema.index({ isPublic: 1, createdAt: -1 });
CompositionSchema.index({ tags: 1 });
CompositionSchema.index({ title: 'text', description: 'text' });

// Virtual for total duration calculation
CompositionSchema.virtual('totalDuration').get(function() {
  const durationMap = { 'w': 4, 'h': 2, 'q': 1, '8': 0.5, '16': 0.25, '32': 0.125 };
  return this.notes.reduce((total, note) => {
    const duration = durationMap[note.duration] || 1;
    return total + (note.dot ? duration * 1.5 : duration);
  }, 0);
});

module.exports = mongoose.model('Composition', CompositionSchema);