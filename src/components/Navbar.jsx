import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, Search, X, Menu, Heart, User, LogOut } from "lucide-react";
import { useCart } from "../CartContext";
import { useWishlist } from "../WishlistContext";
import { useAuth } from "../AuthContext";

const MEGA = {
  Men: [
    {
      heading: "New & Featured",
      items: [
        { label: "New Arrivals",   q: "gender=men&tag=new-arrivals" },
        { label: "Best Sellers",   q: "gender=men&tag=best-sellers" },
        { label: "Latest Drops",   q: "gender=men&tag=latest-drops" },
        { label: "Shop All Men's", q: "gender=men" },
      ],
    },
    {
      heading: "Shoes",
      items: [
        { label: "All Shoes",    q: "gender=men&type=shoes" },
        { label: "Jordan Retro", q: "gender=men&type=shoes" },
        { label: "Basketball",   q: "gender=men&type=shoes" },
        { label: "Lifestyle",    q: "gender=men&type=shoes" },
        { label: "Running",      q: "gender=men&type=shoes" },
      ],
    },
    {
      heading: "Clothing",
      items: [
        { label: "All Clothing",          q: "gender=men&type=clothing" },
        { label: "Hoodies & Sweatshirts", q: "gender=men&type=clothing" },
        { label: "T-Shirts",              q: "gender=men&type=clothing" },
        { label: "Shorts",                q: "gender=men&type=clothing" },
        { label: "Tops & Graphic Tees",   q: "gender=men&type=clothing" },
      ],
    },
    {
      heading: "Accessories",
      items: [
        { label: "All Accessories",  q: "gender=men&type=accessories" },
        { label: "Bags & Backpacks", q: "gender=men&type=accessories" },
        { label: "Hats & Headwear",  q: "gender=men&type=accessories" },
        { label: "Socks",            q: "gender=men&type=accessories" },
      ],
    },
  ],
  Women: [
    {
      heading: "New & Featured",
      items: [
        { label: "New Arrivals",      q: "gender=women&tag=new-arrivals" },
        { label: "Best Sellers",      q: "gender=women&tag=best-sellers" },
        { label: "Latest Drops",      q: "gender=women&tag=latest-drops" },
        { label: "Shop All Women's",  q: "gender=women" },
      ],
    },
    {
      heading: "Shoes",
      items: [
        { label: "All Shoes",    q: "gender=women&type=shoes" },
        { label: "Jordan Retro", q: "gender=women&type=shoes" },
        { label: "Lifestyle",    q: "gender=women&type=shoes" },
        { label: "Running",      q: "gender=women&type=shoes" },
      ],
    },
    {
      heading: "Clothing",
      items: [
        { label: "All Clothing",          q: "gender=women&type=clothing" },
        { label: "Hoodies & Sweatshirts", q: "gender=women&type=clothing" },
        { label: "Leggings",              q: "gender=women&type=clothing" },
        { label: "Tops & Bras",           q: "gender=women&type=clothing" },
        { label: "Jackets & Vests",       q: "gender=women&type=clothing" },
      ],
    },
    {
      heading: "Accessories",
      items: [
        { label: "All Accessories",  q: "gender=women&type=accessories" },
        { label: "Bags & Backpacks", q: "gender=women&type=accessories" },
        { label: "Hats & Headwear",  q: "gender=women&type=accessories" },
        { label: "Socks",            q: "gender=women&type=accessories" },
      ],
    },
  ],
  Kids: [
    {
      heading: "New & Featured",
      items: [
        { label: "New Arrivals",    q: "gender=kids&tag=new-arrivals" },
        { label: "Best Sellers",    q: "gender=kids&tag=best-sellers" },
        { label: "Shop All Kids'",  q: "gender=kids" },
      ],
    },
    {
      heading: "Shoes",
      items: [
        { label: "All Shoes",    q: "gender=kids&type=shoes" },
        { label: "Jordan Retro", q: "gender=kids&type=shoes" },
        { label: "Lifestyle",    q: "gender=kids&type=shoes" },
      ],
    },
    {
      heading: "Clothing",
      items: [
        { label: "All Clothing", q: "gender=kids&type=clothing" },
        { label: "Hoodies",      q: "gender=kids&type=clothing" },
        { label: "T-Shirts",     q: "gender=kids&type=clothing" },
        { label: "Sets",         q: "gender=kids&type=clothing" },
        { label: "Shorts",       q: "gender=kids&type=clothing" },
      ],
    },
    {
      heading: "Accessories",
      items: [
        { label: "All Accessories",  q: "gender=kids&type=accessories" },
        { label: "Bags & Backpacks", q: "gender=kids&type=accessories" },
        { label: "Caps",             q: "gender=kids&type=accessories" },
        { label: "Socks",            q: "gender=kids&type=accessories" },
      ],
    },
  ],
};

