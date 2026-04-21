import { useEffect, useState } from "react";
import {
  ShoppingBag, ChevronDown, RotateCcw, CheckCircle,
  XCircle, AlertTriangle, Package, Truck, Clock,
} from "lucide-react";

// ── Config ────────────────────────────────────────────────────────
const ORDER_STATUSES = ["confirmed", "processing", "shipped", "delivered", "cancelled"];

const STATUS_CFG = {
  confirmed:        { label: "Confirmed",        color: "text-blue-400",   border: "border-blue-400/40",   bg: "bg-blue-400/10",   dot: "bg-blue-400"   },
  processing:       { label: "Processing",        color: "text-yellow-400", border: "border-yellow-400/40", bg: "bg-yellow-400/10", dot: "bg-yellow-400" },
  shipped:          { label: "Shipped",           color: "text-purple-400", border: "border-purple-400/40", bg: "bg-purple-400/10", dot: "bg-purple-400" },
  delivered:        { label: "Delivered",         color: "text-green-400",  border: "border-green-400/40",  bg: "bg-green-400/10",  dot: "bg-green-400"  },
  cancelled:        { label: "Cancelled",         color: "text-red-400",    border: "border-red-400/40",    bg: "bg-red-400/10",    dot: "bg-red-400"    },
  return_requested: { label: "Return Requested",  color: "text-orange-400", border: "border-orange-400/40", bg: "bg-orange-400/10", dot: "bg-orange-400" },
  returned:         { label: "Returned",          color: "text-gray-400",   border: "border-gray-400/40",   bg: "bg-gray-400/10",   dot: "bg-gray-400"   },
};

