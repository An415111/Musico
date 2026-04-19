const jwt = require("jsonwebtoken");

exports.verifyUser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    console.log("⚠️ [Auth] No token found. Redirecting to login.");
    return res.redirect("/");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("❌ [Auth] Token verification failed. Clearing cookie.");
    res.clearCookie("token");
    return res.redirect("/");
  }
};

exports.verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).send(`
      <script>
        alert("Access Denied (Admin only)");
        window.location.href = "/music";
      </script>
    `);
  }
  next();
};