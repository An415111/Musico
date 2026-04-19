const express = require("express");
const router = express.Router();
const Song = require("../models/song");
const { verifyUser, verifyAdmin } = require("../middleware/auth");

router.post("/add-song", verifyUser, verifyAdmin, async (req, res) => {
  try {
    const { title, artist, audioUrl, imageUrl, collection } = req.body; // ✅

    if (!title || !artist || !audioUrl || !imageUrl) {
      return res.status(400).json({ msg: "All fields required" });
    }

    const song = new Song({
      title,
      artist,
      audioUrl,
      imageUrl,
      category: collection || "general",
    });

    await song.save();
    res.json({ msg: "Song added successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.delete("/delete-song/:id", verifyUser, verifyAdmin, async (req, res) => {
  try {
    await Song.findByIdAndDelete(req.params.id);
    res.json({ msg: "Song deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error deleting song" });
  }
});

module.exports = router;