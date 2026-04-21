import { useState, useEffect } from "react";
import { CheckCircle, Pencil, X, Upload, Save } from "lucide-react";

const API = "http://localhost:4000/api/home-settings";
const UPLOAD_API = "http://localhost:4000/api/upload";

const uploadImg = async (file) => {
  const fd = new FormData();
  fd.append("image", file);
  const res = await fetch(UPLOAD_API, { method: "POST", body: fd });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Server error ${res.status}`);
  return `http://localhost:4000${data.url}`;
};

// Editable overlay wrapper — shows pencil on hover, opens modal on click
const Editable = ({ children, onEdit, label }) => (
  <div className="relative group/edit">
    {children}
    <button
      type="button"
      onClick={onEdit}
      className="absolute top-2 right-2 z-20 opacity-0 group-hover/edit:opacity-100 transition-opacity bg-white text-black rounded-full px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 shadow-lg"
    >
      <Pencil className="w-3 h-3" /> Edit {label}
    </button>
  </div>
);

// Modal for editing a section
const EditModal = ({ title, fields, values, onChange, onSave, onClose, onUpload }) => (
  <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="bg-[#111] border border-white/10 rounded-xl w-full max-w-lg shadow-2xl">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <h3 className="font-black uppercase tracking-widest text-sm">{title}</h3>
        <button onClick={onClose} className="text-white/40 hover:text-white transition"><X className="w-5 h-5" /></button>
      </div>
      <div className="px-6 py-5 space-y-4">
        {fields.map(f => (
          <div key={f.key}>
            <label className="text-[10px] uppercase tracking-widest text-white/30 block mb-1.5">{f.label}</label>
            {f.type === "textarea" ? (
              <textarea value={values[f.key] || ""} onChange={e => onChange(f.key, e.target.value)}
                rows={3} className="w-full bg-[#0d0d0d] border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-white/40 resize-none rounded" />
            ) : f.type === "image" ? (
              <div className="space-y-2">
                <input value={values[f.key] || ""} onChange={e => onChange(f.key, e.target.value)}
                  placeholder="Image URL" className="w-full bg-[#0d0d0d] border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-white/40 rounded" />
                <label className="flex items-center gap-2 border border-dashed border-white/20 hover:border-white/40 px-4 py-2.5 cursor-pointer transition rounded text-xs text-white/40 hover:text-white">
                  <Upload className="w-3.5 h-3.5" /> Upload image
                  <input type="file" accept="image/*" className="hidden" onChange={async e => {
                    const file = e.target.files?.[0]; if (!file) return;
                    try { onChange(f.key, await uploadImg(file)); } catch { alert("Upload failed"); }
                  }} />
                </label>
                {values[f.key] && <img src={values[f.key]} alt="" className="h-24 w-full object-cover rounded opacity-80" />}
              </div>
            ) : (
              <input value={values[f.key] || ""} onChange={e => onChange(f.key, e.target.value)}
                className="w-full bg-[#0d0d0d] border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-white/40 rounded" />
            )}
          </div>
        ))}
      </div>
      <div className="px-6 pb-5">
        <button onClick={onSave}
          className="w-full py-3 bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition rounded">
          Save Changes
        </button>
      </div>
    </div>
  </div>
);

