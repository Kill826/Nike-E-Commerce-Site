import { useState, useEffect } from "react";
import { useCart } from "../CartContext";
import { useAuth } from "../AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { CreditCard, Truck } from "lucide-react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const STRIPE_APPEARANCE = {
  theme: "flat",
  variables: {
    colorPrimary: "#000000",
    colorBackground: "#f9fafb",
    colorText: "#111827",
    colorDanger: "#ef4444",
    fontFamily: "inherit",
    borderRadius: "6px",
    spacingUnit: "4px",
  },
  rules: {
    ".Input": { border: "1px solid #e5e7eb", padding: "12px 16px", backgroundColor: "#f9fafb" },
    ".Input:focus": { border: "1px solid #111827", boxShadow: "none" },
    ".Label": { fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#9ca3af", fontWeight: "600" },
  },
};

// ── Stripe payment form ───────────────────────────────────────────
const OnlinePaymentForm = ({ total, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [stripeError, setStripeError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setStripeError("");

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin + "/order-success" },
      redirect: "if_required",
    });

    if (error) {
      setStripeError(error.message);
      setLoading(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PaymentElement />
      {stripeError && (
        <p className="text-red-500 text-xs uppercase tracking-wider">{stripeError}</p>
      )}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-4 bg-black text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-red-500 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? "Processing..." : `Pay ₹${total.toLocaleString()}`}
      </button>
      <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest">
        Secured by Stripe · SSL Encrypted
      </p>
    </form>
  );
};

// ── Delivery fields ───────────────────────────────────────────────
const FIELDS = [
  { name: "name",    placeholder: "Full Name" },
  { name: "address", placeholder: "Address" },
  { name: "city",    placeholder: "City" },
  { name: "pincode", placeholder: "Pincode (6 digits)" },
  { name: "phone",   placeholder: "Phone Number (10 digits)" },
];

