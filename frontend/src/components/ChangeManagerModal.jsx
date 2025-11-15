import axios from "axios";
import { Loader, PlusIcon, XIcon } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

const ChangeManagerModal = ({
  onClose,
  employees,
  departmentId,
  onChanged
}) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmployeeId) {
      setError("Please select an employee");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/department/manager/change`,
        {
          departmentId,
          newManagerId: selectedEmployeeId,
        },
        { withCredentials: true }
      );
      toast.success("Manager changed successfully");
      setSuccess("Manager changed successfully");
      if (typeof onChanged === "function") onChanged();
      onClose();
    } catch (error) {
      console.log(error);
      toast.error("Error changing manager");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.30)] backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">
            Change Department Manager
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200">
                <p className="text-sm font-medium text-red-700">{error}</p>
              </div>
            )}
            {/* Success Message */}
            {success && (
              <div className="p-3 rounded-md bg-green-50 border border-green-200">
                <p className="text-sm font-medium text-green-700">{success}</p>
              </div>
            )}

            {/* Employee Selection List */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select New Manager
              </label>
              <ul className="max-h-60 overflow-y-auto border border-gray-300 rounded-md divide-y divide-gray-200">
                {employees?.length === 0 ? (
                  <li className="p-3 text-sm text-gray-500">
                    No employees found in this department.
                  </li>
                ) : (
                  employees?.map((emp) => (
                    <li key={emp._id}>
                      <label
                        htmlFor={emp._id}
                        className="flex items-center p-3 cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="radio"
                          name="newManager"
                          value={emp._id}
                          checked={selectedEmployeeId === emp._id}
                          onChange={() => setSelectedEmployeeId(emp._id)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="ml-3">
                          <span className="text-sm font-medium text-gray-900">
                            {emp.username}
                          </span>
                          <span className="text-sm text-gray-500 ml-2">
                            ({emp.jobTitle})
                          </span>
                        </div>
                      </label>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
            <button
              type="submit"
              disabled={isLoading || !selectedEmployeeId}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader className="animate-spin h-5 w-5 mr-2" />
              ) : (
                <PlusIcon className="h-5 w-5 mr-2" />
              )}
              {isLoading ? "Changing..." : `Change Manager`}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangeManagerModal;
