import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const PAGE_TITLES = {
  "/": "Dashboard",
  "/orders": "Orders",
  "/add": "Add Product",
  "/products": "Manage Products",
  "/categories": "Categories",
  "/seasons": "Seasons",
  "/homepage": "Edit Home Page",
};

const AdminLayout = () => {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] || "Admin";

  return (
    <div className="flex min-h-screen bg-[#111] text-white">
      <AdminSidebar />

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* TOP BAR */}
        <header className="h-14 border-b border-white/5 px-8 flex items-center justify-between shrink-0">
          <h1 className="text-sm font-black uppercase tracking-widest text-white/60">{title}</h1>
          <span className="text-[10px] text-white/20 uppercase tracking-widest">Jordan Admin · SS26</span>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
