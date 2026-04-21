import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { Eye, EyeOff } from "lucide-react";

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); setLoading(false); return; }
      if (data.user.role !== "admin") {
        setError("Access denied. Admin accounts only.");
        setLoading(false); return;
      }
      login(data.user, data.token);
      navigate("/", { replace: true });
    } catch {
      setError("Server error. Make sure the backend is running.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-10">
          <p className="text-white font-black text-2xl tracking-widest">✦ JORDAN</p>
          <p className="text-white/30 text-xs uppercase tracking-[0.4em] mt-2">Admin Panel</p>
        </div>

        <div className="bg-[#1a1a1a] p-8">
          <div className="flex items-center gap-2 mb-6 text-red-400 text-xs uppercase tracking-widest font-bold">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
            Admin Access Only
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-4 py-3 mb-6 uppercase tracking-wider">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-semibold block mb-1.5">Email</label>
              <input type="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="admin@example.com"
                className="w-full bg-[#111] border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-white/40 placeholder:text-white/20 transition" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-semibold block mb-1.5">Password</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} required value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-[#111] border border-white/10 text-white text-sm px-4 py-3 pr-11 focus:outline-none focus:border-white/40 placeholder:text-white/20 transition" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/60 transition">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-4 bg-white text-black font-black text-xs uppercase tracking-[0.2em] hover:bg-red-500 hover:text-white transition-colors duration-200 disabled:opacity-40 mt-2">
              {loading ? "Signing in..." : "Sign In to Admin"}
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] text-white/10 mt-6 uppercase tracking-widest">
          Jordan Store Admin · Restricted Access
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
