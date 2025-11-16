import React, { useState } from 'react'
import {
  BellIcon,
  SearchIcon,
  UserIcon,
  MessageCircleIcon,
  BookOpenIcon,
  VideoIcon,
  MailIcon,
  PhoneIcon,
} from 'lucide-react'
import Sidebar from '@/components/Layout/Sidebar'
const HelpSupportPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h7"
                    />
                  </svg>
                </button>
                <div className="ml-4 flex items-center lg:ml-0">
                  <h1 className="text-lg font-medium text-gray-900">
                    Help & Support
                  </h1>
                </div>
              </div>
              <div className="flex items-center">
                <button className="flex-shrink-0 p-1 mr-4 text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" />
                </button>
                <div className="ml-3 relative">
                  <div>
                    <button className="flex items-center max-w-xs bg-gray-100 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <span className="sr-only">Open user menu</span>
                      <UserIcon className="h-8 w-8 rounded-full p-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search for help articles, guides, or FAQs..."
              />
            </div>
          </div>
          {/* Quick Actions */}
          <div className="max-w-7xl mx-auto mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              How can we help you?
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <button className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600 mb-4">
                  <BookOpenIcon className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-medium text-gray-900">
                  Documentation
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Browse our comprehensive guides and tutorials
                </p>
              </button>
              <button className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-600 mb-4">
                  <VideoIcon className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-medium text-gray-900">
                  Video Tutorials
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Watch step-by-step video guides
                </p>
              </button>
              <button className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-100 text-purple-600 mb-4">
                  <MessageCircleIcon className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-medium text-gray-900">Live Chat</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Chat with our support team
                </p>
              </button>
              <button className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-yellow-100 text-yellow-600 mb-4">
                  <MailIcon className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-medium text-gray-900">
                  Email Support
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Send us a detailed message
                </p>
              </button>
            </div>
          </div>
          {/* Popular Articles */}
          <div className="max-w-7xl mx-auto mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Popular Articles
            </h2>
            <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
              {[
                {
                  title: 'Getting Started with WorkSpace',
                  category: 'Getting Started',
                  views: 1234,
                },
                {
                  title: 'How to Create and Manage Tasks',
                  category: 'Tasks',
                  views: 987,
                },
                {
                  title: 'Setting Up Your Team',
                  category: 'Teams',
                  views: 856,
                },
                {
                  title: 'Managing Departments and Employees',
                  category: 'Organization',
                  views: 743,
                },
                {
                  title: 'Scheduling and Managing Meetings',
                  category: 'Meetings',
                  views: 621,
                },
                {
                  title: 'Using the Messaging System',
                  category: 'Communication',
                  views: 589,
                },
              ].map((article, idx) => (
                <button
                  key={idx}
                  className="w-full px-6 py-4 hover:bg-gray-50 text-left flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {article.category}
                    </p>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    {article.views}
                  </div>
                </button>
              ))}
            </div>
          </div>
          {/* FAQs */}
          <div className="max-w-7xl mx-auto mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
              {[
                {
                  question: 'How do I add new team members?',
                  answer:
                    'Navigate to the Employees page and click the "Add Employee" button. Fill in the required information and assign them to the appropriate department.',
                },
                {
                  question: 'Can I customize my dashboard?',
                  answer:
                    'Yes, you can customize your dashboard by clicking on the Settings icon and selecting Dashboard Preferences. You can choose which widgets to display and their arrangement.',
                },
                {
                  question: 'How do I export reports?',
                  answer:
                    'Go to the Reports page, select your desired filters and date range, then click the "Export Report" button in the top right corner. You can export in PDF, Excel, or CSV formats.',
                },
                {
                  question: 'What are the different subscription plans?',
                  answer:
                    'We offer three plans: Starter ($12/user/month), Professional ($29/user/month), and Enterprise ($79/user/month). Visit our Pricing page for detailed feature comparisons.',
                },
              ].map((faq, idx) => (
                <div key={idx} className="px-6 py-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-sm text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Contact Support */}
          <div className="max-w-7xl mx-auto">
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-blue-900">
                    Still need help?
                  </h3>
                  <div className="mt-2 text-sm text-blue-800">
                    <p>Our support team is available 24/7 to assist you.</p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-4">
                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                      <MessageCircleIcon className="h-4 w-4 mr-2" />
                      Start Live Chat
                    </button>
                    <button className="inline-flex items-center px-4 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50">
                      <MailIcon className="h-4 w-4 mr-2" />
                      Email Support
                    </button>
                    <button className="inline-flex items-center px-4 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50">
                      <PhoneIcon className="h-4 w-4 mr-2" />
                      Call Us
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
export default HelpSupportPage
