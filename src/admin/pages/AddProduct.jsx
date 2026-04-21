import { useState } from "react";
import { addProduct } from "../services/productService";
import { ImageIcon, CheckCircle, Upload, X } from "lucide-react";

const GENDER_TYPES = {
  men: ["shoes", "clothing", "accessories"],
  women: ["shoes", "clothing", "accessories"],
  kids: ["shoes", "clothing", "accessories"],
};

const SIZES = {
  shoes_men: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
  shoes_women: [3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8],
  shoes_kids: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5],
  clothing: ["XS", "S", "M", "L", "XL", "XXL"],
  clothing_kids: ["4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"],
  accessories: ["One Size"],
};

const getSizes = (gender, type) => {
  if (type === "accessories") return SIZES.accessories;
  if (type === "clothing") return gender === "kids" ? SIZES.clothing_kids : SIZES.clothing;
  if (type === "shoes") {
    if (gender === "kids") return SIZES.shoes_kids;
    if (gender === "women") return SIZES.shoes_women;
    return SIZES.shoes_men;
  }
  return [];
};

const TAGS = ["Just In", "New", "Best Seller", "Trending", "Iconic", "Performance", "None"];
const SEASONS = ["summer", "winter", "all-season"];

const EMPTY = {
  name: "", price: "", image: "",
  gender: "men", type: "shoes",
  tag: "None", season: "all-season",
  description: "",
};

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-semibold">{label}</label>
    {children}
  </div>
);

const inputCls = "bg-[#111] border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-white/40 placeholder:text-white/20 transition";
const selectCls = `${inputCls} appearance-none cursor-pointer`;

