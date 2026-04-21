import { Routes, Route, useLocation } from "react-router-dom";

import Home          from "./pages/Home";
import Products      from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart          from "./pages/Cart";
import Checkout      from "./pages/Checkout";
import OrderSuccess  from "./pages/OrderSuccess";
import Wishlist      from "./pages/Wishlist";
import Login         from "./pages/Login";
import Signup        from "./pages/Signup";

import Navbar  from "./components/Navbar";
import Footer  from "./components/Footer";
import { RequireAuth, RequireAdmin } from "./components/ProtectedRoute";

import MyOrders      from "./pages/MyOrders";
import Profile       from "./pages/Profile";
import AdminRoutes from "./admin/AdminRoutes";

import { CartProvider }     from "./CartContext";
import { WishlistProvider } from "./WishlistContext";
import { AuthProvider }     from "./AuthContext";

function App() {
  const location = useLocation();
  const isAdmin  = location.pathname.startsWith("/admin");
  const isAuth   = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <div className="min-h-screen flex flex-col text-black">

            {!isAdmin && !isAuth && <Navbar />}

            <main className="grow">
              <Routes>
                {/* PUBLIC */}
                <Route path="/"              element={<Home />} />
                <Route path="/products"      element={<Products />} />
                <Route path="/product/:id"   element={<ProductDetail />} />
                <Route path="/login"         element={<Login />} />
                <Route path="/signup"        element={<Signup />} />

                {/* PROTECTED — logged in users */}
                <Route path="/cart"          element={<RequireAuth><Cart /></RequireAuth>} />
                <Route path="/checkout"      element={<RequireAuth><Checkout /></RequireAuth>} />
                <Route path="/order-success" element={<RequireAuth><OrderSuccess /></RequireAuth>} />
                <Route path="/wishlist"      element={<RequireAuth><Wishlist /></RequireAuth>} />
                <Route path="/my-orders"     element={<RequireAuth><MyOrders /></RequireAuth>} />
                <Route path="/profile"       element={<RequireAuth><Profile /></RequireAuth>} />

                {/* PROTECTED — admin only */}
                <Route path="/admin/*"       element={<RequireAdmin><AdminRoutes /></RequireAdmin>} />
              </Routes>
            </main>

            {!isAdmin && !isAuth && <Footer />}
          </div>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
