import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";

const Changelog = () => {
  const changes = [
    { version: "v2.1.0", date: "Nov 20, 2025", title: "The Dark Mode Update", desc: "Finally here. Switch to dark mode from your profile settings.", tags: ["New", "UI"] },
    { version: "v2.0.5", date: "Nov 10, 2025", title: "Faster Search", desc: "We rewrote our search engine. It's now 10x faster.", tags: ["Performance"] },
    { version: "v2.0.0", date: "Oct 25, 2025", title: "Taskify 2.0", desc: "Complete redesign of the dashboard and new Kanban views.", tags: ["Major"] },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-20 max-w-3xl mx-auto px-4 w-full">
        <div className="text-center mb-16">
           <h2 className="text-blue-600 font-bold uppercase text-sm mb-2">What's New</h2>
           <h1 className="text-4xl font-extrabold text-slate-900">Changelog</h1>
        </div>

        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
          {changes.map((item, i) => (
            <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              
              {/* Icon Dot */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-200 group-[.is-active]:bg-blue-600 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow"></div>
              
              {/* Card */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                   <span className="font-bold text-slate-900">{item.version}</span>
                   <span className="text-xs font-medium text-slate-500">{item.date}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm mb-4">{item.desc}</p>
                <div className="flex gap-2">
                   {item.tags.map(t => <span key={t} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">{t}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
};
export default Changelog;