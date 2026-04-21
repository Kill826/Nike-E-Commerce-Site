const router = require("express").Router();
const Review = require("../models/Review");
const multer = require("multer");
const path   = require("path");
const fs     = require("fs");

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename:    (_, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_, file, cb) => file.mimetype.startsWith("image/") ? cb(null, true) : cb(new Error("Images only"))
});

// GET /api/reviews/:productId
router.get("/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/reviews/:productId
router.post("/:productId", upload.single("image"), async (req, res) => {
  try {
    const { userId, userName, rating, message } = req.body;
    if (!userId || !userName || !rating || !message)
      return res.status(400).json({ error: "Missing required fields" });

    const image = req.file ? `http://localhost:4000/uploads/${req.file.filename}` : "";
    const review = await Review.create({
      productId: req.params.productId,
      userId, userName,
      rating: Number(rating),
      message, image,
    });
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
