import React, { useState } from 'react'
import {
  BellIcon,
  SearchIcon,
  UserIcon,
  PlusIcon,
  CalendarIcon,
  ListIcon,
} from 'lucide-react'
import Sidebar from '@/components/Layout/Sidebar'
import MeetingCalendar from '@/components/Meeting/MeetingCalendar'
import UpcomingMeetings from '@/components/Meeting/UpcomingMeetings'
import MeetingRooms from '@/components/Meeting/MeetingRooms'
const Meeting = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [view, setView] = useState('calendar')
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
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
                      placeholder="Search meetings..."
                      type="search"
                    />
                  </div>
                </div>
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
        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Meetings</h1>
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <button
                  onClick={() => setView('calendar')}
                  className={`inline-flex items-center px-3 py-1.5 border ${view === 'calendar' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'} text-sm font-medium rounded-l-md`}
                >
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  Calendar
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`inline-flex items-center px-3 py-1.5 border ${view === 'list' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'} text-sm font-medium rounded-r-md`}
                >
                  <ListIcon className="h-4 w-4 mr-1" />
                  List
                </button>
              </div>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                <PlusIcon className="h-4 w-4 mr-2" />
                New Meeting
              </button>
            </div>
          </div>
          {/* Calendar or List View */}
          <div className="mb-8">
            {view === 'calendar' ? (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <MeetingCalendar />
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <UpcomingMeetings listView={true} />
              </div>
            )}
          </div>
          {/* Bottom Section */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Upcoming Meetings */}
            <div className="lg:col-span-2">
              {view === 'calendar' && <UpcomingMeetings />}
            </div>
            {/* Meeting Rooms */}
            <div className="lg:col-span-1">
              <MeetingRooms />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
export default Meeting
