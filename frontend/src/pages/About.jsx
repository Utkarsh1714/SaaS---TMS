import { motion } from "framer-motion";
import { 
  Users, 
  Target, 
  Zap, 
  Globe, 
  Heart, 
  ShieldCheck, 
  Linkedin, 
  Twitter, 
  ArrowRight 
} from "lucide-react";

// Components
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";
import AnimatedContent from "@/components/ui/AnimatedContent";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-blue-100">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedContent direction="vertical" distance={20}>
            <h2 className="text-blue-600 font-bold tracking-wide uppercase text-sm mb-4">
              Our Mission
            </h2>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 mb-8 tracking-tight leading-[0.95]">
              We build tools for the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
                builders of tomorrow.
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              Taskify started with a simple idea: Work shouldn't be chaotic. 
              We are on a mission to simplify collaboration for teams of all sizes, 
              from startups to Fortune 500s.
            </p>
          </AnimatedContent>

          {/* Hero Image Collage */}
          <AnimatedContent delay={0.2} scale={0.95}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto h-96 md:h-80">
               <div className="col-span-2 row-span-2 rounded-3xl overflow-hidden relative group">
                  <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" alt="Team collaborating" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors"></div>
               </div>
               <div className="col-span-1 row-span-2 md:row-span-1 rounded-3xl overflow-hidden relative group">
                  <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop" alt="Office meeting" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
               </div>
               <div className="col-span-1 row-span-2 md:row-span-2 rounded-3xl overflow-hidden relative group">
                  <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1932&auto=format&fit=crop" alt="Strategic planning" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
               </div>
               <div className="hidden md:block col-span-1 row-span-1 rounded-3xl overflow-hidden relative group">
                  <img src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?q=80&w=1974&auto=format&fit=crop" alt="Modern office" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
               </div>
            </div>
          </AnimatedContent>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="py-12 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-100">
            <StatItem number="10k+" label="Active Users" />
            <StatItem number="500+" label="Companies" />
            <StatItem number="99.9%" label="Uptime" />
            <StatItem number="24/7" label="Support" />
          </div>
        </div>
      </section>

      {/* --- OUR VALUES --- */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Core Values</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                 We believe that great software is built by teams who care about the details.
                 These principles guide every decision we make.
              </p>
           </div>

           <div className="grid md:grid-cols-3 gap-8">
              <ValueCard 
                icon={<Zap />} 
                title="Speed Matters" 
                desc="We optimize for speed. Fast software leads to fast workflows and happier users."
              />
              <ValueCard 
                icon={<Heart />} 
                title="User Obsessed" 
                desc="We don't just build features; we solve problems. Your feedback is our roadmap."
              />
              <ValueCard 
                icon={<ShieldCheck />} 
                title="Trust & Security" 
                desc="Your data is your business. We treat it with the highest level of security and privacy."
              />
              <ValueCard 
                icon={<Globe />} 
                title="Remote First" 
                desc="We hire the best talent, regardless of where they live. Diversity drives innovation."
              />
              <ValueCard 
                icon={<Users />} 
                title="Collaboration" 
                desc="Great things are never done by one person. We build tools that bring people together."
              />
              <ValueCard 
                icon={<Target />} 
                title="Impact" 
                desc="We focus on outcomes, not output. We measure success by the value we deliver."
              />
           </div>
        </div>
      </section>

      {/* --- TEAM SECTION --- */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Meet the Team</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
               The dreamers, designers, and developers building the future of work.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
             <TeamMember 
               name="Alex Johnson" 
               role="Founder & CEO" 
               image="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop"
             />
             <TeamMember 
               name="Sarah Williams" 
               role="Head of Product" 
               image="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop"
             />
             <TeamMember 
               name="Michael Chen" 
               role="Lead Engineer" 
               image="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1000&auto=format&fit=crop"
             />
             <TeamMember 
               name="Emily Davis" 
               role="Head of Design" 
               image="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000&auto=format&fit=crop"
             />
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-24 px-4 bg-slate-900 relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
           <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-20"></div>
           <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-indigo-600 rounded-full blur-[120px] opacity-20"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
             Join the movement.
          </h2>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Ready to change how your team works? Start your free trial today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/registration" className="bg-white text-slate-900 hover:bg-blue-50 font-bold px-8 py-4 rounded-xl shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2">
              Get Started <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// --- COMPONENTS ---

const StatItem = ({ number, label }) => (
  <div className="p-4">
    <div className="text-4xl md:text-5xl font-extrabold text-blue-600 mb-2">{number}</div>
    <div className="text-sm font-semibold text-slate-500 uppercase tracking-wide">{label}</div>
  </div>
);

const ValueCard = ({ icon, title, desc }) => (
  <AnimatedContent distance={20} direction="vertical">
    <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 h-full">
       <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6">
          {icon}
       </div>
       <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
       <p className="text-slate-600 leading-relaxed">{desc}</p>
    </div>
  </AnimatedContent>
);

const TeamMember = ({ name, role, image }) => (
  <AnimatedContent distance={20} scale={0.95}>
    <div className="group relative bg-white p-4 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all text-center">
       <div className="w-full aspect-square rounded-2xl overflow-hidden mb-6 relative">
          <img src={image} alt={name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
          {/* Social Hover Overlay */}
          <div className="absolute inset-0 bg-blue-600/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
             <a href="#" className="p-2 bg-white rounded-full text-blue-600 hover:scale-110 transition-transform"><Linkedin size={20} /></a>
             <a href="#" className="p-2 bg-white rounded-full text-blue-600 hover:scale-110 transition-transform"><Twitter size={20} /></a>
          </div>
       </div>
       <h3 className="text-lg font-bold text-slate-900">{name}</h3>
       <p className="text-slate-500 text-sm font-medium">{role}</p>
    </div>
  </AnimatedContent>
);

export default About;