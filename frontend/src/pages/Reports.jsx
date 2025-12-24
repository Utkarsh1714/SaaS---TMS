import React, { useState } from 'react'
import {
  BellIcon,
  SearchIcon,
  UserIcon,
  DownloadIcon,
  CalendarIcon,
  FilterIcon,
  BellDot,
  User,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import Sidebar from '@/components/Layout/Sidebar'
import { useNotifications } from '@/context/NotificationContext'
import NotificationPanel from '@/components/Dashboard/NotificationPanel'
import ProfileImage from '@/components/ui/ProfileImage'
import { useAuth } from '@/context/AuthContext'
const Reports = () => {
  const { user } = useAuth();

  const { toggleNotificationPanel, notifications } = useNotifications();

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const taskCompletionData = [
    {
      name: 'Jan',
      completed: 45,
      pending: 23,
      overdue: 8,
    },
    {
      name: 'Feb',
      completed: 52,
      pending: 19,
      overdue: 6,
    },
    {
      name: 'Mar',
      completed: 48,
      pending: 25,
      overdue: 10,
    },
    {
      name: 'Apr',
      completed: 61,
      pending: 18,
      overdue: 5,
    },
    {
      name: 'May',
      completed: 55,
      pending: 22,
      overdue: 7,
    },
    {
      name: 'Jun',
      completed: 67,
      pending: 15,
      overdue: 4,
    },
  ]
  const employeePerformanceData = [
    {
      name: 'Engineering',
      performance: 92,
    },
    {
      name: 'Marketing',
      performance: 88,
    },
    {
      name: 'Sales',
      performance: 95,
    },
    {
      name: 'HR',
      performance: 85,
    },
    {
      name: 'Finance',
      performance: 90,
    },
    {
      name: 'Design',
      performance: 93,
    },
  ]
  const departmentDistribution = [
    {
      name: 'Engineering',
      value: 42,
      color: '#4F46E5',
    },
    {
      name: 'Marketing',
      value: 21,
      color: '#10B981',
    },
    {
      name: 'Sales',
      value: 25,
      color: '#F59E0B',
    },
    {
      name: 'HR',
      value: 12,
      color: '#EC4899',
    },
    {
      name: 'Finance',
      value: 16,
      color: '#6366F1',
    },
    {
      name: 'Design',
      value: 12,
      color: '#8B5CF6',
    },
  ]
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex">
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
                <div className="ml-4 flex items-center lg:ml-0">
                  <div className="relative w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <SearchIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Search reports..."
                      type="search"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={toggleNotificationPanel}
                  className="shrink-0 p-1 text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <span className="sr-only">View notifications</span>
                  {notifications && notifications.length > 0 ? (
                    <BellDot className="text-green-500" />
                  ) : (
                    <BellIcon className="text-gray-400" />
                  )}
                </button>
                <div className="ml-3 relative">
                  <div>
                    <button className="h-10 w-10 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 p-0.5 shadow-md hover:shadow-lg transition-shadow">
                <div className="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                  {user.profileImage ? (
                    <ProfileImage src={user.profileImage}/>
                  ) : (
                    <User className="text-blue-600" size={20} />
                  )}
                </div>
              </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              Reports & Analytics
            </h1>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                >
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="quarter">Last Quarter</option>
                  <option value="year">Last Year</option>
                </select>
              </div>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <FilterIcon className="h-4 w-4 mr-2" />
                Filter
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                <DownloadIcon className="h-4 w-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="shrink-0 bg-blue-100 rounded-md p-3">
                    <svg
                      className="h-6 w-6 text-blue-600"
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
                      <dd className="text-lg font-medium text-gray-900">348</dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <span className="font-medium text-green-600">+12%</span>
                  <span className="text-gray-500 ml-2">from last period</span>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="shrink-0 bg-green-100 rounded-md p-3">
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
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Active Employees
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">128</dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <span className="font-medium text-green-600">+8%</span>
                  <span className="text-gray-500 ml-2">from last period</span>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="shrink-0 bg-yellow-100 rounded-md p-3">
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Meetings Held
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">87</dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <span className="font-medium text-green-600">+5%</span>
                  <span className="text-gray-500 ml-2">from last period</span>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="shrink-0 bg-purple-100 rounded-md p-3">
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
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Departments
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">6</dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <span className="font-medium text-gray-600">No change</span>
                  <span className="text-gray-500 ml-2">from last period</span>
                </div>
              </div>
            </div>
          </div>
          {/* Charts */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mb-8">
            {/* Task Completion Trend */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Task Completion Trend
                </h2>
              </div>
              <div className="p-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={taskCompletionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="completed"
                        fill="#10B981"
                        name="Completed"
                      />
                      <Bar dataKey="pending" fill="#F59E0B" name="Pending" />
                      <Bar dataKey="overdue" fill="#EF4444" name="Overdue" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            {/* Department Performance */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Department Performance
                </h2>
              </div>
              <div className="p-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={employeePerformanceData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Bar
                        dataKey="performance"
                        fill="#4F46E5"
                        name="Performance %"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
          {/* Department Distribution and Recent Activity */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    Employee Distribution
                  </h2>
                </div>
                <div className="p-6">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={departmentDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {departmentDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    Top Performers
                  </h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {[
                    {
                      name: 'Jane Cooper',
                      department: 'Engineering',
                      tasks: 45,
                      avatar:
                        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                    },
                    {
                      name: 'Robert Wilson',
                      department: 'Sales',
                      tasks: 42,
                      avatar:
                        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                    },
                    {
                      name: 'Sarah Davis',
                      department: 'Marketing',
                      tasks: 38,
                      avatar:
                        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                    },
                    {
                      name: 'Michael Chen',
                      department: 'Engineering',
                      tasks: 36,
                      avatar:
                        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                    },
                    {
                      name: 'Emily Thompson',
                      department: 'HR',
                      tasks: 34,
                      avatar:
                        'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                    },
                  ].map((performer, idx) => (
                    <div
                      key={idx}
                      className="px-6 py-4 flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <img
                          src={performer.avatar}
                          alt={performer.name}
                          className="h-10 w-10 rounded-full"
                        />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">
                            {performer.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {performer.department}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {performer.tasks} tasks
                        </p>
                        <p className="text-sm text-gray-500">completed</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <NotificationPanel />
    </div>
  )
}
export default Reports
