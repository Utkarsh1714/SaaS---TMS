import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { CheckIcon, XIcon } from "lucide-react";

// Assuming these are your original data sources
import pricingData from "../utils/plans.json";
import Navbar from "./Navbar";
import Footer from "./Footer";

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
              toast.success("Payment Successful! Redirecting to registration");
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

  const getPlanDescription = (planId) => {
    switch (planId) {
      case "free":
        return "Perfect for individuals and small teams";
      case "premium":
        return "For growing teams that need more";
      case "enterprise":
        return "For large organizations with advanced needs";
      default:
        return "Choose the plan that's right for you.";
    }
  };

  const PricingFeature = ({ children, included = false }) => {
    return (
      <li className="flex items-start">
        <div className="flex-shrink-0">
          {included ? (
            <CheckIcon className="h-5 w-5 text-green-500" />
          ) : (
            <XIcon className="h-5 w-5 text-gray-400" />
          )}
        </div>
        <p
          className={`ml-3 text-sm ${
            included ? "text-gray-700" : "text-gray-500"
          }`}
        >
          {children}
        </p>
      </li>
    );
  };

  const TableRow = ({ feature, children }) => {
    return (
      <tr>
        <td className="py-4 px-6 text-sm font-medium text-gray-900">
          {feature}
        </td>
        {children}
      </tr>
    );
  };

  const TableCell = ({ children, included }) => {
    if (included === undefined) {
      return (
        <td className="py-4 px-6 text-sm text-gray-700 text-center">
          {children}
        </td>
      );
    }
    return (
      <td className="py-4 px-6 text-center">
        {included ? (
          <CheckIcon className="h-5 w-5 text-green-500 mx-auto" />
        ) : (
          <XIcon className="h-5 w-5 text-gray-400 mx-auto" />
        )}
      </td>
    );
  };

  const FaqItem = ({ question, answer }) => {
    return (
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{question}</h3>
        <p className="text-gray-600">{answer}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Choose the plan that's right for your organization. All plans
            include a 14-day free trial.
          </p>
        </div>
      </section>

      {/* Pricing Toggle */}
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

      {/* Pricing Plans */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white border ${
                  plan.id === popularPlan
                    ? "border-2 border-blue-600"
                    : "border-gray-200"
                } rounded-lg shadow-sm overflow-hidden relative`}
              >
                {plan.id === popularPlan && (
                  <div className="absolute top-0 inset-x-0">
                    <div className="bg-blue-600 text-white text-center text-sm font-medium py-1">
                      Most Popular
                    </div>
                  </div>
                )}
                <div className={`p-6 ${plan.id === popularPlan ? "pt-8" : ""}`}>
                  <h3 className="text-lg font-medium text-gray-900">
                    {plan.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {getPlanDescription(plan.id)}
                  </p>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-extrabold text-gray-900">
                      {isYearly
                        ? `₹${plan.yearlyPrice}`
                        : `₹${plan.monthlyPrice}`}
                    </span>
                    <span className="ml-1 text-xl font-medium text-gray-500">
                      {isYearly ? "/year" : "/month"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">per user</p>
                  <div className="mt-6">
                    <button
                      onClick={() => handlePayment(plan)}
                      className="block w-full py-3 px-4 rounded-md shadow bg-blue-600 text-white font-medium hover:bg-blue-700"
                    >
                      {plan.buttonText}
                    </button>
                  </div>
                </div>
                <div className="px-6 pt-4 pb-8">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">
                    What's included:
                  </h4>
                  <ul className="space-y-4">
                    {plan.features?.map((feature, index) => (
                      <PricingFeature key={index} included={feature.included}>
                        {feature.text}
                      </PricingFeature>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Compare Plans
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th
                    scope="col"
                    className="py-3 px-6 text-left text-sm font-medium text-gray-900"
                  >
                    Features
                  </th>
                  {plans.map((plan) => (
                    <th
                      key={plan.id}
                      scope="col"
                      className={`py-3 px-6 text-center text-sm font-medium ${
                        plan.id === popularPlan
                          ? "text-blue-600"
                          : "text-gray-900"
                      }`}
                    >
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {features.map((feature, index) => (
                  <TableRow key={index} feature={feature.name}>
                    <TableCell included={feature.free}></TableCell>
                    <TableCell included={feature.premium}></TableCell>
                    <TableCell included={feature.enterprise}></TableCell>
                  </TableRow>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-8">
            <FaqItem
              question="How does the 14-day free trial work?"
              answer="Our 14-day free trial gives you full access to all features in the plan you select. No credit card is required to start, and you can cancel at any time during the trial period with no obligation."
            />
            <FaqItem
              question="Can I change plans later?"
              answer="Yes, you can upgrade or downgrade your plan at any time. If you upgrade, the change takes effect immediately. If you downgrade, the change will take effect at the start of your next billing cycle."
            />
            <FaqItem
              question="Do you offer discounts for non-profits or educational institutions?"
              answer="Yes, we offer special pricing for qualified non-profit organizations and educational institutions. Please contact our sales team for more information."
            />
            <FaqItem
              question="Is there a limit to how many projects I can create?"
              answer="The Starter plan allows up to 3 active projects. Professional and Enterprise plans include unlimited projects."
            />
            <FaqItem
              question="What payment methods do you accept?"
              answer="We accept all major credit cards, including Visa, Mastercard, American Express, and Discover. For Enterprise customers, we also accept payment via invoice."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to transform your organization?
          </h2>
          <p className="text-xl mb-10 text-blue-100 max-w-3xl mx-auto">
            Start your 14-day free trial today. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => handlePayment(plans[0])} // Assumes 'free' plan is the first in the array
              className="bg-white text-blue-700 hover:bg-blue-50 font-medium px-8 py-3 rounded-lg"
            >
              Get started for free
            </button>
            <button className="bg-blue-800 text-white hover:bg-blue-900 font-medium px-8 py-3 rounded-lg">
              Contact sales
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Pricing;
