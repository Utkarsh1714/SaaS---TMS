import React from 'react'
import {
  CalendarIcon,
  ClockIcon,
  UsersIcon,
  VideoIcon,
  MapPinIcon,
} from 'lucide-react'
const UpcomingMeetings = ({ listView = false }) => {
  const meetings = [
    {
      id: 1,
      title: 'Weekly Team Standup',
      date: 'Today',
      time: '10:00 AM - 10:30 AM',
      participants: [
        {
          name: 'Jane Cooper',
          avatar:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
        {
          name: 'Cody Fisher',
          avatar:
            'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
        {
          name: 'Esther Howard',
          avatar:
            'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
      ],
      totalParticipants: 8,
      location: 'Virtual Meeting',
      type: 'video',
    },
    {
      id: 2,
      title: 'Project Review',
      date: 'Today',
      time: '1:00 PM - 2:30 PM',
      participants: [
        {
          name: 'Jenny Wilson',
          avatar:
            'https://images.unsplash.com/photo-1498551172505-8ee7ad69f235?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
        {
          name: 'Kristin Watson',
          avatar:
            'https://images.unsplash.com/photo-1532417344469-368f9ae6d187?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
      ],
      totalParticipants: 5,
      location: 'Conference Room A',
      type: 'in-person',
    },
    {
      id: 3,
      title: 'Client Presentation',
      date: 'Today',
      time: '3:00 PM - 4:00 PM',
      participants: [
        {
          name: 'Cameron Williamson',
          avatar:
            'https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
        {
          name: 'Michael Johnson',
          avatar:
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
      ],
      totalParticipants: 12,
      location: 'Virtual Meeting',
      type: 'video',
    },
    {
      id: 4,
      title: 'Sprint Planning',
      date: 'Tomorrow',
      time: '10:00 AM - 11:30 AM',
      participants: [
        {
          name: 'Jane Cooper',
          avatar:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
        {
          name: 'Cody Fisher',
          avatar:
            'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
      ],
      totalParticipants: 10,
      location: 'Conference Room B',
      type: 'in-person',
    },
  ]
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900 flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2 text-gray-500" />
            Upcoming Meetings
          </h2>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
            View All
          </button>
        </div>
      </div>
      {listView ? (
        <div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Meeting
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date & Time
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Participants
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Location
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {meetings.map((meeting) => (
                <tr key={meeting.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {meeting.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{meeting.date}</div>
                    <div className="text-sm text-gray-500">{meeting.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex -space-x-2 overflow-hidden">
                      {meeting.participants.map((participant, idx) => (
                        <img
                          key={idx}
                          className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                          src={participant.avatar}
                          alt={participant.name}
                        />
                      ))}
                      {meeting.totalParticipants >
                        meeting.participants.length && (
                        <span className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-200 text-xs font-medium text-gray-700 ring-2 ring-white">
                          +
                          {meeting.totalParticipants -
                            meeting.participants.length}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${meeting.type === 'video' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}
                    >
                      {meeting.type === 'video' ? (
                        <>
                          <VideoIcon className="mr-1 h-3 w-3" />
                          {meeting.location}
                        </>
                      ) : (
                        <>
                          <MapPinIcon className="mr-1 h-3 w-3" />
                          {meeting.location}
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href="#" className="text-blue-600 hover:text-blue-900">
                      Join
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {meetings.map((meeting) => (
            <div key={meeting.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {meeting.title}
                  </h3>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <CalendarIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    <p>{meeting.date}</p>
                  </div>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <ClockIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    <p>{meeting.time}</p>
                  </div>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <UsersIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    <div className="flex items-center">
                      <div className="flex -space-x-2 mr-2">
                        {meeting.participants
                          .slice(0, 3)
                          .map((participant, idx) => (
                            <img
                              key={idx}
                              className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                              src={participant.avatar}
                              alt={participant.name}
                            />
                          ))}
                      </div>
                      {meeting.totalParticipants > 3 && (
                        <span className="text-xs text-gray-500">
                          +{meeting.totalParticipants - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${meeting.type === 'video' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}
                >
                  {meeting.type === 'video' ? (
                    <>
                      <VideoIcon className="mr-1 h-3 w-3" />
                      Virtual
                    </>
                  ) : (
                    <>
                      <MapPinIcon className="mr-1 h-3 w-3" />
                      In-person
                    </>
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
      )}
      {!listView && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            View All Meetings
          </button>
        </div>
      )}
    </div>
  )
}
export default UpcomingMeetings