// ── Main Checkout ─────────────────────────────────────────────────
const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const total = cart.reduce((acc, item) => acc + item.price, 0);

  // steps: "delivery" → "method" → "payment"
  const [step, setStep] = useState("delivery");
  const [paymentMethod, setPaymentMethod] = useState(null); // "online" | "cod"

  const [form, setForm] = useState({
    name:    user?.name    || "",
    address: user?.address || "",
    city:    user?.city    || "",
    pincode: user?.pincode || "",
    phone:   user?.phone   || "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [clientSecret, setClientSecret] = useState("");
  const [fetchError, setFetchError] = useState("");
  const [codLoading, setCodLoading] = useState(false);

  // Fetch Stripe payment intent only when method = online and step = payment
  useEffect(() => {
    if (step !== "payment" || paymentMethod !== "online" || clientSecret) return;

    fetch("http://localhost:4000/api/payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: total * 100 }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setClientSecret(data.clientSecret);
      })
      .catch((err) => setFetchError(err.message));
  }, [step, paymentMethod]);

  const validateDelivery = () => {
    const errs = {};
    if (!form.name.trim())                  errs.name    = true;
    if (!form.address.trim())               errs.address = true;
    if (!form.city.trim())                  errs.city    = true;
    if (!/^\d{6}$/.test(form.pincode))      errs.pincode = true;
    if (!/^\d{10}$/.test(form.phone))       errs.phone   = true;
    return errs;
  };

  const handleDeliveryContinue = (e) => {
    e.preventDefault();
    const errs = validateDelivery();
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }
    setStep("method");
  };

  const handleMethodSelect = (method) => {
    setPaymentMethod(method);
    setStep("payment");
  };

  // Called after successful Stripe payment
  const handleOnlineSuccess = async () => {
    await saveOrder("online", clientSecret.split("_secret_")[0]);
  };

  // Called when user confirms COD
  const handleCodConfirm = async () => {
    setCodLoading(true);
    await saveOrder("cod", "COD");
    setCodLoading(false);
  };

  const saveOrder = async (method, intentId) => {
    try {
      await fetch("http://localhost:4000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((i) => ({
            productId: i._id || i.id,
            name: i.name,
            price: i.price,
            size: i.size,
            image: i.image,
          })),
          total,
          delivery: form,
          paymentIntentId: intentId,
          paymentMethod: method,
          userId: user?.id || null,
        }),
      });
    } catch (e) {
      console.error("Order save failed", e);
    }
    clearCart();
    navigate("/order-success");
  };

  // Breadcrumb label
  const stepLabel = { delivery: "Delivery Details", method: "Payment Method", payment: paymentMethod === "cod" ? "Cash on Delivery" : "Payment" };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen text-black flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-black uppercase">Your Bag is Empty</h1>
        <Link to="/products">
          <button className="mt-4 px-8 py-3 bg-black text-white font-bold text-sm uppercase tracking-wider hover:bg-gray-800 transition">
            Shop Now
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-black">
      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* BREADCRUMB */}
        <div className="mb-10">
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.4em] mb-1 flex items-center flex-wrap gap-1">
            <Link to="/cart" className="hover:text-black transition">Bag</Link>
            <span>/</span>
            <span className={step === "delivery" ? "text-black font-semibold" : ""}>Delivery</span>
            <span>/</span>
            <span className={step === "method" ? "text-black font-semibold" : ""}>Payment Method</span>
            <span>/</span>
            <span className={step === "payment" ? "text-black font-semibold" : ""}>
              {paymentMethod === "cod" ? "Confirm" : "Payment"}
            </span>
          </p>
          <h1 className="text-4xl font-black uppercase tracking-tight text-gray-900">
            {stepLabel[step]}
          </h1>
        </div>

        <div className="grid md:grid-cols-[1fr_380px] gap-10">

          {/* LEFT */}
          <div>

            {/* ── STEP 1: DELIVERY ── */}
            {step === "delivery" && (
              <form onSubmit={handleDeliveryContinue} className="space-y-4" noValidate>
                {FIELDS.map(({ name, placeholder }) => (
                  <div key={name}>
                    <input
                      type="text"
                      placeholder={placeholder}
                      value={form[name]}
                      onChange={(e) => {
                        setForm((prev) => ({ ...prev, [name]: e.target.value }));
                        setFormErrors((prev) => ({ ...prev, [name]: false }));
                      }}
                      className={`w-full bg-gray-50 border text-gray-900 placeholder-gray-300 px-4 py-3 text-sm focus:outline-none transition rounded-md ${
                        formErrors[name] ? "border-red-500" : "border-gray-200 focus:border-black"
                      }`}
                    />
                    {formErrors[name] && (
                      <p className="text-red-500 text-xs mt-1 uppercase tracking-wider">
                        {name === "pincode" ? "Enter a valid 6-digit pincode"
                          : name === "phone" ? "Enter a valid 10-digit phone number"
                          : "This field is required"}
                      </p>
                    )}
                  </div>
                ))}
                <button
                  type="submit"
                  className="w-full py-4 bg-black text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-red-500 transition-colors duration-200 rounded-md mt-2"
                >
                  Continue to Payment Method
                </button>
              </form>
            )}

            {/* ── STEP 2: PAYMENT METHOD ── */}
            {step === "method" && (
              <div className="space-y-4">
                <button
                  onClick={() => setStep("delivery")}
                  className="text-xs text-gray-400 hover:text-black uppercase tracking-widest transition mb-2 flex items-center gap-2"
                >
                  ← Edit Delivery
                </button>

                {/* Delivery summary */}
                <div className="bg-gray-50 border border-gray-100 rounded-md px-5 py-4 text-sm text-gray-500 space-y-0.5 mb-6">
                  <p className="text-gray-900 font-semibold">{form.name}</p>
                  <p>{form.address}, {form.city} — {form.pincode}</p>
                  <p>{form.phone}</p>
                </div>

                <p className="text-xs text-gray-400 uppercase tracking-[0.3em] mb-4">Choose Payment Method</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Online Payment */}
                  <button
                    onClick={() => handleMethodSelect("online")}
                    className="group flex flex-col items-start gap-3 p-6 border-2 border-gray-200 rounded-xl hover:border-black transition-all duration-200 text-left"
                  >
                    <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center group-hover:bg-red-500 transition-colors">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-black text-sm uppercase tracking-wide">Online Payment</p>
                      <p className="text-xs text-gray-400 mt-1">Credit / Debit card, UPI, Net Banking via Stripe</p>
                    </div>
                    <span className="text-[10px] bg-green-50 text-green-600 border border-green-200 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                      Secure & Instant
                    </span>
                  </button>

                  {/* Cash on Delivery */}
                  <button
                    onClick={() => handleMethodSelect("cod")}
                    className="group flex flex-col items-start gap-3 p-6 border-2 border-gray-200 rounded-xl hover:border-black transition-all duration-200 text-left"
                  >
                    <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center group-hover:bg-red-500 transition-colors">
                      <Truck className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-black text-sm uppercase tracking-wide">Cash on Delivery</p>
                      <p className="text-xs text-gray-400 mt-1">Pay in cash when your order arrives at your door</p>
                    </div>
                    <span className="text-[10px] bg-orange-50 text-orange-600 border border-orange-200 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                      Pay on Arrival
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3a: ONLINE PAYMENT ── */}
            {step === "payment" && paymentMethod === "online" && (
              <div>
                <button
                  onClick={() => setStep("method")}
                  className="text-xs text-gray-400 hover:text-black uppercase tracking-widest transition mb-6 flex items-center gap-2"
                >
                  ← Change Payment Method
                </button>

                {/* Delivery summary */}
                <div className="bg-gray-50 border border-gray-100 rounded-md px-5 py-4 mb-6 text-sm text-gray-500 space-y-0.5">
                  <p className="text-gray-900 font-semibold">{form.name}</p>
                  <p>{form.address}, {form.city} — {form.pincode}</p>
                  <p>{form.phone}</p>
                </div>

                {/* Method badge */}
                <div className="flex items-center gap-2 mb-6">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500 uppercase tracking-widest">Online Payment via Stripe</span>
                </div>

                {fetchError && (
                  <div className="bg-red-50 border border-red-200 text-red-500 text-xs px-4 py-3 mb-4 rounded-md uppercase tracking-wider">
                    {fetchError} — Make sure the backend server is running on port 4000.
                  </div>
                )}

                {clientSecret ? (
                  <Elements stripe={stripePromise} options={{ clientSecret, appearance: STRIPE_APPEARANCE }}>
                    <OnlinePaymentForm total={total} onSuccess={handleOnlineSuccess} />
                  </Elements>
                ) : !fetchError ? (
                  <div className="flex items-center gap-3 text-gray-400 text-sm">
                    <div className="w-4 h-4 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
                    Preparing payment...
                  </div>
                ) : null}
              </div>
            )}

            {/* ── STEP 3b: CASH ON DELIVERY ── */}
            {step === "payment" && paymentMethod === "cod" && (
              <div className="space-y-6">
                <button
                  onClick={() => setStep("method")}
                  className="text-xs text-gray-400 hover:text-black uppercase tracking-widest transition flex items-center gap-2"
                >
                  ← Change Payment Method
                </button>

                {/* Delivery summary */}
                <div className="bg-gray-50 border border-gray-100 rounded-md px-5 py-4 text-sm text-gray-500 space-y-0.5">
                  <p className="text-gray-900 font-semibold">{form.name}</p>
                  <p>{form.address}, {form.city} — {form.pincode}</p>
                  <p>{form.phone}</p>
                </div>

                {/* COD info card */}
                <div className="border-2 border-dashed border-orange-200 bg-orange-50 rounded-xl p-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center shrink-0">
                      <Truck className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-black text-sm uppercase tracking-wide text-orange-900">Cash on Delivery</p>
                      <p className="text-xs text-orange-600">Pay when your order arrives</p>
                    </div>
                  </div>
                  <ul className="text-xs text-orange-700 space-y-1.5 pl-1">
                    <li className="flex items-start gap-2"><span className="mt-0.5">•</span> Keep exact change of <strong>₹{total.toLocaleString()}</strong> ready</li>
                    <li className="flex items-start gap-2"><span className="mt-0.5">•</span> Pay the delivery agent upon receiving your order</li>
                    <li className="flex items-start gap-2"><span className="mt-0.5">•</span> Estimated delivery in 2–4 business days</li>
                  </ul>
                </div>

                {/* Amount summary */}
                <div className="bg-gray-50 border border-gray-100 rounded-md px-5 py-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500 uppercase tracking-widest">Amount to Pay</span>
                  <span className="text-xl font-black">₹{total.toLocaleString()}</span>
                </div>

                <button
                  onClick={handleCodConfirm}
                  disabled={codLoading}
                  className="w-full py-4 bg-black text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-orange-500 transition-colors duration-200 rounded-md disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {codLoading ? "Placing Order..." : "Confirm Order · Cash on Delivery"}
                </button>

                <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest">
                  No payment required now · Pay on delivery
                </p>
              </div>
            )}

          </div>

          {/* RIGHT — ORDER SUMMARY */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 h-fit">
            <h2 className="text-[10px] uppercase tracking-[0.4em] text-gray-400 mb-6">Order Summary</h2>
            <div className="space-y-3 mb-6">
              {cart.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-14 h-14 bg-gray-100 rounded-md shrink-0 overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{item.name}</p>
                    {item.size && <p className="text-xs text-gray-400">Size: {item.size}</p>}
                    <p className="text-sm font-bold mt-0.5">₹{item.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Delivery</span>
                <span className="text-green-500 font-medium">Free</span>
              </div>
              {paymentMethod && (
                <div className="flex justify-between text-gray-400">
                  <span>Payment</span>
                  <span className={paymentMethod === "cod" ? "text-orange-500 font-medium" : "text-blue-500 font-medium"}>
                    {paymentMethod === "cod" ? "Cash on Delivery" : "Online"}
                  </span>
                </div>
              )}
              <div className="flex justify-between font-black text-base pt-2 border-t border-gray-100">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
