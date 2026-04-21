import { useState, useEffect } from "react";
import { CheckCircle, Upload } from "lucide-react";

const API = "http://localhost:4000/api/home-settings";
const inputCls = "bg-[#111] border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-white/40 placeholder:text-white/20 transition w-full";
const labelCls = "text-[10px] uppercase tracking-[0.3em] text-white/30 font-semibold block mb-1.5";

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className={labelCls}>{label}</label>
    {children}
  </div>
);

const HomePage = () => {
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [files, setFiles] = useState({});

  const [bannerTitle, setBannerTitle] = useState("JUST DO THE WORK");
  const [bannerSubtitle, setBannerSubtitle] = useState("Jordan Brand");
  const [featuredLeftTitle, setFeaturedLeftTitle] = useState("Built For Champions");
  const [featuredLeftSubtitle, setFeaturedLeftSubtitle] = useState("Jordan Training");
  const [featuredLeftImage, setFeaturedLeftImage] = useState("");
  const [featuredRightTitle, setFeaturedRightTitle] = useState("Refresh Your Sneaker Rotation");
  const [featuredRightSubtitle, setFeaturedRightSubtitle] = useState("Best Sellers");
  const [spotlightTitle, setSpotlightTitle] = useState("SPOTLIGHT");
  const [spotlightDesc, setSpotlightDesc] = useState("Classic silhouettes and cutting-edge innovation to build your game from the ground up.");
  const [appBannerText, setAppBannerText] = useState("IT'S BETTER ON THE JORDAN APP");
  const [sections, setSections] = useState([
    { title: "Power For Every Run", subtitle: "Jordan Running", image: "", link: "/products?type=shoes" },
    { title: "Refresh Your Sneaker Rotation", subtitle: "Best Sellers", image: "", link: "/products?tag=best-sellers" },
    { title: "Athlete Picks", subtitle: "Jordan Brand", image: "", link: "/products" },
    { title: "Just Do the Work", subtitle: "Jordan Training", image: "", link: "/products?type=clothing" },
  ]);

  useEffect(() => {
    fetch(API).then(r => r.json()).then(data => {
      if (data.banner?.title) setBannerTitle(data.banner.title);
      if (data.banner?.subtitle) setBannerSubtitle(data.banner.subtitle);
      if (data.featured?.leftTitle) setFeaturedLeftTitle(data.featured.leftTitle);
      if (data.featured?.leftSubtitle) setFeaturedLeftSubtitle(data.featured.leftSubtitle);
      if (data.featured?.leftImage) setFeaturedLeftImage(data.featured.leftImage);
      if (data.featured?.rightTitle) setFeaturedRightTitle(data.featured.rightTitle);
      if (data.featured?.rightSubtitle) setFeaturedRightSubtitle(data.featured.rightSubtitle);
      if (data.spotlight?.title) setSpotlightTitle(data.spotlight.title);
      if (data.spotlight?.description) setSpotlightDesc(data.spotlight.description);
      if (data.appBanner?.text) setAppBannerText(data.appBanner.text);
      if (data.sections?.length) setSections(data.sections);
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    fd.append("bannerTitle", bannerTitle);
    fd.append("bannerSubtitle", bannerSubtitle);
    fd.append("featuredLeftTitle", featuredLeftTitle);
    fd.append("featuredLeftSubtitle", featuredLeftSubtitle);
    fd.append("featuredLeftImage", featuredLeftImage);
    fd.append("featuredRightTitle", featuredRightTitle);
    fd.append("featuredRightSubtitle", featuredRightSubtitle);
    fd.append("spotlightTitle", spotlightTitle);
    fd.append("spotlightDescription", spotlightDesc);
    fd.append("appBannerText", appBannerText);
    fd.append("sections", JSON.stringify(sections));
    if (files.leftImage) fd.append("leftImage", files.leftImage);
    sections.forEach((_, i) => { if (files[`section${i}`]) fd.append(`section${i}`, files[`section${i}`]); });

    try {
      await fetch(API, { method: "PUT", body: fd });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch { alert("Failed to save. Is the backend running?"); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <p className="text-[10px] text-white/20 uppercase tracking-[0.4em] mb-1">Admin</p>
        <h2 className="text-3xl font-black uppercase tracking-tight">Edit Home Page</h2>
      </div>

      {success && (
        <div className="flex items-center gap-3 bg-white text-black px-5 py-4 text-sm font-bold uppercase tracking-widest">
          <CheckCircle className="w-4 h-4" /> Saved successfully
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* HERO BANNER */}
        <div className="bg-[#1a1a1a] p-6 space-y-4">
          <p className="text-xs font-black uppercase tracking-widest text-white/50 border-b border-white/5 pb-3">Hero Banner</p>
          <Field label="Main Title"><input value={bannerTitle} onChange={e => setBannerTitle(e.target.value)} className={inputCls} /></Field>
          <Field label="Subtitle"><input value={bannerSubtitle} onChange={e => setBannerSubtitle(e.target.value)} className={inputCls} /></Field>
        </div>

        {/* FEATURED */}
        <div className="bg-[#1a1a1a] p-6 space-y-4">
          <p className="text-xs font-black uppercase tracking-widest text-white/50 border-b border-white/5 pb-3">Featured Section</p>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Left Title"><input value={featuredLeftTitle} onChange={e => setFeaturedLeftTitle(e.target.value)} className={inputCls} /></Field>
            <Field label="Left Subtitle"><input value={featuredLeftSubtitle} onChange={e => setFeaturedLeftSubtitle(e.target.value)} className={inputCls} /></Field>
          </div>
          <Field label="Left Image URL">
            <input value={featuredLeftImage} onChange={e => setFeaturedLeftImage(e.target.value)} placeholder="https://..." className={inputCls} />
          </Field>
          <label className="flex items-center gap-2 border border-dashed border-white/20 hover:border-white/40 px-4 py-3 cursor-pointer transition">
            <Upload className="w-4 h-4 text-white/30" />
            <span className="text-xs text-white/40">Or upload left image</span>
            <input type="file" accept="image/*" className="hidden" onChange={e => {
              const file = e.target.files?.[0];
              if (file) setFiles(p => ({ ...p, leftImage: file }));
            }} />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Right Title"><input value={featuredRightTitle} onChange={e => setFeaturedRightTitle(e.target.value)} className={inputCls} /></Field>
            <Field label="Right Subtitle"><input value={featuredRightSubtitle} onChange={e => setFeaturedRightSubtitle(e.target.value)} className={inputCls} /></Field>
          </div>
        </div>

        {/* BANNER CARDS */}
        <div className="bg-[#1a1a1a] p-6 space-y-6">
          <p className="text-xs font-black uppercase tracking-widest text-white/50 border-b border-white/5 pb-3">Banner Cards</p>
          {sections.map((s, i) => (
            <div key={i} className="space-y-3 border-b border-white/5 pb-5 last:border-0 last:pb-0">
              <p className="text-[10px] text-white/30 uppercase tracking-widest">Card {i + 1}</p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Title"><input value={s.title} onChange={e => setSections(prev => prev.map((x,j) => j===i ? {...x,title:e.target.value} : x))} className={inputCls} /></Field>
                <Field label="Subtitle"><input value={s.subtitle} onChange={e => setSections(prev => prev.map((x,j) => j===i ? {...x,subtitle:e.target.value} : x))} className={inputCls} /></Field>
              </div>
              <Field label="Image URL">
                <input value={s.image} onChange={e => setSections(prev => prev.map((x,j) => j===i ? {...x,image:e.target.value} : x))} placeholder="https://..." className={inputCls} />
              </Field>
              <label className="flex items-center gap-2 border border-dashed border-white/20 hover:border-white/40 px-4 py-3 cursor-pointer transition">
                <Upload className="w-4 h-4 text-white/30" />
                <span className="text-xs text-white/40">Upload image for card {i+1}</span>
                <input type="file" accept="image/*" className="hidden" onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) setFiles(p => ({ ...p, [`section${i}`]: file }));
                }} />
              </label>
            </div>
          ))}
        </div>

        {/* SPOTLIGHT */}
        <div className="bg-[#1a1a1a] p-6 space-y-4">
          <p className="text-xs font-black uppercase tracking-widest text-white/50 border-b border-white/5 pb-3">Spotlight Section</p>
          <Field label="Title"><input value={spotlightTitle} onChange={e => setSpotlightTitle(e.target.value)} className={inputCls} /></Field>
          <Field label="Description"><textarea value={spotlightDesc} onChange={e => setSpotlightDesc(e.target.value)} rows={2} className={`${inputCls} resize-none`} /></Field>
        </div>

        {/* APP BANNER */}
        <div className="bg-[#1a1a1a] p-6 space-y-4">
          <p className="text-xs font-black uppercase tracking-widest text-white/50 border-b border-white/5 pb-3">App Banner Text</p>
          <Field label="Text"><input value={appBannerText} onChange={e => setAppBannerText(e.target.value)} className={inputCls} /></Field>
        </div>

        <button type="submit" disabled={saving}
          className="w-full py-4 bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition disabled:opacity-40">
          {saving ? "Saving..." : "Save Home Page"}
        </button>
      </form>
    </div>
  );
};

export default HomePage;
