import { Link } from "react-router-dom";
import {
  BarChartIcon,
  CalendarIcon,
  MessageSquareIcon,
  UsersIcon,
  ClipboardCheckIcon,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                All-in-one workspace for your organization
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Manage tasks, departments, employees, meetings, and
                communications all in one place with our powerful SaaS platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="bg-white text-blue-700 hover:bg-blue-50 font-medium px-6 py-3 rounded-lg text-center"
                >
                  Start for free
                </Link>
                <Link
                  to="/login"
                  className="bg-blue-800 text-white hover:bg-blue-900 font-medium px-6 py-3 rounded-lg text-center"
                >
                  Sign in
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Dashboard preview"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to run your organization
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform provides all the tools you need to manage your
              company efficiently in one place.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<ClipboardCheckIcon size={24} />}
              title="Task Management"
              description="Create, assign and track tasks across teams and departments with ease."
            />
            <FeatureCard
              icon={<UsersIcon size={24} />}
              title="Employee Management"
              description="Keep track of all employee information, roles, and performance metrics."
            />
            <FeatureCard
              icon={<CalendarIcon size={24} />}
              title="Meeting Scheduler"
              description="Schedule and manage meetings with intelligent conflict detection."
            />
            <FeatureCard
              icon={<MessageSquareIcon size={24} />}
              title="Team Chat"
              description="Real-time messaging for teams and departments to collaborate effectively."
            />
            <FeatureCard
              icon={<BarChartIcon size={24} />}
              title="Advanced Analytics"
              description="Generate insightful reports and visualize data to make informed decisions."
            />
            <FeatureCard
              icon={<UsersIcon size={24} />}
              title="Department Management"
              description="Organize your company structure and manage departments efficiently."
            />
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by companies worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what our customers have to say about our platform.
            </p>
          </div>
          <div className="h-[20rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
            <InfiniteMovingCards
              items={testimonials}
              direction="right"
              speed="slow"
            />
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to transform your organization?
          </h2>
          <p className="text-xl mb-10 text-blue-100 max-w-3xl mx-auto">
            Join thousands of companies already using our platform to improve
            productivity and management.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="bg-white text-blue-700 hover:bg-blue-50 font-medium px-8 py-3 rounded-lg"
            >
              Get started for free
            </Link>
            <Link
              to="/login"
              className="bg-blue-800 text-white hover:bg-blue-900 font-medium px-8 py-3 rounded-lg"
            >
              Schedule a demo
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

const testimonials = [
    {
        quote: "This platform has transformed how we manage our teams and projects. Everything is now streamlined and efficient.",
        name: "Utkarsh Palav",
        title: "CEO, TechCorp",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
    },
    {
        quote: "The analytics and reporting features have given us insights we never had before. Game-changing for our decision making.",
        name: "Sairaj Shetty",
        title: "COO, InnovateCo",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
    },
    {
        quote: "Employee engagement has increased significantly since we started using the platform. The chat and meeting features are excellent.",
        name: "Vivek Singh Rawat",
        title: "HR Director, GlobalFirm",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
    },
    {
        quote: "Managing our departments and employees has never been easier. This platform is a must-have for any growing business.",
        name: "Abhishek Sharma",
        title: "CTO, StartupX",
        image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
    },
    {
        quote: "The task management features have improved our team's productivity and collaboration. Highly recommend!",
        name: "Shraddha Singh",
        title: "Project Manager, BuildIt",
        image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
    }
]

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl hover:scale-3d transition-shadow duration-300">
      <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center text-blue-600 mb-5">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default LandingPage;
