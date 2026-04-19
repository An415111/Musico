const express = require('express');
const router = express.Router();
const Playlist = require('../models/playlist');
const { verifyUser } = require('../middleware/auth');

// ➕ ADD SONG TO PLAYLIST
router.post('/add', verifyUser, async (req, res) => {
  try {
    const { title, src, image } = req.body;

    if (!title || !src || !image) {
      return res.status(400).json({ msg: 'Missing song data' });
    }

    const exists = await Playlist.findOne({
      user: req.user.id,
      src
    });

    if (exists) {
      return res.json({ msg: 'Song already in playlist' });
    }

    const song = new Playlist({
      user: req.user.id,
      title,
      src,
      image
    });

    await song.save();
    res.json({ msg: 'Song added to playlist' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});


// 📥 GET USER PLAYLIST
router.get('/', verifyUser, async (req, res) => {
  try {
    const songs = await Playlist.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json(songs);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});


// ❌ REMOVE SONG FROM PLAYLIST
router.delete('/:id', verifyUser, async (req, res) => {
  try {
    const deleted = await Playlist.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!deleted) {
      return res.status(404).json({ msg: 'Song not found' });
    }

    res.json({ msg: 'Song removed from playlist' });

  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;