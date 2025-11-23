// import React from 'react'
// import { CalendarIcon, ClockIcon, UsersIcon, VideoIcon } from 'lucide-react'
// const MeetingsCard = () => {
//   const meetings = [
//     {
//       id: 1,
//       title: 'Weekly Team Standup',
//       time: '10:00 AM - 10:30 AM',
//       participants: 8,
//       type: 'video',
//     },
//     {
//       id: 2,
//       title: 'Project Review',
//       time: '1:00 PM - 2:30 PM',
//       participants: 5,
//       type: 'in-person',
//     },
//     {
//       id: 3,
//       title: 'Client Presentation',
//       time: '3:00 PM - 4:00 PM',
//       participants: 12,
//       type: 'video',
//     },
//   ]
//   return (
//     <div className="bg-white shadow rounded-lg overflow-hidden">
//       <div className="px-6 py-4 border-b border-gray-200">
//         <div className="flex items-center justify-between">
//           <h2 className="text-lg font-medium text-gray-900 flex items-center">
//             <CalendarIcon className="h-5 w-5 mr-2 text-gray-500" />
//             Today's Meetings
//           </h2>
//           <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
//             View All
//           </button>
//         </div>
//       </div>
//       <div className="divide-y divide-gray-200">
//         {meetings.map((meeting) => (
//           <div key={meeting.id} className="px-6 py-4 hover:bg-gray-50">
//             <div className="flex justify-between items-start">
//               <div>
//                 <h3 className="text-sm font-medium text-gray-900">
//                   {meeting.title}
//                 </h3>
//                 <div className="mt-2 flex items-center text-sm text-gray-500">
//                   <ClockIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
//                   <p>{meeting.time}</p>
//                 </div>
//                 <div className="mt-1 flex items-center text-sm text-gray-500">
//                   <UsersIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
//                   <p>{meeting.participants} participants</p>
//                 </div>
//               </div>
//               <span
//                 className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${meeting.type === 'video' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}
//               >
//                 {meeting.type === 'video' ? (
//                   <>
//                     <VideoIcon className="mr-1 h-3 w-3" />
//                     Video
//                   </>
//                 ) : (
//                   'In-person'
//                 )}
//               </span>
//             </div>
//             <div className="mt-3">
//               <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
//                 Join Meeting
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//       <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
//         <button className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
//           Schedule New Meeting
//         </button>
//       </div>
//     </div>
//   )
// }
// export default MeetingsCard



import React from 'react'
import { Calendar, Clock, Users, Video, Plus, MoreHorizontal } from 'lucide-react'

const MeetingsCard = () => {
  const meetings = [
    {
      id: 1,
      title: 'Weekly Team Standup',
      time: '10:00 AM - 10:30 AM',
      participants: 8,
      type: 'video',
      tags: ['Team', 'Weekly']
    },
    {
      id: 2,
      title: 'Project Review: Q3 Roadmap',
      time: '1:00 PM - 2:30 PM',
      participants: 5,
      type: 'in-person',
      tags: ['Strategy']
    },
    {
      id: 3,
      title: 'Client Presentation',
      time: '3:00 PM - 4:00 PM',
      participants: 12,
      type: 'video',
      tags: ['External']
    },
  ]

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <div>
           <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
             <Calendar className="text-blue-600" size={20} />
             Today's Schedule
           </h2>
           <p className="text-sm text-slate-500 mt-1">3 meetings scheduled today</p>
        </div>
        <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
           <MoreHorizontal size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {meetings.map((meeting) => (
          <div key={meeting.id} className="group p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-2">
               <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">{meeting.title}</h3>
               <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${meeting.type === 'video' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {meeting.type === 'video' ? <Video size={12} className="mr-1"/> : <Users size={12} className="mr-1"/>}
                  {meeting.type === 'video' ? 'Video' : 'On-site'}
               </span>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-slate-500 font-medium mb-3">
                <span className="flex items-center gap-1"><Clock size={14}/> {meeting.time}</span>
                <span className="flex items-center gap-1"><Users size={14}/> {meeting.participants} ppl</span>
            </div>

            <div className="flex justify-between items-center">
               <div className="flex gap-2">
                  {meeting.tags?.map(tag => (
                     <span key={tag} className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-500">
                        {tag}
                     </span>
                  ))}
               </div>
               <button className="text-xs font-bold text-blue-600 hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                  Join Details &rarr;
               </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-100">
        <button className="w-full flex justify-center items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20">
          <Plus size={18} /> Schedule Meeting
        </button>
      </div>
    </div>
  )
}

export default MeetingsCard