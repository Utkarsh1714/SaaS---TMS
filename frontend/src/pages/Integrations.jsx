import { Search, Slack, Github, Figma, Mail, Calendar, Database } from "lucide-react";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";

const Integrations = () => {
  const apps = [
    { name: "Slack", cat: "Communication", icon: <Slack/> },
    { name: "GitHub", cat: "Developer", icon: <Github/> },
    { name: "Figma", cat: "Design", icon: <Figma/> },
    { name: "Gmail", cat: "Communication", icon: <Mail/> },
    { name: "Google Cal", cat: "Productivity", icon: <Calendar/> },
    { name: "Notion", cat: "Docs", icon: <Database/> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <section className="pt-32 pb-10 lg:pt-48 text-center px-4">
         <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Connect your tools</h1>
         <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">Supercharge your workflow by connecting Taskify to the tools you use every day.</p>
         
         {/* Search Bar */}
         <div className="max-w-md mx-auto relative mb-20">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input type="text" placeholder="Search integrations..." className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none shadow-sm" />
         </div>

         {/* Grid */}
         <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {apps.map((app) => (
               <div key={app.name} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer flex items-center gap-4 group text-left">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                     {app.icon}
                  </div>
                  <div>
                     <h3 className="font-bold text-slate-900">{app.name}</h3>
                     <p className="text-sm text-slate-500">{app.cat}</p>
                  </div>
               </div>
            ))}
         </div>
      </section>
      <Footer />
    </div>
  );
};
export default Integrations;