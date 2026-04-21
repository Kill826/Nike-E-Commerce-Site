import { Link } from "react-router-dom";

const OrderSuccess = () => (
  <div className="min-h-screen text-black flex flex-col items-center justify-center gap-6 text-center px-6">
    <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center mb-2">
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <p className="text-[10px] text-gray-400 uppercase tracking-[0.4em]">Payment Confirmed</p>
    <h1 className="text-5xl font-black uppercase tracking-tight text-gray-900">Order Placed.</h1>
    <p className="text-gray-400 max-w-sm text-sm leading-relaxed">
      Your payment was successful. We'll get your order packed and shipped soon.
    </p>
    <div className="flex gap-4 mt-4 flex-wrap justify-center">
      <Link to="/my-orders">
        <button className="px-8 py-4 bg-black text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-800 transition rounded">
          Track My Order
        </button>
      </Link>
      <Link to="/products">
        <button className="px-8 py-4 border-2 border-black text-black font-black text-xs uppercase tracking-[0.2em] hover:bg-black hover:text-white transition rounded">
          Keep Shopping
        </button>
      </Link>
    </div>
  </div>
);

export default OrderSuccess;
