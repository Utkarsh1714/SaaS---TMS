import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader, MapPin, Plus, Users, Layers, Wifi, Monitor, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useAuth } from "@/context/AuthContext";

const MeetingRooms = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  const [formData, setFormData] = useState({ name: "", capacity: "", floor: "", amenities: [] });
  const isBoss = user?.role?.name === "Boss" || user?.role?.name === "Manager";

  const fetchRooms = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/room`, { withCredentials: true });
      setRooms(res.data);
    } catch (error) { console.error("Failed to fetch rooms", error); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRooms(); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const toggleAmenity = (amenity) => {
    setFormData((prev) => ({
        ...prev,
        amenities: prev.amenities.includes(amenity) ? prev.amenities.filter(a => a !== amenity) : [...prev.amenities, amenity]
    }));
  }

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/room`, { ...formData, capacity: parseInt(formData.capacity) }, { withCredentials: true });
      toast.success("Room created!");
      setIsOpen(false);
      setFormData({ name: "", capacity: "", floor: "", amenities: [] });
      fetchRooms();
    } catch (error) { toast.error("Failed to create room."); } 
    finally { setIsCreating(false); }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <MapPin className="text-indigo-600" size={20} /> Rooms
        </h2>
        {isBoss && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <button className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded-md transition-colors flex items-center gap-1">
                <Plus size={14} /> Add
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-white rounded-2xl">
              <DialogHeader>
                <DialogTitle>Add Meeting Room</DialogTitle>
                <DialogDescription>Define a new space for collaboration.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateRoom} className="space-y-4 mt-2">
                <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase">Name</label><input name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Conference A" className="w-full p-2 border rounded-md text-sm" required /></div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase">Capacity</label><input type="number" name="capacity" value={formData.capacity} onChange={handleChange} className="w-full p-2 border rounded-md text-sm" required min="1" /></div>
                    <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase">Floor</label><input name="floor" value={formData.floor} onChange={handleChange} className="w-full p-2 border rounded-md text-sm" required /></div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Amenities</label>
                    <div className="flex flex-wrap gap-2">{['WiFi', 'Projector', 'TV', 'Whiteboard'].map(item => (
                        <button key={item} type="button" onClick={() => toggleAmenity(item)} className={`px-3 py-1 text-xs rounded-full border transition-all ${formData.amenities.includes(item) ? 'bg-indigo-100 border-indigo-200 text-indigo-700 font-bold' : 'bg-white border-slate-200 text-slate-600'}`}>{item}</button>
                    ))}</div>
                </div>
                <DialogFooter className="pt-2"><Button type="submit" disabled={isCreating}>{isCreating ? <Loader className="animate-spin h-4 w-4"/> : "Create"}</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 max-h-[550px]">
        {loading ? <div className="flex items-center justify-center h-32"><Loader className="animate-spin text-indigo-500" /></div> : 
        rooms.length === 0 ? <div className="p-8 text-center text-slate-400 text-sm">No rooms added.</div> : (
            rooms.map((room) => (
            <div key={room._id} className="p-4 hover:bg-slate-50 transition-colors group">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">{room.name}</h3>
                        <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1"><Users size={12}/> {room.capacity}</span>
                            <span className="flex items-center gap-1"><Layers size={12}/> {room.floor}</span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                            {room.amenities.map(am => <span key={am} className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] border border-slate-200">{am}</span>)}
                        </div>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <CheckCircle2 size={10} /> Active
                    </span>
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
};

export default MeetingRooms;