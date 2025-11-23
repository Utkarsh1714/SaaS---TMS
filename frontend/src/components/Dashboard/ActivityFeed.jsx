// import React from 'react'
// import { ActivityIcon } from 'lucide-react'
// const ActivityFeed = () => {
//   const activities = [
//     {
//       id: 1,
//       user: {
//         name: 'Jane Cooper',
//         imageUrl:
//           'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
//       },
//       action: 'completed',
//       target: 'Frontend Development task',
//       time: '2 hours ago',
//       icon: 'task',
//     },
//     {
//       id: 2,
//       user: {
//         name: 'Cody Fisher',
//         imageUrl:
//           'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
//       },
//       action: 'commented on',
//       target: 'Project Requirements document',
//       time: '3 hours ago',
//       icon: 'comment',
//     },
//     {
//       id: 3,
//       user: {
//         name: 'Esther Howard',
//         imageUrl:
//           'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
//       },
//       action: 'created',
//       target: 'New Marketing Campaign',
//       time: '5 hours ago',
//       icon: 'create',
//     },
//     {
//       id: 4,
//       user: {
//         name: 'Jenny Wilson',
//         imageUrl:
//           'https://images.unsplash.com/photo-1498551172505-8ee7ad69f235?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
//       },
//       action: 'uploaded',
//       target: 'Design Mockups',
//       time: '1 day ago',
//       icon: 'upload',
//     },
//     {
//       id: 5,
//       user: {
//         name: 'Kristin Watson',
//         imageUrl:
//           'https://images.unsplash.com/photo-1532417344469-368f9ae6d187?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
//       },
//       action: 'assigned',
//       target: 'HR Policy Review task to Michael',
//       time: '1 day ago',
//       icon: 'assign',
//     },
//   ]
//   const getActivityIcon = (iconType) => {
//     switch (iconType) {
//       case 'task':
//         return (
//           <span className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
//             <svg
//               className="h-5 w-5 text-green-600"
//               fill="currentColor"
//               viewBox="0 0 20 20"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                 clipRule="evenodd"
//               />
//             </svg>
//           </span>
//         )
//       case 'comment':
//         return (
//           <span className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
//             <svg
//               className="h-5 w-5 text-blue-600"
//               fill="currentColor"
//               viewBox="0 0 20 20"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
//                 clipRule="evenodd"
//               />
//             </svg>
//           </span>
//         )
//       case 'create':
//         return (
//           <span className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
//             <svg
//               className="h-5 w-5 text-indigo-600"
//               fill="currentColor"
//               viewBox="0 0 20 20"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
//                 clipRule="evenodd"
//               />
//             </svg>
//           </span>
//         )
//       case 'upload':
//         return (
//           <span className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
//             <svg
//               className="h-5 w-5 text-yellow-600"
//               fill="currentColor"
//               viewBox="0 0 20 20"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
//                 clipRule="evenodd"
//               />
//             </svg>
//           </span>
//         )
//       case 'assign':
//         return (
//           <span className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
//             <svg
//               className="h-5 w-5 text-purple-600"
//               fill="currentColor"
//               viewBox="0 0 20 20"
//             >
//               <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
//             </svg>
//           </span>
//         )
//       default:
//         return (
//           <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
//             <svg
//               className="h-5 w-5 text-gray-600"
//               fill="currentColor"
//               viewBox="0 0 20 20"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
//                 clipRule="evenodd"
//               />
//             </svg>
//           </span>
//         )
//     }
//   }
//   return (
//     <div className="bg-white shadow rounded-lg overflow-hidden">
//       <div className="px-6 py-4 border-b border-gray-200">
//         <div className="flex items-center justify-between">
//           <h2 className="text-lg font-medium text-gray-900 flex items-center">
//             <ActivityIcon className="h-5 w-5 mr-2 text-gray-500" />
//             Recent Activity
//           </h2>
//           <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
//             View All
//           </button>
//         </div>
//       </div>
//       <div className="flow-root">
//         <ul className="-mb-8">
//           {activities.map((activity, activityIdx) => (
//             <li key={activity.id}>
//               <div className="relative pb-8 py-4">
//                 {activityIdx !== activities.length - 1 ? (
//                   <span
//                     className="absolute top-4 left-4 ml-4 h-full w-0.5 bg-gray-200"
//                     aria-hidden="true"
//                   />
//                 ) : null}
//                 <div className="relative flex space-x-3 px-4">
//                   <div>{getActivityIcon(activity.icon)}</div>
//                   <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
//                     <div>
//                       <p className="text-sm text-gray-500">
//                         <span className="font-medium text-gray-900">
//                           {activity.user.name}
//                         </span>{' '}
//                         {activity.action}{' '}
//                         <span className="font-medium text-gray-900">
//                           {activity.target}
//                         </span>
//                       </p>
//                     </div>
//                     <div className="text-right text-xs whitespace-nowrap text-gray-500">
//                       <time>{activity.time}</time>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>
//       <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-center">
//         <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
//           Load more activities
//         </button>
//       </div>
//     </div>
//   )
// }
// export default ActivityFeed




