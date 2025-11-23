import { motion } from "framer-motion";
import { 
  CheckSquare, 
  MessageSquare, 
  FileText, 
  Zap, 
  Layout, 
  GitBranch, 
  Slack, 
  Trello, 
  ArrowRight 
} from "lucide-react";

import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";
import AnimatedContent from "@/components/ui/AnimatedContent";

const Product = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-blue-100">
      <Navbar />

      {/* --- HERO --- */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden relative">
         {/* Background Grids */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        
        <div className="max-w-7xl mx-auto px-4 text-center">
          <AnimatedContent direction="vertical" distance={20}>
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-8">
               <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">The Platform</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-[0.95]">
              One OS for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                every workflow.
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed">
              Taskify isn't just a task manager. It's a complete operating system designed to replace your fragmented tool stack.
            </p>
          </AnimatedContent>
        </div>
      </section>

      {/* --- DEEP DIVE SECTIONS --- */}
      <div className="space-y-24 pb-24">
        
        {/* Feature 1: Tasks */}
        <ProductSection 
           title="Task Management"
           heading="Project planning, reimagined."
           desc="Switch between Kanban, List, and Gantt views instantly. Track dependencies and blockers without the headache."
           icon={<Layout className="w-6 h-6 text-white" />}
           image="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop"
           align="left"
        />

        {/* Feature 2: Collaboration */}
        <ProductSection 
           title="Real-time Chat"
           heading="Kill the email chain."
           desc="Contextual chat built right into your tasks. Tag teammates, share files, and resolve issues without leaving the window."
           icon={<MessageSquare className="w-6 h-6 text-white" />}
           image="https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=1974&auto=format&fit=crop"
           align="right"
        />

        {/* Feature 3: Docs */}
        <ProductSection 
           title="Documents"
           heading="Knowledge lives here."
           desc="A Notion-style editor for your specs, wikis, and meeting notes. Link docs directly to projects for seamless context."
           icon={<FileText className="w-6 h-6 text-white" />}
           image="https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=2070&auto=format&fit=crop"
           align="left"
        />
      </div>

      {/* --- INTEGRATIONS --- */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
           <AnimatedContent>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Plays nice with others</h2>
              <p className="text-slate-600 max-w-2xl mx-auto mb-16">
                 Connect Taskify with your favorite tools. We support 50+ native integrations.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 <IntegrationCard icon={<Slack />} name="Slack" desc="Sync messages & status" />
                 <IntegrationCard icon={<GitBranch />} name="GitHub" desc="Link PRs to tasks" />
                 <IntegrationCard icon={<Zap />} name="Zapier" desc="Automate workflows" />
                 <IntegrationCard icon={<Trello />} name="Trello" desc="One-click import" />
              </div>
           </AnimatedContent>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-24 px-4 bg-slate-900 text-center relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
           <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-20"></div>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
           <h2 className="text-4xl font-bold text-white mb-8">Build better, faster.</h2>
           <a href="/registration" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-slate-900 bg-white rounded-xl hover:bg-blue-50 transition-all">
              Start Building <ArrowRight className="ml-2" />
           </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// Sub-Components

const ProductSection = ({ title, heading, desc, icon, image, align }) => (
  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
     <div className={`flex flex-col md:flex-row items-center gap-12 lg:gap-20 ${align === 'right' ? 'md:flex-row-reverse' : ''}`}>
        {/* Text Side */}
        <div className="flex-1">
           <AnimatedContent direction="horizontal" distance={20}>
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-600/20">
                 {icon}
              </div>
              <h3 className="text-blue-600 font-bold tracking-wide uppercase text-sm mb-2">{title}</h3>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">{heading}</h2>
              <p className="text-lg text-slate-600 leading-relaxed">{desc}</p>
           </AnimatedContent>
        </div>

        {/* Image Side */}
        <div className="flex-1 w-full">
           <AnimatedContent scale={0.95} delay={0.2}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-800 group">
                 <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <img src={image} alt={heading} className="w-full h-auto object-cover" />
              </div>
           </AnimatedContent>
        </div>
     </div>
  </section>
);

const IntegrationCard = ({ icon, name, desc }) => (
  <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-xl hover:border-blue-200 transition-all duration-300 text-left group cursor-default">
     <div className="mb-4 text-slate-400 group-hover:text-blue-600 transition-colors">
        {icon}
     </div>
     <h4 className="font-bold text-slate-900 mb-1">{name}</h4>
     <p className="text-sm text-slate-500">{desc}</p>
  </div>
);

export default Product;