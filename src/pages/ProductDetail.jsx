import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Heart, Star, Upload, X } from "lucide-react";
import { getAllProducts, getProductById } from "../services/productService";
import { useCart } from "../CartContext";
import { useWishlist } from "../WishlistContext";
import { useAuth } from "../AuthContext";
import ShoeCard from "../components/ShoeCard";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isLiked } = useWishlist();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  const { user, isLoggedIn } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 0, message: "" });
  const [reviewImage, setReviewImage] = useState(null);
  const [reviewPreview, setReviewPreview] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const fileRef = useRef(null);

  const fetchReviews = (pid) =>
    fetch(`http://localhost:4000/api/reviews/${pid}`)
      .then((r) => r.json()).then((d) => setReviews(Array.isArray(d) ? d : []));

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.rating) { setReviewError("Please select a rating"); return; }
    if (!reviewForm.message.trim()) { setReviewError("Please write a review"); return; }
    setReviewLoading(true); setReviewError("");
    const fd = new FormData();
    fd.append("userId", user.id);
    fd.append("userName", user.name);
    fd.append("rating", reviewForm.rating);
    fd.append("message", reviewForm.message);
    if (reviewImage) fd.append("image", reviewImage);
    try {
      const res = await fetch(`http://localhost:4000/api/reviews/${id}`, { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setReviews((prev) => [data, ...prev]);
      setReviewForm({ rating: 0, message: "" });
      setReviewImage(null); setReviewPreview("");
    } catch (err) {
      setReviewError(err.message);
    } finally {
      setReviewLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setSelectedSize(null);
    setActiveImg(0);
    getProductById(id).then((p) => {
      setProduct(p);
      if (p) {
        getAllProducts().then((all) => {
          setRelated(all.filter((x) => x.gender === p.gender && x.type === p.type && String(x._id || x.id) !== String(p._id || p.id)).slice(0, 4));
        });
        fetchReviews(id);
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-3xl font-black text-gray-900">Product Not Found</h1>
    </div>
  );

  const isShoe = product.type === "shoes";
  const liked = isLiked(product._id || product.id);
  const needsSize = !(product.sizes?.length === 1 && product.sizes[0] === "One Size");
  const allImages = product.images?.length > 0 ? [product.image, ...product.images] : [product.image];

  const handleAddToCart = () => {
    if (needsSize && !selectedSize) { setSizeError(true); return; }
    setSizeError(false);
    addToCart({ ...product, size: selectedSize });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (needsSize && !selectedSize) { setSizeError(true); return; }
    setSizeError(false);
    addToCart({ ...product, size: selectedSize });
    navigate("/cart");
  };

  return (
    <div className="min-h-screen text-black">

      {/* BREADCRUMB */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <p className="text-xs text-gray-400 uppercase tracking-widest">
          <Link to="/" className="hover:text-black transition">Home</Link>
          <span className="mx-2">/</span>
          <Link to={`/products?gender=${product.gender}`} className="hover:text-black transition capitalize">{product.gender}</Link>
          <span className="mx-2">/</span>
          <Link to={`/products?gender=${product.gender}&type=${product.type}`} className="hover:text-black transition capitalize">{product.type}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700 uppercase">{product.name}</span>
        </p>
      </div>

      {/* MAIN GRID */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid md:grid-cols-2 gap-12">

        {/* IMAGE GALLERY */}
        <div className="flex gap-3">
          {allImages.length > 1 && (
            <div className="flex flex-col gap-2 w-16 shrink-0">
              {allImages.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 overflow-hidden border-2 transition rounded ${activeImg === i ? "border-black" : "border-gray-200 opacity-60 hover:opacity-100"}`}>
                  <img src={img} alt={`view ${i+1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="relative bg-gray-50 flex-1 aspect-square overflow-hidden rounded-lg">
            <img src={allImages[activeImg]} alt={product.name} className="w-full h-full object-cover transition-all duration-300" />
            {product.tag && (
              <span className="absolute top-4 left-4 bg-red-600 text-white text-[11px] font-bold px-3 py-1 uppercase tracking-wider rounded">
                {product.tag}
              </span>
            )}
            <button onClick={() => toggleWishlist(product)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white shadow-md hover:shadow-lg rounded-full transition"
              aria-label="Wishlist">
              <Heart className={`w-5 h-5 ${liked ? "fill-red-500 stroke-red-500" : "stroke-gray-400 fill-transparent"}`} />
            </button>
            {allImages.length > 1 && (
              <>
                <button onClick={() => setActiveImg((p) => (p === 0 ? allImages.length - 1 : p - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white shadow rounded-full flex items-center justify-center text-gray-700 transition text-lg">‹</button>
                <button onClick={() => setActiveImg((p) => (p === allImages.length - 1 ? 0 : p + 1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white shadow rounded-full flex items-center justify-center text-gray-700 transition text-lg">›</button>
              </>
            )}
          </div>
        </div>

        {/* DETAILS */}
        <div className="flex flex-col justify-center">
          {product.tag && <span className="text-red-500 text-[11px] font-bold uppercase tracking-[0.4em] mb-3">{product.tag}</span>}
          <h1 className="text-4xl font-black uppercase leading-tight tracking-tight text-gray-900">{product.name}</h1>
          <p className="text-gray-400 text-sm mt-1 uppercase tracking-wider">{product.category}</p>
          <p className="text-3xl font-bold mt-5 text-gray-900">&#8377;{product.price.toLocaleString()}</p>

          <p className="text-gray-500 mt-6 text-sm leading-relaxed border-t border-gray-100 pt-6">{product.description}</p>

          {/* SIZE SELECTOR */}
          {needsSize && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <p className={`text-xs font-bold uppercase tracking-wider ${sizeError ? "text-red-500" : "text-gray-400"}`}>
                  {sizeError ? "⚠ Please select a size" : isShoe ? "Select Size (UK)" : "Select Size"}
                </p>
                {selectedSize && <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">Selected: {selectedSize}</span>}
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button key={s} onClick={() => { setSelectedSize(s); setSizeError(false); }}
                    className={`min-w-[3.5rem] h-10 px-3 text-sm font-medium border rounded transition ${
                      selectedSize === s ? "bg-black text-white border-black" : "border-gray-200 text-gray-700 hover:border-black hover:text-black"
                    }`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex gap-3 mt-8">
            <button onClick={handleAddToCart}
              className={`flex-1 py-4 font-bold text-xs uppercase tracking-[0.2em] rounded transition ${
                added ? "bg-green-500 text-white" : "bg-black text-white hover:bg-gray-800"
              }`}>
              {added ? "Added to Bag ✓" : "Add to Bag"}
            </button>
            <button onClick={handleBuyNow}
              className="flex-1 py-4 border-2 border-black text-black font-bold text-xs uppercase tracking-[0.2em] rounded hover:bg-black hover:text-white transition">
              Buy Now
            </button>
          </div>

          <Link to={`/products?gender=${product.gender}&type=${product.type}`}
            className="mt-6 text-xs text-gray-400 hover:text-black transition uppercase tracking-widest w-fit">
            ← Back to {product.category}
          </Link>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {related.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 pb-16 border-t border-gray-100 pt-12">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-[0.4em] mb-1">You May Also Like</p>
              <h2 className="text-2xl font-black uppercase tracking-tight">Related Products</h2>
            </div>
            <Link to={`/products?gender=${product.gender}&type=${product.type}`}
              className="text-xs text-gray-400 hover:text-black uppercase tracking-widest transition">View All →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => <ShoeCard key={p._id || p.id} shoe={p} />)}
          </div>
        </div>
      )}

      {/* REVIEWS */}
      <div className="max-w-7xl mx-auto px-6 pb-16 border-t border-gray-100 pt-12">
        <div className="mb-8">
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em] mb-1">Community</p>
          <h2 className="text-2xl font-black uppercase tracking-tight text-black">
            Reviews {reviews.length > 0 && <span className="text-gray-400 font-normal text-lg">({reviews.length})</span>}
          </h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} className={`w-4 h-4 ${s <= Math.round(reviews.reduce((a,r) => a+r.rating,0)/reviews.length) ? "fill-yellow-400 stroke-yellow-400" : "stroke-gray-300 fill-transparent"}`} />
              ))}
              <span className="text-sm text-gray-600 font-semibold ml-1">{(reviews.reduce((a,r)=>a+r.rating,0)/reviews.length).toFixed(1)} avg</span>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-[1fr_380px] gap-10">
          {/* LIST */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="py-12 text-center border border-gray-100 rounded-lg">
                <Star className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-600 font-semibold text-sm">No reviews yet. Be the first to review!</p>
              </div>
            ) : reviews.map((r) => (
              <div key={r._id} className="bg-gray-50 p-5 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-xs font-black text-white uppercase">{r.userName[0]}</div>
                    <div>
                      <p className="text-sm font-bold text-black">{r.userName}</p>
                      <p className="text-[10px] text-gray-500">{new Date(r.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map((s) => <Star key={s} className={`w-3.5 h-3.5 ${s<=r.rating?"fill-yellow-400 stroke-yellow-400":"stroke-gray-300 fill-transparent"}`} />)}
                  </div>
                </div>
                <p className="text-sm text-gray-800 leading-relaxed font-medium">{r.message}</p>
                {r.image && <img src={r.image} alt="review" className="w-24 h-24 object-cover rounded-lg" />}
              </div>
            ))}
          </div>

          {/* WRITE REVIEW */}
          <div className="bg-gray-50 p-6 rounded-lg h-fit">
            <h3 className="text-xs uppercase tracking-[0.3em] text-black font-black mb-5">Write a Review</h3>
            {!isLoggedIn ? (
              <div className="text-center py-6">
                <p className="text-sm text-gray-600 font-semibold mb-4">Sign in to leave a review</p>
                <Link to="/login" className="px-6 py-2.5 bg-black text-white text-xs font-black uppercase tracking-widest rounded hover:bg-gray-800 transition">Sign In</Link>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {reviewError && <p className="text-red-500 text-xs font-semibold">{reviewError}</p>}
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-black font-black mb-2">Rating</p>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map((s) => (
                      <button key={s} type="button" onMouseEnter={() => setHoverRating(s)} onMouseLeave={() => setHoverRating(0)} onClick={() => setReviewForm((p) => ({...p,rating:s}))} className="transition-transform hover:scale-110">
                        <Star className={`w-6 h-6 ${s<=(hoverRating||reviewForm.rating)?"fill-yellow-400 stroke-yellow-400":"stroke-gray-300 fill-transparent"}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-black font-black mb-1.5">Your Review</p>
                  <textarea rows={4} required value={reviewForm.message} onChange={(e) => setReviewForm((p) => ({...p,message:e.target.value}))}
                    placeholder="Share your experience..."
                    className="w-full border border-gray-200 text-gray-900 font-medium text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-black placeholder:text-gray-400 resize-none transition" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-black font-black mb-1.5">Photo (optional)</p>
                  {reviewPreview ? (
                    <div className="relative w-20 h-20">
                      <img src={reviewPreview} alt="preview" className="w-full h-full object-cover rounded-lg" />
                      <button type="button" onClick={() => { setReviewImage(null); setReviewPreview(""); }}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => fileRef.current?.click()}
                      className="flex items-center gap-2 border-2 border-dashed border-gray-300 hover:border-black px-4 py-3 text-xs text-gray-600 font-semibold hover:text-black transition w-full justify-center rounded-lg">
                      <Upload className="w-4 h-4" /> Upload Photo
                    </button>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" className="hidden"
                    onChange={(e) => { const file=e.target.files?.[0]; if(!file)return; setReviewImage(file); const r=new FileReader(); r.onloadend=()=>setReviewPreview(r.result); r.readAsDataURL(file); }} />
                </div>
                <button type="submit" disabled={reviewLoading}
                  className="w-full py-3 bg-black text-white font-black text-xs uppercase tracking-widest rounded hover:bg-gray-800 transition disabled:opacity-40">
                  {reviewLoading ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
