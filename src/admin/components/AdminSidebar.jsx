import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard, PackagePlus, Package,
  Tag, Layers, ShoppingBag, ExternalLink, X, Home
} from "lucide-react";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/orders", label: "Orders", icon: ShoppingBag },
  { to: "/add", label: "Add Product", icon: PackagePlus },
  { to: "/products", label: "Manage Products", icon: Package },
  { to: "/homepage", label: "Edit Home Page", icon: Home },
  { to: "/categories", label: "Categories", icon: Tag },
  { to: "/seasons", label: "Seasons", icon: Layers },
];

const AdminSidebar = ({ onClose }) => {
  return (
    <aside className="w-64 bg-[#0d0d0d] border-r border-white/5 min-h-screen flex flex-col shrink-0">

      {/* LOGO */}
      <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
        <Link to="/" className="font-black text-white tracking-widest text-sm">✦ JORDAN</Link>
        <span className="text-[10px] text-white/20 uppercase tracking-widest">Admin</span>
        {onClose && (
          <button onClick={onClose} className="text-white/30 hover:text-white md:hidden">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* NAV */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-150 rounded-none ${
                isActive
                  ? "bg-white text-black"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* FOOTER */}
      <div className="px-6 py-5 border-t border-white/5">
        <Link
          to="/"
          target="_blank"
          className="flex items-center gap-2 text-xs text-white/20 hover:text-white transition"
        >
          <ExternalLink className="w-3 h-3" />
          View Store
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
