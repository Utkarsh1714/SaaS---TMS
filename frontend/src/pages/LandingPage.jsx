// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import {
//   BarChartIcon,
//   CalendarIcon,
//   MessageSquareIcon,
//   UsersIcon,
//   ClipboardCheckIcon,
// } from "lucide-react";
// import Navbar from "@/components/Layout/Navbar";
// import Footer from "@/components/Layout/Footer";
// import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
// import AnimatedContent from "@/components/ui/AnimatedContent";

// const LandingPage = () => {
//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       transition={{ duration: 1 }}
//       className="min-h-screen flex flex-col bg-white"
//     >
//       <Navbar />
//       <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20 px-4 sm:px-6 lg:px-8 text-white">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex flex-col md:flex-row items-center">
//             <div className="md:w-1/2 mb-10 md:mb-0">
//               <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
//                 All-in-one workspace for your organization
//               </h1>
//               <p className="text-xl mb-8 text-blue-100">
//                 Manage tasks, departments, employees, meetings, and
//                 communications all in one place with our powerful SaaS platform.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4">
//                 <Link
//                   to="/registration"
//                   className="bg-white text-blue-700 hover:bg-blue-50 font-medium px-6 py-3 rounded-lg text-center"
//                 >
//                   Start for free
//                 </Link>
//                 <Link
//                   to="/login"
//                   className="bg-blue-800 text-white hover:bg-blue-900 font-medium px-6 py-3 rounded-lg text-center"
//                 >
//                   Sign in
//                 </Link>
//               </div>
//             </div>
//             <div className="md:w-1/2">
//               <img
//                 src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
//                 alt="Dashboard preview"
//                 className="rounded-lg shadow-xl"
//               />
//             </div>
//           </div>
//         </div>
//       </section>
//       {/* Features Section */}
//       <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl font-bold text-gray-900 mb-4">
//               Everything you need to run your organization
//             </h2>
//             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//               Our platform provides all the tools you need to manage your
//               company efficiently in one place.
//             </p>
//           </div>
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//             <FeatureCard
//               icon={<ClipboardCheckIcon size={24} />}
//               title="Task Management"
//               description="Create, assign and track tasks across teams and departments with ease."
//             />
//             <FeatureCard
//               icon={<UsersIcon size={24} />}
//               title="Employee Management"
//               description="Keep track of all employee information, roles, and performance metrics."
//             />
//             <FeatureCard
//               icon={<CalendarIcon size={24} />}
//               title="Meeting Scheduler"
//               description="Schedule and manage meetings with intelligent conflict detection."
//             />
//             <FeatureCard
//               icon={<MessageSquareIcon size={24} />}
//               title="Team Chat"
//               description="Real-time messaging for teams and departments to collaborate effectively."
//             />
//             <FeatureCard
//               icon={<BarChartIcon size={24} />}
//               title="Advanced Analytics"
//               description="Generate insightful reports and visualize data to make informed decisions."
//             />
//             <FeatureCard
//               icon={<UsersIcon size={24} />}
//               title="Department Management"
//               description="Organize your company structure and manage departments efficiently."
//             />
//           </div>
//         </div>
//       </section>
//       {/* Testimonials Section */}
//       <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl font-bold text-gray-900 mb-4">
//               Trusted by companies worldwide
//             </h2>
//             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//               See what our customers have to say about our platform.
//             </p>
//           </div>
//           <div className="h-[20rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
//             <InfiniteMovingCards
//               items={testimonials}
//               direction="right"
//               speed="slow"
//             />
//           </div>
//         </div>
//       </section>
//       {/* CTA Section */}
//       <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600 text-white">
//         <div className="max-w-7xl mx-auto text-center">
//           <h2 className="text-3xl font-bold mb-6">
//             Ready to transform your organization?
//           </h2>
//           <p className="text-xl mb-10 text-blue-100 max-w-3xl mx-auto">
//             Join thousands of companies already using our platform to improve
//             productivity and management.
//           </p>
//           <div className="flex flex-col sm:flex-row justify-center gap-4">
//             <Link
//               to="/registration"
//               className="bg-white text-blue-700 hover:bg-blue-50 font-medium px-8 py-3 rounded-lg"
//             >
//               Get started for free
//             </Link>
//             <Link
//               to="/login"
//               className="bg-blue-800 text-white hover:bg-blue-900 font-medium px-8 py-3 rounded-lg"
//             >
//               Schedule a demo
//             </Link>
//           </div>
//         </div>
//       </section>
//       <Footer />
//     </motion.div>
//   );
// };

