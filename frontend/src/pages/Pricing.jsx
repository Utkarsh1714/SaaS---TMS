// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "sonner";
// import { CheckIcon, XIcon } from "lucide-react";

// // Assuming these are your original data sources
// import pricingData from "../utils/plans.json";
// import Navbar from "../components/Layout/Navbar";
// import Footer from "../components/Layout/Footer";
// import { motion } from "framer-motion";

// const Pricing = () => {
//   const navigate = useNavigate();
//   const { plans, features } = pricingData;
//   const popularPlan = "premium";

//   // State to manage the billing period: 'monthly' or 'yearly'
//   const [isYearly, setIsYearly] = useState(false);

//   // Toggle function
//   const handleToggle = () => {
//     setIsYearly(!isYearly);
//   };

//   const handlePayment = async (plan) => {
//     if (plan.id === "free") {
//       toast.success("Starting your free plan!");
//       navigate(`/registration?payment_success=true&plan=${plan.id}`);
//       return;
//     }

//     const amount = isYearly
//       ? parseInt(plan.yearlyPrice)
//       : parseInt(plan.monthlyPrice);

//     try {
//       const {
//         data: { orderId },
//       } = await axios.post(
//         `${import.meta.env.VITE_API_URL}/api/auth/create-order`,
//         { amount }
//       );

//       const options = {
//         key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//         amount: amount * 100,
//         currency: "INR",
//         name: "Taskify",
//         description: `${plan.name} Plan`,
//         order_id: orderId,
//         handler: async function (response) {
//           try {
//             const verificationResponse = await axios.post(
//               `${import.meta.env.VITE_API_URL}/api/auth/verify-payment`,
//               {
//                 razorpay_order_id: orderId,
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_signature: response.razorpay_signature,
//                 plan_id: plan.id,
//                 amount: amount,
//               }
//             );

//             if (verificationResponse.data.success) {
//               toast.success("Payment Successful! Redirecting to registration");
//               navigate(
//                 `/registration?payment_success=true&plan=${plan.id}&payment_id=${response.razorpay_payment_id}`
//               );
//             } else {
//               toast.error("Payment verification failed.");
//             }
//           } catch (error) {
//             console.error("Payment verification failed:", error);
//             toast.error("Payment verification failed due to a server error.");
//           }
//         },
//         theme: {
//           color: "#007BFF",
//         },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (error) {
//       console.error("Payment initiation failed:", error);
//       alert("Payment failed. Please try again.");
//     }
//   };

//   const getPlanDescription = (planId) => {
//     switch (planId) {
//       case "free":
//         return "Perfect for individuals and small teams";
//       case "premium":
//         return "For growing teams that need more";
//       case "enterprise":
//         return "For large organizations with advanced needs";
//       default:
//         return "Choose the plan that's right for you.";
//     }
//   };

//   const PricingFeature = ({ children, included = false }) => {
//     return (
//       <li className="flex items-start">
//         <div className="flex-shrink-0">
//           {included ? (
//             <CheckIcon className="h-5 w-5 text-green-500" />
//           ) : (
//             <XIcon className="h-5 w-5 text-gray-400" />
//           )}
//         </div>
//         <p
//           className={`ml-3 text-sm ${
//             included ? "text-gray-700" : "text-gray-500"
//           }`}
//         >
//           {children}
//         </p>
//       </li>
//     );
//   };

//   const TableRow = ({ feature, children }) => {
//     return (
//       <tr>
//         <td className="py-4 px-6 text-sm font-medium text-gray-900">
//           {feature}
//         </td>
//         {children}
//       </tr>
//     );
//   };

//   const TableCell = ({ children, included }) => {
//     if (included === undefined) {
//       return (
//         <td className="py-4 px-6 text-sm text-gray-700 text-center">
//           {children}
//         </td>
//       );
//     }
//     return (
//       <td className="py-4 px-6 text-center">
//         {included ? (
//           <CheckIcon className="h-5 w-5 text-green-500 mx-auto" />
//         ) : (
//           <XIcon className="h-5 w-5 text-gray-400 mx-auto" />
//         )}
//       </td>
//     );
//   };

//   const FaqItem = ({ question, answer }) => {
//     return (
//       <div>
//         <h3 className="text-lg font-medium text-gray-900 mb-2">{question}</h3>
//         <p className="text-gray-600">{answer}</p>
//       </div>
//     );
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       transition={{ duration: 1.3 }}
//       className="min-h-screen flex flex-col bg-white"
//     >
//       <Navbar />
//       {/* Header */}
//       <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16 px-4 sm:px-6 lg:px-8 text-white">
//         <div className="max-w-7xl mx-auto text-center">
//           <h1 className="text-3xl md:text-4xl font-bold mb-4">
//             Simple, Transparent Pricing
//           </h1>
//           <p className="text-xl text-blue-100 max-w-3xl mx-auto">
//             Choose the plan that's right for your organization. All plans
//             include a 14-day free trial.
//           </p>
//         </div>
//       </section>

