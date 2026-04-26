const express = require("express");
const router = express.Router();
const Song = require("../models/song");

// GET ALL SONGS
router.get("/", async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching songs" });
  }
});



router.get("/artist/:name", async (req, res) => {
  try {
    const songs = await Song.find({
      artist: new RegExp(req.params.name, "i")
    });

    res.json(songs);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching songs" });
  }
});

// GET SONGS BY COLLECTION
router.get("/collection/:name", async (req, res) => {
  try {
    const songs = await Song.find({ category: req.params.name });
    res.json(songs);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching songs" });
  }
});

// SAVE TO RECENTLY PLAYED
router.post("/recently-played", async (req, res) => {
  try {
    const { title, audioUrl, imageUrl, artist } = req.body; // ✅ add artist

    const existing = await Song.findOne({ audioUrl, category: "general" });
    if (!existing) {
      const song = new Song({
        title,
        audioUrl,
        imageUrl,
        artist: artist || "",  // ✅ save artist
        category: "general"
      });
      await song.save();
    }

    res.json({ msg: "Saved to recently played" });
  } catch (err) {
    res.status(500).json({ msg: "Error saving" });
  }
});

// SEARCH ALL SONGS (FUZZY)
router.get("/search", async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.json([]);

    const songs = await Song.find({
      $or: [
        { title: new RegExp(query, "i") },
        { artist: new RegExp(query, "i") },
        { category: new RegExp(query, "i") }
      ]
    }).limit(20);

    res.json(songs);
  } catch (err) {
    res.status(500).json({ msg: "Search error" });
  }
});

module.exports = router;