// import { useId, useMemo, useState } from "react";
// import DepartmentSelect from "../components/DepartmentSelect";
// import axios from "axios";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { useAuth } from "@/context/AuthContext";
// import { toast } from "react-hot-toast";
// import {
//   CheckIcon,
//   Crown,
//   EyeIcon,
//   EyeOffIcon,
//   Info,
//   UploadCloudIcon,
//   UserIcon,
//   XIcon,
// } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { motion } from "framer-motion";

// const Registration = () => {
//   const [searchParams] = useSearchParams();
//   const planValue = searchParams.get("plan");

//   const [password, setPassword] = useState("");
//   const [isVisible, setIsVisible] = useState(false);
//   const [logoUrl, setLogoUrl] = useState("");

//   const [profileImage, setProfileImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);

//   const [formFields, setFormFields] = useState({
//     username: "",
//     email: "",
//     contactNo: "",
//     companyName: "",
//     gstin: "",
//     address: "",
//     city: "",
//     state: "",
//     pincode: "",
//     country: "",
//     plan: planValue,
//   });

//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const id = useId();

//   const toggleVisibility = () => setIsVisible((prev) => !prev);

//   // Password strength check logic
//   const checkStrength = (pass) => {
//     const requirements = [
//       { regex: /.{8,}/, text: "At least 8 characters" },
//       { regex: /[0-9]/, text: "At least 1 number" },
//       { regex: /[a-z]/, text: "At least 1 lowercase letter" },
//       { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
//     ];
//     return requirements.map((req) => ({
//       met: req.regex.test(pass),
//       text: req.text,
//     }));
//   };

//   const strength = checkStrength(password);
//   const strengthScore = useMemo(() => {
//     return strength.filter((req) => req.met).length;
//   }, [strength]);

//   const getStrengthColor = (score) => {
//     if (score === 0) return "bg-border";
//     if (score <= 1) return "bg-red-500";
//     if (score <= 2) return "bg-orange-500";
//     if (score === 3) return "bg-amber-500";
//     return "bg-emerald-500";
//   };

//   const getStrengthText = (score) => {
//     if (score === 0) return "Enter a password";
//     if (score <= 2) return "Weak password";
//     if (score === 3) return "Medium password";
//     return "Strong password";
//   };

//   // ✅ Check if all required fields are filled
//   const isFormValid =
//     Object.values(formFields).every((val) => val.trim() !== "") &&
//     password.trim() !== "";

//   const handleChange = (e) => {
//     setFormFields((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setProfileImage(file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();

//     Object.keys(formFields).forEach((key) => {
//       formData.append(key, formFields[key]);
//     });

//     formData.append("password", password);
//     formData.append("logoUrl", logoUrl);

//     if (profileImage) {
//       formData.append("profileImage", profileImage);
//     }

//     try {
//       const res = await axios.post(
//         `${import.meta.env.VITE_API_URL}/api/auth/register-org`,
//         formValues,
//         {
//           withCredentials: true,
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );

//       login(res.data.user);
//       toast.success("Organization registered successfully! Welcome aboard.");

