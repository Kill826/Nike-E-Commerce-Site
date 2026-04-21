import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#111] text-gray-400 border-t border-white/10">

      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">

        <div>
          <h3 className="text-white font-black text-lg mb-5 tracking-widest">✦ JORDAN</h3>
          <p className="text-sm leading-relaxed">
            Inspired by the greatest. Built for the next generation.
          </p>
        </div>

        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4">Resources</h4>
          <ul className="space-y-2 text-sm">
            {["Find a Store", "Become a Member", "Send Feedback"].map((item) => (
              <li key={item} className="hover:text-white cursor-pointer transition">{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4">Help</h4>
          <ul className="space-y-2 text-sm">
            {["Order Status", "Delivery", "Returns", "Payment Options"].map((item) => (
              <li key={item} className="hover:text-white cursor-pointer transition">{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            {["About Jordan", "News", "Careers", "Investors"].map((item) => (
              <li key={item} className="hover:text-white cursor-pointer transition">{item}</li>
            ))}
          </ul>
        </div>

      </div>

      <div className="border-t border-white/10 text-xs text-center py-5 text-gray-600">
        &copy; 2026 Jordan Clone. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;