const AddProduct = () => {
  const [product, setProduct] = useState(EMPTY);
  const [success, setSuccess] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadMode, setUploadMode] = useState("url");
  const [extraImages, setExtraImages] = useState([]); // [{file, preview, url}]

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => {
      const next = { ...prev, [name]: value };
      // reset type if gender changes and type is invalid
      if (name === "gender" && !GENDER_TYPES[value].includes(prev.type)) {
        next.type = "shoes";
      }
      return next;
    });
  };

  const handleImageFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    setImageFile(file);

    // Show local preview immediately
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);

    // Upload to server
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res  = await fetch("http://localhost:4000/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setProduct((prev) => ({ ...prev, image: `http://localhost:4000${data.url}` }));
    } catch (err) {
      alert("Upload failed: " + err.message);
      clearImage();
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview("");
    setProduct((prev) => ({ ...prev, image: "" }));
  };

  const handleExtraImages = async (e) => {
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;
      const preview = await new Promise((res) => { const r = new FileReader(); r.onloadend = () => res(r.result); r.readAsDataURL(file); });
      const fd = new FormData(); fd.append("image", file);
      try {
        const resp = await fetch("http://localhost:4000/api/upload", { method: "POST", body: fd });
        const data = await resp.json();
        if (resp.ok) setExtraImages((p) => [...p, { preview, url: `http://localhost:4000${data.url}` }]);
      } catch { /* skip failed */ }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!product.name || !product.price || !product.image) return;

    const sizes = getSizes(product.gender, product.type);
    addProduct({
      ...product,
      price: Number(product.price),
      tag: product.tag === "None" ? null : product.tag,
      sizes,
      images: extraImages.map((i) => i.url),
      category: `${product.gender.charAt(0).toUpperCase() + product.gender.slice(1)}'s ${product.type.charAt(0).toUpperCase() + product.type.slice(1)}`,
    }).then(() => {
      setSuccess(true);
      setProduct(EMPTY);
      clearImage();
      setExtraImages([]);
      setTimeout(() => setSuccess(false), 3000);
    }).catch(() => alert("Failed to add product. Is the server running?"));
  };

  const sizes = getSizes(product.gender, product.type);

  return (
    <div className="max-w-2xl space-y-8">

      {/* HEADING */}
      <div>
        <p className="text-[10px] text-white/20 uppercase tracking-[0.4em] mb-1">Admin</p>
        <h2 className="text-3xl font-black uppercase tracking-tight">Add Product</h2>
      </div>

      {/* SUCCESS BANNER */}
      {success && (
        <div className="flex items-center gap-3 bg-white text-black px-5 py-4 text-sm font-bold uppercase tracking-widest">
          <CheckCircle className="w-4 h-4" />
          Product added successfully
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* NAME */}
        <Field label="Product Name">
          <input name="name" value={product.name} onChange={handleChange}
            placeholder="e.g. Air Jordan 1 Retro High OG" className={inputCls} required />
        </Field>

        {/* PRICE */}
        <Field label="Price (₹)">
          <input name="price" type="number" value={product.price} onChange={handleChange}
            placeholder="e.g. 9999" className={inputCls} required />
        </Field>

        {/* GENDER + TYPE */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Gender">
            <select name="gender" value={product.gender} onChange={handleChange} className={selectCls}>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
            </select>
          </Field>
          <Field label="Type">
            <select name="type" value={product.type} onChange={handleChange} className={selectCls}>
              {GENDER_TYPES[product.gender].map((t) => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </Field>
        </div>

        {/* TAG + SEASON */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Tag">
            <select name="tag" value={product.tag} onChange={handleChange} className={selectCls}>
              {TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Season">
            <select name="season" value={product.season} onChange={handleChange} className={selectCls}>
              {SEASONS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </Field>
        </div>

        {/* SIZES PREVIEW */}
        <Field label={`Sizes (auto-assigned for ${product.gender} ${product.type})`}>
          <div className="flex flex-wrap gap-2 bg-[#111] border border-white/10 px-4 py-3">
            {sizes.map((s) => (
              <span key={s} className="text-xs bg-white/10 text-white/60 px-2.5 py-1 font-mono">{s}</span>
            ))}
          </div>
        </Field>

        {/* IMAGE — toggle between URL and file upload */}
        <Field label="Product Image">
          {/* Toggle */}
          <div className="flex mb-3 border border-white/10">
            {[{ val: "url", label: "Image URL" }, { val: "file", label: "Upload from Device" }].map(({ val, label }) => (
              <button key={val} type="button"
                onClick={() => { setUploadMode(val); clearImage(); }}
                className={`flex-1 py-2.5 text-xs font-black uppercase tracking-widest transition ${
                  uploadMode === val ? "bg-white text-black" : "text-white/30 hover:text-white"
                }`}>
                {label}
              </button>
            ))}
          </div>

          {uploadMode === "url" ? (
            <input name="image" value={product.image} onChange={handleChange}
              placeholder="https://images.unsplash.com/..." className={inputCls} />
          ) : (
            <div>
              {/* Drop zone */}
              <label
                htmlFor="image-upload"
                className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed cursor-pointer transition py-10 ${
                  imagePreview ? "border-white/20" : "border-white/10 hover:border-white/30"
                }`}
              >
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="preview" className="w-40 h-40 object-cover" />
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); clearImage(); }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-white/20" />
                    <div className="text-center">
                      <p className="text-sm text-white/40">Click to upload or drag & drop</p>
                      <p className="text-xs text-white/20 mt-1">PNG, JPG, WEBP — max 5MB</p>
                    </div>
                  </>
                )}
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageFile}
                className="hidden"
              />
              {imageFile && (
                <p className="text-xs text-white/30 mt-2 truncate">
                  {imageFile.name} ({(imageFile.size / 1024).toFixed(0)} KB)
                </p>
              )}
            </div>
          )}
        </Field>

        {/* EXTRA IMAGES */}
        <Field label="Additional Images (optional, up to 5)">
          <div className="flex flex-wrap gap-2 mb-2">
            {extraImages.map((img, i) => (
              <div key={i} className="relative w-16 h-16">
                <img src={img.preview} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setExtraImages((p) => p.filter((_, j) => j !== i))}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <X className="w-2.5 h-2.5 text-white" />
                </button>
              </div>
            ))}
            {extraImages.length < 5 && (
              <label className="w-16 h-16 border-2 border-dashed border-white/20 hover:border-white/40 flex items-center justify-center cursor-pointer transition">
                <Upload className="w-5 h-5 text-white/30" />
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleExtraImages} />
              </label>
            )}
          </div>
          <p className="text-[10px] text-white/20">These will show as additional views on the product page</p>
        </Field>

        {/* DESCRIPTION */}
        <Field label="Description">
          <textarea name="description" value={product.description} onChange={handleChange}
            rows={3} placeholder="Short product description..."
            className={`${inputCls} resize-none`} />
        </Field>

        {/* SUBMIT */}
        <button type="submit"
          className="w-full bg-white text-black text-sm font-black uppercase tracking-widest py-4 hover:bg-red-500 hover:text-white transition-colors duration-200">
          Add Product
        </button>

      </form>
    </div>
  );
};

export default AddProduct;
