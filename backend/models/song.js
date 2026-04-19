const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  title: String,
  artist: String,
  audioUrl: String,
  imageUrl: String,
  category: { type: String, default: "general" },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Song", songSchema);