// const testimonials = [
//   {
//     quote:
//       "This platform has transformed how we manage our teams and projects. Everything is now streamlined and efficient.",
//     name: "Utkarsh Palav",
//     title: "CEO, TechCorp",
//     image: "./utkarsh.jpg",
//   },
//   {
//     quote:
//       "The analytics and reporting features have given us insights we never had before. Game-changing for our decision making.",
//     name: "Sairaj Shetty",
//     title: "COO, InnovateCo",
//     image: "./aana.jpg",
//   },
//   {
//     quote:
//       "Employee engagement has increased significantly since we started using the platform. The chat and meeting features are excellent.",
//     name: "Vivek Singh Rawat",
//     title: "HR Director, GlobalFirm",
//     image:
//       "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
//   },
//   {
//     quote:
//       "Managing our departments and employees has never been easier. This platform is a must-have for any growing business.",
//     name: "Abhishek Sharma",
//     title: "CTO, StartupX",
//     image:
//       "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
//   },
//   {
//     quote:
//       "The task management features have improved our team's productivity and collaboration. Highly recommend!",
//     name: "Shraddha Singh",
//     title: "Project Manager, BuildIt",
//     image: "./shraddha.jpg",
//   },
// ];

// const FeatureCard = ({ icon, title, description }) => {
//   return (
//     <AnimatedContent
//       distance={150}
//       direction="vertical"
//       reverse={false}
//       duration={1.2}
//       initialOpacity={0.2}
//       animateOpacity
//       scale={1.1}
//       threshold={0.2}
//       delay={0.3}
//     >
//       <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl hover:scale-3d transition-shadow duration-300">
//         <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center text-blue-600 mb-5">
//           {icon}
//         </div>
//         <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
//         <p className="text-gray-600">{description}</p>
//       </div>
//     </AnimatedContent>
//   );
// };

// export default LandingPage;





// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import {
//   BarChart3,
//   Calendar,
//   MessageSquare,
//   Users,
//   CheckSquare,
//   LayoutDashboard,
//   ArrowRight,
//   ShieldCheck,
//   Zap,
// } from "lucide-react";
// import Navbar from "@/components/Layout/Navbar";
// import Footer from "@/components/Layout/Footer";
// import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
// import AnimatedContent from "@/components/ui/AnimatedContent";

// const LandingPage = () => {
//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       transition={{ duration: 0.5 }}
//       className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900"
//     >
//       <Navbar />

//       {/* --- HERO SECTION --- */}
//       <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
//         {/* Background Pattern */}
//         <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <AnimatedContent direction="vertical" distance={20}>
//             <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-8">
//               <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
//               <span className="text-sm font-medium text-blue-700">
//                 v2.0 is live: New Dashboard Layout
//               </span>
//             </div>

//             <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-6">
//               Manage your team <br className="hidden md:block" />
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
//                 like a Pro.
//               </span>
//             </h1>

//             <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
//               The all-in-one workspace for modern organizations. Handle tasks,
//               departments, and communications without the chaos.
//             </p>

//             <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
//               <Link
//                 to="/registration"
//                 className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:-translate-y-1"
//               >
//                 Start for free <ArrowRight className="ml-2 h-5 w-5" />
//               </Link>
//               <Link
//                 to="/login"
//                 className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all hover:border-slate-300"
//               >
//                 View Demo
//               </Link>
//             </div>
//           </AnimatedContent>

//           {/* Dashboard Mockup */}
//           <AnimatedContent delay={0.2} scale={0.95}>
//             <div className="relative max-w-5xl mx-auto">
//               <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-20"></div>
//               <img
//                 src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop"
//                 alt="Taskify Dashboard"
//                 className="relative rounded-2xl shadow-2xl border border-slate-200 w-full object-cover"
//               />
//             </div>
//           </AnimatedContent>
//         </div>
//       </section>

