const router = require("express").Router();
const jwt    = require("jsonwebtoken");
const User   = require("../models/User");
const { protect } = require("../middleware/auth");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields are required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already registered" });

    // Only allow admin role if secret key is provided
    const assignedRole =
      role === "admin" && req.body.adminKey === process.env.ADMIN_SECRET_KEY
        ? "admin"
        : "user";

    const user = await User.create({ name, email, password, role: assignedRole });
    const token = signToken(user._id);

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ error: "Invalid email or password" });

    const token = signToken(user._id);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me  — get current user from token
router.get("/me", protect, (req, res) => {
  const u = req.user;
  res.json({ user: { id: u._id, name: u.name, email: u.email, role: u.role, avatar: u.avatar, phone: u.phone, address: u.address, city: u.city, pincode: u.pincode } });
});

// PUT /api/auth/profile — update profile
const multer = require("multer");
const path   = require("path");
const fs     = require("fs");
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename:    (_, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random()*1e6)}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 5*1024*1024 }, fileFilter: (_,file,cb) => file.mimetype.startsWith("image/") ? cb(null,true) : cb(new Error("Images only")) });

router.put("/profile", protect, upload.single("avatar"), async (req, res) => {
  try {
    const { name, phone, address, city, pincode } = req.body;
    const updates = { name, phone, address, city, pincode };
    if (req.file) updates.avatar = `http://localhost:4000/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, phone: user.phone, address: user.address, city: user.city, pincode: user.pincode } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
