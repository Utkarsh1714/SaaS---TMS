// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// const EmpDetails = () => {
//   const { id } = useParams();
//   const [employee, setEmployee] = useState(null);

//   const getEmployeeDetails = async () => {
//     const res = await axios.get(
//       `${import.meta.env.VITE_API_URL}/api/employee/${id}`,
//       { withCredentials: true }
//     );

//     console.log(res.data);
//     setEmployee(res.data);
//   };

//   useEffect(() => {
//     getEmployeeDetails();
//   }, []);
//   return (
//     <div className="w-full h-full px-5 py-6">
//       <h1 className="font-normal text-xl">{employee?.username}</h1>
//       <p className="text-gray-500">{employee?.email}</p>
//       <h3>Status :- </h3>
//     </div>
//   );
// };

// export default EmpDetails;

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "@/utils/socket"; // Make sure this is same as used in Employees.jsx
import { useAuth } from "@/context/AuthContext";

const EmpDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [employee, setEmployee] = useState(null);

  const isoString = employee?.createdAt;
  const date = new Date(isoString);

  const options = {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "long",
    year: "numeric",
  };

  const formattedDate = date.toLocaleDateString("en-IN", options);

  const getEmployeeDetails = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/employee/${id}`,
      { withCredentials: true }
    );

    setEmployee(res.data);
    console.log(res.data);
  };

  useEffect(() => {
    getEmployeeDetails();
  }, [id]);

  useEffect(() => {
    if (!user?.organizationId) return;

    const handleConnect = () => {
      socket.emit("joinOrgRoom", user.organizationId);
    };

    const handleStatusUpdate = ({ userId, status }) => {
      // Only update status if it's the same employee being viewed
      if (userId === id) {
        setEmployee((prev) => ({ ...prev, status }));
      }
    };

    socket.on("connect", handleConnect);
    socket.on("statusUpdate", handleStatusUpdate);

    if (socket.connected) handleConnect();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("statusUpdate", handleStatusUpdate);
    };
  }, [id, user?.organizationId]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "text-green-600";
      case "On Leave":
        return "text-yellow-500";
      case "Inactive":
        return "text-red-500";
      case "Offline":
        return "text-gray-400";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="w-full h-full px-5 py-6">
      {employee !== "null" ? (
        <div className="w-full">
          <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="font-normal text-3xl text-gray-600">{employee?.username}</h1>
              <div className="mt-2 leading-1">
                <h2 className="font-normal text-lg">
                  {employee?.departmentId?.name} Department
                </h2>
                <h2 className="font-normal text-lg">
                  {employee?.role}
                </h2>
              </div>
            </div>
            <div>
              <p className="md:text-gray-500">{employee?.email}</p>
              <p className="md:text-gray-500">
                Phone :- +91{employee?.contactNo}
              </p>
            </div>
          </div>
          <div className="mt-2 flex items-start justify-start gap-2">
            <h3 className="font-semibold">Status :-</h3>
            <span className={`font-medium ${getStatusColor(employee?.status)}`}>
              {employee?.status}
            </span>
          </div>
          <p className="text-sm mt-2">Created At :- {formattedDate}</p>
        </div>
      ) : (
        "Failed to get employee details"
      )}
    </div>
  );
};

export default EmpDetails;