//       {/* --- SOCIAL PROOF --- */}
//       <section className="py-10 bg-white border-y border-slate-100">
//         <div className="max-w-7xl mx-auto px-4 text-center">
//           <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">
//             Trusted by 10,000+ Leaders
//           </p>
//           <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
//             {["Acme Corp", "Global Bank", "TechStart", "Nebula", "Logipsum"].map(
//               (brand) => (
//                 <span
//                   key={brand}
//                   className="text-xl font-bold text-slate-600 flex items-center gap-2"
//                 >
//                   <Hexagon className="w-6 h-6 text-slate-400" /> {brand}
//                 </span>
//               )
//             )}
//           </div>
//         </div>
//       </section>

//       {/* --- FEATURES SECTION --- */}
//       <section className="py-24 bg-slate-50" id="features">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16 max-w-3xl mx-auto">
//             <h2 className="text-blue-600 font-semibold tracking-wide uppercase text-sm mb-3">
//               Features
//             </h2>
//             <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
//               Everything you need to ship faster.
//             </h3>
//             <p className="text-lg text-slate-600">
//               Stop juggling multiple apps. Taskify centralizes your workflow into
//               one powerful operating system.
//             </p>
//           </div>

//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//             <FeatureCard
//               icon={<CheckSquare />}
//               title="Task Management"
//               desc="Create, assign and track tasks with Kanban boards and Gantt charts."
//             />
//             <FeatureCard
//               icon={<Users />}
//               title="Employee Directory"
//               desc="Store comprehensive profiles, roles, and performance data safely."
//             />
//             <FeatureCard
//               icon={<Calendar />}
//               title="Smart Scheduling"
//               desc="Auto-find the best meeting times across different timezones."
//             />
//             <FeatureCard
//               icon={<MessageSquare />}
//               title="Team Chat"
//               desc="Real-time collaboration with channels, threads, and file sharing."
//             />
//             <FeatureCard
//               icon={<BarChart3 />}
//               title="Analytics"
//               desc="Visual reports on team productivity, sprint velocity, and more."
//             />
//             <FeatureCard
//               icon={<LayoutDashboard />}
//               title="Custom Workflows"
//               desc="Automate repetitive tasks with our visual workflow builder."
//             />
//           </div>
//         </div>
//       </section>

//       {/* --- TESTIMONIALS --- */}
//       <section className="py-24 bg-white overflow-hidden">
//         <div className="max-w-7xl mx-auto px-4 mb-12 text-center">
//           <h2 className="text-3xl font-bold text-slate-900">
//             Loved by teams everywhere
//           </h2>
//         </div>
//         <div className="relative">
//             <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10"></div>
//             <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10"></div>
//             <InfiniteMovingCards
//             items={testimonials}
//             direction="right"
//             speed="slow"
//             />
//         </div>
//       </section>

//       {/* --- CTA SECTION --- */}
//       <section className="py-20 px-4 bg-slate-900 relative overflow-hidden">
//          {/* Abstract Shapes */}
//         <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
//            <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-600 rounded-full blur-[100px] opacity-20"></div>
//            <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-indigo-600 rounded-full blur-[100px] opacity-20"></div>
//         </div>

//         <div className="max-w-4xl mx-auto text-center relative z-10">
//           <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
//             Ready to transform your organization?
//           </h2>
//           <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
//             Join thousands of forward-thinking companies. No credit card required for the 14-day trial.
//           </p>
//           <div className="flex flex-col sm:flex-row justify-center gap-4">
//             <Link
//               to="/registration"
//               className="bg-blue-600 text-white hover:bg-blue-500 font-bold px-8 py-4 rounded-xl shadow-lg transition-all hover:scale-105"
//             >
//               Get started for free
//             </Link>
//             <Link
//               to="/login"
//               className="bg-slate-800 text-white hover:bg-slate-700 font-bold px-8 py-4 rounded-xl border border-slate-700 transition-all"
//             >
//               Talk to Sales
//             </Link>
//           </div>
//         </div>
//       </section>

//       <Footer />
//     </motion.div>
//   );
// };

// // --- COMPONENTS ---

// const FeatureCard = ({ icon, title, desc }) => {
//   return (
//     <AnimatedContent distance={100} direction="vertical" scale={1}>
//       <div className="group bg-white p-8 rounded-2xl border border-slate-200 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 h-full">
//         <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
//           <div className="text-blue-600 group-hover:text-white transition-colors duration-300">
//             {icon}
//           </div>
//         </div>
//         <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
//         <p className="text-slate-600 leading-relaxed">{desc}</p>
//       </div>
//     </AnimatedContent>
//   );
// };

