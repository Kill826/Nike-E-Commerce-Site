const router = require("express").Router();
const multer = require("multer");
const path   = require("path");
const fs     = require("fs");

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename:    (_, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random()*1e6)}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 5*1024*1024 },
  fileFilter: (_,file,cb) => file.mimetype.startsWith("image/") ? cb(null,true) : cb(new Error("Images only"))
});

const DATA_FILE = path.join(__dirname, "../homeData.json");

const defaultData = {
  banner:    { title: "JUST DO THE WORK", subtitle: "Jordan Brand" },
  heroMedia: [{ type: "video", src: "/hero.mp4" }],
  featured:  { leftTitle: "Built For Champions", leftSubtitle: "Jordan Training", leftImage: "", rightTitle: "Refresh Your Sneaker Rotation", rightSubtitle: "Best Sellers", rightImage: "", rightImages: [] },
  sections:  [
    { title: "Power For Every Run",           subtitle: "Jordan Running",  image: "", link: "/products?type=shoes" },
    { title: "Refresh Your Sneaker Rotation", subtitle: "Best Sellers",    image: "", link: "/products?tag=best-sellers" },
    { title: "Athlete Picks",                 subtitle: "Jordan Brand",    image: "", link: "/products" },
    { title: "Just Do the Work",              subtitle: "Jordan Training", image: "", link: "/products?type=clothing" },
  ],
  spotlight:    { title: "SPOTLIGHT", description: "Classic silhouettes and cutting-edge innovation to build your game from the ground up." },
  spotlightItems: [
    { label: "Air Jordan 1",  q: "q=Air%20Jordan%201",  image: "" },
    { label: "Air Jordan 4",  q: "q=Air%20Jordan%204",  image: "" },
    { label: "Graphic Tees",  q: "q=Graphic%20Tee",     image: "" },
    { label: "Hoodies",       q: "q=Hoodie",            image: "" },
    { label: "Tights",        q: "q=Tight",             image: "" },
    { label: "Backpacks",     q: "q=Backpack",          image: "" },
    { label: "Jackets",       q: "q=Jacket",            image: "" },
    { label: "Tracksuit",     q: "q=Tracksuit",         image: "" },
    { label: "Shorts",        q: "q=Short",             image: "" },
    { label: "Leggings",      q: "q=Legging",           image: "" },
    { label: "Socks",         q: "q=Sock",              image: "" },
    { label: "Caps",          q: "q=Cap",               image: "" },
    { label: "Jordan Tatum",  q: "q=Tatum",             image: "" },
    { label: "Sports Bras",   q: "q=Sport%20Bra",       image: "" },
    { label: "Duffel Bags",   q: "q=Duffel",            image: "" },
    { label: "T-Shirts",      q: "q=Tee",               image: "" },
  ],
  appBanner:    { text: "IT'S BETTER ON THE JORDAN APP" },
  bestAirJordan:{ title: "Best of Air Jordan" },
  shopByStyle:  { title: "Shop By Style" },
  essentials:   { title: "The Essentials" },
  gearUp:       { title: "Gear Up" },
};

// Load persisted data or fall back to defaults
let homeData;
try {
  homeData = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
} catch {
  homeData = defaultData;
}

const persist = () => fs.writeFileSync(DATA_FILE, JSON.stringify(homeData, null, 2));

// GET /api/home-settings
router.get("/", (req, res) => res.json(homeData));

// PUT /api/home-settings
router.put("/", upload.fields([
  { name: "leftImage", maxCount: 1 },
  { name: "section0", maxCount: 1 }, { name: "section1", maxCount: 1 },
  { name: "section2", maxCount: 1 }, { name: "section3", maxCount: 1 },
]), (req, res) => {
  const b = req.body;
  const f = req.files || {};

  homeData.banner   = { title: b.bannerTitle, subtitle: b.bannerSubtitle };
  if (b.heroMedia) homeData.heroMedia = JSON.parse(b.heroMedia);
  homeData.featured = {
    leftTitle:    b.featuredLeftTitle,
    leftSubtitle: b.featuredLeftSubtitle,
    leftImage:    f.leftImage ? `http://localhost:4000/uploads/${f.leftImage[0].filename}` : b.featuredLeftImage,
    rightTitle:   b.featuredRightTitle,
    rightSubtitle:b.featuredRightSubtitle,
    rightImage:   b.featuredRightImage || homeData.featured?.rightImage || "",
    rightImages:  b.featuredRightImages ? JSON.parse(b.featuredRightImages) : homeData.featured?.rightImages || [],
  };
  homeData.spotlight    = { title: b.spotlightTitle, description: b.spotlightDescription };
  if (b.spotlightItems) homeData.spotlightItems = JSON.parse(b.spotlightItems);
  homeData.appBanner    = { text: b.appBannerText };
  homeData.bestAirJordan= { title: b.bestAirJordanTitle || homeData.bestAirJordan.title };
  homeData.shopByStyle  = { title: b.shopByStyleTitle  || homeData.shopByStyle.title };
  homeData.essentials   = { title: b.essentialsTitle   || homeData.essentials.title };
  homeData.gearUp       = { title: b.gearUpTitle       || homeData.gearUp.title };

  if (b.sections) {
    const sections = JSON.parse(b.sections);
    homeData.sections = sections.map((s, i) => ({
      ...s,
      image: f[`section${i}`] ? `http://localhost:4000/uploads/${f[`section${i}`][0].filename}` : s.image,
    }));
  }

  res.json(homeData);
  persist();
});

module.exports = router;
