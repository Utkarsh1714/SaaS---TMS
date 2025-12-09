// import React from 'react'
// import { MapPinIcon } from 'lucide-react'
// const MeetingRooms = () => {
//   const rooms = [
//     {
//       id: 1,
//       name: 'Conference Room A',
//       capacity: 20,
//       floor: '2nd Floor',
//       status: 'available',
//       nextAvailable: null,
//     },
//     {
//       id: 2,
//       name: 'Conference Room B',
//       capacity: 15,
//       floor: '2nd Floor',
//       status: 'booked',
//       nextAvailable: '2:30 PM',
//     },
//     {
//       id: 3,
//       name: 'Meeting Room 101',
//       capacity: 8,
//       floor: '1st Floor',
//       status: 'available',
//       nextAvailable: null,
//     },
//     {
//       id: 4,
//       name: 'Meeting Room 102',
//       capacity: 6,
//       floor: '1st Floor',
//       status: 'booked',
//       nextAvailable: '4:00 PM',
//     },
//     {
//       id: 5,
//       name: 'Executive Boardroom',
//       capacity: 12,
//       floor: '3rd Floor',
//       status: 'available',
//       nextAvailable: null,
//     },
//   ]
//   return (
//     <div className="bg-white shadow rounded-lg overflow-hidden">
//       <div className="px-6 py-4 border-b border-gray-200">
//         <div className="flex items-center justify-between">
//           <h2 className="text-lg font-medium text-gray-900 flex items-center">
//             <MapPinIcon className="h-5 w-5 mr-2 text-gray-500" />
//             Meeting Rooms
//           </h2>
//           <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
//             View All
//           </button>
//         </div>
//       </div>
//       <div className="divide-y divide-gray-200">
//         {rooms.map((room) => (
//           <div key={room.id} className="px-6 py-4 hover:bg-gray-50">
//             <div className="flex justify-between items-center">
//               <div>
//                 <h3 className="text-sm font-medium text-gray-900">
//                   {room.name}
//                 </h3>
//                 <div className="mt-1 flex items-center text-xs text-gray-500">
//                   <span className="mr-2">Capacity: {room.capacity}</span>
//                   <span>{room.floor}</span>
//                 </div>
//               </div>
//               <span
//                 className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${room.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
//               >
//                 {room.status === 'available'
//                   ? 'Available'
//                   : `Booked until ${room.nextAvailable}`}
//               </span>
//             </div>
//             <div className="mt-3 flex justify-end">
//               <button
//                 className={`text-xs font-medium px-2 py-1 rounded ${room.status === 'available' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-gray-100 text-gray-500 cursor-not-allowed'}`}
//                 disabled={room.status !== 'available'}
//               >
//                 Book Room
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//       <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
//         <button className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
//           Reserve Room
//         </button>
//       </div>
//     </div>
//   )
// }
// export default MeetingRooms



import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Loader,
  MapPinIcon,
  Plus,
  Users,
  Layers,
  Wifi,
  Projector,
  Monitor
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useAuth } from "@/context/AuthContext";

const MeetingRooms = () => {
  const { user } = useAuth();
  
  // Data States
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form States
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    floor: "",
    amenities: [] // For selecting features like Projector, Wifi, etc.
  });

  const isBoss = user?.role?.name === "Boss" || user?.role?.name === "Manager";

  // --- Fetch Rooms ---
  const fetchRooms = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/room`, {
        withCredentials: true,
      });
      console.log(res.data)
      setRooms(res.data);
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // --- Form Handlers ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleAmenity = (amenity) => {
    setFormData((prev) => {
        const amenities = prev.amenities.includes(amenity)
            ? prev.amenities.filter(a => a !== amenity)
            : [...prev.amenities, amenity];
        return { ...prev, amenities };
    });
  }

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/room`,
        {
            ...formData,
            capacity: parseInt(formData.capacity) // Ensure number type
        },
        { withCredentials: true }
      );
      toast.success("Room created successfully!");
      setIsOpen(false);
      setFormData({ name: "", capacity: "", floor: "", amenities: [] });
      fetchRooms(); // Refresh list
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create room.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900 flex items-center">
          <MapPinIcon className="h-5 w-5 mr-2 text-gray-500" />
          Meeting Rooms
        </h2>
        {isBoss && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="h-8 gap-2">
                <Plus className="h-4 w-4" /> Add Room
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-white">
              <DialogHeader>
                <DialogTitle>Add New Room</DialogTitle>
                <DialogDescription>
                  Create a new meeting space for your organization.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleCreateRoom} className="space-y-4 mt-2">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Room Name</label>
                    <input 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        placeholder="e.g. Conference A" 
                        className="w-full p-2 border rounded-md text-sm"
                        required
                    />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Capacity</label>
                        <input 
                            type="number"
                            name="capacity" 
                            value={formData.capacity} 
                            onChange={handleChange} 
                            placeholder="e.g. 10" 
                            className="w-full p-2 border rounded-md text-sm"
                            required
                            min="1"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Floor/Location</label>
                        <input 
                            name="floor" 
                            value={formData.floor} 
                            onChange={handleChange} 
                            placeholder="e.g. 2nd Floor" 
                            className="w-full p-2 border rounded-md text-sm"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Amenities</label>
                    <div className="flex flex-wrap gap-2">
                        {['WiFi', 'Projector', 'Whiteboard', 'Video Conf', 'TV'].map(item => (
                            <button
                                key={item}
                                type="button"
                                onClick={() => toggleAmenity(item)}
                                className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                                    formData.amenities.includes(item) 
                                    ? 'bg-blue-100 border-blue-200 text-blue-700 font-bold' 
                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>

                <DialogFooter className="pt-4">
                  <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isCreating}>
                    {isCreating ? <Loader className="h-4 w-4 animate-spin" /> : "Create Room"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-200 max-h-[400px]">
        {loading ? (
            <div className="flex items-center justify-center h-32">
                <Loader className="h-6 w-6 animate-spin text-blue-500" />
            </div>
        ) : rooms.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">No rooms available.</div>
        ) : (
            rooms.map((room) => (
            <div key={room._id} className="px-6 py-4 hover:bg-gray-50 group">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                           {room.name}
                        </h3>
                        <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1"><Users size={12}/> {room.capacity} Seats</span>
                            <span className="flex items-center gap-1"><Layers size={12}/> {room.floor}</span>
                        </div>
                        {/* Amenities Badges */}
                        {room.amenities?.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                                {room.amenities.map(am => (
                                    <span key={am} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px]">{am}</span>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* Status Badge (Static for now, dynamic requires checking meetings) */}
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Active
                    </span>
                </div>
            </div>
            ))
        )}
      </div>
      
      {/* Footer Action */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 mt-auto">
        <Button variant="outline" className="w-full border-dashed text-gray-500 hover:text-blue-600 hover:border-blue-300">
            View Availability Calendar
        </Button>
      </div>
    </div>
  );
};

export default MeetingRooms;