// // Helper Icon for Trust Section
// const Hexagon = ({ className }) => (
//   <svg className={className} viewBox="0 0 24 24" fill="currentColor">
//     <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
//   </svg>
// );

// const testimonials = [
//   {
//     quote:
//       "Taskify has completely transformed how we manage our remote teams. The clarity it provides is unmatched.",
//     name: "Sarah Jenkins",
//     title: "VP of Operations, TechFlow",
//   },
//   {
//     quote:
//       "The analytics feature alone is worth the price. We found bottlenecks we didn't even know existed.",
//     name: "David Chen",
//     title: "Founder, StartUp Inc",
//   },
//   {
//     quote:
//       "Finally, a tool that balances power with simplicity. My entire team was onboarded in less than a day.",
//     name: "Elena Rodriguez",
//     title: "Project Lead, DesignCo",
//   },
//    {
//     quote:
//       "Security was our main concern, and Taskify's role-based access control put our minds at ease.",
//     name: "Michael Chang",
//     title: "CTO, SecureNet",
//   },
// ];

// export default LandingPage;












// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import {
//   BarChart3,
//   Calendar,
//   MessageSquare,
//   Users,
//   CheckSquare,
//   LayoutDashboard,
//   ArrowRight,
//   Hexagon,
//   Layers,
//   Zap,
// } from "lucide-react";
// import Navbar from "@/components/Layout/Navbar";
// import Footer from "@/components/Layout/Footer";
// import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
// import AnimatedContent from "@/components/ui/AnimatedContent";

// const LandingPage = () => {
//   return (
//     <div className="min-h-screen flex flex-col bg-white font-sans selection:bg-blue-100">
//       <Navbar />

//       {/* --- HERO SECTION --- */}
//       <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
//         {/* Tech Grid Background Pattern */}
//         <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
//           <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#dbeafe,transparent)]"></div>
//         </div>

//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <AnimatedContent direction="vertical" distance={20}>
//             {/* Badge */}
//             <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-1.5 mb-8 shadow-sm hover:shadow-md transition-shadow cursor-default">
//               <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
//               <span className="text-sm font-semibold text-slate-600 tracking-wide">
//                 v2.0 is now live
//               </span>
//             </div>

//             {/* Headline */}
//             <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]">
//               Manage your team <br className="hidden md:block" />
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
//                 like a Fortune 500.
//               </span>
//             </h1>

//             {/* Subheadline */}
//             <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
//               Taskify is the operating system for modern work. Replace Trello,
//               Slack, and Jira with one unified platform.
//             </p>

//             {/* CTA Buttons */}
//             <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
//               <Link
//                 to="/registration"
//                 className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-1 ring-offset-2 focus:ring-2 ring-blue-600"
//               >
//                 Start for free <ArrowRight className="ml-2 h-5 w-5" />
//               </Link>
//               <Link
//                 to="/login"
//                 className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-slate-700 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all hover:border-slate-300"
//               >
//                 View Live Demo
//               </Link>
//             </div>
//           </AnimatedContent>

//           {/* Abstract Dashboard Mockup (CSS Only - No Image Needed) */}
//           <AnimatedContent delay={0.2} scale={0.95}>
//             <div className="relative max-w-6xl mx-auto">
//               {/* Glow Effect behind dashboard */}
//               <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-violet-600 rounded-3xl blur-2xl opacity-20"></div>
              
//               {/* The Dashboard Container */}
//               <div className="relative bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden aspect-[16/9] flex flex-col">
//                 <div className="h-12 bg-slate-800/50 border-b border-slate-700 flex items-center px-4 gap-2">
//                    <div className="flex gap-2">
//                      <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
//                      <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
//                      <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
//                    </div>
//                    <div className="ml-4 h-6 w-64 bg-slate-800 rounded-md"></div>
//                 </div>
//                 <div className="flex-1 flex bg-slate-950 p-4 gap-4">
//                    <div className="w-16 md:w-48 bg-slate-900/50 rounded-xl border border-slate-800 hidden sm:block"></div>
//                    <div className="flex-1 bg-slate-900/50 rounded-xl border border-slate-800 grid grid-cols-3 gap-4 p-4">
//                       <div className="col-span-2 h-32 bg-blue-500/10 rounded-lg border border-blue-500/20 relative overflow-hidden">
//                          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-blue-500/20 to-transparent"></div>
//                       </div>
//                       <div className="col-span-1 h-32 bg-slate-800 rounded-lg"></div>
//                       <div className="col-span-3 h-full bg-slate-800/50 rounded-lg"></div>
//                    </div>
//                 </div>
                
