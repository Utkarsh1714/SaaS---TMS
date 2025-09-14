import { useState } from "react";
import pricingData from "../utils/plans.json"; // Make sure the path is correct
import { useNavigate } from "react-router-dom";
import axios from "axios"; // We'll use axios for API calls
import { toast } from "sonner";

const Pricing = () => {
  const navigate = useNavigate();
  const { plans, features } = pricingData;
  const popularPlan = "premium";

  // State to manage the billing period: 'monthly' or 'yearly'
  const [isYearly, setIsYearly] = useState(false);

  // Toggle function
  const handleToggle = () => {
    setIsYearly(!isYearly);
  };

  // The function to handle payment initiation
  const handlePayment = async (plan) => {
    if (plan.id === "free") {
      toast.success("Starting your free plan!");
      navigate(`/registration?payment_success=true&plan=${plan.id}`);
      return;
    }

    const amount = isYearly
      ? parseInt(plan.yearlyPrice)
      : parseInt(plan.monthlyPrice);

    try {
      // Step 1: Call your backend API to create a Razorpay order
      // Replace with your actual backend endpoint
      const {
        data: { orderId },
      } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/create-order`,
        { amount }
      );

      // Step 2: Open the Razorpay checkout pop-up with the received orderId
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Replace with your test key ID
        amount: amount * 100, // Amount in paisa
        currency: "INR",
        name: "Taskify",
        description: `${plan.name} Plan`,
        order_id: orderId,
        handler: async function (response) {
          try {
            // Call backend to verify payment
            const verificationResponse = await axios.post(
              `${import.meta.env.VITE_API_URL}/api/auth/verify-payment`,
              {
                razorpay_order_id: orderId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan_id: plan.id,
                amount: amount
              }
            );

            if (verificationResponse.data.success) {
              toast.success("Payment Successful! Redirecting to registration");
              // Redirect to the registration page with plan and payment information
              navigate(
                `/registration?payment_success=true&plan=${plan.id}&payment_id=${response.razorpay_payment_id}`
              );
            } else {
              toast.error("Payment verification failed.");
            }
          } catch (error) {
            console.error("Payment verification failed:", error);
            toast.error("Payment verification failed due to a server error.");
          }
        },
        theme: {
          color: "#007BFF",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment initiation failed:", error);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Title and Billing Toggle */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-xl text-gray-500">
            Choose the plan that's right for you.
          </p>

          {/* Billing Toggle UI */}
          <div className="mt-8 flex justify-center items-center">
            <span
              className={`text-base font-medium ${
                !isYearly ? "text-blue-600" : "text-gray-500"
              }`}
            >
              Monthly Billing
            </span>
            <button
              onClick={handleToggle}
              className={`mx-4 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                isYearly ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isYearly ? "translate-x-5" : "translate-x-0"
                }`}
              ></span>
            </button>
            <span
              className={`text-base font-medium ${
                isYearly ? "text-blue-600" : "text-gray-500"
              }`}
            >
              Yearly Billing
            </span>
            <span className="ml-2 text-sm text-blue-600 font-semibold">
              (Save 20%)
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mt-12 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`p-8 rounded-lg shadow-md flex flex-col ${
                plan.id === popularPlan
                  ? "bg-blue-600 text-white transform scale-105"
                  : "bg-white"
              }`}
            >
              <h3
                className={`text-xl font-semibold uppercase tracking-wide ${
                  plan.id === popularPlan ? "text-white" : "text-gray-900"
                }`}
              >
                {plan.name}
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                {plan.id === "free"
                  ? "Start building for free."
                  : "All the features you need."}
              </p>
              <div className="mt-6 flex items-baseline">
                <span
                  className={`text-4xl font-extrabold ${
                    plan.id === popularPlan ? "text-white" : "text-gray-900"
                  }`}
                >
                  {isYearly ? `₹${plan.yearlyPrice}` : `₹${plan.monthlyPrice}`}
                </span>
                <span
                  className={`ml-1 text-base font-medium ${
                    plan.id === popularPlan ? "text-blue-200" : "text-gray-500"
                  }`}
                >
                  {isYearly ? "per year" : "per month"}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                {plan.id === popularPlan ? "Most Popular" : ""}
              </p>
              <button
                onClick={() => handlePayment(plan)}
                className={`mt-8 block w-full py-3 px-6 rounded-md text-center font-medium ${
                  plan.id === popularPlan
                    ? "bg-white text-blue-600 hover:bg-gray-100"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="mt-16 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-4 px-6 text-sm font-semibold text-gray-900">
                  Features
                </th>
                {plans.map((plan) => (
                  <th
                    key={plan.id}
                    className="py-4 px-6 text-sm font-semibold text-gray-900"
                  >
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {feature.name}
                  </td>
                  <td className="py-4 px-6">
                    {feature.free ? (
                      <span className="text-green-500">✔️</span>
                    ) : (
                      <span className="text-red-500">❌</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {feature.premium ? (
                      <span className="text-green-500">✔️</span>
                    ) : (
                      <span className="text-red-500">❌</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {feature.enterprise ? (
                      <span className="text-green-500">✔️</span>
                    ) : (
                      <span className="text-red-500">❌</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