export default function HomePageEditor() {
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [modal, setModal] = useState(null); // { title, fields, stateKey }
  const [modalVals, setModalVals] = useState({});

  const [data, setData] = useState({
    heroMedia: [{ type: "video", src: "/hero.mp4", title: "JUST DO THE WORK", subtitle: "Jordan Brand" }],
    bannerTitle: "JUST DO THE WORK",
    bannerSubtitle: "Jordan Brand",
    featuredLeftTitle: "Built For Champions",
    featuredLeftSubtitle: "Jordan Training",
    featuredLeftImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=85",
    featuredRightTitle: "Refresh Your Sneaker Rotation",
    featuredRightSubtitle: "Best Sellers",
    featuredRightImages: [],
    card0Title: "Power For Every Run", card0Subtitle: "Jordan Running",
    card0Image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=900&q=85", card0Link: "/products?type=shoes",
    card1Title: "Refresh Your Sneaker Rotation", card1Subtitle: "Best Sellers",
    card1Image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=85", card1Link: "/products?tag=best-sellers",
    card2Title: "Athlete Picks", card2Subtitle: "Jordan Brand",
    card2Image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=900&q=85", card2Link: "/products",
    card3Title: "Just Do the Work", card3Subtitle: "Jordan Training",
    card3Image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=85", card3Link: "/products?type=clothing",
    spotlightTitle: "SPOTLIGHT",
    spotlightDesc: "Classic silhouettes and cutting-edge innovation to build your game from the ground up.",
    appBannerText: "IT'S BETTER ON THE JORDAN APP",
    bestAirJordanTitle: "Best of Air Jordan",
    shopByStyleTitle: "Shop By Style",
    essentialsTitle: "The Essentials",
    gearUpTitle: "Gear Up",
    spotlightItems: [
      { label: "Air Jordan 1",  q: "q=Air%20Jordan%201",  image: "" },
      { label: "Air Jordan 4",  q: "q=Air%20Jordan%204",  image: "" },
      { label: "Graphic Tees",  q: "q=Graphic%20Tee",     image: "" },
      { label: "Hoodies",       q: "q=Hoodie",            image: "" },
      { label: "Tights",        q: "q=Tight",             image: "" },
      { label: "Backpacks",     q: "q=Backpack",          image: "" },
      { label: "Jackets",       q: "q=Jacket",            image: "" },
      { label: "Tracksuit",     q: "q=Tracksuit",         image: "" },
      { label: "Shorts",        q: "q=Short",             image: "" },
      { label: "Leggings",      q: "q=Legging",           image: "" },
      { label: "Socks",         q: "q=Sock",              image: "" },
      { label: "Caps",          q: "q=Cap",               image: "" },
      { label: "Jordan Tatum",  q: "q=Tatum",             image: "" },
      { label: "Sports Bras",   q: "q=Sport%20Bra",       image: "" },
      { label: "Duffel Bags",   q: "q=Duffel",            image: "" },
      { label: "T-Shirts",      q: "q=Tee",               image: "" },
    ],
  });

  useEffect(() => {
    fetch(API).then(r => r.json()).then(d => {
      if (!d.banner) return;
      setData(prev => ({
        ...prev,
        heroMedia: d.heroMedia?.length ? d.heroMedia : prev.heroMedia,
        bannerTitle: d.banner?.title || prev.bannerTitle,
        bannerSubtitle: d.banner?.subtitle || prev.bannerSubtitle,
        featuredLeftTitle: d.featured?.leftTitle || prev.featuredLeftTitle,
        featuredLeftSubtitle: d.featured?.leftSubtitle || prev.featuredLeftSubtitle,
        featuredLeftImage: d.featured?.leftImage || prev.featuredLeftImage,
        featuredRightTitle: d.featured?.rightTitle || prev.featuredRightTitle,
        featuredRightSubtitle: d.featured?.rightSubtitle || prev.featuredRightSubtitle,
        featuredRightImages: d.featured?.rightImages?.length ? d.featured.rightImages : prev.featuredRightImages,
        ...(d.sections?.[0] ? { card0Title: d.sections[0].title, card0Subtitle: d.sections[0].subtitle, card0Image: d.sections[0].image || prev.card0Image, card0Link: d.sections[0].link } : {}),
        ...(d.sections?.[1] ? { card1Title: d.sections[1].title, card1Subtitle: d.sections[1].subtitle, card1Image: d.sections[1].image || prev.card1Image, card1Link: d.sections[1].link } : {}),
        ...(d.sections?.[2] ? { card2Title: d.sections[2].title, card2Subtitle: d.sections[2].subtitle, card2Image: d.sections[2].image || prev.card2Image, card2Link: d.sections[2].link } : {}),
        ...(d.sections?.[3] ? { card3Title: d.sections[3].title, card3Subtitle: d.sections[3].subtitle, card3Image: d.sections[3].image || prev.card3Image, card3Link: d.sections[3].link } : {}),
        spotlightTitle: d.spotlight?.title || prev.spotlightTitle,
        spotlightDesc: d.spotlight?.description || prev.spotlightDesc,
        appBannerText: d.appBanner?.text || prev.appBannerText,
        bestAirJordanTitle: d.bestAirJordan?.title || prev.bestAirJordanTitle,
        shopByStyleTitle: d.shopByStyle?.title || prev.shopByStyleTitle,
        essentialsTitle: d.essentials?.title || prev.essentialsTitle,
        gearUpTitle: d.gearUp?.title || prev.gearUpTitle,
        spotlightItems: d.spotlightItems?.length ? d.spotlightItems : prev.spotlightItems,
      }));
    }).catch(() => {});
  }, []);

  const openModal = (title, fields) => {
    const vals = {};
    fields.forEach(f => { vals[f.key] = data[f.key] || ""; });
    setModalVals(vals);
    setModal({ title, fields });
  };

  const saveModal = () => {
    if (modal.onSave) {
      modal.onSave(modalVals);
    } else {
      setData(prev => ({ ...prev, ...modalVals }));
    }
    setModal(null);
  };

  const saveAll = async () => {
    setSaving(true);
    const fd = new FormData();
    fd.append("bannerTitle", data.bannerTitle);
    fd.append("bannerSubtitle", data.bannerSubtitle);
    fd.append("heroMedia", JSON.stringify(data.heroMedia));
    fd.append("featuredLeftTitle", data.featuredLeftTitle);
    fd.append("featuredLeftSubtitle", data.featuredLeftSubtitle);
    fd.append("featuredLeftImage", data.featuredLeftImage);
    fd.append("featuredRightTitle", data.featuredRightTitle);
    fd.append("featuredRightSubtitle", data.featuredRightSubtitle);
    fd.append("featuredRightImages", JSON.stringify(data.featuredRightImages));
    fd.append("spotlightTitle", data.spotlightTitle);
    fd.append("spotlightDescription", data.spotlightDesc);
    fd.append("appBannerText", data.appBannerText);
    fd.append("bestAirJordanTitle", data.bestAirJordanTitle);
    fd.append("shopByStyleTitle", data.shopByStyleTitle);
    fd.append("essentialsTitle", data.essentialsTitle);
    fd.append("gearUpTitle", data.gearUpTitle);
    fd.append("spotlightItems", JSON.stringify(data.spotlightItems));
    fd.append("sections", JSON.stringify([
      { title: data.card0Title, subtitle: data.card0Subtitle, image: data.card0Image, link: data.card0Link },
      { title: data.card1Title, subtitle: data.card1Subtitle, image: data.card1Image, link: data.card1Link },
      { title: data.card2Title, subtitle: data.card2Subtitle, image: data.card2Image, link: data.card2Link },
      { title: data.card3Title, subtitle: data.card3Subtitle, image: data.card3Image, link: data.card3Link },
    ]));
    try {
      await fetch(API, { method: "PUT", body: fd });
      setSuccess(true); setTimeout(() => setSuccess(false), 3000);
    } catch { alert("Save failed. Is backend running?"); }
    finally { setSaving(false); }
  };

  const BannerCard = ({ img, title, subtitle, cardN }) => (
    <Editable label="Card" onEdit={() => openModal(`Edit Card: ${title}`, [
      { key: `card${cardN}Title`, label: "Title", type: "text" },
      { key: `card${cardN}Subtitle`, label: "Subtitle", type: "text" },
      { key: `card${cardN}Image`, label: "Image", type: "image" },
      { key: `card${cardN}Link`, label: "Link", type: "text" },
    ])}>
      <div className="relative overflow-hidden h-[400px]">
        <img src={img} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute bottom-8 left-8 text-white">
          <p className="text-xs font-medium mb-1">{subtitle}</p>
          <h3 className="text-2xl font-black uppercase mb-4">{title}</h3>
          <button className="px-5 py-2 bg-white text-black text-sm font-medium rounded-full">Shop</button>
        </div>
      </div>
    </Editable>
  );

  return (
    <div className="text-white -m-8">

      {/* Sticky save bar */}
      <div className="sticky top-0 z-40 bg-[#0d0d0d]/95 backdrop-blur border-b border-white/10 px-8 py-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-white/30 uppercase tracking-widest">Admin · Home Page Editor</p>
          <p className="text-xs text-white/50 mt-0.5">Hover over any section to edit it</p>
        </div>
        <div className="flex items-center gap-3">
          {success && (
            <span className="flex items-center gap-1.5 text-green-400 text-xs font-semibold">
              <CheckCircle className="w-3.5 h-3.5" /> Saved!
            </span>
          )}
          <button onClick={saveAll} disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition disabled:opacity-40 rounded">
            <Save className="w-3.5 h-3.5" /> {saving ? "Saving..." : "Save All Changes"}
          </button>
        </div>
      </div>

      {/* ── HERO CAROUSEL MANAGER ── */}
      <Editable label="Hero Text" onEdit={() => openModal("Edit Hero Text", [
        { key: "bannerTitle", label: "Main Heading", type: "text" },
        { key: "bannerSubtitle", label: "Subtitle", type: "text" },
      ])}>
        <div className="relative h-[280px] bg-gray-900 overflow-hidden rounded-none">
          {data.heroMedia[0]?.type === "video"
            ? <video src={data.heroMedia[0].src} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-60" />
            : <img src={data.heroMedia[0]?.src} alt="" className="w-full h-full object-cover opacity-60" />
          }
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-end pb-8 px-8 z-10">
            <div className="text-white">
              <p className="text-xs mb-1 opacity-70">{data.bannerSubtitle}</p>
              <h1 className="text-3xl font-black uppercase">{data.bannerTitle}</h1>
            </div>
          </div>
          {data.heroMedia.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {data.heroMedia.map((_, i) => <div key={i} className={`h-1.5 rounded-full bg-white ${i === 0 ? "w-5" : "w-1.5 opacity-50"}`} />)}
            </div>
          )}
        </div>
      </Editable>

      {/* Hero Media Manager */}
      <div className="px-8 py-4 bg-[#1a1a1a] border-t border-white/5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-black uppercase tracking-widest text-white/50">Hero Media ({data.heroMedia.length} items) — Images & Videos</p>
          <div className="flex gap-2">
            <label className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded text-xs text-white/60 hover:text-white cursor-pointer transition">
              <Upload className="w-3 h-3" /> Add Image
              <input type="file" accept="image/*" className="hidden" onChange={async e => {
                const file = e.target.files?.[0]; if (!file) return;
                try {
                  const url = await uploadImg(file);
                  setData(prev => ({ ...prev, heroMedia: [...prev.heroMedia, { type: "image", src: url, title: "", subtitle: "" }] }));
                } catch(err) { alert("Upload failed: " + err.message); }
              }} />
            </label>
            <label className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded text-xs text-white/60 hover:text-white cursor-pointer transition">
              <Upload className="w-3 h-3" /> Add Video
              <input type="file" accept="video/*" className="hidden" onChange={async e => {
                const file = e.target.files?.[0]; if (!file) return;
                const fd2 = new FormData(); fd2.append("image", file);
                try {
                  const res = await fetch(UPLOAD_API, { method: "POST", body: fd2 });
                  const d2 = await res.json();
                  if (res.ok) setData(prev => ({ ...prev, heroMedia: [...prev.heroMedia, { type: "video", src: `http://localhost:4000${d2.url}` }] }));
                } catch { alert("Upload failed"); }
              }} />
            </label>
            <button type="button" onClick={() => {
              const url = prompt("Enter image or video URL:");
              if (!url) return;
              const type = url.match(/\.(mp4|webm|mov)$/i) ? "video" : "image";
              setData(prev => ({ ...prev, heroMedia: [...prev.heroMedia, { type, src: url }] }));
            }} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded text-xs text-white/60 hover:text-white transition">
              + URL
            </button>
          </div>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {data.heroMedia.map((m, i) => (
            <div key={i} className="relative shrink-0 w-32 h-20 bg-black rounded overflow-hidden border border-white/10 group/media">
              {m.type === "video"
                ? <video src={m.src} className="w-full h-full object-cover opacity-70" muted />
                : <img src={m.src} alt="" className="w-full h-full object-cover" />
              }
              <div className="absolute top-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider">
                {m.type}
              </div>
              <button type="button"
                onClick={() => {
                  setModal({ title: `Edit Slide ${i + 1} Text`, type: "heroSlide", index: i });
                  setModalVals({ title: m.title || "", subtitle: m.subtitle || "" });
                }}
                className="absolute bottom-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center opacity-0 group-hover/media:opacity-100 transition">
                <Pencil className="w-2.5 h-2.5 text-white" />
              </button>
              <button type="button"
                onClick={() => setData(prev => ({ ...prev, heroMedia: prev.heroMedia.filter((_, j) => j !== i) }))}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover/media:opacity-100 transition">
                <X className="w-3 h-3 text-white" />
              </button>
              <div className="absolute bottom-1 left-1 text-[9px] text-white/50">{i + 1}/{data.heroMedia.length}</div>
            </div>
          ))}
          {data.heroMedia.length === 0 && (
            <p className="text-white/20 text-xs py-4">No media added yet. Add images or videos above.</p>
          )}
        </div>
      </div>

      {/* ── FEATURED ── */}
      <section className="px-8 py-8">
        <h2 className="text-xl font-bold mb-4">Featured</h2>
        <div className="grid grid-cols-2 gap-3 h-[400px]">
          <Editable label="Left Card" onEdit={() => openModal("Edit Featured Left", [
            { key: "featuredLeftTitle", label: "Title", type: "text" },
            { key: "featuredLeftSubtitle", label: "Subtitle", type: "text" },
            { key: "featuredLeftImage", label: "Image", type: "image" },
          ])}>
            <div className="relative overflow-hidden h-full">
              <img src={data.featuredLeftImage} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 text-white">
                <p className="text-xs mb-1">{data.featuredLeftSubtitle}</p>
                <h3 className="text-2xl font-black uppercase mb-3">{data.featuredLeftTitle}</h3>
                <button className="px-5 py-2 bg-white text-black text-sm rounded-full">Shop</button>
              </div>
            </div>
          </Editable>

          <Editable label="Right Card" onEdit={() => {
            setModal({ title: "Edit Featured Right", type: "featuredRight" });
            setModalVals({ featuredRightTitle: data.featuredRightTitle, featuredRightSubtitle: data.featuredRightSubtitle, featuredRightImages: [...(data.featuredRightImages || [])] });
          }}>
            <div className="relative bg-[#e8eaed] flex flex-col justify-between p-8 h-full overflow-hidden">
              {data.featuredRightImages?.length > 0 && (
                <img src={data.featuredRightImages[0]} alt="" className="absolute inset-0 w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="relative z-10">
                <p className={`text-xs mb-1 ${data.featuredRightImages?.length ? "text-white/70" : "text-gray-500"}`}>{data.featuredRightSubtitle}</p>
                <h3 className={`text-2xl font-black uppercase mb-4 ${data.featuredRightImages?.length ? "text-white" : "text-black"}`}>{data.featuredRightTitle}</h3>
                <button className={`px-5 py-2 text-sm rounded-full ${data.featuredRightImages?.length ? "bg-white text-black" : "bg-black text-white"}`}>Shop</button>
              </div>
            </div>
          </Editable>
        </div>
      </section>

      {/* ── TWO HALF CARDS ── */}
      <section className="px-8 pb-3">
        <div className="grid grid-cols-2 gap-3">
          <BannerCard img={data.card0Image} title={data.card0Title} subtitle={data.card0Subtitle} cardN={0} />
          <BannerCard img={data.card1Image} title={data.card1Title} subtitle={data.card1Subtitle} cardN={1} />
        </div>
      </section>

      {/* ── TWO LARGE CARDS ── */}
      <section className="px-8 pb-8">
        <div className="grid grid-cols-2 gap-3">
          <Editable label="Card" onEdit={() => openModal(`Edit Card: ${data.card2Title}`, [
            { key: "card2Title", label: "Title", type: "text" },
            { key: "card2Subtitle", label: "Subtitle", type: "text" },
            { key: "card2Image", label: "Image", type: "image" },
            { key: "card2Link", label: "Link", type: "text" },
          ])}>
            <div className="relative overflow-hidden h-[400px]">
              <img src={data.card2Image} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 text-white">
                <p className="text-xs mb-1">{data.card2Subtitle}</p>
                <h3 className="text-2xl font-black uppercase mb-4">{data.card2Title}</h3>
                <button className="px-5 py-2 bg-white text-black text-sm rounded-full">Shop</button>
              </div>
            </div>
          </Editable>
          <Editable label="Card" onEdit={() => openModal(`Edit Card: ${data.card3Title}`, [
            { key: "card3Title", label: "Title", type: "text" },
            { key: "card3Subtitle", label: "Subtitle", type: "text" },
            { key: "card3Image", label: "Image", type: "image" },
            { key: "card3Link", label: "Link", type: "text" },
          ])}>
            <div className="relative overflow-hidden h-[400px]">
              <img src={data.card3Image} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 text-white">
                <p className="text-xs mb-1">{data.card3Subtitle}</p>
                <h3 className="text-2xl font-black uppercase mb-4">{data.card3Title}</h3>
                <button className="px-5 py-2 bg-white text-black text-sm rounded-full">Shop</button>
              </div>
            </div>
          </Editable>
        </div>
      </section>

      {/* ── APP BANNER ── */}
      <section className="px-8 py-4">
        <Editable label="App Banner" onEdit={() => openModal("Edit App Banner", [
          { key: "appBannerText", label: "Banner Text", type: "text" },
        ])}>
          <div className="bg-black flex items-center justify-center px-12 py-6 rounded-xl">
            <p className="text-2xl md:text-3xl font-black uppercase tracking-tight text-center text-white">{data.appBannerText}</p>
          </div>
        </Editable>
      </section>

      {/* ── BEST OF AIR JORDAN ── */}
      <section className="px-8 py-8">
        <Editable label="Section Title" onEdit={() => openModal("Edit Best of Air Jordan", [
          { key: "bestAirJordanTitle", label: "Section Title", type: "text" },
        ])}>
          <div className="border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black uppercase tracking-tight">{data.bestAirJordanTitle}</h2>
              <span className="text-xs text-white/30 uppercase tracking-widest">Shop All →</span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="bg-white/5 rounded-lg aspect-square flex items-center justify-center text-white/20 text-xs">Product {i}</div>
              ))}
            </div>
            <p className="text-[10px] text-white/20 mt-3 text-center uppercase tracking-widest">Products auto-loaded from your store</p>
          </div>
        </Editable>
      </section>

      {/* ── SHOP BY STYLE ── */}
      <section className="px-8 py-8">
        <Editable label="Section Title" onEdit={() => openModal("Edit Shop By Style", [
          { key: "shopByStyleTitle", label: "Section Title", type: "text" },
        ])}>
          <div className="border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black uppercase tracking-tight">{data.shopByStyleTitle}</h2>
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs">‹</div>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs">›</div>
              </div>
            </div>
            <div className="flex gap-3 overflow-hidden">
              {["Shoes","Clothing","Accessories","Men's","Women's","Kids'"].map(l => (
                <div key={l} className="shrink-0 w-40 h-32 bg-white/5 rounded-lg flex items-end p-3">
                  <span className="text-xs font-medium bg-white text-black px-3 py-1 rounded-full">Shop {l}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-white/20 mt-3 text-center uppercase tracking-widest">Images auto-loaded from your products</p>
          </div>
        </Editable>
      </section>

      {/* ── THE ESSENTIALS ── */}
      <section className="px-8 py-8">
        <Editable label="Section Title" onEdit={() => openModal("Edit The Essentials", [
          { key: "essentialsTitle", label: "Section Title", type: "text" },
        ])}>
          <div className="border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-black uppercase tracking-tight mb-4">{data.essentialsTitle}</h2>
            <div className="grid grid-cols-3 gap-3">
              {["Men's","Women's","Kids'"].map(l => (
                <div key={l} className="h-32 bg-white/5 rounded-lg flex items-end p-3">
                  <span className="text-xs font-medium bg-white text-black px-3 py-1 rounded-full">{l}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-white/20 mt-3 text-center uppercase tracking-widest">Images auto-loaded from your products</p>
          </div>
        </Editable>
      </section>

      {/* ── GEAR UP ── */}
      <section className="px-8 py-8">
        <Editable label="Section Title" onEdit={() => openModal("Edit Gear Up", [
          { key: "gearUpTitle", label: "Section Title", type: "text" },
        ])}>
          <div className="border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black uppercase tracking-tight">{data.gearUpTitle}</h2>
              <span className="text-xs text-white/30 uppercase tracking-widest">Shop All →</span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="bg-white/5 rounded-lg aspect-square flex items-center justify-center text-white/20 text-xs">Clothing {i}</div>
              ))}
            </div>
            <p className="text-[10px] text-white/20 mt-3 text-center uppercase tracking-widest">Clothing products auto-loaded from your store</p>
          </div>
        </Editable>
      </section>

      {/* ── SPOTLIGHT ── */}
      <section className="px-8 py-12">
        <Editable label="Spotlight" onEdit={() => openModal("Edit Spotlight", [
          { key: "spotlightTitle", label: "Title", type: "text" },
          { key: "spotlightDesc", label: "Description", type: "textarea" },
        ])}>
          <div className="text-center mb-8 relative">
            <h2 className="text-4xl font-black uppercase tracking-tight mb-3 text-black">{data.spotlightTitle}</h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto">{data.spotlightDesc}</p>
          </div>
        </Editable>

        {/* Spotlight Icons Grid — each editable */}
        <div className="grid grid-cols-8 gap-y-6 gap-x-2 max-w-4xl mx-auto">
          {data.spotlightItems.map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-2 group/icon relative">
              <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden border border-gray-200 relative">
                {item.image
                  ? <img src={item.image} alt={item.label} className="w-full h-full object-cover" />
                  : <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">?</div>
                }
                <button
                  type="button"
                  onClick={() => {
                    setModalVals({ [`si_label_${i}`]: item.label, [`si_q_${i}`]: item.q, [`si_image_${i}`]: item.image });
                    setModal({
                      title: `Edit Icon: ${item.label}`,
                      fields: [
                        { key: `si_label_${i}`, label: "Label", type: "text" },
                        { key: `si_q_${i}`, label: "Search Query (e.g. q=Hoodie)", type: "text" },
                        { key: `si_image_${i}`, label: "Image", type: "image" },
                      ],
                      onSave: (vals) => {
                        setData(prev => ({
                          ...prev,
                          spotlightItems: prev.spotlightItems.map((it, j) => j === i ? {
                            label: vals[`si_label_${i}`],
                            q: vals[`si_q_${i}`],
                            image: vals[`si_image_${i}`],
                          } : it),
                        }));
                      }
                    });
                  }}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover/icon:opacity-100 transition flex items-center justify-center rounded-full"
                >
                  <Pencil className="w-4 h-4 text-white" />
                </button>
              </div>
              <span className="text-[10px] text-center text-gray-700 font-semibold leading-tight">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Edit Modal */}
      {modal && modal.type === "heroSlide" ? (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h3 className="font-black uppercase tracking-widest text-sm">{modal.title}</h3>
              <button onClick={() => setModal(null)} className="text-white/40 hover:text-white transition"><X className="w-5 h-5" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-white/30 block mb-1.5">Heading</label>
                <input value={modalVals.title || ""} onChange={e => setModalVals(p => ({ ...p, title: e.target.value }))}
                  className="w-full bg-[#0d0d0d] border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-white/40 rounded" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-white/30 block mb-1.5">Subtitle</label>
                <input value={modalVals.subtitle || ""} onChange={e => setModalVals(p => ({ ...p, subtitle: e.target.value }))}
                  className="w-full bg-[#0d0d0d] border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-white/40 rounded" />
              </div>
            </div>
            <div className="px-6 pb-5">
              <button onClick={() => {
                setData(prev => {
                  const updated = [...prev.heroMedia];
                  updated[modal.index] = { ...updated[modal.index], title: modalVals.title, subtitle: modalVals.subtitle };
                  return { ...prev, heroMedia: updated };
                });
                setModal(null);
              }} className="w-full py-3 bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition rounded">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      ) : modal && modal.type === "featuredRight" ? (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h3 className="font-black uppercase tracking-widest text-sm">{modal.title}</h3>
              <button onClick={() => setModal(null)} className="text-white/40 hover:text-white transition"><X className="w-5 h-5" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-white/30 block mb-1.5">Title</label>
                <input value={modalVals.featuredRightTitle || ""} onChange={e => setModalVals(p => ({ ...p, featuredRightTitle: e.target.value }))}
                  className="w-full bg-[#0d0d0d] border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-white/40 rounded" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-white/30 block mb-1.5">Subtitle</label>
                <input value={modalVals.featuredRightSubtitle || ""} onChange={e => setModalVals(p => ({ ...p, featuredRightSubtitle: e.target.value }))}
                  className="w-full bg-[#0d0d0d] border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-white/40 rounded" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-white/30 block mb-1.5">Images (slideshow)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(modalVals.featuredRightImages || []).map((img, i) => (
                    <div key={i} className="relative w-20 h-16 rounded overflow-hidden border border-white/10 group/img">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setModalVals(p => ({ ...p, featuredRightImages: p.featuredRightImages.filter((_, j) => j !== i) }))}
                        className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition">
                        <X className="w-2.5 h-2.5 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
                <label className="flex items-center gap-2 border border-dashed border-white/20 hover:border-white/40 px-4 py-2.5 cursor-pointer transition rounded text-xs text-white/40 hover:text-white">
                  <Upload className="w-3.5 h-3.5" /> Upload image
                  <input type="file" accept="image/*" className="hidden" onChange={async e => {
                    const file = e.target.files?.[0]; if (!file) return;
                    try {
                      const url = await uploadImg(file);
                      setModalVals(p => ({ ...p, featuredRightImages: [...(p.featuredRightImages || []), url] }));
                    } catch(err) { alert("Upload failed: " + err.message); }
                  }} />
                </label>
              </div>
            </div>
            <div className="px-6 pb-5">
              <button onClick={() => { setData(p => ({ ...p, featuredRightTitle: modalVals.featuredRightTitle, featuredRightSubtitle: modalVals.featuredRightSubtitle, featuredRightImages: modalVals.featuredRightImages })); setModal(null); }}
                className="w-full py-3 bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition rounded">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      ) : modal && (
        <EditModal
          title={modal.title}
          fields={modal.fields}
          values={modalVals}
          onChange={(k, v) => setModalVals(p => ({ ...p, [k]: v }))}
          onSave={saveModal}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
