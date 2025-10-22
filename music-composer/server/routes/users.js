const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const User = require('../models/User');
const Composition = require('../models/Composition');

const router = express.Router();

// Get user's compositions
router.get('/compositions', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const compositions = await Composition.find({ 
      $or: [
        { composer: req.user._id },
        { 'collaborators.user': req.user._id }
      ]
    })
    .populate('composer', 'name avatar')
    .populate('collaborators.user', 'name avatar')
    .select('-notes -history')
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit);

    const total = await Composition.countDocuments({
      $or: [
        { composer: req.user._id },
        { 'collaborators.user': req.user._id }
      ]
    });

    res.json({
      compositions,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user compositions', error: error.message });
  }
});

// Get user stats
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Get detailed stats
    const compositionsCount = await Composition.countDocuments({ composer: req.user._id });
    const collaborationsCount = await Composition.countDocuments({ 'collaborators.user': req.user._id });
    const totalLikes = await Composition.aggregate([
      { $match: { composer: req.user._id } },
      { $group: { _id: null, totalLikes: { $sum: '$stats.likes' } } }
    ]);

    const stats = {
      ...user.stats.toObject(),
      compositionsCreated: compositionsCount,
      collaborationsJoined: collaborationsCount,
      totalLikes: totalLikes[0]?.totalLikes || 0
    };

    res.json({ stats });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user stats', error: error.message });
  }
});

module.exports = router;