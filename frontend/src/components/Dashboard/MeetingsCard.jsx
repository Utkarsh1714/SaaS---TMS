import React from 'react'
import { CalendarIcon, ClockIcon, UsersIcon, VideoIcon } from 'lucide-react'
const MeetingsCard = () => {
  const meetings = [
    {
      id: 1,
      title: 'Weekly Team Standup',
      time: '10:00 AM - 10:30 AM',
      participants: 8,
      type: 'video',
    },
    {
      id: 2,
      title: 'Project Review',
      time: '1:00 PM - 2:30 PM',
      participants: 5,
      type: 'in-person',
    },
    {
      id: 3,
      title: 'Client Presentation',
      time: '3:00 PM - 4:00 PM',
      participants: 12,
      type: 'video',
    },
  ]
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900 flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2 text-gray-500" />
            Today's Meetings
          </h2>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
            View All
          </button>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {meetings.map((meeting) => (
          <div key={meeting.id} className="px-6 py-4 hover:bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {meeting.title}
                </h3>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <ClockIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                  <p>{meeting.time}</p>
                </div>
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <UsersIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                  <p>{meeting.participants} participants</p>
                </div>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${meeting.type === 'video' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}
              >
                {meeting.type === 'video' ? (
                  <>
                    <VideoIcon className="mr-1 h-3 w-3" />
                    Video
                  </>
                ) : (
                  'In-person'
                )}
              </span>
            </div>
            <div className="mt-3">
              <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Join Meeting
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <button className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          Schedule New Meeting
        </button>
      </div>
    </div>
  )
}
export default MeetingsCard