//       {/* Pricing Toggle */}
//       <div className="mt-8 flex justify-center items-center">
//         <span
//           className={`text-base font-medium ${
//             !isYearly ? "text-blue-600" : "text-gray-500"
//           }`}
//         >
//           Monthly Billing
//         </span>
//         <button
//           onClick={handleToggle}
//           className={`mx-4 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
//             isYearly ? "bg-blue-600" : "bg-gray-200"
//           }`}
//         >
//           <span
//             className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
//               isYearly ? "translate-x-5" : "translate-x-0"
//             }`}
//           ></span>
//         </button>
//         <span
//           className={`text-base font-medium ${
//             isYearly ? "text-blue-600" : "text-gray-500"
//           }`}
//         >
//           Yearly Billing
//         </span>
//         <span className="ml-2 text-sm text-blue-600 font-semibold">
//           (Save 20%)
//         </span>
//       </div>

//       {/* Pricing Plans */}
//       <section className="py-8 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
//             {plans.map((plan) => (
//               <div
//                 key={plan.id}
//                 className={`bg-white border ${
//                   plan.id === popularPlan
//                     ? "border-2 border-blue-600"
//                     : "border-gray-200"
//                 } rounded-lg shadow-sm overflow-hidden relative`}
//               >
//                 {plan.id === popularPlan && (
//                   <div className="absolute top-0 inset-x-0">
//                     <div className="bg-blue-600 text-white text-center text-sm font-medium py-1">
//                       Most Popular
//                     </div>
//                   </div>
//                 )}
//                 <div className={`p-6 ${plan.id === popularPlan ? "pt-8" : ""}`}>
//                   <h3 className="text-lg font-medium text-gray-900">
//                     {plan.name}
//                   </h3>
//                   <p className="mt-1 text-sm text-gray-500">
//                     {getPlanDescription(plan.id)}
//                   </p>
//                   <div className="mt-4 flex items-baseline">
//                     <span className="text-4xl font-extrabold text-gray-900">
//                       {isYearly
//                         ? `₹${plan.yearlyPrice}`
//                         : `₹${plan.monthlyPrice}`}
//                     </span>
//                     <span className="ml-1 text-xl font-medium text-gray-500">
//                       {isYearly ? "/year" : "/month"}
//                     </span>
//                   </div>
//                   <p className="mt-1 text-sm text-gray-500">per user</p>
//                   <div className="mt-6">
//                     <button
//                       onClick={() => handlePayment(plan)}
//                       className="block w-full py-3 px-4 rounded-md shadow bg-blue-600 text-white font-medium hover:bg-blue-700"
//                     >
//                       {plan.buttonText}
//                     </button>
//                   </div>
//                 </div>
//                 <div className="px-6 pt-4 pb-8">
//                   <h4 className="text-sm font-medium text-gray-900 mb-4">
//                     What's included:
//                   </h4>
//                   <ul className="space-y-4">
//                     {plan.features?.map((feature, index) => (
//                       <PricingFeature key={index} included={feature.included}>
//                         {feature.text}
//                       </PricingFeature>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Feature Comparison */}
//       <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
//             Compare Plans
//           </h2>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th
//                     scope="col"
//                     className="py-3 px-6 text-left text-sm font-medium text-gray-900"
//                   >
//                     Features
//                   </th>
//                   {plans.map((plan) => (
//                     <th
//                       key={plan.id}
//                       scope="col"
//                       className={`py-3 px-6 text-center text-sm font-medium ${
//                         plan.id === popularPlan
//                           ? "text-blue-600"
//                           : "text-gray-900"
//                       }`}
//                     >
//                       {plan.name}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {features.map((feature, index) => (
//                   <TableRow key={index} feature={feature.name}>
//                     <TableCell included={feature.free}></TableCell>
//                     <TableCell included={feature.premium}></TableCell>
//                     <TableCell included={feature.enterprise}></TableCell>
//                   </TableRow>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </section>

