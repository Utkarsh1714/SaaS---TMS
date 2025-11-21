import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  BellIcon,
  SearchIcon,
  UserIcon,
  ArrowLeftIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  BriefcaseIcon,
  SaveIcon,
} from "lucide-react";
import Sidebar from "@/components/Layout/Sidebar";
import axios from "axios";
const EmpDetails = () => {
  const { id: employeeId } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [employeeData, setEmployeeData] = useState(null);

  const [isEditing, setIsEditing] = useState(false);

  const getEmployee = async (id) => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/employee/${id}`,
      { withCredentials: true }
    );
    setEmployeeData(res.data);
    console.log(res.data);
  };

  useEffect(() => {
    getEmployee(employeeId);
  }, [employeeId]);

  // Mock employee data
  const [employee, setEmployee] = useState({
    id: employeeId,
    name: "Jane Cooper",
    role: "Senior Developer",
    department: "Engineering",
    email: "jane.cooper@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    joinDate: "2022-03-15",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    bio: "Experienced software developer with a passion for creating elegant solutions to complex problems. Specialized in React and Node.js development.",
    skills: ["React", "TypeScript", "Node.js", "Python", "AWS"],
    stats: {
      tasksCompleted: 142,
      activeTasks: 8,
      projectsCompleted: 12,
      hoursLogged: 1240,
    },
    recentTasks: [
      {
        id: 1,
        title: "Update website homepage design",
        status: "in-progress",
        dueDate: "Today",
      },
      {
        id: 2,
        title: "Fix authentication bug",
        status: "completed",
        dueDate: "Yesterday",
      },
      {
        id: 3,
        title: "Code review for PR #234",
        status: "in-progress",
        dueDate: "Tomorrow",
      },
    ],
  });
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h7"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => navigate("/employees")}
                  className="ml-4 inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-1" />
                  Back to Employees
                </button>
              </div>
              <div className="flex items-center">
                <button className="flex-shrink-0 p-1 mr-4 text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" />
                </button>
                <div className="ml-3 relative">
                  <div>
                    <button className="flex items-center max-w-xs bg-gray-100 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <span className="sr-only">Open user menu</span>
                      <UserIcon className="h-8 w-8 rounded-full p-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Employee Header */}
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <img
                    src={employee.avatar}
                    alt={employee.name}
                    className="h-20 w-20 rounded-full"
                  />
                  <div className="ml-6">
                    <h1 className="text-2xl font-semibold text-gray-900">
                      {employee.name}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                      {employee.role} • {employee.department}
                    </p>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        {employee.location}
                      </div>
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        Joined {employee.joinDate}
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
              </div>
              {isEditing && (
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={employee.name}
                      onChange={(e) =>
                        setEmployee({
                          ...employee,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <input
                      type="text"
                      value={employee.role}
                      onChange={(e) =>
                        setEmployee({
                          ...employee,
                          role: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={employee.email}
                      onChange={(e) =>
                        setEmployee({
                          ...employee,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={employee.phone}
                      onChange={(e) =>
                        setEmployee({
                          ...employee,
                          phone: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      value={employee.bio}
                      onChange={(e) =>
                        setEmployee({
                          ...employee,
                          bio: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <SaveIcon className="h-4 w-4 mr-2" />
                      Save Changes
                    </button>
                  </div>
                </div>
              )}
            </div>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                      <svg
                        className="h-6 w-6 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Tasks Completed
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {employee.stats.tasksCompleted}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                      <svg
                        className="h-6 w-6 text-yellow-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Active Tasks
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {employee.stats.activeTasks}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                      <BriefcaseIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Projects Completed
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {employee.stats.projectsCompleted}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                      <svg
                        className="h-6 w-6 text-purple-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Hours Logged
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {employee.stats.hoursLogged}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Contact Info */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Contact Information
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <MailIcon className="h-5 w-5 mr-3 text-gray-400" />
                    <span className="text-gray-700">{employee.email}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <PhoneIcon className="h-5 w-5 mr-3 text-gray-400" />
                    <span className="text-gray-700">{employee.phone}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPinIcon className="h-5 w-5 mr-3 text-gray-400" />
                    <span className="text-gray-700">{employee.location}</span>
                  </div>
                </div>
                <div className="mt-6 space-y-2">
                  <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                    Send Message
                  </button>
                  <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Schedule Meeting
                  </button>
                </div>
              </div>
              {/* About & Skills */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    About
                  </h2>
                  <p className="text-sm text-gray-700">{employee.bio}</p>
                </div>
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {employee.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Recent Tasks */}
            <div className="mt-6 bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Recent Tasks
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {employee.recentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="px-6 py-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/tasks/${task.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {task.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Due: {task.dueDate}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          task.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {task.status === "completed"
                          ? "Completed"
                          : "In Progress"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
export default EmpDetails;
