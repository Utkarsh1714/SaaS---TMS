import React, { useEffect, useState } from "react";
import {
  Activity,
  CheckCircle2,
  FileText,
  MessageSquare,
  UserPlus,
  UploadCloud,
  Plus,
  Trash2,
  Calendar,
  Edit3,
} from "lucide-react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/activities`,
        { withCredentials: true }
      );
      console.log(res.data)
      setActivities(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (action, module) => {
    if (action === "CREATE")
      return <Plus size={14} className="text-emerald-600" />;
    if (action === "DELETE")
      return <Trash2 size={14} className="text-rose-600" />;
    if (module === "Meeting")
      return <Calendar size={14} className="text-purple-600" />;
    if (module === "Employee")
      return <UserPlus size={14} className="text-blue-600" />;
    return <Edit3 size={14} className="text-amber-600" />;
  };

  // Mock Data (Ideally fetched from API)
  const activitiess = [
    {
      id: 1,
      user: "Jane Cooper",
      action: "completed task",
      target: "Frontend Dev",
      time: "2h ago",
      type: "complete",
    },
    {
      id: 2,
      user: "Cody Fisher",
      action: "commented on",
      target: "Project Requirements",
      time: "3h ago",
      type: "comment",
    },
    {
      id: 3,
      user: "Esther Howard",
      action: "created task",
      target: "Marketing Campaign",
      time: "5h ago",
      type: "create",
    },
    {
      id: 4,
      user: "Jenny Wilson",
      action: "uploaded file",
      target: "Design Mockups",
      time: "1d ago",
      type: "upload",
    },
    {
      id: 5,
      user: "Kristin Watson",
      action: "assigned",
      target: "Michael to HR Policy",
      time: "1d ago",
      type: "assign",
    },
  ];

  const getBgColor = (action, module) => {
    if (action === "CREATE") return "bg-emerald-100 border-emerald-200";
    if (action === "DELETE") return "bg-rose-100 border-rose-200";
    if (module === "Meeting") return "bg-purple-100 border-purple-200";
    if (module === "Employee") return "bg-blue-100 border-blue-200";
    return "bg-amber-100 border-amber-200";
  };

  if (loading) return <div className="p-4 text-center text-sm text-slate-500">Loading activity...</div>;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full max-h-[500px]">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 relative">
        {/* Timeline Line */}
        <div className="absolute left-[42px] top-6 bottom-6 w-0.5 bg-slate-100"></div>

        <div className="space-y-6">
          {activities.length === 0 ? (
             <p className="text-center text-slate-400 text-sm">No recent activity.</p>
          ) : activities.map((log) => (
            <div key={log._id} className="relative flex gap-4 group">
              {/* Icon Bubble */}
              <div className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center border-2 border-white shadow-sm shrink-0 ${getBgColor(log.action, log.module)}`}>
                {getIcon(log.action, log.module)}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                   <p className="text-sm text-slate-900">
                      <span className="font-bold">{log.user?.firstName}</span>{" "}
                      <span className="text-slate-600">{log.description}</span>
                   </p>
                   <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                      {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                   </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 uppercase tracking-wide font-medium">
                   {log.module} • {log.action}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;