//       {/* FAQ Section */}
//       <section className="py-16 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-3xl mx-auto">
//           <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
//             Frequently Asked Questions
//           </h2>
//           <div className="space-y-8">
//             <FaqItem
//               question="How does the 14-day free trial work?"
//               answer="Our 14-day free trial gives you full access to all features in the plan you select. No credit card is required to start, and you can cancel at any time during the trial period with no obligation."
//             />
//             <FaqItem
//               question="Can I change plans later?"
//               answer="Yes, you can upgrade or downgrade your plan at any time. If you upgrade, the change takes effect immediately. If you downgrade, the change will take effect at the start of your next billing cycle."
//             />
//             <FaqItem
//               question="Do you offer discounts for non-profits or educational institutions?"
//               answer="Yes, we offer special pricing for qualified non-profit organizations and educational institutions. Please contact our sales team for more information."
//             />
//             <FaqItem
//               question="Is there a limit to how many projects I can create?"
//               answer="The Starter plan allows up to 3 active projects. Professional and Enterprise plans include unlimited projects."
//             />
//             <FaqItem
//               question="What payment methods do you accept?"
//               answer="We accept all major credit cards, including Visa, Mastercard, American Express, and Discover. For Enterprise customers, we also accept payment via invoice."
//             />
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600 text-white">
//         <div className="max-w-7xl mx-auto text-center">
//           <h2 className="text-3xl font-bold mb-6">
//             Ready to transform your organization?
//           </h2>
//           <p className="text-xl mb-10 text-blue-100 max-w-3xl mx-auto">
//             Start your 14-day free trial today. No credit card required.
//           </p>
//           <div className="flex flex-col sm:flex-row justify-center gap-4">
//             <button
//               onClick={() => handlePayment(plans[0])} // Assumes 'free' plan is the first in the array
//               className="bg-white text-blue-700 hover:bg-blue-50 font-medium px-8 py-3 rounded-lg"
//             >
//               Get started for free
//             </button>
//             <button className="bg-blue-800 text-white hover:bg-blue-900 font-medium px-8 py-3 rounded-lg">
//               Contact sales
//             </button>
//           </div>
//         </div>
//       </section>
//       <Footer />
//     </motion.div>
//   );
// };

// export default Pricing;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Zap,
  Check,
  Minus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Components
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";
import AnimatedContent from "@/components/ui/AnimatedContent";

// Data
import pricingData from "../utils/plans.json";

