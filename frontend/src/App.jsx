// import { lazy, Suspense, useLayoutEffect, useRef } from "react";
// import { Route, Routes, useLocation } from "react-router-dom";
// import Layout from "./components/Layout";
// import ProtectedRoute from "./routes/ProtectedRoutes";
// import { useAuth } from "./context/AuthContext";
// import { Toaster } from "./components/ui/sonner";
// import { Toaster as HotToast } from "react-hot-toast";
// import Pricing from "./components/Pricing";
// import ProtectRegRoute from "./routes/ProtectRegRoute";
// import LandingPage from "./pages/LandingPage";
// import { ScrollSmoother } from "gsap/ScrollSmoother";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import gsap from "gsap";

// // Lazy load the page
// const Home = lazy(() => import("./pages/Home"));
// const Login = lazy(() => import("./pages/Login"));
// const Tasks = lazy(() => import("./pages/Tasks"));
// const Departments = lazy(() => import("./pages/Departments"));
// const Employees = lazy(() => import("./pages/Employees"));
// const Reports = lazy(() => import("./pages/Reports"));
// const Registration = lazy(() => import("./pages/Registration"));
// const ResetPassword = lazy(() => import("./pages/ResetPassword"));
// const Chat = lazy(() => import("./pages/Chat"));
// const Profile = lazy(() => import("./pages/Profile"));
// const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
// const DeptDetails = lazy(() => import("./pages/DeptDetails"));
// const EmpDetails = lazy(() => import("./pages/EmpDetails"));
// const TaskDetails = lazy(() => import("./pages/TaskDetails"));

// function App() {
//   const { loading } = useAuth();
//   const location = useLocation(); // 👈 Hook to detect route changes
//   const wrapperRef = useRef(null);

//   // 1. GSAP Logic for ScrollSmoother
//   useLayoutEffect(() => {
//     // We only create ScrollSmoother once.
//     let smoother;
//     let ctx = gsap.context(() => {
//       // Create the smooth scroller
//       smoother = ScrollSmoother.create({
//         smooth: 1.5, // Adjust for desired smoothness (e.g., 1.5 seconds)
//         effects: true, // Enables data-speed and data-lag effects
//         normalizeScroll: true, // Recommended for browser inconsistencies
//       });

//       // 2. Cleanup function to kill it when the component unmounts
//     }, wrapperRef); // Scoping to the wrapper element

//     return () => {
//       ctx.revert(); // Reverts all animations and ScrollTriggers created in the context
//     };
//   }, []);

//   useLayoutEffect(() => {
//     if (ScrollSmoother.get() && ScrollSmoother.get().enabled) {
//       // Get the existing smoother instance
//       const smoother = ScrollSmoother.get();

//       // Ensure the new page starts at the top
//       smoother.scrollTop(0, false);

//       ScrollTrigger.refresh(true);
//     }
//   }, [location.pathname])

//   if (loading)
//     return (
//       <div className="flex items-center justify-center w-full min-h-screen gap-3">
//         <div className="flex items-center justify-center gap-3">
//           <p className="text-lg">Loading app</p>
//           <span className="loading loading-dots loading-xl"></span>
//         </div>
//       </div>
//     ); // ✅ Prevent early rendering
//   return (
//     <>
//       <Toaster richColors position="top-right" />
//       <HotToast position="top-right" />

//       <div id="smooth-wrapper" ref={"wrapperRef"}>
//         <div id="smooth-content">
//           <Suspense
//             fallback={
//               <div className="flex items-center justify-center w-full h-full gap-3">
//                 <p className="text-lg">Loading</p>
//                 <span className="loading loading-dots loading-xl"></span>
//               </div>
//             }
//           >
//             <Routes>
//               {/* Public Routes */}
//               <Route path="/landing" element={<LandingPage />} />
//               <Route path="/login" element={<Login />} />
//               <Route
//                 path="/registration"
//                 element={
//                   <ProtectRegRoute>
//                     <Registration />
//                   </ProtectRegRoute>
//                 }
//               />
//               <Route path="/plans" element={<Pricing />} />
//               <Route path="/reset-password" element={<ResetPassword />} />
//               <Route path="/forget-password" element={<ForgotPassword />} />

//               <Route element={<ProtectedRoute />}>
//                 <Route path="/" element={<Layout />}>
//                   <Route index element={<Home />} />
//                   <Route path="/tasks" element={<Tasks />} />
//                   <Route path="/tasks/:id" element={<TaskDetails />} />
//                   <Route path="/departments" element={<Departments />} />
//                   <Route path="/departments/:id" element={<DeptDetails />} />
//                   <Route path="/employees" element={<Employees />} />
//                   <Route path="/employees/:id" element={<EmpDetails />} />
//                   <Route path="/chat" element={<Chat />} />
//                   <Route path="/reports" element={<Reports />} />
//                   <Route path="/profile" element={<Profile />} />
//                 </Route>
//               </Route>
//             </Routes>
//           </Suspense>
//         </div>
//       </div>
//     </>
//   );
// }

