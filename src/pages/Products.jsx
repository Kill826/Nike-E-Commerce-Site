import { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ChevronDown, X, SlidersHorizontal } from "lucide-react";
import { getAllProducts } from "../services/productService";
import ShoeCard from "../components/ShoeCard";

const PRICE_RANGES = [
  { label: "Under ₹3,000",      min: 0,     max: 3000     },
  { label: "₹3,000 – ₹6,000",  min: 3000,  max: 6000     },
  { label: "₹6,000 – ₹10,000", min: 6000,  max: 10000    },
  { label: "Over ₹10,000",      min: 10000, max: Infinity },
];

const SORT_OPTIONS = [
  { label: "Featured",           value: "featured"   },
  { label: "Newest",             value: "newest"     },
  { label: "Price: Low to High", value: "price_asc"  },
  { label: "Price: High to Low", value: "price_desc" },
];

const TAG_MAP = {
  "new-arrivals": ["New", "Just In"],
  "best-sellers": ["Best Seller"],
  "latest-drops": ["Just In"],
};

const GENDER_LABELS = { men: "Men", women: "Women", kids: "Kids" };
const TYPE_LABELS   = { shoes: "Shoes", clothing: "Clothing", accessories: "Accessories" };
const TAG_LABELS    = { "new-arrivals": "New Arrivals", "best-sellers": "Best Sellers", "latest-drops": "Latest Drops" };

/* ── Collapsible filter section ── */
const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200 py-5">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between group"
      >
        <span className="text-[17px] font-bold text-gray-900 tracking-tight group-hover:text-black transition-colors">
          {title}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="mt-4 space-y-3">{children}</div>}
    </div>
  );
};

/* ── Custom checkbox ── */
const CheckItem = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-3 cursor-pointer group">
    <span className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-all duration-150 shrink-0
      ${checked ? "bg-black border-black" : "border-gray-300 group-hover:border-gray-600"}`}
    >
      {checked && (
        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8">
          <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </span>
    <span className={`text-[13px] transition-colors ${checked ? "text-black font-medium" : "text-gray-500 group-hover:text-black"}`}>
      {label}
    </span>
    <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
  </label>
);

/* ── Custom radio ── */
const RadioItem = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-3 cursor-pointer group">
    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-150 shrink-0
      ${checked ? "border-black" : "border-gray-300 group-hover:border-gray-600"}`}
    >
      {checked && <span className="w-2 h-2 rounded-full bg-black" />}
    </span>
    <span className={`text-[13px] transition-colors ${checked ? "text-black font-medium" : "text-gray-500 group-hover:text-black"}`}>
      {label}
    </span>
    <input type="radio" checked={checked} onChange={onChange} className="sr-only" />
  </label>
);

