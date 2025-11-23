import { CheckCircle, Activity } from "lucide-react";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";

const Status = () => {
  const systems = [
    { name: "API", status: "Operational" },
    { name: "Dashboard", status: "Operational" },
    { name: "Database", status: "Operational" },
    { name: "Notifications", status: "Operational" },
    { name: "Third-party Integrations", status: "Operational" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <section className="pt-32 pb-20 lg:pt-48 max-w-4xl mx-auto px-4 w-full">
         
         {/* Main Status Banner */}
         <div className="bg-green-600 rounded-2xl p-8 text-white flex items-center gap-6 mb-12 shadow-xl shadow-green-900/20">
            <CheckCircle size={48} className="shrink-0" />
            <div>
               <h1 className="text-2xl md:text-3xl font-bold mb-1">All Systems Operational</h1>
               <p className="text-green-100">Last updated: Just now</p>
            </div>
         </div>

         {/* System Grid */}
         <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
               <h2 className="font-bold text-slate-900">Current Status</h2>
               <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Activity size={16}/> Live
               </div>
            </div>
            <div className="divide-y divide-slate-100">
               {systems.map((sys) => (
                  <div key={sys.name} className="p-6 flex justify-between items-center">
                     <span className="font-medium text-slate-700">{sys.name}</span>
                     <span className="text-sm font-bold text-green-600">{sys.status}</span>
                  </div>
               ))}
            </div>
         </div>
      </section>
      <Footer />
    </div>
  );
};
export default Status;