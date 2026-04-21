import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const [form, setForm]     = useState({ email: "", password: "" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res  = await fetch("http://localhost:4000/api/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); setLoading(false); return; }
      login(data.user, data.token);
      navigate(from, { replace: true });
    } catch {
      setError("Server error. Make sure the backend is running.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT — branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-black flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="absolute text-white font-black text-[120px] leading-none select-none"
              style={{ top: `${i * 14}%`, left: `${(i % 2) * 30 - 10}%`, transform: `rotate(-15deg)` }}>
              JORDAN
            </div>
          ))}
        </div>

        <Link to="/" className="text-white font-black text-2xl tracking-widest relative z-10">✦ JORDAN</Link>

        <div className="relative z-10">
          <h2 className="text-white text-5xl font-black uppercase leading-tight mb-4">
            Welcome<br />Back.
          </h2>
          <p className="text-white/40 text-sm leading-relaxed max-w-xs">
            Sign in to track your orders, manage your wishlist, and enjoy a personalized shopping experience.
          </p>
        </div>

        <p className="text-white/20 text-xs relative z-10">© 2026 Jordan Brand</p>
      </div>

      {/* RIGHT — form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <Link to="/" className="lg:hidden block text-black font-black text-xl tracking-widest mb-10">✦ JORDAN</Link>

          <div className="mb-8">
            <h1 className="text-3xl font-black uppercase tracking-tight text-gray-900">Sign In</h1>
            <p className="text-gray-400 text-sm mt-1">New here?{" "}
              <Link to="/signup" className="text-black font-semibold hover:text-red-500 transition underline underline-offset-4">Create Account</Link>
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 mb-6 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold block mb-2">Email</label>
              <input type="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full border border-gray-200 text-gray-900 text-sm px-4 py-3.5 rounded-lg focus:outline-none focus:border-black placeholder:text-gray-300 transition" />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold block mb-2">Password</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} required value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 text-gray-900 text-sm px-4 py-3.5 pr-12 rounded-lg focus:outline-none focus:border-black placeholder:text-gray-300 transition" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-4 bg-black text-white font-black text-xs uppercase tracking-widest rounded-lg hover:bg-gray-900 transition flex items-center justify-center gap-2 disabled:opacity-40 mt-2">
              {loading ? "Signing in..." : <>Sign In <ArrowRight className="w-4 h-4" /></>}
            </button>

          </form>

          <p className="text-center text-xs text-gray-300 mt-8">
            Secure login · Your data is protected
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