const Products = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts]       = useState([]);
  const [query, setQuery]             = useState("");
  const [genderFilter, setGenderFilter] = useState([]);
  const [typeFilter, setTypeFilter]   = useState([]);
  const [priceFilter, setPriceFilter] = useState(null);
  const [sort, setSort]               = useState("featured");
  const [sortOpen, setSortOpen]       = useState(false);
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const sortRef = useRef(null);

  const genderParam = searchParams.get("gender");
  const typeParam   = searchParams.get("type");
  const qParam      = searchParams.get("q");
  const tagParam    = searchParams.get("tag");

  useEffect(() => {
    setGenderFilter(genderParam ? [genderParam] : []);
    setTypeFilter(typeParam ? [typeParam] : []);
    setQuery(qParam || "");
    setPriceFilter(null);
  }, [searchParams.toString()]);

  useEffect(() => { getAllProducts().then(setProducts); }, []);

  useEffect(() => {
    const h = (e) => { if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filtered = products
    .filter((p) => {
      const matchGender = genderFilter.length === 0 || genderFilter.includes(p.gender);
      const matchType   = typeFilter.length === 0   || typeFilter.includes(p.type);
      const matchQ      = !query || p.name.toLowerCase().includes(query.toLowerCase());
      const matchTag    = !tagParam || (TAG_MAP[tagParam] ? TAG_MAP[tagParam].includes(p.tag) : p.tag === tagParam);
      const matchPrice  = !priceFilter || (p.price >= priceFilter.min && p.price < priceFilter.max);
      return matchGender && matchType && matchQ && matchTag && matchPrice;
    })
    .sort((a, b) => {
      if (sort === "price_asc")  return a.price - b.price;
      if (sort === "price_desc") return b.price - a.price;
      return 0;
    });

  const toggleArr = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);

  const clearAll = () => { setGenderFilter([]); setTypeFilter([]); setPriceFilter(null); setQuery(""); };
  const activeCount = genderFilter.length + typeFilter.length + (priceFilter ? 1 : 0);

  const pageTitle = tagParam
    ? TAG_LABELS[tagParam] || tagParam
    : qParam
    ? qParam.replace(/\+/g, " ")
    : genderParam
    ? `${GENDER_LABELS[genderParam] || genderParam}${typeParam ? ` ${TYPE_LABELS[typeParam] || typeParam}` : ""}`
    : typeParam ? TYPE_LABELS[typeParam] || typeParam : "All Products";

  const SidebarContent = () => (
    <div className="w-full">
      {/* Gender quick links — big bold like Nike */}
      <div className="pb-6 border-b border-gray-200 space-y-2">
        {["men", "women", "kids"].map((g) => (
          <Link
            key={g}
            to={`/products?gender=${g}`}
            className={`block text-[20px] font-bold tracking-tight transition-colors leading-snug ${
              genderParam === g
                ? "text-black"
                : "text-gray-400 hover:text-black"
            }`}
          >
            {GENDER_LABELS[g]}
          </Link>
        ))}
      </div>

      {/* Reset button — rounded pill like Nike */}
      <div className="py-5 border-b border-gray-200">
        <button
          onClick={clearAll}
          className="w-full py-2.5 rounded-full border border-gray-300 text-[13px] text-gray-500 hover:border-black hover:text-black transition-all duration-200 font-medium"
        >
          Reset
        </button>
      </div>

      <FilterSection title="Gender">
        {["men", "women", "kids"].map((g) => (
          <CheckItem
            key={g}
            label={GENDER_LABELS[g]}
            checked={genderFilter.includes(g)}
            onChange={() => toggleArr(genderFilter, setGenderFilter, g)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Category">
        {["shoes", "clothing", "accessories"].map((t) => (
          <CheckItem
            key={t}
            label={TYPE_LABELS[t]}
            checked={typeFilter.includes(t)}
            onChange={() => toggleArr(typeFilter, setTypeFilter, t)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Shop By Price">
        {PRICE_RANGES.map((r) => (
          <RadioItem
            key={r.label}
            label={r.label}
            checked={priceFilter?.label === r.label}
            onChange={() => setPriceFilter(priceFilter?.label === r.label ? null : r)}
          />
        ))}
      </FilterSection>
    </div>
  );

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-[1380px] mx-auto px-5 md:px-10 py-7">

        {/* BREADCRUMB */}
        <p className="text-[11px] text-gray-400 tracking-wide mb-5 uppercase">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <span className="mx-2 text-gray-300">/</span>
          <span className="text-gray-700">{pageTitle}</span>
        </p>

        {/* TITLE + CONTROLS */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-[22px] font-bold tracking-tight text-gray-900">
              {pageTitle}
              <span className="ml-2 text-[15px] font-normal text-gray-400">({filtered.length})</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Mobile filter btn */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="md:hidden flex items-center gap-2 text-[12px] font-semibold uppercase tracking-widest border border-gray-200 px-4 py-2 hover:border-black transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters {activeCount > 0 && `(${activeCount})`}
            </button>

            {/* Sort */}
            <div className="relative" ref={sortRef}>
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-2 text-[13px] font-semibold text-gray-700 hover:text-black transition-colors"
              >
                Sort By
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`} />
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 shadow-2xl z-30 py-1">
                  {SORT_OPTIONS.map((o) => (
                    <button
                      key={o.value}
                      onClick={() => { setSort(o.value); setSortOpen(false); }}
                      className={`w-full text-left px-5 py-3 text-[13px] hover:bg-gray-50 transition-colors ${
                        sort === o.value ? "font-bold text-black" : "text-gray-500"
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ACTIVE FILTER CHIPS */}
        {activeCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {genderFilter.map((g) => (
              <span key={g} className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide bg-black text-white px-3 py-1.5">
                {GENDER_LABELS[g]}
                <button onClick={() => toggleArr(genderFilter, setGenderFilter, g)}><X className="w-3 h-3" /></button>
              </span>
            ))}
            {typeFilter.map((t) => (
              <span key={t} className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide bg-black text-white px-3 py-1.5">
                {TYPE_LABELS[t]}
                <button onClick={() => toggleArr(typeFilter, setTypeFilter, t)}><X className="w-3 h-3" /></button>
              </span>
            ))}
            {priceFilter && (
              <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide bg-black text-white px-3 py-1.5">
                {priceFilter.label}
                <button onClick={() => setPriceFilter(null)}><X className="w-3 h-3" /></button>
              </span>
            )}
          </div>
        )}

        <div className="flex gap-10">
          {/* DESKTOP SIDEBAR */}
          <aside className="hidden md:block w-52 shrink-0">
            <SidebarContent />
          </aside>

          {/* MOBILE DRAWER */}
          {drawerOpen && (
            <div className="md:hidden fixed inset-0 z-50 flex">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
              <div className="relative ml-auto w-72 h-full bg-white overflow-y-auto shadow-2xl">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                  <span className="text-[13px] font-bold uppercase tracking-widest">Filters</span>
                  <button onClick={() => setDrawerOpen(false)} className="text-gray-400 hover:text-black transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="px-6 py-4">
                  <SidebarContent />
                </div>
              </div>
            </div>
          )}

          {/* GRID */}
          <div className="flex-1 min-w-0">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10">
                {filtered.map((product) => (
                  <ShoeCard key={product.id} shoe={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-5">
                  <span className="text-2xl">∅</span>
                </div>
                {query && !genderFilter.length && !typeFilter.length && !priceFilter ? (
                  <>
                    <p className="text-lg font-bold text-gray-900 mb-1">This product is not available right now</p>
                    <p className="text-sm text-gray-400 mb-6">Sorry, we couldn't find any products matching "{query}"</p>
                  </>
                ) : (
                  <>
                    <p className="text-lg font-bold text-gray-900 mb-1">No Results Found</p>
                    <p className="text-sm text-gray-400 mb-6">Try adjusting your filters or search</p>
                  </>
                )}
                <button
                  onClick={clearAll}
                  className="px-7 py-2.5 bg-black text-white text-[12px] font-semibold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
