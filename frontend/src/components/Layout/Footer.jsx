// import React from "react";
// import { Link } from "react-router-dom";

// const Footer = () => {
//   return (
//     <footer className="bg-gray-800 text-white">
//       <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//           <div className="mb-8 md:mb-0">
//             <h1 className="text-xl font-bold">Taskify</h1>
//             <p className="mt-4 text-gray-400 text-sm">
//               All-in-one workspace for organizations to manage tasks,
//               departments, employees, meetings, and communications.
//             </p>
//             <div className="mt-4 flex space-x-6">
//               <a href="#" className="text-gray-400 hover:text-white">
//                 <span className="sr-only">Facebook</span>
//                 <svg
//                   className="h-6 w-6"
//                   fill="currentColor"
//                   viewBox="0 0 24 24"
//                   aria-hidden="true"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </a>
//               <a href="#" className="text-gray-400 hover:text-white">
//                 <span className="sr-only">Twitter</span>
//                 <svg
//                   className="h-6 w-6"
//                   fill="currentColor"
//                   viewBox="0 0 24 24"
//                   aria-hidden="true"
//                 >
//                   <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
//                 </svg>
//               </a>
//               <a href="#" className="text-gray-400 hover:text-white">
//                 <span className="sr-only">LinkedIn</span>
//                 <svg
//                   className="h-6 w-6"
//                   fill="currentColor"
//                   viewBox="0 0 24 24"
//                   aria-hidden="true"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M19.7 3H4.3A1.3 1.3 0 003 4.3v15.4A1.3 1.3 0 004.3 21h15.4a1.3 1.3 0 001.3-1.3V4.3A1.3 1.3 0 0019.7 3zM8.339 18.338H5.667v-8.59h2.672v8.59zM7.004 8.574a1.548 1.548 0 11-.002-3.096 1.548 1.548 0 01.002 3.096zm11.335 9.764H15.67v-4.177c0-.996-.017-2.278-1.387-2.278-1.389 0-1.601 1.086-1.601 2.206v4.249h-2.667v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.779 3.203 4.092v4.711z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </a>
//             </div>
//           </div>
//           <div>
//             <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
//               Product
//             </h3>
//             <ul className="mt-4 space-y-4">
//               <li>
//                 <Link to="/plans" className="text-gray-400 hover:text-white">
//                   Pricing
//                 </Link>
//               </li>
//               <li>
//                 <a href="#" className="text-gray-400 hover:text-white">
//                   Features
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="text-gray-400 hover:text-white">
//                   Security
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="text-gray-400 hover:text-white">
//                   Roadmap
//                 </a>
//               </li>
//             </ul>
//           </div>
//           <div>
//             <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
//               Support
//             </h3>
//             <ul className="mt-4 space-y-4">
//               <li>
//                 <a href="#" className="text-gray-400 hover:text-white">
//                   Documentation
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="text-gray-400 hover:text-white">
//                   Guides
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="text-gray-400 hover:text-white">
//                   API Status
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="text-gray-400 hover:text-white">
//                   Contact Us
//                 </a>
//               </li>
//             </ul>
//           </div>
//           <div>
//             <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
//               Company
//             </h3>
//             <ul className="mt-4 space-y-4">
//               <li>
//                 <Link to="#" className="text-gray-400 hover:text-white">
//                   About
//                 </Link>
//               </li>
//               <li>
//                 <a href="#" className="text-gray-400 hover:text-white">
//                   Blog
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="text-gray-400 hover:text-white">
//                   Careers
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="text-gray-400 hover:text-white">
//                   Press
//                 </a>
//               </li>
//             </ul>
//           </div>
//         </div>
//         <div className="mt-12 border-t border-gray-700 pt-8">
//           <p className="text-base text-gray-400 text-center">
//             &copy; 2025 Taskify, Inc. All rights reserved.
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;






// import React from "react";
// import { Link } from "react-router-dom";
// import { Layers, Github, Twitter, Linkedin } from "lucide-react";

// const Footer = () => {
//   return (
//     <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
//       <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
//           {/* Brand Column */}
//           <div className="col-span-1 md:col-span-1">
//              <Link to="/" className="flex items-center gap-2 mb-4">
//                 <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
//                   <Layers className="text-white w-5 h-5" />
//                 </div>
//                 <span className="text-xl font-bold text-white tracking-tight">
//                   Task<span className="text-blue-500">ify</span>
//                 </span>
//               </Link>
//             <p className="text-slate-400 text-sm leading-relaxed">
//               The operating system for modern organizations. Manage less, do more.
//             </p>
//             <div className="mt-6 flex space-x-4">
//               <SocialIcon icon={<Twitter size={20} />} />
//               <SocialIcon icon={<Github size={20} />} />
//               <SocialIcon icon={<Linkedin size={20} />} />
//             </div>
//           </div>

//           {/* Links Columns */}
//           <FooterColumn 
//             title="Product" 
//             links={["Features", "Integrations", "Pricing", "Changelog"]} 
//             url={['/#', '/#', '/plans', '/#']}
//           />
//           <FooterColumn 
//             title="Company" 
//             links={["About Us", "Careers", "Blog", "Contact"]}
//             url={['/#', '/#', '/#', '/#']}
//           />
//           <FooterColumn 
//             title="Legal" 
//             links={["Privacy Policy", "Terms of Service", "Security", "Status"]} 
//             url={['/#', '/#', '/#', '/#']}
//           />
//         </div>

//         <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
//           <p className="text-sm text-slate-500">
//             &copy; {new Date().getFullYear()} Taskify Inc. All rights reserved.
//           </p>
//           <div className="flex gap-6 text-sm text-slate-500">
//             <a href="#" className="hover:text-white transition-colors">Privacy</a>
//             <a href="#" className="hover:text-white transition-colors">Terms</a>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// const FooterColumn = ({ title, links, url }) => (
//   <div>
//     <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
//       {title}
//     </h3>
//     <ul className="space-y-3">
//       {links.map((link) => (
//         <li key={link}>
//           <a href={url} className="text-sm text-slate-400 hover:text-blue-400 transition-colors">
//             {link}
//           </a>
//         </li>
//       ))}
//     </ul>
//   </div>
// );

// const SocialIcon = ({ icon }) => (
//   <a href="#" className="text-slate-400 hover:text-white hover:scale-110 transition-all">
//     {icon}
//   </a>
// );

// export default Footer;







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
              { name: "Security", to: "/security" },
              { name: "Status", to: "/status" }
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