//                 {/* Overlay Text (Optional) */}
//                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                     <h3 className="text-slate-700 text-4xl font-bold opacity-20 rotate-12 select-none">TASKIFY DASHBOARD</h3>
//                  </div>
//               </div>
//             </div>
//           </AnimatedContent>
//         </div>
//       </section>

//       {/* --- SOCIAL PROOF --- */}
//       <section className="py-10 bg-white border-y border-slate-100">
//         <div className="max-w-7xl mx-auto px-4 text-center">
//           <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">
//             Powering next-gen teams at
//           </p>
//           <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
//             {["Acme Corp", "Global Bank", "TechStart", "Nebula", "Logipsum"].map(
//               (brand) => (
//                 <span
//                   key={brand}
//                   className="text-xl font-bold text-slate-700 flex items-center gap-2"
//                 >
//                   <Hexagon className="w-6 h-6 text-blue-600" fill="currentColor" fillOpacity={0.2} /> {brand}
//                 </span>
//               )
//             )}
//           </div>
//         </div>
//       </section>

//       {/* --- FEATURES SECTION (Bento Grid Style) --- */}
//       <section className="py-24 bg-slate-50" id="features">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-20 max-w-3xl mx-auto">
//             <h2 className="text-blue-600 font-bold tracking-wide uppercase text-sm mb-3">
//               Features
//             </h2>
//             <h3 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
//               Everything you need to <br />
//               <span className="text-blue-600">ship faster.</span>
//             </h3>
//             <p className="text-lg text-slate-600">
//               Stop juggling multiple apps. Taskify centralizes your workflow into
//               one powerful operating system.
//             </p>
//           </div>

//           <div className="grid md:grid-cols-3 gap-6">
//             {/* Card 1 */}
//             <FeatureCard
//               icon={<CheckSquare />}
//               title="Task Management"
//               desc="Kanban, List, and Gantt views. Track progress in real-time."
//               className="md:col-span-2"
//             />
//             {/* Card 2 */}
//             <FeatureCard
//               icon={<Zap />}
//               title="Automations"
//               desc="Save time with custom workflows and triggers."
//               className="md:col-span-1"
//             />
//             {/* Card 3 */}
//             <FeatureCard
//               icon={<Users />}
//               title="Team Directory"
//               desc="Manage roles, permissions and profiles securely."
//               className="md:col-span-1"
//             />
//              {/* Card 4 */}
//             <FeatureCard
//               icon={<MessageSquare />}
//               title="Real-time Chat"
//               desc="Direct messaging and channel support built-in."
//               className="md:col-span-2"
//             />
//              {/* Card 5 */}
//             <FeatureCard
//               icon={<BarChart3 />}
//               title="Analytics"
//               desc="Deep insights into team velocity and performance."
//               className="md:col-span-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white ring-0"
//               dark={true}
//             />
//           </div>
//         </div>
//       </section>

//       {/* --- TESTIMONIALS --- */}
//       <section className="py-24 bg-white overflow-hidden relative">
//          {/* Background Blurs */}
//         <div className="absolute top-20 left-[-100px] w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        
//         <div className="max-w-7xl mx-auto px-4 mb-16 text-center">
//           <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
//             Loved by teams everywhere
//           </h2>
//         </div>
//         <div className="relative">
//             {/* Fade edges */}
//             <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10"></div>
//             <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10"></div>
//             <InfiniteMovingCards
//                 items={testimonials}
//                 direction="right"
//                 speed="slow"
//             />
//         </div>
//       </section>

//       {/* --- CTA SECTION --- */}
//       <section className="py-24 px-4 bg-slate-900 relative overflow-hidden">
//          {/* Abstract Shapes */}
//         <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
//            <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-20"></div>
//            <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-indigo-600 rounded-full blur-[120px] opacity-20"></div>
//         </div>

