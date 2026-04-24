require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();

// ✅ Trust Render's proxy (REQUIRED for cookies on Render)
app.set("trust proxy", 1);

// ✅ CORS - allow both localhost and production
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// ✅ EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// ✅ Static files
app.use(express.static(path.join(__dirname, "../public")));

// ✅ MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("DB Error:", err));

// ✅ API ROUTES
app.use('/api/auth', require('./routes/auth'));
app.use('/api/songs', require('./routes/song'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/playlist', require('./routes/playlist'));

// ✅ PAGE ROUTES
const pageRoutes = require("./routes/pages");
app.use("/", pageRoutes);

// ✅ SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});