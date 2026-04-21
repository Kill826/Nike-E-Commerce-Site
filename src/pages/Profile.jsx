import { useState, useRef } from "react";
import { useAuth } from "../AuthContext";
import { Camera, Save, CheckCircle } from "lucide-react";

const inputCls = "w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm px-4 py-3 focus:outline-none focus:border-black placeholder:text-gray-400 transition rounded";
const labelCls = "text-[11px] uppercase tracking-widest text-gray-400 font-semibold block mb-1.5";

const Profile = () => {
  const { user, login } = useAuth();
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    name:    user?.name    || "",
    phone:   user?.phone   || "",
    address: user?.address || "",
    city:    user?.city    || "",
    pincode: user?.pincode || "",
  });
  const [avatar, setAvatar]         = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
  const [saving, setSaving]         = useState(false);
  const [success, setSuccess]       = useState(false);
  const [error, setError]           = useState("");

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatar(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError("");
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (avatar) fd.append("avatar", avatar);
    try {
      const token = localStorage.getItem("jordan_token");
      const res = await fetch("http://localhost:4000/api/auth/profile", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      login(data.user, token);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen text-black dark:text-white">
      <div className="max-w-2xl mx-auto px-5 py-10">

        <div className="mb-8">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Account</p>
          <h1 className="text-3xl font-black uppercase tracking-tight">My Profile</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* AVATAR */}
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden border-2 border-gray-200">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-black text-gray-400 uppercase">
                    {user?.name?.[0]}
                  </div>
                )}
              </div>
              <button type="button" onClick={() => fileRef.current?.click()}
                className="absolute bottom-0 right-0 w-6 h-6 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition">
                <Camera className="w-3 h-3 text-white" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>
            <div>
              <p className="font-bold text-gray-900">{user?.name}</p>
              <p className="text-sm text-gray-400">{user?.email}</p>
              <button type="button" onClick={() => fileRef.current?.click()}
                className="text-xs text-gray-500 underline underline-offset-2 hover:text-black transition mt-1">
                Change photo
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && (
            <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
              <CheckCircle className="w-4 h-4" /> Profile saved successfully
            </div>
          )}

          {/* PERSONAL INFO */}
          <div className="border border-gray-100 rounded-lg p-5 space-y-4">
            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Personal Info</p>
            <div>
              <label className={labelCls}>Full Name</label>
              <input value={form.name} onChange={(e) => set("name", e.target.value)}
                placeholder="Your full name" className={inputCls} required />
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input value={user?.email} disabled
                className={`${inputCls} opacity-50 cursor-not-allowed`} />
              <p className="text-[10px] text-gray-400 mt-1">Email cannot be changed</p>
            </div>
            <div>
              <label className={labelCls}>Phone Number</label>
              <input value={form.phone} onChange={(e) => set("phone", e.target.value)}
                placeholder="10-digit phone number" className={inputCls} />
            </div>
          </div>

          {/* DELIVERY ADDRESS */}
          <div className="border border-gray-100 rounded-lg p-5 space-y-4">
            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Default Delivery Address</p>
            <p className="text-xs text-gray-400">This will be auto-filled at checkout. You can still change it before ordering.</p>
            <div>
              <label className={labelCls}>Address</label>
              <input value={form.address} onChange={(e) => set("address", e.target.value)}
                placeholder="Street address" className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>City</label>
                <input value={form.city} onChange={(e) => set("city", e.target.value)}
                  placeholder="City" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Pincode</label>
                <input value={form.pincode} onChange={(e) => set("pincode", e.target.value)}
                  placeholder="6-digit pincode" className={inputCls} />
              </div>
            </div>
          </div>

          <button type="submit" disabled={saving}
            className="w-full py-4 bg-black text-white font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition disabled:opacity-40 flex items-center justify-center gap-2">
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