//       navigate("/dashboard");
//     } catch (error) {
//       console.error("Error registering organization:", error);
//       toast.error(error?.response?.data?.message || "Registration failed");
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       transition={{ duration: 1.3 }}
//       className="w-full h-screen py-4 px-8"
//     >
//       <div className="text-center py-4">
//         <h1 className="Headline2 text-2xl md:text-3xl lg:text-5xl font-semibold">
//           Register Your Organization
//         </h1>
//       </div>
//       <div className="w-full py-4 md:px-24 text-center text-lg text-slate-600">
//         <h4>
//           Start your journey with a powerful task management system built for
//           teams. Just a few steps to set up your organization and take control
//           of your workflows.
//         </h4>
//       </div>
//       <div className="w-full flex flex-col items-center justify-center py-6">
//         <form onSubmit={handleSubmit} className="w-full">
//           <div className="w-full">
//             <h1 className="text-2xl">Personal details</h1>
//             <div className="flex flex-col items-center mb-8">
//               <div className="relative group cursor-pointer">
//                 <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center">
//                   {imagePreview ? (
//                     <img
//                       src={imagePreview}
//                       alt="Profile Preview"
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <UserIcon className="w-16 h-16 text-gray-400" />
//                   )}
//                 </div>
//                 <label className="absolute bottom-0 right-0 bg-yellow-400 p-2 rounded-full cursor-pointer hover:bg-yellow-500 transition-colors shadow-sm">
//                   <UploadCloudIcon size={20} className="text-white" />
//                   <input
//                     type="file"
//                     accept="image/*"
//                     className="hidden"
//                     onChange={handleImageChange}
//                   />
//                 </label>
//               </div>
//               <p className="text-sm text-gray-500 mt-2">
//                 Upload Profile Picture
//               </p>
//             </div>
//             <div className="w-full flex flex-col sm:flex-row items-center justify-center sm:gap-8">
//               <label className="block text-left mt-4 w-full">
//                 <span className="text-gray-700">
//                   Your Full Name<span className="text-red-500 pl-1">*</span>
//                 </span>
//                 <input
//                   name="username"
//                   type="text"
//                   value={formFields.username}
//                   onChange={handleChange}
//                   placeholder="Enter your full name"
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
//                   required
//                 />
//               </label>
//               <label className="block text-left mt-4 w-full">
//                 <span className="text-gray-700">
//                   Email Address<span className="text-red-500 pl-1">*</span>
//                 </span>
//                 <input
//                   name="email"
//                   type="email"
//                   value={formFields.email}
//                   onChange={handleChange}
//                   placeholder="Enter your email address"
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
//                   required
//                 />
//               </label>
//             </div>
//             <div className="w-full flex flex-col sm:flex-row items-start justify-center sm:gap-8">
//               <label className="block text-left mt-4 w-full">
//                 <span className="text-gray-700">
//                   Contact Number<span className="text-red-500 pl-1">*</span>
//                 </span>
//                 <input
//                   name="contactNo"
//                   type="number"
//                   value={formFields.contactNo}
//                   onChange={handleChange}
//                   placeholder="Ex. +91 1234567890"
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
//                   required
//                 />
//               </label>
//               <label className="block text-left mt-4 w-full">
//                 <span className="text-gray-700">
//                   Set Password<span className="text-red-500 pl-1">*</span>
//                 </span>
//                 <div className="relative mt-2">
//                   <Input
//                     id={id}
//                     className="pe-9"
//                     placeholder="Password"
//                     type={isVisible ? "text" : "password"}
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                   />
//                   <button
//                     className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center"
//                     type="button"
//                     onClick={toggleVisibility}
//                     aria-label={isVisible ? "Hide password" : "Show password"}
//                   >
//                     {isVisible ? (
//                       <EyeOffIcon size={16} />
//                     ) : (
//                       <EyeIcon size={16} />
//                     )}
//                   </button>
//                 </div>

//                 {/* Strength Bar */}
//                 <div className="bg-border mt-3 mb-2 h-1 w-full overflow-hidden rounded-full">
//                   <div
//                     className={`h-full ${getStrengthColor(
//                       strengthScore
//                     )} transition-all duration-500`}
//                     style={{ width: `${(strengthScore / 4) * 100}%` }}
//                   ></div>
//                 </div>

//                 {/* Strength Text */}
//                 <p className="text-sm mb-2">
//                   {getStrengthText(strengthScore)}. Must contain:
//                 </p>

//                 {/* Requirements */}
//                 <ul className="space-y-1.5">
//                   {strength.map((req, index) => (
//                     <li key={index} className="flex items-center gap-2">
//                       {req.met ? (
//                         <CheckIcon size={16} className="text-emerald-500" />
//                       ) : (
//                         <XIcon size={16} className="text-gray-400" />
//                       )}
//                       <span
//                         className={`text-xs ${
//                           req.met ? "text-emerald-600" : "text-gray-500"
//                         }`}
//                       >
//                         {req.text}
//                       </span>
//                     </li>
//                   ))}
//                 </ul>
//               </label>
//             </div>
//           </div>

