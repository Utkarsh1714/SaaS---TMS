import React from 'react'
import { MapPinIcon } from 'lucide-react'
const MeetingRooms = () => {
  const rooms = [
    {
      id: 1,
      name: 'Conference Room A',
      capacity: 20,
      floor: '2nd Floor',
      status: 'available',
      nextAvailable: null,
    },
    {
      id: 2,
      name: 'Conference Room B',
      capacity: 15,
      floor: '2nd Floor',
      status: 'booked',
      nextAvailable: '2:30 PM',
    },
    {
      id: 3,
      name: 'Meeting Room 101',
      capacity: 8,
      floor: '1st Floor',
      status: 'available',
      nextAvailable: null,
    },
    {
      id: 4,
      name: 'Meeting Room 102',
      capacity: 6,
      floor: '1st Floor',
      status: 'booked',
      nextAvailable: '4:00 PM',
    },
    {
      id: 5,
      name: 'Executive Boardroom',
      capacity: 12,
      floor: '3rd Floor',
      status: 'available',
      nextAvailable: null,
    },
  ]
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900 flex items-center">
            <MapPinIcon className="h-5 w-5 mr-2 text-gray-500" />
            Meeting Rooms
          </h2>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
            View All
          </button>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {rooms.map((room) => (
          <div key={room.id} className="px-6 py-4 hover:bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {room.name}
                </h3>
                <div className="mt-1 flex items-center text-xs text-gray-500">
                  <span className="mr-2">Capacity: {room.capacity}</span>
                  <span>{room.floor}</span>
                </div>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${room.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
              >
                {room.status === 'available'
                  ? 'Available'
                  : `Booked until ${room.nextAvailable}`}
              </span>
            </div>
            <div className="mt-3 flex justify-end">
              <button
                className={`text-xs font-medium px-2 py-1 rounded ${room.status === 'available' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-gray-100 text-gray-500 cursor-not-allowed'}`}
                disabled={room.status !== 'available'}
              >
                Book Room
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <button className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          Reserve Room
        </button>
      </div>
    </div>
  )
}
export default MeetingRooms
