const API = "http://localhost:4000/api";

// ── Admin-added products from backend ────────────────────────────
export const getAdminProducts = async () => {
  try {
    const res = await fetch(`${API}/products`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
};

// ── All products: only from backend ───────────────────────────────
export const getAllProducts = async () => {
  return await getAdminProducts();
};

// ── Get single product by id ──────────────────────────────────────
export const getProductById = async (id) => {
  const all = await getAllProducts();
  return all.find((p) => String(p._id || p.id) === String(id)) || null;
};