//           <div className="w-full max-w-2xl mx-auto my-8">
//             <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 flex flex-col sm:flex-row items-start gap-4 shadow-sm">
//               <div className="bg-yellow-100 p-3 rounded-full shrink-0">
//                 <Crown className="w-6 h-6 text-yellow-600" />
//               </div>
//               <div className="text-left">
//                 <h3 className="text-lg font-semibold text-yellow-800 mb-1">
//                   Admin Privileges
//                 </h3>
//                 <p className="text-yellow-700 leading-relaxed text-sm sm:text-base">
//                   By registering, you will be assigned as the{" "}
//                   <span className="font-bold text-yellow-900 bg-yellow-200/50 px-1 rounded">
//                     Boss
//                   </span>{" "}
//                   of this organization. You will have full control to manage
//                   departments, team members, and workflows from your dashboard.
//                 </p>
//               </div>
//             </div>
//           </div>

//           <h1 className="text-2xl">Organization Details</h1>
//           <div className="w-full flex items-center justify-center gap-8">
//             <label className="block text-left mt-4 w-full">
//               <span className="text-gray-700">
//                 Company Name<span className="text-red-500 pl-1">*</span>
//               </span>
//               <input
//                 name="companyName"
//                 type="text"
//                 value={formFields.companyName}
//                 onChange={handleChange}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
//                 required
//               />
//             </label>
//             <label className="block text-left mt-4 w-full">
//               <span className="text-gray-700">
//                 GSTIN Number<span className="text-red-500 pl-1">*</span>
//               </span>
//               <input
//                 name="gstin"
//                 type="text"
//                 value={formFields.gstin}
//                 onChange={handleChange}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
//                 required
//               />
//             </label>
//           </div>
//           <div className="w-full flex items-center justify-center gap-8">
//             <label className="block text-left mt-4 w-full">
//               <span className="text-gray-700">
//                 Address<span className="text-red-500 pl-1">*</span>
//               </span>
//               <input
//                 name="address"
//                 type="text"
//                 value={formFields.address}
//                 onChange={handleChange}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
//                 required
//               />
//             </label>
//             <label className="block text-left mt-4 w-full">
//               <span className="text-gray-700">
//                 City<span className="text-red-500 pl-1">*</span>
//               </span>
//               <input
//                 name="city"
//                 type="text"
//                 value={formFields.city}
//                 onChange={handleChange}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
//                 required
//               />
//             </label>
//           </div>
//           <div className="w-full flex items-center justify-center gap-8">
//             <label className="block text-left mt-4 w-full">
//               <span className="text-gray-700">
//                 State<span className="text-red-500 pl-1">*</span>
//               </span>
//               <input
//                 name="state"
//                 type="text"
//                 value={formFields.state}
//                 onChange={handleChange}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
//                 required
//               />
//             </label>
//             <label className="block text-left mt-4 w-full">
//               <span className="text-gray-700">
//                 Pincode<span className="text-red-500 pl-1">*</span>
//               </span>
//               <input
//                 name="pincode"
//                 type="number"
//                 value={formFields.pincode}
//                 onChange={handleChange}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
//                 required
//               />
//             </label>
//           </div>
//           <div className="w-full flex items-center justify-center gap-8">
//             <label className="block text-left mt-4 w-full">
//               <span className="text-gray-700">
//                 Country<span className="text-red-500 pl-1">*</span>
//               </span>
//               <input
//                 name="country"
//                 type="text"
//                 value={formFields.country}
//                 onChange={handleChange}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
//               />
//             </label>
//             <label className="block text-left mt-4 w-full">
//               <span className="text-gray-700">Webstie URL (Optional)</span>
//               <input
//                 name="websiteUrl"
//                 type="text"
//                 value={formFields.websiteUrl}
//                 onChange={handleChange}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
//               />
//             </label>
//           </div>
//           <div className="w-full flex items-start justify-center gap-8">
//             <label className="block text-left mt-4 w-full">
//               <span className="text-gray-700">
//                 Upload Company Logo (URL)
//                 <span className="text-red-500 pl-1">*</span>
//               </span>
//               <input
//                 name="logoUrl"
//                 type="text"
//                 value={logoUrl}
//                 onChange={(e) => setLogoUrl(e.target.value)}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
//               />
//             </label>
//             <div className="flex items-center justify-center mt-5">
//               <img
//                 src={
//                   logoUrl ||
//                   "https://img.icons8.com/?size=100&id=114320&format=png&color=000000"
//                 }
//                 alt="Logo Preview"
//                 className="w-[200px] h-[200px] object-contain border rounded"
//               />
//             </div>
//           </div>
//           <div className="w-full flex justify-center mt-8">
//             <button
//               type="submit"
//               disabled={!isFormValid}
//               className={`px-6 py-2 font-semibold rounded-md ${
//                 isFormValid
//                   ? "bg-yellow-400 text-white hover:bg-yellow-500"
//                   : "bg-gray-300 text-gray-500 cursor-not-allowed"
//               }`}
//             >
//               Register
//             </button>
//           </div>
//         </form>
//       </div>
//     </motion.div>
//   );
// };

