import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useAsyncError } from "react-router-dom";
import {
  BellIcon,
  SearchIcon,
  UserIcon,
  ArrowLeftIcon,
  BuildingIcon,
  UsersIcon,
  PlusIcon,
  XIcon,
  SaveIcon,
  MailIcon,
  PhoneIcon,
  Loader,
} from "lucide-react";
import Sidebar from "@/components/Layout/Sidebar";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import AddTeamMemberModal from "@/components/Departments/AddTeamMemberModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";

const DepartmentDetails = () => {
  const { user } = useAuth();
  const { id: departmentId } = useParams();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deptDetails, setDeptDetails] = useState(null);
  const [deptName, setDeptName] = useState("");
  const [description, setDescription] = useState("");
  const [teamName, setTeamName] = useState("");
  const [allEmployees, setAllEmployees] = useState([]);

  const [loadingDeptDetail, setLoadingDeptDetail] = useState(false);
  const [open, setOpen] = useState(false);
  const [creatingTeam, setCreatingTeam] = useState(false);
  const [deletingTeam, setDeletingTeam] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

  const formatter = new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  });

  const fetchDepartmentDetails = async (id) => {
    setLoadingDeptDetail(true);
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/dept-details/${id}/deptdetails-page`,
        { withCredentials: true }
      );
      setDeptDetails(res.data);
      setDeptName(res.data.department.name);
      setDescription(res.data.department.description);
      setAllEmployees(res.data.allEmpOfDept);
      setLoadingDeptDetail(false);
    } catch (error) {
      setLoadingDeptDetail(false);
      console.error("Error fetching department details:", error);
    } finally {
      setLoadingDeptDetail(false);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setCreatingTeam(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/team`,
        { name: teamName, departmentId: departmentId },
        {
          withCredentials: true,
        }
      );
      toast.success("Team created successfully");
      setOpen(false);
      setTeamName("")
    } catch (error) {
      console.log(error);
      toast.error("Error creating team");
    } finally {
      setCreatingTeam(false);
      fetchDepartmentDetails(departmentId);
    }
  };

  const handleTeamDelete = async (teamId) => {
    setDeletingTeam(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/team/${teamId}/delete`,
        { withCredentials: true }
      );
      toast.success("Team deleted successfully");
    } catch (error) {
      console.error("Error deleting team:", error);
    } finally {
      setDeletingTeam(false);
      fetchDepartmentDetails(departmentId);
    }
  };

  useEffect(() => {
    if (departmentId) {
      setDeptDetails(null);
      fetchDepartmentDetails(departmentId);
    }
  }, [departmentId]);

  // Mock department data
  const [department, setDepartment] = useState({
    id: departmentId,
    name: "Engineering",
    description:
      "Software development and technical infrastructure team responsible for building and maintaining our products.",
    manager: {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      phone: "+1 (555) 123-4567",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    employees: [
      {
        id: 1,
        name: "Jane Cooper",
        role: "Senior Developer",
        email: "jane.cooper@example.com",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      {
        id: 2,
        name: "Cody Fisher",
        role: "Frontend Developer",
        email: "cody.fisher@example.com",
        avatar:
          "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      {
        id: 3,
        name: "Robert Wilson",
        role: "Backend Developer",
        email: "robert.wilson@example.com",
        avatar:
          "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
    ],
    teams: [
      {
        id: 1,
        name: "Frontend Team",
        members: 8,
      },
      {
        id: 2,
        name: "Backend Team",
        members: 12,
      },
      {
        id: 3,
        name: "DevOps Team",
        members: 6,
      },
    ],
    stats: {
      totalEmployees: 42,
      activeTasks: 28,
      completedProjects: 15,
      budget: "$450,000",
    },
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
                  onClick={() => navigate("/departments")}
                  className="ml-4 inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-1" />
                  Back to Departments
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
            {/* Department Header */}
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                {loadingDeptDetail ? (
                  <div className="flex items-center">
                    <Skeleton className={"h-8 w-8 rounded-lg"} />
                    <div className="ml-4 space-y-2">
                      <Skeleton className={"h-4 w-[300px]"} />
                      <Skeleton className={"h-4 w-[300px]"} />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-lg p-3">
                      <BuildingIcon className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h1 className="text-2xl font-semibold text-gray-900">
                        {deptName}
                      </h1>
                      <p className="text-sm text-gray-500 mt-1">
                        {deptDetails?.totalEmp} employees
                      </p>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  {isEditing ? "Cancel" : "Edit"}
                </button>
              </div>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department Name
                    </label>
                    <input
                      type="text"
                      value={deptName}
                      onChange={(e) => setDeptName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <SaveIcon className="h-4 w-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              ) : loadingDeptDetail ? (
                <div className="space-y-4">
                  <Skeleton className={"h-4 w-[350px]"} />
                  <Skeleton className={"h-4 w-[200px]"} />
                </div>
              ) : (
                <p className="text-gray-700">{description}</p>
              )}
            </div>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  {loadingDeptDetail ? (
                    <div className="flex items-center">
                      <Skeleton className={"h-8 w-8 rounded-lg"} />
                      <div className="ml-4 space-y-2">
                        <Skeleton className={"h-4 w-[300px]"} />
                        <Skeleton className={"h-4 w-[300px]"} />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                        <UsersIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Total Employees
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {deptDetails?.totalEmp}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  {loadingDeptDetail ? (
                    <div className="flex items-center">
                      <Skeleton className={"h-8 w-8 rounded-lg"} />
                      <div className="ml-4 space-y-2">
                        <Skeleton className={"h-4 w-[300px]"} />
                        <Skeleton className={"h-4 w-[300px]"} />
                      </div>
                    </div>
                  ) : (
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
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Active Tasks
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {deptDetails?.activeTask}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  {loadingDeptDetail ? (
                    <div className="flex items-center">
                      <Skeleton className={"h-8 w-8 rounded-lg"} />
                      <div className="ml-4 space-y-2">
                        <Skeleton className={"h-4 w-[300px]"} />
                        <Skeleton className={"h-4 w-[300px]"} />
                      </div>
                    </div>
                  ) : (
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
                            Completed Projects
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {deptDetails?.completedTask}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  {loadingDeptDetail ? (
                    <div className="flex items-center">
                      <Skeleton className={"h-8 w-8 rounded-lg"} />
                      <div className="ml-4 space-y-2">
                        <Skeleton className={"h-4 w-[300px]"} />
                        <Skeleton className={"h-4 w-[300px]"} />
                      </div>
                    </div>
                  ) : (
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
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Annual Budget
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            ₹ {formatter.format(deptDetails?.department.budget)}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Manager Info */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Department Manager
                </h2>
                {loadingDeptDetail ? (
                  <div className="flex items-center">
                    <Skeleton className={"h-8 w-8 rounded-lg"} />
                    <div className="ml-4 space-y-2">
                      <Skeleton className={"h-4 w-[300px]"} />
                      <Skeleton className={"h-4 w-[300px]"} />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center mb-4">
                    <img
                      src={department.manager.avatar}
                      alt={deptDetails?.department.manager.username}
                      className="h-16 w-16 rounded-full"
                    />
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">
                        {deptDetails?.department.manager.username}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {deptDetails?.department.manager.jobTitle}
                      </p>
                    </div>
                  </div>
                )}
                <div className="space-y-3">
                  {loadingDeptDetail ? (
                    <Skeleton className={"h-4 w-4 rounded-md"} />
                  ) : (
                    <div className="flex items-center text-sm text-gray-600">
                      <MailIcon className="h-4 w-4 mr-2 text-gray-400" />
                      {deptDetails?.department.manager.email}
                    </div>
                  )}
                  {loadingDeptDetail ? (
                    <Skeleton className={"h-4 w-4 rounded-md"} />
                  ) : (
                    <div className="flex items-center text-sm text-gray-600">
                      <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                      {deptDetails?.department.manager.contactNo}
                    </div>
                  )}
                </div>
                <button className="mt-4 w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Change Manager
                </button>
              </div>
              {/* Teams */}
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Teams</h2>

                  {(user.role?.name === "Boss" || user.role?.name === "Manager") && (
                    <Dialog open={open} onOpenChange={setOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant={"secondary"}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <PlusIcon className="h-5 w-5" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Create New Team</DialogTitle>
                          <DialogDescription>
                            Fill in the details to add a new team.
                          </DialogDescription>
                        </DialogHeader>
                        <form className="space-y-4" onSubmit={handleCreateTeam}>
                          <input
                            type="text"
                            name="name"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            placeholder="Name"
                            className="w-full border px-3 py-2 rounded-md"
                          />
                          <Button type="submit" className="w-full">
                            {creatingTeam ? "Creating..." : "Create Department"}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
                <div className="space-y-3">
                  {deptDetails?.department.teams.map((team) => (
                    <div
                      key={team._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {team.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {team.members.length} members
                        </p>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger>
                          <Button
                            variant={"ghost"}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <XIcon className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete the team and remove all its
                              members from the team.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleTeamDelete(team._id)}
                            >
                              {deletingTeam ? "Deleting..." : "Continue"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ))}
                </div>
              </div>
              {/* Quick Actions */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Quick Actions
                </h2>
                <div className="space-y-3">
                  <button
                    onClick={() => setIsAddMemberModalOpen(true)}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Employee To Team
                  </button>
                  <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Schedule Meeting
                  </button>
                  <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Generate Report
                  </button>
                </div>
              </div>
            </div>
            {/* Employees List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="mt-6 bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium text-gray-900">
                      Employees
                    </h2>
                    <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Add Employee
                    </button>
                  </div>
                </div>
                <div className="divide-y divide-gray-200">
                  {allEmployees.map((employee) => (
                    <div
                      key={employee._id}
                      className="px-6 py-4 hover:bg-gray-100 cursor-pointer"
                      onClick={() => navigate(`/employees/${employee.id}`)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {/* <img
                          src={employee.avatar}
                          alt={employee.name}
                          className="h-10 w-10 rounded-full"
                        /> */}
                          <span
                            className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#DBEAFE] text-blue-600 font-semibold text-lg`}
                          >
                            {employee.username.charAt(0)}
                          </span>
                          <div className="ml-4">
                            <h3 className="flex items-center justify-center gap-1 text-sm font-medium text-gray-900">
                              {employee.username}
                              <span className="text-sm text-gray-500">
                                ({employee.jobTitle})
                              </span>
                            </h3>
                            <p className="text-sm text-gray-500">
                              {employee.email}
                            </p>
                            {/* <span className="text-sm text-gray-500">
                            {employee.email}
                          </span> */}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <button className="text-gray-400 hover:text-red-600">
                            <XIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium text-gray-900">
                      Department Tasks
                    </h2>
                    <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Create Task
                    </button>
                  </div>
                </div>
                <div className="divide-y divide-gray-200">
                  {allEmployees.map((employee) => (
                    <div
                      key={employee._id}
                      className="px-6 py-4 hover:bg-gray-100 cursor-pointer"
                      onClick={() => navigate(`/employees/${employee.id}`)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-900">
                              Task title
                            </h3>
                            <p className="text-sm text-gray-500">
                              Task description
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-500">
                            Task status
                          </span>
                          <button className="text-gray-400 hover:text-red-600">
                            <XIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      {isAddMemberModalOpen && (
        <AddTeamMemberModal
          onClose={() => setIsAddMemberModalOpen(false)}
          teams={deptDetails?.department.teams || []}
          employees={allEmployees}
        />
      )}
    </div>
  );
};

export default DepartmentDetails;
