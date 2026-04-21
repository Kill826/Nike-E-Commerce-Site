const API = "http://localhost:4000/api/products";

export const getProducts = async () => {
  try {
    const res = await fetch(API);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
};

export const addProduct = async (product) => {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error("Failed to add product");
  return res.json();
};

export const deleteProduct = async (id) => {
  const res = await fetch(`${API}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete product");
  return res.json();
};

export const updateProduct = async (id, updates) => {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
};
