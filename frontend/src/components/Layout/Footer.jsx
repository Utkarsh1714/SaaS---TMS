import React from "react";
import { Link } from "react-router-dom";
import { Layers, Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
             <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Layers className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">
                  Task<span className="text-blue-500">ify</span>
                </span>
              </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              The operating system for modern organizations. Manage less, do more.
            </p>
            <div className="mt-6 flex space-x-4">
              <SocialIcon icon={<Twitter size={20} />} href="https://twitter.com" />
              <SocialIcon icon={<Github size={20} />} href="https://github.com" />
              <SocialIcon icon={<Linkedin size={20} />} href="https://linkedin.com" />
            </div>
          </div>

          {/* Links Columns - PASS DATA AS OBJECTS */}
          <FooterColumn 
            title="Product" 
            items={[
              { name: "Features", to: "/integrations" }, // Use anchors for sections
              { name: "Integrations", to: "/integrations" },
              { name: "Pricing", to: "/plans" }, // Correct internal link
              { name: "Changelog", to: "/changelog" }
            ]} 
          />
          <FooterColumn 
            title="Company" 
            items={[
              { name: "About Us", to: "/about" },
              { name: "Careers", to: "/careers" },
              { name: "Blog", to: "/integrations" },
              { name: "Contact", to: "/contact" }
            ]}
          />
          <FooterColumn 
            title="Legal" 
            items={[
              { name: "Privacy Policy", to: "/privacy" },
              { name: "Terms of Service", to: "/terms" },
              { name: "Cancellation & Refund", to: "/cancellation-refund" },
              { name: "Shipping Policy", to: "/shipping-policy" }
            ]}
          />
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Taskify Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ✅ UPDATED COMPONENT: Accepts 'items' array of objects
const FooterColumn = ({ title, items }) => (
  <div>
    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
      {title}
    </h3>
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.name}>
          {/* Use Link for internal navigation to prevent page reload */}
          <Link 
            to={item.to} 
            className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
          >
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

// Helper for external social links (Use <a> here because they go outside your site)
const SocialIcon = ({ icon, href }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className="text-slate-400 hover:text-white hover:scale-110 transition-all"
  >
    {icon}
  </a>
);

export default Footer;