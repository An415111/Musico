const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  title: {
    type: String,
    required: true
  },

  src: {
    type: String,
    required: true
  },

  image: {
    type: String,
    required: true
  },

  // 🔥 OPTIONAL (future upgrade)
  songId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song'
  }

}, { timestamps: true });

module.exports = mongoose.model('Playlist', playlistSchema);