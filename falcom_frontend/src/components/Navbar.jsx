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
    navigate("/login");
  };

  const location = useLocation();

  // Do not render the Navbar on certain pages
  if (
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/admin/dashboard" ||
    location.pathname === "/profile" ||
    location.pathname.match(/^\/admin\/update\/.*/) ||
    location.pathname.match(/^\/product\/.*/) ||
    location.pathname.match(/^\/tyre-age-calculator/) ||
    location.pathname.match(/^\/placeorder/)
  ) {
    return null;
  } else {
    return (
      <nav className="bg-white rounded-lg shadow-lg">
        {/* Set background color to white and text color to black */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <a href="/" className="text-black text-2xl font-bold">
                  falcom
                </a>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <a
                    href="/"
                    className="text-black hover:bg-gray-200 hover:text-black px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Home
                  </a>
                  <a
                    href="/about"
                    className="text-black hover:bg-gray-200 hover:text-black px-3 py-2 rounded-md text-sm font-medium"
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
                    ? "bg-gray-800 text-white"
                    : "bg-black text-white hover:bg-gray-800 hover:text-white"
                }`}
              >
                Get Started
              </button>
            </div>
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={toggleNavbar}
                className="bg-gray-200 text-black inline-flex items-center justify-center p-2 rounded-md hover:text-black hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-200 focus:ring-black"
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
              className="text-black hover:bg-gray-200 hover:text-black block px-3 py-2 rounded-md text-base font-medium"
            >
              Home
            </a>
            <a
              href="/about"
              className="text-black hover:bg-gray-200 hover:text-black block px-3 py-2 rounded-md text-base font-medium"
            >
              About Us
            </a>
            <button
              onClick={handleButtonClick}
              className={`block w-full text-left bg-black text-white px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800 hover:text-white ${
                isClicked ? "bg-gray-800 text-white" : ""
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