//         <div className="max-w-4xl mx-auto text-center relative z-10">
//           <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight leading-tight">
//             Ready to transform your <br/> organization?
//           </h2>
//           <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
//             Join thousands of forward-thinking companies. No credit card required for the 14-day trial.
//           </p>
//           <div className="flex flex-col sm:flex-row justify-center gap-4">
//             <Link
//               to="/registration"
//               className="bg-white text-slate-900 hover:bg-blue-50 font-bold px-10 py-4 rounded-xl shadow-xl transition-all hover:scale-105"
//             >
//               Get started for free
//             </Link>
//             <Link
//               to="/login"
//               className="bg-slate-800 text-white hover:bg-slate-700 font-bold px-10 py-4 rounded-xl border border-slate-700 transition-all"
//             >
//               Talk to Sales
//             </Link>
//           </div>
//         </div>
//       </section>

//       <Footer />
//     </div>
//   );
// };

// // --- COMPONENTS ---

// // Styled Feature Card
// const FeatureCard = ({ icon, title, desc, className, dark = false }) => {
//   return (
//     <AnimatedContent distance={50} direction="vertical" scale={1}>
//       <div className={`group p-8 rounded-3xl border transition-all duration-300 h-full hover:shadow-lg relative overflow-hidden ${
//           dark 
//           ? "bg-blue-600 border-blue-500 text-white" 
//           : "bg-white border-slate-200 hover:border-blue-300 hover:shadow-blue-900/5"
//       } ${className}`}>
        
//         {/* Hover Glow for light cards */}
//         {!dark && <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-10 -mt-10 transition-all group-hover:scale-150"></div>}

//         <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 relative z-10 ${
//             dark ? "bg-white/10 text-white" : "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors"
//         }`}>
//             {icon}
//         </div>
        
//         <h3 className={`text-xl font-bold mb-3 relative z-10 ${dark ? "text-white" : "text-slate-900"}`}>{title}</h3>
//         <p className={`leading-relaxed relative z-10 ${dark ? "text-blue-100" : "text-slate-600"}`}>{desc}</p>
//       </div>
//     </AnimatedContent>
//   );
// };

// const testimonials = [
//   {
//     quote:
//       "Taskify has completely transformed how we manage our remote teams. The clarity it provides is unmatched.",
//     name: "Sarah Jenkins",
//     title: "VP of Operations, TechFlow",
//   },
//   {
//     quote:
//       "The analytics feature alone is worth the price. We found bottlenecks we didn't even know existed.",
//     name: "David Chen",
//     title: "Founder, StartUp Inc",
//   },
//   {
//     quote:
//       "Finally, a tool that balances power with simplicity. My entire team was onboarded in less than a day.",
//     name: "Elena Rodriguez",
//     title: "Project Lead, DesignCo",
//   },
//    {
//     quote:
//       "Security was our main concern, and Taskify's role-based access control put our minds at ease.",
//     name: "Michael Chang",
//     title: "CTO, SecureNet",
//   },
// ];

// export default LandingPage;















