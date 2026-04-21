import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { Package, Truck, CheckCircle, Clock, XCircle, RotateCcw, AlertCircle } from "lucide-react";

const STATUS_STEPS = ["confirmed", "processing", "shipped", "delivered"];

const STATUS_INFO = {
  confirmed:        { label: "Order Confirmed",   icon: Clock,        color: "text-blue-500"   },
  processing:       { label: "Processing",         icon: Package,      color: "text-yellow-500" },
  shipped:          { label: "Shipped",            icon: Truck,        color: "text-orange-500" },
  delivered:        { label: "Delivered",          icon: CheckCircle,  color: "text-green-500"  },
  cancelled:        { label: "Cancelled",          icon: XCircle,      color: "text-red-500"    },
  return_requested: { label: "Return Requested",   icon: RotateCcw,    color: "text-purple-500" },
  returned:         { label: "Returned",           icon: RotateCcw,    color: "text-gray-500"   },
};

const getEstimatedDelivery = (createdAt) => {
  const d = new Date(createdAt);
  d.setDate(d.getDate() + 5);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const getDaysLeft = (createdAt) => {
  const delivery = new Date(createdAt);
  delivery.setDate(delivery.getDate() + 5);
  const today = new Date();
  const diff = Math.ceil((delivery - today) / (1000 * 60 * 60 * 24));
  if (diff <= 0) return "Expected today or soon";
  return `${diff} day${diff !== 1 ? "s" : ""} left`;
};

// Returns days left in the 7-day return window (from updatedAt = delivery date)
const getReturnDaysLeft = (updatedAt) => {
  const windowEnd = new Date(updatedAt);
  windowEnd.setDate(windowEnd.getDate() + 7);
  const diff = Math.ceil((windowEnd - new Date()) / (1000 * 60 * 60 * 24));
  return diff;
};

// ── Return Request Modal ──────────────────────────────────────────
const ReturnModal = ({ order, onClose, onSubmit }) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const REASONS = [
    "Product doesn't fit",
    "Product looks different from photos",
    "Received wrong item",
    "Product is defective / damaged",
    "Changed my mind",
    "Other",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) { setError("Please select a reason"); return; }
    setLoading(true);
    setError("");
    try {
      await onSubmit(order._id, reason);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center">
              <RotateCcw className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h2 className="text-base font-black uppercase tracking-tight">Request Return</h2>
              <p className="text-xs text-gray-400">Order #{order._id.slice(-8).toUpperCase()}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-black transition text-xl leading-none">✕</button>
        </div>

        {/* Items preview */}
        <div className="bg-gray-50 rounded-xl p-3 mb-5 space-y-2">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-md overflow-hidden shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate">{item.name}</p>
                {item.size && <p className="text-[10px] text-gray-400">Size: {item.size}</p>}
              </div>
              <p className="text-xs font-bold shrink-0">₹{item.price.toLocaleString()}</p>
            </div>
          ))}
        </div>

        {/* Return window notice */}
        <div className="flex items-start gap-2 bg-purple-50 border border-purple-100 rounded-lg px-3 py-2.5 mb-5">
          <AlertCircle className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
          <p className="text-xs text-purple-700">
            You have <strong>{getReturnDaysLeft(order.updatedAt)} day{getReturnDaysLeft(order.updatedAt) !== 1 ? "s" : ""}</strong> left in your 7-day return window.
            Once submitted, our team will review your request within 24–48 hours.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Reason for Return</p>
            <div className="space-y-2">
              {REASONS.map((r) => (
                <label key={r} className="flex items-center gap-3 cursor-pointer group">
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition ${
                    reason === r ? "border-black" : "border-gray-300 group-hover:border-gray-500"
                  }`}>
                    {reason === r && <span className="w-2 h-2 rounded-full bg-black" />}
                  </span>
                  <span className={`text-sm transition ${reason === r ? "text-black font-semibold" : "text-gray-500"}`}>{r}</span>
                  <input type="radio" name="reason" value={r} checked={reason === r}
                    onChange={() => { setReason(r); setError(""); }} className="sr-only" />
                </label>
              ))}
            </div>
          </div>

          {error && <p className="text-red-500 text-xs uppercase tracking-wider">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 border-2 border-gray-200 text-gray-600 font-bold text-xs uppercase tracking-widest hover:border-gray-400 transition rounded-lg">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-3 bg-black text-white font-black text-xs uppercase tracking-widest hover:bg-purple-600 transition rounded-lg disabled:opacity-40">
              {loading ? "Submitting..." : "Submit Return"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────
const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returnModal, setReturnModal] = useState(null); // order object

  useEffect(() => {
    if (!user?.id) return;
    fetch(`http://localhost:4000/api/orders/my/${user.id}`)
      .then((r) => r.json())
      .then((data) => { setOrders(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user]);

  const handleReturnSubmit = async (orderId, reason) => {
    const res = await fetch(`http://localhost:4000/api/orders/${orderId}/return`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to submit return");
    // Update local state
    setOrders((prev) => prev.map((o) => (o._id === orderId ? data : o)));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-black">
      <div className="max-w-3xl mx-auto px-5 py-10">

        <div className="mb-8">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Account</p>
          <h1 className="text-3xl font-black uppercase tracking-tight">My Orders</h1>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-24">
            <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-lg font-bold text-gray-800 mb-1">No orders yet</p>
            <p className="text-sm text-gray-400 mb-6">Looks like you haven't placed any orders.</p>
            <Link to="/products">
              <button className="px-8 py-3 bg-black text-white text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition">
                Start Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const info = STATUS_INFO[order.status] || STATUS_INFO.confirmed;
              const Icon = info.icon;
              const stepIndex = STATUS_STEPS.indexOf(order.status);
              const isCancelled = order.status === "cancelled";
              const isDelivered = order.status === "delivered";
              const isReturnRequested = order.status === "return_requested";
              const isReturned = order.status === "returned";
              const returnDaysLeft = isDelivered ? getReturnDaysLeft(order.updatedAt) : 0;
              const canReturn = isDelivered && returnDaysLeft > 0;

              return (
                <div key={order._id} className="border border-gray-200 rounded-xl overflow-hidden">

                  {/* ORDER HEADER */}
                  <div className="bg-gray-50 px-5 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest">Order ID</p>
                      <p className="text-xs font-mono font-bold text-gray-700">{order._id}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest">Placed On</p>
                      <p className="text-xs font-semibold">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest">Total</p>
                      <p className="text-xs font-black">₹{order.total.toLocaleString()}</p>
                    </div>
                    <div className={`flex items-center gap-1.5 ${info.color}`}>
                      <Icon className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">{info.label}</span>
                    </div>
                  </div>

                  {/* ITEMS */}
                  <div className="px-5 py-4 space-y-3">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex gap-3 items-center">
                        <div className="w-14 h-14 bg-gray-100 shrink-0 overflow-hidden rounded-md">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{item.name}</p>
                          {item.size && <p className="text-xs text-gray-400">Size: {item.size}</p>}
                        </div>
                        <p className="text-sm font-bold shrink-0">₹{item.price.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>

                  {/* TRACKING PROGRESS */}
                  {!isCancelled && !isReturnRequested && !isReturned && (
                    <div className="px-5 pb-5">
                      <div className="flex items-center gap-0 mb-3">
                        {STATUS_STEPS.map((s, i) => (
                          <div key={s} className="flex items-center flex-1 last:flex-none">
                            <div className={`w-3 h-3 rounded-full shrink-0 border-2 transition-all ${
                              i <= stepIndex ? "bg-black border-black" : "bg-white border-gray-300"
                            }`} />
                            {i < STATUS_STEPS.length - 1 && (
                              <div className={`flex-1 h-0.5 ${i < stepIndex ? "bg-black" : "bg-gray-200"}`} />
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between text-[10px] text-gray-400 uppercase tracking-wider mb-4">
                        {STATUS_STEPS.map((s) => (
                          <span key={s} className={STATUS_STEPS.indexOf(s) <= stepIndex ? "text-black font-bold" : ""}>{s}</span>
                        ))}
                      </div>

                      {/* Delivery estimate (only if not yet delivered) */}
                      {order.status !== "delivered" && (
                        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between rounded-lg">
                          <div className="flex items-center gap-2 text-sm">
                            <Truck className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              Estimated delivery:{" "}
                              <span className="font-bold text-black">{getEstimatedDelivery(order.createdAt)}</span>
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-gray-500">{getDaysLeft(order.createdAt)}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* RETURN WINDOW BANNER — shown when delivered and window is open */}
                  {canReturn && (
                    <div className="mx-5 mb-4 flex items-center justify-between gap-3 bg-purple-50 border border-purple-100 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-2">
                        <RotateCcw className="w-4 h-4 text-purple-500 shrink-0" />
                        <p className="text-xs text-purple-700">
                          <span className="font-bold">{returnDaysLeft} day{returnDaysLeft !== 1 ? "s" : ""} left</span> to return this order
                        </p>
                      </div>
                      <button
                        onClick={() => setReturnModal(order)}
                        className="shrink-0 px-4 py-1.5 bg-purple-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-purple-700 transition"
                      >
                        Return
                      </button>
                    </div>
                  )}

                  {/* RETURN EXPIRED NOTICE */}
                  {isDelivered && !canReturn && (
                    <div className="mx-5 mb-4 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                      <XCircle className="w-4 h-4 text-gray-400 shrink-0" />
                      <p className="text-xs text-gray-400">Return window has expired (7 days from delivery)</p>
                    </div>
                  )}

                  {/* RETURN REQUESTED STATUS */}
                  {isReturnRequested && (
                    <div className="mx-5 mb-4 bg-purple-50 border border-purple-100 rounded-xl px-4 py-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <RotateCcw className="w-4 h-4 text-purple-500" />
                        <p className="text-sm font-bold text-purple-700">Return Request Submitted</p>
                      </div>
                      <p className="text-xs text-purple-600">
                        Reason: <span className="font-semibold">{order.returnRequest?.reason || "—"}</span>
                      </p>
                      <p className="text-xs text-purple-500">
                        Requested on{" "}
                        {new Date(order.returnRequest?.requestedAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                        <span className="text-[10px] text-yellow-600 font-bold uppercase tracking-widest">
                          Pending Review · 24–48 hrs
                        </span>
                      </div>
                    </div>
                  )}

                  {/* RETURNED STATUS */}
                  {isReturned && (
                    <div className="mx-5 mb-4 bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 space-y-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <p className="text-sm font-bold text-gray-700">Return Approved</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        Your return has been approved. Refund will be processed within 5–7 business days.
                      </p>
                    </div>
                  )}

                  {/* DELIVERY ADDRESS */}
                  <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Delivering To</p>
                    <p className="text-sm font-semibold">{order.delivery.name}</p>
                    <p className="text-xs text-gray-500">
                      {order.delivery.address}, {order.delivery.city} — {order.delivery.pincode}
                    </p>
                    <p className="text-xs text-gray-500">{order.delivery.phone}</p>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* RETURN MODAL */}
      {returnModal && (
        <ReturnModal
          order={returnModal}
          onClose={() => setReturnModal(null)}
          onSubmit={handleReturnSubmit}
        />
      )}
    </div>
  );
};

export default MyOrders;
