import { useCart } from "../CartContext";
import { useNavigate, Link } from "react-router-dom";

const Cart = () => {
  const { cart, removeFromCart } = useCart();
  const navigate = useNavigate();
  const total = cart.reduce((acc, item) => acc + item.price, 0);

  if (cart.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm text-black min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-black uppercase">Your Bag is Empty</h1>
        <p className="text-gray-400">Looks like you haven't added anything yet.</p>
        <Link to="/products">
          <button className="mt-4 px-8 py-3 bg-black text-white font-bold text-sm uppercase tracking-wider hover:bg-gray-800 transition rounded">
            Shop Now
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-black">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">

        {/* ITEMS */}
        <div className="md:col-span-2 space-y-4">
          <h1 className="text-3xl font-black uppercase mb-6">Your Bag</h1>
          {cart.map((item, index) => (
            <div key={index} className="flex gap-5 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <img src={item.image} alt={item.name} className="w-28 h-28 object-cover bg-gray-100 rounded" />
              <div className="flex-1">
                <p className="text-gray-400 text-xs uppercase tracking-wider">{item.category}</p>
                <h2 className="font-bold mt-0.5 text-gray-900">{item.name}</h2>
                {item.size && <p className="text-xs text-gray-400 mt-0.5">Size: {item.size}</p>}
                <p className="font-bold mt-2 text-gray-900">&#8377;{item.price.toLocaleString()}</p>
              </div>
              <button onClick={() => removeFromCart(index)}
                className="text-gray-400 hover:text-red-500 text-xs uppercase tracking-wider self-start mt-1 transition">
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* SUMMARY */}
        <div className="bg-gray-50 border border-gray-100 p-6 h-fit rounded-lg">
          <h2 className="text-xl font-black uppercase mb-6 text-gray-900">Summary</h2>
          <div className="flex justify-between text-sm mb-3 text-gray-500">
            <span>Subtotal ({cart.length} items)</span>
            <span>&#8377;{total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm mb-6 text-gray-500">
            <span>Delivery</span>
            <span className="text-green-600 font-semibold">Free</span>
          </div>
          <div className="border-t border-gray-200 pt-4 flex justify-between font-bold mb-6 text-gray-900">
            <span>Total</span>
            <span>&#8377;{total.toLocaleString()}</span>
          </div>
          <button onClick={() => navigate("/checkout")}
            className="w-full py-4 bg-black text-white font-bold text-sm uppercase tracking-wider hover:bg-gray-800 transition rounded">
            Checkout
          </button>
        </div>

      </div>
    </div>
  );
};

export default Cart;