const Pricing = () => {
  const navigate = useNavigate();
  const { plans, features } = pricingData;
  const popularPlan = "premium";

  // State to manage the billing period
  const [isYearly, setIsYearly] = useState(false);

  const handleToggle = () => setIsYearly(!isYearly);

  // --- Payment Logic (Kept exactly as provided) ---
  const handlePayment = async (plan) => {
    const billingCycle = isYearly ? "yearly" : "monthly";

    if (plan.id === "free") {
      // Pass billing=monthly (or whatever default) for free
      navigate(
        `/registration?payment_success=true&plan=${plan.id}&billing=monthly`
      );
      return;
    }

    const amount = isYearly
      ? parseInt(plan.yearlyPrice)
      : parseInt(plan.monthlyPrice);

    try {
      const {
        data: { orderId },
      } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/create-order`,
        { amount }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: "INR",
        name: "Taskify",
        description: `${plan.name} Plan`,
        order_id: orderId,
        handler: async function (response) {
          try {
            const verificationResponse = await axios.post(
              `${import.meta.env.VITE_API_URL}/api/auth/verify-payment`,
              {
                razorpay_order_id: orderId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan_id: plan.id,
                amount: amount,
              }
            );

            if (verificationResponse.data.success) {
              toast.success("Payment Successful! Redirecting...");

              const billingCycle = isYearly ? "yearly" : "monthly";
              
              navigate(
                `/registration?payment_success=true&plan=${plan.id}&payment_id=${response.razorpay_payment_id}&billing=${billingCycle}`
              );
            } else {
              toast.error("Payment verification failed.");
            }
          } catch (error) {
            console.error("Payment verification failed:", error);
            toast.error("Payment verification failed due to a server error.");
          }
        },
        theme: { color: "#2563EB" }, // Blue-600
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment initiation failed:", error);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-blue-100">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-10 lg:pt-48 lg:pb-20 overflow-hidden">
        {/* Background Grids */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

        <div className="max-w-7xl mx-auto px-4 text-center">
          <AnimatedContent direction="vertical" distance={20}>
            <h2 className="text-blue-600 font-bold tracking-wide uppercase text-sm mb-4">
              Pricing
            </h2>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
              Simple pricing, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
                no hidden fees.
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
              Start for free and scale as you grow. No credit card required for
              the trial.
            </p>

            {/* Custom Toggle */}
            <div className="flex justify-center items-center gap-4 mb-16">
              <span
                className={`text-sm font-semibold ${
                  !isYearly ? "text-slate-900" : "text-slate-500"
                }`}
              >
                Monthly
              </span>
              <button
                onClick={handleToggle}
                className="relative w-14 h-8 bg-slate-200 rounded-full p-1 transition-colors hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <motion.div
                  className="w-6 h-6 bg-white rounded-full shadow-md"
                  animate={{ x: isYearly ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
              <span
                className={`text-sm font-semibold ${
                  isYearly ? "text-slate-900" : "text-slate-500"
                }`}
              >
                Yearly{" "}
                <span className="text-blue-600 text-xs bg-blue-50 px-2 py-0.5 rounded-full ml-1">
                  -20%
                </span>
              </span>
            </div>
          </AnimatedContent>

          {/* --- PRICING CARDS --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => {
              const isPopular = plan.id === popularPlan;
              return (
                <AnimatedContent key={plan.id} delay={index * 0.1}>
                  <div
                    className={`relative flex flex-col p-8 bg-white rounded-3xl border transition-all duration-300 h-full ${
                      isPopular
                        ? "border-blue-600 shadow-2xl shadow-blue-900/10 scale-105 z-10"
                        : "border-slate-200 shadow-xl shadow-slate-200/50 hover:border-blue-300"
                    }`}
                  >
                    {isPopular && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
                        Most Popular
                      </div>
                    )}

                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">
                        {plan.name}
                      </h3>
                      <p className="text-sm text-slate-500 min-h-[40px]">
                        {getPlanDescription(plan.id)}
                      </p>
                    </div>

                    <div className="mb-8 flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-slate-900">
                        ₹{isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                      </span>
                      <span className="text-slate-500 font-medium">
                        /{isYearly ? "yr" : "mo"}
                      </span>
                    </div>

                    <button
                      onClick={() => handlePayment(plan)}
                      className={`w-full py-4 rounded-xl font-bold transition-all ${
                        isPopular
                          ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/25"
                          : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                      }`}
                    >
                      {plan.buttonText}
                    </button>

                    <div className="mt-8 space-y-4 text-left flex-1">
                      <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Includes:
                      </p>
                      <ul className="space-y-3">
                        {plan.features?.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3">
                            {feature.included ? (
                              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                            ) : (
                              <XCircle className="w-5 h-5 text-slate-300 shrink-0" />
                            )}
                            <span
                              className={`text-sm ${
                                feature.included
                                  ? "text-slate-700"
                                  : "text-slate-400 line-through"
                              }`}
                            >
                              {feature.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </AnimatedContent>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- COMPARISON TABLE --- */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">
              Compare features
            </h2>
            <p className="text-slate-600 mt-4">
              Detailed breakdown of what's included in each plan.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-slate-500 w-1/4">
                    Feature
                  </th>
                  {plans.map((plan) => (
                    <th key={plan.id} className="p-4 text-center w-1/4">
                      <span
                        className={`text-lg font-bold ${
                          plan.id === popularPlan
                            ? "text-blue-600"
                            : "text-slate-900"
                        }`}
                      >
                        {plan.name}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {features.map((feature, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-sm font-medium text-slate-700 flex items-center gap-2">
                      {feature.name}
                      <HelpCircle
                        size={14}
                        className="text-slate-400 cursor-help"
                      />
                    </td>
                    <TableCell included={feature.free} />
                    <TableCell included={feature.premium} />
                    <TableCell included={feature.enterprise} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <FaqItem
              question="Can I cancel anytime?"
              answer="Yes, you can cancel your subscription at any time. Your access will remain active until the end of your billing period."
            />
            <FaqItem
              question="What payment methods do you accept?"
              answer="We accept all major credit cards, UPI, and net banking via our secure Razorpay integration."
            />
            <FaqItem
              question="Can I change plans later?"
              answer="Absolutely. You can upgrade or downgrade your plan from your dashboard settings at any time."
            />
            <FaqItem
              question="Do you offer refunds?"
              answer="We offer a 14-day money-back guarantee if you are not satisfied with our service for any reason."
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
            Ready to get started?
          </h2>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Join thousands of teams managing their work with Taskify.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => handlePayment(plans[0])}
              className="bg-white text-slate-900 hover:bg-blue-50 font-bold px-8 py-4 rounded-xl shadow-lg transition-all hover:scale-105"
            >
              Start Free Trial
            </button>
            <button className="bg-slate-800 text-white hover:bg-slate-700 font-bold px-8 py-4 rounded-xl border border-slate-700 transition-all">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// --- HELPER COMPONENTS ---

const getPlanDescription = (planId) => {
  switch (planId) {
    case "free":
      return "Perfect for individuals just starting out.";
    case "premium":
      return "For growing teams that need power.";
    case "enterprise":
      return "Custom solutions for large organizations.";
    default:
      return "Choose your plan.";
  }
};

const TableCell = ({ included }) => (
  <td className="p-4 text-center">
    {included ? (
      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600">
        <Check size={16} strokeWidth={3} />
      </div>
    ) : (
      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-400">
        <Minus size={16} />
      </div>
    )}
  </td>
);

const FaqItem = ({ question, answer }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <h3 className="font-bold text-slate-900 mb-2 flex items-start gap-2">
      <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
      {question}
    </h3>
    <p className="text-slate-600 text-sm leading-relaxed pl-7">{answer}</p>
  </div>
);

export default Pricing;
