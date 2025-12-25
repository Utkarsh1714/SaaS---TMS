import React, { useEffect, useState } from "react";
import { Calendar, Clock, Video, MapPin, Plus, ArrowRight } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";

const MeetingsCard = () => {
  const user = useAuth();

  const [todayMeetings, setTodayMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const getTodayMeetings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/meeting?startDate=${todayStart.toISOString()}&endDate=${todayEnd.toISOString()}`,
        { withCredentials: true }
      );
      setTodayMeetings(res.data);
    } catch (error) {
      console.error("Error fetching meetings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTodayMeetings();
  }, []);

  // Helper to get initials from First and Last name
  const getInitials = (first, last) => {
    const f = first ? first.charAt(0) : "";
    const l = last ? last.charAt(0) : "";
    return (f + l).toUpperCase() || "?";
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="text-blue-600" size={20} />
            Today's Schedule
          </h2>
          <p className="text-xs font-medium text-slate-500 mt-1">
            {todayMeetings.length} sessions scheduled
          </p>
        </div>
        <Link to="/meetings">
          <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-slate-400 hover:text-blue-600 transition-all border border-transparent hover:border-slate-200">
            <ArrowRight size={18} />
          </button>
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="w-16 h-16 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="w-3/4 h-4 rounded" />
                  <Skeleton className="w-1/2 h-3 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : todayMeetings.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-10">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3 border border-slate-100">
              <Calendar className="text-slate-300" size={32} />
            </div>
            <p className="text-slate-900 font-medium">No meetings today</p>
            <p className="text-slate-500 text-xs mb-4 max-w-[200px]">
              Your schedule is clear. Enjoy your focus time!
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-[59px] top-4 bottom-4 w-0.5 bg-slate-100"></div>

            <div className="space-y-6">
              {todayMeetings.map((meeting) => (
                <div key={meeting._id} className="relative flex group">
                  {/* Time Column */}
                  <div className="flex flex-col items-end mr-4 w-[45px] shrink-0">
                    <span className="text-xs font-bold text-slate-900">
                      {new Date(meeting.startTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {new Date(meeting.endTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </span>
                  </div>

                  {/* Timeline Dot */}
                  <div
                    className={`absolute left-[55px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm z-10 ${
                      meeting.status === "Completed"
                        ? "bg-slate-300"
                        : "bg-blue-500"
                    }`}
                  ></div>

                  {/* Card */}
                  <div className="flex-1 bg-white border border-slate-200 rounded-xl p-3 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group-hover:translate-x-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                        {meeting.title}
                      </h3>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide border ${
                          meeting.meetingType === "Virtual"
                            ? "bg-purple-50 text-purple-700 border-purple-100"
                            : "bg-emerald-50 text-emerald-700 border-emerald-100"
                        }`}
                      >
                        {meeting.meetingType === "Virtual" ? "Zoom" : "Room"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                      {meeting.meetingType === "Virtual" ? (
                        <Video size={12} />
                      ) : (
                        <MapPin size={12} />
                      )}
                      <span className="truncate max-w-[140px]">
                        {meeting.meetingType === "Virtual"
                          ? "Online Meeting"
                          : meeting.roomId?.name || "Conference Room"}
                      </span>
                    </div>

                    {/* Footer: Avatars + Action */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                      <div className="flex -space-x-1.5">
                        {/* Updated Participant Mapping */}
                        {meeting.participants &&
                          meeting.participants.slice(0, 3).map((p, i) => (
                            <div
                              key={i}
                              className="w-6 h-6 rounded-full bg-slate-100 border border-white flex items-center justify-center text-[8px] font-bold text-slate-600 cursor-help"
                              title={`${p.firstName} ${p.lastName}`} // Tooltip shows full name
                            >
                              {p.profileImage ? (
                                <img
                                  src={p.profileImage}
                                  alt={p.firstName}
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                getInitials(p.firstName, p.lastName)
                              )}
                            </div>
                          ))}
                        {(meeting.participants?.length || 0) > 3 && (
                          <div className="w-6 h-6 rounded-full bg-slate-50 border border-white flex items-center justify-center text-[8px] font-bold text-slate-400">
                            +{meeting.participants.length - 3}
                          </div>
                        )}
                      </div>

                      {meeting.meetingType === "Virtual" && (
                        <button className="text-[10px] font-bold bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                          Join
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {user.role !== "Boss" || user.role !== "Manager" ? (
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <Link to="/meetings">
            <button className="w-full flex justify-center items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 shadow-sm text-xs font-bold uppercase tracking-wider rounded-xl text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all">
              <Plus size={16} /> Schedule New
            </button>
          </Link>
        </div>
      ) : (
        <>M</>
      )}
    </div>
  );
};

export default MeetingsCard;
