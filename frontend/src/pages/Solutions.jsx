import { motion } from "framer-motion";
import { 
  Code2, 
  PenTool, 
  Megaphone, 
  Briefcase, 
  Rocket, 
  Building, 
  ArrowRight,
  CheckCircle2
} from "lucide-react";

import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";
import AnimatedContent from "@/components/ui/AnimatedContent";

const Solutions = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-blue-100">
      <Navbar />

      {/* --- HERO --- */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-24 overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 text-center">
          <AnimatedContent direction="vertical" distance={20}>
            <h2 className="text-blue-600 font-bold tracking-wide uppercase text-sm mb-4">
              Solutions
            </h2>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight">
              Built for the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
                way you work.
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-12">
              Whether you're shipping code, running campaigns, or scaling a startup, Taskify adapts to your unique workflow.
            </p>
          </AnimatedContent>
        </div>
      </section>

      {/* --- TEAMS GRID (BENTO STYLE) --- */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
         <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
               
               <TeamCard 
                 icon={<Code2 />} 
                 title="Engineering" 
                 desc="Ship faster with Sprint planning, bug tracking, and GitHub integration."
                 color="bg-blue-600"
                 className="md:col-span-2"
                 features={['Agile Workflows', 'Git Integration', 'Backlog Management']}
               />
               
               <TeamCard 
                 icon={<PenTool />} 
                 title="Design" 
                 desc="Manage creative requests and versioning in one visual board."
                 color="bg-pink-600"
                 className="md:col-span-1"
               />
               
               <TeamCard 
                 icon={<Megaphone />} 
                 title="Marketing" 
                 desc="Launch campaigns on time with calendars and asset management."
                 color="bg-orange-500"
                 className="md:col-span-1"
               />

               <TeamCard 
                 icon={<Briefcase />} 
                 title="Product" 
                 desc="Roadmap planning and feature prioritization made simple."
                 color="bg-purple-600"
                 className="md:col-span-2"
                 features={['Roadmaps', 'User Feedback', 'Spec Docs']}
               />
            </div>
         </div>
      </section>

      {/* --- COMPANY SIZE SECTION --- */}
      <section className="py-24 bg-white border-t border-slate-100">
         <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-bold text-slate-900">Scale without breaking</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
               <ScaleCard 
                  icon={<Rocket className="w-8 h-8 text-blue-600" />}
                  title="Startups"
                  desc="Move fast and stay organized. All the essential tools you need to find product-market fit without the enterprise bloat."
                  list={['Free for up to 10 users', 'Basic Analytics', 'Rapid Setup']}
               />
               <ScaleCard 
                  icon={<Building className="w-8 h-8 text-indigo-600" />}
                  title="Enterprise"
                  desc="Bank-grade security, SSO, and dedicated support for organizations operating at global scale."
                  list={['SAML/SSO', 'Audit Logs', 'Dedicated Success Manager']}
               />
            </div>
         </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-24 px-4 bg-slate-900 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto">
           <h2 className="text-4xl font-bold text-white mb-8">Find your flow.</h2>
           <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/registration" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-slate-900 bg-white rounded-xl hover:bg-blue-50 transition-all">
                  Get Started
              </a>
              <a href="/contact" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white border border-slate-700 rounded-xl hover:bg-slate-800 transition-all">
                  Contact Sales
              </a>
           </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// Sub-Components

const TeamCard = ({ icon, title, desc, color, className, features = [] }) => (
  <AnimatedContent scale={0.95}>
    <div className={`group h-full p-8 rounded-3xl bg-white border border-slate-200 hover:border-blue-200 hover:shadow-xl transition-all duration-300 relative overflow-hidden ${className}`}>
       <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-white shadow-lg ${color}`}>
          {icon}
       </div>
       <h3 className="text-2xl font-bold text-slate-900 mb-3">{title}</h3>
       <p className="text-slate-600 mb-6 text-lg">{desc}</p>
       
       {features.length > 0 && (
          <div className="space-y-2 pt-4 border-t border-slate-100">
             {features.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-sm font-medium text-slate-500">
                   <CheckCircle2 size={16} className="text-blue-500" /> {f}
                </div>
             ))}
          </div>
       )}
       
       {/* Hover Effect */}
       <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-bl-full -mr-10 -mt-10"></div>
    </div>
  </AnimatedContent>
);

const ScaleCard = ({ icon, title, desc, list }) => (
  <div className="flex flex-col sm:flex-row gap-6 p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-lg transition-all">
     <div className="shrink-0">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
           {icon}
        </div>
     </div>
     <div>
        <h3 className="text-2xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-600 mb-6 leading-relaxed">{desc}</p>
        <ul className="space-y-3">
           {list.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-slate-700 font-medium">
                 <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> {item}
              </li>
           ))}
        </ul>
     </div>
  </div>
);

export default Solutions;