const NAV_ITEMS = ["Men", "Women", "Kids"];

const Navbar = () => {
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);

  const leaveTimer = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    setActiveDropdown(null);
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 50);
  }, [searchOpen]);

  const handleMouseEnter = (key) => {
    clearTimeout(leaveTimer.current);
    setActiveDropdown(key);
  };

  const handleMouseLeave = () => {
    leaveTimer.current = setTimeout(() => setActiveDropdown(null), 100);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal("");
      setSearchOpen(false);
    }
  };

  return (
    <>
      {/* ── NAVBAR ── */}
      <nav className="w-full bg-white text-black sticky top-0 z-50 border-b border-gray-200 shadow-sm">

        {/* MAIN NAV ROW */}
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-4">

          {/* LOGO */}
          <Link to="/" className="font-black text-black text-xl tracking-widest shrink-0">
            ✦ JORDAN
          </Link>

          <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {NAV_ITEMS.map((key) => (
              <div key={key} className="relative"
                onMouseEnter={() => handleMouseEnter(key)}
                onMouseLeave={handleMouseLeave}>
                <button className={`px-4 py-4 text-sm font-medium transition-colors duration-150 border-b-2 ${
                  activeDropdown === key ? "text-black border-black" : "text-gray-600 border-transparent hover:text-black"
                }`}>
                  {key}
                </button>
              </div>
            ))}
          </div>

          {/* RIGHT — utility + icons */}
          <div className="flex items-center gap-1 shrink-0">

            {/* Utility buttons */}
            <div className="hidden md:flex items-center gap-1 mr-2 text-[11px]">
              <a href="https://www.google.com/maps/search/jordan+store+near+me" target="_blank" rel="noopener noreferrer"
                className="group flex items-center gap-0 hover:gap-1.5 px-2 hover:px-3 py-1.5 border border-gray-200 rounded text-gray-500 hover:border-black hover:text-black transition-all duration-200 font-medium overflow-hidden">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <span className="max-w-0 group-hover:max-w-xs overflow-hidden whitespace-nowrap transition-all duration-200">Find a Store</span>
              </a>
              <a href="https://www.nike.com/help" target="_blank" rel="noopener noreferrer"
                className="group flex items-center gap-0 hover:gap-1.5 px-2 hover:px-3 py-1.5 border border-gray-200 rounded text-gray-500 hover:border-black hover:text-black transition-all duration-200 font-medium overflow-hidden">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <span className="max-w-0 group-hover:max-w-xs overflow-hidden whitespace-nowrap transition-all duration-200">Help</span>
              </a>
              {isLoggedIn ? (
                <>
                  {isAdmin && (
                    <a href="http://localhost:5174" target="_blank"
                      className="group flex items-center gap-0 hover:gap-1.5 px-2 hover:px-3 py-1.5 border border-red-200 rounded text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200 font-semibold overflow-hidden">
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                      <span className="max-w-0 group-hover:max-w-xs overflow-hidden whitespace-nowrap transition-all duration-200">Admin</span>
                    </a>
                  )}
                  <Link to="/my-orders" className="group flex items-center gap-0 hover:gap-1.5 px-2 hover:px-3 py-1.5 border border-gray-200 rounded text-gray-500 hover:border-black hover:text-black transition-all duration-200 font-medium overflow-hidden">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                    <span className="max-w-0 group-hover:max-w-xs overflow-hidden whitespace-nowrap transition-all duration-200">My Orders</span>
                  </Link>
                  <Link to="/profile" className="group flex items-center gap-0 hover:gap-1.5 px-2 hover:px-3 py-1.5 border border-gray-200 rounded text-gray-700 font-semibold bg-gray-50 hover:border-black hover:text-black overflow-hidden transition-all duration-200">
                    <User className="w-3.5 h-3.5 shrink-0" />
                    <span className="max-w-0 group-hover:max-w-xs overflow-hidden whitespace-nowrap transition-all duration-200">{user.name.split(" ")[0]}</span>
                  </Link>
                  <button onClick={() => { logout(); navigate("/"); }}
                    className="group flex items-center gap-0 hover:gap-1.5 px-2 hover:px-3 py-1.5 border border-gray-200 rounded text-gray-500 hover:border-red-400 hover:text-red-500 transition-all duration-200 font-medium overflow-hidden">
                    <LogOut className="w-3.5 h-3.5 shrink-0" />
                    <span className="max-w-0 group-hover:max-w-xs overflow-hidden whitespace-nowrap transition-all duration-200">Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/signup" className="group flex items-center gap-0 hover:gap-1.5 px-2 hover:px-3 py-1.5 border border-gray-200 rounded text-gray-500 hover:border-black hover:text-black transition-all duration-200 font-medium overflow-hidden">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
                    <span className="max-w-0 group-hover:max-w-xs overflow-hidden whitespace-nowrap transition-all duration-200">Join Us</span>
                  </Link>
                  <Link to="/login" className="group flex items-center gap-0 hover:gap-1.5 px-2 hover:px-3 py-1.5 border border-black rounded bg-black text-white hover:bg-gray-800 transition-all duration-200 font-semibold overflow-hidden">
                    <User className="w-3.5 h-3.5 shrink-0" />
                    <span className="max-w-0 group-hover:max-w-xs overflow-hidden whitespace-nowrap transition-all duration-200">Sign In</span>
                  </Link>
                </>
              )}
            </div>

            {/* Search, Wishlist, Cart */}
            <button onClick={() => setSearchOpen(true)}
              className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black transition-colors" aria-label="Search">
              <Search className="w-[18px] h-[18px]" />
            </button>
            <Link to="/wishlist" className="relative w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black transition-colors">
              <Heart className="w-[18px] h-[18px]" />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-black text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-black">{wishlist.length}</span>
              )}
            </Link>
            <Link to="/cart" className="relative w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black transition-colors">
              <ShoppingBag className="w-[18px] h-[18px]" />
              {cart.length > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-black text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-black">{cart.length}</span>
              )}
            </Link>
            <button className="md:hidden w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ── MEGA DROPDOWN PANEL ── */}
        {activeDropdown && MEGA[activeDropdown] && (
          <div className="hidden md:block absolute left-0 right-0 top-full bg-black/80 backdrop-blur-md border-t border-white/10 shadow-xl z-40"
            onMouseEnter={() => handleMouseEnter(activeDropdown)}
            onMouseLeave={handleMouseLeave}>
            <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-4 gap-10">
              {MEGA[activeDropdown].map(({ heading, items }) => (
                <div key={heading}>
                  <p className="text-xs font-black uppercase tracking-widest text-white mb-4">{heading}</p>
                  <ul className="space-y-2.5">
                    {items.map(({ label, q }) => (
                      <li key={label}>
                        <Link to={`/products?${q}`} onClick={() => setActiveDropdown(null)}
                          className="text-sm text-white/50 hover:text-white transition-colors duration-150">
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* ── SEARCH OVERLAY ── */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm" onClick={() => setSearchOpen(false)}>
          <div className="bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            {/* top bar */}
            <div className="max-w-7xl mx-auto px-6 py-2 flex justify-end">
              <button onClick={() => setSearchOpen(false)} className="text-gray-400 hover:text-black transition p-2">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto px-6 pb-6 flex items-center gap-3 border-b border-gray-200">
              <Search className="w-5 h-5 text-gray-400 shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search for shoes, clothing, accessories..."
                className="flex-1 text-lg text-black placeholder-gray-300 outline-none py-2"
              />
              {searchVal && (
                <button type="button" onClick={() => setSearchVal("")} className="text-gray-300 hover:text-black transition">
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>
            {/* Quick links */}
            <div className="max-w-2xl mx-auto px-6 py-5">
              <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Popular</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Men's Shoes", q: "gender=men&type=shoes" },
                  { label: "Women's Clothing", q: "gender=women&type=clothing" },
                  { label: "Kids' Shoes", q: "gender=kids&type=shoes" },
                  { label: "Accessories", q: "type=accessories" },
                  { label: "New Arrivals", q: "tag=new-arrivals" },
                ].map(({ label, q }) => (
                  <Link
                    key={label}
                    to={`/products${q ? `?${q}` : ""}`}
                    onClick={() => setSearchOpen(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-600 text-xs font-medium rounded-full hover:bg-gray-200 hover:text-black transition"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MOBILE DRAWER ── */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-[55] flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative ml-auto w-[85vw] max-w-sm h-full bg-white flex flex-col overflow-y-auto shadow-2xl">

            {/* HEADER */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <span className="font-black text-black tracking-widest text-sm">✦ JORDAN</span>
              <button onClick={() => setMobileOpen(false)} className="text-gray-400 hover:text-black transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* MOBILE SEARCH */}
            <form onSubmit={handleSearch} className="px-5 py-3 border-b border-gray-100">
              <div className="flex items-center gap-3 bg-gray-100 px-4 py-2.5 rounded-full">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Search..."
                  className="flex-1 bg-transparent text-black text-sm placeholder-gray-400 outline-none"
                />
              </div>
            </form>

            {/* LINKS */}
            <div className="flex-1 px-5 py-2">
              <Link
                to="/products?tag=new-arrivals"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between py-3.5 text-sm font-semibold text-black border-b border-gray-100"
              >
                New Arrivals
                <span className="text-gray-300">›</span>
              </Link>

              {NAV_ITEMS.map((key) => (
                <div key={key} className="border-b border-gray-100">
                  <button
                    onClick={() => setMobileExpanded(mobileExpanded === key ? null : key)}
                    className="w-full flex items-center justify-between py-3.5 text-sm font-semibold text-black"
                  >
                    {key}
                    <span className={`text-gray-400 transition-transform duration-200 text-lg leading-none ${mobileExpanded === key ? "rotate-45" : ""}`}>+</span>
                  </button>

                  {mobileExpanded === key && (
                    <div className="pb-4 space-y-4">
                      {MEGA[key].map(({ heading, items }) => (
                        <div key={heading}>
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 pl-2">{heading}</p>
                          {items.map(({ label, q }) => (
                            <Link
                              key={label}
                              to={`/products?${q}`}
                              onClick={() => { setMobileOpen(false); setMobileExpanded(null); }}
                              className="flex items-center gap-2 pl-2 py-1.5 text-sm text-gray-500 hover:text-black transition"
                            >
                              {label}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* FOOTER */}
            <div className="px-5 py-4 border-t border-gray-100 space-y-3">
              <div className="flex items-center gap-5">
                <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition">
                  <Heart className="w-4 h-4" />
                  Wishlist {wishlist.length > 0 && <span className="text-red-500 font-bold">({wishlist.length})</span>}
                </Link>
                <span className="text-gray-200">|</span>
                <Link to="/cart" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition">
                  <ShoppingBag className="w-4 h-4" />
                  Bag {cart.length > 0 && <span className="text-red-500 font-bold">({cart.length})</span>}
                </Link>
              </div>
              <div className="flex items-center gap-4 text-sm">
                {isLoggedIn ? (
                  <>
                    <span className="flex items-center gap-1.5 text-gray-500">
                      <User className="w-4 h-4" /> {user.name.split(" ")[0]}
                    </span>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setMobileOpen(false)} className="text-red-500 font-medium">
                        Admin Panel
                      </Link>
                    )}
                    <button onClick={() => { logout(); navigate("/"); setMobileOpen(false); }}
                      className="flex items-center gap-1.5 text-gray-500 hover:text-black transition">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="text-gray-500 hover:text-black transition">Sign In</Link>
                    <Link to="/signup" onClick={() => setMobileOpen(false)} className="text-gray-500 hover:text-black transition">Join Us</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