import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  BarChart3,
  Calendar,
  MessageSquare,
  Users,
  CheckSquare,
  LayoutDashboard,
  ArrowRight,
  Hexagon,
  Zap,
  Search,
  Bell,
  Menu,
} from "lucide-react";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import AnimatedContent from "@/components/ui/AnimatedContent";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans selection:bg-blue-100 overflow-x-hidden">
      <Navbar />

      {/* --- NEW HERO SECTION: 3D PERSPECTIVE --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-visible">
        
        {/* Spotlight Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -z-10 opacity-50 pointer-events-none"></div>
        
        {/* Background Grid */}
        <div className="absolute inset-0 -z-20 h-full w-full bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center perspective-[2000px]">
          <AnimatedContent direction="vertical" distance={20}>
            
            {/* Announcement Pill */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full px-4 py-1.5 mb-8 shadow-sm ring-1 ring-slate-200/50">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span className="text-sm font-semibold text-slate-600 tracking-wide">
                Taskify 2.0 is here
              </span>
            </div>

            {/* Giant Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[0.95]">
              Ship projects <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600">
                at lightspeed.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
              The all-in-one workspace that replaces your scattered tools. 
              Linear workflows, smart roadmaps, and instant chat.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-24 relative z-20">
              <Link
                to="/registration"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-slate-900 rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 hover:scale-105 active:scale-95"
              >
                Start for free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-slate-700 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all hover:border-slate-300"
              >
                Live Demo
              </Link>
            </div>
          </AnimatedContent>

          {/* --- THE 3D MOCKUP --- */}
          <AnimatedContent delay={0.2}>
            <div className="relative mx-auto w-full max-w-6xl transform-style-3d rotate-x-20 hover:rotate-x-0 transition-transform duration-1000 ease-out group">
              
              {/* Glow Behind */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-violet-500 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>

              {/* The Dashboard Frame */}
              <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200/60 overflow-hidden ring-1 ring-slate-900/5 aspect-[16/9] md:aspect-[16/8] flex flex-col">
                
                {/* 1. Header Bar */}
                <div className="h-14 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0">
                   <div className="flex items-center gap-4">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      </div>
                      <div className="h-4 w-px bg-slate-200 mx-2"></div>
                      <div className="flex items-center gap-2 text-slate-400 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-100 w-64">
                        <Search size={14} />
                        <span className="text-xs font-medium">Search or jump to...</span>
                      </div>
                   </div>
                   <div className="flex gap-4 text-slate-400">
                      <Bell size={18} />
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500"></div>
                   </div>
                </div>

                {/* 2. Main Body */}
                <div className="flex-1 flex overflow-hidden bg-slate-50/50">
                   
                   {/* Sidebar Skeleton */}
                   <div className="w-64 bg-white border-r border-slate-100 p-4 hidden md:flex flex-col gap-4">
                      <div className="space-y-2">
                         <div className="h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center px-3 text-sm font-semibold gap-2">
                            <LayoutDashboard size={16} /> Dashboard
                         </div>
                         <div className="h-8 hover:bg-slate-50 text-slate-500 rounded-lg flex items-center px-3 text-sm font-medium gap-2">
                            <CheckSquare size={16} /> My Tasks
                         </div>
                         <div className="h-8 hover:bg-slate-50 text-slate-500 rounded-lg flex items-center px-3 text-sm font-medium gap-2">
                            <Users size={16} /> Team
                         </div>
                      </div>
                      <div className="mt-auto">
                        <div className="h-24 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-4 text-white">
                          <div className="w-8 h-8 bg-white/10 rounded-lg mb-2"></div>
                          <div className="h-2 w-16 bg-white/20 rounded-full"></div>
                        </div>
                      </div>
                   </div>

                   {/* Main Content Area */}
                   <div className="flex-1 p-6 md:p-8 overflow-hidden flex flex-col gap-6">
                      
                      {/* Top Row: Stats Cards */}
                      <div className="grid grid-cols-3 gap-6">
                         {[1,2,3].map(i => (
                           <div key={i} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                              <div className="flex justify-between items-start mb-4">
                                 <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                                   <Zap size={16} />
                                 </div>
                                 <span className="text-xs text-green-500 font-bold bg-green-50 px-2 py-0.5 rounded">+12%</span>
                              </div>
                              <div className="h-6 w-20 bg-slate-100 rounded mb-2"></div>
                              <div className="h-3 w-32 bg-slate-50 rounded"></div>
                           </div>
                         ))}
                      </div>

                      {/* Middle Row: The Graph (CSS Only) */}
                      <div className="flex-1 bg-white rounded-xl border border-slate-100 shadow-sm p-6 flex flex-col">
                         <div className="flex justify-between mb-6">
                            <div className="h-5 w-32 bg-slate-100 rounded"></div>
                            <div className="h-5 w-20 bg-slate-50 rounded"></div>
                         </div>
                         <div className="flex-1 flex items-end gap-3 px-2 pb-2">
                            {/* Fake Bars */}
                            {[40, 65, 45, 80, 55, 90, 60, 75, 50, 85, 95, 70].map((h, i) => (
                               <div key={i} className="flex-1 bg-blue-600/10 rounded-t-sm hover:bg-blue-600 transition-all duration-300 group/bar relative" style={{ height: `${h}%` }}>
                                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity">
                                    {h}%
                                  </div>
                               </div>
                            ))}
                         </div>
                      </div>

                   </div>
                </div>
              </div>
              
              {/* Floating Element 1 (Glass Card) */}
              <div className="absolute -right-8 top-20 w-64 bg-white/80 backdrop-blur-xl p-4 rounded-xl border border-white/20 shadow-2xl hidden lg:block transform translate-z-10 animate-float">
                 <div className="flex gap-3 items-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600"><Users size={20}/></div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">New Team Member</div>
                      <div className="text-xs text-slate-500">Just joined Marketing</div>
                    </div>
                 </div>
                 <div className="flex -space-x-2">
                    {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200"></div>)}
                 </div>
              </div>

            </div>
          </AnimatedContent>
        </div>
      </section>

      {/* --- SOCIAL PROOF (Same as before) --- */}
      <section className="py-10 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">
            Powering next-gen teams at
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {["Acme Corp", "Global Bank", "TechStart", "Nebula", "Logipsum"].map(
              (brand) => (
                <span
                  key={brand}
                  className="text-xl font-bold text-slate-700 flex items-center gap-2"
                >
                  <Hexagon className="w-6 h-6 text-blue-600" fill="currentColor" fillOpacity={0.2} /> {brand}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION (Keep existing) --- */}
      <section className="py-24 bg-slate-50" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="text-blue-600 font-bold tracking-wide uppercase text-sm mb-3">
              Features
            </h2>
            <h3 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
              Everything you need to <br />
              <span className="text-blue-600">ship faster.</span>
            </h3>
            <p className="text-lg text-slate-600">
              Stop juggling multiple apps. Taskify centralizes your workflow into
              one powerful operating system.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<CheckSquare />}
              title="Task Management"
              desc="Kanban, List, and Gantt views. Track progress in real-time."
              className="md:col-span-2"
            />
            <FeatureCard
              icon={<Zap />}
              title="Automations"
              desc="Save time with custom workflows and triggers."
              className="md:col-span-1"
            />
            <FeatureCard
              icon={<Users />}
              title="Team Directory"
              desc="Manage roles, permissions and profiles securely."
              className="md:col-span-1"
            />
            <FeatureCard
              icon={<MessageSquare />}
              title="Real-time Chat"
              desc="Direct messaging and channel support built-in."
              className="md:col-span-2"
            />
            <FeatureCard
              icon={<BarChart3 />}
              title="Analytics"
              desc="Deep insights into team velocity and performance."
              className="md:col-span-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white ring-0"
              dark={true}
            />
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS (Keep existing) --- */}
      <section className="py-24 bg-white overflow-hidden relative">
        <div className="absolute top-20 left-[-100px] w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Loved by teams everywhere
          </h2>
        </div>
        <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10"></div>
            <InfiniteMovingCards items={testimonials} direction="right" speed="slow" />
        </div>
      </section>

      {/* --- CTA SECTION (Keep existing) --- */}
      <section className="py-24 px-4 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
           <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-20"></div>
           <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-indigo-600 rounded-full blur-[120px] opacity-20"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight leading-tight">
            Ready to transform your <br/> organization?
          </h2>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
            Join thousands of forward-thinking companies. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/registration" className="bg-white text-slate-900 hover:bg-blue-50 font-bold px-10 py-4 rounded-xl shadow-xl transition-all hover:scale-105">
              Get started for free
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// --- COMPONENTS (FeatureCard, Hexagon, Testimonials) remain the same ---
const FeatureCard = ({ icon, title, desc, className, dark = false }) => {
  return (
    <AnimatedContent distance={50} direction="vertical" scale={1}>
      <div className={`group p-8 rounded-3xl border transition-all duration-300 h-full hover:shadow-lg relative overflow-hidden ${
          dark 
          ? "bg-blue-600 border-blue-500 text-white" 
          : "bg-white border-slate-200 hover:border-blue-300 hover:shadow-blue-900/5"
      } ${className}`}>
        {!dark && <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-10 -mt-10 transition-all group-hover:scale-150"></div>}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 relative z-10 ${
            dark ? "bg-white/10 text-white" : "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors"
        }`}>
            {icon}
        </div>
        <h3 className={`text-xl font-bold mb-3 relative z-10 ${dark ? "text-white" : "text-slate-900"}`}>{title}</h3>
        <p className={`leading-relaxed relative z-10 ${dark ? "text-blue-100" : "text-slate-600"}`}>{desc}</p>
      </div>
    </AnimatedContent>
  );
};

const testimonials = [
  { quote: "Taskify has completely transformed how we manage our remote teams.", name: "Sarah Jenkins", title: "VP of Operations, TechFlow" },
  { quote: "The analytics feature alone is worth the price.", name: "David Chen", title: "Founder, StartUp Inc" },
  { quote: "Finally, a tool that balances power with simplicity.", name: "Elena Rodriguez", title: "Project Lead, DesignCo" },
];

export default LandingPage;