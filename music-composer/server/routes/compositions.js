const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Composition = require('../models/Composition');
const { authMiddleware, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all compositions (with pagination and filters)
router.get('/', optionalAuth, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('search').optional().trim().escape(),
  query('tag').optional().trim().escape(),
  query('genre').optional().trim().escape(),
  query('isPublic').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    
    // Public compositions or user's own compositions
    if (req.user) {
      query.$or = [
        { isPublic: true },
        { composer: req.user._id },
        { 'collaborators.user': req.user._id }
      ];
    } else {
      query.isPublic = true;
    }

    // Apply filters
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }
    if (req.query.tag) {
      query.tags = { $in: [req.query.tag] };
    }
    if (req.query.genre) {
      query['metadata.genre'] = new RegExp(req.query.genre, 'i');
    }

    const compositions = await Composition.find(query)
      .populate('composer', 'name avatar')
      .populate('collaborators.user', 'name avatar')
      .select('-notes -history') // Exclude heavy fields for listing
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Composition.countDocuments(query);

    res.json({
      compositions,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch compositions', error: error.message });
  }
});

// Get single composition
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const composition = await Composition.findById(req.params.id)
      .populate('composer', 'name avatar')
      .populate('collaborators.user', 'name avatar');

    if (!composition) {
      return res.status(404).json({ message: 'Composition not found' });
    }

    // Check permissions
    const hasAccess = composition.isPublic || 
      (req.user && (
        composition.composer._id.toString() === req.user._id.toString() ||
        composition.collaborators.some(collab => 
          collab.user._id.toString() === req.user._id.toString()
        )
      ));

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Increment view count
    await Composition.findByIdAndUpdate(req.params.id, 
      { $inc: { 'stats.views': 1 } }
    );

    res.json({ composition });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch composition', error: error.message });
  }
});

// Create composition
router.post('/', authMiddleware, [
  body('title').trim().isLength({ min: 1, max: 200 }).escape(),
  body('description').optional().trim().isLength({ max: 1000 }).escape(),
  body('metadata.timeSignature').optional().isString(),
  body('metadata.keySignature').optional().isString(),
  body('metadata.tempo').optional().isInt({ min: 40, max: 300 }),
  body('isPublic').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const compositionData = {
      ...req.body,
      composer: req.user._id,
      structure: {
        measures: req.body.measures || 8,
        staves: req.body.staves || [{ clef: 'treble', instrument: 'Piano' }]
      }
    };

    const composition = await Composition.create(compositionData);
    
    // Update user stats
    await req.user.updateOne({ $inc: { 'stats.compositionsCreated': 1 } });

    const populatedComposition = await Composition.findById(composition._id)
      .populate('composer', 'name avatar');

    res.status(201).json({ 
      message: 'Composition created successfully',
      composition: populatedComposition 
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create composition', error: error.message });
  }
});

// Update composition
router.put('/:id', authMiddleware, [
  body('title').optional().trim().isLength({ min: 1, max: 200 }).escape(),
  body('description').optional().trim().isLength({ max: 1000 }).escape(),
  body('notes').optional().isArray(),
  body('isPublic').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const composition = await Composition.findById(req.params.id);
    
    if (!composition) {
      return res.status(404).json({ message: 'Composition not found' });
    }

    // Check permissions
    const isComposer = composition.composer.toString() === req.user._id.toString();
    const isEditor = composition.collaborators.some(collab => 
      collab.user.toString() === req.user._id.toString() && collab.role === 'editor'
    );

    if (!isComposer && !isEditor) {
      return res.status(403).json({ message: 'No permission to edit this composition' });
    }

    // Save version history before updating
    if (req.body.notes && req.body.notes !== composition.notes) {
      composition.history.push({
        version: composition.version,
        notes: composition.notes,
        updatedBy: req.user._id,
        changes: req.body.changes || 'Notes updated'
      });
      composition.version += 1;
    }

    // Update composition
    Object.assign(composition, req.body);
    await composition.save();

    const updatedComposition = await Composition.findById(composition._id)
      .populate('composer', 'name avatar')
      .populate('collaborators.user', 'name avatar');

    res.json({ 
      message: 'Composition updated successfully',
      composition: updatedComposition 
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update composition', error: error.message });
  }
});

// Delete composition
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const composition = await Composition.findById(req.params.id);
    
    if (!composition) {
      return res.status(404).json({ message: 'Composition not found' });
    }

    // Only composer can delete
    if (composition.composer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the composer can delete this composition' });
    }

    await Composition.findByIdAndDelete(req.params.id);

    res.json({ message: 'Composition deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete composition', error: error.message });
  }
});

// Add collaborator
router.post('/:id/collaborators', authMiddleware, [
  body('email').isEmail().normalizeEmail(),
  body('role').isIn(['editor', 'viewer'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const composition = await Composition.findById(req.params.id);
    
    if (!composition) {
      return res.status(404).json({ message: 'Composition not found' });
    }

    // Only composer can add collaborators
    if (composition.composer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the composer can add collaborators' });
    }

    // Find user by email
    const User = require('../models/User');
    const collaboratorUser = await User.findOne({ email: req.body.email });
    
    if (!collaboratorUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already a collaborator
    const existingCollab = composition.collaborators.find(
      collab => collab.user.toString() === collaboratorUser._id.toString()
    );

    if (existingCollab) {
      return res.status(409).json({ message: 'User is already a collaborator' });
    }

    // Add collaborator
    composition.collaborators.push({
      user: collaboratorUser._id,
      role: req.body.role
    });

    await composition.save();

    // Update user stats
    await collaboratorUser.updateOne({ $inc: { 'stats.collaborationsJoined': 1 } });

    const updatedComposition = await Composition.findById(composition._id)
      .populate('collaborators.user', 'name avatar email');

    res.json({ 
      message: 'Collaborator added successfully',
      collaborators: updatedComposition.collaborators 
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add collaborator', error: error.message });
  }
});

// Toggle like
router.post('/:id/like', authMiddleware, async (req, res) => {
  try {
    const composition = await Composition.findById(req.params.id);
    
    if (!composition) {
      return res.status(404).json({ message: 'Composition not found' });
    }

    const isLiked = composition.likedBy.includes(req.user._id);
    
    if (isLiked) {
      composition.likedBy.pull(req.user._id);
      composition.stats.likes -= 1;
    } else {
      composition.likedBy.push(req.user._id);
      composition.stats.likes += 1;
    }

    await composition.save();

    res.json({ 
      message: isLiked ? 'Composition unliked' : 'Composition liked',
      liked: !isLiked,
      likes: composition.stats.likes 
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle like', error: error.message });
  }
});

module.exports = router;