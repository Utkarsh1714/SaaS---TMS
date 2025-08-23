import { useId, useMemo, useState } from "react";
import DepartmentSelect from "../components/DepartmentSelect";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";
import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

const Registration = () => {
  const [departments, setDepartments] = useState([]);
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
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
  });

  const Navigate = useNavigate();
  const { login } = useAuth();
  const id = useId();

  const toggleVisibility = () => setIsVisible((prev) => !prev);

  // Password strength check logic
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

  const getStrengthText = (score) => {
    if (score === 0) return "Enter a password";
    if (score <= 2) return "Weak password";
    if (score === 3) return "Medium password";
    return "Strong password";
  };

  // ✅ Check if all required fields are filled
  const isFormValid =
    Object.values(formFields).every((val) => val.trim() !== "") &&
    password.trim() !== "" &&
    departments.length > 0;

  const handleChange = (e) => {
    setFormFields((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const formValues = {
      ...formFields,
      password,
      logoUrl,
      websiteUrl: formData.get("websiteUrl"),
      departments: departments.map((dept) => dept.value),
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register-org`,
        formValues,
        { withCredentials: true }
      );

      login(res.data.user);
      toast.success("Organization registered successfully! Please start creating & managing your employees, tasks, departments, meetings, and more.");

      Navigate("/");
    } catch (error) {
      console.error("Error registering organization:", error);
      toast.error(error?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="w-full h-screen py-4 px-8">
      <div className="text-center py-4">
        <h1 className="Headline2 text-2xl md:text-3xl lg:text-5xl font-semibold">
          Register Your Organization
        </h1>
      </div>
      <div className="w-full py-4 md:px-24 text-center text-lg text-slate-600">
        <h4>
          Start your journey with a powerful task management system built for
          teams. Just a few steps to set up your organization and take control
          of your workflows.
        </h4>
      </div>
      <div className="w-full flex flex-col items-center justify-center py-6">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="w-full">
            <h1 className="text-2xl">Personal details</h1>
            <div className="w-full flex flex-col sm:flex-row items-center justify-center sm:gap-8">
              <label className="block text-left mt-4 w-full">
                <span className="text-gray-700">Your Full Name<span className="text-red-500 pl-1">*</span></span>
                <input
                  name="username"
                  type="text"
                  value={formFields.username}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </label>
              <label className="block text-left mt-4 w-full">
                <span className="text-gray-700">Email Address<span className="text-red-500 pl-1">*</span></span>
                <input
                  name="email"
                  type="email"
                  value={formFields.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </label>
            </div>
            <div className="w-full flex flex-col sm:flex-row items-start justify-center sm:gap-8">
              <label className="block text-left mt-4 w-full">
                <span className="text-gray-700">Contact Number<span className="text-red-500 pl-1">*</span></span>
                <input
                  name="contactNo"
                  type="number"
                  value={formFields.contactNo}
                  onChange={handleChange}
                  placeholder="Ex. +91 1234567890"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </label>
              <label className="block text-left mt-4 w-full">
                <span className="text-gray-700">Set Password<span className="text-red-500 pl-1">*</span></span>
                <div className="relative mt-2">
                  <Input
                    id={id}
                    className="pe-9"
                    placeholder="Password"
                    type={isVisible ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center"
                    type="button"
                    onClick={toggleVisibility}
                    aria-label={isVisible ? "Hide password" : "Show password"}
                  >
                    {isVisible ? (
                      <EyeOffIcon size={16} />
                    ) : (
                      <EyeIcon size={16} />
                    )}
                  </button>
                </div>

                {/* Strength Bar */}
                <div className="bg-border mt-3 mb-2 h-1 w-full overflow-hidden rounded-full">
                  <div
                    className={`h-full ${getStrengthColor(
                      strengthScore
                    )} transition-all duration-500`}
                    style={{ width: `${(strengthScore / 4) * 100}%` }}
                  ></div>
                </div>

                {/* Strength Text */}
                <p className="text-sm mb-2">
                  {getStrengthText(strengthScore)}. Must contain:
                </p>

                {/* Requirements */}
                <ul className="space-y-1.5">
                  {strength.map((req, index) => (
                    <li key={index} className="flex items-center gap-2">
                      {req.met ? (
                        <CheckIcon size={16} className="text-emerald-500" />
                      ) : (
                        <XIcon size={16} className="text-gray-400" />
                      )}
                      <span
                        className={`text-xs ${
                          req.met ? "text-emerald-600" : "text-gray-500"
                        }`}
                      >
                        {req.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </label>
            </div>
          </div>
          <div className="text-center py-8">
            <strong className="text-red-500 lg:text-2xl">Caution</strong>
            <p className="lg:text-xl">
              "You'll become the <strong>Boss</strong> of this organization and
              manage your departments and team members from the dashboard."
            </p>
          </div>
          <h1 className="text-2xl">Organization Details</h1>
          <div className="w-full flex items-center justify-center gap-8">
            <label className="block text-left mt-4 w-full">
              <span className="text-gray-700">Company Name<span className="text-red-500 pl-1">*</span></span>
              <input
                name="companyName"
                type="text"
                value={formFields.companyName}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </label>
            <label className="block text-left mt-4 w-full">
              <span className="text-gray-700">GSTIN Number<span className="text-red-500 pl-1">*</span></span>
              <input
                name="gstin"
                type="text"
                value={formFields.gstin}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </label>
          </div>
          <div className="w-full flex items-center justify-center gap-8">
            <label className="block text-left mt-4 w-full">
              <span className="text-gray-700">Address<span className="text-red-500 pl-1">*</span></span>
              <input
                name="address"
                type="text"
                value={formFields.address}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </label>
            <label className="block text-left mt-4 w-full">
              <span className="text-gray-700">City<span className="text-red-500 pl-1">*</span></span>
              <input
                name="city"
                type="text"
                value={formFields.city}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </label>
          </div>
          <div className="w-full flex items-center justify-center gap-8">
            <label className="block text-left mt-4 w-full">
              <span className="text-gray-700">State<span className="text-red-500 pl-1">*</span></span>
              <input
                name="state"
                type="text"
                value={formFields.state}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </label>
            <label className="block text-left mt-4 w-full">
              <span className="text-gray-700">Pincode<span className="text-red-500 pl-1">*</span></span>
              <input
                name="pincode"
                type="number"
                value={formFields.pincode}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </label>
          </div>
          <div className="w-full flex items-center justify-center gap-8">
            <label className="block text-left mt-4 w-full">
              <span className="text-gray-700">Country<span className="text-red-500 pl-1">*</span></span>
              <input
                name="country"
                type="text"
                value={formFields.country}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </label>
            <label className="block text-left mt-4 w-full">
              <span className="text-gray-700">Webstie URL (Optional)</span>
              <input
                name="websiteUrl"
                type="text"
                value={formFields.websiteUrl}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </label>
          </div>
          <div className="w-full flex items-center justify-center gap-8">
            <label className="block text-left mt-4 w-full">
              <span className="text-gray-700">
                Upload Company Logo (URL)<span className="text-red-500 pl-1">*</span>
              </span>
              <input
                name="logoUrl"
                type="text"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </label>
            <div className="flex items-center justify-center mt-5">
              <img
                src={
                  logoUrl ||
                  "https://img.icons8.com/?size=100&id=114320&format=png&color=000000"
                }
                alt="Logo Preview"
                className="w-[200px] h-[200px] object-contain border rounded"
              />
            </div>
          </div>
          <div className="w-full flex items-center justify-center gap-8">
            <DepartmentSelect
              selectedDepartments={departments}
              setSelectedDepartments={setDepartments}
              isMulti={true}
            />
          </div>
          <div className="w-full flex justify-center mt-8">
            <button
              type="submit"
              //disabled={!isFormValid}
              className={`px-6 py-2 font-semibold rounded-md ${
                isFormValid
                  ? "bg-yellow-400 text-white hover:bg-yellow-500"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;