// export default App;

import { lazy, Suspense, useLayoutEffect, useRef } from "react"; // 👈 Import hooks
import { Route, Routes, useLocation } from "react-router-dom"; // 👈 Import useLocation
import Layout from "./components/Layout";
import ProtectedRoute from "./routes/ProtectedRoutes";
import { useAuth } from "./context/AuthContext";
import { Toaster } from "./components/ui/sonner";
import { Toaster as HotToast } from "react-hot-toast";
import Pricing from "./components/Pricing";
import ProtectRegRoute from "./routes/ProtectRegRoute";
import LandingPage from "./pages/LandingPage";

// GSAP Imports
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// IMPORTANT: Adjust the import path for ScrollSmoother based on your installation
import { ScrollSmoother } from "gsap/ScrollSmoother"; // or "gsap/dist/ScrollSmoother" or "gsap-trial/ScrollSmoother"
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import Tasks from "./pages/Tasks";
import Departments from "./pages/Departments";
import Employees from "./pages/Employees";
import EmpDetails from "./pages/EmpDetails";
import Chat from "./pages/Chat";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import DepartmentDetails from "./pages/DeptDetails";

// Register plugins globally before use
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// Lazy load the pages... (keep all your lazy imports here)
const Home = lazy(() => import("./pages/Home"));
// ... other lazy imports ...
const TaskDetails = lazy(() => import("./pages/TaskDetails"));

function App() {
  const { loading } = useAuth();
  const location = useLocation(); // 👈 Hook to detect route changes
  const wrapperRef = useRef(null); // Ref for smooth-wrapper
  const contentRef = useRef(null);

  // 1. GSAP Logic for ScrollSmoother
  useLayoutEffect(() => {
    // Crucial check: Only run GSAP if the main content is rendered (ref is available)
    if (!wrapperRef.current || !contentRef.current) return;

    // We only create ScrollSmoother once.
    let smoother;
    let ctx = gsap.context(() => {
      // Create the smooth scroller
      smoother = ScrollSmoother.create({
        smooth: 1.5, // Adjust for desired smoothness (e.g., 1.5 seconds)
        effects: true, // Enables data-speed and data-lag effects
        normalizeScroll: true, // Recommended for browser inconsistencies
        // Explicitly tell ScrollSmoother which elements to use
        wrapper: wrapperRef.current,
        content: contentRef.current,
      });

      // 2. Cleanup function to kill it when the component unmounts
    }, wrapperRef); // Scoping to the wrapper element

    return () => {
      ctx.revert(); // Reverts all animations and ScrollTriggers created in the context
    };
  }, [loading]); // Run only once on mount

  // 3. Logic to reset scroll and refresh on route change
  useLayoutEffect(() => {
    if (ScrollSmoother.get() && ScrollSmoother.get().enabled) {
      // Get the existing smoother instance
      const smoother = ScrollSmoother.get();

      // Ensure the new page starts at the top
      smoother.scrollTop(0, false); // scrollTop(position, force) - force: false lets it animate

      // Refresh ScrollTrigger/ScrollSmoother to recalculate heights for the new page content
      ScrollTrigger.refresh(true); // refresh(reload) - reload: true forces a complete recalculation
    }
  }, [location.pathname]); // Re-run whenever the route path changes

  if (loading)
    return (
      <div className="flex items-center justify-center w-full min-h-screen gap-3">
        <div>
          <p className="text-lg">Loading app</p>
          <span className="loading loading-dots loading-xl"></span>
        </div>
      </div>
    );

  return (
    <>
      {/* These toasts should be outside the smooth-wrapper to prevent fixed/absolute positioning issues */}
      <Toaster richColors position="top-right" />
      <HotToast position="top-right" />

      {/* --- GSAP ScrollSmoother Structure Starts Here --- */}
      <div id="smooth-wrapper" ref={wrapperRef}>
        <div id="smooth-content" ref={contentRef}>
          <Suspense
            fallback={
              <div className="flex items-center justify-center w-full h-full gap-3">
                <p className="text-lg">Loading...</p>
                <span className="loading loading-dots loading-xl"></span>
              </div>
            }
          >
            <Routes>
              {/* All your routes remain the same */}
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/registration"
                element={
                  <ProtectRegRoute>
                    <Registration />
                  </ProtectRegRoute>
                }
              />
              <Route path="/plans" element={<Pricing />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/forget-password" element={<ForgotPassword />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/tasks/:id" element={<TaskDetails />} />
                  <Route path="/departments" element={<Departments />} />
                  <Route
                    path="/departments/:id"
                    element={<DepartmentDetails />}
                  />
                  <Route path="/employees" element={<Employees />} />
                  <Route path="/employees/:id" element={<EmpDetails />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/profile" element={<Profile />} />
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </div>
      </div>
      {/* --- GSAP ScrollSmoother Structure Ends Here --- */}
    </>
  );
}

export default App;
