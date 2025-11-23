import { ArrowRight } from "lucide-react";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";

const Careers = () => {
  const jobs = [
    { title: "Senior Frontend Engineer", team: "Engineering", location: "Remote", type: "Full-time" },
    { title: "Product Designer", team: "Design", location: "New York", type: "Full-time" },
    { title: "Marketing Manager", team: "Marketing", location: "London", type: "Full-time" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <section className="pt-32 pb-20 lg:pt-48 text-center px-4">
         <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6">Join the mission</h1>
         <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-16">We're looking for passionate people to help us build the future of work.</p>
         
         <div className="max-w-4xl mx-auto space-y-4">
            {jobs.map((job) => (
               <div key={job.title} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all flex items-center justify-between group cursor-pointer text-left">
                  <div>
                     <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                     <div className="flex gap-3 mt-1 text-sm text-slate-500">
                        <span>{job.team}</span> • <span>{job.location}</span> • <span>{job.type}</span>
                     </div>
                  </div>
                  <ArrowRight className="text-slate-300 group-hover:text-blue-600 transition-colors" />
               </div>
            ))}
         </div>
      </section>
      <Footer />
    </div>
  );
};
export default Careers;