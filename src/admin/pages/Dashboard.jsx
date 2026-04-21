import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/productService";
import staticProducts from "../../data/products";
import { Package, Tag, Layers, TrendingUp, PackagePlus, ArrowRight } from "lucide-react";

const Dashboard = () => {
  const [adminProducts, setAdminProducts] = useState([]);

  useEffect(() => {
    getProducts().then(setAdminProducts);
  }, []);

  const allProducts = [...staticProducts, ...adminProducts];

  const totalProducts = allProducts.length;
  const shoes = allProducts.filter((p) => p.type === "shoes").length;
  const clothing = allProducts.filter((p) => p.type === "clothing").length;
  const accessories = allProducts.filter((p) => p.type === "accessories").length;

  const byGender = {
    Men: allProducts.filter((p) => p.gender === "men").length,
    Women: allProducts.filter((p) => p.gender === "women").length,
    Kids: allProducts.filter((p) => p.gender === "kids").length,
  };

  const recent = allProducts.slice(-5).reverse();

  const STATS = [
    { label: "Total Products", value: totalProducts, icon: Package, color: "bg-white text-black" },
    { label: "Shoes", value: shoes, icon: TrendingUp, color: "bg-[#1a1a1a] text-white" },
    { label: "Clothing", value: clothing, icon: Tag, color: "bg-[#1a1a1a] text-white" },
    { label: "Accessories", value: accessories, icon: Layers, color: "bg-[#1a1a1a] text-white" },
  ];

  return (
    <div className="space-y-10">

      {/* WELCOME */}
      <div>
        <p className="text-[10px] text-white/20 uppercase tracking-[0.4em] mb-1">Overview</p>
        <h2 className="text-3xl font-black uppercase tracking-tight">Dashboard</h2>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STATS.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`${color} p-6 flex flex-col gap-4`}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-widest opacity-50">{label}</p>
              <Icon className="w-4 h-4 opacity-30" />
            </div>
            <p className="text-4xl font-black">{value}</p>
          </div>
        ))}
      </div>

      {/* GENDER BREAKDOWN + QUICK ACTIONS */}
      <div className="grid md:grid-cols-2 gap-4">

        {/* GENDER BREAKDOWN */}
        <div className="bg-[#1a1a1a] p-6">
          <p className="text-[10px] text-white/20 uppercase tracking-[0.4em] mb-6">By Gender</p>
          <div className="space-y-4">
            {Object.entries(byGender).map(([gender, count]) => {
              const pct = totalProducts > 0 ? Math.round((count / totalProducts) * 100) : 0;
              return (
                <div key={gender}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-semibold">{gender}</span>
                    <span className="text-white/40">{count} products · {pct}%</span>
                  </div>
                  <div className="h-1 bg-white/5 w-full">
                    <div
                      className="h-full bg-white transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="bg-[#1a1a1a] p-6">
          <p className="text-[10px] text-white/20 uppercase tracking-[0.4em] mb-6">Quick Actions</p>
          <div className="space-y-2">
            {[
              { label: "Add New Product", to: "/add", icon: PackagePlus },
              { label: "Manage Products", to: "/products", icon: Package },
              { label: "View Categories", to: "/categories", icon: Tag },
              { label: "View Seasons", to: "/seasons", icon: Layers },
            ].map(({ label, to, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white hover:text-black transition-all duration-150 group"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 opacity-40 group-hover:opacity-100" />
                  <span className="text-sm font-medium">{label}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* RECENT PRODUCTS */}
      <div className="bg-[#1a1a1a]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <p className="text-[10px] text-white/20 uppercase tracking-[0.4em]">Recent Products</p>
          <Link to="/products" className="text-xs text-white/30 hover:text-white transition flex items-center gap-1">
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="divide-y divide-white/5">
          {recent.map((p) => (
            <div key={p.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition">
              <img
                src={p.image}
                alt={p.name}
                className="w-12 h-12 object-cover bg-[#222] shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{p.name}</p>
                <p className="text-xs text-white/30 capitalize">{p.gender} · {p.type}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold">₹{p.price?.toLocaleString()}</p>
                {p.tag && (
                  <span className="text-[10px] text-red-400 uppercase tracking-wider">{p.tag}</span>
                )}
              </div>
            </div>
          ))}
          {recent.length === 0 && (
            <div className="px-6 py-12 text-center text-white/20 text-sm">
              No products yet. <Link to="/add" className="underline hover:text-white">Add one →</Link>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
