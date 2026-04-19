const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: String,
  src: String,
  artist: String
}, { _id: false });

const playlistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  songs: [songSchema],
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  password:  { type: String, required: true },

  role: { type: String, enum: ["user", "admin"], default: "user" }, // 🔥 NEW

  playlists: [playlistSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);