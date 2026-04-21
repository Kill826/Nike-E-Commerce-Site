import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getAllProducts } from "../services/productService";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [categoryImgs, setCategoryImgs] = useState({});
  const [isPlaying, setIsPlaying] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [hs, setHs] = useState(null);
  const videoRef = useRef(null);
  const modalVideoRef = useRef(null);
  const scrollRef = useRef(null);

  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    fetch("http://localhost:4000/api/home-settings").then(r => r.json()).then(d => {
      setHs(d);
    }).catch(() => {});
    getAllProducts().then((all) => {
      setProducts(all);
      setFeatured(all.slice(0, 4));

      // Pick one image per category for section banners
      const pick = (gender, type) =>
        all.find((p) => (!gender || p.gender === gender) && (!type || p.type === type))?.image || "";

      // Pick image by name keyword for spotlight
      const pickByName = (keyword) =>
        all.find((p) => p.name.toLowerCase().includes(keyword.toLowerCase()))?.image || "";

      setCategoryImgs({
        shoes:       pick(null, "shoes"),
        clothing:    pick(null, "clothing"),
        accessories: pick(null, "accessories"),
        men:         pick("men", null),
        women:       pick("women", null),
        kids:        pick("kids", null),
        newArrivals: all.find((p) => ["New", "Just In"].includes(p.tag))?.image || "",
        menShoes:    pick("men", "shoes"),
        womenShoes:  pick("women", "shoes"),
        kidsShoes:   pick("kids", "shoes"),
        menClothing: pick("men", "clothing"),
        // spotlight specific
        airJordan1:  pickByName("Air Jordan 1"),
        airJordan4:  pickByName("Air Jordan 4"),
        retro:       pickByName("Retro"),
        graphicTee:  pickByName("Graphic Tee") || pickByName("Tee"),
        hoodie:      pickByName("Hoodie"),
        tights:      pickByName("Tight") || pickByName("Legging"),
        backpack:    pickByName("Backpack"),
        jacket:      pickByName("Jacket"),
        tracksuit:   pickByName("Tracksuit"),
        shorts:      pickByName("Short"),
        socks:       pickByName("Sock"),
        cap:         pickByName("Cap"),
        tatum:       pickByName("Tatum"),
        sportsBra:   pickByName("Sport Bra") || pickByName("Sports Bra"),
        duffel:      pickByName("Duffel"),
      });
    });
  }, []);

  const [featuredRightIndex, setFeaturedRightIndex] = useState(0);

  useEffect(() => {
    if (!hs?.heroMedia?.length || hs.heroMedia.length < 2) return;
    const t = setInterval(() => setHeroIndex(i => (i + 1) % hs.heroMedia.length), 5000);
    return () => clearInterval(t);
  }, [hs]);

  useEffect(() => {
    const imgs = hs?.featured?.rightImages;
    if (!imgs?.length || imgs.length < 2) return;
    const t = setInterval(() => setFeaturedRightIndex(i => (i + 1) % imgs.length), 3500);
    return () => clearInterval(t);
  }, [hs]);

  const toggleVideo = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) { videoRef.current.play(); setIsPlaying(true); }
    else { videoRef.current.pause(); setIsPlaying(false); }
  };

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <div className="text-white">

      {/* ── TOP BANNER ── */}
      <div className="bg-black text-white text-center py-2 px-4">
        <p className="text-[11px] font-medium">
          Get Free Delivery in 2-4 days. Easy Returns &amp; Size Exchanges.{" "}
          <Link to="/products" className="underline underline-offset-2 ml-1">Shop Now</Link>
        </p>
      </div>

      {/* ── HERO ── */}
      <section className="w-full">
        <div className="relative h-[500px] md:h-[700px] overflow-hidden bg-black">
          {/* Render all media stacked, fade active one in */}
          {(hs?.heroMedia?.length ? hs.heroMedia : [{ type: "video", src: "/hero.mp4" }]).map((media, i) => (
            <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === heroIndex ? "opacity-100" : "opacity-0"}`}>
              {media.type === "video"
                ? <video autoPlay loop muted playsInline ref={i === 0 ? videoRef : null} className="w-full h-full object-cover">
                    <source src={media.src} type="video/mp4" />
                  </video>
                : <img src={media.src} alt="Hero" className="w-full h-full object-cover" />
              }
            </div>
          ))}
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex items-end pb-16 px-8 md:px-16 z-10">
            {(hs?.heroMedia?.length ? hs.heroMedia : [{ title: "JUST DO THE WORK", subtitle: "Jordan Brand" }]).map((media, i) => (
              <div key={i} className={`absolute inset-0 flex items-end pb-16 px-8 md:px-16 transition-opacity duration-1000 ${i === heroIndex ? "opacity-100" : "opacity-0"}`}>
                <div className="text-white">
                  <p className="text-sm font-medium mb-2 tracking-wide">{media.subtitle || hs?.banner?.subtitle || "Jordan Brand"}</p>
                  <h1 className="text-4xl md:text-6xl font-black uppercase mb-6 leading-tight">
                    {media.title || hs?.banner?.title || "JUST DO THE WORK"}
                  </h1>
                  <div className="flex gap-3 flex-wrap">
                    <Link to="/products">
                      <button className="px-6 py-2.5 bg-white text-black text-sm font-medium rounded-full hover:bg-gray-200 transition">Explore</button>
                    </Link>
                    <button onClick={() => setShowModal(true)}
                      className="px-6 py-2.5 bg-white/20 backdrop-blur-sm border border-white text-white text-sm font-medium rounded-full hover:bg-white hover:text-black transition flex items-center gap-2">
                      Watch ▶
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {hs?.heroMedia?.length > 1 && (
            <>
              <button
                onClick={() => setHeroIndex(i => (i - 1 + hs.heroMedia.length) % hs.heroMedia.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 flex items-center justify-center text-white transition backdrop-blur-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setHeroIndex(i => (i + 1) % hs.heroMedia.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 flex items-center justify-center text-white transition backdrop-blur-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {hs.heroMedia.map((_, i) => (
                  <button key={i} onClick={() => setHeroIndex(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === heroIndex ? "w-6 bg-white" : "w-1.5 bg-white/40"}`} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── VIDEO MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center" onClick={() => setShowModal(false)}>
          <button onClick={() => setShowModal(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/40 transition text-lg z-10">✕</button>
          <video ref={modalVideoRef} src="/hero.mp4" autoPlay controls
            className="w-full h-full object-contain" onClick={e => e.stopPropagation()} />
        </div>
      )}

      {/* ── FEATURED ── */}
      <section className="px-4 md:px-8 py-8">
        <h2 className="text-xl font-bold mb-4">Featured</h2>
        {/* Split: big lifestyle left + shoes grid right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-auto md:h-[520px]">

          {/* LEFT — lifestyle image */}
          <Link to="/products" className="relative overflow-hidden group block h-[360px] md:h-full">
            <img
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=85"
              alt="Featured"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 text-white">
              <p className="text-xs font-medium mb-1">Jordan Training</p>
              <h3 className="text-2xl font-black uppercase mb-4">Built For Champions</h3>
              <button className="px-5 py-2 bg-white text-black text-sm font-medium rounded-full hover:bg-gray-200 transition">
                Shop
              </button>
            </div>
          </Link>

          {/* RIGHT — shoes grid on gray bg */}
          <div className="relative bg-[#e8eaed] flex flex-col justify-between p-8 h-[360px] md:h-full overflow-hidden">
            {hs?.featured?.rightImages?.length > 0 && (
              <>
                {hs.featured.rightImages.map((img, i) => (
                  <img key={i} src={img} alt="" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === featuredRightIndex ? "opacity-100" : "opacity-0"}`} />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </>
            )}
            <div className="relative z-10">
              <p className={`text-xs font-medium mb-1 ${hs?.featured?.rightImages?.length ? "text-white/70" : "text-white/40"}`}>
                {hs?.featured?.rightSubtitle || "Best Sellers"}
              </p>
              <h3 className={`text-2xl font-black uppercase mb-4 ${hs?.featured?.rightImages?.length ? "text-white" : ""}`}>
                {hs?.featured?.rightTitle || "Refresh Your Sneaker Rotation"}
              </h3>
              <Link to="/products?tag=best-sellers">
                <button className={`px-5 py-2 text-sm font-medium rounded-full transition ${hs?.featured?.rightImages?.length ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"}`}>
                  Shop
                </button>
              </Link>
            </div>
            {!hs?.featured?.rightImages?.length && (
              <div className="flex items-end justify-center gap-2 mt-4">
                {featured.slice(0, 3).map((p, i) => (
                  <Link key={p._id || p.id} to={`/product/${p._id || p.id}`}
                    className={`group transition-transform duration-300 hover:-translate-y-2 ${i === 1 ? "-translate-y-4" : ""}`}
                    style={{ width: i === 1 ? "38%" : "30%" }}
                  >
                    <img src={p.image} alt={p.name} className="w-full h-auto object-contain drop-shadow-xl" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── TWO HALF CARDS (Running + Best Sellers) ── */}
      <section className="px-4 md:px-8 pb-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

          {/* LEFT */}
          <div className="relative overflow-hidden group h-[400px]">
            <img
              src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=900&q=85"
              alt="Jordan Running"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-8 left-8 text-white">
              <p className="text-xs font-medium mb-1">Jordan Running</p>
              <h3 className="text-2xl font-black uppercase mb-4">Power For Every Run</h3>
              <Link to="/products?type=shoes">
                <button className="px-5 py-2 bg-white text-black text-sm font-medium rounded-full hover:bg-gray-200 transition">
                  Shop
                </button>
              </Link>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative overflow-hidden group h-[400px]">
            <img
              src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=85"
              alt="Best Sellers"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-8 left-8 text-white">
              <p className="text-xs font-medium mb-1">Best Sellers</p>
              <h3 className="text-2xl font-black uppercase mb-4">Refresh Your Sneaker Rotation</h3>
              <Link to="/products?tag=best-sellers">
                <button className="px-5 py-2 bg-white text-black text-sm font-medium rounded-full hover:bg-gray-200 transition">
                  Shop
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── TWO LARGE ATHLETE CARDS ── */}
      <section className="px-4 md:px-8 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

          {/* LEFT — Athlete Picks */}
          <div className="relative overflow-hidden group h-[560px]">
            <img
              src="https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=900&q=85"
              alt="Athlete Picks"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 text-white">
              <p className="text-xs font-medium mb-1">Jordan Brand</p>
              <h3 className="text-2xl font-black uppercase mb-4">Athlete Picks</h3>
              <Link to="/products">
                <button className="px-5 py-2 bg-white text-black text-sm font-medium rounded-full hover:bg-gray-200 transition">
                  Shop
                </button>
              </Link>
            </div>
          </div>

          {/* RIGHT — Just Do the Work */}
          <div className="relative overflow-hidden group h-[560px]">
            <img
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=85"
              alt="Just Do the Work"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 text-white">
              <p className="text-xs font-medium mb-1">Jordan Training</p>
              <h3 className="text-2xl font-black uppercase mb-4">Just Do the Work</h3>
              <Link to="/products?type=clothing">
                <button className="px-5 py-2 bg-white text-black text-sm font-medium rounded-full hover:bg-gray-200 transition">
                  Shop
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── BEST OF AIR JORDAN (product scroll) ── */}
      <section className="px-4 md:px-8 py-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-black uppercase tracking-tight">{hs?.bestAirJordan?.title || "Best of Air Jordan"}</h2>
          <Link to="/products" className="text-sm font-medium underline underline-offset-2 hover:text-gray-500 transition">
            Shop All
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {featured.map((p) => (
            <Link key={p._id || p.id} to={`/product/${p._id || p.id}`} className="group">
              <div className="bg-white/5 overflow-hidden mb-3 rounded-lg">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="text-xs font-semibold text-red-600 mb-0.5">Just In</p>
              <p className="text-sm font-bold leading-snug mb-0.5 line-clamp-2">{p.name}</p>
              <p className="text-sm text-gray-500 mb-1">{p.category}</p>
              <p className="text-sm font-medium">MRP : ₹ {p.price.toLocaleString()}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── SHOP BY STYLE — SIDE SCROLL ── */}
      <section className="px-4 md:px-8 py-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-black uppercase tracking-tight">{hs?.shopByStyle?.title || "Shop By Style"}</h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll(-1)}
              className="w-10 h-10 rounded-full bg-[#e5e5e5] hover:bg-[#d5d5d5] flex items-center justify-center transition"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll(1)}
              className="w-10 h-10 rounded-full bg-[#e5e5e5] hover:bg-[#d5d5d5] flex items-center justify-center transition"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable row */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {[
            { label: "Shop Shoes",       q: "type=shoes",       img: categoryImgs.shoes },
            { label: "Shop Clothing",    q: "type=clothing",    img: categoryImgs.clothing },
            { label: "Shop Accessories", q: "type=accessories", img: categoryImgs.accessories },
            { label: "Shop Men's",       q: "gender=men",       img: categoryImgs.men },
            { label: "Shop Women's",     q: "gender=women",     img: categoryImgs.women },
            { label: "Shop Kids'",       q: "gender=kids",      img: categoryImgs.kids },
            { label: "New Arrivals",     q: "tag=new-arrivals", img: categoryImgs.newArrivals },
          ].map(({ label, q, img }) => (
            <Link
              key={label}
              to={`/products?${q}`}
              className="relative shrink-0 w-[280px] md:w-[320px] overflow-hidden group block"
            >
              {/* Card image */}
              <div className="bg-white/5 h-[360px] overflow-hidden">
                <img
                  src={img}
                  alt={label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              {/* Label pill at bottom-left */}
              <button className="absolute bottom-5 left-5 px-4 py-2 bg-white text-black text-sm font-medium rounded-full shadow hover:bg-gray-100 transition">
                {label}
              </button>
            </Link>
          ))}
        </div>
      </section>

      {/* ── THE ESSENTIALS (3 col) ── */}
      <section className="px-4 md:px-8 py-10">
        <h2 className="text-xl font-black uppercase tracking-tight mb-5">{hs?.essentials?.title || "The Essentials"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { label: "Men's",   q: "gender=men",   img: categoryImgs.men },
            { label: "Women's", q: "gender=women", img: categoryImgs.women },
            { label: "Kids'",   q: "gender=kids",  img: categoryImgs.kids },
          ].map(({ label, q, img }) => (
            <Link key={label} to={`/products?${q}`} className="relative group overflow-hidden block h-[400px]">
              <img src={img} alt={label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/20" />
              <button className="absolute bottom-8 left-8 px-5 py-2 bg-white text-black text-sm font-medium rounded-full hover:bg-gray-100 transition">
                {label}
              </button>
            </Link>
          ))}
        </div>
      </section>

      {/* ── GEAR UP (clothing) ── */}
      <section className="px-4 md:px-8 py-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-black uppercase tracking-tight">{hs?.gearUp?.title || "Gear Up"}</h2>
          <Link to="/products?type=clothing" className="text-sm font-medium underline underline-offset-2 hover:text-gray-500 transition">
            Shop All
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {products.filter(p => p.type === "clothing").slice(0, 4).map((p) => (
            <Link key={p._id || p.id} to={`/product/${p._id || p.id}`} className="group">
              <div className="bg-white/5 overflow-hidden mb-3 rounded-lg">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="text-sm font-bold leading-snug mb-0.5 line-clamp-2">{p.name}</p>
              <p className="text-sm text-white/40 mb-1">{p.category}</p>
              <p className="text-sm font-medium">MRP : ₹ {p.price.toLocaleString()}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── APP BANNER ── */}
      <section className="px-4 md:px-8 py-4">
        <div className="bg-black flex items-center justify-between px-6 md:px-12 py-5 gap-4 rounded-xl">
          {/* Logo */}
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
            <svg viewBox="0 0 24 24" className="w-9 h-9" fill="black">
              <path d="M21.5 12.06c-1.93 4.17-6.5 6.94-11.5 5.44C5.5 16 2.5 11.5 3.5 6.5 4.17 3.17 6.83 1 10 1c.83 0 1.5.67 1.5 1.5S9.67 4 9 4C7.17 4 5.67 5.17 5.17 7c-.67 2.83 1.33 5.67 4.17 6.5 2.5.75 5-.25 6.33-2.44l6-11.06c.33-.58 1.08-.75 1.58-.33.5.42.58 1.17.25 1.67l-2 3.72z"/>
            </svg>
          </div>
          {/* Text */}
          <p className="text-2xl md:text-4xl font-black uppercase tracking-tight text-center flex-1 text-white">
            IT'S BETTER ON THE JORDAN APP
          </p>
          {/* QR Code */}
          <div className="shrink-0 hidden md:block">
            <div className="w-16 h-16 bg-white p-1 rounded">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* QR pattern */}
                <rect width="100" height="100" fill="white"/>
                {/* top-left finder */}
                <rect x="5" y="5" width="30" height="30" fill="black"/>
                <rect x="10" y="10" width="20" height="20" fill="white"/>
                <rect x="14" y="14" width="12" height="12" fill="black"/>
                {/* top-right finder */}
                <rect x="65" y="5" width="30" height="30" fill="black"/>
                <rect x="70" y="10" width="20" height="20" fill="white"/>
                <rect x="74" y="14" width="12" height="12" fill="black"/>
                {/* bottom-left finder */}
                <rect x="5" y="65" width="30" height="30" fill="black"/>
                <rect x="10" y="70" width="20" height="20" fill="white"/>
                <rect x="14" y="74" width="12" height="12" fill="black"/>
                {/* data dots */}
                <rect x="42" y="5" width="8" height="8" fill="black"/>
                <rect x="52" y="5" width="8" height="8" fill="black"/>
                <rect x="42" y="15" width="8" height="8" fill="black"/>
                <rect x="5" y="42" width="8" height="8" fill="black"/>
                <rect x="5" y="52" width="8" height="8" fill="black"/>
                <rect x="42" y="42" width="8" height="8" fill="black"/>
                <rect x="52" y="52" width="8" height="8" fill="black"/>
                <rect x="62" y="42" width="8" height="8" fill="black"/>
                <rect x="42" y="62" width="8" height="8" fill="black"/>
                <rect x="62" y="62" width="8" height="8" fill="black"/>
                <rect x="72" y="42" width="8" height="8" fill="black"/>
                <rect x="82" y="52" width="8" height="8" fill="black"/>
                <rect x="72" y="62" width="8" height="8" fill="black"/>
                <rect x="82" y="72" width="8" height="8" fill="black"/>
                <rect x="52" y="72" width="8" height="8" fill="black"/>
                <rect x="52" y="82" width="8" height="8" fill="black"/>
                <rect x="42" y="82" width="8" height="8" fill="black"/>
                <rect x="15" y="42" width="8" height="8" fill="black"/>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ── SPOTLIGHT ── */}
      <section className="px-4 md:px-8 py-12">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-3 text-black">SPOTLIGHT</h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Classic silhouettes and cutting-edge innovation to build your game from the ground up.
          </p>
        </div>

        {/* Icon grid — 2 rows × 8 cols */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-y-8 gap-x-2 max-w-4xl mx-auto">
          {(hs?.spotlightItems || [
            { label: "Air Jordan 1",  q: "q=Air%20Jordan%201",    image: categoryImgs.airJordan1 },
            { label: "Air Jordan 4",  q: "q=Air%20Jordan%204",    image: categoryImgs.airJordan4 },
            { label: "Graphic Tees",  q: "q=Graphic%20Tee",       image: categoryImgs.graphicTee },
            { label: "Hoodies",       q: "q=Hoodie",              image: categoryImgs.hoodie },
            { label: "Tights",        q: "q=Tight",               image: categoryImgs.tights },
            { label: "Backpacks",     q: "q=Backpack",            image: categoryImgs.backpack },
            { label: "Jackets",       q: "q=Jacket",              image: categoryImgs.jacket },
            { label: "Tracksuit",     q: "q=Tracksuit",           image: categoryImgs.tracksuit },
            { label: "Shorts",        q: "q=Short",               image: categoryImgs.shorts },
            { label: "Leggings",      q: "q=Legging",             image: categoryImgs.tights },
            { label: "Socks",         q: "q=Sock",                image: categoryImgs.socks },
            { label: "Caps",          q: "q=Cap",                 image: categoryImgs.cap },
            { label: "Jordan Tatum",  q: "q=Tatum",               image: categoryImgs.tatum },
            { label: "Sports Bras",   q: "q=Sport%20Bra",         image: categoryImgs.sportsBra },
            { label: "Duffel Bags",   q: "q=Duffel",              image: categoryImgs.duffel },
            { label: "T-Shirts",      q: "q=Tee",                 image: categoryImgs.graphicTee },
          ]).map((item) => (
            <Link key={item.label} to={`/products?${item.q}`} className="flex flex-col items-center gap-2 group">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center group-hover:bg-gray-200 transition border border-gray-200">
                <img
                  src={item.image || ""}
                  alt={item.label}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <span className="text-[11px] text-center text-gray-700 font-semibold leading-tight">{item.label}</span>
            </Link>
          ))}
        </div>
      </section>



    </div>
  );
};

export default Home;

