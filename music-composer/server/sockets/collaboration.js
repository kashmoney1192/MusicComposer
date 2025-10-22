const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Composition = require('../models/Composition');

module.exports = (io) => {
  // Authentication middleware for socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return next(new Error('Invalid token'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔗 User ${socket.user.name} connected`);

    // Join composition room
    socket.on('join-composition', async (compositionId) => {
      try {
        const composition = await Composition.findById(compositionId);
        
        if (!composition) {
          socket.emit('error', { message: 'Composition not found' });
          return;
        }

        // Check permissions
        const hasAccess = composition.isPublic || 
          composition.composer.toString() === socket.user._id.toString() ||
          composition.collaborators.some(collab => 
            collab.user.toString() === socket.user._id.toString()
          );

        if (!hasAccess) {
          socket.emit('error', { message: 'Access denied' });
          return;
        }

        // Join room
        socket.join(compositionId);
        socket.currentComposition = compositionId;

        // Notify others
        socket.to(compositionId).emit('user-joined', {
          user: {
            id: socket.user._id,
            name: socket.user.name,
            avatar: socket.user.avatar
          }
        });

        // Send current composition state
        socket.emit('composition-state', {
          composition: composition.toObject()
        });

        console.log(`👥 User ${socket.user.name} joined composition ${compositionId}`);
      } catch (error) {
        socket.emit('error', { message: 'Failed to join composition' });
      }
    });

    // Handle note updates
    socket.on('note-update', async (data) => {
      try {
        const { compositionId, notes, operation, noteData } = data;
        
        if (socket.currentComposition !== compositionId) {
          socket.emit('error', { message: 'Not in this composition room' });
          return;
        }

        // Verify permissions
        const composition = await Composition.findById(compositionId);
        const isComposer = composition.composer.toString() === socket.user._id.toString();
        const isEditor = composition.collaborators.some(collab => 
          collab.user.toString() === socket.user._id.toString() && collab.role === 'editor'
        );

        if (!isComposer && !isEditor) {
          socket.emit('error', { message: 'No edit permissions' });
          return;
        }

        // Update composition in database
        if (notes) {
          composition.notes = notes;
          composition.version += 1;
          await composition.save();
        }

        // Broadcast to all users in the room except sender
        socket.to(compositionId).emit('note-update', {
          operation,
          notes: notes || noteData,
          updatedBy: {
            id: socket.user._id,
            name: socket.user.name
          },
          timestamp: new Date().toISOString()
        });

        console.log(`🎵 Note update in composition ${compositionId} by ${socket.user.name}`);
      } catch (error) {
        socket.emit('error', { message: 'Failed to update notes' });
      }
    });

    // Handle cursor movements
    socket.on('cursor-move', (data) => {
      if (socket.currentComposition) {
        socket.to(socket.currentComposition).emit('cursor-move', {
          user: {
            id: socket.user._id,
            name: socket.user.name,
            avatar: socket.user.avatar
          },
          position: data.position,
          timestamp: new Date().toISOString()
        });
      }
    });

    // Handle selection changes
    socket.on('selection-change', (data) => {
      if (socket.currentComposition) {
        socket.to(socket.currentComposition).emit('selection-change', {
          user: {
            id: socket.user._id,
            name: socket.user.name,
            avatar: socket.user.avatar
          },
          selection: data.selection,
          timestamp: new Date().toISOString()
        });
      }
    });

    // Handle chat messages
    socket.on('chat-message', (data) => {
      if (socket.currentComposition) {
        const message = {
          id: Date.now().toString(),
          user: {
            id: socket.user._id,
            name: socket.user.name,
            avatar: socket.user.avatar
          },
          message: data.message,
          timestamp: new Date().toISOString()
        };

        // Broadcast to all users in the room including sender
        io.to(socket.currentComposition).emit('chat-message', message);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      if (socket.currentComposition) {
        socket.to(socket.currentComposition).emit('user-left', {
          user: {
            id: socket.user._id,
            name: socket.user.name,
            avatar: socket.user.avatar
          }
        });
      }
      
      console.log(`🔌 User ${socket.user.name} disconnected`);
    });

    // Handle leaving composition
    socket.on('leave-composition', () => {
      if (socket.currentComposition) {
        socket.to(socket.currentComposition).emit('user-left', {
          user: {
            id: socket.user._id,
            name: socket.user.name,
            avatar: socket.user.avatar
          }
        });
        
        socket.leave(socket.currentComposition);
        socket.currentComposition = null;
      }
    });
  });
};