import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import socket from "@/utils/socket"; // Make sure this is same as used in Employees.jsx
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { IoIosArrowBack } from "react-icons/io";

const EmpDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [employee, setEmployee] = useState(null);

  const navigate = useNavigate();

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
        return "text-red-500";
      case "Inactive":
        return "text-gray-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="w-full h-full px-5 py-2">
      <div className="w-full">
        <Button
          variant={"outline"}
          onClick={() => navigate(-1)}
          className="bg-slate-200 cursor-pointer"
        >
          <IoIosArrowBack className="mr-1" /> Back
        </Button>
        <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between pt-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-orange-400">
              {employee?.username}
            </h1>
            <div className="mt-2">
              <h2 className="font-semibold">
                Department :-{" "}
                <span className="font-normal">
                  {employee?.departmentId?.name}
                </span>
              </h2>
              <h2 className="font-semibold">
                Role :- <span className="font-normal">{employee?.role}</span>
              </h2>
            </div>
          </div>
          <div className="md:mt-12">
            <p className="font-semibold">
              Email :- <span className="font-normal">{employee?.email}</span>
            </p>
            <p className="font-semibold">
              Phone :-{" "}
              <span className="font-normal">+91 {employee?.contactNo}</span>
            </p>
          </div>
        </div>
        <div className="flex items-start justify-start gap-2">
          <h3 className="font-semibold">Status :-</h3>
          <span className={`font-medium ${getStatusColor(employee?.status)}`}>
            {employee?.status}
          </span>
        </div>
        <p className="text-sm font-semibold">
          Created At :- <span className="font-normal">{formattedDate}</span>
        </p>
      </div>
      <div className="w-full flex items-center justify-center">
        TODO: Show assigned and completed task
        {employee?.role === "Boss" ? (
          <div className=" absolute right-0 bottom-0 mb-10 mr-10">
            <Button className={"cursor-pointer bg-orange-400"}>
              Promote {employee?.username}
            </Button>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default EmpDetails;
