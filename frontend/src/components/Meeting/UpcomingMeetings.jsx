import React from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  ArrowRight,
  MoreHorizontal,
} from "lucide-react";
import { Link } from "react-router-dom";

const UpcomingMeetings = ({ listView = false, allMeetings }) => {
  const getUpcoming = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return (Array.isArray(allMeetings) ? allMeetings : []).filter(
      (m) => new Date(m.startTime) >= now
    );
  };

  const upcoming = getUpcoming();
  console.log("Upcoming Meetings:", upcoming);
  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const formatTime = (d) =>
    new Date(d).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

  if (listView) {
    return (
      <div className="bg-white w-full">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-800">All Upcoming</h3>
          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold">
            {upcoming.length}
          </span>
        </div>
        <div className="divide-y divide-slate-100">
          {upcoming.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              No upcoming meetings found.
            </div>
          ) : (
            upcoming.map((meeting) => (
              <div
                key={meeting._id}
                className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center justify-center w-12 h-12 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 shrink-0">
                    <span className="text-xs font-bold uppercase">
                      {new Date(meeting.startTime).toLocaleString("default", {
                        month: "short",
                      })}
                    </span>
                    <span className="text-lg font-bold leading-none">
                      {new Date(meeting.startTime).getDate()}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                      {meeting.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {formatTime(meeting.startTime)} -{" "}
                        {formatTime(meeting.endTime)}
                      </span>
                      <span className="flex items-center gap-1">
                        {meeting.meetingType === "Virtual" ? (
                          <Video size={12} />
                        ) : (
                          <MapPin size={12} />
                        )}
                        {meeting.meetingType === "Virtual"
                          ? "Online"
                          : meeting.roomId?.name || "Room"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Avatar Stack */}
                  <div className="flex -space-x-2">
                    {meeting.participants.slice(0, 3).map((p, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600"
                        title={p.firstName}
                      >
                        {p.profileImage ? (
                          <img
                            src={p.profileImage}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs_aMoCDAkVZluRbcd0H1DA9exUnhbXNlzgA&s"
                            className="w-full h-full rounded-full object-cover"
                          />
                        )}
                      </div>
                    ))}
                    {meeting.participants.length > 3 && (
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                        +{meeting.participants.length - 3}
                      </div>
                    )}
                  </div>
                  {meeting.meetingType === "Virtual" ||
                  meeting.meetingType === "Hybrid" ? (
                    <Link
                      to={meeting.virtualLink}
                      target="_blank"
                    >
                      <button className="text-sm font-medium text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                        Join
                      </button>
                    </Link>
                  ) : (
                    <Link to={`/meetings/${meeting._id}`} className="text-sm font-medium text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                      View
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // Widget View (Cards)
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="text-blue-600" size={20} /> Upcoming
        </h2>
        <button className="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1">
          View All <ArrowRight size={14} />
        </button>
      </div>

      <div className="grid gap-4">
        {upcoming.length === 0 ? (
          <div className="p-6 bg-white rounded-xl border border-dashed border-slate-300 text-center text-slate-400 text-sm">
            No meetings scheduled.
          </div>
        ) : (
          upcoming.slice(0, 3).map((meeting) => (
            <div
              key={meeting._id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {meeting.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <Clock size={12} className="text-blue-500" />{" "}
                    {formatDate(meeting.startTime)} •{" "}
                    {formatTime(meeting.startTime)} -{" "}
                    {formatTime(meeting.endTime)}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide ${
                    meeting.meetingType === "Virtual"
                      ? "bg-purple-50 text-purple-700"
                      : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {meeting.meetingType}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex -space-x-2">
                  {meeting.participants.slice(0, 3).map((p, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600"
                      title={p.firstName}
                    >
                      {p.profileImage ? (
                        <img
                          src={p.profileImage}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <img
                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs_aMoCDAkVZluRbcd0H1DA9exUnhbXNlzgA&s"
                          className="w-full h-full rounded-full object-cover"
                        />
                      )}
                    </div>
                  ))}
                  {meeting.participants.length > 3 && (
                    <div className="flex items-center justify-center text-xs font-bold text-slate-500 ml-3">
                      +{meeting.participants.length - 3} more
                    </div>
                  )}
                </div>
                <button className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                  Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UpcomingMeetings;
