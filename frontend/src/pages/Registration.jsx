import { useState } from "react";
import DepartmentSelect from "../components/DepartmentSelect";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

const Registration = () => {
  const [departments, setDepartments] = useState([]);
  const Navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const formValues = {
      username: formData.get("name"),
      email: formData.get("email"),
      contactNo: formData.get("contactNumber"),
      password: formData.get("password"),
      companyName: formData.get("companyName"),
      gstin: formData.get("gstin"),
      address: formData.get("address"),
      city: formData.get("city"),
      state: formData.get("state"),
      pincode: formData.get("pincode"),
      country: formData.get("country"),
      logoUrl: formData.get("logoUrl"),
      websiteUrl: formData.get("websiteUrl"),
      departments: departments.map((dept) => dept.value),
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register-org`,
        formValues,
        { withCredentials: true }
      );

      login(res.data.user)

      Navigate('/')
    } catch (error) {
      console.error("Error registering organization:", error);
      toast(error?.response?.data?.message || "Registration failed");
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
            <div className="w-full flex items-center justify-center gap-8">
              <label className="block text-left mt-4 w-full">
                <span className="text-gray-700">Your Name</span>
                <input
                  name="name"
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </label>
              <label className="block text-left mt-4 w-full">
                <span className="text-gray-700">Email Address</span>
                <input
                  name="email"
                  type="email"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </label>
            </div>
            <div className="w-full flex items-center justify-center gap-8">
              <label className="block text-left mt-4 w-full">
                <span className="text-gray-700">Contact Number</span>
                <input
                  name="contactNumber"
                  type="number"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </label>
              <label className="block text-left mt-4 w-full">
                <span className="text-gray-700">Set Password</span>
                <input
                  name="password"
                  type="password"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
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
              <span className="text-gray-700">Company Name</span>
              <input
                name="companyName"
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </label>
            <label className="block text-left mt-4 w-full">
              <span className="text-gray-700">GSTIN Number</span>
              <input
                name="gstin"
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </label>
          </div>
          <div className="w-full flex items-center justify-center gap-8">
            <label className="block text-left mt-4 w-full">
              <span className="text-gray-700">Address</span>
              <input
                name="address"
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </label>
            <label className="block text-left mt-4 w-full">
              <span className="text-gray-700">City</span>
              <input
                name="city"
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </label>
          </div>
          <div className="w-full flex items-center justify-center gap-8">
            <label className="block text-left mt-4 w-full">
              <span className="text-gray-700">State</span>
              <input
                name="state"
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </label>
            <label className="block text-left mt-4 w-full">
              <span className="text-gray-700">Pincode</span>
              <input
                name="pincode"
                type="number"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </label>
          </div>
          <div className="w-full flex items-center justify-center gap-8">
            <label className="block text-left mt-4 w-full">
              <span className="text-gray-700">Country</span>
              <input
                name="country"
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </label>
            <label className="block text-left mt-4 w-full">
              <span className="text-gray-700">Webstie URL (Optional)</span>
              <input
                name="websiteUrl"
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </label>
          </div>
          <div className="w-full flex items-center justify-center gap-8">
            <label className="block text-left mt-4 w-full">
              <span className="text-gray-700">Upload Company Logo (URL)</span>
              <input
                name="logoUrl"
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </label>
            <div className="flex items-center justify-center bg-red-400 mt-5">
              <img src="" alt="Logo Preview" className="w-[200px] h-[200px]" />
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
              className="px-6 py-2 bg-yellow-400 text-white font-semibold rounded-md hover:bg-yellow-500"
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