const StatusPill = ({ status }) => {
  const c = STATUS_CFG[status] || STATUS_CFG.confirmed;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest ${c.color} ${c.border} ${c.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
};

// ── Return Request Card (shown in Returns tab) ────────────────────
const ReturnCard = ({ order, isUpdating, onApprove, onReject, expanded, onToggle }) => {
  const oid = order._id;
  const req = order.returnRequest;

  return (
    <div className="rounded-xl overflow-hidden border-2 border-orange-400/40 bg-[#1a1a1a]">
      {/* TOP ALERT BAR */}
      <div className="bg-orange-400/15 border-b border-orange-400/20 px-5 py-2.5 flex items-center gap-2">
        <AlertTriangle className="w-3.5 h-3.5 text-orange-400 shrink-0" />
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-orange-400">
          Return Requested · Action Required
        </p>
        <span className="ml-auto text-[10px] text-orange-400/60">
          {req?.requestedAt
            ? new Date(req.requestedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
            : ""}
        </span>
      </div>

      {/* MAIN ROW */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition text-left"
      >
        <div className="w-10 h-10 bg-orange-400/10 rounded-lg flex items-center justify-center shrink-0">
          <RotateCcw className="w-4 h-4 text-orange-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold">{order.delivery?.name}</p>
          <p className="text-xs text-white/40">
            {order.delivery?.city} · Order #{oid.slice(-8).toUpperCase()}
          </p>
        </div>
        <div className="text-right shrink-0 mr-3">
          <p className="text-sm font-black">₹{order.total?.toLocaleString()}</p>
          <p className="text-xs text-white/30">{order.items?.length} item{order.items?.length !== 1 ? "s" : ""}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-white/30 transition-transform shrink-0 ${expanded ? "rotate-180" : ""}`} />
      </button>

      {/* REASON STRIP — always visible */}
      <div className="px-5 pb-4 flex items-start gap-2">
        <span className="text-[10px] text-white/30 uppercase tracking-widest shrink-0 mt-0.5">Reason:</span>
        <span className="text-xs text-white/70 font-medium">{req?.reason || "—"}</span>
      </div>

      {/* APPROVE / REJECT BUTTONS — always visible */}
      <div className="px-5 pb-4 flex gap-2">
        <button
          onClick={() => onApprove(oid)}
          disabled={isUpdating}
          className="flex-1 py-2.5 bg-green-500 hover:bg-green-400 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition disabled:opacity-30 flex items-center justify-center gap-1.5"
        >
          <CheckCircle className="w-3.5 h-3.5" />
          {isUpdating ? "Updating..." : "Approve Return"}
        </button>
        <button
          onClick={() => onReject(oid)}
          disabled={isUpdating}
          className="flex-1 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-400/30 text-[10px] font-black uppercase tracking-widest rounded-lg transition disabled:opacity-30 flex items-center justify-center gap-1.5"
        >
          <XCircle className="w-3.5 h-3.5" />
          {isUpdating ? "Updating..." : "Reject Return"}
        </button>
      </div>

      {/* EXPANDED DETAILS */}
      {expanded && (
        <div className="border-t border-white/5 px-5 py-4 space-y-4">
          {/* Items */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/20 mb-3">Items</p>
            <div className="space-y-2">
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-[#111] rounded-md shrink-0 overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{item.name}</p>
                    {item.size && <p className="text-xs text-white/30">Size: {item.size}</p>}
                  </div>
                  <p className="text-sm font-bold shrink-0">₹{item.price?.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Delivery */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/20 mb-1">Delivery Address</p>
            <p className="text-sm text-white/60">{order.delivery?.address}, {order.delivery?.city} — {order.delivery?.pincode}</p>
            <p className="text-sm text-white/60">{order.delivery?.phone}</p>
          </div>
          <p className="text-[10px] text-white/20 font-mono">Order ID: {oid}</p>
        </div>
      )}
    </div>
  );
};

// ── Regular Order Row ─────────────────────────────────────────────
const OrderRow = ({ order, isUpdating, onStatusChange, expanded, onToggle }) => {
  const oid = order._id || order.id;

  return (
    <div className="bg-[#1a1a1a] rounded-xl border border-white/5 overflow-hidden">
      {/* MAIN ROW */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition text-left"
      >
        <ShoppingBag className="w-4 h-4 text-white/20 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">{order.delivery?.name}</p>
          <p className="text-xs text-white/30">
            {order.delivery?.city} ·{" "}
            {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        </div>
        <div className="text-right shrink-0 mr-3">
          <p className="text-sm font-bold">₹{order.total?.toLocaleString()}</p>
          <p className="text-xs text-white/30">{order.items?.length} item{order.items?.length !== 1 ? "s" : ""}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-white/20 transition-transform shrink-0 ${expanded ? "rotate-180" : ""}`} />
      </button>

      {/* STATUS + CHANGE BUTTONS */}
      <div className="px-5 pb-4 flex items-center gap-2 flex-wrap">
        <StatusPill status={order.status} />
        <div className="flex items-center gap-1.5 flex-wrap">
          {ORDER_STATUSES.filter((s) => s !== order.status).map((s) => {
            const c = STATUS_CFG[s];
            return (
              <button
                key={s}
                onClick={() => onStatusChange(oid, s)}
                disabled={isUpdating}
                className={`px-2.5 py-1 text-[9px] uppercase tracking-widest font-bold border rounded-full transition disabled:opacity-30 ${c.color} border-current hover:bg-white/5`}
              >
                {isUpdating ? "..." : `→ ${c.label}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* EXPANDED */}
      {expanded && (
        <div className="border-t border-white/5 px-5 py-4 space-y-4">
          <p className="text-[10px] text-white/20 font-mono">Order ID: {oid}</p>

          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/20 mb-1">Delivering To</p>
            <p className="text-sm font-semibold">{order.delivery?.name}</p>
            <p className="text-sm text-white/50">{order.delivery?.address}, {order.delivery?.city} — {order.delivery?.pincode}</p>
            <p className="text-sm text-white/50">{order.delivery?.phone}</p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/20 mb-3">Items ({order.items?.length})</p>
            <div className="space-y-2">
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-[#111] rounded-md shrink-0 overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{item.name}</p>
                    {item.size && <p className="text-xs text-white/30">Size: {item.size}</p>}
                  </div>
                  <p className="text-sm font-bold shrink-0">₹{item.price?.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-white/5 pt-3">
            <p className="text-xs text-white/30 uppercase tracking-widest">Total</p>
            <p className="text-base font-black">₹{order.total?.toLocaleString()}</p>
          </div>

          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-[10px] font-bold uppercase tracking-widest ${
            order.paymentMethod === "cod"
              ? "bg-orange-400/10 text-orange-400 border-orange-400/30"
              : "bg-blue-400/10 text-blue-400 border-blue-400/30"
          }`}>
            {order.paymentMethod === "cod" ? "💵 Cash on Delivery" : "💳 Online Payment"}
          </span>
        </div>
      )}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────
const Orders = () => {
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [tab, setTab]           = useState("orders"); // "orders" | "returns"
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetch("http://localhost:4000/api/orders")
      .then((r) => r.json())
      .then((data) => { setOrders(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      const res = await fetch(`http://localhost:4000/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed");
      const updated = await res.json();
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status: updated.status } : o)));
    } catch (e) { console.error(e); }
    finally { setUpdating(null); }
  };

  const reviewReturn = async (orderId, approved) => {
    setUpdating(orderId);
    try {
      const res = await fetch(`http://localhost:4000/api/orders/${orderId}/return/review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved }),
      });
      if (!res.ok) throw new Error("Failed");
      const updated = await res.json();
      setOrders((prev) => prev.map((o) => (o._id === orderId ? updated : o)));
    } catch (e) { console.error(e); }
    finally { setUpdating(null); }
  };

  // Derived lists
  const returnOrders   = orders.filter((o) => o.status === "return_requested");
  const regularOrders  = orders.filter((o) => o.status !== "return_requested" && o.status !== "returned");
  const returnedOrders = orders.filter((o) => o.status === "returned");

  const counts = ORDER_STATUSES.reduce((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length;
    return acc;
  }, {});

  const filteredRegular = filterStatus === "all"
    ? regularOrders
    : regularOrders.filter((o) => o.status === filterStatus);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[10px] text-white/20 uppercase tracking-[0.4em] mb-1">Admin</p>
          <h2 className="text-3xl font-black uppercase tracking-tight">Orders</h2>
        </div>
        {/* Return requests alert badge */}
        {returnOrders.length > 0 && (
          <button
            onClick={() => setTab("returns")}
            className="flex items-center gap-2.5 bg-orange-400/10 border border-orange-400/40 rounded-xl px-4 py-2.5 hover:bg-orange-400/20 transition"
          >
            <div className="relative">
              <RotateCcw className="w-4 h-4 text-orange-400" />
              <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-orange-400 rounded-full text-[8px] font-black text-black flex items-center justify-center">
                {returnOrders.length}
              </span>
            </div>
            <span className="text-xs font-black text-orange-400 uppercase tracking-widest">
              {returnOrders.length} Return{returnOrders.length !== 1 ? "s" : ""} Pending
            </span>
          </button>
        )}
      </div>

      {/* MAIN TABS */}
      <div className="flex gap-1 bg-[#111] p-1 rounded-xl w-fit">
        <button
          onClick={() => setTab("orders")}
          className={`px-5 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition ${
            tab === "orders" ? "bg-white text-black" : "text-white/40 hover:text-white/70"
          }`}
        >
          Orders ({regularOrders.length})
        </button>
        <button
          onClick={() => setTab("returns")}
          className={`px-5 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition flex items-center gap-2 ${
            tab === "returns"
              ? "bg-orange-400 text-black"
              : "text-orange-400/70 hover:text-orange-400"
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Returns
          {returnOrders.length > 0 && (
            <span className={`w-5 h-5 rounded-full text-[9px] font-black flex items-center justify-center ${
              tab === "returns" ? "bg-black text-orange-400" : "bg-orange-400 text-black"
            }`}>
              {returnOrders.length}
            </span>
          )}
        </button>
      </div>

      {/* ── ORDERS TAB ── */}
      {tab === "orders" && (
        <div className="space-y-5">
          {/* Stat cards */}
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
            <button
              onClick={() => setFilterStatus("all")}
              className={`p-4 rounded-xl border transition flex flex-col gap-1 ${
                filterStatus === "all" ? "bg-white text-black border-white" : "bg-[#1a1a1a] border-white/5 hover:border-white/20"
              }`}
            >
              <p className="text-[9px] uppercase tracking-widest opacity-50">All</p>
              <p className="text-3xl font-black">{regularOrders.length}</p>
            </button>
            {ORDER_STATUSES.map((s) => {
              const c = STATUS_CFG[s];
              const active = filterStatus === s;
              return (
                <button key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`p-4 rounded-xl border transition flex flex-col gap-1 ${
                    active ? `bg-[#1a1a1a] ${c.border}` : "bg-[#1a1a1a] border-white/5 hover:border-white/20"
                  }`}
                >
                  <p className={`text-[9px] uppercase tracking-widest ${c.color}`}>{c.label}</p>
                  <p className="text-3xl font-black">{counts[s]}</p>
                </button>
              );
            })}
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap gap-2">
            {["all", ...ORDER_STATUSES].map((s) => {
              const c = s === "all" ? null : STATUS_CFG[s];
              const active = filterStatus === s;
              return (
                <button key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold border rounded-full transition ${
                    active
                      ? "bg-white text-black border-white"
                      : `bg-transparent border-white/10 hover:border-white/30 ${c ? c.color + "/60" : "text-white/40"} hover:text-white/70`
                  }`}
                >
                  {s === "all" ? "All" : STATUS_CFG[s].label}
                  {s !== "all" && ` (${counts[s]})`}
                </button>
              );
            })}
          </div>

          {/* Order list */}
          {loading ? (
            <div className="flex items-center gap-3 text-white/30 text-sm">
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              Loading orders...
            </div>
          ) : filteredRegular.length === 0 ? (
            <div className="bg-[#1a1a1a] rounded-xl px-6 py-16 text-center text-white/20 text-sm">
              No {filterStatus !== "all" ? STATUS_CFG[filterStatus]?.label.toLowerCase() : ""} orders found.
            </div>
          ) : (
            <div className="space-y-2">
              {filteredRegular.map((order) => {
                const oid = order._id || order.id;
                return (
                  <OrderRow
                    key={oid}
                    order={order}
                    isUpdating={updating === oid}
                    onStatusChange={updateStatus}
                    expanded={expanded === oid}
                    onToggle={() => setExpanded(expanded === oid ? null : oid)}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── RETURNS TAB ── */}
      {tab === "returns" && (
        <div className="space-y-6">

          {/* Pending returns */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-4 h-4 text-orange-400" />
              <h3 className="text-sm font-black uppercase tracking-widest text-orange-400">
                Pending Review ({returnOrders.length})
              </h3>
            </div>

            {returnOrders.length === 0 ? (
              <div className="bg-[#1a1a1a] rounded-xl px-6 py-12 text-center">
                <RotateCcw className="w-8 h-8 text-white/10 mx-auto mb-3" />
                <p className="text-white/20 text-sm">No pending return requests</p>
              </div>
            ) : (
              <div className="space-y-3">
                {returnOrders.map((order) => {
                  const oid = order._id;
                  return (
                    <ReturnCard
                      key={oid}
                      order={order}
                      isUpdating={updating === oid}
                      onApprove={(id) => reviewReturn(id, true)}
                      onReject={(id) => reviewReturn(id, false)}
                      expanded={expanded === oid}
                      onToggle={() => setExpanded(expanded === oid ? null : oid)}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Completed returns */}
          {returnedOrders.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-4 h-4 text-gray-400" />
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">
                  Completed Returns ({returnedOrders.length})
                </h3>
              </div>
              <div className="space-y-2">
                {returnedOrders.map((order) => {
                  const oid = order._id;
                  return (
                    <div key={oid} className="bg-[#1a1a1a] rounded-xl border border-white/5 px-5 py-4 flex items-center gap-4">
                      <div className="w-9 h-9 bg-green-400/10 rounded-lg flex items-center justify-center shrink-0">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold">{order.delivery?.name}</p>
                        <p className="text-xs text-white/30">
                          {order.delivery?.city} · #{oid.slice(-8).toUpperCase()} ·{" "}
                          Reason: {order.returnRequest?.reason || "—"}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-black">₹{order.total?.toLocaleString()}</p>
                        <p className="text-[10px] text-green-400 font-bold uppercase tracking-widest">Approved</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default Orders;
