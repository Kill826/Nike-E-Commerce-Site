import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useWishlist } from "../WishlistContext";
import ShoeCard from "../components/ShoeCard";

const Wishlist = () => {
  const { wishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen text-black flex flex-col items-center justify-center gap-5 px-6 text-center">
        <Heart className="w-12 h-12 text-gray-200" />
        <h1 className="text-4xl font-black uppercase tracking-tight">Your Wishlist is Empty</h1>
        <p className="text-gray-400 text-sm max-w-xs">Hit the heart on any product to save it here for later.</p>
        <Link to="/products">
          <button className="mt-4 px-10 py-4 bg-black text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-gray-800 transition rounded">
            Start Shopping
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-black">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.4em] mb-2">Saved Items</p>
            <h1 className="text-4xl font-black uppercase tracking-tight">
              Wishlist <span className="ml-3 text-lg text-gray-400 font-normal">({wishlist.length})</span>
            </h1>
          </div>
          <Link to="/products" className="text-xs text-gray-400 hover:text-black uppercase tracking-[0.2em] transition flex items-center gap-2">
            Continue Shopping →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlist.map((product) => <ShoeCard key={product._id || product.id} shoe={product} />)}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
