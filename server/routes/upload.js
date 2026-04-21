const router  = require("express").Router();
const multer  = require("multer");
const path    = require("path");
const fs      = require("fs");

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename:    (_, file, cb) => {
    const ext  = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

// POST /api/upload  → returns { url: "/uploads/<filename>" }
router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  res.json({ url: `/uploads/${req.file.filename}` });
});

// POST /api/upload/multiple → returns { urls: [...] }
router.post("/multiple", upload.array("images", 6), (req, res) => {
  if (!req.files?.length) return res.status(400).json({ error: "No files uploaded" });
  res.json({ urls: req.files.map((f) => `/uploads/${f.filename}`) });
});

module.exports = router;
