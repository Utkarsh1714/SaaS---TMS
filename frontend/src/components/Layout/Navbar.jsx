import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MenuIcon, XIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleHomeClick = (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
    } else {
      navigate("/");
    }
  };

  // Function to close the menu on link click in mobile view
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-blue-600">Taskify</h1>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <a
                href="/dashboard"
                onClick={handleHomeClick}
                className="border-transparent text-gray-500 hover:border-blue-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Home
              </a>
              <a
                href="/plans"
                className="border-transparent text-gray-500 hover:border-blue-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Pricing
              </a>
              <a
                href="#about"
                className="border-transparent text-gray-500 hover:border-blue-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                About
              </a>
            </div>
          </div>
          <div className="hidden md:ml-6 md:flex md:items-center">
            {user ? (
              <Link
                to="/profile"
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Profile
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign in
                </Link>
                <Link
                  to="/registration"
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <XIcon className="block h-6 w-6" />
              ) : (
                <MenuIcon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop for the mobile menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      {/* Mobile menu - sliding panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full bg-white shadow-xl transition-transform duration-300 ease-in-out z-50 transform 
                ${isMenuOpen ? "translate-x-0" : "translate-x-full"} md:hidden`}
      >
        <div className="flex justify-between p-4">
          <div className="p-3">
            <h1 className="text-2xl font-bold text-blue-500">Taskify</h1>
          </div>
          <div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md focus:outline-none"
            >
              <XIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
        <div className="flex flex-col px-4 space-y-4">
          <a
            href="/dashboard"
            onClick={(e) => {
              handleHomeClick(e);
              handleLinkClick();
            }}
            className="block px-3 py-2 text-xl font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-800 rounded-md"
          >
            Home
          </a>
          <a
            href="/plans"
            onClick={handleLinkClick}
            className="block px-3 py-2 text-xl font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-800 rounded-md"
          >
            Pricing
          </a>
          <a
            href="#about"
            onClick={handleLinkClick}
            className="block px-3 py-2 text-xl font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-800 rounded-md"
          >
            About
          </a>
        </div>
        <div className="border-t border-gray-200 mt-4 pt-4 px-4 space-y-2">
          {user ? (
            <Link
              to="/profile"
              onClick={handleLinkClick}
              className="block px-3 py-2 text-xl font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-md"
            >
              Profile
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                onClick={handleLinkClick}
                className="block px-3 py-2 text-xl font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-md"
              >
                Sign in
              </Link>
              <Link
                to="/registration"
                onClick={handleLinkClick}
                className="block px-3 py-2 text-xl font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-md"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
