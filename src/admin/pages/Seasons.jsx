import { useState, useEffect } from "react";
import { getProducts } from "../services/productService";
import staticProducts from "../../data/products";
import { Sun, Snowflake, Wind } from "lucide-react";

const SEASONS = [
  { key: "summer", label: "Summer", icon: Sun, desc: "Lightweight, breathable, warm-weather ready." },
  { key: "winter", label: "Winter", icon: Snowflake, desc: "Insulated, layered, built for the cold." },
  { key: "all-season", label: "All Season", icon: Wind, desc: "Versatile pieces that work year-round." },
];

const Seasons = () => {
  const [adminProducts, setAdminProducts] = useState([]);

  useEffect(() => {
    getProducts().then(setAdminProducts);
  }, []);

  const allProducts = [...staticProducts, ...adminProducts];

  return (
    <div className="space-y-8">

      {/* HEADING */}
      <div>
        <p className="text-[10px] text-white/20 uppercase tracking-[0.4em] mb-1">Admin</p>
        <h2 className="text-3xl font-black uppercase tracking-tight">Seasons</h2>
      </div>

      {/* SEASON CARDS */}
      <div className="grid md:grid-cols-3 gap-4">
        {SEASONS.map(({ key, label, icon: Icon, desc }) => {
          const count = allProducts.filter((p) => p.season === key).length;
          return (
            <div key={key} className="bg-[#1a1a1a] p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <Icon className="w-5 h-5 text-white/30" />
                <span className="text-4xl font-black">{count}</span>
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-widest">{label}</p>
                <p className="text-xs text-white/30 mt-1">{desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* SEASON PRODUCT LISTS */}
      <div className="space-y-4">
        {SEASONS.map(({ key, label, icon: Icon }) => {
          const items = allProducts.filter((p) => p.season === key);
          if (items.length === 0) return null;

          return (
            <div key={key} className="bg-[#1a1a1a]">

              {/* SECTION HEADER */}
              <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5">
                <Icon className="w-4 h-4 text-white/30" />
                <p className="text-[10px] uppercase tracking-[0.4em] text-white/30">{label}</p>
                <span className="text-[10px] text-white/20 ml-auto">{items.length} products</span>
              </div>

              {/* PRODUCT ROWS */}
              <div className="divide-y divide-white/5">
                {items.map((p) => (
                  <div key={p.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition">
                    <div className="w-12 h-12 bg-[#111] shrink-0 overflow-hidden">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    </div>
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
              </div>
            </div>
          );
        })}
      </div>

      {/* NOTE: static products don't have season field */}
      {allProducts.filter((p) => !p.season).length > 0 && (
        <p className="text-xs text-white/20 text-center">
          {allProducts.filter((p) => !p.season).length} products have no season assigned.
        </p>
      )}
    </div>
  );
};

export default Seasons;
