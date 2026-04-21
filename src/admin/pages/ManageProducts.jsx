import { useEffect, useState } from "react";
import { getProducts, deleteProduct, updateProduct, addProduct } from "../services/productService";
import staticProducts from "../../data/products";
import { Trash2, Search, Pencil, X, Upload, CheckCircle } from "lucide-react";

const FILTERS = ["all", "men", "women", "kids"];
const TYPES   = ["all", "shoes", "clothing", "accessories"];
const TAGS    = ["Just In", "New", "Best Seller", "Trending", "Iconic", "Performance", "None"];

const inputCls  = "bg-[#111] border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-white/40 placeholder:text-white/20 transition w-full";
const selectCls = `${inputCls} appearance-none cursor-pointer`;

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-semibold">{label}</label>
    {children}
  </div>
);

const ManageProducts = () => {
  const [adminProducts, setAdminProducts] = useState([]);
  const [genderFilter, setGenderFilter]   = useState("all");
  const [typeFilter, setTypeFilter]       = useState("all");
  const [search, setSearch]               = useState("");
  const [deleteId, setDeleteId]           = useState(null);

  // Edit modal state
  const [editProduct, setEditProduct]     = useState(null);
  const [editForm, setEditForm]           = useState({});
  const [uploadMode, setUploadMode]       = useState("url");
  const [imagePreview, setImagePreview]   = useState("");
  const [saving, setSaving]               = useState(false);
  const [saveSuccess, setSaveSuccess]     = useState(false);

  useEffect(() => { getProducts().then(setAdminProducts); }, []);

  const handleDelete = (id) => {
    deleteProduct(id).then(() => getProducts().then(setAdminProducts));
    setDeleteId(null);
  };

  const openEdit = (p) => {
    setEditProduct(p);
    setEditForm({
      name:        p.name        || "",
      price:       p.price       || "",
      image:       p.image       || "",
      gender:      p.gender      || "men",
      type:        p.type        || "shoes",
      tag:         p.tag         || "None",
      season:      p.season      || "all-season",
      description: p.description || "",
      sizes:       p.sizes       || [],
    });
    setUploadMode("url");
    setImagePreview("");
    setSaveSuccess(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return alert("Please select an image file");
    if (file.size > 5 * 1024 * 1024) return alert("Max 5MB");

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("image", file);
    try {
      const res  = await fetch("http://localhost:4000/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setEditForm((prev) => ({ ...prev, image: `http://localhost:4000${data.url}` }));
    } catch (err) {
      alert("Upload failed: " + err.message);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editForm.name || !editForm.price || !editForm.image) return;
    setSaving(true);
    try {
      const payload = {
        ...editForm,
        price: Number(editForm.price),
        tag: editForm.tag === "None" ? null : editForm.tag,
      };

      if (editProduct._source === "admin") {
        // existing MongoDB product — just update
        await updateProduct(editProduct._id || editProduct.id, payload);
      } else {
        // static product — save to MongoDB so it becomes editable
        await addProduct({ ...payload, sizes: editProduct.sizes || [] });
      }

      await getProducts().then(setAdminProducts);
      setSaveSuccess(true);
      setTimeout(() => { setSaveSuccess(false); setEditProduct(null); }, 1200);
    } catch {
      alert("Failed to save. Is the server running?");
    } finally {
      setSaving(false);
    }
  };

  // Hide static products that have been saved to MongoDB (matched by name)
  const adminNames = new Set(adminProducts.map((p) => p.name.toLowerCase()));
  const allProducts = [
    ...staticProducts
      .filter((p) => !adminNames.has(p.name.toLowerCase()))
      .map((p) => ({ ...p, _source: "store" })),
    ...adminProducts.map((p) => ({ ...p, _source: "admin" })),
  ];

  const filtered = allProducts.filter((p) => {
    const matchGender = genderFilter === "all" || p.gender === genderFilter;
    const matchType   = typeFilter   === "all" || p.type   === typeFilter;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchGender && matchType && matchSearch;
  });

  return (
    <div className="space-y-8">

      {/* HEADING */}
      <div>
        <p className="text-[10px] text-white/20 uppercase tracking-[0.4em] mb-1">Admin</p>
        <h2 className="text-3xl font-black uppercase tracking-tight">Manage Products</h2>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-[#1a1a1a] border border-white/10 text-white text-sm pl-11 pr-4 py-3 focus:outline-none focus:border-white/30 placeholder:text-white/20" />
        </div>
        <div className="flex border border-white/10">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setGenderFilter(f)}
              className={`px-4 py-3 text-xs font-bold uppercase tracking-widest transition ${genderFilter === f ? "bg-white text-black" : "text-white/30 hover:text-white"}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="flex border border-white/10">
          {TYPES.map((t) => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-4 py-3 text-xs font-bold uppercase tracking-widest transition ${typeFilter === t ? "bg-white text-black" : "text-white/30 hover:text-white"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-white/20 uppercase tracking-widest">{filtered.length} product{filtered.length !== 1 ? "s" : ""}</p>

      {/* TABLE */}
      <div className="bg-[#1a1a1a]">
        <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-0 text-[10px] uppercase tracking-[0.3em] text-white/20 px-6 py-3 border-b border-white/5">
          <span className="w-14">Image</span>
          <span className="pl-4">Name</span>
          <span className="text-right pr-6">Price</span>
          <span className="text-right pr-6">Type</span>
          <span className="text-right">Actions</span>
        </div>

        <div className="divide-y divide-white/5">
          {filtered.map((p) => (
            <div key={`${p._source}-${p.id || p._id}`}
              className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-0 px-6 py-4 hover:bg-white/5 transition group">

              <div className="w-14 h-14 bg-[#111] shrink-0 overflow-hidden">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              </div>

              <div className="pl-4 min-w-0">
                <p className="text-sm font-semibold truncate">{p.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-white/30 capitalize">{p.gender} · {p.type}</span>
                  {p.tag && <span className="text-[10px] text-red-400 uppercase tracking-wider">{p.tag}</span>}
                  {p._source === "admin" && (
                    <span className="text-[10px] bg-white/10 text-white/40 px-1.5 py-0.5 uppercase tracking-wider">Custom</span>
                  )}
                </div>
              </div>

              <div className="text-sm font-bold pr-6 shrink-0">₹{p.price?.toLocaleString()}</div>

              <div className="pr-6 shrink-0">
                <span className="text-[10px] uppercase tracking-widest text-white/30 capitalize">{p.type}</span>
              </div>

              {/* ACTIONS */}
              <div className="shrink-0 flex items-center gap-3">
                {/* EDIT — available for all products */}
                <button
                  onClick={() => openEdit(p)}
                  className="opacity-0 group-hover:opacity-100 transition text-white/30 hover:text-white"
                  title="Edit product"
                >
                  <Pencil className="w-4 h-4" />
                </button>

                {/* DELETE — only for MongoDB products */}
                {p._source === "admin" && (
                  deleteId === (p.id || p._id) ? (
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleDelete(p.id || p._id)}
                        className="text-[10px] bg-red-500 text-white px-3 py-1.5 uppercase tracking-widest font-bold hover:bg-red-600 transition">
                        Confirm
                      </button>
                      <button onClick={() => setDeleteId(null)} className="text-[10px] text-white/30 hover:text-white transition">
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteId(p.id || p._id)}
                      className="opacity-0 group-hover:opacity-100 transition text-white/30 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )
                )}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="px-6 py-16 text-center text-white/20 text-sm">No products match your filters.</div>
          )}
        </div>
      </div>

      {/* ── EDIT MODAL ── */}
      {editProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0d0d0d] border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div>
                <p className="text-[10px] text-white/20 uppercase tracking-[0.4em]">Admin</p>
                <h3 className="text-lg font-black uppercase tracking-tight">Edit Product</h3>
              </div>
              <button onClick={() => setEditProduct(null)} className="text-white/30 hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="px-6 py-6 space-y-5">

              {saveSuccess && (
                <div className="flex items-center gap-3 bg-white text-black px-4 py-3 text-sm font-bold uppercase tracking-widest">
                  <CheckCircle className="w-4 h-4" />
                  Saved successfully
                </div>
              )}

              <Field label="Product Name">
                <input name="name" value={editForm.name} onChange={handleEditChange}
                  className={inputCls} required />
              </Field>

              <Field label="Price (₹)">
                <input name="price" type="number" value={editForm.price} onChange={handleEditChange}
                  className={inputCls} required />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Gender">
                  <select name="gender" value={editForm.gender} onChange={handleEditChange} className={selectCls}>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kids">Kids</option>
                  </select>
                </Field>
                <Field label="Type">
                  <select name="type" value={editForm.type} onChange={handleEditChange} className={selectCls}>
                    <option value="shoes">Shoes</option>
                    <option value="clothing">Clothing</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </Field>
              </div>

              <Field label="Tag">
                <select name="tag" value={editForm.tag} onChange={handleEditChange} className={selectCls}>
                  {TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>

              {/* IMAGE */}
              <Field label="Product Image">
                <div className="flex mb-3 border border-white/10">
                  {[{ val: "url", label: "Image URL" }, { val: "file", label: "Upload File" }].map(({ val, label }) => (
                    <button key={val} type="button"
                      onClick={() => { setUploadMode(val); setImagePreview(""); }}
                      className={`flex-1 py-2.5 text-xs font-black uppercase tracking-widest transition ${uploadMode === val ? "bg-white text-black" : "text-white/30 hover:text-white"}`}>
                      {label}
                    </button>
                  ))}
                </div>

                {uploadMode === "url" ? (
                  <input name="image" value={editForm.image} onChange={handleEditChange}
                    placeholder="https://..." className={inputCls} />
                ) : (
                  <label htmlFor="edit-image-upload"
                    className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-white/10 hover:border-white/30 cursor-pointer py-8 transition">
                    {(imagePreview || editForm.image) ? (
                      <img src={imagePreview || editForm.image} alt="preview" className="w-32 h-32 object-cover" />
                    ) : (
                      <>
                        <Upload className="w-7 h-7 text-white/20" />
                        <p className="text-sm text-white/40">Click to upload</p>
                        <p className="text-xs text-white/20">PNG, JPG, WEBP — max 5MB</p>
                      </>
                    )}
                    <input id="edit-image-upload" type="file" accept="image/*" onChange={handleImageFile} className="hidden" />
                  </label>
                )}

                {/* Current image preview */}
                {editForm.image && uploadMode === "url" && (
                  <div className="mt-2 flex items-center gap-3">
                    <img src={editForm.image} alt="current" className="w-12 h-12 object-cover bg-[#111]" />
                    <span className="text-xs text-white/30 truncate flex-1">{editForm.image}</span>
                  </div>
                )}
              </Field>

              <Field label="Description">
                <textarea name="description" value={editForm.description} onChange={handleEditChange}
                  rows={3} className={`${inputCls} resize-none`} />
              </Field>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditProduct(null)}
                  className="flex-1 py-3 border border-white/20 text-white/50 text-sm font-bold uppercase tracking-widest hover:border-white hover:text-white transition">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-3 bg-white text-black text-sm font-black uppercase tracking-widest hover:bg-gray-200 transition disabled:opacity-50">
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
