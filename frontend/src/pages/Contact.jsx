import { Mail, MapPin, Phone } from "lucide-react";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
         <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left Info */}
            <div>
               <h2 className="text-blue-600 font-bold uppercase tracking-wide text-sm mb-2">Contact Us</h2>
               <h1 className="text-4xl font-extrabold text-slate-900 mb-6">Let's talk business.</h1>
               <p className="text-xl text-slate-600 mb-10">Have questions about pricing, enterprise plans, or just want to say hi? We're here to help.</p>
               
               <div className="space-y-6">
                  <div className="flex items-start gap-4">
                     <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0"><Mail size={20}/></div>
                     <div>
                        <h3 className="font-bold text-slate-900">Email</h3>
                        <p className="text-slate-600">utkarshpalav17@gmail.com</p>
                     </div>
                  </div>
                  <div className="flex items-start gap-4">
                     <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0"><MapPin size={20}/></div>
                     <div>
                        <h3 className="font-bold text-slate-900">Office</h3>
                        <p className="text-slate-600">Mumbai, Maharashtra</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Right Form */}
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
               <form className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">First Name</label>
                        <input className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none" placeholder="John" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Last Name</label>
                        <input className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none" placeholder="Doe" />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-sm font-bold text-slate-700">Email</label>
                     <input className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none" placeholder="john@company.com" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-sm font-bold text-slate-700">Message</label>
                     <textarea className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none h-32" placeholder="How can we help?" />
                  </div>
                  <button className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
                     Send Message
                  </button>
               </form>
            </div>
         </div>
      </section>
      <Footer />
    </div>
  );
};
export default Contact;