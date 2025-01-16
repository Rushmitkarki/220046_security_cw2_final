import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const navigate = useNavigate();

  const handleButtonClick = () => {
    setIsClicked(!isClicked);
    navigate('/login');
  };

  const location = useLocation();

  // Do not render the Navbar on login, register, admin dashboard, and any update product pages
  if (
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/admin/dashboard" ||
   
    location.pathname ==="/profile"||
    
    location.pathname.match(/^\/admin\/update\/.*/)||
    location.pathname.match(/^\/product\/.*/) ||
    location.pathname.match(/^\/tyre-age-calculator/) ||
    location.pathname.match(/^\/placeorder/) 
    
  ) {
    return null;
  } else {
    return (
      <nav className="bg-red-600 rounded-lg shadow-lg">
        {/* Set background color to rgb(255, 45, 45) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <a href="/" className="text-white text-2xl font-bold">
                  WeWheels
                </a>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <a
                    href="/"
                    className="text-gray-300 hover:bg-zinc-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Home
                  </a>
                  <a
                    href="/about"
                    className="text-gray-300 hover:bg-zinc-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    About Us
                  </a>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <button
                onClick={handleButtonClick}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  isClicked
                    ? "bg-lime-500 text-white"
                    : "bg-white text-red-600 hover:bg-red-600 hover:text-lime-500 hover:border-transparent"
                }`}
              >
                Get Started
              </button>
            </div>
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={toggleNavbar}
                className="bg-gray-900 text-gray-400 inline-flex items-center justify-center p-2 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  {isOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className={`${isOpen ? "block" : "hidden"} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="/"
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Home
            </a>
            <a
              href="/about"
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              About Us
            </a>
            <button
              onClick={handleButtonClick}
              className={`block w-full text-left bg-white text-red-600 px-3 py-2 rounded-md text-base font-medium hover:bg-red-600 hover:text-white hover:border-transparent ${
                isClicked ? "bg-red-600 text-white" : ""
              }`}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>
    );
  }
};

export default Navbar;
