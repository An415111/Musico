const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// GET /api/user/me
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /api/user/playlists
router.post('/playlists', auth, async (req, res) => {
  try {
    const { name, songs } = req.body;
    const user = await User.findById(req.user);

    user.playlists.push({ name, songs });
    await user.save();
    res.json(user.playlists);

  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
