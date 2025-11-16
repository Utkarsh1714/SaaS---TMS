import React, { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
const MeetingCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  ).getDate()
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  ).getDay()
  // Generate calendar days
  const days = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push({
      day: '',
      isCurrentMonth: false,
    })
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      day: i,
      isCurrentMonth: true,
    })
  }
  // Fill remaining cells to make a complete grid
  const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7
  for (let i = days.length; i < totalCells; i++) {
    days.push({
      day: '',
      isCurrentMonth: false,
    })
  }
  // Sample meetings data
  const meetings = [
    {
      id: 1,
      title: 'Team Standup',
      day: 5,
      startTime: '9:00 AM',
      endTime: '9:30 AM',
      attendees: 8,
      color: 'bg-blue-100 border-blue-300',
    },
    {
      id: 2,
      title: 'Product Review',
      day: 10,
      startTime: '2:00 PM',
      endTime: '3:30 PM',
      attendees: 12,
      color: 'bg-green-100 border-green-300',
    },
    {
      id: 3,
      title: 'Client Meeting',
      day: 15,
      startTime: '11:00 AM',
      endTime: '12:00 PM',
      attendees: 5,
      color: 'bg-yellow-100 border-yellow-300',
    },
    {
      id: 4,
      title: 'Sprint Planning',
      day: 18,
      startTime: '10:00 AM',
      endTime: '11:30 AM',
      attendees: 10,
      color: 'bg-indigo-100 border-indigo-300',
    },
    {
      id: 5,
      title: 'Design Review',
      day: 22,
      startTime: '1:00 PM',
      endTime: '2:00 PM',
      attendees: 6,
      color: 'bg-purple-100 border-purple-300',
    },
    {
      id: 6,
      title: 'All Hands',
      day: 25,
      startTime: '4:00 PM',
      endTime: '5:00 PM',
      attendees: 28,
      color: 'bg-red-100 border-red-300',
    },
    {
      id: 7,
      title: '1:1 with Manager',
      day: 8,
      startTime: '3:00 PM',
      endTime: '3:30 PM',
      attendees: 2,
      color: 'bg-pink-100 border-pink-300',
    },
    {
      id: 8,
      title: 'Budget Planning',
      day: 12,
      startTime: '10:30 AM',
      endTime: '11:30 AM',
      attendees: 4,
      color: 'bg-green-100 border-green-300',
    },
  ]
  const getMonthName = () => {
    return currentDate.toLocaleString('default', {
      month: 'long',
    })
  }
  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    )
  }
  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    )
  }
  const getMeetingsForDay = (day) => {
    if (!day) return []
    return meetings.filter((meeting) => meeting.day === day)
  }
  return (
    <div>
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">
          {getMonthName()} {currentDate.getFullYear()}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={prevMonth}
            className="inline-flex items-center p-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Today
          </button>
          <button
            onClick={nextMonth}
            className="inline-flex items-center p-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
          <div
            key={i}
            className="bg-gray-50 px-3 py-2 text-center text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
        {days.map((day, i) => {
          const dayMeetings = getMeetingsForDay(day.day)
          const isToday =
            day.isCurrentMonth &&
            new Date().getDate() === day.day &&
            new Date().getMonth() === currentDate.getMonth() &&
            new Date().getFullYear() === currentDate.getFullYear()
          return (
            <div
              key={i}
              className={`min-h-[120px] bg-white p-2 ${day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400 bg-gray-50'} ${isToday ? 'bg-blue-50' : ''}`}
            >
              <div
                className={`text-right ${isToday ? 'font-bold text-blue-600' : ''}`}
              >
                {day.day}
              </div>
              <div className="mt-1 space-y-1 max-h-20 overflow-y-auto">
                {dayMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className={`px-2 py-1 text-xs rounded-md border-l-4 truncate ${meeting.color}`}
                  >
                    <div className="font-medium">{meeting.title}</div>
                    <div>
                      {meeting.startTime} - {meeting.endTime}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
export default MeetingCalendar