// export default Registration;

import { useEffect, useId, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";
import {
  CheckIcon,
  Crown,
  EyeIcon,
  EyeOffIcon,
  Briefcase,
  Building2,
  MapPin,
  UploadCloudIcon,
  UserIcon,
  XIcon,
  ArrowRight,
  Command,
  Rocket,
  Hexagon,
  Layers,
  Loader,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import Prism from "@/components/Prism";
import LightRays from "@/components/LightRays";
import FloatingLines from "@/components/FloatingLines";

const Registration = () => {
  const [searchParams] = useSearchParams();
  const planValue = searchParams.get("plan");
  const paymentIdFromUrl = searchParams.get("payment_id");
  const billingFromUrl = searchParams.get("billing");

  const [isRegistering, setIsRegistering] = useState(false);
  const [isCountriesLoading, setIsCountriesLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [countries, setCountries] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formFields, setFormFields] = useState({
    username: "",
    email: "",
    contactNo: "",
    companyName: "",
    gstin: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    plan: planValue || "",
    websiteUrl: "",
  });

  const navigate = useNavigate();
  const { login } = useAuth();
  const id = useId();

  const toggleVisibility = () => setIsVisible((prev) => !prev);

  // --- Logic remains the same ---
  const checkStrength = (pass) => {
    const requirements = [
      { regex: /.{8,}/, text: "At least 8 characters" },
      { regex: /[0-9]/, text: "At least 1 number" },
      { regex: /[a-z]/, text: "At least 1 lowercase letter" },
      { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
    ];
    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }));
  };

  const strength = checkStrength(password);
  const strengthScore = useMemo(() => {
    return strength.filter((req) => req.met).length;
  }, [strength]);

  const getStrengthColor = (score) => {
    if (score === 0) return "bg-border";
    if (score <= 1) return "bg-red-500";
    if (score <= 2) return "bg-orange-500";
    if (score === 3) return "bg-amber-500";
    return "bg-emerald-500";
  };

  // ✅ Check if all required fields are filled (Excluding websiteUrl)
  const isFormValid =
    Object.entries(formFields).every(([key, val]) => {
      // Skip validation for the optional field
      if (key === "websiteUrl") return true;

      // Check all other fields
      return val && val.trim() !== "";
    }) &&
    password.trim() !== "" &&
    logoUrl.trim() !== ""; // Ensure Logo URL is also present

  const handleChange = (e) => {
    setFormFields((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsRegistering(true);
    const formData = new FormData();

    Object.keys(formFields).forEach((key) => {
      if (key === "contactNo") {
        formData.append(key, countryCode + formFields[key]);
      } else {
        formData.append(key, formFields[key]);
      }
    });

    formData.append("password", password);
    formData.append("logoUrl", logoUrl);

    if (paymentIdFromUrl) {
      formData.append("razorpayPaymentId", paymentIdFromUrl);
    }

    if (billingFromUrl) {
      formData.append("planType", billingFromUrl);
    } else {
      formData.append("planType", "monthly");
    }

    if (profileImage instanceof File) {
      formData.append("profileImage", profileImage);
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register-org`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      login(res.data.user);
      toast.success("Organization registered successfully! Welcome aboard.");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error registering organization:", error);
      toast.error(error?.response?.data?.message || "Registration failed");
    } finally {
      setIsRegistering(false);
    }
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        // We fetch only the fields we need: Name, Flags, and IDD (Phone Code)
        const response = await axios.get(
          "https://restcountries.com/v3.1/all?fields=name,flags,idd,cca2"
        );

        const countryData = response.data
          .filter((country) => country.idd.root) // Filter out countries with no phone code
          .map((country) => {
            // Logic to handle codes like +1 (USA) vs +1242 (Bahamas)
            const root = country.idd.root;
            const suffix =
              country.idd.suffixes && country.idd.suffixes.length === 1
                ? country.idd.suffixes[0]
                : "";

            return {
              name: country.name.common,
              code: root + suffix,
              flag: country.flags.svg, // We can use SVG in custom UI, or emoji for native select
              emoji: country.flags.alt ? country.flag : "🏳️", // Fallback for flag emoji
              cca2: country.cca2, // Two letter code (e.g. IN, US)
            };
          })
          .sort((a, b) => a.name.localeCompare(b.name)); // Sort Alphabetically

        setCountries(countryData);

        // Auto-select India (+91) if available, otherwise default to first
        const defaultCountry = countryData.find((c) => c.cca2 === "IN");
        if (defaultCountry) setCountryCode(defaultCountry.code);

        setIsCountriesLoading(false);
      } catch (error) {
        console.error("Failed to fetch countries", error);
        setIsCountriesLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-50 flex">
      {/* Left Panel - The "Empowering" Vision (Visible on LG screens) */}
      <div className="hidden lg:flex lg:w-5/12 bg-slate-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-85 pointer-events-none">
          {/* <svg width="100%" height="100%">
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg> */}

          <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <FloatingLines
              enabledWaves={["top", "middle", "bottom"]}
              // Array - specify line count per wave; Number - same count for all waves
              lineCount={[10, 15, 20]}
              // Array - specify line distance per wave; Number - same distance for all waves
              lineDistance={[8, 6, 4]}
              bendRadius={5.0}
              bendStrength={-0.5}
              interactive={true}
              parallax={true}
            />
          </div>

          {/* <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <Prism
              animationType="rotate"
              timeScale={0.4}
              height={3}
              baseWidth={3}
              scale={3}
              hueShift={0}
              colorFrequency={1}
              noise={0}
              glow={1}
            />
          </div> */}

          {/* <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <LightRays
              raysOrigin="top-center"
              raysColor="#00ffff"
              raysSpeed={1.5}
              lightSpread={0.8}
              rayLength={3}
              followMouse={true}
              mouseInfluence={0.1}
              noiseAmount={0.1}
              distortion={0.05}
              className="custom-rays"
            />
          </div> */}
        </div>

        <div className="z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Layers className="text-white w-6 h-6 fill-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              Task<span className="text-blue-500">ify</span>
            </span>
          </div>
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Captain your ship.
          </h2>
          <p className="text-slate-400 text-lg">
            Establish your organization's digital HQ. Manage teams, track
            workflows, and lead with clarity.
          </p>
        </div>

        <div className="z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex -space-x-3">
              {[
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64",
                "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=64&h=64",
                "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64",
              ].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`User ${i + 1}`}
                  className="w-10 h-10 rounded-full border-2 border-slate-900 object-cover"
                />
              ))}
            </div>
            <p className="text-sm font-medium">Joined by 10,000+ Leaders</p>
          </div>
        </div>
      </div>

      {/* Right Panel - The "Professional" Form */}
      <div className="w-full lg:w-7/12 h-screen overflow-y-auto scrollbar-hide flex justify-center">
        <div className="max-w-3xl mx-auto py-12 px-6 lg:px-12">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              Create Account
            </h1>
            <p className="text-slate-500 mt-2">
              Set up your organization in minutes.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Section 1: Identity */}
            <section>
              <div className="flex items-center gap-2 mb-6 border-b pb-2">
                <Briefcase className="w-5 h-5 text-yellow-500" />
                <h2 className="text-lg font-semibold text-slate-800">
                  Leader Profile
                </h2>
              </div>

              {/* Profile Pic Center Stage */}
              <div className="flex flex-col items-center mb-10">
                {/* CHANGE 1: Changed 'div' to 'label' here */}
                <label className="relative group cursor-pointer">
                  {/* The Circle */}
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white ring-4 ring-slate-50 shadow-xl bg-slate-50 flex items-center justify-center group-hover:ring-yellow-400 transition-all duration-300">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-12 h-12 text-slate-300 group-hover:text-slate-400 transition-colors" />
                    )}
                  </div>

                  {/* The Hover Overlay */}
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 rounded-full transition-all duration-300 flex items-center justify-center">
                    <div className="bg-slate-900 text-white p-2 rounded-full shadow-lg transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <UploadCloudIcon size={18} />
                    </div>
                  </div>

                  {/* The Input remains hidden inside the label */}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>{" "}
                {/* CHANGE 2: Closed with 'label' */}
                <p className="text-sm font-medium text-slate-400 mt-4 group-hover:text-yellow-600 transition-colors">
                  Click to upload avatar
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="username"
                    placeholder="John Doe"
                    value={formFields.username}
                    onChange={handleChange}
                    className="h-12 bg-slate-50 border-slate-200 focus:border-yellow-400 focus:ring-yellow-400/20 transition-all"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="john@company.com"
                    value={formFields.email}
                    onChange={handleChange}
                    className="h-12 bg-slate-50 border-slate-200 focus:border-yellow-400 focus:ring-yellow-400/20 transition-all"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Contact Number <span className="text-red-500">*</span>
                  </label>

                  <div className="flex gap-2">
                    {/* Country Code Selector */}
                    <div className="relative w-36 shrink-0">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        disabled={isCountriesLoading}
                        className="w-full h-12 pl-3 pr-8 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 appearance-none cursor-pointer truncate"
                      >
                        {isCountriesLoading ? (
                          <option>Loading...</option>
                        ) : (
                          countries.map((country) => (
                            <option key={country.cca2} value={country.code}>
                              {country.code} ({country.name})
                            </option>
                          ))
                        )}
                      </select>

                      {/* Chevron Icon */}
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-500">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          ></path>
                        </svg>
                      </div>
                    </div>

                    {/* Phone Number Input */}
                    <Input
                      name="contactNo" // This updates formFields.contactNo (Local part only)
                      type="number"
                      placeholder="98765 43210"
                      value={formFields.contactNo}
                      onChange={handleChange}
                      className="h-12 bg-slate-50 border-slate-200 focus:border-blue-600 focus:ring-blue-600/20 w-full"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Password Block */}
              <div className="mt-6 space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Secure Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    id={id}
                    className="pe-9 h-12 bg-slate-50 border-slate-200 focus:border-yellow-400 focus:ring-yellow-400/20 transition-all"
                    placeholder="Create a strong password"
                    type={isVisible ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={toggleVisibility}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600"
                  >
                    {isVisible ? (
                      <EyeOffIcon size={16} />
                    ) : (
                      <EyeIcon size={16} />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                <div className="flex gap-1 h-1 mt-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-full w-full rounded-full transition-all duration-300 ${
                        i < strengthScore
                          ? getStrengthColor(strengthScore)
                          : "bg-slate-200"
                      }`}
                    ></div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 mt-3">
                  {strength.map((req, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-1.5 text-xs ${
                        req.met ? "text-emerald-600" : "text-slate-400"
                      }`}
                    >
                      {req.met ? (
                        <CheckIcon size={12} strokeWidth={3} />
                      ) : (
                        <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                      )}
                      {req.text}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Section 2: The Empowering Admin Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex flex-col sm:flex-row items-start gap-4 shadow-sm">
              <div className="bg-blue-100 p-3 rounded-full shrink-0">
                <Crown className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  Admin Privileges
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  You are registering as the{" "}
                  <span className="font-bold text-blue-500 bg-blue-100 px-1.5 py-0.5 rounded text-xs tracking-wide uppercase">
                    Boss
                  </span>
                  . You will have exclusive control over organization settings,
                  team roles, and workflows.
                </p>
              </div>
            </div>

            {/* Section 3: Organization Details */}
            <section>
              <div className="flex items-center gap-2 mb-6 border-b pb-2">
                <Building2 className="w-5 h-5 text-yellow-500" />
                <h2 className="text-lg font-semibold text-slate-800">
                  Organization Details
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="companyName"
                    placeholder="Acme Corp"
                    value={formFields.companyName}
                    onChange={handleChange}
                    className="h-12 bg-slate-50 border-slate-200 focus:border-yellow-400 focus:ring-yellow-400/20 transition-all"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    GSTIN / Tax ID <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="gstin"
                    placeholder="GSTIN123456"
                    value={formFields.gstin}
                    onChange={handleChange}
                    className="h-12 bg-slate-50 border-slate-200 focus:border-yellow-400 focus:ring-yellow-400/20 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5 mb-6">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <MapPin size={14} /> Registered Address{" "}
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  name="address"
                  placeholder="Headquarters address"
                  value={formFields.address}
                  onChange={handleChange}
                  className="h-12 bg-slate-50 border-slate-200 focus:border-yellow-400 focus:ring-yellow-400/20 transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="space-y-1.5 col-span-2 md:col-span-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    City <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="city"
                    value={formFields.city}
                    onChange={handleChange}
                    className="h-12 bg-slate-50 border-slate-200 focus:border-yellow-400 focus:ring-yellow-400/20 transition-all"
                    required
                  />
                </div>
                <div className="space-y-1.5 col-span-2 md:col-span-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    State <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="state"
                    value={formFields.state}
                    onChange={handleChange}
                    className="h-12 bg-slate-50 border-slate-200 focus:border-yellow-400 focus:ring-yellow-400/20 transition-all"
                    required
                  />
                </div>
                <div className="space-y-1.5 col-span-2 md:col-span-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="pincode"
                    type="number"
                    value={formFields.pincode}
                    onChange={handleChange}
                    className="h-12 bg-slate-50 border-slate-200 focus:border-yellow-400 focus:ring-yellow-400/20 transition-all"
                    required
                  />
                </div>
                <div className="space-y-1.5 col-span-2 md:col-span-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Country
                  </label>
                  <Input
                    name="country"
                    value={formFields.country}
                    onChange={handleChange}
                    className="h-12 bg-slate-50 border-slate-200 focus:border-yellow-400 focus:ring-yellow-400/20 transition-all"
                  />
                </div>
              </div>

              {/* Logo & Website */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Website URL
                  </label>
                  <Input
                    name="websiteUrl"
                    placeholder="https://..."
                    value={formFields.websiteUrl}
                    onChange={handleChange}
                    className="h-12 bg-slate-50 border-slate-200 focus:border-yellow-400 focus:ring-yellow-400/20 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Company Logo (URL) <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-3">
                    <Input
                      name="logoUrl"
                      placeholder="Image URL"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      className="h-12 bg-slate-50 border-slate-200 focus:border-yellow-400 focus:ring-yellow-400/20 transition-all flex-1"
                    />
                    <div className="w-10 h-10 border rounded bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden">
                      <img
                        src={
                          logoUrl ||
                          "https://img.icons8.com/?size=100&id=114320&format=png&color=000000"
                        }
                        alt="Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Submit Action */}
            <div className="pt-4 pb-12">
              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                  isFormValid
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                {isRegistering ? (
                  <Loader size={20} className="animate-spin"/>
                ) : (
                  <>
                    Register Organization <ArrowRight size={20} />
                  </>
                )}
              </button>
              <p className="text-center text-xs text-slate-400 mt-4">
                By clicking Register, you agree to our Terms of Service and
                Privacy Policy.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;
