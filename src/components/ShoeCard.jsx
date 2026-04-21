import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useWishlist } from "../WishlistContext";

const TAG_COLORS = {
  "Just In":     "text-orange-500",
  "New":         "text-emerald-600",
  "Best Seller": "text-blue-600",
  "Sale":        "text-red-500",
};

const ShoeCard = ({ shoe }) => {
  const { toggleWishlist, isLiked } = useWishlist();
  const id = shoe._id || shoe.id;
  const liked = isLiked(id);

  return (
    <div className="group relative flex flex-col bg-white rounded-xl border border-gray-100 p-2 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      {/* IMAGE CONTAINER */}
      <Link to={`/product/${id}`} className="block relative overflow-hidden bg-[#f3f3f3] rounded-sm">
        <img
          src={shoe.image}
          alt={shoe.name}
          className="w-full aspect-square object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />

        {/* Subtle gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* HEART */}
        <button
          onClick={(e) => { e.preventDefault(); toggleWishlist(shoe); }}
          className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 shadow-md
            ${liked
              ? "bg-black scale-110"
              : "bg-white/90 opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-90"
            }`}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`w-4 h-4 transition-all duration-200 ${liked ? "fill-white stroke-white" : "stroke-gray-700 fill-transparent"}`}
          />
        </button>
      </Link>

      {/* INFO */}
      <Link to={`/product/${id}`} className="flex flex-col pt-3 gap-0.5 flex-1 px-1">
        {shoe.tag && (
          <p className={`text-[11px] font-bold tracking-wide uppercase ${TAG_COLORS[shoe.tag] || "text-gray-500"}`}>
            {shoe.tag}
          </p>
        )}
        <h3 className="text-[13px] font-semibold text-gray-900 leading-snug line-clamp-2">
          {shoe.name}
        </h3>
        <p className="text-[12px] text-gray-400 mt-0.5">{shoe.category}</p>
        <p className="text-[13px] font-semibold text-gray-800 mt-1.5">
          MRP : ₹{shoe.price.toLocaleString()}
        </p>
      </Link>
    </div>
  );
};

export default ShoeCard;
