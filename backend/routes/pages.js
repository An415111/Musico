const express = require("express");
const router = express.Router();
const { verifyUser, verifyAdmin } = require("../middleware/auth");
const User = require("../models/User");

// AUTH PAGES 
router.get("/", (req, res) => res.render("signin"));
router.get("/signup", (req, res) => res.render("signUp"));
router.get("/forgot", (req, res) => res.render("Forget_Password"));
router.get("/reset", (req, res) => res.render("Reset"));

// MAIN PAGES 
router.get("/music", verifyUser, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.render("music", { user });
});

router.get("/playlist", verifyUser, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.render("playlist", { user });
});

router.get("/download", verifyUser, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.render("download", { user });
});

router.get("/setting", verifyUser, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.render("setting", { user });
});

router.get("/profile", verifyUser, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.render("profile", { user });
});

router.get("/support", verifyUser, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.render("support", { user });
});

router.get("/logout", (req, res) => {
  res.clearCookie("token"); 
  res.redirect("/");     
});

// ADMIN 
router.get("/admin", verifyUser, verifyAdmin, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.render("admin", { user });
});

// ARTIST 
router.get("/artist/:name", verifyUser, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  const artistName = req.params.name;
  res.render("artist", { artistName, user });
});

// STATIC ARTIST PAGES 
router.get("/darshan", verifyUser, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.render("Darshan", { user });
});

router.get("/badshah", verifyUser, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.render("Badshah", { user });
});

router.get("/sonu", verifyUser, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.render("sonu", { user });
});

router.get("/arjit", verifyUser, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.render("Collection", { user });
});

router.get("/honey", verifyUser, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.render("Honey", { user });
});

router.get("/javed", verifyUser, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.render("javed", { user });
});

router.get("/khesari", verifyUser, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.render("Khesari", { user });
});

// EXTRA
router.get("/index", (req, res) => res.render("index"));

module.exports = router;