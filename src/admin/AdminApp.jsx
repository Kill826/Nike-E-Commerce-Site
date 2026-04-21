import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/Dashboard";
import AddProduct from "./pages/AddProduct";
import ManageProducts from "./pages/ManageProducts";
import Categories from "./pages/Categories";
import Seasons from "./pages/Seasons";
import Orders from "./pages/Orders";
import HomePageEditor from "./pages/HomePageEditor";

const AdminApp = () => (
  <Routes>
    <Route path="/" element={<AdminLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="orders" element={<Orders />} />
      <Route path="add" element={<AddProduct />} />
      <Route path="products" element={<ManageProducts />} />
      <Route path="categories" element={<Categories />} />
      <Route path="seasons" element={<Seasons />} />
      <Route path="homepage" element={<HomePageEditor />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AdminApp;
