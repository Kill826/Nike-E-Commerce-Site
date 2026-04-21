import { Routes, Route } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/Dashboard";
import AddProduct from "./pages/AddProduct";
import ManageProducts from "./pages/ManageProducts";
import Categories from "./pages/Categories";
import Seasons from "./pages/Seasons";
import Orders from "./pages/Orders";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="orders" element={<Orders />} />
        <Route path="add" element={<AddProduct />} />
        <Route path="products" element={<ManageProducts />} />
        <Route path="categories" element={<Categories />} />
        <Route path="seasons" element={<Seasons />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;