import React from 'react'
import { Activity, CheckCircle2, FileText, MessageSquare, UserPlus, UploadCloud } from 'lucide-react'

const ActivityFeed = () => {
  // Mock Data (Ideally fetched from API)
  const activities = [
    { id: 1, user: 'Jane Cooper', action: 'completed task', target: 'Frontend Dev', time: '2h ago', type: 'complete' },
    { id: 2, user: 'Cody Fisher', action: 'commented on', target: 'Project Requirements', time: '3h ago', type: 'comment' },
    { id: 3, user: 'Esther Howard', action: 'created task', target: 'Marketing Campaign', time: '5h ago', type: 'create' },
    { id: 4, user: 'Jenny Wilson', action: 'uploaded file', target: 'Design Mockups', time: '1d ago', type: 'upload' },
    { id: 5, user: 'Kristin Watson', action: 'assigned', target: 'Michael to HR Policy', time: '1d ago', type: 'assign' },
  ];

  const getIcon = (type) => {
    switch (type) {
      case 'complete': return <CheckCircle2 size={16} className="text-emerald-600" />;
      case 'comment': return <MessageSquare size={16} className="text-blue-600" />;
      case 'create': return <FileText size={16} className="text-indigo-600" />;
      case 'upload': return <UploadCloud size={16} className="text-amber-600" />;
      case 'assign': return <UserPlus size={16} className="text-purple-600" />;
      default: return <Activity size={16} className="text-slate-500" />;
    }
  };

  const getBg = (type) => {
    switch (type) {
      case 'complete': return 'bg-emerald-100';
      case 'comment': return 'bg-blue-100';
      case 'create': return 'bg-indigo-100';
      case 'upload': return 'bg-amber-100';
      case 'assign': return 'bg-purple-100';
      default: return 'bg-slate-100';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Activity className="text-blue-600" size={20} />
          Recent Activity
        </h2>
      </div>

      <div className="p-6">
        <div className="relative">
           {/* Vertical Timeline Line */}
           <div className="absolute top-0 bottom-0 left-5 w-px bg-slate-200"></div>

           <ul className="space-y-8 relative">
             {activities.map((item) => (
               <li key={item.id} className="flex gap-4 relative">
                 {/* Icon Bubble */}
                 <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-4 border-white ${getBg(item.type)}`}>
                    {getIcon(item.type)}
                 </div>
                 
                 {/* Content */}
                 <div className="flex-1 pt-1">
                    <p className="text-sm text-slate-600">
                       <span className="font-bold text-slate-900">{item.user}</span> {item.action} <span className="font-medium text-blue-600 hover:underline cursor-pointer">{item.target}</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{item.time}</p>
                 </div>
               </li>
             ))}
           </ul>
        </div>
      </div>
      
      <div className="p-4 border-t border-slate-100 text-center">
         <button className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors">
            View Full History
         </button>
      </div>
    </div>
  )
}

export default ActivityFeed