import { useState, useEffect } from "react";
import { getProducts } from "../services/productService";
import staticProducts from "../../data/products";
import { ChevronDown } from "lucide-react";

const CATEGORIES = [
  { key: "shoes", label: "Shoes" },
  { key: "clothing", label: "Clothing" },
  { key: "accessories", label: "Accessories" },
];

const GENDERS = ["men", "women", "kids"];

const Categories = () => {
  const [adminProducts, setAdminProducts] = useState([]);
  const [expanded, setExpanded] = useState("shoes");

  useEffect(() => {
    getProducts().then(setAdminProducts);
  }, []);

  const allProducts = [...staticProducts, ...adminProducts];

  const toggle = (key) => setExpanded((prev) => (prev === key ? null : key));

  return (
    <div className="space-y-8 max-w-3xl">

      {/* HEADING */}
      <div>
        <p className="text-[10px] text-white/20 uppercase tracking-[0.4em] mb-1">Admin</p>
        <h2 className="text-3xl font-black uppercase tracking-tight">Categories</h2>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-3 gap-3">
        {CATEGORIES.map(({ key, label }) => {
          const count = allProducts.filter((p) => p.type === key).length;
          return (
            <div key={key} className="bg-[#1a1a1a] p-6">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/20 mb-3">{label}</p>
              <p className="text-4xl font-black">{count}</p>
              <p className="text-xs text-white/30 mt-1">products</p>
            </div>
          );
        })}
      </div>

      {/* ACCORDION BREAKDOWN */}
      <div className="space-y-2">
        {CATEGORIES.map(({ key, label }) => {
          const isOpen = expanded === key;
          const total = allProducts.filter((p) => p.type === key).length;

          return (
            <div key={key} className="bg-[#1a1a1a]">

              {/* HEADER */}
              <button
                onClick={() => toggle(key)}
                className="w-full flex items-center justify-between px-6 py-5 hover:bg-white/5 transition"
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm font-black uppercase tracking-widest">{label}</span>
                  <span className="text-xs text-white/30">{total} products</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-white/30 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
              </button>

              {/* GENDER BREAKDOWN */}
              {isOpen && (
                <div className="border-t border-white/5 divide-y divide-white/5">
                  {GENDERS.map((gender) => {
                    const items = allProducts.filter((p) => p.type === key && p.gender === gender);
                    if (items.length === 0) return null;
                    return (
                      <div key={gender} className="px-6 py-4">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs font-bold uppercase tracking-widest text-white/50 capitalize">{gender}</p>
                          <span className="text-xs text-white/20">{items.length} items</span>
                        </div>
                        <div className="space-y-2">
                          {items.map((p) => (
                            <div key={p.id} className="flex items-center gap-3 group">
                              <div className="w-10 h-10 bg-[#111] shrink-0 overflow-hidden">
                                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm truncate">{p.name}</p>
                              </div>
                              <p className="text-sm font-bold text-white/60 shrink-0">₹{p.price?.toLocaleString()}</p>
                              {p.tag && (
                                <span className="text-[10px] text-red-400 uppercase tracking-wider shrink-0">{p.tag}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;
